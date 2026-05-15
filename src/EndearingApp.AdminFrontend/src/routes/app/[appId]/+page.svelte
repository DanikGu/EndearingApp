<script>
  import { onMount } from "svelte";
  import { customEntities, ensureCustomEntities } from "../../../stores/global";
  import { goto } from "$app/navigation";
  import { page as pageStore } from "$app/stores";
  // import "../../../app.css";

  onMount(() => {
    ensureCustomEntities();
  });

  const appId = $derived($pageStore.params.appId);

  const goToEntity = (/** @type {any} */ entity) => {
    goto(`/app/${appId}/${entity.name}`);
  };
</script>

<div class="d-flex justify-content-center align-items-center h-100">
  <div class="text-center">
    <h3 class="text-muted">Select a table from the sidebar to view data</h3>
    {#if $customEntities.length > 0}
      <div class="mt-4 d-flex flex-wrap justify-content-center gap-2">
        {#each $customEntities.slice(0, 10) as entity (entity.id)}
          <button
            class="btn btn-outline-primary"
            onclick={() => goToEntity(entity)}
          >
            {entity.displayName || entity.name}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>
