<script>
  import {
    fetchEntityById,
    fullTextSearch,
    fetchEntities,
  } from "$lib/api/odata";

  /** @typedef {{Id: string, Name: string}} SearchResult */

  /**
   * @typedef {Object} Props
   * @property {any} value
   * @property {string | null} lookupEntityName
   */

  /** @type {Props} */
  let { value = $bindable(), lookupEntityName } = $props();

  /** @type {string} */
  let searchQuery = $state("");
  /** @type {SearchResult[]} */
  let searchResults = $state([]);
  /** @type {string | null} */
  let selectedName = $state(null);
  /** @type {boolean} */
  let showDropdown = $state(false);
  /** @type {ReturnType<typeof setTimeout> | null} */
  let searchTimeout = null;

  $effect(() => {
    if (value?.Id == null && value) {
      if (!selectedName && lookupEntityName) {
        fetchEntityName(value).then((name) => {
          if (name) selectedName = name;
        });
      }
    }
    if (!value && selectedName) {
      selectedName = null;
      searchQuery = "";
    }
  });

  /** @param {string} id
   *  @returns {Promise<string | null>} */
  const fetchEntityName = async (id) => {
    if (!lookupEntityName || !id) return null;
    const { data, error } = await fetchEntityById(lookupEntityName, id, {
      select: ["Id", "Name"],
    });
    if (error || !data) return null;
    return data.Name || data.name || null;
  };

  /** @param {string} query */
  const fetchResults = async (query) => {
    if (!lookupEntityName) {
      searchResults = [];
      showDropdown = false;
      return;
    }
    const { data, error } = query
      ? await fullTextSearch(lookupEntityName, query, {
          select: ["Id", "Name"],
          top: 5,
        })
      : await fetchEntities(lookupEntityName, {
          select: ["Id", "Name"],
          top: 5,
        });
    if (error || !data) {
      searchResults = [];
      showDropdown = false;
      return;
    }
    searchResults = (data.value || []).map(
      (/** @type {{Id: string, Name?: string, name?: string}} */ r) => ({
        Id: r.Id,
        Name: r.Name || r.name || r.Id,
      }),
    );
    showDropdown = searchResults.length > 0;
  };

  const onFocus = () => {
    if (!searchQuery && !selectedName) fetchResults("");
  };

  const onSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => fetchResults(searchQuery), 300);
  };

  const onBlur = () => {
    setTimeout(() => {
      showDropdown = false;
    }, 200);
  };

  /** @param {KeyboardEvent} e */
  const handleKeydown = (e) => {
    if (e.key === "Escape") showDropdown = false;
  };

  /** @param {SearchResult} item */
  const select = (item) => {
    value = item.Id;
    selectedName = item.Name;
    searchQuery = "";
    searchResults = [];
    showDropdown = false;
  };

  const clear = () => {
    value = null;
    selectedName = null;
    searchQuery = "";
    searchResults = [];
    showDropdown = false;
  };
</script>

<div
  class="lookup-container form-control p-0 position-relative d-flex align-items-center"
  style="flex: 1; min-width: 0"
>
  {#if selectedName && value}
    <div class="d-flex justify-content-between align-items-center w-100 px-2">
      <span class="text-truncate">{selectedName}</span>
      <button
        type="button"
        class="btn btn-sm p-0 border-0 bg-transparent ms-2"
        onclick={clear}
        aria-label="Remove"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  {:else if value && !selectedName}
    <div class="d-flex align-items-center w-100 px-2 text-muted">
      <span class="text-truncate">{String(value).slice(0, 8)}...</span>
      <button
        type="button"
        class="btn btn-sm p-0 border-0 bg-transparent ms-2"
        onclick={clear}
        aria-label="Remove"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  {:else}
    <input
      type="search"
      class="form-control border-0 h-100"
      placeholder="Search..."
      bind:value={searchQuery}
      onfocus={onFocus}
      oninput={onSearch}
      onkeydown={handleKeydown}
      onblur={onBlur}
    />
  {/if}
  {#if showDropdown}
    <div
      class="lookup-dropdown list-group position-absolute w-100 z-3"
      style="top: 100%; left: 0;"
    >
      {#each searchResults as item (item.Id)}
        <button
          type="button"
          class="list-group-item list-group-item-action"
          onmousedown={() => select(item)}
        >
          {item.Name}
        </button>
      {/each}
    </div>
  {/if}
</div>
