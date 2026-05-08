import { success, failure } from './result';

const API_BASE = '/api/odata';

/**
 * @typedef {Object} ODataQueryOptions
 * @property {string} [filter]
 * @property {string[]} [select]
 * @property {string} [expand]
 * @property {number} [top]
 * @property {number} [skip]
 * @property {string} [orderBy]
 */

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
      return failure(new Error(`HTTP ${response.status}: ${response.statusText}${text ? ' — ' + text.slice(0,200) : ''}`));
    }
    const data = await response.json();
    return success(data);
  } catch (err) {
    return failure(/** @type {Error} */ (err));
  }
}

/** @param {string} entityName
 *  @param {ODataQueryOptions} [opts]
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function fetchEntities(entityName, opts = {}) {
  const params = buildParams(opts);
  const qs = params.toString();
  return request(`${API_BASE}/${entityName}${qs ? '?' + qs : ''}`);
}

/** @param {string} entityName
 *  @param {string} id
 *  @param {{ select?: string[], expand?: string }} [opts]
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function fetchEntityById(entityName, id, opts = {}) {
  const params = new URLSearchParams();
  if (opts.select) params.set('$select', opts.select.join(','));
  if (opts.expand) params.set('$expand', opts.expand);
  const qs = params.toString();
  return request(`${API_BASE}/${entityName}(${encodeURIComponent(id)})${qs ? '?' + qs : ''}`);
}

/** @param {string} entityName
 *  @param {string} query
 *  @param {{ select?: string[], top?: number }} [opts]
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function fullTextSearch(entityName, query, opts = {}) {
  const params = new URLSearchParams();
  if (opts.select) params.set('$select', opts.select.join(','));
  if (opts.top) params.set('$top', String(opts.top));
  return request(`${API_BASE}/${entityName}/fullTextSearch/${encodeURIComponent(query)}?${params.toString()}`);
}

/** @param {string} entityName
 *  @param {{ select?: string[], top?: number }} [opts]
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function fetchFirstPage(entityName, opts = {}) {
  const params = new URLSearchParams();
  if (opts.select) params.set('$select', opts.select.join(','));
  if (opts.top) params.set('$top', String(opts.top));
  params.set('$orderby', 'createdon desc');
  return request(`${API_BASE}/${entityName}?${params.toString()}`);
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

/** @param {ODataQueryOptions} opts
 *  @returns {URLSearchParams} */
function buildParams(opts) {
  const params = new URLSearchParams();
  if (opts.filter) params.set('$filter', opts.filter);
  if (opts.select && opts.select.length > 0) params.set('$select', opts.select.join(','));
  if (opts.expand) params.set('$expand', opts.expand);
  if (opts.top) params.set('$top', String(opts.top));
  if (opts.skip) params.set('$skip', String(opts.skip));
  if (opts.orderBy) params.set('$orderby', opts.orderBy);
  return params;
}
