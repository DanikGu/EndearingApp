<script>
  import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "@sveltestrap/sveltestrap";
  import { DndContext, DragOverlay } from "@dnd-kit-svelte/core";
  import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit-svelte/sortable";
  import Column from "../../../components/DataTable/Column.svelte";
  import Droppable from "../../../components/DataTable/Droppable.svelte";
  import { dropAnimation, sensors } from "../../../components/DataTable/DropAnimation.js";
  import ViewDescription from "./viewDescription.js";
  import { getCustomEntities, getCachedCustomEntities, getTypeId } from "@stores/global";
  import { untrack } from "svelte";

  /** @typedef {import('@dnd-kit-svelte/core').DragOverEvent} DragOverEvent */
  /** @typedef {import('@dnd-kit-svelte/core').DragEndEvent} DragEndEvent */
  /** @typedef {import('@dnd-kit-svelte/core').UniqueIdentifier} UniqueIdentifier */
  /** @typedef {import('./viewDescription.js').ColumnDef} ColumnDef */
  /** @typedef {Object} AvailableItem
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
    isOpen = $bindable(false),
    view = $bindable(/** @type {ViewDescription} */ (new ViewDescription())),
    customEntity,
    onViewChange,
  } = $props();

  let allEntities = $state(getCachedCustomEntities());

  $effect(() => {
    getCustomEntities().then((v) => (allEntities = v));
  });

  /** @type {ColumnDef[]} */ let localColumns = $state([]);
  /** @type {AvailableItem[]} */ let localAvailableItems = $state([]);
  /** @type {UniqueIdentifier | null} */ let localActiveId = $state(null);

  let fields_derived = $derived(customEntity?.fields || []);
  let relationships_derived = $derived(customEntity?.relationships || []);

  $effect(() => {
    if (isOpen) {
      localColumns = [...(view.columns || [])];
      untrack(() => { localAvailableItems = buildAvailableItems(); });
    }
  });

  function buildFieldColumnDef(/** @type {any} */ field) {
    const lookupInfo = findLookupInfo(field);
    const dtId = getTypeId("Date and Time");
    const dId = getTypeId("Date");
    const tId = getTypeId("Time");
    return /** @type {ColumnDef} */ ({
      id: field.id || field.name, type: "field", label: field.displayName || field.name,
      fieldName: field.name, field,
      isNameField: field.name === "name" || field.name === "Name",
      lookupEntityName: lookupInfo ? lookupInfo.entityName : undefined,
      lookupNavProp: lookupInfo ? lookupInfo.navProp : undefined,
      optionSetDefId: field.optionSetDefinitionId || undefined,
      isSelect: field.type === getTypeId("Option Set") || field.type === getTypeId("Option Set MultiSelect"),
      isMultiSelect: field.type === getTypeId("Option Set MultiSelect"),
      isDateTime: field.type === dtId, isDateOnly: field.type === dId, isTimeOnly: field.type === tId,
    });
  }

  function findLookupInfo(/** @type {any} */ field) {
    if (!customEntity?.relationships) return null;
    const rel = customEntity.relationships.find((/** @type {any} */ r) => r.sourceFieldId === field.id);
    if (!rel) return null;
    const target = allEntities.find((/** @type {any} */ e) => e.id === rel.referencedCustomEntityId);
    if (!target) return null;
    return { entityName: target.name, navProp: `${field.name}_Etn` };
  }

  function buildAvailableItems() {
    /** @type {AvailableItem[]} */ const items = [];
    const selectedIds = new Set(localColumns.map(c => c.id));
    if (fields_derived) {
      for (const field of fields_derived) {
        if (!selectedIds.has(field.id || field.name)) items.push({ id: field.id || field.name, label: field.displayName || field.name, type: "field", field });
      }
    }
    if (relationships_derived) {
      for (const rel of relationships_derived) {
        const target = allEntities.find((/** @type {any} */ e) => e.id === rel.referencedCustomEntityId);
        if (!target || !target.fields) continue;
        const sourceField = fields_derived?.find((/** @type {any} */ f) => f.id === rel.sourceFieldId);
        const navProp = sourceField ? `${sourceField.name}_Etn` : null;
        if (!navProp) continue;
        /** @type {AvailableItem[]} */ const expandFields = [];
        for (const f of target.fields) {
          const colId = `${navProp}.${f.name}`;
          if (!selectedIds.has(colId)) expandFields.push({ id: colId, label: `${target.displayName || target.name}.${f.displayName || f.name}`, type: "expand", field: f, navigationProp: navProp, targetEntityName: target.name, groupLabel: target.displayName || target.name });
        }
        if (expandFields.length > 0) {
          items.push({ id: `__group_${navProp}`, label: target.displayName || target.name, type: "group", groupLabel: target.displayName || target.name });
          items.push(...expandFields);
        }
      }
    }
    if ((view.aggregates || []).length > 0) {
      const aggNotSelected = view.aggregates.filter((/** @type {any} */ a) => !selectedIds.has(a.id));
      if (aggNotSelected.length > 0) {
        items.push({ id: "__group_aggregates", label: "Aggregates", type: "group", groupLabel: "Aggregates" });
        for (const a of aggNotSelected) {
          items.push({ id: a.id, label: a.label, type: "aggregate", colDef: /** @type {ColumnDef} */ ({ id: a.id, type: "aggregate", label: a.label, fieldName: a.sourceField, collectionNavProp: a.collectionNavProp, sourceField: a.sourceField, aggregateFn: a.fn }) });
        }
      }
    }
    return items;
  }

  function buildColumnDefFromAvailable(/** @type {AvailableItem} */ item) {
    if (item.type === "field" && item.field) return buildFieldColumnDef(item.field);
    if (item.type === "expand") return /** @type {ColumnDef} */ ({ id: `${item.navigationProp}.${item.field?.name}`, type: "expand", label: `${item.targetEntityName || item.navigationProp}.${item.field?.displayName || item.field?.name}`, fieldName: item.field?.name, navigationProp: item.navigationProp, targetEntityName: item.targetEntityName, field: item.field || null });
    if (item.type === "aggregate" && item.colDef) return /** @type {ColumnDef} */ (item.colDef);
    return null;
  }

  function moveToAvailable(/** @type {ColumnDef | AvailableItem} */ col) {
    let colDef = null;
    if ("colDef" in col && col.colDef) colDef = col.colDef;
    else if ("field" in col && col.field && col.type === "field") colDef = buildFieldColumnDef(col.field);
    if (!colDef) return;
    localColumns = localColumns.filter(c => c.id !== colDef.id);
    localAvailableItems = buildAvailableItems();
  }

  function moveToSelected(/** @type {AvailableItem} */ item, /** @type {number | null} */ position = null) {
    const colDef = buildColumnDefFromAvailable(item);
    if (!colDef || localColumns.find(c => c.id === colDef.id)) return;
    if (position !== null && position >= 0) localColumns = localColumns.toSpliced(position, 0, /** @type {ColumnDef} */ (colDef));
    else localColumns = [...localColumns, /** @type {ColumnDef} */ (colDef)];
    localAvailableItems = buildAvailableItems();
  }

  const handleDragOver = (/** @type {DragOverEvent} */ event) => {
    const { active, over } = event;
    if (!over) return;
    const selCol = localColumns.find(c => c.id === active.id);
    const availItem = localAvailableItems.find(i => i.id === active.id);
    if (!selCol && !availItem) return;
    const overSel = localColumns.find(c => c.id === over.id);
    const overTarget = over.id === "available" ? "available" : over.id === "selected" || overSel ? "selected" : null;
    if (!overTarget) return;
    if (selCol && overTarget === "available") { moveToAvailable(selCol); return; }
    if (!selCol && overTarget === "selected" && availItem && availItem.type !== "group") {
      if (overSel) moveToSelected(availItem, localColumns.findIndex(c => c.id === over.id));
      else moveToSelected(availItem);
    }
  };

  const handleDragEnd = (/** @type {DragEndEvent} */ event) => {
    const { active, over } = event;
    if (!over) return;
    const selCol = localColumns.find(c => c.id === active.id);
    const availItem = localAvailableItems.find(i => i.id === active.id);
    const overSel = localColumns.find(c => c.id === over.id);
    if (!overSel && over.id !== "available") return;
    if (overSel) {
      const newIndex = localColumns.findIndex(c => c.id === over.id);
      if (selCol) {
        const oldIndex = localColumns.findIndex(c => c.id === selCol.id);
        if (oldIndex !== -1 && oldIndex !== newIndex) localColumns = arrayMove(localColumns, oldIndex, newIndex);
        localAvailableItems = buildAvailableItems();
      } else if (availItem && availItem.type !== "group") moveToSelected(availItem, newIndex);
    } else if (selCol) moveToAvailable(selCol);
  };

  function handleColumnSave() {
    view = new ViewDescription({ ...view, columns: [...localColumns] });
    isOpen = false;
    onViewChange?.(view);
  }
