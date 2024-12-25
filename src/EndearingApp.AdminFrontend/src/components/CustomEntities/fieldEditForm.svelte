<script>
  import { OptionSetDefinitionDTO, OptionSetDefinitionsApi } from "@apiclients";
  import { getTypesArray } from "@utils/fieldtypesutils";
  /** @typedef {import('../../apiclient/src/model/FieldDto').default} FieldEntity */
  import { Input, Select, Label, Checkbox, Button } from "flowbite-svelte";

  /** @type {FieldEntity} */
  export let editedField;
  export let isNew = false;

  $: isReadOnlyForm = editedField.isSystemField;
  $: fieldType = `${editedField.type}`;
  $: onFieldTypeChange(fieldType);
  $: isSizeApplicable = editedField.type // @ts-ignore
    ? getTypesArray().find((x) => x.id == editedField.type).isSizeApplicable
    : false;

  /** @param {string} fieldType */
  let onFieldTypeChange = (fieldType) => {
    editedField.type = parseInt(fieldType);
  };
  let typesItems = getTypesArray().map((x) => ({ value: x.id, name: x.name }));
  /** @returns {Promise<OptionSetDefinitionDTO[]>} */
  const getOptionSetPromise = () => {
    const prom = new Promise((res, rej) => {
      // @ts-ignore
      const callback = (error, data) => {
        if (data) {
          res(data);
        } else if (error) {
          rej(error);
        }
      };
      new OptionSetDefinitionsApi().apiOptionSetDefinitionsGet(callback);
    });
    return prom;
  };
</script>

<div class="flex flex-row gap-4 w-full">
  <div class="flex flex-col gap-1 w-full">
    <Label>Name</Label>
    <Input bind:value={editedField.name} disabled={!isNew || isReadOnlyForm}
    ></Input>
    <Label>Display Name</Label>
    <Input bind:value={editedField.displayName} disabled={isReadOnlyForm}
    ></Input>
    <Label>Description</Label>
    <Input bind:value={editedField.description} disabled={isReadOnlyForm}
    ></Input>
    {#if isSizeApplicable}
      <Label>Size</Label>
      <Input
        bind:value={editedField.size}
        type="number"
        disabled={isReadOnlyForm}
      ></Input>
    {/if}
  </div>
  <div class="flex flex-col gap-1 w-full">
    <Label>Type</Label>
    <Select bind:value={fieldType} items={typesItems} disabled={isReadOnlyForm}
    ></Select>
    {#if !!editedField.optionSetDefinitionId}
      {#await getOptionSetPromise() then data}
        <Label>Option Set Definition</Label>
        <Select
          bind:value={editedField.optionSetDefinitionId}
          items={data.map((x) => ({ value: x.id, name: x.name }))}
          disabled={isReadOnlyForm}
        ></Select>
      {/await}
    {/if}
    <Checkbox bind:checked={editedField.isIndexed} disabled={isReadOnlyForm}>
      Is Indexed
    </Checkbox>
    <Checkbox bind:checked={editedField.isUnique} disabled={isReadOnlyForm}>
      Is Unique
    </Checkbox>
    <Checkbox bind:checked={editedField.isNullable} disabled={isReadOnlyForm}>
      Is Nullable
    </Checkbox>
    <Checkbox bind:checked={editedField.isRequired} disabled={isReadOnlyForm}>
      Is Required
    </Checkbox>
  </div>
</div>
