/**
 * @template T
 * @typedef {Object} ApiResult
 * @property {T | null} data
 * @property {Error | null} error
 */

/** @template T
 *  @param {T} data
 *  @returns {ApiResult<T>} */
export function success(data) {
  return { data, error: null };
}

/** @param {Error | string} err
 *  @returns {ApiResult<null>} */
export function failure(err) {
  const error = err instanceof Error ? err : new Error(String(err));
  return { data: null, error };
}
