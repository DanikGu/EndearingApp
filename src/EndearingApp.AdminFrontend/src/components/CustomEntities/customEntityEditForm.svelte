<script>
  import {
    Table,
    Label,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    FormGroup,
    Row,
    Col,
    Icon,
    Theme,
  } from "@sveltestrap/sveltestrap";
  import { getTypeName } from "../../utils/fieldtypesutils";
  import FieldEditForm from "./fieldEditForm.svelte";
  import { FieldDto, RelationshipDTO } from "@apiclients/src";
  import { assignLoader, assignBlockingLoader } from "../../utils/uiutils";
  import RelationshipEditForm from "./relationshipEditForm.svelte";
  import {
    applyChangesToDbApi,
    deleteCustomEntityApi,
    deleteFieldApi,
    deleteRelationshipApi,
    saveCustomEntityApi,
    saveFieldApi,
    saveRelationshipApi,
  } from "../../apiClientsWrapper";

  /** @typedef {import('../../apiclient/src/model/CustomeEntityDTO').default} CustomEntity */
  /** @typedef {import('../../apiclient/src/model/FieldDto').default} FieldEntity */
  /** @typedef {import('../../apiclient/src/model/RelationshipDTO').default} RelationshipDTO */

  /** @type {CustomEntity[]} */
  export let customEntities;

  /** @type {CustomEntity} */
  export let customEntity;

  /** @type {boolean} */
  export let isNew = false;

  /** @type {Function} */
  export let reloadParentData;

  /** @type {boolean} */
  let editFieldModal = false;

  /** @type {boolean} */
  let isNewField = false;

  /** @type {FieldEntity | null} */
  let editedField = null;

  /** @type {boolean} */
  let editRelationshipModal = false;

  /** @type {RelationshipDTO | null} */
  let editedRelationship = null;

  /** @type {boolean} */
  let isNewRelationship = false;

  /** @type {HTMLDivElement | null} */
  let formContainer;

  /** @param {FieldEntity} field **/
  let editField = (field) => {
    isNewField = false;
    editedField = field;
    editFieldModal = true;
  };

  /** @param {RelationshipDTO} relationship **/
  let editRelationship = (relationship) => {
    isNewRelationship = false;
    editedRelationship = relationship;
    editRelationshipModal = true;
  };

  let addNewRelationship = () => {
    isNewRelationship = true;
    editedRelationship = new RelationshipDTO();
    // if (customEntity && customEntity.relationships) {
    //   customEntity.relationships = [
    //     editedRelationship,
    //     ...customEntity.relationships,
    //   ];
    // } else if (customEntity) {
    //   customEntity.relationships = [editedRelationship];
    // }
    // if (editedRelationship && customEntity) {
    //   editedRelationship.sourceCustomEntityId = customEntity.id;
    // }
    editRelationshipModal = true;
  };

  let addNewField = () => {
    isNewField = true;
    editedField = new FieldDto();
    // if (customEntity && customEntity.fields) {
    //   customEntity.fields = [editedField, ...customEntity.fields];
    // } else if (customEntity) {
    //   customEntity.fields = [editedField];
    // }
    editFieldModal = true;
  };

  /** @param {string} id */
  const deleteRelationship = async (id) => {
    const prom = deleteRelationshipApi(id);
    assignLoader("Deleting relationship", prom);
    await prom;
    reloadParentData();
  };

  /** @param {string} id */
  const deleteField = async (id) => {
    const prom = deleteFieldApi(id);
    assignLoader("Deleting field", prom);
    await prom;
    reloadParentData();
  };

  const saveField = async () => {
    if (!editedField) {
      return;
    }
    const prom = saveFieldApi(editedField, customEntity);
    assignLoader("Saving field", prom);
    await prom;
    editFieldModal = false;
    reloadParentData();
  };
  const saveRelationship = async () => {
    if (!editedRelationship) {
      return;
    }
    const prom = saveRelationshipApi(editedRelationship, customEntity);
    assignLoader("Saving relationship", prom);
    await prom;
    editRelationshipModal = false;
    reloadParentData();
  };

  const deleteCustomEntity = async () => {
    const prom = deleteCustomEntityApi(customEntity);
    assignBlockingLoader("Deleting Entity", prom, formContainer);
    await prom;
    reloadParentData();
  };

  const saveCustomEntity = async () => {
    const prom = saveCustomEntityApi(isNew, customEntity);
    assignBlockingLoader("Saving entity", prom, formContainer);
    const [updatedEntity, error] = await prom;
    if (updatedEntity) {
      customEntity.id = updatedEntity.id;
    }
    isNew = false;
    reloadParentData();
  };
  const applyChangesToDb = () => {
    const prom = applyChangesToDbApi();
    assignBlockingLoader("Updating Db", prom, formContainer);
  };
</script>

