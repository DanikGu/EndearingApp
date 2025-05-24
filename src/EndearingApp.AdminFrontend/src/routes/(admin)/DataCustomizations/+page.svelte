<script>
  import {
    CustomeEntityDTO,
    CustomEntitiesApi,
    OptionSetDefinitionDTO,
    OptionSetDefinitionsApi,
  } from "@apiclients";
  import { alertError } from "@utils/uiutils";
  import { onMount } from "svelte";
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

  /** @type {CustomEntity[]} */
  let customEntities = [];

  /** @type { CustomEntity | null } */
  let selectedEntity = null;

  /** @type { boolean } */
  let isNewEntity = false;

  /** @type {OptionSetDefinitionDTO[]} */
  let optionSetDefinitions = [];

  /** @type { OptionSetDefinitionDTO | null } */
  let selectedOptionSet = null;

  /** @type { boolean } */
  let isNewOptionSet = false;

  /* Accordion manages its own open/close state, so dropdown-specific state variables are not needed. */

  let loadData = () => {
    loadCustomEntities();
    loadOptionSets();
  };

  let loadOptionSets = () => {
    let api = new OptionSetDefinitionsApi();
    api.apiOptionSetDefinitionsGet(
      (
        /** @type {string} */ error,
        /** @type {OptionSetDefinitionDTO[]} */ elems,
      ) => {
        if (error) {
          handleError(error);
        } else if (elems) {
          setOptionSetDefinitions(elems);
        }
      },
    );
  };

  let loadCustomEntities = () => {
    let api = new CustomEntitiesApi();
    api.apiCustomEntitiesGet(
      (/** @type {string} */ error, /** @type {CustomEntity[]} */ elems) => {
        if (error) {
          handleError(error);
        } else if (elems) {
          setCustomEntities(elems);
        }
      },
    );
  };

  onMount(() => {
    loadData();
  });

  /** @param {OptionSetDefinitionDTO[]} elems */
  let setOptionSetDefinitions = (elems) => {
    optionSetDefinitions = elems;
    if (!selectedOptionSet || !selectedOptionSet.id) {
      return;
    }
    const isOptionSetExists = optionSetDefinitions.some(
      (x) => x.id == selectedOptionSet?.id,
    );
    if (isOptionSetExists) {
      selectedOptionSet =
        optionSetDefinitions.find((x) => x.id == selectedOptionSet?.id) ?? null;
    } else {
      selectedOptionSet = null;
    }
  };

  /** @param {CustomEntity[]} elems */
  let setCustomEntities = (elems) => {
    customEntities = elems;
    if (!selectedEntity) {
      return;
    }
    if (!selectedEntity.id) {
      selectedEntity = null;
      return;
    }
    const isSlelectedEntityExists = customEntities.some(
      (x) => x.id == selectedEntity?.id,
    );
    if (isSlelectedEntityExists) {
      selectedEntity =
        customEntities.find((x) => x.id == selectedEntity?.id) ?? null;
    } else {
      selectedEntity = null;
    }
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
          <AccordionItem class="p-0">
            <svelte:fragment slot="header">Entities</svelte:fragment>
            <ListGroup flush>
              {#key customEntities}
                {#each customEntities as elem}
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
              {#if customEntities.length > 0}
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

          <AccordionItem>
            <svelte:fragment slot="header">Option Sets</svelte:fragment>
            <ListGroup flush>
              {#key optionSetDefinitions}
                {#each optionSetDefinitions as elem}
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
              {#if optionSetDefinitions.length > 0}
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
            reloadParentData={loadData}
            {customEntities}
          />
        {/if}
      {/key}
      {#key selectedOptionSet?.id}
        {#if selectedOptionSet !== null}
          <OptionSetDefinitionEditForm
            bind:optionSet={selectedOptionSet}
            bind:optionSets={optionSetDefinitions}
            bind:isNew={isNewOptionSet}
            reloadParentData={loadData}
          />
        {/if}
      {/key}
    </Col>
  </Row>
</Container>
