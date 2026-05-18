<script>
  import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "@sveltestrap/sveltestrap";
  import { DndContext, DragOverlay } from "@dnd-kit-svelte/core";
  import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit-svelte/sortable";
  import Column from "../../../components/DataTable/Column.svelte";
  import Droppable from "../../../components/DataTable/Droppable.svelte";
  import { dropAnimation, sensors } from "../../../components/DataTable/DropAnimation.js";
  import QueryBuilder from "../queryBuilder/components/queryBuilder.svelte";
  import ViewDescription from "./viewDescription.js";
  import { ConditionGroup } from "../queryBuilder/logic/typeDefinitions";
  import {
    userSettings,
    getOptionSets,
    getCustomEntities,
    getCachedCustomEntities,
  } from "@stores/global";
  import { getTypeId } from "@utils/fieldtypesutils";
  import { untrack } from "svelte";

  const DEFAULT_APP_ID = "00000000-0000-0000-0000-000000000000";

  /** @typedef {import('@dnd-kit-svelte/core').DragOverEvent} DragOverEvent */
  /** @typedef {import('@dnd-kit-svelte/core').DragEndEvent} DragEndEvent */
  /** @typedef {import('@dnd-kit-svelte/core').UniqueIdentifier} UniqueIdentifier */

  /** @typedef {Object} ColumnDef
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
    entityName = "",
    data = $bindable([]),
    customEntity,
    expands = $bindable([]),
    fieldNames = $bindable([]),
    rootQuery = $bindable(),
    onFiltersDone = null,
    onRefresh = null,
    page = $bindable(1),
    pageSize = $bindable(25),
    totalCount = $bindable(0),
    orderBy = $bindable("createdon desc"),
    onSortChange = null,
    editBaseUrl = "",
    aggregates = $bindable(
      /** @type {{ id: string, label: string, collectionNavProp: string, sourceField: string, fn: string }[]} */ ([]),
    ),
    view = $bindable(new ViewDescription()),
  } = $props();

  let tableKey = $state(new Date().toString());

  /** @type {any[]} */
  let optionSetDefs = $state([]);
  /** @type {any[]} */
  let allEntities = $state(getCachedCustomEntities());
  let settings = $userSettings;

  $effect(() => {
    getOptionSets().then((v) => (optionSetDefs = v));
    getCustomEntities().then((v) => (allEntities = v));
  });

  const openAddNew = () => {
    if (entityName) {
      const currentPath = window.location.pathname;
      const appId = currentPath.split("/")[2] || DEFAULT_APP_ID;
      window.location.href = `/app/${appId}/${entityName}/edit`;
    }
  };

  /** @type {ColumnDef[]} */
  let orderedColumns = $state([]);

  $effect(() => {
    if (customEntity?.id) {
      view = new ViewDescription({
        entityId: customEntity.id,
        columns: orderedColumns,
        aggregates,
        filter: rootQuery,
        orderBy,
        pageSize,
      });
    }
  });

  function handleViewChange(/** @type {ViewDescription} */ newView) {
    orderedColumns = [...newView.columns];
    fieldNames = orderedColumns
      .filter((col) => col.type === "field" && col.fieldName)
      .map((col) => col.fieldName);
    aggregates = [...(newView.aggregates || [])];
    rootQuery = newView.filter || new ConditionGroup("and", []);
    orderBy = newView.orderBy || "createdon desc";
    pageSize = newView.pageSize || 25;
    onRefresh?.();
  }

  let prevColumnKey = $state("");
  let prevAggregateIds = $state("");

  $effect(() => {
    if (!customEntity?.fields) return;
    const currentKey = `${customEntity.name}::${fieldNames.join(",")}`;
    if (orderedColumns.length > 0 && prevColumnKey === currentKey) return;
    const allCols = customEntity.fields.map(buildFieldColumnDef);
    const fnKey = fieldNames.join(",");
    if (fnKey) {
      const nameSet = new Set(fieldNames);
      orderedColumns = allCols.filter((/** @type {any} */ c) => c.fieldName && nameSet.has(c.fieldName));
    } else {
      orderedColumns = allCols;
    }
    prevColumnKey = currentKey;
    tableKey = new Date().toString();
  });

  $effect(() => {
    const aggIds = aggregates.map((/** @type {any} */ a) => a.id).join(",");
    if (aggIds !== prevAggregateIds) {
      prevAggregateIds = aggIds;
      const existingAggIds = new Set(
        orderedColumns.filter((/** @type {any} */ c) => c.type === "aggregate").map((/** @type {any} */ c) => c.id),
      );
      let cols = orderedColumns.filter(
        (/** @type {any} */ c) => c.type !== "aggregate" || aggregates.some((/** @type {any} */ a) => a.id === c.id),
      );
      for (const a of aggregates) {
        if (!existingAggIds.has(a.id)) {
          cols = [...cols, { id: a.id, type: "aggregate", label: a.label, fieldName: a.sourceField, collectionNavProp: a.collectionNavProp, sourceField: a.sourceField, aggregateFn: a.fn }];
        }
      }
      orderedColumns = cols;
    }
  });

  $effect(() => {
    /** @type {Record<string, { navigationProp: string, select: string[] }>} */
    const expandMap = {};
    for (const col of orderedColumns) {
      if (col.type === "expand" && col.navigationProp && col.fieldName) {
        if (!expandMap[col.navigationProp]) expandMap[col.navigationProp] = { navigationProp: col.navigationProp, select: [] };
        if (!expandMap[col.navigationProp].select.includes(col.fieldName)) expandMap[col.navigationProp].select.push(col.fieldName);
      }
      if (col.type === "field" && col.lookupNavProp) {
        if (!expandMap[col.lookupNavProp]) expandMap[col.lookupNavProp] = { navigationProp: col.lookupNavProp, select: ["Id", "Name"] };
      }
      if (col.type === "aggregate" && col.collectionNavProp && col.sourceField) {
        if (!expandMap[col.collectionNavProp]) expandMap[col.collectionNavProp] = { navigationProp: col.collectionNavProp, select: [] };
        if (!expandMap[col.collectionNavProp].select.includes(col.sourceField)) expandMap[col.collectionNavProp].select.push(col.sourceField);
      }
    }
    expands = Object.values(expandMap);
  });

  $effect(() => {
    fieldNames = orderedColumns
      .filter((col) => col.type === "field" && col.fieldName)
      .map((col) => /** @type {string} */ (col.fieldName));
  });

  /** @param {any} field @returns {ColumnDef} */
  function buildFieldColumnDef(field) {
    const lookupInfo = findLookupInfo(field);
    const dtId = getTypeId("Date and Time");
    const dId = getTypeId("Date");
    const tId = getTypeId("Time");
    return {
      id: field.id || field.name, type: "field", label: field.displayName || field.name,
      fieldName: field.name, field,
      isNameField: field.name === "name" || field.name === "Name",
      lookupEntityName: lookupInfo ? lookupInfo.entityName : undefined,
      lookupNavProp: lookupInfo ? lookupInfo.navProp : undefined,
      optionSetDefId: field.optionSetDefinitionId || undefined,
      isSelect: field.type === getTypeId("Option Set") || field.type === getTypeId("Option Set MultiSelect"),
      isMultiSelect: field.type === getTypeId("Option Set MultiSelect"),
      isDateTime: field.type === dtId, isDateOnly: field.type === dId, isTimeOnly: field.type === tId,
    };
  }

  /** @param {any} field @returns {{ entityName: string, navProp: string } | null} */
  function findLookupInfo(field) {
    if (!customEntity?.relationships) return null;
    const rel = customEntity.relationships.find((/** @type {any} */ r) => r.sourceFieldId === field.id);
    if (!rel) return null;
    const target = allEntities.find((/** @type {any} */ e) => e.id === rel.referencedCustomEntityId);
    if (!target) return null;
    return { entityName: target.name, navProp: `${field.name}_Etn` };
  }

  // ─── Column Manager State ───
  let showColumnManager = $state(false);
  /** @type {ColumnDef[]} */ let localColumns = $state([]);
  /** @type {AvailableItem[]} */ let localAvailableItems = $state([]);
  /** @type {UniqueIdentifier | null} */ let localActiveId = $state(null);

  $effect(() => {
    if (showColumnManager) {
      localColumns = [...(view.columns || [])];
      untrack(() => { localAvailableItems = buildAvailableItems(); });
    }
  });

  // ─── Filter State ───
  let showFilterModal = $state(false);
  let localFilter = $state(new ConditionGroup("and", []));
  $effect(() => { if (showFilterModal) localFilter = view.filter || new ConditionGroup("and", []); });

  // ─── Aggregate State ───
  let showAggregateModal = $state(false);
  /** @type {Record<string, string>} */
  const AGGREGATE_FN_LABELS = { sum: "Sum", avg: "Average", count: "Count", min: "Min", max: "Max" };
  let aggCollectionNavProp = $state("");
  let aggSourceField = $state("");
  let aggFunction = $state("avg");
  let aggLabel = $state("");
  let aggError = $state("");

  let editingAggId = $state(/** @type {string | null} */ (null));

  $effect(() => {
    if (showAggregateModal) {
      editingAggId = null;
      aggCollectionNavProp = ""; aggSourceField = ""; aggFunction = "avg"; aggLabel = ""; aggError = "";
    }
  });

  function startAddAggregate() {
    aggCollectionNavProp = ""; aggSourceField = ""; aggFunction = "avg"; aggLabel = ""; aggError = "";
    editingAggId = "new";
  }

  function startEditAggregate(/** @type {{ id: string, label: string, collectionNavProp: string, sourceField: string, fn: string }} */ agg) {
    aggCollectionNavProp = agg.collectionNavProp;
    aggSourceField = agg.sourceField;
    aggFunction = agg.fn;
    aggLabel = agg.label;
    aggError = "";
    editingAggId = agg.id;
  }

  function saveAggregate() {
    aggError = "";
    if (!aggCollectionNavProp) { aggError = "Select a collection"; return; }
    if (!aggSourceField) { aggError = "Select a field to aggregate"; return; }
    if (!aggLabel) { const fnLabel = AGGREGATE_FN_LABELS[aggFunction] || aggFunction; aggLabel = `${fnLabel} of ${aggSourceField}`; }
    const current = aggregates || [];
    if (editingAggId === "new") {
      const newAgg = { id: crypto.randomUUID(), label: aggLabel, collectionNavProp: aggCollectionNavProp, sourceField: aggSourceField, fn: aggFunction };
      view = new ViewDescription({ ...view, aggregates: [...current, newAgg] });
    } else {
      view = new ViewDescription({ ...view, aggregates: current.map((/** @type {any} */ a) => a.id === editingAggId ? { ...a, label: aggLabel, collectionNavProp: aggCollectionNavProp, sourceField: aggSourceField, fn: aggFunction } : a) });
    }
    editingAggId = null;
    handleViewChange(view);
  }

  function removeAggregate(/** @type {string} */ id) {
    view = new ViewDescription({ ...view, aggregates: (aggregates || []).filter((/** @type {any} */ a) => a.id !== id) });
    handleViewChange(view);
  }

  function cancelAggForm() {
    editingAggId = null;
  }

  function getCollectionLabel(/** @type {string} */ navProp) {
    return collectionOptions.find((/** @type {any} */ o) => o.navProp === navProp)?.label || navProp;
  }

  let collectionOptions = $derived((() => {
    /** @type {Map<string, { navProp: string, label: string, sourceEntityFields: any[] }>} */
    const seen = new Map();
    for (const otherEntity of allEntities) {
      if (!otherEntity.relationships) continue;
      for (const rel of otherEntity.relationships) {
        if (rel.referencedCustomEntityId !== customEntity?.id) continue;
        if (!rel.constraintName) continue;
        const navProp = `${rel.constraintName}_EtnColl`;
        const key = otherEntity.id || otherEntity.name;
        const entry = { navProp, label: `${otherEntity.displayName || otherEntity.name} (via ${rel.constraintName})`, sourceEntityFields: otherEntity.fields || [] };
        if (seen.has(key)) { if (navProp.includes(`FK_${otherEntity.name}_`)) seen.set(key, entry); }
        else seen.set(key, entry);
      }
    }
    return [...seen.values()];
  })());

  let childFieldOptions = $derived((() => {
    if (!aggCollectionNavProp) return [];
    const sel = collectionOptions.find(o => o.navProp === aggCollectionNavProp);
    if (!sel) return [];
    return sel.sourceEntityFields.map((/** @type {any} */ f) => ({ name: f.name, label: f.displayName || f.name }));
  })());

  // ─── Column Manager Functions ───
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
    if (position !== null && position >= 0) localColumns = localColumns.toSpliced(position, 0, colDef);
    else localColumns = [...localColumns, colDef];
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
    showColumnManager = false;
    handleViewChange(view);
  }

  function handleFilterDone() {
    view = new ViewDescription({ ...view, filter: localFilter });
    showFilterModal = false;
    handleViewChange(view);
  }

  let fields_derived = $derived(customEntity?.fields || []);
  let relationships_derived = $derived(customEntity?.relationships || []);

  // ─── TableView functions ───
  let sortField = $state("");
  let sortDir = $state("asc");
  $effect(() => { const parts = orderBy?.split(" ") || []; sortField = parts[0] || ""; sortDir = parts[1] || "asc"; });

  function handleSort(/** @type {any} */ col) {
    const sortId = col.type === "aggregate" ? col.id : col.fieldName;
    if (!sortId) return;
    if (col.type === "field" && (col.isMultiSelect || !col.fieldName)) return;
    if (sortField === sortId) sortDir = sortDir === "asc" ? "desc" : "asc";
    else { sortField = sortId; sortDir = "asc"; }
    onSortChange?.(`${sortField} ${sortDir}`);
  }

  function formatDateValue(/** @type {string | Date} */ value, /** @type {'datetime' | 'date' | 'time'} */ type) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    const tz = settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      if (type === "time") return new Intl.DateTimeFormat(undefined, { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(d);
      if (type === "date") return new Intl.DateTimeFormat(undefined, { timeZone: tz, year: "numeric", month: "short", day: "numeric" }).format(d);
      return new Intl.DateTimeFormat(undefined, { timeZone: tz, year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(d);
    } catch { return String(value); }
  }

  function resolveCell(/** @type {ColumnDef} */ col, /** @type {any} */ row) {
    const raw = col.type === "expand" && col.navigationProp ? row[col.navigationProp]?.[col.fieldName ?? ""] : row[col.fieldName ?? ""];

    if (raw === null || raw === undefined) {
      if (col.type === "aggregate" && col.collectionNavProp && col.sourceField) {
        const children = row[col.collectionNavProp];
        if (!children || !Array.isArray(children) || children.length === 0) return { display: "0", href: null };
        const values = children.map((/** @type {any} */ c) => Number(c[col.sourceField ?? ""])).filter((/** @type {any} */ v) => !isNaN(v));
        if (values.length === 0) return { display: "0", href: null };
        let result = 0;
        switch (col.aggregateFn) {
          case "sum": result = values.reduce((/** @type {number} */ a, /** @type {number} */ b) => a + b, 0); break;
          case "avg": result = values.reduce((/** @type {number} */ a, /** @type {number} */ b) => a + b, 0) / values.length; break;
          case "count": result = values.length; break;
          case "min": result = Math.min(...values); break;
          case "max": result = Math.max(...values); break;
        }
        return { display: Number.isInteger(result) ? String(result) : result.toFixed(2), href: null };
      }
      return { display: "", href: null };
    }

    if (col.optionSetDefId) {
      const def = optionSetDefs.find((/** @type {any} */ s) => s.id === col.optionSetDefId);
      if (def?.options) { const opt = def.options.find((/** @type {any} */ o) => String(o.value) === String(raw)); if (opt) return { display: opt.name, href: null }; }
    }
    if (col.isSelect && Array.isArray(raw)) {
      const names = raw.map((/** @type {any} */ v) => {
        const def = optionSetDefs.find((/** @type {any} */ s) => s.id === col.optionSetDefId);
        const opt = def?.options?.find((/** @type {any} */ o) => String(o.value) === String(v));
        return opt ? opt.name : v;
      });
      return { display: names.join(", "), href: null };
    }
    if (col.lookupNavProp && col.type === "field") {
      const displayName = row[col.lookupNavProp]?.Name ?? row[col.lookupNavProp]?.name;
      if (displayName) return { display: displayName, href: `/Open?entity=${col.lookupEntityName}&id=${raw}` };
      if (raw) return { display: raw.slice(0, 8) + "...", href: `/Open?entity=${col.lookupEntityName}&id=${raw}` };
    }
    if (col.type === "expand" && col.navigationProp && raw) {
      const fieldIsName = col.fieldName === "name" || col.fieldName === "Name";
      if (fieldIsName) {
        const parentId = row[col.navigationProp]?.id || row[col.navigationProp]?.Id;
        if (parentId) return { display: String(raw), href: `/Open?entity=${col.targetEntityName || col.navigationProp}&id=${parentId}` };
      }
    }
    if (col.isNameField && raw) {
      const rowId = row.id || row.Id;
      if (rowId) return { display: String(raw), href: editBaseUrl ? `${editBaseUrl}/edit/${rowId}` : `/Open?entity=${entityName}&id=${rowId}` };
    }
    if (col.isDateTime) return { display: formatDateValue(raw, "datetime"), href: null };
    if (col.isDateOnly) return { display: formatDateValue(raw, "date"), href: null };
    if (col.isTimeOnly) return { display: formatDateValue(raw, "time"), href: null };
    return { display: String(raw), href: null };
  }
</script>

<!-- ═══ TOOLBAR ═══ -->
<div class="d-flex justify-content-between align-items-center mb-3">
  <div class="d-flex gap-2">
    <Button color="success" onclick={openAddNew}>Add New</Button>
    <Button outline onclick={onRefresh}>Refresh</Button>
  </div>
  <div class="d-flex gap-2">
    <Button outline onclick={() => (showColumnManager = true)}>Manage Columns</Button>
    <Button outline onclick={() => (showFilterModal = true)}>Edit Filters</Button>
    <Button outline onclick={() => (showAggregateModal = true)}>Manage Aggregates</Button>
  </div>
</div>

<!-- ═══ MANAGE COLUMNS MODAL ═══ -->
<Modal isOpen={showColumnManager} toggle={() => (showColumnManager = false)} size="lg">
  <ModalHeader toggle={() => (showColumnManager = false)}>Select and Order Columns</ModalHeader>
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
    <Button color="secondary" onclick={() => (showColumnManager = false)}>Cancel</Button>
  </ModalFooter>
</Modal>

<!-- ═══ EDIT FILTERS MODAL ═══ -->
<Modal isOpen={showFilterModal} toggle={() => (showFilterModal = false)} size="lg">
  <ModalHeader toggle={() => (showFilterModal = false)}>Edit Filters</ModalHeader>
  <ModalBody>
    <QueryBuilder rootGroup={localFilter} customEntityId={customEntity?.id || ""} />
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onclick={handleFilterDone}>Done</Button>
  </ModalFooter>
</Modal>

<!-- ═══ MANAGE AGGREGATES MODAL ═══ -->
<Modal isOpen={showAggregateModal} toggle={() => (showAggregateModal = false)} size="md">
  <ModalHeader toggle={() => (showAggregateModal = false)}>Manage Aggregate Columns</ModalHeader>
  <ModalBody>
    {#if editingAggId !== null}
      {#if collectionOptions.length === 0}
        <div class="alert alert-info">No collection (one-to-many) relationships available for this entity.</div>
      {:else}
        <div class="mb-3">
          <label class="form-label" for="agg-collection">Collection (Child Entity)</label>
          <select class="form-select" id="agg-collection" bind:value={aggCollectionNavProp}>
            <option value="">-- Select --</option>
            {#each collectionOptions as opt (opt.navProp)}<option value={opt.navProp}>{opt.label}</option>{/each}
          </select>
        </div>
        {#if aggCollectionNavProp}
          <div class="mb-3">
            <label class="form-label" for="agg-field">Field to Aggregate</label>
            <select class="form-select" id="agg-field" bind:value={aggSourceField}>
              <option value="">-- Select --</option>
              {#each childFieldOptions as f (f.name)}<option value={f.name}>{f.label}</option>{/each}
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label" for="agg-fn">Function</label>
            <select class="form-select" id="agg-fn" bind:value={aggFunction}>
              <option value="sum">Sum</option><option value="avg">Average</option><option value="count">Count</option><option value="min">Min</option><option value="max">Max</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label" for="agg-label">Column Label</label>
            <input class="form-control" id="agg-label" bind:value={aggLabel} placeholder="Auto-generated if empty" />
          </div>
        {/if}
        {#if aggError}<div class="alert alert-danger">{aggError}</div>{/if}
      {/if}
      <div class="d-flex gap-2 mt-3">
        <Button color="primary" onclick={saveAggregate}>{editingAggId === "new" ? "Add" : "Update"}</Button>
        <Button color="secondary" onclick={cancelAggForm}>Cancel</Button>
      </div>
    {:else}
      {#if !aggregates || aggregates.length === 0}
        <div class="text-muted mb-3">No aggregate columns defined.</div>
      {:else}
        {#each aggregates as agg (agg.id)}
          <div class="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
            <div>
              <div class="fw-bold">{agg.label}</div>
              <div class="small text-muted">
                {getCollectionLabel(agg.collectionNavProp)} → {agg.sourceField} ({agg.fn})
              </div>
            </div>
            <div class="d-flex gap-2">
              <Button size="sm" outline onclick={() => startEditAggregate(agg)}>Edit</Button>
              <Button size="sm" outline color="danger" onclick={() => removeAggregate(agg.id)}>Remove</Button>
            </div>
          </div>
        {/each}
      {/if}
      {#if collectionOptions.length > 0}
        <Button outline onclick={startAddAggregate}>+ Add Aggregate</Button>
      {/if}
    {/if}
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" onclick={() => (showAggregateModal = false)}>Done</Button>
  </ModalFooter>
</Modal>

<!-- ═══ TABLE ═══ -->
<div class="overflow-x-auto">
  {#key tableKey}
    <table class="table">
      <thead>
        <tr>
          {#each orderedColumns as col (col.id)}
            <th class="whitespace-nowrap" title={col.id}>
              {#if (col.type === "field" && col.fieldName && !col.isMultiSelect) || col.type === "aggregate"}
                <button class="btn btn-link btn-sm p-0 text-decoration-none fw-bold" onclick={() => handleSort(col)}>
                  {col.label}
                  {#if sortField === (col.type === "aggregate" ? col.id : col.fieldName)}<span class="ms-1">{sortDir === "asc" ? "▲" : "▼"}</span>{/if}
                </button>
              {:else}
                {col.label}
              {/if}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#if data.length === 0}
          <tr><td colspan={orderedColumns.length} class="text-center p-4">No data available.</td></tr>
        {:else}
          {#each data as row (row.id || row.Id)}
            <tr>
              {#each orderedColumns as col (col.id)}
                {@const cell = resolveCell(col, row)}
                <td>
                  {#if cell.href}
                    <a href={cell.href} class="text-blue-600 hover:underline">{cell.display}</a>
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
  {/key}
</div>

<!-- ═══ PAGINATION ═══ -->
{#if totalCount > 0}
  {@const totalPages = Math.ceil(totalCount / pageSize)}
  <div class="d-flex justify-content-between align-items-center mt-3">
    <div class="d-flex align-items-center gap-2">
      <select class="form-select form-select-sm w-auto" value={pageSize} onchange={(e) => { pageSize = Number(/** @type {HTMLSelectElement} */ (e.target).value); page = 1; onRefresh?.(); }}>
        <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
      </select>
      <span class="text-muted small">per page</span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <span class="text-muted small">Page {page} of {totalPages} ({totalCount} total)</span>
      <Button size="sm" outline disabled={page <= 1} onclick={() => { page = page - 1; onRefresh?.(); }}>Prev</Button>
      <Button size="sm" outline disabled={page >= totalPages} onclick={() => { page = page + 1; onRefresh?.(); }}>Next</Button>
    </div>
  </div>
{/if}
