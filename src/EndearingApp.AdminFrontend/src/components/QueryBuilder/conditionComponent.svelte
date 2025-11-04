<script>
  import { Button, Input, InputGroup, Icon } from "@sveltestrap/sveltestrap";
  import { Condition, Field } from "./typeDefinitions";
  import { getContext, onMount } from "svelte";
  import {
    CustomeEntityDTO,
    FieldDto,
    OptionDTO,
    OptionSetDefinitionDTO,
  } from "@apiclients/src";
  import { getTypeId } from "@utils/fieldtypesutils";
  import Svelecte from "svelecte";

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
  let customEntities = [];
  /** @type {OptionSetDefinitionDTO[]} */
  let optionSetDefinitions = [];
  /** @type {FieldDto} */
  let fieldDefinition;
  /** @type {InputType | null | undefined} */
  let controlType = $state();
  /** @type {string | null} */
  let currEntityId;
  /** @type {OptionDTO[]} */
  let valueOptions = [];
  /** @type {boolean} */
  let isSelect = $state(false);

  onMount(() => {
    customEntities = getContext("etnStructure");
    optionSetDefinitions = getContext("optionSets");
    currEntityId = getContext("customEntityId");
    onFieldTypeChange(true);
  });

  /** @param {boolean} mount */
  const onFieldTypeChange = (mount) => {
    if (!mount) {
      condition.value = null;
    }
    const currEntity = customEntities.find((x) => x.id == currEntityId);
    fieldDefinition = currEntity?.fields.find(
      (/** @type {FieldDto} */ field) => field.name === condition.field,
    );
    // @ts-ignore
    controlType = (() => {
      console.log(fieldDefinition);
      if (!fieldDefinition?.type) {
        return null;
      }
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
      return mappings[fieldDefinition.type] || "textfield";
    })();
    if (
      fieldDefinition?.type === getTypeId("Option Set") ||
      fieldDefinition?.type === getTypeId("Option Set MultiSelect")
    ) {
      isSelect = true;
      const optSetDefinintion = optionSetDefinitions.find(
        (x) => x.id == fieldDefinition.optionSetDefinitionId,
      );
      if (optSetDefinintion) {
        valueOptions = optSetDefinintion.options;
      } else {
        valueOptions = [];
      }
    } else {
      valueOptions = [];
      isSelect = false;
    }
    if (fieldDefinition) {
      condition.fieldDto = fieldDefinition;
    }
  };
  const onValueChange = () => {
    console.log(condition.value);
  };
</script>

<InputGroup class="p-0 pt-1">
  <Input
    type="select"
    placeholder="Select Field"
    on:change={() => onFieldTypeChange(false)}
    bind:value={condition.field}
  >
    {#each fields as field}
      <option value={field.name}>{field.displayName}</option>
    {/each}
  </Input>

  <Input
    type="select"
    placeholder="Select Field"
    bind:value={condition.operation}
  >
    <option value="eq">Equal</option>
    <option value="ne">Not Equal</option>
    <option value="lt">Less Then</option>
    <option value="le">Less or Equal</option>
    <option value="gt">Greater Then</option>
    <option value="ge">Greater or Equal</option>
    <option value="in">In</option>
  </Input>

  {#if isSelect}
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
  {:else}
    <Input
      type={controlType ?? "text"}
      placeholder="Value"
      bind:value={condition.value}
      on:change={onValueChange}
    >
      {#each valueOptions as opt}
        <option value={`${opt.value}`}>{opt.name}</option>
      {/each}
    </Input>
  {/if}
  <Button color="danger" outline on:click={deleteCondition}>
    <Icon name="trash"></Icon>
  </Button>
</InputGroup>
