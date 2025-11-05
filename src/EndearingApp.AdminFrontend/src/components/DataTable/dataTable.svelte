<script>
  import {
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "@sveltestrap/sveltestrap";
  import { DndContext, DragOverlay } from "@dnd-kit-svelte/core";
  import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
  } from "@dnd-kit-svelte/sortable";
  import Column from "./Column.svelte";
  import Droppable from "./Droppable.svelte";
  import { dropAnimation, sensors } from "./DropAnimation.js";
  import { crossfade } from "svelte/transition";

  import {
    CustomeEntityDTO,
    FieldDto,
    OptionSetDefinitionDTO,
  } from "@apiclients/src";

  /** @typedef {import('@dnd-kit-svelte/core').DragOverEvent } DragOverEvent   */
  /** @typedef {import('@dnd-kit-svelte/core').DragEndEvent } DragEndEvent    */
  /** @typedef {import('@dnd-kit-svelte/core').UniqueIdentifier } UniqueIdentifier */

  /** @type {any[]} */
  export let data = [];

  /** @type {CustomeEntityDTO} */
  export let customEntity;

  /** @type {OptionSetDefinitionDTO[]} */
  export let optionSets = [];

  /** @type {boolean} */
  let modal = false;

  /** @type {FieldDto[]} */
  let orderedColumns = [];

  /** @type {FieldDto[]} */
  let availableColumns = [];

  /** @type {FieldDto[]} */
  let selectedColumns = [];

  /** @type {UniqueIdentifier | null} */
  let activeId = null;

  $: if (customEntity?.fields && orderedColumns.length === 0) {
    orderedColumns = [...customEntity.fields];
  }

  /**
   * @function
   * @description Toggle the column management modal.
   */
  const toggle = () => {
    if (!modal) {
      const selectedNames = new Set(orderedColumns.map((f) => f.name));
      selectedColumns = [...orderedColumns];
      availableColumns = (customEntity.fields || []).filter(
        (/** @type {any} */ f) => !selectedNames.has(f.name),
      );
    }
    modal = !modal;
  };

  /**
   * @function
   * @description Save selected/ordered columns.
   */
  const handleSave = () => {
    orderedColumns = [...selectedColumns];
    modal = false;
  };

  /** @param {DragOverEvent} event */
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    let selectedColumn = selectedColumns.find((x) => x.name == active.id);
    let avaliableColumn = availableColumns.find((x) => x.name == active.id);

    if (!selectedColumn && !avaliableColumn) {
      return;
    }

    if (over.id == "available" && selectedColumn) {
      moveToAvaliable(selectedColumn);
      return;
    }

    if (over.id == "selected" && avaliableColumn) {
      moveToSelected(avaliableColumn);
      return;
    }
    const overColAvaliable = availableColumns.find((x) => x.name === over.id);
    const overColSelected = selectedColumns.find((x) => x.name === over.id);

    if (!overColAvaliable && !overColSelected) {
      return;
    }
    let targetArray = !!overColSelected ? selectedColumns : availableColumns;
    const newIndex = targetArray.findIndex((x) => x.name === over.id);

    if (!!overColSelected && !!avaliableColumn) {
      moveToSelected(avaliableColumn, newIndex);
    } else if (!overColSelected && !!selectedColumn) {
      moveToAvaliable(selectedColumn, newIndex);
    }
  };
  /** @param {DragEndEvent} event */
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    let selectedColumn = selectedColumns.find((x) => x.name == active.id);
    let avaliableColumn = availableColumns.find((x) => x.name == active.id);

    const overColAvaliable = availableColumns.find((x) => x.name === over.id);
    const overColSelected = selectedColumns.find((x) => x.name === over.id);

    if (!overColAvaliable && !overColSelected) {
      return;
    }

    let targetArray = !!overColSelected ? selectedColumns : availableColumns;
    const newIndex = targetArray.findIndex((x) => x.name === over.id);

    if (!!overColSelected) {
      moveToSelected(
        selectedColumn ?? avaliableColumn ?? new FieldDto(),
        newIndex,
      );
    } else {
      moveToAvaliable(
        selectedColumn ?? avaliableColumn ?? new FieldDto(),
        newIndex,
      );
    }
  };
  /** @param {FieldDto} column
   *  @param {number | null} position*/
  const moveToAvaliable = (column, position = null) => {
    const isAlreadyThere = availableColumns.find((x) => x == column);
    if (position === null) {
      if (!isAlreadyThere) {
        availableColumns = [...availableColumns, column];
      }
    } else {
      if (isAlreadyThere) {
        const currentIndex = availableColumns.indexOf(column);
        availableColumns = arrayMove(availableColumns, currentIndex, position);
      } else {
        availableColumns = availableColumns.toSpliced(position, 0, column);
      }
    }
    const isInTheSelected = selectedColumns.find((x) => x == column);
    if (isInTheSelected) {
      selectedColumns = [...selectedColumns.filter((x) => x != column)];
    }
  };
  /** @param {FieldDto} column
   *  @param {number | null} position*/
  const moveToSelected = (column, position = null) => {
    const isAlreadyThere = selectedColumns.find((x) => x == column);
    if (position === null) {
      if (!isAlreadyThere) {
        selectedColumns = [...selectedColumns, column];
      }
    } else {
      if (isAlreadyThere) {
        const currentIndex = selectedColumns.indexOf(column);
        selectedColumns = arrayMove(selectedColumns, currentIndex, position);
      } else {
        selectedColumns = selectedColumns.toSpliced(position, 0, column);
      }
    }
    const isInAvaliable = availableColumns.find((x) => x == column);
    if (isInAvaliable) {
      availableColumns = [...availableColumns.filter((x) => x != column)];
    }
  };
