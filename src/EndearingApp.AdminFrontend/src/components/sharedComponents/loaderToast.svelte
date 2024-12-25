<script>
  import { Toast, Spinner } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";
  import {
    BadgeCheckSolid,
    ExclamationCircleSolid,
  } from "flowbite-svelte-icons";

  /**
   * @enum {number}
   **/
  const ToastType = {
    LOADING: 0,
    SUCCSESS: 1,
    ERROR: 2,
  };

  /** @type {ToastType} */
  export let type = 0;
  export let dismissable = false;
  export let msg;

  /**
   * @type {Promise<any>}
   */
  export let awaitedPromise;
  let toastStatus = false;
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
</script>

<div class="flex gap-10">
  <Toast {dismissable} transition={slide} bind:toastStatus>
    {#if ToastType.LOADING == type}
      <Spinner class="w-5 h-5" />
    {/if}
    {#if ToastType.SUCCSESS == type}
      <BadgeCheckSolid class="w-5 h-5 text-green-600" />
    {/if}
    {#if ToastType.ERROR == type}
      <ExclamationCircleSolid class="w-5 h-5 text-red-700" />
    {/if}
    {msg}
  </Toast>
</div>
