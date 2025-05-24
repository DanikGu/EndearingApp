<script>
  import { Spinner } from "@sveltestrap/sveltestrap";
  import { onMount } from "svelte";

  /** @type {string} */
  export let msg;

  /** @type {Promise<any>} */
  export let awaitedPromise;

  /** @type {boolean} */
  export let loadingStatus = true;

  /** @type {HTMLElement | null} */
  let thisCompElem = null;

  $: onStatusChange(loadingStatus);

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
</script>

<div
  class="flex gap-10 h-full w-full absolute top-0 bg-opacity-15 rounded bg-gray-900 dark:bg-gray-100 dark:bg-opacity-15"
  style="z-index: 10000;"
  bind:this={thisCompElem}
>
  <div
    class="flex flex-col justify-center items-center h-full w-full z-auto dark:text-white"
  >
    <Spinner class="w-5 h-5" />
    {msg}
  </div>
</div>
