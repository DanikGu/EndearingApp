<script>
  import { run } from "svelte/legacy";

  import { Spinner } from "@sveltestrap/sveltestrap";
  import { onMount } from "svelte";

  /**
   * @typedef {Object} Props
   * @property {string} msg
   * @property {Promise<any>} awaitedPromise
   * @property {boolean} [loadingStatus]
   */

  /** @type {Props} */
  let { msg, awaitedPromise, loadingStatus = $bindable(true) } = $props();

  /** @type {HTMLElement | null} */
  let thisCompElem = $state(null);

  /** @param {boolean} loadingStatus */
  let onStatusChange = (loadingStatus) => {
    if (loadingStatus === false) {
      destroy();
    }
  };

  let destroy = () => {
    if (thisCompElem) {
      thisCompElem.parentNode?.removeChild(thisCompElem);
    }
  };

  onMount(() => {
    awaitedPromise?.then(
      (x) => {
        loadingStatus = false;
        return x;
      },
      (x) => {
        loadingStatus = false;
        throw x;
      },
    );
  });
  run(() => {
    onStatusChange(loadingStatus);
  });
</script>

<div
  class="flex gap-10 h-full w-full absolute top-0 right-0 left-0 bottom-0 bg-opacity-15 rounded bg-gray-900 dark:bg-gray-100 dark:bg-opacity-15"
  style="z-index: 10000;"
  bind:this={thisCompElem}
>
  <div
    class="flex flex-col justify-center items-center h-full w-full z-auto text-primary"
  >
    <Spinner class="w-5 h-5" />
    {msg}
  </div>
</div>
