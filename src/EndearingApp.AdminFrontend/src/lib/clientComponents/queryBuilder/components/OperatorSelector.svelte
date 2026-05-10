<script>
  import { OPERATOR_LABELS } from "../logic/filterOperatorsMatrix";

  /**
   * @typedef {Object} Props
   * @property {string[]} availableOperators
   * @property {string} value
   * @property {(v: string) => void} onchange
   * @property {boolean} [disabled]
   */

  /** @type {Props} */
  let { availableOperators, value, onchange, disabled = false } = $props();
</script>

<select class="form-select" style="flex: 1; min-width: 0" value={value} disabled={disabled} onchange={(e) => onchange?.(/** @type {HTMLSelectElement} */ (e.target).value)}>
  <option value="">Select Operator...</option>
  {#each availableOperators as op}
    <option value={op}>{OPERATOR_LABELS[op] || op}</option>
  {/each}
</select>
