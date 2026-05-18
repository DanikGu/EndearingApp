<script>
  import { page as pageStore } from "$app/stores";
  import { getCustomEntities, getView, saveView, getTypeConfig } from "@stores/global";
  import DataView from "$lib/clientComponents/dataView/dataView.svelte";
  import ViewDescription from "$lib/clientComponents/dataView/viewDescription";
  import { fetchEntities } from "$lib/api/odata";
  import { assignLoader } from "@utils/uiutils";

  let customEntity = $state(/** @type {any | null} */ (null));
  let data = $state(/** @type {any[]} */ ([]));
  let totalCount = $state(0);
  let page = $state(1);
  let viewDescription = $state(new ViewDescription());
  let currentEntityName = $state("");
  let initializingInProgress = false;

  $effect(() => {
    const entityName = /** @type {string} */ ($pageStore.params.entity);
    if (entityName && entityName !== currentEntityName) {
      currentEntityName = entityName;
      initEntity(entityName);
    }
  });

  async function initEntity(/** @type {string} */ entityName) {
    const entities = await getCustomEntities();
    getTypeConfig();
    const found = entities.find(
      (/** @type {any} */ e) => e.name === entityName || e.id === entityName,
    );
    if (found) {
      initializingInProgress = true;
      customEntity = found;
      data = [];
      totalCount = 0;
      page = 1;
      viewDescription = getView(found.name);
      await Promise.resolve();
      initializingInProgress = false;
      loadData();
    }
  }

  async function loadData() {
    if (!customEntity) return;
    const opts = viewDescription.buildQueryOptions(page);
    const promise = fetchEntities(customEntity.name, opts);
    assignLoader(`Loading ${customEntity.displayName || customEntity.name}...`, promise);
    const { data: result, error } = await promise;
    if (error) {
      console.error(error);
      data = [];
      totalCount = 0;
    } else if (result) {
      data = result.value || [];
      totalCount =
        result["@odata.count"] || result["@odata.count"]?.toString
          ? Number(result["@odata.count"])
          : (result.value || []).length;
    }
  }

  function handleViewChange() {
    page = 1;
    loadData();
  }

  function handleSort(/** @type {string} */ newOrderBy) {
    viewDescription = new ViewDescription({ ...viewDescription, orderBy: newOrderBy });
    page = 1;
    loadData();
  }

  function handleRefresh() {
    loadData();
  }

  $effect(() => {
    if (customEntity && customEntity.name === currentEntityName && !initializingInProgress) {
      saveView(customEntity.name, viewDescription);
    }
  });
</script>

<div class="p-3">
  {#if customEntity}
    <DataView
      entityName={customEntity.name}
      bind:data
      {customEntity}
      bind:page
      bind:totalCount
      bind:view={viewDescription}
      onViewChange={handleViewChange}
      onSortChange={handleSort}
      onRefresh={handleRefresh}
      editBaseUrl={`/app/${$pageStore.params.appId}/${customEntity.name}`}
    />
  {:else}
    <div class="d-flex justify-content-center align-items-center h-100">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  {/if}
</div>
