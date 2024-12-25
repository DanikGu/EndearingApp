<script>
  import { onMount } from "svelte";
  import { Spinner } from "flowbite-svelte";

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
  class="flex gap-10 h-full w-full absolute bg-black bg-opacity-15 rounded dark:bg-gray-100 dark:bg-opacity-15"
  bind:this={thisCompElem}
>
  <div
    class="flex flex-col justify-center items-center h-full w-full z-50 dark:text-white"
  >
    <Spinner class="w-5 h-5" />
    {msg}
  </div>
</div>
