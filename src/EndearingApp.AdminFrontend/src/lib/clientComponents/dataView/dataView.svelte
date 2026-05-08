<script>
  import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "@sveltestrap/sveltestrap";
  import Toolbar from "./toolbar.svelte";
  import ColumnManager from "./columnManager.svelte";
  import TableView from "./tableView.svelte";
  import QueryBuilder from "../../../components/QueryBuilder/queryBuilder.svelte";
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
    data = [],
    customEntity,
    expands = $bindable([]),
    rootQuery = $bindable(),
    onFiltersDone = null,
    onRefresh = null,
  } = $props();

  let filterModal = $state(false);
  let showColumnManager = $state(false);

  let optionSetDefs = $state([]);
  let allEntities = $state([]);
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

  let orderedColumns = $state([]);
  let prevEntityId = $state(null);

  $effect(() => {
    if (customEntity?.id && customEntity?.fields && customEntity.id !== prevEntityId) {
      prevEntityId = customEntity.id;
      orderedColumns = customEntity.fields.map(buildFieldColumnDef);
    }
  });

  $effect(() => {
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
      lookupEntityName: lookupInfo ? lookupInfo.entityName : null,
      lookupNavProp: lookupInfo ? lookupInfo.navProp : null,
      optionSetDefId: field.optionSetDefinitionId || null,
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
