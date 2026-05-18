<script>
  import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "@sveltestrap/sveltestrap";
  import QueryBuilder from "../queryBuilder/components/queryBuilder.svelte";
  import ViewDescription from "./viewDescription.js";
  import { Condition, ConditionGroup } from "../queryBuilder/logic/typeDefinitions";

  let {
    isOpen = $bindable(false),
    view = $bindable(/** @type {ViewDescription} */ (new ViewDescription())),
    customEntityId = "",
    onViewChange,
  } = $props();

  let localFilter = $state(new ConditionGroup("and", []));

  $effect(() => {
    if (isOpen) {
      localFilter = reviveConditionGroup(view.filter);
    }
  });

  /** @param {any} obj @returns {ConditionGroup} */
  function reviveConditionGroup(obj) {
    if (!obj || typeof obj !== "object") return new ConditionGroup("and", []);
    if (obj.children && Array.isArray(obj.children) && (obj.operator === "and" || obj.operator === "or")) {
      const group = new ConditionGroup(obj.operator, []);
      group.children = obj.children.map((/** @type {any} */ child) => {
        if (child && child.children && Array.isArray(child.children) && (child.operator === "and" || child.operator === "or")) {
          return reviveConditionGroup(child);
        }
        if (child && typeof child.field === "string" && typeof child.operation === "string") {
          return new Condition(child.field, child.operation, child.value, child.fieldDto || null);
        }
        return child;
      });
      return group;
    }
    return new ConditionGroup("and", []);
  }

  function handleFilterDone() {
    view = new ViewDescription({ ...view, filter: localFilter });
    isOpen = false;
    onViewChange?.(view);
  }
</script>

<Modal isOpen={isOpen} toggle={() => (isOpen = false)} size="lg">
  <ModalHeader toggle={() => (isOpen = false)}>Edit Filters</ModalHeader>
  <ModalBody>
    <QueryBuilder rootGroup={localFilter} {customEntityId} />
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onclick={handleFilterDone}>Done</Button>
  </ModalFooter>
</Modal>
