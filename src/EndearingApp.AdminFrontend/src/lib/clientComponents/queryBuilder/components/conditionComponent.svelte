<script>
  import { Button, InputGroup, Icon } from "@sveltestrap/sveltestrap";
  import { Condition, Field } from "../logic/typeDefinitions";
  import { getContext, onMount } from "svelte";
  import { get } from "svelte/store";
  import {
    CustomeEntityDTO,
    FieldDto,
    OptionDTO,
    OptionSetDefinitionDTO,
    RelationshipDTO,
  } from "@apiclients/src";
  import { getTypeId, getTypeName } from "@utils/fieldtypesutils";
  import { FILTER_OPERATORS } from "../logic/filterOperatorsMatrix";
  import { customEntities as customEntitiesStore, optionSets as optionSetsStore } from "../../../../stores/global";

  import FieldSelector from "./FieldSelector.svelte";
  import OperatorSelector from "./OperatorSelector.svelte";
  import TextValue from "./valueComponents/TextValue.svelte";
  import NumberValue from "./valueComponents/NumberValue.svelte";
  import DateTimeValue from "./valueComponents/DateTimeValue.svelte";
  import BoolValue from "./valueComponents/BoolValue.svelte";
  import LookupValue from "./valueComponents/LookupValue.svelte";
  import LookupMultiSelectValue from "./valueComponents/LookupMultiSelectValue.svelte";
  import OptionSetValue from "./valueComponents/OptionSetValue.svelte";
  import OptionSetMultiSelectValue from "./valueComponents/OptionSetMultiSelectValue.svelte";

  /**
   * @typedef {Object} Props
   * @property {Condition} condition
   * @property {any} deleteCondition
   * @property {Field[]} fields
   */

  /** @type {Props} */
  let { condition = $bindable(), deleteCondition, fields } = $props();

  /** @type {CustomeEntityDTO[]} */
  let customEntities = get(customEntitiesStore);
  /** @type {OptionSetDefinitionDTO[]} */
  let optionSetDefinitions = get(optionSetsStore);
  /** @type {FieldDto | undefined} */
  let fieldDefinition;
  /** @type {string | null | undefined} */
  let controlType = $state();
  /** @type {string | null} */
  let currEntityId = getContext("customEntityId");
  /** @type {OptionDTO[]} */
  let valueOptions = $state([]);
  /** @type {boolean} */
  let isSelect = $state(false);
  /** @type {string[]} */
  let availableOperators = $state([]);
  /** @type {boolean} */
  let isLookup = $state(false);
  /** @type {string | null} */
  let lookupEntityName = $state(null);
  /** @type {boolean} */
  let _forceUpdate = $state(false);

  onMount(() => {
    const unsub1 = customEntitiesStore.subscribe((v) => {
      customEntities = v;
      if (condition.field) onFieldTypeChange(true);
    });
    const unsub2 = optionSetsStore.subscribe((v) => {
      optionSetDefinitions = v;
    });
    return () => {
      unsub1();
      unsub2();
    };
  });

  /** @type {Set<string>} */
  const multiValueOps = new Set(['in', 'any_in', 'all_in', 'allonly']);

  /** @param {string} newOp */
  const onOperatorChanged = (newOp) => {
    condition.operation = newOp;
    if (multiValueOps.has(newOp)) {
      if (!Array.isArray(condition.value)) {
        condition.value = condition.value ? [condition.value] : [];
      }
    } else if (Array.isArray(condition.value)) {
      condition.value = condition.value[0] != null ? condition.value[0] : null;
    }
    _forceUpdate = !_forceUpdate;
  };

  /** @param {FieldDto} fieldDef
   *  @returns {string | null} */
  const findLookupEntityName = (fieldDef) => {
    if (!fieldDef || !currEntityId) return null;
    const currEntity = customEntities.find((x) => x.id == currEntityId);
    if (!currEntity || !currEntity.relationships) return null;
    const relationship = currEntity.relationships.find(
      (/** @type {RelationshipDTO} */ r) => r.sourceFieldId === fieldDef.id,
    );
    if (!relationship) return null;
    const referencedEntity = customEntities.find(
      (x) => x.id === relationship.referencedCustomEntityId,
    );
    return referencedEntity ? referencedEntity.name : null;
  };

  /** @param {boolean} [mount] */
  const onFieldTypeChange = (mount) => {
    if (!mount) {
      condition.value = null;
    }
    const currEntity = customEntities.find((x) => x.id == currEntityId);
    const fd = currEntity?.fields.find(
      (/** @type {FieldDto} */ field) => field.name === condition.field,
    );
    fieldDefinition = fd;

    if (!fd) {
      controlType = null;
      availableOperators = [];
      isSelect = false;
      isLookup = false;
      lookupEntityName = null;
      valueOptions = [];
      return;
    }

    condition.fieldDto = fd;

    controlType = (() => {
      const mappings = {
        [getTypeId("Unlimited Text")]: "textarea",
        [getTypeId("Limited Text")]: "text",
        [getTypeId("Whole Number")]: "number",
        [getTypeId("Whole Number (Small)")]: "number",
        [getTypeId("Whole Number (Big)")]: "number",
        [getTypeId("Decimal Number")]: "number",
        [getTypeId("Date and Time")]: "datetime-local",
        [getTypeId("Date")]: "date",
        [getTypeId("Time")]: "time",
        [getTypeId("Yes/No")]: "checkbox",
        [getTypeId("Binary Data")]: "file",
        [getTypeId("Unique Identifier")]: "text",
        [getTypeId("Option Set")]: "select",
        [getTypeId("Option Set MultiSelect")]: "select",
      };
      return mappings[fd.type] || "text";
    })();

    const typeName = getTypeName(fd.type);
    availableOperators = FILTER_OPERATORS[typeName]
      ? [...FILTER_OPERATORS[typeName]]
      : [];

    if (
      availableOperators.length > 0 &&
      !availableOperators.includes(condition.operation)
    ) {
      condition.operation = availableOperators[0];
    }

    if (
      fd.type === getTypeId("Option Set") ||
      fd.type === getTypeId("Option Set MultiSelect")
    ) {
      isSelect = true;
      isLookup = false;
      const optSetDefinition = optionSetDefinitions.find(
        (x) => x.id == fd.optionSetDefinitionId,
      );
      valueOptions = optSetDefinition ? optSetDefinition.options : [];
    } else {
      valueOptions = [];
      isSelect = false;
      const relatedEntityName = findLookupEntityName(fd);
      isLookup = !!relatedEntityName;
      lookupEntityName = relatedEntityName;
    }

    _forceUpdate = !_forceUpdate;
  };
