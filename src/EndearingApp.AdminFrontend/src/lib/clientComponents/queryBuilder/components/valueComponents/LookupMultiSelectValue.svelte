<script>
  import Svelecte from "svelecte";
  import { fetchEntities } from "$lib/api/odata";

  /** @typedef {{Id: string, Name: string}} OptionItem */

  /**
   * @typedef {Object} Props
   * @property {any} value
   * @property {string | null} lookupEntityName
   */

  /** @type {Props} */
  let { value = $bindable(), lookupEntityName } = $props();

  /** @type {OptionItem[]} */
  let selectOptions = $state([]);
  let loading = $state(true);
  let _initialized = false;

  $effect(() => {
    const entity = lookupEntityName;
    if (!entity) {
      selectOptions = [];
      loading = false;
      _initialized = false;
      return;
    }
    if (_initialized) return;
    _initialized = true;
    const ids = Array.isArray(value) ? [...value] : [];
    resolveAndFetch(ids, entity);
  });

  /** @param {string[]} ids
   *  @param {string} entity */
  const resolveAndFetch = async (ids, entity) => {
    loading = true;
    selectOptions = [];

    if (ids.length > 0) {
      try {
        const idFilter = ids.map((id) => `Id eq ${id}`).join(" or ");
        const { data, error } = await fetchEntities(entity, {
          filter: idFilter,
          select: ["Id", "Name"],
          top: ids.length,
        });
        if (!error && data?.value) {
          const resolvedMap = new Map(
            data.value.map((/** @type {{Id: string, Name?: string, name?: string}} */ r) => [
              r.Id,
              r.Name || r.name || r.Id,
            ]),
          );
          selectOptions = ids.map((id) => ({ Id: id, Name: resolvedMap.get(id) || id }));
        }
      } catch {
        selectOptions = ids.map((id) => ({ Id: id, Name: id }));
      }
    }

    try {
      const { data, error } = await fetchEntities(entity, {
        select: ["Id", "Name"],
        top: 50,
      });
      if (!error && data?.value) {
        const existing = new Set(selectOptions.map((o) => o.Id));
        const added = [];
        for (const r of data.value) {
          const record = /** @type {{Id: string, Name?: string, name?: string}} */ (r);
          if (!existing.has(record.Id)) {
            added.push({ Id: record.Id, Name: record.Name || record.name || record.Id });
          }
        }
        if (added.length > 0) {
          selectOptions = [...selectOptions, ...added];
        }
      }
    } catch {}

    loading = false;
  };
</script>

<div class="form-control" style="flex: 1; min-width: 0">
  {#if loading}
    <span class="text-muted px-2 d-flex align-items-center h-100">Loading...</span>
  {:else}
    <Svelecte
      options={selectOptions.map((x) => ({ value: x.Id, text: x.Name }))}
      multiple
      bind:value
    ></Svelecte>
  {/if}
</div>
