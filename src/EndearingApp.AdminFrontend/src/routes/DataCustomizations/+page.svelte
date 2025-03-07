<script>
  /** @typedef {import('../../apiclient/src/model/CustomeEntityDTO').default} CustomEntity */
  import {
    CustomeEntityDTO,
    CustomEntitiesApi,
    OptionSetDefinitionDTO,
    OptionSetDefinitionsApi,
  } from "@apiclients";
  import { alertError } from "@utils/uiutils";
  import {
    Sidebar,
    SidebarDropdownItem,
    SidebarDropdownWrapper,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
  } from "flowbite-svelte";
  import { PlusOutline } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  import CustomEntityEditForm from "../../components/CustomEntities/customEntityEditForm.svelte";
  import OptionSetDefinitionEditForm from "../../components/CustomEntities/optionSetDefinitionEditForm.svelte";

  /** @type {CustomEntity[]} */
  let customEntities = [];

  /** @type { CustomEntity | null } */
  let selectedEntity = null;

  /** @type { boolean } */
  let isNewEntity = false;

  /** @type {OptionSetDefinitionDTO[]} */
  let optionSetDefinitions = [];

  /** @type { OptionSetDefinitionDTO? } */
  let selectedOptionSet = null;

  /** @type { boolean } */
  let isNewOptionSet = false;

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
    selectedEntity = entity;
  };

  let addCustomEntity = () => {
    selectedOptionSet = null;
    let newEntity = new CustomeEntityDTO();
    isNewEntity = true;
    selectedEntity = newEntity;
  };

  /** @param {OptionSetDefinitionDTO} optionSet */
  let editOptionSet = (optionSet) => {
    selectedEntity = null;
    isNewOptionSet = false;
    selectedOptionSet = optionSet;
  };

  let addOptionSet = () => {
    selectedEntity = null;
    isNewOptionSet = true;
    let newOptionSet = new OptionSetDefinitionDTO();
    selectedOptionSet = newOptionSet;
  };
</script>

<div class="flex flex-row">
  <div class="flex flex-col h-full">
    <Sidebar>
      <SidebarWrapper>
        <SidebarGroup>
          <SidebarGroup>
            <SidebarDropdownWrapper label="Entities">
              {#key customEntities}
                {#each customEntities as elem}
                  <SidebarDropdownItem
                    on:click={() => editCustomEntity(elem)}
                    label={elem.displayName}
                  />
                {/each}
              {/key}
              <SidebarItem
                on:click={() => addCustomEntity()}
                label="Add Entity"
              >
                <svelte:fragment slot="icon">
                  <PlusOutline></PlusOutline>
                </svelte:fragment>
              </SidebarItem>
            </SidebarDropdownWrapper>
            <SidebarDropdownWrapper label="Option Sets">
              {#key optionSetDefinitions}
                {#each optionSetDefinitions as elem}
                  <SidebarDropdownItem
                    on:click={() => editOptionSet(elem)}
                    label={elem.name}
                  />
                {/each}
              {/key}
              <SidebarItem on:click={() => addOptionSet()} label="Option Set">
                <svelte:fragment slot="icon">
                  <PlusOutline></PlusOutline>
                </svelte:fragment>
              </SidebarItem>
            </SidebarDropdownWrapper>
          </SidebarGroup>
        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
  </div>
  <div class="flex flex-col p-5 w-full">
    {#key customEntities}
      {#if selectedEntity !== null}
        <CustomEntityEditForm
          bind:customEntity={selectedEntity}
          bind:isNew={isNewEntity}
          reloadParentData={loadData}
          {customEntities}
        />
      {/if}
    {/key}
    {#key optionSetDefinitions}
      {#if selectedOptionSet !== null}
        <OptionSetDefinitionEditForm
          bind:optionSet={selectedOptionSet}
          bind:optionSets={optionSetDefinitions}
          bind:isNew={isNewOptionSet}
          reloadParentData={loadData}
        />
      {/if}
    {/key}
  </div>
</div>
