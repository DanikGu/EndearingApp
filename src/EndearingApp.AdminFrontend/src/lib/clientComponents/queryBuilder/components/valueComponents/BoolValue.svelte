<script>
  import { Input } from "@sveltestrap/sveltestrap";
  /**
   * @typedef {Object} Props
   * @property {any} value
   */

  /** @type {Props} */
  let { value = $bindable() } = $props();
</script>

<Input
  type="select"
  class="flex h-full w-full justify-center items-center"
  onchange={(e) => {
    value = /** @type {HTMLInputElement} */ (e.target).value === "true";
  }}
>
  <option value="true">True</option>
  <option value="false">False</option>
</Input>
