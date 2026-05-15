<script>
  import { onMount } from "svelte";

  /**
   * @typedef {Object} ColumnDef
   * @property {string} id
   * @property {'field' | 'expand' | 'aggregate'} type
   * @property {string} label
   * @property {string} [fieldName]
   * @property {any} [field]
   * @property {string} [navigationProp]
   * @property {string} [targetEntityName]
   * @property {boolean} [isNameField]
   * @property {string} [lookupEntityName]
   * @property {string} [lookupNavProp]
   * @property {string} [optionSetDefId]
   * @property {boolean} [isSelect]
   * @property {boolean} [isMultiSelect]
   * @property {boolean} [isDateTime]
   * @property {boolean} [isDateOnly]
   * @property {boolean} [isTimeOnly]
   * @property {string} [collectionNavProp]
   * @property {string} [sourceField]
   * @property {string} [aggregateFn]
   */

  let {
    columns = [],
    data = [],
    entityName = "",
    optionSetDefs = [],
    settings = { timezone: "" },
    orderBy = "createdon desc",
    onSortChange = null,
    editBaseUrl = "",
  } = $props();

  /** @type {string} */
  let sortField = $state("");
  /** @type {string} */
  let sortDir = $state("asc");

  $effect(() => {
    const parts = orderBy?.split(" ") || [];
    sortField = parts[0] || "";
    sortDir = parts[1] || "asc";
  });

  /** @param {any} col */
  function handleSort(col) {
    if (col.type !== "field") return;
    const fieldName = col.fieldName;
    if (!fieldName) return;
    if (col.isMultiSelect) return;
    if (sortField === fieldName) {
      sortDir = sortDir === "asc" ? "desc" : "asc";
    } else {
      sortField = fieldName;
      sortDir = "asc";
    }
    onSortChange?.(`${sortField} ${sortDir}`);
  }

  /** @param {string | Date} value
   *  @param {'datetime' | 'date' | 'time'} type
   *  @returns {string} */
  function formatDateValue(value, type) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);

    const tz =
      settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      if (type === "time") {
        return new Intl.DateTimeFormat(undefined, {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(d);
      }
      if (type === "date") {
        return new Intl.DateTimeFormat(undefined, {
          timeZone: tz,
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(d);
      }
      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return String(value);
    }
  }

  /** @param {ColumnDef} col
   *  @param {any} row
   *  @returns {{ display: string, href: string | null }} */
  function resolveCell(col, row) {
    const raw =
      col.type === "expand" && col.navigationProp
        ? row[col.navigationProp]?.[col.fieldName ?? ""]
        : row[col.fieldName ?? ""];

    if (raw === null || raw === undefined) {
      if (
        col.type === "aggregate" &&
        col.collectionNavProp &&
        col.sourceField
      ) {
        const children = row[col.collectionNavProp];
        if (!children || !Array.isArray(children) || children.length === 0)
          return { display: "0", href: null };
        const values = children
          .map((/** @type {any} */ c) => Number(c[col.sourceField ?? ""]))
          .filter((/** @type {any} */ v) => !isNaN(v));
        if (values.length === 0) return { display: "0", href: null };
        let result = 0;
        switch (col.aggregateFn) {
          case "sum":
            result = values.reduce(
              (/** @type {number} */ a, /** @type {number} */ b) => a + b,
              0,
            );
            break;
          case "avg":
            result =
              values.reduce(
                (/** @type {number} */ a, /** @type {number} */ b) => a + b,
                0,
              ) / values.length;
            break;
          case "count":
            result = values.length;
            break;
          case "min":
            result = Math.min(...values);
            break;
          case "max":
            result = Math.max(...values);
            break;
        }
        return {
          display: Number.isInteger(result)
            ? String(result)
            : result.toFixed(2),
          href: null,
        };
      }
      return { display: "", href: null };
    }

    if (col.optionSetDefId) {
      const def = optionSetDefs.find(
        (/** @type {any} */ s) => s.id === col.optionSetDefId,
      );
      if (def?.options) {
        const opt = def.options.find(
          (/** @type {any} */ o) => String(o.value) === String(raw),
        );
        if (opt) return { display: opt.name, href: null };
      }
    }

    if (col.isSelect && Array.isArray(raw)) {
      const names = raw.map((/** @type {any} */ v) => {
        const def = optionSetDefs.find(
          (/** @type {any} */ s) => s.id === col.optionSetDefId,
        );
        const opt = def?.options?.find(
          (/** @type {any} */ o) => String(o.value) === String(v),
        );
        return opt ? opt.name : v;
      });
      return { display: names.join(", "), href: null };
    }

    if (col.lookupNavProp && col.type === "field") {
      const navProp = col.lookupNavProp;
      const displayName = row[navProp]?.Name ?? row[navProp]?.name;
      if (displayName) {
        const entityId = raw;
        return {
          display: displayName,
          href: `/Open?entity=${col.lookupEntityName}&id=${entityId}`,
        };
      }
      if (raw) {
        return {
          display: raw.slice(0, 8) + "...",
          href: `/Open?entity=${col.lookupEntityName}&id=${raw}`,
        };
      }
    }

    if (col.type === "expand" && col.navigationProp && raw) {
      const fieldIsName = col.fieldName === "name" || col.fieldName === "Name";
      if (fieldIsName) {
        const parentId =
          row[col.navigationProp]?.id || row[col.navigationProp]?.Id;
        if (parentId) {
          return {
            display: String(raw),
            href: `/Open?entity=${col.targetEntityName || col.navigationProp}&id=${parentId}`,
          };
        }
      }
    }

    if (col.isNameField && raw) {
      const rowId = row.id || row.Id;
      if (rowId) {
        const href = editBaseUrl
          ? `${editBaseUrl}/edit/${rowId}`
          : `/Open?entity=${entityName}&id=${rowId}`;
        return { display: String(raw), href };
      }
    }

    if (col.isDateTime)
      return { display: formatDateValue(raw, "datetime"), href: null };
    if (col.isDateOnly)
      return { display: formatDateValue(raw, "date"), href: null };
    if (col.isTimeOnly)
      return { display: formatDateValue(raw, "time"), href: null };

    return { display: String(raw), href: null };
  }
  onMount(() => {
    console.log("Mounted");
    console.table(columns);
  });
</script>

<div class="overflow-x-auto">
  <table class="table">
    <thead>
      <tr>
        {#each columns as col (col.id)}
          <th class="whitespace-nowrap" title={col.id}>
            {#if col.type === "field" && col.fieldName && !col.isMultiSelect}
              <button
                class="btn btn-link btn-sm p-0 text-decoration-none fw-bold"
                onclick={() => handleSort(col)}
              >
                {col.label}
                {#if sortField === col.fieldName}
                  <span class="ms-1">{sortDir === "asc" ? "▲" : "▼"}</span>
                {/if}
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
        <tr>
          <td colspan={columns.length} class="text-center p-4">
            No data available.
          </td>
        </tr>
      {:else}
        {#each data as row}
          <tr>
            {#each columns as col}
              {@const cell = resolveCell(col, row)}
              <td>
                {#if cell.href}
                  <a href={cell.href} class="text-blue-600 hover:underline">
                    {cell.display}
                  </a>
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
</div>
