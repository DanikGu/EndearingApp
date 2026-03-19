<script>
  import { Input, Label, FormGroup, Row, Col } from "@sveltestrap/sveltestrap";
  import { customEntities } from "../../stores/global";

  /** @typedef {import('../../apiclient/src/model/RelationshipDTO').default} Relationship */
  /** @typedef {import('../../apiclient/src/model/CustomeEntityDTO').default} CustomEntity */
  /** @typedef {import('../../apiclient/src/model/FieldDto').default} FieldDto */

  /**
   * @typedef {Object} Props
   * @property {boolean} [isNew]
   * @property {Relationship} relationship
   * @property {CustomEntity} currentEntity
   */

  /** @type {Props} */
  let {
    isNew = $bindable(false),
    relationship = $bindable(),
    currentEntity,
  } = $props();

  let manualTrigger = $state(0);

  function refreshItems() {
    manualTrigger++;
  }

  /** @type {FieldDto | undefined} */
  let selectedSourceField = $derived.by(() => {
    manualTrigger;
    const fields = currentEntity?.fields;
    const targetId = relationship?.sourceFieldId;

    return fields && targetId
      ? fields.find((/** @type {any} */ x) => x.id === targetId)
      : undefined;
  });

  let selectedTargetEntity = $derived.by(() => {
    manualTrigger;
    const entities = $customEntities;
    const targetId = relationship?.referencedCustomEntityId;

    return entities && targetId
      ? entities.find((x) => x.id === targetId)
      : undefined;
  });

  let fromFieldSelectItems = $derived.by(() => {
    manualTrigger;
    const fields = currentEntity?.fields;

    return fields
      ? fields.map((/** @type {any} */ x) => ({
          name: x.displayName,
          value: x.id,
        }))
      : [];
  });

  let customEntitySelectItems = $derived.by(() => {
    manualTrigger;
    const entities = $customEntities;

    return entities
      ? entities.map((x) => ({
          name: x.displayName,
          value: x.id,
        }))
      : [];
  });

  let toFieldSelectItems = $derived.by(() => {
    manualTrigger;
    const fields = selectedTargetEntity?.fields;
    const sourceField = selectedSourceField;
    const rel = relationship;

    if (
      !fields ||
      !rel?.referencedCustomEntityId ||
      !rel?.sourceFieldId ||
      !sourceField?.id
    ) {
      return [];
    }

    return fields
      .filter((/** @type {any} */ x) => x.type === sourceField.type)
      .map((/** @type {any} */ x) => ({
        name: x.displayName,
        value: x.id,
      }));
  });
</script>

<Row class="g-3 w-100">
  <Col md="12" class="d-flex flex-column gap-2">
    <FormGroup>
      <Label for="relationshipConstraintName">Constraint Name</Label>
      <Input
        id="relationshipConstraintName"
        bind:value={relationship.constraintName}
        disabled={!isNew}
      />
    </FormGroup>

    <FormGroup>
      <Label for="relationshipSourceField">From Field</Label>
      <Input
        type="select"
        id="relationshipSourceField"
        bind:value={relationship.sourceFieldId}
        disabled={!isNew}
        on:change={() => {
          console.log(relationship.sourceFieldId);
          console.log(relationship.referencedCustomEntityId);
          console.log(
            isNew,
            selectedTargetEntity,
            selectedSourceField,
            manualTrigger,
          );
          refreshItems();
        }}
      >
        <option value={undefined} selected={relationship.sourceFieldId == null}
          >Select source field...</option
        >
        {#if fromFieldSelectItems}
          {#each fromFieldSelectItems as item (item.value)}
            <option value={item.value}>{item.name}</option>
          {/each}
        {/if}
      </Input>
    </FormGroup>

    <FormGroup>
      <Label for="relationshipReferencedEntity">To Table</Label>
      <Input
        type="select"
        id="relationshipReferencedEntity"
        bind:value={relationship.referencedCustomEntityId}
        on:change={() => {
          console.log(relationship.sourceFieldId);
          console.log(relationship.referencedCustomEntityId);
          console.log(
            isNew,
            selectedTargetEntity,
            selectedSourceField,
            manualTrigger,
          );
          refreshItems();
        }}
        disabled={!isNew}
      >
        <option
          value={undefined}
          selected={relationship.referencedCustomEntityId == null}
          >Select target table...</option
        >
        {#if customEntitySelectItems}
          {#each customEntitySelectItems as item (item.value)}
            <option value={item.value}>{item.name}</option>
          {/each}
        {/if}
      </Input>
    </FormGroup>

    <FormGroup>
      <Label for="relationshipReferencedField">To Field</Label>
      {#key manualTrigger}
        <Input
          type="select"
          id="relationshipReferencedField"
          bind:value={relationship.referencedFieldId}
          disabled={!isNew || !selectedTargetEntity || !selectedSourceField}
        >
          <option
            value={undefined}
            selected={relationship.referencedFieldId == null}
            >Select target field...</option
          >
          {#if toFieldSelectItems && toFieldSelectItems.length > 0}
            {#each toFieldSelectItems as item (item.value)}
              <option value={item.value}>{item.name}</option>
            {/each}
          {:else if selectedTargetEntity && selectedSourceField}
            <option value={undefined} disabled
              >No matching type fields in target</option
            >
          {/if}
        </Input>
      {/key}
    </FormGroup>
  </Col>
</Row>
