<script>
  import { onMount, setContext } from "svelte";
  import { ConditionGroup, Field } from "./typeDefinitions";
  import { Col, Container, Row } from "@sveltestrap/sveltestrap";
  import ConditionGroupComponent from "./conditionGroupComponent.svelte";
   import {
    CustomeEntityDTO,
    FieldDto,
    OptionSetDefinitionDTO,
  } from "@apiclients/src";
  import { customEntities, optionSets, ensureCustomEntities, ensureOptionSets } from "../../stores/global";

   /**
    * @typedef {Object} Props
    * @property {any} [rootGroup]
    * @property {string | null} [customEntityId]
    */

  /** @type {Props} */
  let {
    rootGroup = new ConditionGroup("and", []),
    customEntityId = $bindable(""),
  } = $props();

  /** @type {Field[]} */
  let selectedTableFields = $state([]);

  onMount(async () => {
    await ensureCustomEntities();
    await ensureOptionSets();
  });

  $effect(() => {
    let newFields = [];
    if (customEntityId && $customEntities && $customEntities.length > 0) {
      const entity = $customEntities.find((x) => x.id == customEntityId);
      if (entity && entity.fields) {
        newFields = entity.fields.map((/** @type {FieldDto} */ item) => {
          return {
            name: item.name,
            displayName: item.displayName,
          };
        });
      }
    }
    selectedTableFields = newFields;
  });

  $effect(() => {
    setContext("customEntityId", customEntityId);
  });


</script>

<Container>
  <Row>
    <Col md="12">
      <ConditionGroupComponent group={rootGroup} fields={selectedTableFields}
      ></ConditionGroupComponent>
    </Col>
  </Row>
</Container>
