<script>
  import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "@sveltestrap/sveltestrap";
  import { getCustomEntities, getCachedCustomEntities } from "@stores/global";
  import ViewDescription from "./viewDescription.js";

  const AGGREGATE_FN_LABELS = /** @type {Record<string, string>} */ ({ sum: "Sum", avg: "Average", count: "Count", min: "Min", max: "Max" });

  let {
    isOpen = $bindable(false),
    view = $bindable(/** @type {ViewDescription} */ (new ViewDescription())),
    onViewChange,
  } = $props();

  let allEntities = $state(getCachedCustomEntities());

  $effect(() => {
    getCustomEntities().then((v) => (allEntities = v));
  });

  let editingAggId = $state(/** @type {string | null} */ (null));
  let aggCollectionNavProp = $state("");
  let aggSourceField = $state("");
  let aggFunction = $state("avg");
  let aggLabel = $state("");
  let aggError = $state("");

  $effect(() => {
    if (isOpen) {
      editingAggId = null;
      aggCollectionNavProp = ""; aggSourceField = ""; aggFunction = "avg"; aggLabel = ""; aggError = "";
    }
  });

  let customEntityId = $derived(view.entityId);

  let collectionOptions = $derived((() => {
    /** @type {Map<string, { navProp: string, label: string, sourceEntityFields: any[] }>} */
    const seen = new Map();
    for (const otherEntity of allEntities) {
      if (!otherEntity.relationships) continue;
      for (const rel of otherEntity.relationships) {
        if (rel.referencedCustomEntityId !== customEntityId) continue;
        if (!rel.constraintName) continue;
        const navProp = `${rel.constraintName}_EtnColl`;
        const key = otherEntity.id || otherEntity.name;
        const entry = { navProp, label: `${otherEntity.displayName || otherEntity.name} (via ${rel.constraintName})`, sourceEntityFields: otherEntity.fields || [] };
        if (seen.has(key)) { if (navProp.includes(`FK_${otherEntity.name}_`)) seen.set(key, entry); }
        else seen.set(key, entry);
      }
    }
    return [...seen.values()];
  })());

  let childFieldOptions = $derived((() => {
    if (!aggCollectionNavProp) return [];
    const sel = collectionOptions.find(o => o.navProp === aggCollectionNavProp);
    if (!sel) return [];
    return sel.sourceEntityFields.map((/** @type {any} */ f) => ({ name: f.name, label: f.displayName || f.name }));
  })());

  function startAddAggregate() {
    aggCollectionNavProp = ""; aggSourceField = ""; aggFunction = "avg"; aggLabel = ""; aggError = "";
    editingAggId = "new";
  }

  function startEditAggregate(/** @type {{ id: string, label: string, collectionNavProp: string, sourceField: string, fn: string }} */ agg) {
    aggCollectionNavProp = agg.collectionNavProp;
    aggSourceField = agg.sourceField;
    aggFunction = agg.fn;
    aggLabel = agg.label;
    aggError = "";
    editingAggId = agg.id;
  }

  function saveAggregate() {
    aggError = "";
    if (!aggCollectionNavProp) { aggError = "Select a collection"; return; }
    if (!aggSourceField) { aggError = "Select a field to aggregate"; return; }
    if (!aggLabel) { const fnLabel = AGGREGATE_FN_LABELS[aggFunction] || aggFunction; aggLabel = `${fnLabel} of ${aggSourceField}`; }
    const current = view.aggregates || [];
    if (editingAggId === "new") {
      const newAgg = { id: crypto.randomUUID(), label: aggLabel, collectionNavProp: aggCollectionNavProp, sourceField: aggSourceField, fn: aggFunction };
      view = new ViewDescription({ ...view, aggregates: [...current, newAgg] });
    } else {
      view = new ViewDescription({ ...view, aggregates: current.map((/** @type {any} */ a) => a.id === editingAggId ? { ...a, label: aggLabel, collectionNavProp: aggCollectionNavProp, sourceField: aggSourceField, fn: aggFunction } : a) });
    }
    editingAggId = null;
    onViewChange?.(view);
  }

  function removeAggregate(/** @type {string} */ id) {
    view = new ViewDescription({ ...view, aggregates: (view.aggregates || []).filter((/** @type {any} */ a) => a.id !== id) });
    onViewChange?.(view);
  }

  function cancelAggForm() {
    editingAggId = null;
  }

  function getCollectionLabel(/** @type {string} */ navProp) {
    return collectionOptions.find((/** @type {any} */ o) => o.navProp === navProp)?.label || navProp;
  }
</script>

<Modal isOpen={isOpen} toggle={() => (isOpen = false)} size="md">
  <ModalHeader toggle={() => (isOpen = false)}>Manage Aggregate Columns</ModalHeader>
  <ModalBody>
    {#if editingAggId !== null}
      {#if collectionOptions.length === 0}
        <div class="alert alert-info">No collection (one-to-many) relationships available for this entity.</div>
      {:else}
        <div class="mb-3">
          <label class="form-label" for="agg-collection">Collection (Child Entity)</label>
          <select class="form-select" id="agg-collection" bind:value={aggCollectionNavProp}>
            <option value="">-- Select --</option>
            {#each collectionOptions as opt (opt.navProp)}<option value={opt.navProp}>{opt.label}</option>{/each}
          </select>
        </div>
        {#if aggCollectionNavProp}
          <div class="mb-3">
            <label class="form-label" for="agg-field">Field to Aggregate</label>
            <select class="form-select" id="agg-field" bind:value={aggSourceField}>
              <option value="">-- Select --</option>
              {#each childFieldOptions as f (f.name)}<option value={f.name}>{f.label}</option>{/each}
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label" for="agg-fn">Function</label>
            <select class="form-select" id="agg-fn" bind:value={aggFunction}>
              <option value="sum">Sum</option><option value="avg">Average</option><option value="count">Count</option><option value="min">Min</option><option value="max">Max</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label" for="agg-label">Column Label</label>
            <input class="form-control" id="agg-label" bind:value={aggLabel} placeholder="Auto-generated if empty" />
          </div>
        {/if}
        {#if aggError}<div class="alert alert-danger">{aggError}</div>{/if}
      {/if}
      <div class="d-flex gap-2 mt-3">
        <Button color="primary" onclick={saveAggregate}>{editingAggId === "new" ? "Add" : "Update"}</Button>
        <Button color="secondary" onclick={cancelAggForm}>Cancel</Button>
      </div>
    {:else}
      {#if !view.aggregates || view.aggregates.length === 0}
        <div class="text-muted mb-3">No aggregate columns defined.</div>
      {:else}
        {#each view.aggregates as agg (agg.id)}
          <div class="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
            <div>
              <div class="fw-bold">{agg.label}</div>
              <div class="small text-muted">
                {getCollectionLabel(agg.collectionNavProp)} → {agg.sourceField} ({agg.fn})
              </div>
            </div>
            <div class="d-flex gap-2">
              <Button size="sm" outline onclick={() => startEditAggregate(agg)}>Edit</Button>
              <Button size="sm" outline color="danger" onclick={() => removeAggregate(agg.id)}>Remove</Button>
            </div>
          </div>
        {/each}
      {/if}
      {#if collectionOptions.length > 0}
        <Button outline onclick={startAddAggregate}>+ Add Aggregate</Button>
      {/if}
    {/if}
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" onclick={() => (isOpen = false)}>Done</Button>
  </ModalFooter>
</Modal>
