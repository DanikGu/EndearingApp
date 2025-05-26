<script>
  import { Button, Input, InputGroup, Icon } from "@sveltestrap/sveltestrap";
  import { Condition, Field } from "./typeDefinitions";
  import { getContext, onMount } from "svelte";
  import {
    CustomeEntityDTO,
    FieldDto,
    OptionSetDefinitionDTO,
  } from "@apiclients/src";
  import { getTypeId } from "@utils/fieldtypesutils";

  /** @typedef {import('@sveltestrap/sveltestrap').InputType} InputType */

  /** @type {Condition} */
  export let condition;

  /** @type {any} */
  export let deleteCondition;

  /** @type {Field[]} */
  export let fields;

  /** @type {CustomeEntityDTO[]} */
  let customEntities = [];
  /** @type {OptionSetDefinitionDTO[]} */
  let optionSetDefinitions = [];
  /** @type {FieldDto} */
  let fieldDefinition;
  /** @type {InputType | null} */
  let controlType;
  /** @type {string | null} */
  let currEntityId;

  onMount(() => {
    customEntities = getContext("etnStructure");
    optionSetDefinitions = getContext("optionSets");
    currEntityId = getContext("customEntityId");
    onFieldTypeChange();
  });

  const onFieldTypeChange = () => {
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
    if (fieldDefinition.type === getTypeId("Option Set")) {
    }
  };
</script>

<InputGroup class="p-0 pt-1">
  <Input
    type="select"
    placeholder="Select Field"
    on:change={onFieldTypeChange}
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

  <Input
    type={controlType ?? "text"}
    placeholder="Value"
    bind:value={condition.value}
  ></Input>
  <Button color="danger" outline on:click={deleteCondition}>
    <Icon name="trash"></Icon>
  </Button>
</InputGroup>
