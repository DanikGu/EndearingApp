<script>
  import { Field } from "../logic/typeDefinitions";

  /**
   * @typedef {Object} Props
   * @property {Field[]} fields
   * @property {string} value
   * @property {() => void} onFieldChange
   */

  /** @type {Props} */
  let { fields, value = $bindable(), onFieldChange } = $props();
</script>

<select class="form-select" style="flex: 1; min-width: 0" bind:value onchange={onFieldChange}>
  <option value="">Select Field...</option>
  {#each fields as field}
    <option value={field.name}>{field.displayName}</option>
  {/each}
</select>
