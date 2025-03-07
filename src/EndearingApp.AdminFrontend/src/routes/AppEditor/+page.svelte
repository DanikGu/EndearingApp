<script>
  import {
    CustomEntitiesApi,
    FormApi,
    FormDTO,
    OptionSetDefinitionDTO,
    OptionSetDefinitionsApi,
  } from "@apiclients/src";
  import { alertError } from "@utils/uiutils";
  import {
    Sidebar,
    SidebarWrapper,
    SidebarGroup,
    SidebarDropdownWrapper,
    SidebarDropdownItem,
    SidebarItem,
  } from "flowbite-svelte";
  import { PlusOutline } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  // @ts-ignore
  import { Input, Select, Label, Checkbox, Button } from "flowbite-svelte";
  import { getTypeId } from "@utils/fieldtypesutils";
  /** @typedef {import('../../apiclient/src/model/CustomeEntityDTO').default} CustomEntity */

  /** @type {OptionSetDefinitionDTO[]} */
  let optionSetDefinitions = [];

  /** @type {CustomEntity[]} */
  let customEntities = [];
  /** @type {FormDTO[]} */
  let forms = [];

  /** @type {FormDTO | null} */
  let editedForm;
  /** @type {boolean} */
  let isNewForm = false;

  let editForEntity = "";

  /** @param {CustomEntity} customEntity*/
  const addForm = (customEntity) => {
    isNewForm = true;
    editedForm = new FormDTO();
    editedForm.customEntityId = customEntity.id;
    editForEntity = customEntity.displayName;
    let obj = convertToFormioComponents(customEntity, optionSetDefinitions);
    console.log(obj);
    // @ts-ignore
    const iframe = document.getElementById("builderFrame");
    // @ts-ignore
    iframe.contentWindow.postMessage(obj, "*");
    iframe?.addEventListener("load", () => {
      // @ts-ignore
      iframe.contentWindow.postMessage(obj, "*");
    });
  };

  /**
   * @param {CustomEntity} customEntity
   * @param {FormDTO} form
   * */
  const openForm = (customEntity, form) => {
    isNewForm = false;
    editedForm = form;
    editForEntity = customEntity.displayName;
    let obj = convertToFormioComponents(customEntity, optionSetDefinitions);
    console.log(obj);
    debugger;
    // @ts-ignore
    const iframe = document.getElementById("builderFrame");
    // @ts-ignore
    iframe.contentWindow.postMessage(obj, "*");
    iframe?.addEventListener("load", () => {
      // @ts-ignore
      iframe.contentWindow.postMessage(obj, "*");
    });
  };
  const saveForm = async () => {
    const api = new FormApi();
    const form = await new Promise((res) => {
      const callback = (
        /** @type {String} */ error,
        /** @type {FormDTO} */ result,
      ) => {
        if (error) {
          alertError("Error while saving form: " + error);
        }
        res(result);
      };
      if (isNewForm) {
        api.apiFormPost(
          {
            body: editedForm,
          },
          callback,
        );
      } else {
        api.apiFormIdPut(
          editedForm?.id,
          {
            body: editedForm,
          },
          callback,
        );
      }
    });
    editedForm = form;
    isNewForm = false;
    await reloadData();
  };
  const deleteForm = async () => {
    const api = new FormApi();
    await new Promise((res) => {
      const callback = (/** @type {string} */ error) => {
        if (error) {
          alertError("Error while retriving forms");
        }
        res({});
      };
      api.apiFormIdDelete(editedForm?.id, callback);
    });
    await reloadData();
    editedForm = null;
  };
  const getForms = async () => {
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
  };
  let loadCustomEntities = async () => {
    let api = new CustomEntitiesApi();
    customEntities = await new Promise((res) => {
      api.apiCustomEntitiesGet(
        (/** @type {string} */ error, /** @type {CustomEntity[]} */ elems) => {
          if (error) {
            alertError("Error while retriving customEntities");
            res([]);
            return;
          } else if (elems) {
            res(elems);
            return;
          }
        },
      );
    });
  };

  let loadOptionSets = async () => {
    let api = new OptionSetDefinitionsApi();
    optionSetDefinitions = await new Promise((res) => {
      api.apiOptionSetDefinitionsGet(
        (
          /** @type {string} */ error,
          /** @type {OptionSetDefinitionDTO[]} */ elems,
        ) => {
          if (error) {
            alertError("Error while retriving customEntities");
            res([]);
            return;
          } else if (elems) {
            res(elems);
            return;
          }
        },
      );
    });
  };

  const reloadData = async () => {
    const formProm = getForms();
    const etnsProm = loadCustomEntities();
    const optsProm = loadOptionSets();
    await Promise.all([formProm, etnsProm, optsProm]);
  };

  /**
   * Converts a CustomEntity DB structure and its related option sets into an array of Form.io components.
   *
   * Assumes that:
   * - Each field's type is an integer.
   * - A helper function `getTypeId(typeName)` is available that returns the integer ID for a given type name.
   * - The CustomEntity DTO (imported as CustomEntity) has properties "fields" (array) and "relationships" (array).
   * - For "Option Set" and "Option Set MultiSelect" field types, the field object includes an "optionSetId" property.
   * - For "Limited Text", if you wish to enforce maximum length, the field object includes a "size" property (or something similar).
   *
   * @param {CustomEntity} customEntity - The custom entity DTO.
   * @param {OptionSetDefinitionDTO[]} optionSets - Array of option set definitions.
   * @returns {Object[]} Array of Form.io component configuration objects.
   */
  // @ts-ignore
  const convertToFormioComponents = (customEntity, optionSets) => {
    // @ts-ignore
    const components = {};
    if (customEntity.fields && Array.isArray(customEntity.fields)) {
      customEntity.fields.forEach((field) => {
        let componentType = mapFieldTypeToFormioComponent(field.type);
        const component = {
          type: componentType,
          input: true,
          key: field.name,
          label: field.displayName || field.name,
          validate: {
            required: !!field.required,
          },
        };

        if (
          field.type === getTypeId("Limited Text") &&
          typeof field.size === "number"
        ) {
          // @ts-ignore
          component.validate.maxLength = field.size;
        }

        if (field.type === getTypeId("Option Set MultiSelect")) {
          // @ts-ignore
          component.multiple = true;
        }

        if (field.type === getTypeId("Binary Data")) {
        }

        if (
          (field.type === getTypeId("Option Set") ||
            field.type === getTypeId("Option Set MultiSelect")) &&
          field.optionSetId
        ) {
          const optionSet = optionSets.find(
            (os) => os.id === field.optionSetId,
          );
          if (
            optionSet &&
            optionSet.options &&
            Array.isArray(optionSet.options)
          ) {
            // @ts-ignore
            component.data = {
              values: optionSet.options.map((opt) => ({
                label: opt.displayName,
                value: opt.value,
              })),
            };
          }
        }

        // @ts-ignore
        components[field.name] = component;
      });
    }

    if (
      customEntity.relationships &&
      Array.isArray(customEntity.relationships)
    ) {
      customEntity.relationships.forEach((rel) => {
        const relationshipComponent = {
          type: "select",
          input: true,
          key: rel.sourceFieldId,
          label: rel.constraintName || rel.sourceFieldId,
          placeholder: "Select a related entity",
        };

        // @ts-ignore
        components[rel.constraintName] = relationshipComponent;
      });
    }

    // @ts-ignore
    return {
      // @ts-ignore
      title: customEntity.displayName,
      components: components,
    };
  };

  /**
   * Maps an integer field type to a corresponding Form.io component type.
   *
   * @param {number} fieldType - The integer ID of the field type.
   * @returns {string} The Form.io component type.
   */
  const mapFieldTypeToFormioComponent = (fieldType) => {
    switch (fieldType) {
      case getTypeId("Unlimited Text"):
        return "textarea";

      case getTypeId("Limited Text"):
        return "textfield";

      case getTypeId("Whole Number"):
      case getTypeId("Whole Number (Small)"):
      case getTypeId("Whole Number (Big)"):
      case getTypeId("Decimal Number"):
      case getTypeId("Real Number"):
      case getTypeId("Double Precision Number"):
        return "number";

      case getTypeId("Date"):
      case getTypeId("Date and Time"):
        return "datetime";

      case getTypeId("Time"):
        return "time";

      case getTypeId("Yes/No"):
        return "checkbox";

      case getTypeId("Binary Data"):
        return "file";

      case getTypeId("Unique Identifier"):
        return "hidden";

      case getTypeId("Option Set"):
      case getTypeId("Option Set MultiSelect"):
        return "select";

      default:
        return "textfield";
    }
  };
  onMount(async () => {
    await reloadData();
  });
