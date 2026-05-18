<script>
  import { Button } from "@sveltestrap/sveltestrap";

  let {
    page = $bindable(1),
    pageSize = 25,
    totalCount = 0,
    onRefresh,
    pageSizeOnChange,
  } = $props();

  let totalPages = $derived(Math.max(1, Math.ceil(totalCount / pageSize)));
</script>

{#if totalCount > 0}
  <div class="d-flex justify-content-between align-items-center mt-3">
    <div class="d-flex align-items-center gap-2">
      <select class="form-select form-select-sm w-auto" value={pageSize} onchange={(e) => { const ps = Number(/** @type {HTMLSelectElement} */ (e.target).value); pageSizeOnChange?.(ps); }}>
        <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
      </select>
      <span class="text-muted small">per page</span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <span class="text-muted small">Page {page} of {totalPages} ({totalCount} total)</span>
      <Button size="sm" outline disabled={page <= 1} onclick={() => { page = page - 1; onRefresh?.(); }}>Prev</Button>
      <Button size="sm" outline disabled={page >= totalPages} onclick={() => { page = page + 1; onRefresh?.(); }}>Next</Button>
    </div>
  </div>
{/if}
