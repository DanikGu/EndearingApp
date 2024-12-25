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
  import {
    ActionApi,
    CustomEntitiesApi,
    FieldDto,
    FieldsApi,
    RelationshipDTO,
    RelationshipsApi,
  } from "@apiclients/src";
  import {
    assignLoader,
    assignBlockingLoader,
    alertError,
    alertSuccsess,
  } from "../../utils/uiutils";
  import { onMount } from "svelte";
  import RelationshipEditForm from "./relationshipEditForm.svelte";

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
  const deleteRelationship = (id) => {
    console.log(id);
    const prom = new Promise((res, rej) => {
      const api = new RelationshipsApi();
      // @ts-ignore
      let callBack = (error) => {
        if (error) {
          alertError(
            "Error while deleteing field. Changes didn't applied",
            null,
          );
        } else {
          alertSuccsess("Succsess while deleting relationship", null);
        }
        res(true);
        reloadParentData();
      };
      try {
        api.apiRelationshipsIdDelete(id, callBack);
      } catch (ex) {
        rej(ex);
      }
    });
    assignLoader("Deleting field", prom);
  };

  /** @param {string} id */
  const deleteField = (id) => {
    console.log(id);
    const prom = new Promise((res, rej) => {
      const api = new FieldsApi();
      // @ts-ignore
      let callBack = (error) => {
        if (error) {
          alertError(
            "Error while deleteing field. Changes didn't applied",
            null,
          );
        } else {
          alertSuccsess("Succsess while deleting field", null);
        }
        res(true);
        reloadParentData();
      };
      try {
        api.apiFieldsIdDelete(id, callBack);
      } catch (ex) {
        rej(ex);
      }
    });
    assignLoader("Deleting field", prom);
  };

  const saveField = () => {
    const prom = new Promise((res, rej) => {
      const api = new FieldsApi();
      // @ts-ignore
      let callBack = (error, response) => {
        if (error) {
          alertError("Error while saving field. Changes didn't applied", null);
        } else {
          alertSuccsess("Succsess while saving field", null);
        }
        res(true);
        reloadParentData();
      };
      try {
        if (editedField?.id) {
          api.apiFieldsPatch(
            { id: editedField?.id, fieldDelta: JSON.stringify(editedField) },
            callBack,
          );
        } else {
          // @ts-ignore
          editedField.CustomEntityId = customEntity.id;
          api.apiFieldsPost({ body: editedField }, callBack);
        }
      } catch (ex) {
        rej(ex);
      }
    });
    assignLoader("Saving field", prom);
  };
  const saveRelationship = () => {
    const prom = new Promise((res, rej) => {
      const api = new RelationshipsApi();
      // @ts-ignore
      let callBack = (error, response) => {
        if (error) {
          alertError("Error while saving field. Changes didn't applied", null);
        } else {
          alertSuccsess("Succsess while saving field", null);
        }
        res(true);
        reloadParentData();
      };
      try {
        // @ts-ignore
        editedRelationship.CustomEntityId = customEntity.id;
        api.apiRelationshipsPost({ body: editedRelationship }, callBack);
      } catch (ex) {
        rej(ex);
      }
    });
    assignLoader("Saving relationship", prom);
  };

  const deleteCustomEntity = () => {
    const prom = new Promise((res, rej) => {
      const api = new CustomEntitiesApi();
      // @ts-ignore
      let callBack = function (error, response) {
        try {
          if (error) {
            alertError(
              "Error while deleting custom entity. Changes didn't applied",
              null,
            );
          } else {
            alertSuccsess("Succsess while deleting custom entity", null);
          }
          if (reloadParentData) {
            reloadParentData();
          }
          res(true);
        } catch (ex) {
          rej(ex);
        }
      };
      try {
        api.apiCustomEntitiesIdDelete(customEntity.id, callBack);
      } catch (ex) {
        rej(ex);
      }
    });

    assignBlockingLoader("Deleteing Entity", prom, form);
  };

  const saveCustomEntity = () => {
    const prom = new Promise((res, rej) => {
      const api = new CustomEntitiesApi();
      // @ts-ignore
      let callBack = function (error, response) {
        try {
          if (error) {
            alertError(
              "Error while saving custom entity. Changes didn't applied",
            );
          } else {
            alertSuccsess("Succsess while saving custom entity");
          }
          if (response) {
            if (isNew) {
              customEntity = response;
              isNew = false;
            }
          }
          if (reloadParentData) {
            reloadParentData();
          }
          res(true);
        } catch (ex) {
          rej(ex);
        }
      };
      try {
        if (isNew) {
          let newEtn = {
            Name: customEntity.name,
            DisplayName: customEntity.displayName,
            Description: customEntity.description,
          };
          api.apiCustomEntitiesPost({ body: newEtn }, callBack);
        } else {
          api.apiCustomEntitiesIdPut(
            customEntity.id,
            { body: customEntity },
            callBack,
          );
        }
      } catch (ex) {
        rej(ex);
      }
    });

    assignBlockingLoader("Saving entity", prom, form);
    console.log("Saving entity", prom);
  };
  const applyChangesToDb = () => {
    const prom = new Promise((res, rej) => {
      try {
        // @ts-ignore
        let callBack = (error, response) => {
          if (error) {
            alertError("Db Update Failed");
          } else {
            alertSuccsess("Db Structure Update Succsessfully");
          }
          res(true);
        };
        let api = new ActionApi();
        api.apiActionUpdateDbStructurePost(callBack);
      } catch {
        rej();
      }
    });

    assignBlockingLoader("Updating Db", prom, document.body);
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
    <Button on:click={saveRelationship} disabled={!isNewRelationship}
      >Save</Button
    >
  </svelte:fragment>
</Modal>
