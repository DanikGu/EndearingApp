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

  export let rootGroup = new ConditionGroup("and", []);
  /** @type {string | null} */
  export let customEntityId = "";
  /** @type {CustomeEntityDTO[]} */
  export let customEntities = [];
  /** @type {OptionSetDefinitionDTO[]} */
  export let optionSetDefinitions = [];

  /** @type {Field[]} */
  let selectedTableFields = [];

  onMount(async () => {});

  $: customEntityId,
    (() => {
      if (customEntityId) {
        selectedTableFields = customEntities
          .find((x) => x.id == customEntityId)
          ?.fields.map((/** @type {FieldDto} */ item) => {
            return {
              name: item.name,
              displayName: item.displayName,
            };
          });
      }
      setContext("customEntityId", customEntityId);
      setContext("optionSets", optionSetDefinitions);
      setContext("etnStructure", customEntities);
    })();
</script>

<Container>
  <Row>
    <Col md="12">
      <ConditionGroupComponent group={rootGroup} fields={selectedTableFields}
      ></ConditionGroupComponent>
    </Col>
  </Row>
</Container>
