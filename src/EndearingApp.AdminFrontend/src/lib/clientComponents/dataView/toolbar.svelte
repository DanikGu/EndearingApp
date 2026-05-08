<script>
  import { Button } from "@sveltestrap/sveltestrap";

  let { onAddNew, onRefresh, onEditFilters, onManageColumns } = $props();
</script>

<div class="d-flex justify-content-between align-items-center mb-3">
  <div class="d-flex gap-2">
    <Button color="success" on:click={onAddNew}>Add New</Button>
    <Button outline on:click={onRefresh}>Refresh</Button>
  </div>
  <div class="d-flex gap-2">
    <Button outline on:click={onEditFilters}>Edit Filters</Button>
    <Button outline on:click={onManageColumns}>Manage Columns</Button>
  </div>
</div>
