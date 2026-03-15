<script>
  import { CustomeEntityDTO, OptionSetDefinitionDTO } from "@apiclients";
  import { alertError } from "@utils/uiutils";
  import { onMount } from "svelte";
  import {
    customEntities,
    optionSets,
    ensureCustomEntities,
    ensureOptionSets,
  } from "../../../stores/global";
  import CustomEntityEditForm from "../../../components/CustomEntities/customEntityEditForm.svelte";
  import OptionSetDefinitionEditForm from "../../../components/CustomEntities/optionSetDefinitionEditForm.svelte";
  import {
    Container,
    Row,
    Col,
    Accordion,
    AccordionItem,
    ListGroup,
    ListGroupItem,
    Icon,
    Theme,
  } from "@sveltestrap/sveltestrap";

  /** @typedef {import('../../../apiclient/src/model/CustomeEntityDTO').default} CustomEntity */

  // Use store values in local state for reactivity
  /** @type {CustomEntity[]} */
  let customEntitiesLocal = $state([]);
  /** @type {OptionSetDefinitionDTO[]} */
  let optionSetDefinitionsLocal = $state([]);

  /** @type { CustomEntity | null } */
  let selectedEntity = $state(null);

  /** @type { boolean } */
  let isNewEntity = $state(false);

  /** @type { OptionSetDefinitionDTO | null } */
  let selectedOptionSet = $state(null);

  /** @type { boolean } */
  let isNewOptionSet = $state(false);

  $effect(() => {
    const unsubscribe = customEntities.subscribe((value) => {
      customEntitiesLocal = value;
      if (selectedEntity && selectedEntity.id) {
        const exists = value.some((x) => x.id == selectedEntity?.id);
        if (!exists) {
          selectedEntity = null;
        } else {
          selectedEntity =
            value.find((x) => x.id == selectedEntity?.id) ?? null;
        }
      }
    });
    return unsubscribe;
  });

  $effect(() => {
    const unsubscribe = optionSets.subscribe((value) => {
      optionSetDefinitionsLocal = value;
      if (selectedOptionSet && selectedOptionSet.id) {
        const exists = value.some((x) => x.id == selectedOptionSet?.id);
        if (!exists) {
          selectedOptionSet = null;
        } else {
          selectedOptionSet =
            value.find((x) => x.id == selectedOptionSet?.id) ?? null;
        }
      }
    });
    return unsubscribe;
  });

  onMount(() => {
    loadData();
  });

  let loadData = () => {
    ensureCustomEntities();
    ensureOptionSets();
  };

  /** @param {string} error */
  let handleError = (error) => {
    console.error(error);
    alertError("Error occured: " + error);
  };

  /** @param {CustomEntity} entity */
  let editCustomEntity = (entity) => {
    selectedOptionSet = null;
    isNewEntity = false;
    isNewOptionSet = false;
    selectedEntity = entity;
  };

  let addCustomEntity = () => {
    selectedOptionSet = null;
    let newEntity = new CustomeEntityDTO();
    isNewEntity = true;
    isNewOptionSet = false;
    selectedEntity = newEntity;
  };

  /** @param {OptionSetDefinitionDTO} optionSet */
  let editOptionSet = (optionSet) => {
    selectedEntity = null;
    isNewOptionSet = false;
    isNewEntity = false;
    selectedOptionSet = optionSet;
  };

  let addOptionSet = () => {
    selectedEntity = null;
    isNewOptionSet = true;
    isNewEntity = false;
    let newOptionSet = new OptionSetDefinitionDTO();
    selectedOptionSet = newOptionSet;
  };
</script>

<Container fluid class="vh-100 d-flex flex-column p-0">
  <Row class="flex-grow-1 g-0">
    <Col md="3" class="p-0 d-flex flex-column">
      <div class="flex-grow-1 overflow-auto">
        <Accordion stayOpen class="rounded-0">
          <AccordionItem class="p-0" header="Entities">
            <ListGroup flush>
              {#key customEntitiesLocal}
                {#each customEntitiesLocal as elem}
                  <ListGroupItem
                    action
                    active={!isNewEntity && elem.id == selectedEntity?.id}
                    class="py-2 border-0"
                    on:click={() => editCustomEntity(elem)}
                  >
                    {elem.displayName}
                  </ListGroupItem>
                {/each}
              {/key}
              {#if customEntitiesLocal.length > 0}
                <ListGroupItem class="m-0 p-0 border-0">
                  <hr />
                </ListGroupItem>
              {/if}
              <ListGroupItem
                active={isNewEntity}
                action
                class="py-2 border-0"
                on:click={addCustomEntity}
              >
                <Icon name="plus-lg" /> Add Entity
              </ListGroupItem>
            </ListGroup>
          </AccordionItem>

          <AccordionItem header="Option Sets">
            <ListGroup flush>
              {#key optionSetDefinitionsLocal}
                {#each optionSetDefinitionsLocal as elem}
                  <ListGroupItem
                    action
                    active={!isNewOptionSet && selectedOptionSet?.id == elem.id}
                    class="py-2 border-0"
                    on:click={() => editOptionSet(elem)}
                  >
                    {elem.name}
                  </ListGroupItem>
                {/each}
              {/key}
              {#if optionSetDefinitionsLocal.length > 0}
                <ListGroupItem class="p-0 border-0">
                  <hr />
                </ListGroupItem>
              {/if}
              <ListGroupItem
                action
                active={isNewOptionSet}
                class="py-2 border-0"
                on:click={addOptionSet}
              >
                <Icon name="plus-lg" />
                Add Option Set
              </ListGroupItem>
            </ListGroup>
          </AccordionItem>
        </Accordion>
      </div>
    </Col>
    <Col md="9" class="p-4 overflow-auto">
      {#key selectedEntity?.id}
        {#if selectedEntity !== null}
          <CustomEntityEditForm
            bind:customEntity={selectedEntity}
            bind:isNew={isNewEntity}
          />
        {/if}
      {/key}
      {#key selectedOptionSet?.id}
        {#if selectedOptionSet !== null}
          <OptionSetDefinitionEditForm
            bind:optionSet={selectedOptionSet}
            bind:isNew={isNewOptionSet}
          />
        {/if}
      {/key}
    </Col>
  </Row>
</Container>