</script>

<div>
  <Button color="primary" on:click={toggle}>Manage Columns</Button>

  <Modal isOpen={modal} {toggle} size="lg">
    <ModalHeader {toggle}>Select and Order Columns</ModalHeader>
    <ModalBody>
      <DndContext
        onDragStart={(e) => (activeId = e.active.id)}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        {sensors}
      >
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="text-lg font-medium mb-2">Available Columns</h3>
            <SortableContext
              items={availableColumns.map((f) => f.name)}
              strategy={verticalListSortingStrategy}
            >
              <Droppable id="available">
                <div class="space-y-2">
                  {#each availableColumns as field (field.name)}
                    <Column {field} />
                  {/each}
                </div>
              </Droppable>
            </SortableContext>
          </div>
          <div>
            <h3 class="text-lg font-medium mb-2">Selected Columns</h3>
            <SortableContext
              items={selectedColumns.map((f) => f.name)}
              strategy={verticalListSortingStrategy}
            >
              <Droppable id="selected">
                <div class="space-y-2">
                  {#each selectedColumns as field (field.name)}
                    <Column {field} />
                  {/each}
                </div>
              </Droppable>
            </SortableContext>
          </div>
        </div>
        <DragOverlay {dropAnimation}>
          {#if activeId}
            {@const activeField = customEntity.fields.find(
              (/** @type {any} */ f) => f.name === activeId,
            )}
            {#if activeField}
              <div class="p-2 border rounded-md bg-gray-200 cursor-grabbing">
                {activeField.displayName}
              </div>
            {/if}
          {/if}
        </DragOverlay>
      </DndContext>
    </ModalBody>

    <ModalFooter>
      <Button color="primary" on:click={handleSave}>Save</Button>
      <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
  </Modal>

  <!-- Main Table -->
  <div class="overflow-x-auto mt-4">
    <Table bordered>
      <thead>
        <tr>
          {#each orderedColumns as column (column.name)}
            <th class="whitespace-nowrap" title={column.name}>
              {column.displayName}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#if data.length === 0}
          <tr>
            <td colspan={orderedColumns.length} class="text-center p-4">
              No data available.
            </td>
          </tr>
        {:else}
          {#each data as row}
            <tr>
              {#each orderedColumns as column}
                <td>{row[column.name]}</td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </Table>
  </div>
</div>

<style>
  .cursor-grab:active {
    cursor: grabbing;
  }
</style>
