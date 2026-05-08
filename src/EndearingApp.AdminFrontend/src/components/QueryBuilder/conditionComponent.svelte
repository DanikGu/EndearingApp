<script>
  import { Button, Input, InputGroup, Icon } from "@sveltestrap/sveltestrap";
  import { Condition, Field } from "./typeDefinitions";
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
  import { FILTER_OPERATORS, OPERATOR_LABELS } from "./filterOperatorsMatrix";
  import Svelecte from "svelecte";
  import { customEntities as customEntitiesStore, optionSets as optionSetsStore } from "../../stores/global";
  import { fetchEntityById, fullTextSearch, fetchEntities } from "$lib/api/odata";

  /** @typedef {import('@sveltestrap/sveltestrap').InputType} InputType */

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
  /** @type {FieldDto} */
  let fieldDefinition;
  /** @type {InputType | null | undefined} */
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
  /** @type {string} */
  let searchQuery = $state('');
  /** @type {{Id: string, Name: string}[]} */
  let searchResults = $state([]);
  /** @type {string | null} */
  let lookupSelectedName = $state(null);
  /** @type {any} */
  let searchTimeout = null;
  /** @type {boolean} */
  let showDropdown = $state(false);
  const stringFuncOps = ['contains', 'startswith', 'endswith'];

  onMount(() => {
    const unsub1 = customEntitiesStore.subscribe(v => { customEntities = v; if (condition.field) onFieldTypeChange(true); });
    const unsub2 = optionSetsStore.subscribe(v => { optionSetDefinitions = v; });
    return () => { unsub1(); unsub2(); };
  });

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

  /** @param {string} id
   *  @returns {Promise<string | null>} */
  const fetchEntityName = async (id) => {
    if (!lookupEntityName || !id) return null;
    const { data, error } = await fetchEntityById(lookupEntityName, id, { select: ['id', 'name'] });
    if (error || !data) return null;
    return data.Name || data.name || null;
  };

  const onFieldTypeChange = (mount) => {
    if (!mount) {
      condition.value = null;
    }
    const currEntity = customEntities.find((x) => x.id == currEntityId);
    fieldDefinition = currEntity?.fields.find(
      (/** @type {FieldDto} */ field) => field.name === condition.field,
    );

    controlType = (() => {
      if (!fieldDefinition?.type) return null;
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
      return mappings[fieldDefinition.type] || "text";
    })();

    if (fieldDefinition) {
      condition.fieldDto = fieldDefinition;
    }

    const typeName = fieldDefinition ? getTypeName(fieldDefinition.type) : null;
    availableOperators = typeName && FILTER_OPERATORS[typeName] ? [...FILTER_OPERATORS[typeName]] : [];

    if (availableOperators.length > 0 && !availableOperators.includes(condition.operation)) {
      condition.operation = availableOperators[0];
    }

    if (
      fieldDefinition?.type === getTypeId("Option Set") ||
      fieldDefinition?.type === getTypeId("Option Set MultiSelect")
    ) {
      isSelect = true;
      isLookup = false;
      const optSetDefinintion = optionSetDefinitions.find(
        (x) => x.id == fieldDefinition.optionSetDefinitionId,
      );
      valueOptions = optSetDefinintion ? optSetDefinintion.options : [];
    } else {
      valueOptions = [];
      isSelect = false;
      const relatedEntityName = findLookupEntityName(fieldDefinition);
      isLookup = !!relatedEntityName;
      lookupEntityName = relatedEntityName;
      if (isLookup) {
        searchQuery = condition.value ? (lookupSelectedName || '') : '';
        searchResults = [];
        showDropdown = false;
        if (condition.operation === 'in') {
          if (!Array.isArray(condition.value)) {
            condition.value = condition.value ? [condition.value] : [];
          }
          searchResults = condition.value.map(id => ({ Id: id, Name: id }));
          fetchLookupResults('');
        } else if (Array.isArray(condition.value)) {
          condition.value = condition.value[0] || null;
          if (condition.value && !lookupSelectedName) {
            fetchEntityName(condition.value).then(name => {
              lookupSelectedName = name;
            });
          }
        } else if (condition.value && !lookupSelectedName) {
          fetchEntityName(condition.value).then(name => {
            lookupSelectedName = name;
          });
        }
      }
    }
  };

  const onOperatorChange = () => {
    if (condition.operation === 'in') {
      if (!Array.isArray(condition.value)) {
        condition.value = condition.value ? [condition.value] : [];
      }
      if (isLookup) {
        searchResults = condition.value.map(id => ({ Id: id, Name: id }));
        fetchLookupResults('');
      }
    } else if (Array.isArray(condition.value)) {
      condition.value = condition.value[0] || null;
    }
  };

  const onValueChange = () => {
  };

  /** @param {string} query */
  const fetchLookupResults = async (query) => {
    if (!lookupEntityName) {
      searchResults = [];
      showDropdown = false;
      return;
    }
    const top = condition.operation === 'in' ? 50 : 5;
    const opts = { select: ['id', 'name'], top };
    const { data, error } = query
      ? await fullTextSearch(lookupEntityName, query, opts)
      : await fetchEntities(lookupEntityName, { select: ['id', 'name'], top });
    if (error || !data) {
      searchResults = [];
      showDropdown = false;
      return;
    }
    let results = (data.value || []).map(r => ({ Id: r.Id, Name: r.Name || r.name || r.Id }));

    if (condition.operation === 'in' && Array.isArray(condition.value) && condition.value.length > 0) {
      const resultIds = new Set(results.map(r => r.Id));
      const missing = condition.value.filter(id => id && !resultIds.has(id));
      if (missing.length > 0) {
        try {
          const idFilter = missing.map(id => `Id eq ${id}`).join(' or ');
          const { data: selData } = await fetchEntities(lookupEntityName, {
            filter: idFilter, select: ['id', 'name'], top: missing.length
          });
          if (selData?.value) {
            for (const r of selData.value) {
              results.push({ Id: r.Id, Name: r.Name || r.name || r.Id });
            }
          }
        } catch {}
        for (const id of missing) {
          if (!results.find(r => r.Id === id)) {
            results.push({ Id: id, Name: id });
          }
        }
      }
    }

    searchResults = results;
    showDropdown = searchResults.length > 0;
  };

  const onLookupFocus = () => {
    if (!searchQuery && !lookupSelectedName) {
      fetchLookupResults('');
    }
  };

  const onLookupSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fetchLookupResults(searchQuery);
    }, 300);
  };

  /** @param {{Id: string, Name: string}} item */
  const selectLookupResult = (item) => {
    condition.value = item.Id;
    lookupSelectedName = item.Name;
    searchQuery = '';
    searchResults = [];
    showDropdown = false;
  };

  const clearLookupValue = () => {
    condition.value = null;
    lookupSelectedName = null;
    searchQuery = '';
    searchResults = [];
    showDropdown = false;
  };

  const handleLookupKeydown = (/** @type {KeyboardEvent} */ e) => {
    if (e.key === 'Escape') {
      showDropdown = false;
    }
  };
