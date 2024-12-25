<script>
  import { Input, Label, Select } from "flowbite-svelte";
  /** @typedef {import('../../apiclient/src/model/RelationshipDTO').default} Relationship */
  /** @typedef {import('../../apiclient/src/model/CustomeEntityDTO').default} CustomEntity */
  /** @typedef {import('../../apiclient/src/model/FieldDto').default} FieldDto */

  /** @type {boolean} */
  export let isNew = false;

  /** @type {Relationship} */
  export let relationship;

  /** @type {CustomEntity[]} */
  export let customEntities;

  /** @type {CustomEntity} */
  export let currentEntity;
  $: selectedSourceField = currentEntity.fields.find(
    /** @param {FieldDto} x */
    (x) => x.id == relationship.sourceFieldId,
  );

  $: selectedTargetEntity = customEntities.find(
    (x) => x.id == relationship.referencedCustomEntityId,
  );

  $: fromFieldSelectItems = currentEntity.fields.map(
    /** @param {FieldDto} x */
    (x) => ({
      name: x.displayName,
      value: x.id,
    }),
  );

  $: customEntitySelectItems = customEntities.map((x) => ({
    name: x.displayName,
    value: x.id,
  }));

  $: toFieldSelectItems = selectedTargetEntity?.fields
    .filter(
      /** @param {FieldDto} x */
      (x) => x.type == selectedSourceField.type,
    )
    .map(
      /** @param {FieldDto} x */
      (x) => ({
        name: x.displayName,
        value: x.id,
      }),
    );
</script>

<div class="flex flex-row gap-4 w-full">
  <div class="flex flex-col gap-1 w-full">
    <Label>Constraint Name</Label>
    <Input bind:value={relationship.constraintName} disabled={!isNew}></Input>
    <Label>From Field</Label>
    <Select
      bind:items={fromFieldSelectItems}
      bind:value={relationship.sourceFieldId}
      disabled={!isNew}
    ></Select>
    <Label>To Table</Label>
    <Select
      bind:items={customEntitySelectItems}
      bind:value={relationship.referencedCustomEntityId}
      disabled={!isNew}
    ></Select>
    <Label>To Field</Label>
    <Select
      bind:items={toFieldSelectItems}
      bind:value={relationship.referencedFieldId}
      disabled={!isNew}
    ></Select>
  </div>
</div>
