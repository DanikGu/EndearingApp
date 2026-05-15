import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { CustomEntitiesApi, OptionSetDefinitionsApi, SettingsApi, FormApi } from '@apiclients';
import { alertError } from '@utils/uiutils';

/** @typedef {import('../apiclient/src/model/CustomeEntityDTO').default} CustomEntity */
/** @typedef {import('../apiclient/src/model/OptionSetDefinitionDTO').default} OptionSetDefinition */
/** @typedef {import('../apiclient/src/model/FormDTO').default} FormDTO */
/** @typedef {Object<string, {Name: string, Description: string, IsSizeAplicable: boolean}>} TypeConfig */

export const customEntities = writable(/** @type {CustomEntity[]} */([]));
export const customEntitiesLoading = writable(false);
export const customEntitiesError = writable(/** @type {Error | null} */(null));

export const optionSets = writable(/** @type {OptionSetDefinition[]} */([]));
export const optionSetsLoading = writable(false);
export const optionSetsError = writable(/** @type {Error | null} */(null));

export const forms = writable(/** @type {FormDTO[]} */([]));
export const formsLoading = writable(false);
export const formsError = writable(/** @type {Error | null} */(null));

/** @typedef {{ timezone: string }} UserSettings */
export const userSettings = writable(/** @type {UserSettings} */({ timezone: '' }));

export const typeConfig = writable(/** @type {TypeConfig | null} */(null));
export const typeConfigLoading = writable(false);
export const typeConfigError = writable(/** @type {Error | null} */(null));

export const customEntitiesLastFetch = writable(0);
export const optionSetsLastFetch = writable(0);
export const formsLastFetch = writable(0);
export const typeConfigLastFetch = writable(0);

if (browser) {
  userSettings.set({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
}

const CACHE_DURATION = 5 * 60 * 1000;

/**
 * @returns {Promise<CustomEntity[] | null>}
 */
export async function fetchCustomEntities() {
  if (!browser) return null;

  customEntitiesLoading.set(true);
  customEntitiesError.set(null);

  try {
    const api = new CustomEntitiesApi();
    /** @type {CustomEntity[]} */
    const data = await new Promise((resolve, reject) => {
      api.apiCustomEntitiesGet(
        (/** @type {string | null} */ error, /** @type {CustomEntity[]} */ data) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(data);
          }
        }
      );
    });

    customEntities.set(data);
    customEntitiesLastFetch.set(Date.now());
    return data;
  } catch (/** @type {any} */ error) {
    console.error('Failed to fetch custom entities:', error);
    const err = error instanceof Error ? error : new Error(String(error));
    customEntitiesError.set(err);
    alertError(`Failed to load custom entities: ${err.message}`);
    return null;
  } finally {
    customEntitiesLoading.set(false);
  }
}

/**
 * @returns {Promise<OptionSetDefinition[] | null>}
 */
export async function fetchOptionSets() {
  if (!browser) return null;

  optionSetsLoading.set(true);
  optionSetsError.set(null);

  try {
    const api = new OptionSetDefinitionsApi();
    /** @type {OptionSetDefinition[]} */
    const data = await new Promise((resolve, reject) => {
      api.apiOptionSetDefinitionsGet(
        (/** @type {string | null} */ error, /** @type {OptionSetDefinition[]} */ data) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(data);
          }
        }
      );
    });

    optionSets.set(data);
    optionSetsLastFetch.set(Date.now());
    return data;
  } catch (/** @type {any} */ error) {
    console.error('Failed to fetch option sets:', error);
    const err = error instanceof Error ? error : new Error(String(error));
    optionSetsError.set(err);
    alertError(`Failed to load option sets: ${err.message}`);
    return null;
  } finally {
    optionSetsLoading.set(false);
  }
}

/**
 * @returns {Promise<TypeConfig | null>}
 */
