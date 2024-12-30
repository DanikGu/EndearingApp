<script>
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Label,
    Input,
    Textarea,
    Modal,
    Button,
  } from "flowbite-svelte";
  import { getTypeName } from "../../utils/fieldtypesutils";
  import {
    EditOutline,
    TrashBinOutline,
    PlusOutline,
  } from "flowbite-svelte-icons";
  import FieldEditForm from "./fieldEditForm.svelte";
  import { FieldDto, RelationshipDTO } from "@apiclients/src";
  import { assignLoader, assignBlockingLoader } from "../../utils/uiutils";
  import { onMount } from "svelte";
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
  /** @typedef {import('../../apiclient/src/model/RelationshipDTO').default} RelationshipDTO  */

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
  let form;

  /** @param {FieldEntity} field **/
  let editField = (field) => {
    isNewField = false;
    editFieldModal = true;
    editedField = field;
  };

  /** @param {RelationshipDTO} relationship **/
  let editRelationship = (relationship) => {
    isNewRelationship = false;
    editRelationshipModal = true;
    editedRelationship = relationship;
  };

  let addNewRelationship = () => {
    isNewRelationship = true;
    editRelationshipModal = true;
    editedRelationship = new RelationshipDTO();
    customEntity.relationships = [
      editedRelationship,
      ...customEntity.relationships,
    ];
    editedRelationship.sourceCustomEntityId = customEntity.id;
  };

  let addNewField = () => {
    isNewField = true;
    editFieldModal = true;
    editedField = new FieldDto();
    customEntity.fields = [editedField, ...customEntity.fields];
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
    reloadParentData();
  };
  const saveRelationship = async () => {
    if (!editedRelationship) {
      return;
    }
    const prom = saveRelationshipApi(editedRelationship, customEntity);
    assignLoader("Saving relationship", prom);
    await prom;
    reloadParentData();
  };

  const deleteCustomEntity = async () => {
    const prom = deleteCustomEntityApi(customEntity);
    assignBlockingLoader("Deleteing Entity", prom, form);
    await prom;
    reloadParentData();
  };

  const saveCustomEntity = async () => {
    const prom = saveCustomEntityApi(isNew, customEntity);
    assignBlockingLoader("Saving entity", prom, form);
    await prom;
    reloadParentData();
  };
  const applyChangesToDb = () => {
    const prom = applyChangesToDbApi();
    assignBlockingLoader("Updating Db", prom);
  };

  onMount(() => {});
</script>

<div class="relative flex flex-col" bind:this={form}>
  <div class="flex flex-row justify-between">
    <div class="grid grid-cols-2 gap-4">
      <div class="mb-6 max-w-48 p-2">
        <Label for="large-input" class="block mb-2">Display Name</Label>
        <Input
          placeholder="Name of Entity"
          bind:value={customEntity.displayName}
        />
      </div>
      <div class="mb-6 max-w-48 p-2">
        <Label for="large-input" class="block mb-2">Name</Label>
        <Input
          disabled={!isNew}
          placeholder="Logical name"
          bind:value={customEntity.name}
        />
      </div>
      <div class="mb-6 max-w-48 p-2">
        <Label for="large-input" class="block mb-2">Description</Label>
        <Textarea
          placeholder="Description"
          bind:value={customEntity.description}
        />
      </div>
    </div>
    <div class="flex flex-row gap-3 p-2 mb-auto">
      <Button
        on:click={applyChangesToDb}
        class="h-10 mx-0"
        outline
        color="purple"
        >Apply to DB
      </Button>
      <Button
        on:click={saveCustomEntity}
        class="h-10 mx-0"
        outline
        color="green"
        >Save
      </Button>
      <Button
        on:click={deleteCustomEntity}
        class="h-10 mx-0"
        outline
        color="red"
        >Delete
      </Button>
    </div>
  </div>
  <div class="flex flex-row w-full gap-10">
    <div class="flex flex-col max-h-full overflow-auto w-1/2 gap-1 p-2">
      <div class="flex max-w-full justify-between">
        <Label class="text-xl">Columns</Label>
        <Button
          color="alternative"
          on:click={() => addNewField()}
          size="xs"
          disabled={isNew}
        >
          <PlusOutline class="text-xl"></PlusOutline>
        </Button>
      </div>
      {#key customEntity.id}
        <Table hoverable={true} shadow items={customEntity.fields}>
          <TableHead>
            <TableHeadCell class="sticky top-0">Name</TableHeadCell>
            <TableHeadCell class="sticky top-0">Type</TableHeadCell>
            <TableHeadCell class="sticky top-0">Actions</TableHeadCell>
          </TableHead>
          <TableBody tableBodyClass="divide-y">
            <TableBodyRow slot="row" let:item>
              <TableBodyCell>{item.name}</TableBodyCell>
              <TableBodyCell>{getTypeName(item.type)}</TableBodyCell>
              <TableBodyCell>
                <div class="flex flex-row pad-2">
                  <button on:click={() => editField(item)}>
                    <EditOutline />
                  </button>
                  <button on:click={() => deleteField(item.id)}>
                    <TrashBinOutline />
                  </button>
                </div>
              </TableBodyCell>
            </TableBodyRow>
          </TableBody>
        </Table>
      {/key}
    </div>
    <div class="flex flex-col max-h-full overflow-auto w-1/2 gap-1 p-2">
      <div class="flex max-w-full justify-between">
        <Label class="text-xl">Relationships</Label>
        <Button
          color="alternative"
          size="xs"
          disabled={isNew}
          onclick={addNewRelationship}
        >
          <PlusOutline class="text-xl"></PlusOutline>
        </Button>
      </div>
      {#key customEntity.id}
        <Table hoverable={true} shadow items={customEntity.relationships}>
          <TableHead>
            <TableHeadCell class="sticky top-0">Constraint Name</TableHeadCell>
            <TableHeadCell class="sticky top-0">Actions</TableHeadCell>
          </TableHead>
          <TableBody tableBodyClass="divide-y">
            <TableBodyRow slot="row" let:item>
              <TableBodyCell>{item.constraintName}</TableBodyCell>
              <TableBodyCell>
                <div class="flex flex-row pad-2">
                  <button on:click={() => editRelationship(item)}>
                    <EditOutline />
                  </button>
                  <button on:click={() => deleteRelationship(item.id)}>
                    <TrashBinOutline />
                  </button>
                </div>
              </TableBodyCell>
            </TableBodyRow>
          </TableBody>
        </Table>
      {/key}
    </div>
  </div>
</div>
<Modal title="Edit Field" bind:open={editFieldModal} autoclose>
  {#if !!editedField}
    <FieldEditForm bind:editedField bind:isNew={isNewField}></FieldEditForm>
  {:else}
    <div>Something went wrong</div>
  {/if}
  <svelte:fragment slot="footer">
    <Button color="dark">Cancel</Button>
    <Button on:click={saveField} disabled={!!editedField?.isSystemField}>
      Save
    </Button>
  </svelte:fragment>
</Modal>
<Modal title="Edit Constraint" bind:open={editRelationshipModal} autoclose>
  {#if !!editedRelationship}
    <RelationshipEditForm
      currentEntity={customEntity}
      relationship={editedRelationship}
      {customEntities}
      isNew={isNewRelationship}
    ></RelationshipEditForm>
  {:else}
    <div>Something went wrong</div>
  {/if}
  <svelte:fragment slot="footer">
    <Button color="dark">Cancel</Button>
    <Button on:click={saveRelationship} disabled={!isNewRelationship}>
      Save
    </Button>
  </svelte:fragment>
</Modal>
