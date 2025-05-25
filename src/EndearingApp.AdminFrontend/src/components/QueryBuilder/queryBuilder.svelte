<script>
  import { onMount } from "svelte";
  import { ConditionGroup, Field } from "./typeDefinitions";
  import { Col, Container, Row, Input } from "@sveltestrap/sveltestrap";
  import ConditionGroupComponent from "./conditionGroupComponent.svelte";

  export let rootGroup = new ConditionGroup("and", []);
  /** @type {Field[]} */
  export let selectedTableFields = [];
  onMount(async () => {});
</script>

<Container>
  <Row>
    <Col md="12">
      <ConditionGroupComponent group={rootGroup} fields={selectedTableFields}
      ></ConditionGroupComponent>
    </Col>
  </Row>
</Container>
