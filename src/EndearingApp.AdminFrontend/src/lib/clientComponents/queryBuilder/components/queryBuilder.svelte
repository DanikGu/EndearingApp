<script>
  import { setContext } from "svelte";
  import { ConditionGroup, Field } from "../logic/typeDefinitions";
  import { Col, Container, Row } from "@sveltestrap/sveltestrap";
  import ConditionGroupComponent from "./conditionGroupComponent.svelte";
  import { FieldDto } from "@apiclients/src";
  import { getCachedCustomEntities, getCachedOptionSets, getCustomEntities, getOptionSets } from "@stores/global";

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

  setContext("customEntityId", customEntityId);

  /** @type {import('@apiclients/src').CustomeEntityDTO[]} */
  let customEntities = $state(getCachedCustomEntities());
  /** @type {import('@apiclients/src').OptionSetDefinitionDTO[]} */
  let optionSets = $state(getCachedOptionSets());

  $effect(() => {
    getCustomEntities().then((v) => {
      customEntities = v;
    });
    getOptionSets().then((v) => {
      optionSets = v;
    });
  });

  /** @type {Field[]} */
  let selectedTableFields = $state([]);

  $effect(() => {
    let newFields = [];
    if (customEntityId && customEntities.length > 0) {
      const entity = customEntities.find((x) => x.id === customEntityId);
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
</script>

<Container>
  <Row>
    <Col md="12">
      <ConditionGroupComponent group={rootGroup} fields={selectedTableFields}
      ></ConditionGroupComponent>
    </Col>
  </Row>
</Container>
