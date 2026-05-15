<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  const DEFAULT_APP_ID = "00000000-0000-0000-0000-000000000000";

  onMount(() => {
    goto(`/app/${DEFAULT_APP_ID}`, { replaceState: true });
  });
</script>

<div class="d-flex justify-content-center align-items-center h-100">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Redirecting...</span>
  </div>
</div>
