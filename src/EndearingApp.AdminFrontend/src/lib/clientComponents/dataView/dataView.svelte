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
    getOptionSets,
    getCustomEntities,
    getCachedCustomEntities,
  } from "@stores/global";
  import { getTypeId } from "@utils/fieldtypesutils";

  const DEFAULT_APP_ID = "00000000-0000-0000-0000-000000000000";

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
   * @typedef {Object} Props
   * @property {string} entityName
   * @property {any[]} data
   * @property {any} customEntity
   * @property {Array<{navigationProp: string, select: string[]}>} expands
   * @property {string[]} fieldNames
   * @property {any} rootQuery
   * @property {(() => void) | null} onFiltersDone
   * @property {(() => void) | null} onRefresh
   * @property {number} page
   * @property {number} pageSize
   * @property {number} totalCount
   * @property {string} orderBy
   * @property {((s: string) => void) | null} onSortChange
   * @property {string} editBaseUrl
   * @property {Array<{id: string, label: string, collectionNavProp: string, sourceField: string, fn: string}>} aggregates
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
  } = $props();

  let tableKey = $state(new Date().toString());
  let filterModal = $state(false);
  let showColumnManager = $state(false);
  let showAggregateModal = $state(false);

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
  let prevColumnKey = $state("");
  let prevAggregateIds = $state("");

  $effect(() => {
    if (!customEntity?.fields) return;
    const currentKey = `${customEntity.name}::${fieldNames.join(",")}`;
    if (orderedColumns.length > 0 && prevColumnKey === currentKey) {
      return;
    }
    const allCols = customEntity.fields.map(buildFieldColumnDef);
    const fnKey = fieldNames.join(",");
    if (fnKey) {
      const nameSet = new Set(fieldNames);
      orderedColumns = allCols.filter(
        (/** @type {any} */ c) => c.fieldName && nameSet.has(c.fieldName),
      );
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
        onclick={() => {
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
