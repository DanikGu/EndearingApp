<script>
  import EditFormComponent from "../../../../../components/AppComponents/EditFormComponent.svelte";
  import { page as pageStore } from "$app/stores";
  import { goto } from "$app/navigation";

  let { data } = $props();

  const currentFormId = $derived(data.form.id);
  const entityParam = $derived($pageStore.params.entity);
  const appIdParam = $derived($pageStore.params.appId);
  const forms = $derived(data.availableForms || []);

  const goBack = () => {
    goto(`/app/${appIdParam}/${entityParam}`);
  };

  const switchForm = (/** @type {string} */ newFormId) => {
    if (newFormId === currentFormId) return;
    goto(`/app/${appIdParam}/${entityParam}/edit?form=${newFormId}`);
  };
</script>

<div class="p-3">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <button class="btn btn-outline-secondary" onclick={goBack}>
      ← Back to {entityParam}
    </button>
    {#if forms.length > 1}
      <div class="d-flex align-items-center gap-2">
        <span class="small text-muted">Form:</span>
        <select class="form-select form-select-sm w-auto" value={currentFormId} onchange={(e) => switchForm(/** @type {HTMLSelectElement} */(e.target).value)} aria-label="Select form">
          {#each forms as f (f.id)}
            <option value={f.id}>{f.name}</option>
          {/each}
        </select>
      </div>
    {/if}
  </div>
  <EditFormComponent bind:form={data.form} bind:entityData={data.entityData} onAfterSave={() => goBack()} />
</div>