export async function fetchTypeConfig() {
  if (!browser) return null;

  typeConfigLoading.set(true);
  typeConfigError.set(null);

  try {
    const api = new SettingsApi();
    /** @type {{jsonSetting: string}} */
    const data = await new Promise((resolve, reject) => {
      api.apiSettingsNameGet('DataBaseTypesDescription',
        (/** @type {string | null} */ error, /** @type {{jsonSetting: string}} */ data) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(data);
          }
        }
      );
    });

    /** @type {TypeConfig} */
    const parsed = JSON.parse(data.jsonSetting);
    typeConfig.set(parsed);
    typeConfigLastFetch.set(Date.now());
    return parsed;
  } catch (/** @type {any} */ error) {
    console.error('Failed to fetch type config:', error);
    const err = error instanceof Error ? error : new Error(String(error));
    typeConfigError.set(err);
    alertError(`Failed to load type configuration: ${err.message}`);
    return null;
  } finally {
    typeConfigLoading.set(false);
  }
}

/**
 * @returns {Promise<CustomEntity[] | null>}
 */
export async function ensureCustomEntities() {
  if (!browser) return null;

  let lastFetch = 0;
  const unsubscribeFetch = customEntitiesLastFetch.subscribe(v => { lastFetch = v; });
  unsubscribeFetch();

  /** @type {CustomEntity[]} */
  let currentEntities = [];
  const unsubscribeEntities = customEntities.subscribe(v => { currentEntities = v; });
  unsubscribeEntities();

  if (currentEntities.length > 0 && (Date.now() - lastFetch) < CACHE_DURATION) {
    return currentEntities;
  }

  return await fetchCustomEntities();
}

/**
 * @returns {Promise<OptionSetDefinition[] | null>}
 */
export async function ensureOptionSets() {
  if (!browser) return null;

  let lastFetch = 0;
  const unsubscribeFetch = optionSetsLastFetch.subscribe(v => { lastFetch = v; });
  unsubscribeFetch();

  /** @type {OptionSetDefinition[]} */
  let currentOptionSets = [];
  const unsubscribeOptionSets = optionSets.subscribe(v => { currentOptionSets = v; });
  unsubscribeOptionSets();

  if (currentOptionSets.length > 0 && (Date.now() - lastFetch) < CACHE_DURATION) {
    return currentOptionSets;
  }

  return await fetchOptionSets();
}

/**
 * @returns {Promise<FormDTO[] | null>}
 */
export async function fetchForms() {
  if (!browser) return null;

  formsLoading.set(true);
  formsError.set(null);

  try {
    const api = new FormApi();
    /** @type {FormDTO[]} */
    const data = await new Promise((resolve, reject) => {
      api.apiFormGet(
        (/** @type {string | null} */ error, /** @type {FormDTO[]} */ data) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(data);
          }
        }
      );
    });

    forms.set(data);
    formsLastFetch.set(Date.now());
    return data;
  } catch (/** @type {any} */ error) {
    console.error('Failed to fetch forms:', error);
    const err = error instanceof Error ? error : new Error(String(error));
    formsError.set(err);
    alertError(`Failed to load forms: ${err.message}`);
    return null;
  } finally {
    formsLoading.set(false);
  }
}

/**
 * @returns {Promise<FormDTO[] | null>}
 */
export async function ensureForms() {
  if (!browser) return null;

  let lastFetch = 0;
  const unsubscribeFetch = formsLastFetch.subscribe(v => { lastFetch = v; });
  unsubscribeFetch();

  /** @type {FormDTO[]} */
  let currentForms = [];
  const unsubscribeForms = forms.subscribe(v => { currentForms = v; });
  unsubscribeForms();

  if (currentForms.length > 0 && (Date.now() - lastFetch) < CACHE_DURATION) {
    return currentForms;
  }

  return await fetchForms();
}

/**
 * @returns {Promise<TypeConfig | null>}
 */
