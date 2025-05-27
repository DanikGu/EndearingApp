<script>
  import {
    Toast,
    ToastHeader,
    ToastBody,
    Spinner,
  } from "@sveltestrap/sveltestrap";
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";

  /**
   * @enum {number}
   **/
  const ToastType = {
    LOADING: 0,
    SUCCESS: 1,
    ERROR: 2,
  };

  /**
   * @typedef {Object} Props
   * @property {ToastType} [type]
   * @property {boolean} [dismissable]
   * @property {string} [msg]
   * @property {Promise<any> | undefined} [awaitedPromise]
   * @property {boolean} [toastStatus]
   */

  /** @type {Props} */
  let {
    type = ToastType.LOADING,
    dismissable = false,
    msg = "",
    awaitedPromise = undefined,
    toastStatus = $bindable(false),
  } = $props();

  onMount(() => {
    if (!awaitedPromise) {
      return;
    }
    toastStatus = true;
    awaitedPromise.then(
      (x) => {
        toastStatus = false;
        return x;
      },
      (x) => {
        toastStatus = false;
        throw x;
      },
    );
  });

  function handleClose() {
    toastStatus = false;
  }
</script>

{#if toastStatus}
  <div transition:slide>
    <Toast class="mb-3 shadow-sm">
      <ToastHeader toggle={dismissable ? handleClose : undefined}>
        {#if ToastType.LOADING === type}
          <Spinner size="sm" color="primary" class="me-2" />
          <span>Loading...</span>
        {:else if ToastType.SUCCESS === type}
          <span>Success</span>
        {:else if ToastType.ERROR === type}
          <span>Error</span>
        {/if}
      </ToastHeader>
      <ToastBody>
        {msg}
      </ToastBody>
    </Toast>
  </div>
{/if}
