<script>
  import {
    CustomeEntityDTO,
    CustomEntitiesApi,
    FormApi,
    FormDTO,
    OptionSetDefinitionDTO,
    OptionSetDefinitionsApi,
  } from "@apiclients";
  import { alertError, alertSuccsess, assignLoader } from "@utils/uiutils";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import {
    Button,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
  } from "@sveltestrap/sveltestrap";
  import QueryBuilder from "../../../components/QueryBuilder/queryBuilder.svelte";
  import { ConditionGroup } from "../../../components/QueryBuilder/typeDefinitions";
  import { convertToOdataFilter } from "../../../components/QueryBuilder/queryToOdataUrlParams";
  import DataTable from "../../../components/DataTable/dataTable.svelte";

  /** @type {string | null} */
  let selectedEntityId = $state(null);

  /** @type {FormDTO[]} */
  let forms = $state([]);

  /** @type {string | null} */
  let selectedFormId = $state(null);

  /** @type {string | null } */
  let editedEntityId = $state(null);

  /** @type {CustomeEntityDTO[]} */
  let customEntities = $state([]);
  let odataMetaUrl = "/api/odata/$metadata";
  let namespace = "CustomEntitiesDbContext";
  let rootQuery = new ConditionGroup("and", []);

  /** @type {any} */
  let odataSchema;
  let loadCustomEntities = () => {
    let api = new CustomEntitiesApi();
    api.apiCustomEntitiesGet(
      (
        /** @type {string} */ error,
        /** @type {CustomeEntityDTO[]} */ elems,
      ) => {
        if (error) {
          handleError(error);
        } else if (elems) {
          customEntities = elems;
        }
      },
    );
  };

  const loadForms = async () => {
    const api = new FormApi();
    forms = await new Promise((res) => {
      const callback = (
        /** @type {string} */ error,
        /** @type {FormDTO[]} */ retrievedForms,
      ) => {
        if (retrievedForms) {
          res(retrievedForms);
          return;
        }
        if (error) {
          alertError("Error while retrieving forms: " + error);
        }
        res([]);
      };
      api.apiFormGet(callback);
    });
  };

  /** @param {string} error */
  let handleError = (error) => {
    console.error(error);
    alertError("Error occurred: " + error);
  };

  /** @type {OptionSetDefinitionDTO[]} */
  let optionSetDefinitions = $state([]);
  let loadOptionSets = () => {
    let api = new OptionSetDefinitionsApi();
    api.apiOptionSetDefinitionsGet(
      (
        /** @type {string} */ error,
        /** @type {OptionSetDefinitionDTO[]} */ elems,
      ) => {
        if (error) {
          handleError(error);
        } else if (elems) {
          optionSetDefinitions = elems;
        }
      },
    );
  };

  let loadData = async () => {
    loadCustomEntities();
    loadOptionSets();
    await loadForms();
  };
  const prepareQuery = async () => {
    let response = await fetch(odataMetaUrl);
    let schemaText = await response.text();
    odataSchema = new DOMParser().parseFromString(schemaText, "text/xml");
    odataSchema = odataSchema.querySelector(`Schema[Namespace="${namespace}"]`);
    if (!odataSchema) {
      throw "Ну ты приколист";
    }
  };

  onMount(async () => {
    await loadData();
    await prepareQuery();
  });

  $effect(() => {
    if (firstPageUrl) {
      getPage(firstPageUrl);
    }
  });

  let getUrlValue = $state("");

  let content = $state({
    json: [],
  });

  /** @param {string} url */
  const getPage = async (url) => {
    if (!browser || !selectedEntityId || !url) {
      content.json = [];
      getUrlValue = url;
      return;
    }
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        alertError(`HTTP error! Status: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let items = await response.json();
      items = items.value;
      content.json = items;
      getUrlValue = url;
    } catch (error) {
      handleError("Failed to fetch first page data: " + error);
      content.json = [];
      getUrlValue = url;
    }
  };

  const queryBuilderSearchClick = () => {
    console.log(rootQuery);
    const filter = convertToOdataFilter(rootQuery);
    console.log(filter);
    let link = resourceUrl + "?$filter=" + filter;
    console.log(link);
    getUrlValue = link;
    let prom = getPage(getUrlValue);
    assignLoader("Load data from: " + getUrlValue, prom);
  };
  let typesItems = $derived(
    customEntities.map((x) => ({ value: x.id, name: x.name })),
  );
  let selectedEntity = $derived(
    customEntities.find((x) => x.id === selectedEntityId),
  );
  let resourceUrl = $derived(
    selectedEntityId && browser
      ? window.location.origin +
          "/api/odata/" +
          customEntities.find((x) => x.id === selectedEntityId)?.name
      : "",
  );
  let firstPageUrl = $derived(
    resourceUrl ? resourceUrl + "?orderby=createdon%20desc&top=100" : "",
  );
</script>

<Container fluid class="d-flex flex-column p-3">
  <Row class="mb-12">
    <Col md="6" class="d-flex gap-2">
      <FormGroup>
        <Label for="entitySelect">Choose Entity</Label>
        <Input
          type="select"
          id="entitySelect"
          bind:value={selectedEntityId}
          on:change={() => {
            selectedFormId = null;
            editedEntityId = null;
          }}
        >
          <option value={null} selected={selectedEntityId === null}>
            Select an Entity...
          </option>
          {#each typesItems as item (item.value)}
            <option value={item.value}>{item.name}</option>
          {/each}
        </Input>
      </FormGroup>
      <FormGroup class="mt-auto">
        <Button on:click={queryBuilderSearchClick}>Apply</Button>
      </FormGroup>
      <FormGroup class="mt-auto">
        <Label>{{ getUrlValue }}</Label>
      </FormGroup>
    </Col>
    <Col md="12" class="d-flex gap-2">
      <QueryBuilder
        rootGroup={rootQuery}
        {customEntities}
        {optionSetDefinitions}
        customEntityId={selectedEntityId}
      ></QueryBuilder>
    </Col>
    <Col md="12">
      {#if selectedEntity}
        <DataTable
          data={content.json}
          customEntity={selectedEntity}
          optionSets={optionSetDefinitions}
        ></DataTable>
      {/if}
    </Col>
  </Row>
</Container>
