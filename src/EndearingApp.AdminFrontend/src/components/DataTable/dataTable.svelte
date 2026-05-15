<script>
  import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "@sveltestrap/sveltestrap";
import QueryBuilder from "../../lib/clientComponents/queryBuilder/components/queryBuilder.svelte";
import { ConditionGroup } from "../../lib/clientComponents/queryBuilder/logic/typeDefinitions";
  import { DndContext, DragOverlay } from "@dnd-kit-svelte/core";
  import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
  } from "@dnd-kit-svelte/sortable";
  import Column from "./Column.svelte";
  import Droppable from "./Droppable.svelte";
  import { dropAnimation, sensors } from "./DropAnimation.js";
  import { ResizableColumns } from "svelte-resizable-columns";
  import { getTypeId } from "@utils/fieldtypesutils";
  import { getOptionSets, getCustomEntities, userSettings } from "@stores/global";

  const resizeAction = /** @type {any} */ (ResizableColumns);

  /** @typedef {import('@dnd-kit-svelte/core').DragOverEvent } DragOverEvent */
  /** @typedef {import('@dnd-kit-svelte/core').DragEndEvent } DragEndEvent */
  /** @typedef {import('@dnd-kit-svelte/core').UniqueIdentifier } UniqueIdentifier */

  /**
   * @typedef {Object} ExpandDef
   * @property {string} navigationProp
   * @property {string[]} select
   */

  /**
   * @typedef {Object} ColumnDef
   * @property {string} id
   * @property {'field' | 'expand'} type
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
   * @property {boolean} [isDateTime]
   * @property {boolean} [isDateOnly]
   * @property {boolean} [isTimeOnly]
   */

  /**
   * @typedef {Object} AvailableItem
   * @property {string} id
   * @property {string} label
   * @property {'field' | 'group' | 'expand'} type
   * @property {any} [field]
   * @property {string} [groupLabel]
   * @property {string} [navigationProp]
   * @property {string} [targetEntityName]
   * @property {ColumnDef} [colDef]
   */

  let { data = [], customEntity, expands = $bindable([]), rootQuery = $bindable() } = $props();

  /** @type {boolean} */
  let modal = $state(false);

  let filterModal = $state(false);

  const openAddNew = () => {
    if (entityName) {
      const currentPath = window.location.pathname;
      const appId = currentPath.split('/')[2] || '00000000-0000-0000-0000-000000000000';
      window.location.href = `/app/${appId}/${entityName}/edit`;
    }
  };

  /** @type {ColumnDef[]} */
  let orderedColumns = $state([]);

  /** @type {AvailableItem[]} */
  let availableItems = $state([]);

  /** @type {ColumnDef[]} */
  let selectedColumns = $state([]);

  /** @type {UniqueIdentifier | null} */
  let activeId = $state(null);

  /** @type {any[]} */
  let optionSetDefs = $state([]);

  /** @type {any[]} */
  let allEntities = $state([]);

  $effect(() => {
    getOptionSets().then(v => { if (v) optionSetDefs = v; });
    getCustomEntities().then(v => { if (v) allEntities = v; });
  });

  const entityName = $derived(customEntity?.name || '');

  let prevAllEntitiesLen = $state(0);

  $effect(() => {
    const len = allEntities.length;
    if (customEntity?.fields && (orderedColumns.length === 0 || len !== prevAllEntitiesLen)) {
      prevAllEntitiesLen = len;
      orderedColumns = customEntity.fields.map(buildFieldColumnDef);
    }
  });

  $effect(() => {
    /** @type {Record<string, { navigationProp: string, select: string[] }>} */
    const expandMap = {};
    for (const col of orderedColumns) {
      if (col.type === 'expand' && col.navigationProp && col.fieldName) {
        if (!expandMap[col.navigationProp]) {
          expandMap[col.navigationProp] = { navigationProp: col.navigationProp, select: [] };
        }
        if (!expandMap[col.navigationProp].select.includes(col.fieldName)) {
          expandMap[col.navigationProp].select.push(col.fieldName);
        }
      }
    }
    expands = Object.values(expandMap);
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
      type: 'field',
      label: field.displayName || field.name,
      fieldName: field.name,
      field,
      isNameField: field.name === 'name' || field.name === 'Name',
      lookupEntityName: lookupInfo ? lookupInfo.entityName : undefined,
      lookupNavProp: lookupInfo ? lookupInfo.navProp : undefined,
      optionSetDefId: field.optionSetDefinitionId || undefined,
      isSelect: field.type === getTypeId("Option Set") || field.type === getTypeId("Option Set MultiSelect"),
      isDateTime: field.type === dtId,
      isDateOnly: field.type === dId,
      isTimeOnly: field.type === tId,
    };
  }

  /** @param {any} colDef
   *  @returns {ColumnDef} */
  function buildExpandColumnDef(colDef) {
    return {
      id: `${colDef.navigationProp}.${colDef.fieldName}`,
      type: 'expand',
      label: `${colDef.targetEntityName || colDef.navigationProp}.${colDef.fieldLabel || colDef.fieldName}`,
      fieldName: colDef.fieldName,
      navigationProp: colDef.navigationProp,
      targetEntityName: colDef.targetEntityName,
      field: colDef.field || null,
    };
  }

  /** @param {any} field
   *  @returns {{ entityName: string, navProp: string } | null} */
  function findLookupInfo(field) {
    if (!customEntity?.relationships) return null;
    const rel = customEntity.relationships.find(
      (/** @type {any} */ r) => r.sourceFieldId === field.id,
    );
    if (!rel) return null;
    const target = allEntities.find((/** @type {any} */ e) => e.id === rel.referencedCustomEntityId);
    if (!target) return null;
    return { entityName: target.name, navProp: `${field.name}_Etn` };
  }

  function buildAvailableItems() {
    /** @type {AvailableItem[]} */
    const items = [];
    const selectedIds = new Set(selectedColumns.map(c => c.id));

    if (customEntity?.fields) {
      for (const field of customEntity.fields) {
        if (!selectedIds.has(field.id || field.name)) {
          items.push({
            id: field.id || field.name,
            label: field.displayName || field.name,
            type: 'field',
            field,
          });
        }
      }
    }

    if (customEntity?.relationships) {
      for (const rel of customEntity.relationships) {
        const target = allEntities.find((/** @type {any} */ e) => e.id === rel.referencedCustomEntityId);
        if (!target || !target.fields) continue;

        const sourceField = customEntity.fields?.find((/** @type {any} */ f) => f.id === rel.sourceFieldId);
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
              type: 'expand',
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
            type: 'group',
            groupLabel: target.displayName || target.name,
          });
          items.push(...expandFields);
        }
      }
    }

    return items;
  }

  const toggle = () => {
    if (!modal) {
      selectedColumns = [...orderedColumns];
      availableItems = buildAvailableItems();
    }
    modal = !modal;
  };

  const handleSave = () => {
    orderedColumns = [...selectedColumns];
    modal = false;
  };

  /** @param {DragOverEvent} event */
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const selCol = selectedColumns.find(c => c.id === active.id);
    const availItem = availableItems.find(i => i.id === active.id);

    if (!selCol && !availItem) return;

    const inSelected = !!selCol;
    const overSel = selectedColumns.find(c => c.id === over.id);
    const overTarget = over.id === 'available' ? 'available' : (over.id === 'selected' || overSel) ? 'selected' : null;
    if (!overTarget) return;

    if (inSelected && overTarget === 'available') {
      moveToAvailable(selCol);
      return;
    }

    if (!inSelected && overTarget === 'selected' && availItem && availItem.type !== 'group') {
      if (overSel) {
        const newIndex = selectedColumns.findIndex(c => c.id === over.id);
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

    const selCol = selectedColumns.find(c => c.id === active.id);
    const availItem = availableItems.find(i => i.id === active.id);

    const overSel = selectedColumns.find(c => c.id === over.id);

    if (!overSel && over.id !== 'available') return;

    if (overSel) {
      const newIndex = selectedColumns.findIndex(c => c.id === over.id);
      if (selCol) {
        const oldIndex = selectedColumns.findIndex(c => c.id === selCol.id);
        if (oldIndex !== -1 && oldIndex !== newIndex) {
          selectedColumns = arrayMove(selectedColumns, oldIndex, newIndex);
        }
        availableItems = buildAvailableItems();
      } else if (availItem && availItem.type !== 'group') {
        moveToSelected(availItem, newIndex);
      }
    } else if (selCol) {
      moveToAvailable(selCol);
    }
  };

  /** @param {AvailableItem} item
   *  @returns {ColumnDef | null} */
  function buildColumnDefFromAvailable(item) {
    if (item.type === 'field' && item.field) {
      return buildFieldColumnDef(item.field);
    }
    if (item.type === 'expand') {
      return buildExpandColumnDef({
        navigationProp: item.navigationProp,
        fieldName: item.field?.name,
        fieldLabel: item.field?.displayName,
        targetEntityName: item.targetEntityName,
        field: item.field,
      });
    }
    return null;
  }

  /** @param {any} col */
  function moveToAvailable(col) {
    let colDef = 'field' in col && col.type === 'field' ? buildFieldColumnDef(col.field) :
                 col.type === 'expand' ? buildColumnDefFromAvailable(col) : null;
    if (!colDef) colDef = col.type === 'field' ? buildFieldColumnDef(col) : null;
    if (!colDef) return;

    selectedColumns = selectedColumns.filter(c => c.id !== colDef.id);
    availableItems = buildAvailableItems();
  }

  /** @param {AvailableItem} item
   *  @param {number | null} position */
  function moveToSelected(item, position = null) {
    const colDef = buildColumnDefFromAvailable(item);
    if (!colDef) return;

    if (selectedColumns.find(c => c.id === colDef.id)) return;

    if (position !== null && position >= 0) {
      selectedColumns = selectedColumns.toSpliced(position, 0, colDef);
    } else {
      selectedColumns = [...selectedColumns, colDef];
    }
    availableItems = buildAvailableItems();
  }

  /** @type {{ timezone: string }} */
  let settings = $state({ timezone: '' });

  $effect(() => {
    const unsub = userSettings.subscribe(v => { settings = v; });
    return unsub;
  });

  /** @param {string | Date} value
   *  @param {'datetime' | 'date' | 'time'} type
   *  @returns {string} */
  function formatDateValue(value, type) {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);

    const tz = settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      if (type === 'time') {
        return new Intl.DateTimeFormat(undefined, {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(d);
      }
      if (type === 'date') {
        return new Intl.DateTimeFormat(undefined, {
          timeZone: tz,
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(d);
      }
      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return String(value);
    }
  }

  /** @param {ColumnDef} col
   *  @param {any} row
   *  @returns {{ display: string, href: string | null }} */
  function resolveCell(col, row) {
    const raw = col.type === 'expand' && col.navigationProp
      ? row[col.navigationProp]?.[col.fieldName ?? '']
      : row[col.fieldName ?? ''];

    if (raw === null || raw === undefined) return { display: '', href: null };

    if (col.optionSetDefId) {
      const def = optionSetDefs.find((/** @type {any} */ s) => s.id === col.optionSetDefId);
      if (def?.options) {
        const opt = def.options.find((/** @type {any} */ o) => String(o.value) === String(raw));
        if (opt) return { display: opt.name, href: null };
      }
    }

    if (col.isSelect && Array.isArray(raw)) {
      const names = raw.map((/** @type {any} */ v) => {
        const def = optionSetDefs.find((/** @type {any} */ s) => s.id === col.optionSetDefId);
        const opt = def?.options?.find((/** @type {any} */ o) => String(o.value) === String(v));
        return opt ? opt.name : v;
      });
      return { display: names.join(', '), href: null };
    }

    if (col.lookupNavProp && col.type === 'field') {
      const navProp = col.lookupNavProp;
      const displayName = row[navProp]?.Name ?? row[navProp]?.name;
      if (displayName) {
        const entityId = raw;
        return { display: displayName, href: `/Open?entity=${col.lookupEntityName}&id=${entityId}` };
      }
      if (raw) {
        return { display: raw.slice(0, 8) + '...', href: `/Open?entity=${col.lookupEntityName}&id=${raw}` };
      }
    }

    if (col.type === 'expand' && col.navigationProp && raw) {
      const fieldIsName = col.fieldName === 'name' || col.fieldName === 'Name';
      if (fieldIsName) {
        const parentId = row[col.navigationProp]?.id || row[col.navigationProp]?.Id;
        if (parentId) {
          return { display: String(raw), href: `/Open?entity=${col.targetEntityName || col.navigationProp}&id=${parentId}` };
        }
      }
    }

    if (col.isNameField && raw) {
      const rowId = row.id || row.Id;
      if (rowId) {
        return { display: String(raw), href: `/Open?entity=${entityName}&id=${rowId}` };
      }
    }

    if (col.isDateTime) return { display: formatDateValue(raw, 'datetime'), href: null };
    if (col.isDateOnly) return { display: formatDateValue(raw, 'date'), href: null };
    if (col.isTimeOnly) return { display: formatDateValue(raw, 'time'), href: null };

    return { display: String(raw), href: null };
  }
</script>

<div>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <Button color="success" on:click={openAddNew}>Add New</Button>
    <div class="d-flex gap-2">
      <Button outline on:click={() => filterModal = true}>Edit Filters</Button>
      <Button outline on:click={toggle}>Manage Columns</Button>
    </div>
  </div>

  <Modal isOpen={filterModal} toggle={() => filterModal = !filterModal} size="lg">
    <ModalHeader toggle={() => filterModal = !filterModal}>Edit Filters</ModalHeader>
    <ModalBody>
      <QueryBuilder rootGroup={rootQuery} customEntityId={customEntity?.id}></QueryBuilder>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={() => filterModal = false}>Done</Button>
    </ModalFooter>
  </Modal>

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
              items={availableItems.filter(i => i.type !== 'group').map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <Droppable id="available">
                <div class="space-y-2">
                  {#each availableItems as item (item.id)}
                    {#if item.type === 'group'}
                      <div class="text-xs font-bold text-muted mt-3 mb-1 px-2">{item.groupLabel}</div>
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
              items={selectedColumns.map(c => c.id)}
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
            {@const activeCol = [...selectedColumns, ...availableItems.filter(i => i.type !== 'group').map(i => ({ id: i.id, label: i.label }))].find(c => c.id === activeId)}
            {#if activeCol}
              <div class="p-2 border rounded-md bg-gray-200 cursor-grabbing">
                {activeCol.label}
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

  <div class="overflow-x-auto mt-4">
    <table class="table" use:resizeAction>
      <thead>
        <tr>
          {#each orderedColumns as col (col.id)}
            <th class="whitespace-nowrap" title={col.id}>
              {col.label}
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
              {#each orderedColumns as col}
                {@const cell = resolveCell(col, row)}
                <td>
                  {#if cell.href}
                    <a href={cell.href} class="text-blue-600 hover:underline">
                      {cell.display}
                    </a>
                  {:else}
                    {cell.display}
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
