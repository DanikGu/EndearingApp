<script>
  import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "@sveltestrap/sveltestrap";

  /**
   * @typedef {Object} Props
   * @property {boolean} show
   * @property {any[]} relationships
   * @property {any[]} fields
   * @property {any[]} allEntities
   * @property {any[]} aggregates
   * @property {string} entityId
   * @property {((aggs: any[]) => void) | null} onSave
   * @property {(() => void) | null} onClose
   */

  /** @type {Record<string, string>} */
  const AGGREGATE_FN_LABELS = {
    sum: "Sum",
    avg: "Average",
    count: "Count",
    min: "Min",
    max: "Max",
  };

  let {
    show = false,
    relationships = [],
    fields = [],
    allEntities = [],
    aggregates = [],
    entityId = "",
    onSave = null,
    onClose = null,
  } = $props();

  let collectionNavProp = $state("");
  let sourceField = $state("");
  let aggregateFn = $state("avg");
  let label = $state("");
  let error = $state("");

  $effect(() => {
    if (show) {
      collectionNavProp = "";
      sourceField = "";
      aggregateFn = "avg";
      label = "";
      error = "";
    }
  });

  /** @type {{ navProp: string, label: string, sourceEntityFields: any[] }[]} */
  let collectionOptions = $derived(
    /** @type {{ navProp: string, label: string, sourceEntityFields: any[] }[]} */ (
      (() => {
        /** @type {Map<string, { navProp: string, label: string, sourceEntityFields: any[] }>} */
        const seen = new Map();
        for (const otherEntity of allEntities) {
          if (!otherEntity.relationships) continue;
          for (const rel of otherEntity.relationships) {
            if (rel.referencedCustomEntityId !== entityId) continue;
            const constraintName = rel.constraintName;
            if (!constraintName) continue;
            const navProp = `${constraintName}_EtnColl`;
            const key = otherEntity.id || otherEntity.name;
            const displayName = otherEntity.displayName || otherEntity.name;
            const existing = seen.get(key);
            if (existing) {
              const expected = `FK_${otherEntity.name}_`;
              if (navProp.includes(expected)) {
                seen.set(key, {
                  navProp,
                  label: `${displayName} (via ${constraintName})`,
                  sourceEntityFields: otherEntity.fields || [],
                });
              }
            } else {
              seen.set(key, {
                navProp,
                label: `${displayName} (via ${constraintName})`,
                sourceEntityFields: otherEntity.fields || [],
              });
            }
          }
        }
        return [...seen.values()];
      })()
    ),
  );

  /** @type {{ name: string, label: string }[]} */
  let childFieldOptions = $derived(
    (() => {
      if (!collectionNavProp) return [];
      const selected = collectionOptions.find(
        (o) => o.navProp === collectionNavProp,
      );
      if (!selected) return [];
      return selected.sourceEntityFields.map((/** @type {any} */ f) => ({
        name: f.name,
        label: f.displayName || f.name,
      }));
    })(),
  );

  function handleSave() {
    error = "";
    if (!collectionNavProp) {
      error = "Select a collection";
      return;
    }
    if (!sourceField) {
      error = "Select a field to aggregate";
      return;
    }
    if (!label) {
      const fnLabel =
        AGGREGATE_FN_LABELS[aggregateFn] || aggregateFn;
      label = `${fnLabel} of ${sourceField}`;
    }
    const newAgg = {
      id: crypto.randomUUID(),
      label,
      collectionNavProp,
      sourceField,
      fn: aggregateFn,
    };
    onSave?.([...aggregates, newAgg]);
  }
</script>

<Modal isOpen={show} toggle={onClose} size="md">
  <ModalHeader toggle={onClose}>Add Aggregate Column</ModalHeader>
  <ModalBody>
    {#if collectionOptions.length === 0}
      <div class="alert alert-info">
        No collection (one-to-many) relationships available for this entity. Add
        relationships first.
      </div>
    {:else}
      <div class="mb-3">
        <label class="form-label" for="agg-collection"
          >Collection (Child Entity)</label
        >
        <select
          class="form-select"
          id="agg-collection"
          bind:value={collectionNavProp}
        >
          <option value="">-- Select --</option>
          {#each collectionOptions as opt (opt.navProp)}
            <option value={opt.navProp}>{opt.label}</option>
          {/each}
        </select>
      </div>

      {#if collectionNavProp}
        <div class="mb-3">
          <label class="form-label" for="agg-field">Field to Aggregate</label>
          <select class="form-select" id="agg-field" bind:value={sourceField}>
            <option value="">-- Select --</option>
            {#each childFieldOptions as f (f.name)}
              <option value={f.name}>{f.label}</option>
            {/each}
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label" for="agg-fn">Function</label>
          <select class="form-select" id="agg-fn" bind:value={aggregateFn}>
            <option value="sum">Sum</option>
            <option value="avg">Average</option>
            <option value="count">Count</option>
            <option value="min">Min</option>
            <option value="max">Max</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label" for="agg-label">Column Label</label>
          <input
            class="form-control"
            id="agg-label"
            bind:value={label}
            placeholder="Auto-generated if empty"
          />
        </div>
      {/if}

      {#if error}
        <div class="alert alert-danger">{error}</div>
      {/if}
    {/if}
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onclick={handleSave}>Add</Button>
    <Button color="secondary" onclick={onClose}>Cancel</Button>
  </ModalFooter>
</Modal>
