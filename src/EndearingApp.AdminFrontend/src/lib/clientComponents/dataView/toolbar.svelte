<script>
  import { Button } from "@sveltestrap/sveltestrap";

  /**
   * @typedef {Object} Props
   * @property {(() => void) | null} onAddNew
   * @property {(() => void) | null} onRefresh
   * @property {(() => void) | null} onEditFilters
   * @property {(() => void) | null} onManageColumns
   * @property {(() => void) | null} onAddAggregate
   */

  let { onAddNew, onRefresh, onEditFilters, onManageColumns, onAddAggregate } = $props();
</script>

<div class="d-flex justify-content-between align-items-center mb-3">
  <div class="d-flex gap-2">
    <Button color="success" onclick={onAddNew}>Add New</Button>
    <Button outline onclick={onRefresh}>Refresh</Button>
  </div>
  <div class="d-flex gap-2">
    <Button outline onclick={onEditFilters}>Edit Filters</Button>
    <Button outline onclick={onManageColumns}>Manage Columns</Button>
    <Button outline onclick={onAddAggregate}>Add Aggregate</Button>
  </div>
</div>
