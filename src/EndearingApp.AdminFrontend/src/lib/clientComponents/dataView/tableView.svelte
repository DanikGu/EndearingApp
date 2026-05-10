<script>
  import { ResizableColumns } from "svelte-resizable-columns";
  import { getTypeId } from "@utils/fieldtypesutils";

  const resizeAction = /** @type {any} */ (ResizableColumns);

  /**
   * @typedef {Object} ColumnDef
   * @property {string} id
   * @property {'field' | 'expand'} type
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
   * @property {boolean} [isDateTime]
   * @property {boolean} [isDateOnly]
   * @property {boolean} [isTimeOnly]
   */

  let { columns = [], data = [], entityName = '', optionSetDefs = [], settings = { timezone: '' } } = $props();

  /** @param {string | Date} value
   *  @param {'datetime' | 'date' | 'time'} type
   *  @returns {string} */
  function formatDateValue(value, type) {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);

    const tz = settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      if (type === 'time') {
        return new Intl.DateTimeFormat(undefined, {
          timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit',
        }).format(d);
      }
      if (type === 'date') {
        return new Intl.DateTimeFormat(undefined, {
          timeZone: tz, year: 'numeric', month: 'short', day: 'numeric',
        }).format(d);
      }
      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz, year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }).format(d);
    } catch {
      return String(value);
    }
  }

  /** @param {ColumnDef} col
   *  @param {any} row
   *  @returns {{ display: string, href: string | null }} */
  function resolveCell(col, row) {
    const raw = col.type === 'expand' && col.navigationProp
      ? row[col.navigationProp]?.[col.fieldName ?? '']
      : row[col.fieldName ?? ''];

    if (raw === null || raw === undefined) return { display: '', href: null };

    if (col.optionSetDefId) {
      const def = optionSetDefs.find((/** @type {any} */ s) => s.id === col.optionSetDefId);
      if (def?.options) {
        const opt = def.options.find((/** @type {any} */ o) => String(o.value) === String(raw));
        if (opt) return { display: opt.name, href: null };
      }
    }

    if (col.isSelect && Array.isArray(raw)) {
      const names = raw.map((/** @type {any} */ v) => {
        const def = optionSetDefs.find((/** @type {any} */ s) => s.id === col.optionSetDefId);
        const opt = def?.options?.find((/** @type {any} */ o) => String(o.value) === String(v));
        return opt ? opt.name : v;
      });
      return { display: names.join(', '), href: null };
    }

    if (col.lookupNavProp && col.type === 'field') {
      const navProp = col.lookupNavProp;
      const displayName = row[navProp]?.Name ?? row[navProp]?.name;
      if (displayName) {
        const entityId = raw;
        return { display: displayName, href: `/Open?entity=${col.lookupEntityName}&id=${entityId}` };
      }
      if (raw) {
        return { display: raw.slice(0, 8) + '...', href: `/Open?entity=${col.lookupEntityName}&id=${raw}` };
      }
    }

    if (col.type === 'expand' && col.navigationProp && raw) {
      const fieldIsName = col.fieldName === 'name' || col.fieldName === 'Name';
      if (fieldIsName) {
        const parentId = row[col.navigationProp]?.id || row[col.navigationProp]?.Id;
        if (parentId) {
          return { display: String(raw), href: `/Open?entity=${col.targetEntityName || col.navigationProp}&id=${parentId}` };
        }
      }
    }

    if (col.isNameField && raw) {
      const rowId = row.id || row.Id;
      if (rowId) {
        return { display: String(raw), href: `/Open?entity=${entityName}&id=${rowId}` };
      }
    }

    if (col.isDateTime) return { display: formatDateValue(raw, 'datetime'), href: null };
    if (col.isDateOnly) return { display: formatDateValue(raw, 'date'), href: null };
    if (col.isTimeOnly) return { display: formatDateValue(raw, 'time'), href: null };

    return { display: String(raw), href: null };
  }
</script>

<div class="overflow-x-auto">
  <table class="table" use:resizeAction>
    <thead>
      <tr>
        {#each columns as col (col.id)}
          <th class="whitespace-nowrap" title={col.id}>
            {col.label}
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
