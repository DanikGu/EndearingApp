<script>
  import { onMount } from "svelte";
  import { customEntities, ensureCustomEntities } from "../../../stores/global";
  import { page as pageStore } from "$app/stores";
  import { goto } from "$app/navigation";

  onMount(() => {
    ensureCustomEntities();
  });

  /** @type {string | null} */
  let activeEntity = $state(null);

  $effect(() => {
    activeEntity = /** @type {string | null} */ (
      $pageStore.params.entity || null
    );
  });

  const goToEntity = (/** @type {any} */ entity) => {
    if (activeEntity === entity.name) return;
    goto(`/app/${$pageStore.params.appId}/${entity.name}`);
  };

  const goToAppRoot = () => {
    goto(`/app/${$pageStore.params.appId}`);
  };

  let { children } = $props();
</script>

<div class="d-flex vh-100">
  <div
    class="d-flex flex-column border-end"
    style="width: 240px; min-width: 240px; background: var(--bs-tertiary-bg);"
  >
    <div
      class="p-3 border-bottom cursor-pointer"
      onclick={goToAppRoot}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === "Enter" && goToAppRoot()}
    >
      <h5 class="mb-0">EndearingApp</h5>
    </div>
    <div class="overflow-auto flex-grow-1">
      {#each $customEntities as entity (entity.id)}
        <button
          class="btn btn-link text-start text-decoration-none w-100 rounded-0 px-3 py-2 border-0 {activeEntity ===
          entity.name
            ? 'active fw-bold'
            : ''}"
          class:bg-primary-subtle={activeEntity === entity.name}
          onclick={() => goToEntity(entity)}
        >
          {entity.displayName || entity.name}
        </button>
      {/each}
    </div>
  </div>
  <div class="flex-grow-1 overflow-auto">
    {@render children?.()}
  </div>
</div>

<style>
  .cursor-pointer {
    cursor: pointer;
  }
  button:hover {
    background-color: var(--bs-secondary-bg);
  }
  button.active {
    color: var(--bs-primary-text-emphasis);
  }
</style>
