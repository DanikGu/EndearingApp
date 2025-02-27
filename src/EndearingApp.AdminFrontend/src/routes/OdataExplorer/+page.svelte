<script>
  // @ts-nocheck

  import {
    CustomeEntityDTO,
    CustomEntitiesApi,
    FieldDto,
    OptionDTO,
    OptionSetDefinitionDTO,
    OptionSetDefinitionsApi,
  } from "@apiclients";
  import { alertError, alertSuccsess } from "@utils/uiutils";
  import { A, Label, Select, Button, Input } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { getTypeId } from "@utils/fieldtypesutils";
  import { browser } from "$app/environment";
  import { JSONEditor } from "svelte-jsoneditor";
  /** @typedef  {{ name: string, type: string | null | undefined, options: any}} SchemaItem */
  /** @type {CustomeEntityDTO | null} */
  let selectedEntity = null;
  $: typesItems = customEntities.map((x) => ({ value: x.id, name: x.name }));
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
  let loadData = () => {
    loadCustomEntities();
    loadOptionSets();
  };
  onMount(() => {
    loadData();
  });
  // @ts-ignore
  const onSubmit = (data) => {
    console.log(data);
  };
  $: selectedEntity, createJsonEditorSchema();
  $: resourceUrl = selectedEntity
    ? window.location.origin +
      "/api/odata/" +
      customEntities.find((x) => x.id === selectedEntity)?.name
    : "";
  $: firstPageUrl = resourceUrl
    ? resourceUrl + "?orderby=createdon%20desc"
    : "";
  $: firstPageUrl, getFirstPage();
  let content = {
    json: {},
  };

  const getFirstPage = async () => {
    if (!browser || !selectedEntity) {
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
    console.log(items);
  };
  /**
   * Creates a JSON Editor schema from your custom entity fields.
   */
  const createJsonEditorSchema = () => {
    const entity = customEntities.find((x) => x.id === selectedEntity);
    if (!entity) {
      return null;
    }
    const schema = { type: "object", properties: {} };

    entity.fields.forEach((/** @type {FieldDto} */ field) => {
      let property = {};
      if (field.isSystemField && field.name != "Id") {
        return;
      }
      if (field.type === getTypeId("Option Set")) {
        property.type = "string";
        const options = optionSetDefinitions.find(
          (x) => x.id === field.optionSetDefinitionId,
        )?.options;
        if (options) {
          property.enum = options.map(
            (/** @type {OptionDTO} */ option) => option.value,
          );
          property.options = {
            enum_titles: options.map(
              (/** @type {OptionDTO} */ option) => option.name,
            ),
          };
        }
      } else if (field.type === getTypeId("Option Set MultiSelect")) {
        property.type = "array";
        property.items = { type: "string" };
        const multiOptions = optionSetDefinitions.find(
          (x) => x.id === field.optionSetDefinitionId,
        )?.options;
        if (multiOptions) {
          // @ts-ignore
          property.items.enum = multiOptions.map(
            (/** @type {OptionDTO} */ option) => option.value,
          );
          // @ts-ignore
          property.items.options = {
            enum_titles: multiOptions.map(
              (/** @type {OptionDTO} */ option) => option.name,
            ),
          };
        }
      } else if (field.type === getTypeId("Yes/No")) {
        property.type = "boolean";
      } else if (
        field.type === getTypeId("Whole Number") ||
        field.type === getTypeId("Whole Number (Small)") ||
        field.type === getTypeId("Whole Number (Big)") ||
        field.type === getTypeId("Decimal Number") ||
        field.type === getTypeId("Real Number") ||
        field.type === getTypeId("Double Precision Number")
      ) {
        property.type = "number";
      } else if (field.type === getTypeId("Unique Identifier")) {
        property.type = "string";
      } else if (field.type === getTypeId("Limited Text")) {
        property.type = "string";
        property.maxLength = field.size || 255;
      } else if (field.type === getTypeId("Unlimited Text")) {
        property.type = "string";
      } else if (field.type === getTypeId("Date")) {
        property.type = "string";
        property.format = "date";
      } else if (field.type === getTypeId("Time")) {
        property.type = "string";
        property.format = "time";
      } else if (field.type === getTypeId("Date and Time")) {
        property.type = "string";
        property.format = "datetime-local";
      } else if (field.type === getTypeId("Binary Data")) {
        property.type = "string";
        property.media = {
          binaryEncoding: "base64",
        };
        property.format = "data-url";
      } else {
        property.type = "string";
      }

      // @ts-ignore
      schema.properties[field.name] = property;
    });
    console.log(schema);

    // @ts-ignore
    document
      .getElementById("formPrev")
      // @ts-ignore
      .contentWindow.postMessage({ schema: schema }, "*");
  };
  const createEntity = () => {
    function cleanBase64Javascript(obj) {
      if (typeof obj === "object" && obj !== null) {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (
              typeof obj[key] === "string" &&
              obj[key].startsWith("data:text/javascript;base64,")
            ) {
              obj[key] = obj[key].replace("data:text/javascript;base64,", "");
            }
          }
        }
      }
    }
    // @ts-ignore
    let etnToCreate = document
      .getElementById("formPrev")
      // @ts-ignore
      .contentWindow.editorVar.getValue();
    console.log(etnToCreate);
    cleanBase64Javascript(etnToCreate);

    postData(resourceUrl, etnToCreate);
  };
  const editEntity = () => {
    function cleanBase64Javascript(obj) {
      if (typeof obj === "object" && obj !== null) {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (
              typeof obj[key] === "string" &&
              obj[key].startsWith("data:text/javascript;base64,")
            ) {
              obj[key] = obj[key].replace("data:text/javascript;base64,", "");
            }
          }
        }
      }
    }
    // @ts-ignore
    let etnToUpdate = document
      .getElementById("formPrev")
      // @ts-ignore
      .contentWindow.editorVar.getValue();
    console.log(etnToUpdate);
    cleanBase64Javascript(etnToUpdate);

    putData(resourceUrl + `(${etnToUpdate.Id})`, etnToUpdate);
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
  const loadEntity = async () => {
    const id = prompt("Put entity id");
    if (!id) {
      return;
    }
    const response = await fetch(resourceUrl + `(${id})`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alertError(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let item = await response.json();
    delete item["@odata.context"];
    delete item["CreatedOn"];
    delete item["ModifiedOn"];

    // @ts-ignore
    document
      .getElementById("formPrev")
      // @ts-ignore
      .contentWindow.postMessage({ value: item }, "*");
  };
</script>

<div class="p-3 w-full">
  <Label
    >Page for testing and exploring odata resources generated from data
    structure defined in Data Customizations tab</Label
  >
  <Label>Odata Metadata</Label>
  <A href="/api/odata/$metadata" target="response">/api/odata/$metadata</A>
  <Label>Add new entity</Label>
  <Select bind:value={selectedEntity} items={typesItems}></Select>
  <div class="flex flex-row gap-3">
    <div class="flex flex-row gap-3 w-1/2">
      <Button disabled={!selectedEntity} onclick={createEntity}>
        Create Entity
      </Button>
      <Button disabled={!selectedEntity} onclick={editEntity}>
        Edit Entity
      </Button>
      <Button disabled={!selectedEntity} onclick={loadEntity}>
        Load Entity
      </Button>
      <div class="dark:text-white">{resourceUrl}</div>
    </div>
    <div class="flex flex-row gap-3 w-1/2">
      <Button disabled={!selectedEntity} onclick={getFirstPage}>Reload</Button>
      <Input
        class="dark:text-white"
        readonly={!selectedEntity}
        bind:value={firstPageUrl}
      ></Input>
    </div>
  </div>
  <div class="flex flex-row gap-3">
    <div id="json-editor-form" class="h-svh p-3 w-1/2 dark:bg-white">
      <iframe
        class="h-full w-full"
        title="preview"
        id="formPrev"
        src="/odataPreviewForm.html"
      >
      </iframe>
    </div>
    <div class="w-1/2">
      {#key content}
        <JSONEditor bind:content mode="table"></JSONEditor>
      {/key}
    </div>
  </div>
</div>
