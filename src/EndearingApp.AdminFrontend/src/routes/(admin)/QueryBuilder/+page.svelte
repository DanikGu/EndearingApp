<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { getCustomEntities, getOptionSets } from "@stores/global";
  import { Button, Col, Container, FormGroup, Input, Label, Row } from "@sveltestrap/sveltestrap";
  import ViewDescription from "../../../lib/clientComponents/dataView/viewDescription";
  import DataView from "../../../lib/clientComponents/dataView/dataView.svelte";
  import { fetchEntities, buildODataUrl } from "$lib/api/odata";
  import { alertError, assignLoader } from "@utils/uiutils";
  import buildQuery from "odata-query";

  let selectedEntityId = $state(/** @type {string | null} */ (null));
  let getUrlValue = $state("");
  let content = $state({ json: /** @type {any[]} */ ([]) });
  let entities = $state(/** @type {any[]} */ ([]));
  let debugView = $state(new ViewDescription());

  onMount(async () => {
    const [ents] = await Promise.all([getCustomEntities(), getOptionSets()]);
    if (ents) entities = ents;
  });

  $effect(() => {
    if (selectedEntityId) {
      debugView = new ViewDescription({ entityId: selectedEntityId });
    }
  });

  let selectedEntity = $derived(entities.find((/** @type {any} */ x) => x.id === selectedEntityId));
  let entityName = $derived(selectedEntity ? selectedEntity.name : "");

  function buildODataOptions() {
    return debugView.buildQueryOptions(1);
  }

  function buildUrlString() {
    if (!entityName) return "";
    const opts = debugView.buildQueryOptions(1);
    /** @type {Record<string, any>} */
    const queryObj = { top: opts.top, orderBy: opts.orderBy };
    if (opts.filter) queryObj.filter = opts.filter;
    if (opts.select) queryObj.select = opts.select;
    if (opts.expand) queryObj.expand = opts.expand;
    return `/api/odata/${entityName}${buildQuery(queryObj)}`;
  }

  let loadId = $state(0);
  $effect(() => {
    if (selectedEntityId && browser && !loadId) loadId = 1;
    if (loadId && selectedEntityId && browser) loadPage();
  });

  async function loadPage() {
    if (!browser || !selectedEntityId || !entityName) { content.json = []; return; }
    getUrlValue = buildUrlString();
    const opts = buildODataOptions();
    const { data, error } = await fetchEntities(entityName, opts);
    if (error) { alertError("Failed to load data: " + error.message); content.json = []; return; }
    content.json = data?.value || [];
  }

  async function queryBuilderSearchClick() {
    if (!entityName) return;
    getUrlValue = buildUrlString();
    const opts = buildODataOptions();
    const prom = (async () => {
      const { data, error } = await fetchEntities(entityName, opts);
      if (error) { alertError(error.message); content.json = []; return; }
      content.json = data?.value || [];
    })();
    assignLoader("Load data", prom);
  }

  let typesItems = $derived(entities.map((/** @type {any} */ x) => ({ value: x.id, name: x.name })));
</script>

<Container fluid class="d-flex flex-column p-3">
  <Row class="mb-3">
    <Col md="12">
      <div class="d-flex gap-2 align-items-end">
        <FormGroup class="mb-0">
          <Label for="entitySelect">Entity</Label>
          <Input type="select" id="entitySelect" bind:value={selectedEntityId}>
            <option value={null} selected={selectedEntityId === null}>Select an Entity...</option>
            {#each typesItems as item (item.value)}
              <option value={item.value}>{item.name}</option>
            {/each}
          </Input>
        </FormGroup>
        <Button onclick={queryBuilderSearchClick}>Apply</Button>
      </div>
    </Col>
  </Row>
  <Row class="mb-3">
    <Col md="12">
      <FormGroup>
        <Label for="urlDisplay">Current OData URL</Label>
        <Input id="urlDisplay" type="text" value={getUrlValue} readonly class="font-mono text-xs" />
      </FormGroup>
    </Col>
  </Row>
  <Row>
    <Col md="12">
      {#if selectedEntity}
        <DataView
          {entityName}
          bind:data={content.json}
          customEntity={selectedEntity}
          bind:view={debugView}
          onViewChange={queryBuilderSearchClick}
          onRefresh={queryBuilderSearchClick}
          onSortChange={() => queryBuilderSearchClick()}
        />
      {/if}
    </Col>
  </Row>
</Container>
