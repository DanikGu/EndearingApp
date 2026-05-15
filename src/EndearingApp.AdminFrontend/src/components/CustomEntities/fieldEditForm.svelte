<script>
  import { run } from "svelte/legacy";
  import { onMount } from "svelte";

  import { OptionSetDefinitionDTO } from "@apiclients";
  import { getTypesArray, getTypeId } from "@utils/fieldtypesutils";
  import { getOptionSets } from "@stores/global";
  /** @typedef {import('../../apiclient/src/model/FieldDto').default} FieldEntity */
  import {
    InputGroup,
    Input,
    Label,
    FormGroup,
    Row,
    Col,
  } from "@sveltestrap/sveltestrap";

  /**
   * @typedef {Object} Props
   * @property {FieldEntity} editedField
   * @property {boolean} [isNew]
   */

  /** @type {Props} */
  let { editedField = $bindable(), isNew = $bindable(false) } = $props();

  /** @type {any[]} */
  let optionSetsData = $state([]);
  let optionSetsLoading = $state(true);
  /** @type {Error | null} */
  let optionSetsError = $state(null);
  /** @type {any[]} */
  let typesItems = $state([]);
  let isReadOnlyForm = $state(!!editedField.isSystemField);
  let isSizeApplicable = $state(false);

  onMount(async () => {
    try {
      const [typesArray] = await Promise.all([getTypesArray(), getOptionSets()]);
      if (typesArray) {
        typesItems = typesArray.map((x) => ({
          value: x.id.toString(),
          name: x.name,
        }));
        isSizeApplicable = editedField.type
          ? typesArray.find((x) => x.id == editedField.type)?.isSizeApplicable ?? false
          : false;
      }
    } catch (e) {
      optionSetsError = /** @type {Error} */ (e);
    } finally {
      optionSetsLoading = false;
    }
  });
  /** @param {{ currentTarget: { value: string; }; }} event */
  async function handleTypeChange(event) {
    const newFieldTypeInt = parseInt(event.currentTarget.value);
    if (editedField.type !== newFieldTypeInt) {
      editedField.type = newFieldTypeInt;
    }
    fieldType = editedField.type;
    const typesArray = await getTypesArray();
    isSizeApplicable = editedField.type
      ? typesArray.find((x) => x.id == editedField.type)?.isSizeApplicable ?? false
      : false;
  }
  let fieldType = $state();
</script>

<Row class="g-3 w-100">
  <Col md="6" class="d-flex flex-column gap-2">
    <FormGroup>
      <Label for="fieldName">Name</Label>
      <Input
        id="fieldName"
        bind:value={editedField.name}
        disabled={!isNew || isReadOnlyForm}
      />
    </FormGroup>
    <FormGroup>
      <Label for="fieldDisplayName">Display Name</Label>
      <Input
        id="fieldDisplayName"
        bind:value={editedField.displayName}
        disabled={isReadOnlyForm}
      />
    </FormGroup>
    <FormGroup>
      <Label for="fieldDescription">Description</Label>
      <Input
        id="fieldDescription"
        type="textarea"
        bind:value={editedField.description}
        disabled={isReadOnlyForm}
      />
    </FormGroup>
    {#if isSizeApplicable}
      <FormGroup>
        <Label for="fieldSize">Size</Label>
        <Input
          id="fieldSize"
          type="number"
          bind:value={editedField.size}
          disabled={isReadOnlyForm}
        />
      </FormGroup>
    {/if}
  </Col>
  <Col md="6" class="d-flex flex-column gap-2">
    <FormGroup check>
      <FormGroup>
        <Label for="fieldType">Type</Label>
        <Input
          type="select"
          id="fieldType"
          on:change={handleTypeChange}
          value={`${editedField.type}`}
          disabled={isReadOnlyForm}
        >
          {#each typesItems as item (item.value)}
            <option value={item.value}>{item.name}</option>
          {/each}
        </Input>
      </FormGroup>
      {#key fieldType}
        {#if editedField.type == getTypeId("Option Set") || editedField.type == getTypeId("Option Set MultiSelect")}
          {#if optionSetsLoading}
            <p>Loading option sets...</p>
          {:else if optionSetsError}
            <p class="text-danger">
              Error loading option sets: {optionSetsError.message || optionSetsError}
            </p>
          {:else}
            <FormGroup>
              <Label for="optionSetDefinition">Option Set Definition</Label>
              <Input
                type="select"
                id="optionSetDefinition"
                bind:value={editedField.optionSetDefinitionId}
                disabled={isReadOnlyForm}
              >
                {#if optionSetsData && optionSetsData.length > 0}
                  {#each optionSetsData as os (os.id)}
                    <option value={os.id}>{os.name}</option>
                  {/each}
                {:else}
                  <option value="" disabled>No option sets available</option>
                {/if}
              </Input>
            </FormGroup>
          {/if}
        {/if}
        <InputGroup>
          <Input
            type="checkbox"
            id="isIndexedField"
            bind:checked={editedField.isIndexed}
            disabled={isReadOnlyForm}
          />
          <Label for="isIndexedField" check>Is Indexed</Label>
        </InputGroup>
        <InputGroup>
          <Input
            type="checkbox"
            id="isUniqueField"
            bind:checked={editedField.isUnique}
            disabled={isReadOnlyForm}
          />
          <Label for="isUniqueField" check>Is Unique</Label>
        </InputGroup>
        <InputGroup>
          <Input
            type="checkbox"
            id="isNullableField"
            bind:checked={editedField.isNullable}
            disabled={isReadOnlyForm}
          />
          <Label for="isNullableField" check>Is Nullable</Label>
        </InputGroup>
        <InputGroup>
          <Input
            type="checkbox"
            id="isRequiredField"
            bind:checked={editedField.isRequired}
            disabled={isReadOnlyForm}
          />
          <Label for="isRequiredField" check>Is Required</Label>
        </InputGroup>
        <InputGroup>
          <Input
            type="checkbox"
            id="isFullTextField"
            bind:checked={editedField.isFullTextSearch}
            disabled={isReadOnlyForm}
          />
          <Label for="isFullTextField" check>Is Full Text Search</Label>
        </InputGroup>
      {/key}
    </FormGroup>
  </Col>
</Row>
