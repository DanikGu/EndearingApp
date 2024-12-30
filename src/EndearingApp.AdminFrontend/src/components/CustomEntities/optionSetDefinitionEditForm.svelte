<script>
  import {
    Label,
    Button,
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableBodyRow,
    TableBodyCell,
    Modal,
    Input,
  } from "flowbite-svelte";

  import {
    PlusOutline,
    EditOutline,
    TrashBinOutline,
  } from "flowbite-svelte-icons";

  export let optionSetDefinition = {
    id: "",
    name: "",
    isGlobal: false,
    options: [],
  };

  let showEditModal = false;

  let editForm = {
    id: "",
    value: 0,
    displayName: "",
    name: "",
    description: "",
  };

  function addNewOption() {
    console.log("Add new option");
  }

  function editOption(option) {
    editForm = { ...option };
    showEditModal = true;
  }

  function closeEditModal() {
    showEditModal = false;
  }

  function saveRelationship() {
    const index = optionSetDefinition.options.findIndex(
      (o) => o.id === editForm.id,
    );
    if (index !== -1) {
      optionSetDefinition.options[index] = { ...editForm };
    }

    showEditModal = false;

    console.log("Saved:", editForm);
  }

  function deleteOption(optionId) {
    console.log("Delete option with id:", optionId);
  }
</script>

<div class="flex max-w-full justify-between mb-4">
  <Label class="text-xl">{optionSetDefinition.name}</Label>
  <Button color="alternative" size="xs" on:click={addNewOption}>
    <PlusOutline class="text-xl" />
  </Button>
</div>

{#key optionSetDefinition.id}
  <Table hoverable={true} shadow items={optionSetDefinition.options}>
    <TableHead>
      <TableHeadCell class="sticky top-0">Value</TableHeadCell>
      <TableHeadCell class="sticky top-0">Display Name</TableHeadCell>
      <TableHeadCell class="sticky top-0">Name</TableHeadCell>
      <TableHeadCell class="sticky top-0">Description</TableHeadCell>
      <TableHeadCell class="sticky top-0">Actions</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      <TableBodyRow slot="row" let:item>
        <TableBodyCell>{item.value}</TableBodyCell>
        <TableBodyCell>{item.displayName}</TableBodyCell>
        <TableBodyCell>{item.name}</TableBodyCell>
        <TableBodyCell>{item.description}</TableBodyCell>
        <TableBodyCell>
          <div class="flex flex-row space-x-2">
            <button on:click={() => editOption(item)}>
              <EditOutline />
            </button>
            <button on:click={() => deleteOption(item.id)}>
              <TrashBinOutline />
            </button>
          </div>
        </TableBodyCell>
      </TableBodyRow>
    </TableBody>
  </Table>
{/key}

<Modal bind:open={showEditModal} on:close={closeEditModal} title="Edit Option">
  <div class="space-y-4">
    <Label>Value</Label>
    <Input type="number" bind:value={editForm.value} />
    <Label>Display Name</Label>
    <Input bind:value={editForm.displayName} />
    <Label>Name</Label>
    <Input bind:value={editForm.name} />
    <Label>Description</Label>
    <Input bind:value={editForm.description} />
  </div>

  <svelte:fragment slot="footer">
    <Button color="dark" on:click={closeEditModal}>Cancel</Button>
    <Button on:click={saveRelationship} disabled={!isNewRelationship}>
      Save
    </Button>
  </svelte:fragment>
</Modal>
