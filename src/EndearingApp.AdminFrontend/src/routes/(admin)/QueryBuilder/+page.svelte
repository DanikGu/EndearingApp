<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { customEntities as customEntitiesStore, optionSets as optionSetsStore, ensureCustomEntities, ensureOptionSets } from "../../../stores/global";
  import {
    Button,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
  } from "@sveltestrap/sveltestrap";
  import { ConditionGroup } from "../../../components/QueryBuilder/typeDefinitions";
  import { convertToOdataFilter } from "../../../components/QueryBuilder/queryToOdataUrlParams";
  import DataView from "../../../lib/clientComponents/dataView/dataView.svelte";
  import { fetchEntities } from "$lib/api/odata";
  import { alertError, assignLoader } from "@utils/uiutils";

  /** @type {string | null} */
  let selectedEntityId = $state(null);

  let rootQuery = new ConditionGroup("and", []);

  let getUrlValue = $state("");

  /** @type {any} */
  let content = $state({ json: [] });

  /** @type {any[]} */
  let selectedExpands = $state([]);

  onMount(async () => {
    await ensureCustomEntities();
    await ensureOptionSets();
  });

  $effect(() => {
    if (selectedEntityId) {
      rootQuery = new ConditionGroup("and", []);
      selectedExpands = [];
    }
  });

  let selectedEntity = $derived(
    $customEntitiesStore.find((x) => x.id === selectedEntityId),
  );

  let autoExpands = $derived.by(() => {
    if (!selectedEntity?.fields || !selectedEntity?.relationships) return [];
    const map = {};
    for (const rel of selectedEntity.relationships) {
      const field = selectedEntity.fields.find((/** @type {any} */ f) => f.id === rel.sourceFieldId);
      if (!field) continue;
      const navProp = `${field.name}_Etn`;
      map[navProp] = { navigationProp: navProp, select: ['id', 'name'] };
    }
    return Object.values(map);
  });

  let allExpands = $derived.by(() => {
    const map = {};
    for (const ex of [...autoExpands, ...selectedExpands]) {
      if (!map[ex.navigationProp]) {
        map[ex.navigationProp] = { navigationProp: ex.navigationProp, select: [] };
      }
      for (const f of ex.select) {
        if (!map[ex.navigationProp].select.includes(f)) {
          map[ex.navigationProp].select.push(f);
        }
      }
    }
    return Object.values(map);
  });

  let entityName = $derived(
    selectedEntityId ? $customEntitiesStore.find((x) => x.id === selectedEntityId)?.name : '',
  );

  function buildODataOptions() {
    const opts = { top: 100, orderBy: 'createdon desc' };
    const filter = convertToOdataFilter(rootQuery);
    if (filter) opts.filter = filter;
    if (allExpands.length > 0) {
      opts.expand = allExpands.map((/** @type {any} */ ex) =>
        `${ex.navigationProp}($select=${ex.select.join(',')})`,
      ).join(';');
    }
    return opts;
  }

  function buildUrlString() {
    if (!entityName) return '';
    const params = new URLSearchParams();
    const filter = convertToOdataFilter(rootQuery);
    if (filter) params.set('$filter', filter);
    if (allExpands.length > 0) {
      params.set('$expand', allExpands.map((/** @type {any} */ ex) =>
        `${ex.navigationProp}($select=${ex.select.join(',')})`,
      ).join(';'));
    }
    params.set('$top', '100');
    params.set('$orderby', 'createdon desc');
    return `/api/odata/${entityName}?${params.toString()}`;
  }

  let loadId = $state(0);

  $effect(() => {
    if (selectedEntityId && browser && !loadId) {
      loadId = 1;
    }
    if (loadId && selectedEntityId && browser) {
      loadPage();
    }
  });

  const loadPage = async () => {
    if (!browser || !selectedEntityId || !entityName) {
      content.json = [];
      return;
    }

    getUrlValue = buildUrlString();
    const opts = buildODataOptions();
    const { data, error } = await fetchEntities(entityName, opts);
    if (error) {
      alertError("Failed to load data: " + error.message);
      content.json = [];
      return;
    }
    content.json = data?.value || [];
  };

  const queryBuilderSearchClick = () => {
    if (!entityName) return;
    getUrlValue = buildUrlString();
    const opts = buildODataOptions();

    const prom = (async () => {
      const { data, error } = await fetchEntities(entityName, opts);
      if (error) { alertError(error.message); content.json = []; return; }
      content.json = data?.value || [];
    })();
    assignLoader("Load data", prom);
  };

  let typesItems = $derived(
    $customEntitiesStore.map((x) => ({ value: x.id, name: x.name })),
  );
</script>

<Container fluid class="d-flex flex-column p-3">
  <Row class="mb-3">
    <Col md="12">
      <div class="d-flex gap-2 align-items-end">
        <FormGroup class="mb-0">
          <Label for="entitySelect">Entity</Label>
          <Input
            type="select"
            id="entitySelect"
            bind:value={selectedEntityId}
          >
            <option value={null} selected={selectedEntityId === null}>
              Select an Entity...
            </option>
            {#each typesItems as item (item.value)}
              <option value={item.value}>{item.name}</option>
            {/each}
          </Input>
        </FormGroup>
        <Button on:click={queryBuilderSearchClick}>Apply</Button>
      </div>
    </Col>
  </Row>

  <Row class="mb-3">
    <Col md="12">
      <FormGroup>
        <Label for="urlDisplay">Current OData URL</Label>
        <Input
          id="urlDisplay"
          type="text"
          value={getUrlValue}
          readonly
          class="font-mono text-xs"
        />
      </FormGroup>
    </Col>
  </Row>

  <Row>
    <Col md="12">
      {#if selectedEntity}
        <DataView
          entityName={entityName}
          bind:data={content.json}
          customEntity={selectedEntity}
          bind:expands={selectedExpands}
          bind:rootQuery={rootQuery}
          onFiltersDone={queryBuilderSearchClick}
          onRefresh={queryBuilderSearchClick}
        ></DataView>
      {/if}
    </Col>
  </Row>
</Container>
