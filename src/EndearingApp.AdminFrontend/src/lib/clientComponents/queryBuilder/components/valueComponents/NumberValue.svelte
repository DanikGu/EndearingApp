<script>
  /**
   * @typedef {Object} Props
   * @property {any} value
   * @property {string} operation
   */

  /** @type {Props} */
  let { value = $bindable(), operation } = $props();

  const isIn = $derived(operation === "in");
</script>

{#if isIn}
  <input type="text" class="form-control" style="flex: 1; min-width: 0" placeholder="Comma-separated values" bind:value />
{:else}
  <input type="number" class="form-control" style="flex: 1; min-width: 0" placeholder="Value" bind:value />
{/if}
