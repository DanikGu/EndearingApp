<script>
  import { Button, Input, InputGroup, Icon } from "@sveltestrap/sveltestrap";
  import { Condition, ConditionGroup, Field } from "./typeDefinitions";

  /** @type {Condition} */
  export let condition;

  /** @type {any} */
  export let deleteCondition;

  /** @type {Field[]} */
  export let fields;
</script>

<InputGroup class="p-0 pt-1">
  <Input type="select" placeholder="Select Field" bind:value={condition.field}>
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

  <Input type="text" placeholder="Value" bind:value={condition.value}></Input>
  <Button color="danger" outline on:click={deleteCondition}>
    <Icon name="trash"></Icon>
  </Button>
</InputGroup>
