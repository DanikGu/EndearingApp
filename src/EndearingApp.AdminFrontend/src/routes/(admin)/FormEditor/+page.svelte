<script>
  import { run } from "svelte/legacy";

  import {
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
  import { onMount } from "svelte";
  import fieldtypesutils, { getTypeId } from "@utils/fieldtypesutils";
  import {
    Container,
    Row,
    Col,
    Accordion,
    AccordionItem,
    ListGroup,
    ListGroupItem,
    Icon,
    Input,
    Label,
    Button,
    Form,
    FormGroup,
  } from "@sveltestrap/sveltestrap";
  import Builder from "../../../FormComponents/Builder.svelte";

  /** @typedef {import('../../../apiclient/src/model/CustomeEntityDTO').default} CustomEntity */

  /** @type {OptionSetDefinitionDTO[]} */
  let optionSetDefinitions = [];

  /** @type {CustomEntity[]} */
  let customEntities = $state([]);
  /** @type {FormDTO[]} */
  let forms = $state([]);

  /** @type {FormDTO | null} */
  let editedForm = $state(null);
  /** @type {boolean} */
  let isNewForm = $state(false);

  let editForEntity = $state("");
  /** @type {any} */
  let currentSchema = $state(null);

  /** @type {any} */
  let currentObj = $state({});

  const updateBuilder = () => {
    console.log("Update builder called");
    const customEntity = customEntities.find(
      (x) => x.id == editedForm?.customEntityId,
    );
    if (!customEntity) {
      console.log("Update short curcuit");
      return;
    }
    currentObj = convertToFormioComponents(customEntity, optionSetDefinitions);
    currentSchema = JSON.parse(editedForm?.jsonSchema ?? "{}");
    console.log("schema changed");
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
    if (!editedForm) return;
    const api = new FormApi();
    editedForm.jsonSchema = JSON.stringify(currentSchema);
    const form = await assignLoader(
      "Saving Form",
      new Promise((res) => {
        const callback = (
          /** @type {String} */ error,
          /** @type {FormDTO} */ result,
        ) => {
          if (error) {
            alertError("Error while saving form: " + error);
          } else {
            alertSuccsess("Form Saved");
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
  };
  const deleteForm = async () => {
    if (!editedForm || !editedForm.id) return;
    const api = new FormApi();
    await new Promise((res) => {
      const callback = (/** @type {string} */ error) => {
        if (error) {
          alertError("Error while deleting form: " + error);
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
  let loadCustomEntities = async () => {
    let api = new CustomEntitiesApi();
    customEntities = await new Promise((res) => {
      api.apiCustomEntitiesGet(
        (/** @type {string} */ error, /** @type {CustomEntity[]} */ elems) => {
          if (error) {
            alertError("Error while retrieving customEntities: " + error);
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
            alertError("Error while retrieving option sets: " + error);
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
   * @param {CustomEntity} customEntity
   * @param {OptionSetDefinitionDTO[]} optionSets
   * @returns {Object}
   */
  function convertToFormioComponents(customEntity, optionSets) {
    /** @type {any} */
    const componentsConfig = {
      title: customEntity.displayName || "Entity Form",
      weight: 10,
      components: {},
    };

    if (customEntity.fields?.length) {
      customEntity.fields.forEach((/** @type {FieldDto} */ field) => {
        componentsConfig.components[field.name] = createFieldComponent(
          field,
          optionSets,
        );
      });
    }

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
   * @param {FieldDto} field
   * @param {OptionSetDefinitionDTO[]} optionSets
   * @returns {Object}
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
          if (optionSet && optionSet.options) {
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
   * @param {RelationshipDTO} relationship
   * @returns {Object}
   */
  function createRelationshipComponent(relationship) {
    let entityName = customEntities.find(
      (x) => x.id === relationship.referencedCustomEntityId,
    )?.name;
    /** @type { FieldDto | undefined } */
    let field = customEntities
      .find((x) => x.id === relationship.sourceCustomEntityId)
      ?.fields.find(
        (/** @type {FieldDto} */ x) => x.id === relationship.sourceFieldId,
      );

    if (!field) {
      console.error("Source field not found for relationship:", relationship);
      return {
        title: "Undefined Field",
        key: "undefined_" + relationship.sourceFieldId,
        icon: "link-broken",
        schema: {
          label: "Undefined Field",
          type: "textfield",
          key: "undefined_" + relationship.sourceFieldId,
          disabled: true,
        },
      };
    }

    return {
      title: field.displayName,
      key: field.name,
      icon: "link",
      schema: {
        label: field.displayName,
        type: "lookup",
        key: field.name,
        odataPath: "api/odata",
        entityName: entityName,
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
  });
  run(() => {
    editedForm?.id, updateBuilder();
  });
</script>

<Container fluid class="vh-100 d-flex flex-column p-0">
  <Row class="flex-grow-1 g-0">
    <Col md="3" class="p-0 d-flex flex-column border-end">
      <div class="flex-grow-1 overflow-auto">
        <Accordion stayOpen class="rounded-0">
          {#key customEntities}
            {#each customEntities as elem (elem.id)}
              <AccordionItem
                class="entity-accordion-item p-0"
                header={elem.displayName}
              >
                <ListGroup flush>
                  {#key forms}
                    {#each forms.filter((f) => f.customEntityId === elem.id) as form (form.id)}
                      <ListGroupItem
                        action
                        class="py-2 border-0"
                        active={editedForm?.id === form.id && !isNewForm}
                        on:click={() => openForm(elem, form)}
                      >
                        {form.name}
                      </ListGroupItem>
                    {/each}
                  {/key}
                  <ListGroupItem
                    action
                    class="py-2 border-0"
                    active={isNewForm && editedForm?.customEntityId === elem.id}
                    on:click={() => addForm(elem)}
                  >
                    <Icon name="plus-lg" /> Add Form
                  </ListGroupItem>
                </ListGroup>
              </AccordionItem>
            {/each}
          {/key}
        </Accordion>
      </div>
    </Col>
    <Col md="9" class="d-flex flex-column">
      {#if editedForm}
        <div class="p-3 d-flex flex-column flex-grow-1">
          <Form>
            <Row class="mb-3 align-items-center">
              <Col md="auto">
                <FormGroup>
                  <Label for="forEntity">For Entity</Label>
                  <Input
                    type="text"
                    id="forEntity"
                    placeholder="Entity Name"
                    value={editForEntity}
                    readonly
                  />
                </FormGroup>
              </Col>
              <Col md="auto">
                <FormGroup>
                  <Label for="formName">Name</Label>
                  <Input
                    type="text"
                    id="formName"
                    placeholder="New Form"
                    required
                    bind:value={editedForm.name}
                  />
                </FormGroup>
              </Col>
              <Col
                class="d-flex justify-content-start justify-content-md-end align-items-center gap-2 mt-3 mt-md-0"
              >
                <Button on:click={saveForm} outline color="success">
                  Save
                </Button>
                <Button
                  on:click={deleteForm}
                  outline
                  color="danger"
                  disabled={isNewForm}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Form>
          <div class="flex-grow-1 mt-3">
            {#key editedForm?.id}
              <Builder bind:currentSchema bind:currentComponents={currentObj}
              ></Builder>
            {/key}
          </div>
        </div>
      {/if}
      {#if !editedForm}
        <div
          class="d-flex flex-grow-1 justify-content-center align-items-center text-muted p-3"
        >
          Choose a form to edit from the sidebar, or create a new one.
        </div>
      {/if}
    </Col>
  </Row>
</Container>
