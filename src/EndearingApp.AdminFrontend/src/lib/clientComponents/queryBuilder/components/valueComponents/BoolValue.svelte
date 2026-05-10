<script>
  /**
   * @typedef {Object} Props
   * @property {any} value
   */

  /** @type {Props} */
  let { value = $bindable() } = $props();
</script>

<input type="checkbox" class="form-check-input" style="flex: 1; min-width: 0" checked={value} onchange={(e) => value = /** @type {HTMLInputElement} */ (e.target).checked} />
