<script>
  import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "@sveltestrap/sveltestrap";
  import Toolbar from "./toolbar.svelte";
  import ColumnManager from "./columnManager.svelte";
  import TableView from "./tableView.svelte";
  import QueryBuilder from "../queryBuilder/components/queryBuilder.svelte";
  import { optionSets, customEntities, userSettings } from "../../../stores/global";
  import { get } from "svelte/store";
  import { getTypeId } from "@utils/fieldtypesutils";

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

  let {
    entityName = '',
    data = $bindable([]),
    customEntity,
    expands = $bindable([]),
    fieldNames = $bindable([]),
    rootQuery = $bindable(),
    onFiltersDone = null,
    onRefresh = null,
  } = $props();

  let filterModal = $state(false);
  let showColumnManager = $state(false);

  /** @type {any[]} */
  let optionSetDefs = $state([]);
  /** @type {any[]} */
  let allEntities = $state([]);
  /** @type {{ timezone: string }} */
  let settings = $state({ timezone: '' });

  $effect(() => {
    optionSetDefs = get(optionSets);
    allEntities = get(customEntities);
    settings = get(userSettings);
  });

  const openAddNew = () => {
    if (entityName) {
      window.open(`/Open?entity=${entityName}`, '_blank');
    }
  };

  /** @type {ColumnDef[]} */
  let orderedColumns = $state([]);
  let prevEntityId = $state(null);
  let prevAllEntitiesLen = $state(0);

  $effect(() => {
    const len = allEntities.length;
    if (customEntity?.id && customEntity?.fields && (customEntity.id !== prevEntityId || len !== prevAllEntitiesLen)) {
      prevEntityId = customEntity.id;
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
      if (col.type === 'field' && col.lookupNavProp) {
        if (!expandMap[col.lookupNavProp]) {
          expandMap[col.lookupNavProp] = { navigationProp: col.lookupNavProp, select: ['Id', 'Name'] };
        }
      }
    }
    expands = Object.values(expandMap);
  });

  $effect(() => {
    const names = orderedColumns
      .filter(col => col.type === 'field' && col.fieldName)
      .map(col => /** @type {string} */ (col.fieldName));
    if (!names.includes('Id')) {
      names.push('Id');
    }
    fieldNames = names;
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
</script>

<div>
  <Toolbar onAddNew={openAddNew} {onRefresh} onEditFilters={() => filterModal = true} onManageColumns={() => showColumnManager = true} />

  <Modal isOpen={filterModal} toggle={() => filterModal = !filterModal} size="lg">
    <ModalHeader toggle={() => filterModal = !filterModal}>Edit Filters</ModalHeader>
    <ModalBody>
      <QueryBuilder rootGroup={rootQuery} customEntityId={customEntity?.id}></QueryBuilder>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={() => { filterModal = false; onFiltersDone?.(); }}>Done</Button>
    </ModalFooter>
  </Modal>

  <ColumnManager
    show={showColumnManager}
    fields={customEntity?.fields || []}
    relationships={customEntity?.relationships || []}
    {allEntities}
    bind:columns={orderedColumns}
    onClose={() => showColumnManager = false}
  />

  <TableView
    columns={orderedColumns}
    {data}
    {entityName}
    {optionSetDefs}
    {settings}
  />
</div>
