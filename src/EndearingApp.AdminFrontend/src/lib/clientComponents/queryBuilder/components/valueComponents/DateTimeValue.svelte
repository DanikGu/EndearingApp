<script>
  /**
   * @typedef {Object} Props
   * @property {any} value
   * @property {string} [inputType]
   */

  /** @type {Props} */
  let { value = $bindable(), inputType = "datetime-local" } = $props();
</script>

<input
  type={inputType}
  class="form-control"
  style="flex: 1; min-width: 0"
  placeholder="Value"
  bind:value
/>
