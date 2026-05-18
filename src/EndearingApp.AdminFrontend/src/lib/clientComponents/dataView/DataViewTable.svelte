<script>
  import { getOptionSets, getCachedOptionSets } from "@stores/global";
  import ViewDescription from "./viewDescription.js";

  /** @typedef {import('./viewDescription.js').ColumnDef} ColumnDef */

  let {
    view = $bindable(/** @type {ViewDescription} */ (new ViewDescription())),
    data = [],
    totalCount = 0,
    onSortChange,
    editBaseUrl = "",
    entityName = "",
  } = $props();

  let optionSetDefs = $state(getCachedOptionSets());

  $effect(() => {
    getOptionSets().then((v) => (optionSetDefs = v));
  });

  let sortField = $derived((view.orderBy || "createdon desc").split(" ")[0] || "");
  let sortDir = $derived((view.orderBy || "createdon desc").split(" ")[1] || "asc");
  let tableKey = $state(new Date().toString());
  let orderedColumns = $derived(view.columns || []);

  function handleSort(/** @type {any} */ col) {
    if (!col.fieldName || col.isMultiSelect) return;
    const newDir = sortField === col.fieldName ? (sortDir === "asc" ? "desc" : "asc") : "asc";
    onSortChange?.(`${col.fieldName} ${newDir}`);
  }

  function formatDateValue(/** @type {string | Date} */ value, /** @type {'datetime' | 'date' | 'time'} */ type) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (type === "time") return new Intl.DateTimeFormat(undefined, { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(d);
      if (type === "date") return new Intl.DateTimeFormat(undefined, { timeZone: tz, year: "numeric", month: "short", day: "numeric" }).format(d);
      return new Intl.DateTimeFormat(undefined, { timeZone: tz, year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(d);
    } catch { return String(value); }
  }

  function resolveCell(/** @type {ColumnDef} */ col, /** @type {any} */ row) {
    const raw = col.type === "expand" && col.navigationProp ? row[col.navigationProp]?.[col.fieldName ?? ""] : row[col.fieldName ?? ""];

    if (raw === null || raw === undefined) {
      if (col.type === "aggregate" && col.collectionNavProp && col.sourceField) {
          const children = row[col.collectionNavProp];
          if (!children || !Array.isArray(children) || children.length === 0) return { display: "0", href: null };
          const values = children.map((/** @type {any} */ c) => Number(c[col.sourceField ?? ""])).filter((/** @type {any} */ v) => !isNaN(v));
          if (values.length === 0) return { display: "0", href: null };
          let result = 0;
          switch (col.aggregateFn) {
            case "sum": result = values.reduce((/** @type {number} */ a, /** @type {number} */ b) => a + b, 0); break;
            case "avg": result = values.reduce((/** @type {number} */ a, /** @type {number} */ b) => a + b, 0) / values.length; break;
            case "count": result = values.length; break;
            case "min": result = Math.min(...values); break;
            case "max": result = Math.max(...values); break;
          }
          return { display: Number.isInteger(result) ? String(result) : result.toFixed(2), href: null };
      }
      return { display: "", href: null };
    }

    if (col.optionSetDefId) {
      const def = optionSetDefs.find((/** @type {any} */ s) => s.id === col.optionSetDefId);
      if (def?.options) { const opt = def.options.find((/** @type {any} */ o) => String(o.value) === String(raw)); if (opt) return { display: opt.name, href: null }; }
    }
    if (col.isSelect && Array.isArray(raw)) {
      const names = raw.map((/** @type {any} */ v) => {
        const def = optionSetDefs.find((/** @type {any} */ s) => s.id === col.optionSetDefId);
        const opt = def?.options?.find((/** @type {any} */ o) => String(o.value) === String(v));
        return opt ? opt.name : v;
      });
      return { display: names.join(", "), href: null };
    }
    if (col.lookupNavProp && col.type === "field") {
      const displayName = row[col.lookupNavProp]?.Name ?? row[col.lookupNavProp]?.name;
      if (displayName) return { display: displayName, href: `/Open?entity=${col.lookupEntityName}&id=${raw}` };
      if (raw) return { display: raw.slice(0, 8) + "...", href: `/Open?entity=${col.lookupEntityName}&id=${raw}` };
    }
    if (col.type === "expand" && col.navigationProp && raw) {
      const fieldIsName = col.fieldName === "name" || col.fieldName === "Name";
      if (fieldIsName) {
        const parentId = row[col.navigationProp]?.id || row[col.navigationProp]?.Id;
        if (parentId) return { display: String(raw), href: `/Open?entity=${col.targetEntityName || col.navigationProp}&id=${parentId}` };
      }
    }
    if (col.isNameField && raw) {
      const rowId = row.id || row.Id;
      if (rowId) return { display: String(raw), href: editBaseUrl ? `${editBaseUrl}/edit/${rowId}` : `/Open?entity=${entityName}&id=${rowId}` };
    }
    if (col.isDateTime) return { display: formatDateValue(raw, "datetime"), href: null };
    if (col.isDateOnly) return { display: formatDateValue(raw, "date"), href: null };
    if (col.isTimeOnly) return { display: formatDateValue(raw, "time"), href: null };
    return { display: String(raw), href: null };
  }
</script>

<div class="overflow-x-auto">
  {#key tableKey}
    <table class="table">
      <thead>
        <tr>
          {#each orderedColumns as col (col.id)}
            <th class="whitespace-nowrap" title={col.id}>
              {#if col.type === "field" && col.fieldName && !col.isMultiSelect}
                <button class="btn btn-link btn-sm p-0 text-decoration-none fw-bold" onclick={() => handleSort(col)}>
                  {col.label}
                  {#if sortField === col.fieldName}<span class="ms-1">{sortDir === "asc" ? "▲" : "▼"}</span>{/if}
                </button>
              {:else}
                {col.label}
              {/if}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#if data.length === 0}
          <tr><td colspan={orderedColumns.length} class="text-center p-4">No data available.</td></tr>
        {:else}
          {#each data as row (row.id || row.Id)}
            <tr>
              {#each orderedColumns as col (col.id)}
                {@const cell = resolveCell(col, row)}
                <td>
                  {#if cell.href}
                    <a href={cell.href} class="text-blue-600 hover:underline">{cell.display}</a>
                  {:else}
                    {cell.display}
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  {/key}
</div>
