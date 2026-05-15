<script>
  import {
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
  import Column from "../../../components/DataTable/Column.svelte";

  import Droppable from "../../../components/DataTable/Droppable.svelte";

  import {
    dropAnimation,
    sensors,
  } from "../../../components/DataTable/DropAnimation.js";
  import { getTypeId } from "@utils/fieldtypesutils";
  import { untrack } from "svelte";

  /** @typedef {import('@dnd-kit-svelte/core').DragOverEvent } DragOverEvent */
  /** @typedef {import('@dnd-kit-svelte/core').DragEndEvent } DragEndEvent */
  /** @typedef {import('@dnd-kit-svelte/core').UniqueIdentifier } UniqueIdentifier */

  /**
   * @typedef {Object} ColumnDef
   * @property {string} id
   * @property {'field' | 'expand' | 'aggregate'} type
   * @property {string} label
   * @property {string} [fieldName]
   * @property {any} [field]
   * @property {string} [navigationProp]
   * @property {string} [targetEntityName]
   * @property {boolean} [isNameField]
   * @property {string} [lookupEntityName]
   * @property {string} [lookupNavProp]
   * @property {string} [optionSetDefId]
   * @property {boolean} [isSelect]
   * @property {boolean} [isMultiSelect]
   * @property {boolean} [isDateTime]
   * @property {boolean} [isDateOnly]
   * @property {boolean} [isTimeOnly]
   * @property {string} [collectionNavProp]
   * @property {string} [sourceField]
   * @property {string} [aggregateFn]
   */

  /**
   * @typedef {Object} AvailableItem
   * @property {string} id
   * @property {string} label
   * @property {'field' | 'group' | 'expand' | 'aggregate'} type
   * @property {any} [field]
   * @property {string} [groupLabel]
   * @property {string} [navigationProp]
   * @property {string} [targetEntityName]
   * @property {ColumnDef} [colDef]
   */

  let {
    show = false,
    fields = [],
    relationships = [],
    allEntities = [],
    columns = $bindable([]),
    aggregates = $bindable(
      /** @type {{ id: string, label: string, collectionNavProp: string, sourceField: string, fn: string }[]} */ ([]),
    ),
    onClose,
    columnsChanged,
  } = $props();

  /** @type {ColumnDef[]} */
  let selectedColumns = $state([]);

  /** @type {AvailableItem[]} */
  let availableItems = $state([]);

  /** @type {UniqueIdentifier | null} */
  let activeId = $state(null);

  $effect(() => {
    if (show) {
      selectedColumns = [...columns];
      untrack(() => {
        availableItems = buildAvailableItems();
      });
    }
  });

  /** @param {any} field
   *  @returns {ColumnDef} */
  function buildFieldColumnDef(field) {
    const lookupInfo = findLookupInfo(field);
    const dtId = getTypeId("Date and Time");
    const dId = getTypeId("Date");
    const tId = getTypeId("Time");
    return {
      id: field.id || field.name,
      type: "field",
      label: field.displayName || field.name,
      fieldName: field.name,
      field,
      isNameField: field.name === "name" || field.name === "Name",
      lookupEntityName: lookupInfo ? lookupInfo.entityName : undefined,
      lookupNavProp: lookupInfo ? lookupInfo.navProp : undefined,
      optionSetDefId: field.optionSetDefinitionId || undefined,
      isSelect:
        field.type === getTypeId("Option Set") ||
        field.type === getTypeId("Option Set MultiSelect"),
      isMultiSelect: field.type === getTypeId("Option Set MultiSelect"),
      isDateTime: field.type === dtId,
      isDateOnly: field.type === dId,
      isTimeOnly: field.type === tId,
    };
  }

  /** @param {any} field
   *  @returns {{ entityName: string, navProp: string } | null} */
  function findLookupInfo(field) {
    if (!relationships) return null;
    const rel = relationships.find(
      (/** @type {any} */ r) => r.sourceFieldId === field.id,
    );
    if (!rel) return null;
    const target = allEntities.find(
      (/** @type {any} */ e) => e.id === rel.referencedCustomEntityId,
    );
    if (!target) return null;
    return { entityName: target.name, navProp: `${field.name}_Etn` };
  }

  /** @param {any} colDef
   *  @returns {ColumnDef} */
  function buildExpandColumnDef(colDef) {
    return {
      id: `${colDef.navigationProp}.${colDef.fieldName}`,
      type: "expand",
      label: `${colDef.targetEntityName || colDef.navigationProp}.${colDef.fieldLabel || colDef.fieldName}`,
      fieldName: colDef.fieldName,
      navigationProp: colDef.navigationProp,
      targetEntityName: colDef.targetEntityName,
      field: colDef.field || null,
    };
  }

  function buildAvailableItems() {
    /** @type {AvailableItem[]} */
    const items = [];
    const selectedIds = new Set(selectedColumns.map((c) => c.id));

    if (fields) {
      for (const field of fields) {
        if (!selectedIds.has(field.id || field.name)) {
          items.push({
            id: field.id || field.name,
            label: field.displayName || field.name,
            type: "field",
            field,
          });
        }
      }
    }

    if (relationships) {
      for (const rel of relationships) {
        const target = allEntities.find(
          (/** @type {any} */ e) => e.id === rel.referencedCustomEntityId,
        );
        if (!target || !target.fields) continue;

        const sourceField = fields?.find(
          (/** @type {any} */ f) => f.id === rel.sourceFieldId,
        );
        const navProp = sourceField ? `${sourceField.name}_Etn` : null;
        if (!navProp) continue;

        /** @type {AvailableItem[]} */
        const expandFields = [];

        for (const f of target.fields) {
          const colId = `${navProp}.${f.name}`;
          if (!selectedIds.has(colId)) {
            expandFields.push({
              id: colId,
              label: `${target.displayName || target.name}.${f.displayName || f.name}`,
              type: "expand",
              field: f,
              navigationProp: navProp,
              targetEntityName: target.name,
              groupLabel: target.displayName || target.name,
            });
          }
        }

        if (expandFields.length > 0) {
          items.push({
            id: `__group_${navProp}`,
            label: target.displayName || target.name,
            type: "group",
            groupLabel: target.displayName || target.name,
          });
          items.push(...expandFields);
        }
      }
    }

    if (aggregates.length > 0) {
      const aggNotSelected = aggregates.filter(
        (/** @type {any} */ a) => !selectedIds.has(a.id),
      );
      if (aggNotSelected.length > 0) {
        items.push({
          id: "__group_aggregates",
          label: "Aggregates",
          type: "group",
          groupLabel: "Aggregates",
        });
        for (const a of aggNotSelected) {
          items.push({
            id: a.id,
            label: a.label,
            type: "aggregate",
            colDef: /** @type {ColumnDef} */ ({
              id: a.id,
              type: "aggregate",
              label: a.label,
              fieldName: a.sourceField,
              collectionNavProp: a.collectionNavProp,
              sourceField: a.sourceField,
              aggregateFn: a.fn,
            }),
          });
        }
      }
    }

    return items;
  }

  /** @param {AvailableItem} item
   *  @returns {ColumnDef | null} */
  function buildColumnDefFromAvailable(item) {
    if (item.type === "field" && item.field) {
      return buildFieldColumnDef(item.field);
    }
    if (item.type === "expand") {
      return buildExpandColumnDef({
        navigationProp: item.navigationProp,
        fieldName: item.field?.name,
        fieldLabel: item.field?.displayName,
        targetEntityName: item.targetEntityName,
        field: item.field,
      });
    }
    if (item.type === "aggregate" && item.colDef) {
      return /** @type {ColumnDef} */ (item.colDef);
    }
    return null;
  }

  /** @param {ColumnDef | AvailableItem} col */
  function moveToAvailable(col) {
    /** @type {ColumnDef | null} */
    let colDef = null;
    if ("colDef" in col && col.colDef) {
      colDef = /** @type {ColumnDef} */ (col.colDef);
    } else if ("field" in col && col.field && col.type === "field") {
      colDef = buildFieldColumnDef(/** @type {any} */ (col.field));
    }
    if (!colDef) return;

    selectedColumns = selectedColumns.filter((c) => c.id !== colDef.id);
    availableItems = buildAvailableItems();
  }

  /** @param {AvailableItem} item
   *  @param {number | null} position */
  function moveToSelected(item, position = null) {
    const colDef = buildColumnDefFromAvailable(item);
    if (!colDef) return;

    if (selectedColumns.find((c) => c.id === colDef.id)) return;

    if (position !== null && position >= 0) {
      selectedColumns = selectedColumns.toSpliced(position, 0, colDef);
    } else {
      selectedColumns = [...selectedColumns, colDef];
    }
    availableItems = buildAvailableItems();
  }

  /** @param {DragOverEvent} event */
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const selCol = selectedColumns.find((c) => c.id === active.id);
    const availItem = availableItems.find((i) => i.id === active.id);
    if (!selCol && !availItem) return;

    const inSelected = !!selCol;
    const overSel = selectedColumns.find((c) => c.id === over.id);
    const overTarget =
      over.id === "available"
        ? "available"
        : over.id === "selected" || overSel
          ? "selected"
          : null;
    if (!overTarget) return;

    if (inSelected && overTarget === "available") {
      moveToAvailable(selCol);
      return;
    }

    if (
      !inSelected &&
      overTarget === "selected" &&
      availItem &&
      availItem.type !== "group"
    ) {
      if (overSel) {
        const newIndex = selectedColumns.findIndex((c) => c.id === over.id);
        moveToSelected(availItem, newIndex);
      } else {
        moveToSelected(availItem);
      }
    }
  };

  /** @param {DragEndEvent} event */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const selCol = selectedColumns.find((c) => c.id === active.id);
    const availItem = availableItems.find((i) => i.id === active.id);
    const overSel = selectedColumns.find((c) => c.id === over.id);

    if (!overSel && over.id !== "available") return;

    if (overSel) {
      const newIndex = selectedColumns.findIndex((c) => c.id === over.id);
      if (selCol) {
        const oldIndex = selectedColumns.findIndex((c) => c.id === selCol.id);
        if (oldIndex !== -1 && oldIndex !== newIndex) {
          selectedColumns = arrayMove(selectedColumns, oldIndex, newIndex);
        }
        availableItems = buildAvailableItems();
      } else if (availItem && availItem.type !== "group") {
        moveToSelected(availItem, newIndex);
      }
    } else if (selCol) {
      moveToAvailable(selCol);
    }
  };

  const handleSave = () => {
    columns = [...selectedColumns];
    console.table(columns);
    columnsChanged?.();
    onClose?.();
  };

  const handleClose = () => {
    onClose?.();
  };
