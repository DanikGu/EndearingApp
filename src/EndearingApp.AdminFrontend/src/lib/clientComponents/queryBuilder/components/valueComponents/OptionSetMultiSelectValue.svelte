<script>
  import Svelecte from "svelecte";

  /**
   * @typedef {Object} OptionItem
   * @property {string | number} value
   * @property {string} name
   */

  /**
   * @typedef {Object} Props
   * @property {any} value
   * @property {OptionItem[]} options
   */

  /** @type {Props} */
  let { value = $bindable(), options } = $props();
</script>

<div class="form-control" style="flex: 1; min-width: 0">
  <Svelecte
    options={options.map((x) => ({ value: `${x.value}`, text: x.name }))}
    multiple
    bind:value
  ></Svelecte>
</div>