</script>

<InputGroup class="p-0 pt-1" data-qb-group="">
  <div style="flex: 1 1 0; min-width: 0; display: flex;">
    <FieldSelector
      fields={fields}
      bind:value={condition.field}
      onFieldChange={() => onFieldTypeChange(false)}
    />
  </div>

  <div style="flex: 1 1 0; min-width: 0; display: flex;">
    <OperatorSelector
      {availableOperators}
      value={condition.operation}
      onchange={onOperatorChanged}
      disabled={availableOperators.length === 0 || !condition.field}
    />
  </div>

  <div style="flex: 1 1 0; min-width: 0; display: flex;">
  {#key condition.operation + (_forceUpdate ? '_' : '')}
    {#if isLookup && condition.operation === "in"}
      <LookupMultiSelectValue bind:value={condition.value} {lookupEntityName} />
    {:else if isLookup}
      <LookupValue bind:value={condition.value} {lookupEntityName} />
    {:else if isSelect && multiValueOps.has(condition.operation)}
      <OptionSetMultiSelectValue bind:value={condition.value} options={valueOptions} />
    {:else if isSelect}
      <OptionSetValue bind:value={condition.value} options={valueOptions} />
    {:else if controlType === "checkbox"}
      <BoolValue bind:value={condition.value} />
    {:else if controlType === "number"}
      <NumberValue bind:value={condition.value} operation={condition.operation} />
    {:else if controlType === "datetime-local" || controlType === "date" || controlType === "time"}
      <DateTimeValue bind:value={condition.value} inputType={controlType} />
    {:else if controlType !== "file"}
      <TextValue bind:value={condition.value} inputType={controlType || "text"} operation={condition.operation} />
    {/if}
  {/key}
  </div>

  <Button color="danger" outline on:click={deleteCondition}>
    <Icon name="trash"></Icon>
  </Button>
</InputGroup>

<style>
  :global(.input-group[data-qb-group] > .form-select),
  :global(.input-group[data-qb-group] > .form-control) {
    width: 100%;
  }

  :global(.input-group[data-qb-group] > .form-select:not(:first-child)),
  :global(.input-group[data-qb-group] > .form-control:not(:first-child)) {
    margin-left: 0;
  }

  :global(.dark .sv-control) {
    background-color: var(--bs-body-bg) !important;
    border-color: var(--bs-border-color) !important;
    color: var(--bs-body-color) !important;
  }

  :global(.dark .sv-input--text) {
    color: var(--bs-body-color) !important;
  }

  :global(.dark .sv_dropdown) {
    background-color: var(--bs-body-bg) !important;
    border-color: var(--bs-border-color) !important;
  }

  :global(.dark .sv-item--wrap) {
    color: var(--bs-body-color) !important;
  }

  :global(.dark .sv-item--wrap.sv-dd-item-active),
  :global(.dark .sv-item--wrap:hover) {
    background-color: var(--bs-tertiary-bg) !important;
  }

  :global(.dark .sv-item--wrap.is-multi) {
    background-color: var(--bs-secondary-bg) !important;
    color: var(--bs-body-color) !important;
  }

  :global(.dark .sv-item--btn) {
    background-color: var(--bs-secondary-bg) !important;
    color: var(--bs-body-color) !important;
  }

  :global(.dark .sv-item--btn:hover) {
    background-color: var(--bs-tertiary-bg) !important;
  }

  :global(.dark .sv-btn-separator) {
    background-color: var(--bs-border-color) !important;
  }

  :global(.dark .in-dropdown.sv-dd-item-active) {
    background-color: var(--bs-tertiary-bg) !important;
  }

  :global(.dark .sv-btn-indicator) {
    color: var(--bs-body-color) !important;
  }

  :global(.dark .list-group-item) {
    background-color: var(--bs-body-bg);
    color: var(--bs-body-color);
    border-color: var(--bs-border-color);
  }

  :global(.dark .list-group-item:hover) {
    background-color: var(--bs-tertiary-bg);
  }

  :global(.dark .lookup-dropdown) {
    background-color: var(--bs-body-bg);
    border: 1px solid var(--bs-border-color);
  }
</style>