<div class="position-relative d-flex flex-column p-3" bind:this={formContainer}>
  <Row class="justify-content-between mb-4">
    <Col md="7">
      <Row class="g-3">
        <Col md="6">
          <FormGroup>
            <Label for="customEntityDisplayName" class="mb-2">
              Display Name
            </Label>
            <Input
              id="customEntityDisplayName"
              placeholder="Name of Entity"
              bind:value={customEntity.displayName}
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label for="customEntityName" class="mb-2">Name</Label>
            <Input
              id="customEntityName"
              disabled={!isNew}
              placeholder="Logical name"
              bind:value={customEntity.name}
            />
          </FormGroup>
        </Col>
        <Col md="12">
          <FormGroup>
            <Label for="customEntityDescription" class="mb-2">Description</Label
            >
            <Input
              type="textarea"
              id="customEntityDescription"
              placeholder="Description"
              bind:value={customEntity.description}
            />
          </FormGroup>
        </Col>
      </Row>
    </Col>
    <Col md="auto" class="d-flex flex-row align-items-start gap-2 mt-3 mt-md-0">
      <Button on:click={applyChangesToDb} outline color="info">
        Apply to DB
      </Button>
      <Button on:click={saveCustomEntity} outline color="success">
        Save Entity
      </Button>
      {#if !isNew}
        <Button on:click={deleteCustomEntity} outline color="danger">
          Delete Entity
        </Button>
      {/if}
    </Col>
  </Row>

  <Row class="g-4">
    <Col md="6" class="d-flex flex-column" style="max-height: 500px;">
      <div
        class="d-flex justify-content-between align-items-center mb-2 p-2 pb-0"
      >
        <h2 class="mb-0 pb-0">Columns</h2>
        <Button
          size="sm"
          color="success"
          outline
          on:click={addNewField}
          disabled={isNew || !customEntity?.id}
          title="Add new column"
        >
          <Icon name="plus-lg" />
        </Button>
      </div>
      {#if customEntity?.fields && customEntity?.fields.length > 0}
        <div
          class="overflow-auto flex-grow-1 border-2 border-gray-100 dark:border-gray-600 rounded"
        >
          <table class="table table-hover">
            <thead class="sticky-top">
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody
              class="table-grup-divider border-gray-100 dark:border-gray-600"
            >
              {#each customEntity.fields as field (field.id || field.name)}
                <tr class="p-1">
                  <td>{field.name}</td>
                  <td>{getTypeName(field.type)}</td>
                  <td>
                    <div class="d-flex gap-1">
                      <Button
                        size="sm"
                        color="success"
                        outline
                        on:click={() => editField(field)}
                        title="Edit field"
                      >
                        <Icon name="pencil-square" />
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        outline
                        on:click={() => deleteField(field.id)}
                        title="Delete field"
                        disabled={field.isSystemField}
                      >
                        <Icon name="trash3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p class="text-muted p-2">No columns defined yet.</p>
      {/if}
    </Col>

    <Col md="6" class="d-flex flex-column" style="max-height: 500px;">
      <div
        class="d-flex justify-content-between align-items-center mb-2 p-2 pb-0"
      >
        <h5 class="mb-0">Relationships</h5>
        <Button
          size="sm"
          color="success"
          outline
          on:click={addNewRelationship}
          disabled={isNew || !customEntity || !customEntity.id}
          title="Add new relationship"
        >
          <Icon name="plus-lg" />
        </Button>
      </div>
      {#if customEntity?.relationships && customEntity?.relationships.length > 0}
        <div
          class="overflow-auto flex-grow-1 border-2 border-gray-100 dark:border-gray-600 rounded"
        >
          <table class="table table-hover">
            <thead class="sticky-top">
              <tr>
                <th>Constraint Name</th>
                <th>Target Entity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each customEntity.relationships as relationship (relationship.id || relationship.constraintName)}
                <tr>
                  <td>{relationship.constraintName}</td>
                  <td>
                    {customEntities.find(
                      (ce) => ce.id === relationship.targetCustomEntityId,
                    )?.displayName || relationship.targetCustomEntityId}
                  </td>
                  <td>
                    <div class="d-flex gap-1">
                      <Button
                        size="sm"
                        outline
                        color="success"
                        on:click={() => editRelationship(relationship)}
                        title="Edit relationship"
                      >
                        <Icon name="pencil-square" />
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        outline
                        on:click={() => deleteRelationship(relationship.id)}
                        title="Delete relationship"
                      >
                        <Icon name="trash3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p class="text-muted p-2">No relationships defined yet.</p>
      {/if}
    </Col>
  </Row>
</div>

<Modal
  body
  isOpen={editFieldModal}
  toggle={() => (editFieldModal = !editFieldModal)}
  size="lg"
  backdrop={false}
  fade={false}
  modalClassName="bg-opacity-15 bg-gray-900 dark:bg-gray-100 dark:bg-opacity-15"
>
  <ModalHeader toggle={() => (editFieldModal = !editFieldModal)}>
    {isNewField ? "Add New Field" : "Edit Field"}
  </ModalHeader>
  <ModalBody>
    {#if editedField}
      <FieldEditForm bind:editedField bind:isNew={isNewField}></FieldEditForm>
    {:else}
      <div>Loading field data or an error occurred.</div>
    {/if}
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={() => (editFieldModal = false)}>
      Cancel
    </Button>
    <Button
      color="primary"
      on:click={saveField}
      disabled={!!editedField?.isSystemField || !editedField}>Save</Button
    >
  </ModalFooter>
</Modal>

<Modal
  body
  isOpen={editRelationshipModal}
  toggle={() => (editRelationshipModal = !editRelationshipModal)}
  size="lg"
  backdrop={false}
  fade={false}
  modalClassName="bg-opacity-15 bg-gray-900 dark:bg-gray-100 dark:bg-opacity-15"
>
  <ModalHeader toggle={() => (editRelationshipModal = !editRelationshipModal)}>
    {isNewRelationship ? "Add New Relationship" : "Edit Relationship"}
  </ModalHeader>
  <ModalBody>
    {#if editedRelationship && customEntity}
      <RelationshipEditForm
        currentEntity={customEntity}
        bind:relationship={editedRelationship}
        {customEntities}
        bind:isNew={isNewRelationship}
      ></RelationshipEditForm>
    {:else}
      <div>Loading relationship data or an error occurred.</div>
    {/if}
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={() => (editRelationshipModal = false)}>
      Cancel
    </Button>
    <Button
      color="primary"
      on:click={saveRelationship}
      disabled={!editedRelationship}
    >
      Save
    </Button>
  </ModalFooter>
</Modal>
