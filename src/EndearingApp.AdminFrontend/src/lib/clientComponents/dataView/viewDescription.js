import { ConditionGroup, Condition } from '../queryBuilder/logic/typeDefinitions';
import { convertToOdataFilter } from '../queryBuilder/logic/queryToOdataUrlParams';

/**
 * @typedef {'field' | 'expand' | 'aggregate'} ColumnType
 *
 * @typedef {Object} ColumnDef
 * @property {string} id
 * @property {ColumnType} type
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
 *
 * @typedef {Object} AggregateDef
 * @property {string} id
 * @property {string} label
 * @property {string} collectionNavProp
 * @property {string} sourceField
 * @property {string} fn
 */

/**
 * Serializable view description that fully describes a data grid view:
 * entity, columns, aggregates, filters, sorting, paging.
 */
export class ViewDescription {
  /** @type {string} */
  entityId = '';

  /** @type {ColumnDef[]} */
  columns = [];

  /** @type {AggregateDef[]} */
  aggregates = [];

  /** @type {ConditionGroup | null} */
  filter = null;

  /** @type {string} */
  orderBy = 'createdon desc';

  /** @type {number} */
  pageSize = 25;

  /**
   * @param {Partial<ViewDescription>} [init]
   */
  constructor(init) {
    if (init) Object.assign(this, init);
  }

  /**
   * Serialize to a plain JSON object (filter is NOT a ConditionGroup but a plain object).
   * @returns {any}
   */
  toJSON() {
    return {
      entityId: this.entityId,
      columns: this.columns,
      aggregates: this.aggregates,
      filter: this.filter ? JSON.parse(JSON.stringify(this.filter)) : null,
      orderBy: this.orderBy,
      pageSize: this.pageSize,
    };
  }

  /**
   * Restore from a plain JSON object.
   * @param {any} json
   * @returns {ViewDescription}
   */
  static fromJSON(json) {
    const vd = new ViewDescription();
    vd.entityId = json.entityId || '';
    vd.columns = Array.isArray(json.columns) ? json.columns : [];
    vd.aggregates = Array.isArray(json.aggregates) ? json.aggregates : [];
    vd.filter = json.filter || null;
    vd.orderBy = json.orderBy || 'createdon desc';
    vd.pageSize = json.pageSize || 25;
    return vd;
  }

  /**
   * Build OData query options from this view descriptor.
   * @param {number} page - Current page number (1-based)
   * @returns {{ top: number, skip: number, orderBy?: string, count: boolean, filter?: string, select?: string[], expand?: Record<string, { select: string[] }> }}
   */
  buildQueryOptions(page) {
    /** @type {{ top: number, skip: number, orderBy?: string, count: boolean, filter?: string, select?: string[], expand?: Record<string, { select: string[] }> }} */
    const opts = {
      top: this.pageSize,
      skip: this.pageSize * (page - 1),
      count: true,
      orderBy: this.orderBy,
    };

    const revivedFilter = reviveConditionGroup(this.filter);
    const filterStr = convertToOdataFilter(revivedFilter);
    if (filterStr) opts.filter = filterStr;

    const selectFields = (this.columns || [])
      .filter(/** @type {any} */(c) => c.type === 'field' && c.fieldName)
      .map(/** @type {any} */(c) => /** @type {string} */(c.fieldName));
    if (selectFields.length > 0) {
      if (!selectFields.includes('Id')) selectFields.push('Id');
      opts.select = selectFields;
    }

    const expandObj = buildExpandsFromColumns(this.columns || [], this.aggregates || []);
    if (Object.keys(expandObj).length > 0) opts.expand = expandObj;

    return opts;
  }

  /**
   * Derive field names from columns.
   * @returns {string[]}
   */
  get fieldNames() {
    return (this.columns || [])
      .filter(/** @type {any} */(c) => c.type === 'field' && c.fieldName)
      .map(/** @type {any} */(c) => /** @type {string} */(c.fieldName));
  }

