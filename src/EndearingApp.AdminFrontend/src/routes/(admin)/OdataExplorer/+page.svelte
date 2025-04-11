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
  import { A, Label, Select, Button, Input } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { JSONEditor } from "svelte-jsoneditor";
  import EditFormComponent from "../../../components/AppComponents/EditFormComponent.svelte";
  /** @typedef {import('svelte-jsoneditor').Mode} Mode */
  /** @type {string | null} */
  let selectedEntityId = null;
  $: typesItems = customEntities.map((x) => ({ value: x.id, name: x.name }));
  /** @type {FormDTO[]} */
  let forms = [];
  $: formsForEntity = !!selectedEntityId
    ? forms
        .filter((x) => {
          console.log(selectedEntityId);
          return x.customEntityId === selectedEntityId;
        })
        .map((x) => ({ value: x.id, name: x.name }))
    : [];
  /** @type {string | null} */
  let selectedFormId;
  /** @type {CustomeEntityDTO[]} */
  let customEntities = [];
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
        /** @type {FormDTO[]} */ forms,
      ) => {
        if (forms) {
          res(forms);
          return;
        }
        if (error) {
          alertError("Error while retriving forms");
        }
        res([]);
      };
      api.apiFormGet(callback);
    });
    console.log(forms);
  };
  /** @param {string} error */
  let handleError = (error) => {
    console.error(error);
    alertError("Error occured: " + error);
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
  onMount(async () => {
    await loadData();
  });
  $: resourceUrl = selectedEntityId
    ? window.location.origin +
      "/api/odata/" +
      customEntities.find((x) => x.id === selectedEntityId)?.name
    : "";
  $: firstPageUrl = resourceUrl
    ? resourceUrl + "?orderby=createdon%20desc"
    : "";
  $: firstPageUrl, getFirstPage();
  let getUrlValue = "";
  let content = {
    json: {},
  };

  const reloadFromInput = async () => {
    firstPageUrl = getUrlValue;
    let prom = getFirstPage();
    assignLoader("Load data from: " + firstPageUrl, prom);
  };
  const getFirstPage = async () => {
    if (!browser || !selectedEntityId) {
      return;
    }
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
  };

  const putData = async (url = "", data = {}) => {
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
  /** @param {Object} data */
  let onFormSubmit = (data) => {
    console.log(data);
  };
</script>

<div class="flex flex-col p-3 w-full gap-1">
  <Label>
    Page for testing and exploring odata resources generated from data structure
    defined in Data Customizations tab
  </Label>
  <Label>Odata Metadata</Label>
  <A href="/api/odata/$metadata" target="response">/api/odata/$metadata</A>
  <div class="flex flex-row gap-4">
    <div>
      <Label>Choose Entity</Label>
      <Select class="w-36" bind:value={selectedEntityId} items={typesItems} />
    </div>
    <div>
      <Label>Choose Form</Label>
      <Select
        disabled={!selectedEntityId}
        class="w-48"
        bind:value={selectedFormId}
        items={formsForEntity}
      />
    </div>
  </div>
  <div class="flex flex-row gap-3">
    <div class="flex flex-row gap-3 w-1/2">
      <Button
        disabled={!selectedEntityId || !selectedFormId}
        onclick={newEntity}
      >
        New Entity
      </Button>
      <Button
        disabled={!selectedEntityId || !selectedFormId}
        onclick={loadEntity}
      >
        Load Entity
      </Button>
      <div class="dark:text-white">{resourceUrl}</div>
    </div>
    <div class="flex flex-row gap-3 w-1/2">
      <Button disabled={!selectedEntityId} onclick={reloadFromInput}>
        Reload
      </Button>
      <Input
        class="dark:text-white"
        readonly={!selectedEntityId}
        bind:value={getUrlValue}
      ></Input>
    </div>
  </div>
  <div class="flex flex-row gap-3">
    <div id="json-editor-form" class="h-svh p-3 w-1/2">
      {#key selectedFormId}
        {#key editedEntityId}
          {#if selectedFormId}
            <iframe
              class="h-full w-full"
              title="editform"
              src={"/Edit/" +
                selectedFormId +
                (editedEntityId ? "/" + editedEntityId : "")}
            >
            </iframe>
          {/if}
        {/key}
      {/key}
    </div>
    <div class="w-1/2">
      {#key content}
        <JSONEditor bind:content mode={getMode()}></JSONEditor>
      {/key}
    </div>
  </div>
</div>