</script>

<div class="flex flex-row">
  <div class="flex flex-col h-full">
    <Sidebar>
      <SidebarWrapper>
        <SidebarGroup>
          <SidebarGroup>
            <SidebarDropdownWrapper label="Entities">
              {#key customEntities}
                {#each customEntities as elem}
                  <SidebarDropdownWrapper label={elem.displayName}>
                    {#key forms}
                      {#each forms.filter((x) => x.customEntityId === elem.id) as form}
                        <SidebarDropdownItem
                          label={form.name}
                          on:click={() => openForm(elem, form)}
                        />
                      {/each}
                    {/key}
                    <SidebarItem
                      label="Add Form"
                      on:click={() => addForm(elem)}
                    >
                      <svelte:fragment slot="icon">
                        <PlusOutline></PlusOutline>
                      </svelte:fragment>
                    </SidebarItem>
                  </SidebarDropdownWrapper>
                {/each}
              {/key}
            </SidebarDropdownWrapper>
          </SidebarGroup>
        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
  </div>
  {#if editedForm}
    <div class="h-svh w-full p-3 flex flex-col gap-5">
      <div class="flex flex-row justify-between">
        <div class="flex flex-row">
          <div class="p-3">
            <Label for="name" class="mb-2">For Entity</Label>
            <Input
              type="text"
              id="name"
              placeholder="Entity Name"
              value={editForEntity}
              readonly
              required
            />
          </div>
          <div class="p-3">
            <Label for="name" class="mb-2">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="New Form"
              required
              bind:value={editedForm.name}
            />
          </div>
        </div>
        <div class="flex flex-row gap-3 p-2 mb-auto">
          <Button on:click={saveForm} class="h-10 mx-0" outline color="green">
            Save
          </Button>
          <Button
            on:click={deleteForm}
            class="h-10 mx-0"
            outline
            color="red"
            disabled={isNewForm}
          >
            Delete
          </Button>
        </div>
      </div>
      <iframe
        id="builderFrame"
        class="h-full w-full"
        title="Builder"
        src="/formBuilder/index.html"
      >
      </iframe>
    </div>
  {/if}
  {#if !editedForm}
    <div class="w-full h-full text-center dark:text-white">Choose Form</div>
  {/if}
</div>
