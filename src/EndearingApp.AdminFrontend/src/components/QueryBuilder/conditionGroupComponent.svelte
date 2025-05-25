<script>
  import { Button, Col, Icon, Row, Input } from "@sveltestrap/sveltestrap";
  import { Condition, ConditionGroup, Field } from "./typeDefinitions";
  import ConditionComponent from "./conditionComponent.svelte";

  /** @type { ConditionGroup } */
  export let group;
  /** @type {Field[]} */
  export let fields;
  /** @type {any} */
  export let deleteGroup = null;

  /** @param {ConditionGroup} parentElem */
  const addCondition = (parentElem) => {
    parentElem.children.push(new Condition("", "", ""));
    v = crypto.randomUUID();
  };

  /** @param {ConditionGroup} parentElem */
  const addGroup = (parentElem) => {
    parentElem.children.push(new ConditionGroup("and", []));
    v = crypto.randomUUID();
  };
  let v = crypto.randomUUID();
  /** @param {Condition | ConditionGroup} child */
  const deleteChild = (child) => {
    group.children = group.children.filter((item) => item !== child);
    v = crypto.randomUUID();
  };
</script>

{#key v}
  <Row>
    <Col md="1"></Col>
    <Col md="11">
      <Button color="success" outline on:click={() => addCondition(group)}>
        <Icon name="plus"></Icon> Condition
      </Button>
      <Button color="success" outline on:click={() => addGroup(group)}>
        <Icon name="plus"></Icon> Group
      </Button>
      {#if deleteGroup}
        <Button color="danger" outline on:click={() => deleteGroup(group)}>
          <Icon name="trash"></Icon>
        </Button>
      {/if}
    </Col>
    <Col md="1" class="flex flex-row pt-3 pb-3 pl-0 pr-0 items-center">
      <Col md="10" class="text-end pr-1">{group.operator}</Col>
      <Col md="2" class="h-full">
        <div class="border-l-2 border-t-2 border-b-2 h-full"></div>
      </Col>
    </Col>
    <Col md="11">
      {#each group.children as child}
        {#if child instanceof Condition}
          <ConditionComponent
            {fields}
            condition={child}
            deleteCondition={() => deleteChild(child)}
          ></ConditionComponent>
        {/if}
        {#if child instanceof ConditionGroup}
          <svelte:self
            {fields}
            group={child}
            deleteGroup={() => deleteChild(child)}
          ></svelte:self>
        {/if}
      {/each}
      {#if !group.children || group.children.length === 0}
        <div class="text-danger h-full w-full flex items-center justify-center">
          <span>Empty Group</span>
        </div>
      {/if}
    </Col>
  </Row>
{/key}
