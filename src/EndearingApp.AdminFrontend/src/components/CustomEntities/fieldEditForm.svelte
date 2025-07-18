<script>
  import { run } from "svelte/legacy";

  import { OptionSetDefinitionDTO, OptionSetDefinitionsApi } from "@apiclients";
  import { getTypesArray, getTypeId } from "@utils/fieldtypesutils";
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

  let typesItems = getTypesArray().map((x) => ({
    value: x.id.toString(),
    name: x.name,
  }));

  /** @returns {Promise<OptionSetDefinitionDTO[]>} */
  const getOptionSetPromise = async () => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const callback = (error, data, response) => {
        if (error) {
          console.error("Error fetching option sets:", error);
          reject(error);
        } else {
          resolve(data || []);
        }
      };
      // @ts-ignore
      new OptionSetDefinitionsApi().apiOptionSetDefinitionsGet(callback);
    });
  };
  let isReadOnlyForm = $state(!!editedField.isSystemField);
  // @ts-ignore
  let isSizeApplicable = $state(
    editedField.type
      ? getTypesArray().find((x) => x.id == editedField.type)?.isSizeApplicable
      : false,
  );
  /** @param {{ currentTarget: { value: string; }; }} event */
  function handleTypeChange(event) {
    const newFieldTypeInt = parseInt(event.currentTarget.value);
    if (editedField.type !== newFieldTypeInt) {
      editedField.type = newFieldTypeInt;
    }
    fieldType = editedField.type;
    isSizeApplicable = editedField.type
      ? getTypesArray().find((x) => x.id == editedField.type)?.isSizeApplicable
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
          {#await getOptionSetPromise()}
            <p>Loading option sets...</p>
          {:then optionSetData}
            <FormGroup>
              <Label for="optionSetDefinition">Option Set Definition</Label>
              <Input
                type="select"
                id="optionSetDefinition"
                bind:value={editedField.optionSetDefinitionId}
                disabled={isReadOnlyForm}
              >
                {#if optionSetData && optionSetData.length > 0}
                  {#each optionSetData as os (os.id)}
                    <option value={os.id}>{os.name}</option>
                  {/each}
                {:else}
                  <option value="" disabled>No option sets available</option>
                {/if}
              </Input>
            </FormGroup>
          {:catch error}
            <p class="text-danger">
              Error loading option sets: {error.message || error}
            </p>
          {/await}
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
