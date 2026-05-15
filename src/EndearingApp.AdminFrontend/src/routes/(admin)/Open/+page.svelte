<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { getFirstFormForEntity } from "$lib/api/metadata";
  import { ensureCustomEntities } from "../../../stores/global";
  import { Container, Row, Col } from "@sveltestrap/sveltestrap";

  const DEFAULT_APP_ID = "00000000-0000-0000-0000-000000000000";
  let loading = $state(true);
  let errorMsg = $state("");

  onMount(async () => {
    if (!browser) return;
    await ensureCustomEntities();

    const params = new URLSearchParams(window.location.search);
    const entityName = params.get("entity");
    const entityId = params.get("id") || null;
    const formId = params.get("form") || null;

    if (!entityName) {
      errorMsg = 'Missing "entity" parameter.';
      loading = false;
      return;
    }

    const { get } = await import("svelte/store");
    const { customEntities } = await import("../../../stores/global");
    const entities = get(customEntities);
    const entity = entities.find(
      (/** @type {any} */ e) =>
        e.name === entityName || e.displayName === entityName,
    );

    if (!entity) {
      errorMsg = `Entity "${entityName}" not found.`;
      loading = false;
      return;
    }

    let queryFormId = formId;
    if (!queryFormId) {
      const { data: formInfo } = await getFirstFormForEntity(entity.id);
      if (!formInfo) {
        errorMsg = `No form configured for "${entity.displayName || entity.name}".`;
        loading = false;
        return;
      }
      queryFormId = formInfo.formId;
    }

    let target = `/app/${DEFAULT_APP_ID}/${entity.name}/edit`;
    if (entityId) {
      target += `/${entityId}`;
    }
    target += `?form=${queryFormId}`;
    await goto(target, { replaceState: true });
  });
</script>

<Container class="p-5">
  <Row class="justify-content-center">
    <Col md="6" class="text-center">
      {#if loading}
        <p class="text-muted">Redirecting...</p>
      {:else if errorMsg}
        <div class="alert alert-warning">
          <h4 class="alert-heading">Cannot open entity</h4>
          <p>{errorMsg}</p>
          <hr />
          <a href="/" class="btn btn-outline-secondary">Go to Home</a>
        </div>
      {/if}
    </Col>
  </Row>
</Container>
