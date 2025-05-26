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
  import { JSONEditor } from "svelte-jsoneditor";
  import EditFormComponent from "../../../components/AppComponents/EditFormComponent.svelte";
  import {
    Container,
    Row,
    Col,
    Button,
    Input,
    Label,
    FormGroup,
  } from "@sveltestrap/sveltestrap";
  import QueryBuilder from "../../../components/QueryBuilder/queryBuilder.svelte";
  import { ConditionGroup } from "../../../components/QueryBuilder/typeDefinitions";

  /** @typedef {import('svelte-jsoneditor').Mode} Mode */

  /** @type {string | null} */
  let selectedEntityId = null;
  $: typesItems = customEntities.map((x) => ({ value: x.id, name: x.name }));

  /** @type {FormDTO[]} */
  let forms = [];
  $: formsForEntity = !!selectedEntityId
    ? forms
        .filter((x) => x.customEntityId === selectedEntityId)
        .map((x) => ({ value: x.id, name: x.name }))
    : [];

  /** @type {string | null} */
  let selectedFormId = null;

  /** @type {CustomeEntityDTO[]} */
  let customEntities = [];
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
  let optionSetDefinitions = [];
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

  $: resourceUrl =
    selectedEntityId && browser
      ? window.location.origin +
        "/api/odata/" +
        customEntities.find((x) => x.id === selectedEntityId)?.name
      : "";

  $: firstPageUrl = resourceUrl
    ? resourceUrl + "?orderby=createdon%20desc"
    : "";

  $: if (browser && firstPageUrl) getFirstPage();

  let getUrlValue = "";

  let content = {
    json: {},
  };

  const reloadFromInput = async () => {
    if (getUrlValue) {
      firstPageUrl = getUrlValue;
      let prom = getFirstPage();
      assignLoader("Load data from: " + firstPageUrl, prom);
    }
  };

  const getFirstPage = async () => {
    if (!browser || !selectedEntityId || !firstPageUrl) {
      content.json = {};
      getUrlValue = firstPageUrl;
      return;
    }
    try {
      const response = await fetch(firstPageUrl, {
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
      getUrlValue = firstPageUrl;
    } catch (error) {
      handleError("Failed to fetch first page data: " + error);
      content.json = {};
      getUrlValue = firstPageUrl;
    }
  };

  const putData = async (url = "", data = {}) => {
    if (!browser) return;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      alertError(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    await getFirstPage();
    alertSuccsess(`Entity updated`);
    return await response.json();
  };

  const postData = async (url = "", data = {}) => {
    if (!browser) return;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      alertError(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    await getFirstPage();
    alertSuccsess(`Entity created`);
    return await response.json();
  };

  /** @type {string | null } */
  let editedEntityId = null;

  const loadEntity = async () => {
    if (!browser) return;
    const id = prompt("Put entity id");
    if (!id) {
      return;
    }
    editedEntityId = id;
  };

  const newEntity = () => {
    editedEntityId = null;
  };

  /** @returns {Mode} */
  // @ts-ignore
  const getMode = () => "table";

  /** @param { string } formId
   ** @returns { Promise<FormDTO | null> } */
  const loadFormById = (formId) => {
    return new Promise((res) => {
      const formApi = new FormApi();
      // @ts-ignore
      const callback = (error, form) => {
        if (form) {
          res(form);
          return;
        }
        res(null);
      };
      formApi.apiFormIdGet(formId, callback);
    });
  };
  /**
   * @param { string } customEntityId
   * @returns { Promise<CustomeEntityDTO> }
   */
  const getCustomEntity = async (customEntityId) => {
    return new Promise((res) => {
      const api = new CustomEntitiesApi();
      // @ts-ignore
      let callBack = (error, customEntity) => {
        res(customEntity ?? {});
      };
      api.apiCustomEntitiesIdGet(customEntityId, callBack);
    });
  };
  /**
   * @param { FormDTO } form
   * @param { string } entityId
   * @returns { Promise<Object | null> } */
  const loadEntityData = async (form, entityId) => {
    const customEntity = await getCustomEntity(form.customEntityId);
    const url = `/api/odata/${customEntity.name}(${entityId})`;
    const response = await fetch(url);

    if (response.status === 404) {
      return null;
    }

    if (response.status === 200) {
      return await response.json();
    }
    throw new Error(
      `Request to load entity data: ${url} failed with status: ${response.status}`,
    );
  };
  /** @returns {Promise<{form: FormDTO, data: Object | null}>} */
  const loadEntityWithForm = async () => {
    if (!selectedFormId) {
      throw "ne tuda";
    }
    const form = await loadFormById(selectedFormId);
    if (!form) {
      throw "ne tuda";
    }
    const entityData =
      !!form && !!editedEntityId
        ? await loadEntityData(form, editedEntityId)
        : {};
    return {
      form,
      data: entityData,
    };
  };
  const queryBuilderSearchClick = () => {
    console.log(rootQuery);
  };
</script>

<Container fluid class="d-flex flex-column p-3">
  <Row class="mb-3">
    <Col>
      <p class="text-muted">
        Page for testing and exploring OData resources generated from data
        structure defined in Data Customizations tab.
      </p>
      <h6>OData Metadata</h6>
      <p>
        <a
          href="/api/odata/$metadata"
          target="_blank"
          rel="noopener noreferrer"
        >
          /api/odata/$metadata
        </a>
      </p>
    </Col>
  </Row>

  <Row class="mb-3 gx-4">
    <Col md="auto">
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
    </Col>
    <Col md="auto">
      <FormGroup>
        <Label for="formSelect">Choose Form</Label>
        <Input
          type="select"
          id="formSelect"
          bind:value={selectedFormId}
          disabled={!selectedEntityId || formsForEntity.length === 0}
          on:change={() => (editedEntityId = null)}
        >
          <option value={null} selected={selectedFormId === null}>
            Select a Form...
          </option>
          {#each formsForEntity as item (item.value)}
            <option value={item.value}>{item.name}</option>
          {/each}
          {#if formsForEntity.length === 0 && selectedEntityId}
            <option value={null} disabled>No forms available</option>
          {/if}
        </Input>
      </FormGroup>
    </Col>
  </Row>

  <Row class="mb-3 gx-3 align-items-center">
    <Col md="6" class="d-flex flex-wrap gap-2 mb-2 mb-md-0">
      <Button
        disabled={!selectedEntityId || !selectedFormId}
        on:click={newEntity}
        size="sm"
      >
        New Entity
      </Button>
      <Button
        disabled={!selectedEntityId || !selectedFormId}
        on:click={loadEntity}
        size="sm"
      >
        Load Entity
      </Button>
      <div class="ms-md-auto align-self-center text-break">
        <small class="text-muted">
          {resourceUrl + (!!editedEntityId ? `(${editedEntityId})` : "")}
        </small>
      </div>
    </Col>
    <Col md="6" class="d-flex gap-2">
      <Button disabled={!selectedEntityId} on:click={reloadFromInput} size="sm">
        Reload
      </Button>
      <Input
        class="flex-grow-1"
        readonly={!selectedEntityId}
        bind:value={getUrlValue}
        placeholder="OData URL"
        bsSize="sm"
      />
    </Col>
  </Row>

  <Row class="g-3 flex-grow-1" style="min-height: 0;">
    {#if selectedFormId}
      <Col md="6" class="d-flex flex-column p-1 border-1">
        {#key selectedFormId + (editedEntityId || "new")}
          {#await loadEntityWithForm() then props}
            <EditFormComponent
              form={props.form}
              entityData={!!editedEntityId ? props.data : {}}
              onAfterSave={(/** @type{any}*/ editedEntity) => {
                editedEntityId = editedEntity.Id;
              }}
              onAfterDelete={() => (editedEntityId = null)}
            ></EditFormComponent>
          {/await}
        {/key}
      </Col>
    {/if}
    <Col md="6">
      <Button on:click={queryBuilderSearchClick}>Search</Button>
      <QueryBuilder
        rootGroup={rootQuery}
        {customEntities}
        {optionSetDefinitions}
        bind:customEntityId={selectedEntityId}
      ></QueryBuilder>
    </Col>
    <Col md="6" class="d-flex flex-column p-1">
      <div
        class="flex-grow-1 d-flex flex-column border rounded overflow-hidden"
      >
        {#key content}
          <JSONEditor bind:content mode={getMode()} />
        {/key}
      </div>
    </Col>
  </Row>
</Container>