</script>

<Modal isOpen={show} toggle={handleClose} size="lg">
  <ModalHeader toggle={handleClose}>Select and Order Columns</ModalHeader>
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
            items={availableItems
              .filter((i) => i.type !== "group")
              .map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <Droppable id="available">
              <div class="space-y-2">
                {#each availableItems as item (item.id)}
                  {#if item.type === "group"}
                    <div
                      class="text-xs font-bold text-muted dark:text-gray-400 mt-3 mb-1 px-2"
                    >
                      {item.groupLabel}
                    </div>
                  {:else}
                    <Column
                      field={{ name: item.id, displayName: item.label }}
                    />
                  {/if}
                {/each}
              </div>
            </Droppable>
          </SortableContext>
        </div>
        <div>
          <h3 class="text-lg font-medium mb-2">Selected Columns</h3>
          <SortableContext
            items={selectedColumns.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <Droppable id="selected">
              <div class="space-y-2">
                {#each selectedColumns as col (col.id)}
                  <Column field={{ name: col.id, displayName: col.label }} />
                {/each}
              </div>
            </Droppable>
          </SortableContext>
        </div>
      </div>
      <DragOverlay {dropAnimation}>
        {#if activeId}
          {@const activeCol = [
            ...selectedColumns,
            ...availableItems
              .filter((i) => i.type !== "group")
              .map((i) => ({ id: i.id, label: i.label })),
          ].find((c) => c.id === activeId)}
          {#if activeCol}
            <div
              class="p-2 border rounded-md bg-gray-200 dark:bg-gray-600 dark:text-white cursor-grabbing"
            >
              {activeCol.label}
            </div>
          {/if}
        {/if}
      </DragOverlay>
    </DndContext>
  </ModalBody>
  <ModalFooter>
    <Button color="primary" on:click={handleSave}>Save</Button>
    <Button color="secondary" on:click={handleClose}>Cancel</Button>
  </ModalFooter>
</Modal>