</script>

<InputGroup class="p-0 pt-1">
  <Input
    type="select"
    placeholder="Select Field"
    on:change={() => onFieldTypeChange(false)}
    bind:value={condition.field}
  >
    <option value="">Select Field...</option>
    {#each fields as field}
      <option value={field.name}>{field.displayName}</option>
    {/each}
  </Input>

  <Input
    type="select"
    placeholder="Select Operator"
    bind:value={condition.operation}
    on:change={onOperatorChange}
    disabled={availableOperators.length === 0 || !condition.field}
  >
    <option value="">Select Operator...</option>
    {#each availableOperators as op}
      <option value={op}>{OPERATOR_LABELS[op] || op}</option>
    {/each}
  </Input>

  {#key condition.operation}
    {#if isLookup && condition.operation === 'in'}
      <div class="form-control">
        <Svelecte
          options={searchResults.map((x) => ({
            value: x.Id,
            text: x.Name,
          }))}
          multiple
          bind:value={condition.value}
          onChange={onValueChange}
        ></Svelecte>
      </div>
    {:else if isLookup}
      <div class="lookup-container form-control p-0 position-relative d-flex align-items-center">
        {#if lookupSelectedName && condition.value}
          <div class="d-flex justify-content-between align-items-center w-100 px-2">
            <span class="text-truncate">{lookupSelectedName}</span>
            <button
              type="button"
              class="btn btn-sm p-0 border-0 bg-transparent ms-2"
              on:click={clearLookupValue}
              aria-label="Remove"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        {:else if condition.value && !lookupSelectedName}
          <div class="d-flex align-items-center w-100 px-2 text-muted">
            <span class="text-truncate">{condition.value.slice(0, 8)}...</span>
            <button
              type="button"
              class="btn btn-sm p-0 border-0 bg-transparent ms-2"
              on:click={clearLookupValue}
              aria-label="Remove"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        {:else}
          <input
            type="search"
            class="form-control border-0 h-100"
            placeholder="Search..."
            bind:value={searchQuery}
            on:focus={onLookupFocus}
            on:input={onLookupSearch}
            on:keydown={handleLookupKeydown}
            on:blur={() => setTimeout(() => { showDropdown = false; }, 200)}
          />
        {/if}
        {#if showDropdown}
          <div class="lookup-dropdown list-group position-absolute w-100 z-3" style="top: 100%; left: 0;">
            {#each searchResults as item (item.Id)}
              <button
                type="button"
                class="list-group-item list-group-item-action"
                on:mousedown={() => selectLookupResult(item)}
              >
                {item.Name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {:else if isSelect && condition.operation === 'in'}
      <div class="form-control">
        <Svelecte
          options={valueOptions.map((x) => ({
            value: `${x.value}`,
            text: x.name,
          }))}
          multiple
          bind:value={condition.value}
          onChange={onValueChange}
        ></Svelecte>
      </div>
    {:else if isSelect}
      <div class="form-control">
        <Svelecte
          options={valueOptions.map((x) => ({
            value: `${x.value}`,
            text: x.name,
          }))}
          bind:value={condition.value}
          onChange={onValueChange}
        ></Svelecte>
      </div>
    {:else if condition.operation === 'in'}
      <Input
        type="text"
        placeholder="Comma-separated values"
        bind:value={condition.value}
        on:change={onValueChange}
      />
    {:else if stringFuncOps.includes(condition.operation)}
      <Input
        type="text"
        placeholder="Value"
        bind:value={condition.value}
        on:change={onValueChange}
      />
    {:else}
      <Input
        type={controlType ?? "text"}
        placeholder="Value"
        bind:value={condition.value}
        on:change={onValueChange}
      >
      </Input>
    {/if}
  {/key}
  <Button color="danger" outline on:click={deleteCondition}>
    <Icon name="trash"></Icon>
  </Button>
</InputGroup>
