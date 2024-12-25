<script>
  /**
   * @typedef {import('../../apiclient/src/model/CustomeEntityDTO').default} CustomEntity
   */
  import {
    Sidebar,
    SidebarWrapper,
    SidebarItem,
    SidebarGroup,
    SidebarDropdownWrapper,
    SidebarDropdownItem,
  } from "flowbite-svelte";
  import { CustomeEntityDTO, CustomEntitiesApi } from "@apiclients";
  import { onMount } from "svelte";
  import CustomEntityEditForm from "../../components/CustomEntities/customEntityEditForm.svelte";
  import { PlusOutline } from "flowbite-svelte-icons";

  /** @type {CustomEntity[]} */
  let customEntities = [];

  /** @type { CustomEntity | null } */
  let selectedEntity = null;

  /** @type { boolean } */
  let isNewEntity = false;

  let loadData = () => {
    let api = new CustomEntitiesApi();
    // @ts-ignore
    api.apiCustomEntitiesGet((error, elems) => {
      if (error) {
        handleError(error);
      } else if (elems) {
        handleElems(elems);
      }
    });
  };

  onMount(() => {
    loadData();
  });

  /** @param {CustomEntity[]} elems */
  let handleElems = (elems) => {
    elems.forEach((value) => {
      console.log(value.name);
    });
    customEntities = elems;
    if (!selectedEntity || !selectedEntity.id) {
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
  };

  /** @param {CustomEntity} entity */
  let editCustomEntity = (entity) => {
    isNewEntity = false;
    selectedEntity = entity;
  };

  let addCustomEntity = () => {
    let newEntity = new CustomeEntityDTO();
    isNewEntity = true;
    selectedEntity = newEntity;
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
            <SidebarItem label="Option Sets" />
            <SidebarItem label="Forms" />
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
  </div>
</div>
