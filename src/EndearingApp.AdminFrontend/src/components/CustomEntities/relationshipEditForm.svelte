<script>
  import { Input, Label, FormGroup, Row, Col } from "@sveltestrap/sveltestrap";
  /** @typedef {import('../../apiclient/src/model/RelationshipDTO').default} Relationship */
  /** @typedef {import('../../apiclient/src/model/CustomeEntityDTO').default} CustomEntity */
  /** @typedef {import('../../apiclient/src/model/FieldDto').default} FieldDto */

  /**
   * @typedef {Object} Props
   * @property {boolean} [isNew]
   * @property {Relationship} relationship
   * @property {CustomEntity[]} customEntities
   * @property {CustomEntity} currentEntity
   */

  /** @type {Props} */
  let {
    isNew = $bindable(false),
    relationship = $bindable(),
    customEntities,
    currentEntity,
  } = $props();

  let selectedSourceField = $derived(
    currentEntity && currentEntity.fields
      ? currentEntity.fields.find(
          /** @param {FieldDto} x */
          (x) => x.id === relationship.sourceFieldId,
        )
      : undefined,
  );

  let selectedTargetEntity = $derived(
    customEntities
      ? customEntities.find(
          (x) => x.id === relationship.referencedCustomEntityId,
        )
      : undefined,
  );

  let fromFieldSelectItems = $derived(
    currentEntity && currentEntity.fields
      ? currentEntity.fields.map(
          /** @param {FieldDto} x */
          (x) => ({
            name: x.displayName,
            value: x.id,
          }),
        )
      : [],
  );

  let customEntitySelectItems = $derived(
    customEntities
      ? customEntities.map((x) => ({
          name: x.displayName,
          value: x.id,
        }))
      : [],
  );

  let toFieldSelectItems = $derived(
    selectedTargetEntity?.fields && selectedSourceField
      ? selectedTargetEntity.fields
          .filter(
            /** @param {FieldDto} x */
            (x) => x.type === selectedSourceField.type,
          )
          .map(
            /** @param {FieldDto} x */
            (x) => ({
              name: x.displayName,
              value: x.id,
            }),
          )
      : [],
  );
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
    </FormGroup>
  </Col>
</Row>
