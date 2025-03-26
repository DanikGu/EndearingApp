<script>
  import {
    CustomeEntityDTO,
    CustomEntitiesApi,
    FieldDto,
    FormApi,
    FormDTO,
    OptionDTO,
    OptionSetDefinitionDTO,
    OptionSetDefinitionsApi,
    RelationshipDTO,
  } from "@apiclients/src";
  import { alertError, alertSuccsess, assignLoader } from "@utils/uiutils";
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
  /** @typedef {import('../../../apiclient/src/model/CustomeEntityDTO').default} CustomEntity */

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

  /** @type {HTMLIFrameElement} */
  let builderFrame;
  $: editedForm, builderFrame, updateBuilder();

  const updateBuilder = () => {
    console.log("Update builder called");
    const customEntity = customEntities.find(
      (x) => x.id == editedForm?.customEntityId,
    );
    if (!customEntity || !builderFrame) {
      console.log("Update short curcuit");
      return;
    }
    let obj = convertToFormioComponents(customEntity, optionSetDefinitions);
    builderFrame?.contentWindow?.postMessage(
      {
        components: obj,
        currentSchema: JSON.parse(editedForm?.jsonSchema ?? "{}"),
      },
      "*",
    );
    builderFrame?.addEventListener("load", () => {
      builderFrame?.contentWindow?.postMessage(
        {
          components: obj,
          currentSchema: JSON.parse(editedForm?.jsonSchema ?? "{}"),
        },
        "*",
      );
    });
  };

  /** @param {CustomEntity} customEntity*/
  const addForm = (customEntity) => {
    isNewForm = true;
    editedForm = new FormDTO();
    editedForm.customEntityId = customEntity.id;
    editForEntity = customEntity.displayName;
  };

  /**
   * @param {CustomEntity} customEntity
   * @param {FormDTO} form
   * */
  const openForm = (customEntity, form) => {
    isNewForm = false;
    editedForm = form;
    editForEntity = customEntity.displayName;
  };

  const saveForm = async () => {
    const api = new FormApi();
    const form = await assignLoader(
      "Saving Form",
      new Promise((res) => {
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
      }),
    );
    if (form) {
      editedForm = form;
    }
    if (isNewForm) {
      await reloadData();
    }
    isNewForm = false;
    alertSuccsess("Form Saved");
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
    alertSuccsess("Form Deleted");
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
   * Converts entity fields and relationships to Form.io builder components structure
   * @param {CustomEntity} customEntity - The custom entity configuration
   * @param {OptionSetDefinitionDTO[]} optionSets - Available option sets
   * @returns {Object} Form.io builder components configuration
   */
  function convertToFormioComponents(customEntity, optionSets) {
    /** @type {any} */
    const componentsConfig = {
      title: customEntity.displayName || "Entity Form",
      weight: 10,
      components: {},
    };

    // Process entity fields
    if (customEntity.fields?.length) {
      customEntity.fields.forEach((/** @type {FieldDto} */ field) => {
        componentsConfig.components[field.name] = createFieldComponent(
          field,
          optionSets,
        );
      });
    }

    // Process relationships
    if (customEntity.relationships?.length) {
      customEntity.relationships.forEach(
        (/** @type {RelationshipDTO} */ relationship) => {
          componentsConfig.components[relationship.sourceFieldId] =
            createRelationshipComponent(relationship);
        },
      );
    }

    return componentsConfig;
  }

  /**
   * Creates individual field component configuration
   * @private
   * @param {FieldDto} field - Field definition
   * @param {OptionSetDefinitionDTO[]} optionSets - Available option sets
   * @returns {Object} Form.io component configuration
   */
  function createFieldComponent(field, optionSets) {
    const componentType = mapFieldType(field.type);
    const icon = mapFieldIcon(field.type);

    /** @type {any} */
    const component = {
      title: field.displayName || field.name,
      key: field.name,
      icon: icon,
      schema: {
        label: field.displayName || field.name,
        type: componentType,
        key: field.name,
        input: true,
        validate: {
          required: !field.isNullable,
        },
      },
    };

    switch (componentType) {
      case "textfield":
        if (field.size) {
          component.schema.validate.maxLength = field.size;
        }
        break;

      case "select":
        component.schema.multiple =
          field.type === getTypeId("Option Set MultiSelect");
        if (field.optionSetDefinitionId) {
          const optionSet = optionSets.find(
            (os) => os.id === field.optionSetDefinitionId,
          );
          if (optionSet) {
            component.schema.data = {
              values: optionSet.options.map((/** @type {OptionDTO} */ opt) => ({
                label: opt.name,
                value: opt.value,
              })),
            };
          }
        }
        break;
    }

    return component;
  }

  /**
   * Creates relationship component configuration
   * @private
   * @param {RelationshipDTO} relationship - Relationship definition
   * @returns {Object} Form.io component configuration
   */
  function createRelationshipComponent(relationship) {
    return {
      title: relationship.constraintName || relationship.sourceFieldId,
      key: relationship.sourceFieldId,
      icon: "link",
      schema: {
        label: relationship.constraintName || relationship.sourceFieldId,
        type: "select",
        key: relationship.sourceFieldId,
        input: true,
        dataSrc: "url",
        data: {
          url: `/api/entities/${relationship.referencedCustomEntityId}/items`,
        },
        valueProperty: "id",
        template: "{{ item.name }}",
      },
    };
  }

  /** @param { number } typeId */
  function mapFieldType(typeId) {
    const mappings = {
      [getTypeId("Unlimited Text")]: "textarea",
      [getTypeId("Limited Text")]: "textfield",
      [getTypeId("Whole Number")]: "number",
      [getTypeId("Whole Number (Small)")]: "number",
      [getTypeId("Whole Number (Big)")]: "number",
      [getTypeId("Decimal Number")]: "number",
      [getTypeId("Date and Time")]: "datetime",
      [getTypeId("Date")]: "day",
      [getTypeId("Time")]: "time",
      [getTypeId("Yes/No")]: "checkbox",
      [getTypeId("Binary Data")]: "file",
      [getTypeId("Unique Identifier")]: "textfield",
      [getTypeId("Option Set")]: "select",
      [getTypeId("Option Set MultiSelect")]: "select",
    };
    return mappings[typeId] || "textfield";
  }

  /** @param { number } typeId */
  function mapFieldIcon(typeId) {
    const icons = {
      [getTypeId("Unlimited Text")]: "terminal",
      [getTypeId("Limited Text")]: "terminal",
      [getTypeId("Whole Number")]: "hashtag",
      [getTypeId("Whole Number (Small)")]: "hashtag",
      [getTypeId("Whole Number (Big)")]: "hashtag",
      [getTypeId("Decimal Number")]: "calculator",
      [getTypeId("Date and Time")]: "calendar",
      [getTypeId("Yes/No")]: "check-square",
      [getTypeId("Binary Data")]: "file",
      [getTypeId("Unique Identifier")]: "key",
      [getTypeId("Option Set")]: "list",
      [getTypeId("Option Set MultiSelect")]: "list",
    };
    return icons[typeId] || "pencil";
  }
  onMount(async () => {
    await reloadData();
    window.addEventListener("message", (event) => {
      if (event.data.type === "formSchemaChanged") {
        if (editedForm) {
          editedForm.jsonSchema = JSON.stringify(event.data.content);
          console.log(editedForm.jsonSchema);
        }
      }
    });
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
        bind:this={builderFrame}
      >
      </iframe>
    </div>
  {/if}
  {#if !editedForm}
    <div class="w-full h-full text-center dark:text-white">Choose Form</div>
  {/if}
</div>
