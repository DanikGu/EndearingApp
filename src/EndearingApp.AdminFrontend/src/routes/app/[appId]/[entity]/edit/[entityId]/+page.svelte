<script>
  import EditFormComponent from "../../../../../../components/AppComponents/EditFormComponent.svelte";
  import { page as pageStore } from "$app/stores";
  import { goto } from "$app/navigation";

  let { data } = $props();

  const currentFormId = $derived(data.form.id);
  const entityParam = $derived($pageStore.params.entity);
  const appIdParam = $derived($pageStore.params.appId);
  const entityIdParam = $derived($pageStore.params.entityId);
  const forms = $derived(data.availableForms || []);

  const goBack = () => {
    goto(`/app/${appIdParam}/${entityParam}`);
  };

  const switchForm = (/** @type {string} */ newFormId) => {
    if (newFormId === currentFormId) return;
    goto(
      `/app/${appIdParam}/${entityParam}/edit/${entityIdParam}?form=${newFormId}`,
    );
  };

  let saveAndCloseFn = $state(/** @type {(() => void) | null} */ (null));
</script>

<div class="p-3">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <div class="d-flex gap-2">
      <button class="btn btn-outline-secondary" onclick={goBack}>
        ← Back to {entityParam}
      </button>
      <button class="btn btn-primary" disabled={!saveAndCloseFn} onclick={() => saveAndCloseFn?.()}>
        Save &amp; Close
      </button>
    </div>
    {#if forms.length > 1}
      <div class="d-flex align-items-center gap-2">
        <span class="small text-muted">Form:</span>
        <select
          class="form-select form-select-sm w-auto"
          value={currentFormId}
          onchange={(e) =>
            switchForm(/** @type {HTMLSelectElement} */ (e.target).value)}
          aria-label="Select form"
        >
          {#each forms as f (f.id)}
            <option value={f.id}>{f.name}</option>
          {/each}
        </select>
      </div>
    {/if}
  </div>
  <EditFormComponent
    bind:form={data.form}
    bind:entityData={data.entityData}
    onAfterDelete={() => goBack()}
    onSaveAndClose={() => goBack()}
    bind:triggerSaveAndClose={saveAndCloseFn}
  />
</div>
