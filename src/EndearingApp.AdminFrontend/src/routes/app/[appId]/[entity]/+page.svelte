<script>
  import { page as pageStore } from "$app/stores";
  import { getCustomEntities, getView, saveView, getTypeConfig } from "@stores/global";
  import DataView from "$lib/clientComponents/dataView/dataView.svelte";
  import { fetchEntities } from "$lib/api/odata";
  import { convertToOdataFilter } from "$lib/clientComponents/queryBuilder/logic/queryToOdataUrlParams";
  import {
    ConditionGroup,
    Condition,
  } from "$lib/clientComponents/queryBuilder/logic/typeDefinitions";
  import { assignLoader } from "@utils/uiutils";

  /** @param {any} obj
   *  @param {any[]} [entityFields]
   *  @returns {any} */
  function reviveConditionGroup(obj, entityFields) {
    if (!obj || typeof obj !== "object") return obj;
    if (
      obj.children &&
      Array.isArray(obj.children) &&
      (obj.operator === "and" || obj.operator === "or")
    ) {
      const group = new ConditionGroup(obj.operator, []);
      group.children = obj.children.map((/** @type {any} */ child) => {
        if (
          child &&
          child.children &&
          Array.isArray(child.children) &&
          (child.operator === "and" || child.operator === "or")
        ) {
          return reviveConditionGroup(child, entityFields);
        }
        if (
          child &&
          typeof child.field === "string" &&
          typeof child.operation === "string"
        ) {
          const fieldInfo = entityFields?.find(
            (/** @type {any} */ f) => f.name === child.field,
          );
          const cond = new Condition(
            child.field,
            child.operation,
            child.value,
            fieldInfo || { type: 7 },
          );
          return cond;
        }
        return child;
      });
      return group;
    }
    return obj;
  }

  /** @type {any | null} */
  let customEntity = $state(null);
  /** @type {any[]} */
  let data = $state([]);
  /** @type {{ navigationProp: string, select: string[] }[]} */
  let expands = $state([]);
  /** @type {string[]} */
  let fieldNames = $state([]);
  /** @type {{ id: string, label: string, collectionNavProp: string, sourceField: string, fn: string }[]} */
  let aggregates = $state([]);

  let page = $state(1);
  let pageSize = $state(25);
  let totalCount = $state(0);
  let orderBy = $state("createdon desc");

  /** @type {ConditionGroup} */
  let rootQuery = $state(new ConditionGroup("and", []));

  let currentEntityName = $state("");
  let initializingInProgress = false;

  $effect(() => {
    const entityName = /** @type {string} */ ($pageStore.params.entity);
    if (entityName && entityName !== currentEntityName) {
      currentEntityName = entityName;
      initEntity(entityName);
    }
  });

  async function initEntity(/** @type {string} */ entityName) {
    const entities = await getCustomEntities();
    getTypeConfig();
    const found = entities.find(
      (/** @type {any} */ e) => e.name === entityName || e.id === entityName,
    );
    if (found) {
      initializingInProgress = true;
      customEntity = found;
      data = [];
      expands = [];
      fieldNames = [];
      aggregates = [];
      totalCount = 0;
      page = 1;
      rootQuery = new ConditionGroup("and", []);
      orderBy = "createdon desc";
      const view = getView(found.name);
      if (view.orderBy) orderBy = view.orderBy;
      if (view.pageSize) pageSize = view.pageSize;
      if (view.columns?.length)
        fieldNames = view.columns.filter(
          (/** @type {string} */ c) => c !== "Id",
        );
      if (view.aggregates?.length) aggregates = view.aggregates;
      if (view.filter) {
        try {
          rootQuery = reviveConditionGroup(view.filter, found.fields);
        } catch {
          /* ignore */
        }
      }
      initializingInProgress = false;
      loadData();
    }
  }

  async function loadData() {
    if (!customEntity) return;
    const opts =
      /** @type {{ top: number, skip: number, orderBy: string, count: boolean, filter?: string, select?: string[], expand?: Record<string, { select: string[] }> }} */ ({
        top: pageSize,
        skip: pageSize * (page - 1),
        orderBy,
        count: true,
      });
    const filter = convertToOdataFilter(rootQuery);
    if (filter) opts.filter = filter;
    if (fieldNames.length > 0) {
      let selectFields = [...fieldNames];
      if (!selectFields.includes("Id")) selectFields = [...selectFields, "Id"];
      opts.select = selectFields;
    }
    if (expands.length > 0) {
      /** @type {Record<string, { select: string[] }>} */
      const expandObj = {};
      for (const ex of expands) {
        expandObj[ex.navigationProp] = { select: ex.select };
      }
      opts.expand = expandObj;
    }
    const promise = fetchEntities(customEntity.name, opts);
    assignLoader(`Loading ${customEntity.displayName || customEntity.name}...`, promise);
    const { data: result, error } = await promise;
    if (error) {
      console.error(error);
      data = [];
      totalCount = 0;
    } else if (result) {
      data = result.value || [];
      totalCount =
        result["@odata.count"] || result["@odata.count"]?.toString
          ? Number(result["@odata.count"])
          : (result.value || []).length;
    }
  }

  function handleSort(/** @type {string} */ newOrderBy) {
    orderBy = newOrderBy;
    page = 1;
    saveView(customEntity?.name || "", { orderBy, pageSize });
    loadData();
  }

  function handleRefresh() {
    saveView(customEntity?.name || "", {
      orderBy,
      pageSize,
      filter: rootQuery ? JSON.parse(JSON.stringify(rootQuery)) : null,
    });
    loadData();
  }

  function handleFiltersDone() {
    saveView(customEntity?.name || "", {
      orderBy,
      pageSize,
      filter: rootQuery ? JSON.parse(JSON.stringify(rootQuery)) : null,
    });
    page = 1;
    loadData();
  }

  $effect(() => {
    if (customEntity && customEntity.name === currentEntityName && !initializingInProgress) {
      saveView(customEntity.name, {
        orderBy,
        pageSize,
        columns: fieldNames,
        aggregates,
        filter: rootQuery ? JSON.parse(JSON.stringify(rootQuery)) : null,
      });
    }
  });

  let prevAggId = $state("");
  $effect(() => {
    const id = aggregates.map((/** @type {any} */ a) => a.id).join(",");
    if (customEntity && id !== prevAggId && currentEntityName) {
      prevAggId = id;
      if (!initializingInProgress) {
        loadData();
      }
    }
  });

  let prevExpandId = $state("");
  $effect(() => {
    const id = expands.map((/** @type {any} */ e) => e.navigationProp).join(",");
    if (customEntity && id !== prevExpandId && currentEntityName) {
      prevExpandId = id;
      if (!initializingInProgress) {
        loadData();
      }
    }
  });
</script>

<div class="p-3">
  {#if customEntity}
    <DataView
      entityName={customEntity.name}
      bind:data
      {customEntity}
      bind:expands
      bind:fieldNames
      bind:rootQuery
      bind:page
      bind:pageSize
      bind:totalCount
      bind:orderBy
      bind:aggregates
      onSortChange={handleSort}
      onRefresh={handleRefresh}
      onFiltersDone={handleFiltersDone}
      editBaseUrl={`/app/${$pageStore.params.appId}/${customEntity.name}`}
    />
  {:else}
    <div class="d-flex justify-content-center align-items-center h-100">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  {/if}
</div>