  /**
   * Validate the view description.
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validate() {
    const errors = [];

    if (!this.entityId) errors.push('entityId is required');

    if (!Array.isArray(this.columns)) errors.push('columns must be an array');

    if (!Array.isArray(this.aggregates)) errors.push('aggregates must be an array');

    if (this.pageSize < 1) errors.push('pageSize must be >= 1');

    if (this.filter) {
      const seen = new Set();
      this._validateFilter(this.filter, errors, seen);
    }

    // Check for duplicate column IDs
    if (Array.isArray(this.columns)) {
      const colIds = new Set();
      for (const col of this.columns) {
        if (colIds.has(col.id)) errors.push(`Duplicate column id: ${col.id}`);
        colIds.add(col.id);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * @param {any} node
   * @param {string[]} errors
   * @param {Set<any>} seen
   */
  _validateFilter(node, errors, seen) {
    if (!node || seen.has(node)) return;
    seen.add(node);

    if (node.operator && Array.isArray(node.children)) {
      // ConditionGroup
      if (node.operator !== 'and' && node.operator !== 'or') {
        errors.push(`Invalid filter operator: ${node.operator}`);
      }
      for (const child of node.children) {
        this._validateFilter(child, errors, seen);
      }
    } else if (node.field && node.operation) {
      // Condition
      if (!node.field) errors.push('Filter condition missing field');
      if (!node.operation) errors.push(`Filter condition on "${node.field}" missing operation`);
    }
  }
}

/** @param {any} obj @returns {ConditionGroup} */
function reviveConditionGroup(obj) {
  if (!obj || typeof obj !== "object") return new ConditionGroup("and", []);
  if (obj.children && Array.isArray(obj.children) && (obj.operator === "and" || obj.operator === "or")) {
    const group = new ConditionGroup(obj.operator, []);
    group.children = obj.children.map((/** @type {any} */ child) => {
      if (child && child.children && Array.isArray(child.children) && (child.operator === "and" || child.operator === "or")) {
        return reviveConditionGroup(child);
      }
      if (child && typeof child.field === "string" && typeof child.operation === "string") {
        return new Condition(child.field, child.operation, child.value, child.fieldDto || null);
      }
      return child;
    });
    return group;
  }
  return new ConditionGroup("and", []);
}

/**
 * @param {import('./viewDescription.js').ColumnDef[]} columns
 * @param {import('./viewDescription.js').AggregateDef[]} aggregates
 * @returns {Record<string, { select: string[] }>}
 */
function buildExpandsFromColumns(columns, aggregates) {
  /** @type {Record<string, { navigationProp: string, select: string[] }>} */
  const expandMap = {};
  for (const col of columns) {
    if (col.type === "expand" && col.navigationProp && col.fieldName) {
      if (!expandMap[col.navigationProp]) expandMap[col.navigationProp] = { navigationProp: col.navigationProp, select: [] };
      if (!expandMap[col.navigationProp].select.includes(col.fieldName)) expandMap[col.navigationProp].select.push(col.fieldName);
    }
    if (col.type === "field" && col.lookupNavProp) {
      if (!expandMap[col.lookupNavProp]) expandMap[col.lookupNavProp] = { navigationProp: col.lookupNavProp, select: ["Id", "Name"] };
    }
    if (col.type === "aggregate" && col.collectionNavProp && col.sourceField) {
      if (!expandMap[col.collectionNavProp]) expandMap[col.collectionNavProp] = { navigationProp: col.collectionNavProp, select: [] };
      if (!expandMap[col.collectionNavProp].select.includes(col.sourceField)) expandMap[col.collectionNavProp].select.push(col.sourceField);
    }
  }
  /** @type {Record<string, { select: string[] }>} */
  const result = {};
  for (const ex of Object.values(expandMap)) {
    result[ex.navigationProp] = { select: ex.select };
  }
  return result;
}

export default ViewDescription;
