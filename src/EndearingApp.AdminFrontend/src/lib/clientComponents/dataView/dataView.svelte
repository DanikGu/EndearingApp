<script>
  import ViewDescription from "./viewDescription.js";
  import DataViewToolbar from "./DataViewToolbar.svelte";
  import DataViewTable from "./DataViewTable.svelte";
  import DataViewPagination from "./DataViewPagination.svelte";
  import DataViewColumnManager from "./DataViewColumnManager.svelte";
  import DataViewFilterModal from "./DataViewFilterModal.svelte";
  import DataViewAggregateModal from "./DataViewAggregateModal.svelte";
  import {
    getOptionSets,
    getCustomEntities,
    getCachedCustomEntities,
    getTypeId,
  } from "@stores/global";

  const DEFAULT_APP_ID = "00000000-0000-0000-0000-000000000000";

  let {
    entityName = "",
    data = $bindable([]),
    customEntity,
    totalCount = $bindable(0),
    page = $bindable(1),
    onViewChange = null,
    onRefresh = null,
    onSortChange = null,
    editBaseUrl = "",
    view = $bindable(new ViewDescription()),
  } = $props();

  let allEntities = $state(getCachedCustomEntities());

  $effect(() => {
    getOptionSets().then(() => {});
    getCustomEntities().then((v) => (allEntities = v));
  });

  const openAddNew = () => {
    if (entityName) {
      const currentPath = window.location.pathname;
      const appId = currentPath.split("/")[2] || DEFAULT_APP_ID;
      window.location.href = `/app/${appId}/${entityName}/edit`;
    }
  };

  /** @type {import('./viewDescription.js').ColumnDef[]} */
  let orderedColumns = $state([]);
  let prevColumnKey = $state("");

  function buildFieldColumnDef(/** @type {any} */ field) {
    const lookupInfo = findLookupInfo(field);
    const dtId = getTypeId("Date and Time");
    const dId = getTypeId("Date");
    const tId = getTypeId("Time");
    return /** @type {import('./viewDescription.js').ColumnDef} */ ({
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

  $effect(() => {
    if (!customEntity?.fields) return;
    const fieldCols = view.columns.filter(
      (/** @type {any} */ c) => c.type === "field" && c.fieldName,
    );
    const fnKey = fieldCols.map((/** @type {any} */ c) => c.fieldName).join(",");
    const aggKey = (view.aggregates || []).map((/** @type {any} */ a) => a.id).join(",");
    const currentKey = `${customEntity.name}::${fnKey}::${aggKey}`;
    if (orderedColumns.length > 0 && prevColumnKey === currentKey) return;

    const allCols = customEntity.fields.map(buildFieldColumnDef);
    /** @type {import('./viewDescription.js').ColumnDef[]} */
    let cols;
    if (fieldCols.length > 0) {
      const nameSet = new Set(fieldCols.map((/** @type {any} */ c) => c.fieldName));
      cols = allCols.filter((/** @type {any} */ c) => c.fieldName && nameSet.has(c.fieldName));
    } else {
      cols = allCols;
    }

    for (const col of view.columns) {
      if ((col.type === "expand" || col.type === "aggregate") && !cols.find((/** @type {any} */ c) => c.id === col.id)) {
        cols = [...cols, /** @type {import('./viewDescription.js').ColumnDef} */ (col)];
      }
    }

    orderedColumns = cols;
    prevColumnKey = currentKey;
  });

  $effect(() => {
    if (!customEntity?.id) return;
    const currentIds = view.columns.map((/** @type {any} */ c) => c.id).join(",");
    const newIds = orderedColumns.map((/** @type {any} */ c) => c.id).join(",");
    if (currentIds !== newIds) {
      view = new ViewDescription({ ...view, columns: [...orderedColumns] });
    }
  });

  function handleViewChange(/** @type {ViewDescription} */ newView) {
    view = newView;
    onViewChange?.();
  }

  const handlePageSizeChange = (/** @type {number} */ ps) => handleViewChange(new ViewDescription({ ...view, pageSize: ps }));

  let showColumnManager = $state(false);
  let showFilterModal = $state(false);
  let showAggregateModal = $state(false);
</script>

<DataViewToolbar
  onAddNew={openAddNew}
  {onRefresh}
  onOpenColumnManager={() => (showColumnManager = true)}
  onOpenFilterModal={() => (showFilterModal = true)}
  onOpenAggregateModal={() => (showAggregateModal = true)}
/>

<DataViewTable
  bind:view
  {data}
  {totalCount}
  {onSortChange}
  {editBaseUrl}
  {entityName}
/>

<DataViewPagination
  bind:page
  pageSize={view.pageSize}
  pageSizeOnChange={handlePageSizeChange}
  {totalCount}
  {onRefresh}
/>

<DataViewColumnManager
  bind:isOpen={showColumnManager}
  bind:view
  {customEntity}
  onViewChange={handleViewChange}
/>

<DataViewFilterModal
  bind:isOpen={showFilterModal}
  bind:view
  customEntityId={customEntity?.id || ""}
  onViewChange={handleViewChange}
/>

<DataViewAggregateModal
  bind:isOpen={showAggregateModal}
  bind:view
  onViewChange={handleViewChange}
/>
