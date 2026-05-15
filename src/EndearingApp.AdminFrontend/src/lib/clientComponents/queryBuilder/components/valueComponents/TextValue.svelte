<script>
  /**
   * @typedef {Object} Props
   * @property {any} value
   * @property {string} [inputType]
   * @property {string} operation
   */

  /** @type {Props} */
  let { value = $bindable(), inputType = "text", operation } = $props();

  const stringFuncOps = ["contains", "startswith", "endswith"];
  const isIn = $derived(operation === "in");
  const isStringFunc = $derived(stringFuncOps.includes(operation));
</script>

{#if isIn}
  <input
    type="text"
    class="form-control"
    style="flex: 1; min-width: 0"
    placeholder="Comma-separated values"
    bind:value
  />
{:else if isStringFunc || inputType !== "textarea"}
  <input
    type="text"
    class="form-control"
    style="flex: 1; min-width: 0"
    placeholder="Value"
    bind:value
  />
{:else}
  <textarea
    class="form-control"
    style="flex: 1; min-width: 0"
    placeholder="Value"
    bind:value
  ></textarea>
{/if}
