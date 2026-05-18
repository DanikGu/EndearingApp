import { ConditionGroup } from '../queryBuilder/logic/typeDefinitions';

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

export default ViewDescription;