export async function ensureTypeConfig() {
  if (!browser) return null;

  let lastFetch = 0;
  const unsubscribeFetch = typeConfigLastFetch.subscribe(v => { lastFetch = v; });
  unsubscribeFetch();

  /** @type {TypeConfig | null} */
  let currentConfig = null;
  const unsubscribeConfig = typeConfig.subscribe(v => { currentConfig = v; });
  unsubscribeConfig();

  if (currentConfig && (Date.now() - lastFetch) < CACHE_DURATION) {
    return currentConfig;
  }

  return await fetchTypeConfig();
}

export async function getCustomEntities() {
  await ensureCustomEntities();
  return /** @type {CustomEntity[]} */ (get(customEntities));
}

export async function getOptionSets() {
  await ensureOptionSets();
  return /** @type {OptionSetDefinition[]} */ (get(optionSets));
}

export async function getForms() {
  await ensureForms();
  return /** @type {FormDTO[]} */ (get(forms));
}

export async function getTypeConfig() {
  await ensureTypeConfig();
  return /** @type {TypeConfig | null} */ (get(typeConfig));
}

export function getCachedCustomEntities() {
  return /** @type {CustomEntity[]} */ (get(customEntities));
}

export function getCachedOptionSets() {
  return /** @type {OptionSetDefinition[]} */ (get(optionSets));
}

/**
 * @param {number} typeId
 * @returns {string}
 */
export function getTypeName(typeId) {
  const config = get(typeConfig);
  if (!config) return `${typeId}`;
  const typeInfo = config[`${typeId}`];
  return typeInfo ? typeInfo.Name : `${typeId}`;
}

/**
 * @param {string} name
 * @returns {number}
 */
export function getTypeId(name) {
  const config = get(typeConfig);
  if (!config) return -1;
  const entry = Object.entries(config).find(([key, value]) => value.Name === name);
  return entry ? parseInt(entry[0]) : -1;
}

/**
 * @returns {{id: string, name: string, description: string, isSizeApplicable: boolean}[]}
 */
export function getTypesArray() {
  const config = get(typeConfig);
  if (!config) return [];
  return Object.keys(config).map(key => {
    const typeInfo = config[key];
    return {
      id: key,
      name: typeInfo.Name,
      description: typeInfo.Description,
      isSizeApplicable: typeInfo.IsSizeAplicable
    };
  });
}

/**
 * @typedef {Object} ViewDefinition
 * @property {string} id
 * @property {string} name
 * @property {string} displayName
 * @property {string} entityId
 * @property {Object|null} filter
 * @property {string} orderBy
 * @property {string[]} columns
 * @property {number} pageSize
 * @property {{id: string, label: string, collectionNavProp: string, sourceField: string, fn: string}[]} aggregates
 */

/** @type {import('svelte/store').Writable<Record<string, ViewDefinition>>} */
export const views = writable(/** @type {Record<string, ViewDefinition>} */({}));

const VIEWS_STORAGE_KEY = 'endearing_views';

if (browser) {
  try {
    const stored = localStorage.getItem(VIEWS_STORAGE_KEY);
    if (stored) views.set(JSON.parse(stored));
  } catch { /* ignore */ }
  views.subscribe(val => {
    try {
      localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(val));
    } catch { /* ignore */ }
  });
}

const DEFAULT_VIEW_ID = '00000000-0000-0000-0000-000000000000';

/** @param {string} entityName
 *  @returns {ViewDefinition} */
export function getDefaultView(entityName) {
  return {
    id: DEFAULT_VIEW_ID,
    name: 'Default',
    displayName: 'Default View',
    entityId: entityName,
    filter: null,
    orderBy: 'createdon desc',
    columns: [],
    pageSize: 25,
    aggregates: [],
  };
}

/** @param {string} entityName
 *  @returns {ViewDefinition} */
export function getView(entityName) {
  const current = get(views);
  return current[entityName] || getDefaultView(entityName);
}

/** @param {string} entityName
 *  @param {Partial<ViewDefinition>} updates */
export function saveView(entityName, updates) {
  views.update(current => {
    const existing = current[entityName] || getDefaultView(entityName);
    current[entityName] = { ...existing, ...updates };
    return current;
  });
}
