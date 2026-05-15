import { success, failure } from './result';
import buildQuery from 'odata-query';

const API_BASE = '/api/odata';

/**
 * @typedef {Object} ODataQueryOptions
 * @property {Object|string} [filter] - Structured filter object or raw OData filter string
 * @property {string[]} [select]
 * @property {string|Object|string[]} [expand]
 * @property {number} [top]
 * @property {number} [skip]
 * @property {string|string[]} [orderBy]
 * @property {boolean} [count] - Include @odata.count in response
 * @property {Object|Object[]} [transform] - OData $apply transform (aggregate, groupBy, filter)
 */

/**
 * Builds OData query string from structured options using odata-query's buildQuery.
 * @param {ODataQueryOptions} opts
 * @returns {string} Query string starting with '?' or empty string
 */
function buildQueryString(/** @type {ODataQueryOptions} */ opts) {
  /** @type {Record<string, any>} */
  const queryObj = {};

  if (opts.filter) queryObj.filter = opts.filter;
  if (opts.select && opts.select.length > 0) queryObj.select = opts.select;
  if (opts.expand) queryObj.expand = opts.expand;
  if (opts.top != null) queryObj.top = opts.top;
  if (opts.skip != null) queryObj.skip = opts.skip;
  if (opts.orderBy) queryObj.orderBy = opts.orderBy;
  if (opts.count) queryObj.count = true;
  if (/** @type {any} */ (opts).transform) queryObj.transform = /** @type {any} */ (opts).transform;

  return buildQuery(queryObj);
}

/**
 * Builds a full OData URL for a given entity with query options
 * @param {string} entityName
 * @param {ODataQueryOptions} [opts]
 * @returns {string}
 */
export function buildODataUrl(entityName, opts = {}) {
  return `${API_BASE}/${entityName}${buildQueryString(opts)}`;
}

/** @param {string} url
 *  @param {{ method?: string, body?: any, headers?: Record<string,string> }} [options]
 *  @returns {Promise<import('./result').ApiResult<any>>} */
async function request(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return failure(new Error(`HTTP ${response.status}: ${response.statusText}${text ? ' — ' + text.slice(0, 200) : ''}`));
    }
    const text = await response.text();
    if (!text) return success(null);
    try {
      return success(JSON.parse(text));
    } catch {
      return success(text);
    }
  } catch (err) {
    return failure(/** @type {Error} */(err));
  }
}

/** @param {string} entityName
 *  @param {ODataQueryOptions} [opts]
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function fetchEntities(entityName, opts = {}) {
  return request(buildODataUrl(entityName, opts));
}

/** @param {string} entityName
 *  @param {string} id
 *  @param {{ select?: string[], expand?: string|Object }} [opts]
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function fetchEntityById(entityName, id, opts = {}) {
  /** @type {Record<string, any>} */
  const queryObj = {};
  if (opts.select && opts.select.length > 0) queryObj.select = opts.select;
  if (opts.expand) queryObj.expand = opts.expand;
  const qs = buildQuery(queryObj);
  return request(`${API_BASE}/${entityName}(${encodeURIComponent(id)})${qs}`);
}

/** @param {string} entityName
 *  @param {string} query
 *  @param {{ select?: string[], top?: number }} [opts]
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function fullTextSearch(entityName, query, opts = {}) {
  /** @type {Record<string, any>} */
  const queryObj = {};
  if (opts.select && opts.select.length > 0) queryObj.select = opts.select;
  if (opts.top) queryObj.top = opts.top;
  return request(`${API_BASE}/${entityName}/fullTextSearch/${encodeURIComponent(query)}${buildQuery(queryObj)}`);
}

/** @param {string} entityName
 *  @param {{ select?: string[], top?: number }} [opts]
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function fetchFirstPage(entityName, opts = {}) {
  /** @type {Record<string, any>} */
  const queryObj = { orderBy: 'createdon desc' };
  if (opts.select && opts.select.length > 0) queryObj.select = opts.select;
  if (opts.top) queryObj.top = opts.top;
  return request(`${API_BASE}/${entityName}${buildQuery(queryObj)}`);
}

/** @param {string} entityName
 *  @param {Object} data
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function createEntity(entityName, data) {
  return request(`${API_BASE}/${entityName}`, { method: 'POST', body: data });
}

/** @param {string} entityName
 *  @param {string} id
 *  @param {Object} data
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function updateEntity(entityName, id, data) {
  return request(`${API_BASE}/${entityName}(${encodeURIComponent(id)})`, { method: 'PATCH', body: data });
}

/** @param {string} entityName
 *  @param {string} id
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function deleteEntity(entityName, id) {
  return request(`${API_BASE}/${entityName}(${encodeURIComponent(id)})`, { method: 'DELETE' });
}