</script>

<Modal isOpen={isOpen} toggle={() => (isOpen = false)} size="lg">
  <ModalHeader toggle={() => (isOpen = false)}>Select and Order Columns</ModalHeader>
  <ModalBody>
    <DndContext onDragStart={(e) => (localActiveId = e.active.id)} onDragOver={handleDragOver} onDragEnd={handleDragEnd} {sensors}>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="text-lg font-medium mb-2">Available Columns</h3>
          <SortableContext items={localAvailableItems.filter(i => i.type !== "group").map(i => i.id)} strategy={verticalListSortingStrategy}>
            <Droppable id="available">
              <div class="space-y-2">
                {#each localAvailableItems as item (item.id)}
                  {#if item.type === "group"}
                    <div class="text-xs font-bold text-muted dark:text-gray-400 mt-3 mb-1 px-2">{item.groupLabel}</div>
                  {:else}
                    <Column field={{ name: item.id, displayName: item.label }} />
                  {/if}
                {/each}
              </div>
            </Droppable>
          </SortableContext>
        </div>
        <div>
          <h3 class="text-lg font-medium mb-2">Selected Columns</h3>
          <SortableContext items={localColumns.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <Droppable id="selected">
              <div class="space-y-2">
                {#each localColumns as col (col.id)}
                  <Column field={{ name: col.id, displayName: col.label }} />
                {/each}
              </div>
            </Droppable>
          </SortableContext>
        </div>
      </div>
      <DragOverlay {dropAnimation}>
        {#if localActiveId}
          {@const activeCol = [...localColumns, ...localAvailableItems.filter(i => i.type !== "group").map(i => ({ id: i.id, label: i.label }))].find(c => c.id === localActiveId)}
          {#if activeCol}
            <div class="p-2 border rounded-md bg-gray-200 dark:bg-gray-600 dark:text-white cursor-grabbing">{activeCol.label}</div>
          {/if}
        {/if}
      </DragOverlay>
    </DndContext>
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onclick={handleColumnSave}>Save</Button>
    <Button color="secondary" onclick={() => (isOpen = false)}>Cancel</Button>
  </ModalFooter>
</Modal>
