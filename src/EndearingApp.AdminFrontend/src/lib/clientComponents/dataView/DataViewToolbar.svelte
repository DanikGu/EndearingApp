<script>
  import { Button } from "@sveltestrap/sveltestrap";

  let {
    onAddNew,
    onRefresh,
    onOpenColumnManager,
    onOpenFilterModal,
    onOpenAggregateModal,
  } = $props();
</script>

<div class="d-flex justify-content-between align-items-center mb-3">
  <div class="d-flex gap-2">
    <Button color="success" onclick={onAddNew}>Add New</Button>
    <Button outline onclick={onRefresh}>Refresh</Button>
  </div>
  <div class="d-flex gap-2">
    <Button outline onclick={onOpenColumnManager}>Manage Columns</Button>
    <Button outline onclick={onOpenFilterModal}>Edit Filters</Button>
    <Button outline onclick={onOpenAggregateModal}>Manage Aggregates</Button>
  </div>
</div>
