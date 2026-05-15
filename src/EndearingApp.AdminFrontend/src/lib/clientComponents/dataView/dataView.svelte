<script>
  import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "@sveltestrap/sveltestrap";
  import Toolbar from "./toolbar.svelte";
  import ColumnManager from "./columnManager.svelte";
  import AggregateModal from "./aggregateModal.svelte";
  import TableView from "./tableView.svelte";
  import QueryBuilder from "../queryBuilder/components/queryBuilder.svelte";
  import {
    optionSets,
    customEntities,
    userSettings,
  } from "../../../stores/global";
  import { get } from "svelte/store";
  import { getTypeId } from "@utils/fieldtypesutils";

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
    loading = $bindable(false),
    orderBy = $bindable("createdon desc"),
    onSortChange = null,
    editBaseUrl = "",
    aggregates = $bindable(
      /** @type {{ id: string, label: string, collectionNavProp: string, sourceField: string, fn: string }[]} */ ([]),
    ),
  } = $props();

  let tableKey = $state(new Date().toString());
  let filterModal = $state(false);
  let showColumnManager = $state(false);
  let showAggregateModal = $state(false);

  /** @type {any[]} */
  let optionSetDefs = $state([]);
  /** @type {any[]} */
  let allEntities = $state([]);
  /** @type {{ timezone: string }} */
  let settings = $state({ timezone: "" });

  $effect(() => {
    optionSetDefs = get(optionSets);
    allEntities = get(customEntities);
    settings = get(userSettings);
  });

  const openAddNew = () => {
    if (entityName) {
      const currentPath = window.location.pathname;
      const appId =
        currentPath.split("/")[2] || "00000000-0000-0000-0000-000000000000";
      window.location.href = `/app/${appId}/${entityName}/edit`;
    }
  };

  /** @type {ColumnDef[]} */
  let orderedColumns = $state([]);
  let prevFieldNamesKey = $state("");
  let prevAggregateIds = $state("");
  let columnsSelectedFor = $state("");

  // fill grid if no columns is selected, probably should call for the current view here
  $effect(() => {
    console.log(customEntity);
    console.log(columnsSelectedFor);
    if (!customEntity?.fields) return;
    if (orderedColumns.length > 0 && columnsSelectedFor == customEntity?.name) {
      return;
    }
    const allCols = customEntity.fields.map(buildFieldColumnDef);
    const fnKey = fieldNames.join(",");
    if (fnKey && fnKey !== prevFieldNamesKey) {
      prevFieldNamesKey = fnKey;
      const nameSet = new Set(fieldNames);
      orderedColumns = allCols.filter(
        (/** @type {any} */ c) => c.fieldName && nameSet.has(c.fieldName),
      );
      console.table(orderedColumns);
    } else if (!fnKey && orderedColumns.length === 0) {
      orderedColumns = allCols;

      console.table(orderedColumns);
    }
    columnsSelectedFor = customEntity?.name;
    tableKey = new Date().toString();
  });

  $effect(() => {
    const aggIds = aggregates.map((/** @type {any} */ a) => a.id).join(",");
    if (aggIds !== prevAggregateIds) {
      prevAggregateIds = aggIds;
      const existingAggIds = new Set(
        orderedColumns
          .filter((/** @type {any} */ c) => c.type === "aggregate")
          .map((/** @type {any} */ c) => c.id),
      );
      let cols = orderedColumns.filter(
        (/** @type {any} */ c) =>
          c.type !== "aggregate" ||
          aggregates.some((/** @type {any} */ a) => a.id === c.id),
      );
      for (const a of aggregates) {
        if (!existingAggIds.has(a.id)) {
          cols = [
            ...cols,
            {
              id: a.id,
              type: "aggregate",
              label: a.label,
              fieldName: a.sourceField,
              collectionNavProp: a.collectionNavProp,
              sourceField: a.sourceField,
              aggregateFn: a.fn,
            },
          ];
        }
      }
      orderedColumns = cols;

      console.table(orderedColumns);
    }
  });

  $effect(() => {
    /** @type {Record<string, { navigationProp: string, select: string[] }>} */
    const expandMap = {};
    for (const col of orderedColumns) {
      if (col.type === "expand" && col.navigationProp && col.fieldName) {
        if (!expandMap[col.navigationProp]) {
          expandMap[col.navigationProp] = {
            navigationProp: col.navigationProp,
            select: [],
          };
        }
        if (!expandMap[col.navigationProp].select.includes(col.fieldName)) {
          expandMap[col.navigationProp].select.push(col.fieldName);
        }
      }
      if (col.type === "field" && col.lookupNavProp) {
        if (!expandMap[col.lookupNavProp]) {
          expandMap[col.lookupNavProp] = {
            navigationProp: col.lookupNavProp,
            select: ["Id", "Name"],
          };
        }
      }
      if (
        col.type === "aggregate" &&
        col.collectionNavProp &&
        col.sourceField
      ) {
        if (!expandMap[col.collectionNavProp]) {
          expandMap[col.collectionNavProp] = {
            navigationProp: col.collectionNavProp,
            select: [],
          };
        }
        if (
          !expandMap[col.collectionNavProp].select.includes(col.sourceField)
        ) {
          expandMap[col.collectionNavProp].select.push(col.sourceField);
        }
      }
    }
    expands = Object.values(expandMap);
  });

  $effect(() => {
    fieldNames = orderedColumns
      .filter((col) => col.type === "field" && col.fieldName)
      .map((col) => /** @type {string} */ (col.fieldName));
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
    if (!customEntity?.relationships) return null;
    const rel = customEntity.relationships.find(
      (/** @type {any} */ r) => r.sourceFieldId === field.id,
    );
    if (!rel) return null;
    const target = allEntities.find(
      (/** @type {any} */ e) => e.id === rel.referencedCustomEntityId,
    );
    if (!target) return null;
    return { entityName: target.name, navProp: `${field.name}_Etn` };
  }
</script>

<div>
  <Toolbar
    onAddNew={openAddNew}
    {onRefresh}
    onEditFilters={() => (filterModal = true)}
    onManageColumns={() => (showColumnManager = true)}
    onAddAggregate={() => (showAggregateModal = true)}
  />

  <Modal
    isOpen={filterModal}
    toggle={() => (filterModal = !filterModal)}
    size="lg"
  >
    <ModalHeader toggle={() => (filterModal = !filterModal)}
      >Edit Filters</ModalHeader
    >
    <ModalBody>
      <QueryBuilder rootGroup={rootQuery} customEntityId={customEntity?.id}
      ></QueryBuilder>
    </ModalBody>
    <ModalFooter>
      <Button
        color="primary"
        on:click={() => {
          filterModal = false;
          onFiltersDone?.();
        }}>Done</Button
      >
    </ModalFooter>
  </Modal>

  <ColumnManager
    show={showColumnManager}
    fields={customEntity?.fields || []}
    relationships={customEntity?.relationships || []}
    {allEntities}
    bind:columns={orderedColumns}
    bind:aggregates
    onClose={() => (showColumnManager = false)}
    columnsChanged={() => {
      tableKey = new Date().toString();
    }}
  />

  <AggregateModal
    show={showAggregateModal}
    relationships={customEntity?.relationships || []}
    fields={customEntity?.fields || []}
    {allEntities}
    {aggregates}
    entityId={customEntity?.id || ""}
    onSave={(/** @type {any[]} */ newAggs) => {
      aggregates = newAggs;
      showAggregateModal = false;
    }}
    onClose={() => (showAggregateModal = false)}
  />

  <div class="position-relative">
    {#if loading}
      <div
        class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-body bg-opacity-50 z-3"
        style="min-height: 200px;"
      >
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    {/if}
    {#key tableKey}
      <TableView
        columns={orderedColumns}
        {data}
        {entityName}
        {optionSetDefs}
        {settings}
        {orderBy}
        {onSortChange}
        {editBaseUrl}
      />
    {/key}
  </div>

  {#if totalCount > 0}
    {@const totalPages = Math.ceil(totalCount / pageSize)}
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div class="d-flex align-items-center gap-2">
        <select
          class="form-select form-select-sm w-auto"
          value={pageSize}
          onchange={(e) => {
            pageSize = Number(
              /** @type {HTMLSelectElement} */ (e.target).value,
            );
            page = 1;
            onRefresh?.();
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span class="text-muted small">per page</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span class="text-muted small"
          >Page {page} of {totalPages} ({totalCount} total)</span
        >
        <Button
          size="sm"
          outline
          disabled={page <= 1}
          onclick={() => {
            page = page - 1;
            onRefresh?.();
          }}>Prev</Button
        >
        <Button
          size="sm"
          outline
          disabled={page >= totalPages}
          onclick={() => {
            page = page + 1;
            onRefresh?.();
          }}>Next</Button
        >
      </div>
    </div>
  {/if}
</div>
