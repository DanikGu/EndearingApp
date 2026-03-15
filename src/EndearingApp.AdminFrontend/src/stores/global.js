import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { CustomEntitiesApi, OptionSetDefinitionsApi, SettingsApi } from '@apiclients';
import { alertError } from '@utils/uiutils';

// Type definitions
/** @typedef {import('../apiclient/src/model/CustomeEntityDTO').default} CustomEntity */
/** @typedef {import('../apiclient/src/model/OptionSetDefinitionDTO').default} OptionSetDefinition */
/** @typedef {Object<string, {Name: string, Description: string, IsSizeAplicable: boolean}>} TypeConfig */

// Custom Entities store with loading/error states
export const customEntities = writable(/** @type {CustomEntity[]} */ ([]));
export const customEntitiesLoading = writable(false);
export const customEntitiesError = writable(/** @type {Error | null} */ (null));

// Option Sets store
export const optionSets = writable(/** @type {OptionSetDefinition[]} */ ([]));
export const optionSetsLoading = writable(false);
export const optionSetsError = writable(/** @type {Error | null} */ (null));

// Type Config store (replaces window.endearing_app.typeConfig)
export const typeConfig = writable(/** @type {TypeConfig | null} */ (null));
export const typeConfigLoading = writable(false);
export const typeConfigError = writable(/** @type {Error | null} */ (null));

// Cache timestamps to avoid refetching too frequently
export const customEntitiesLastFetch = writable(0);
export const optionSetsLastFetch = writable(0);
export const typeConfigLastFetch = writable(0);

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Fetch custom entities from API and update store
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
 * Fetch option sets from API and update store
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
 * Fetch type config from API and update store
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
 * Ensure custom entities are loaded (check cache first)
 * @returns {Promise<CustomEntity[] | null>}
 */
export async function ensureCustomEntities() {
    if (!browser) return null;
    
    // Check cache
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
 * Ensure option sets are loaded (check cache first)
 * @returns {Promise<OptionSetDefinition[] | null>}
 */
export async function ensureOptionSets() {
    if (!browser) return null;
    
    // Check cache
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
 * Ensure type config is loaded (check cache first) - replaces ensureTypeConfig from fieldtypesutils.js
 * @returns {Promise<TypeConfig | null>}
 */
export async function ensureTypeConfig() {
    if (!browser) return null;
    
    // Check cache
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

/**
 * Get type name from type ID using store
 * @param {number} typeId
 * @returns {string}
 */
export function getTypeName(typeId) {
    /** @type {TypeConfig | null} */
    let config = null;
    const unsubscribe = typeConfig.subscribe(v => { config = v; });
    unsubscribe();
    
    if (!config) {
        return `${typeId}`;
    }
    
    // config is not null here
    const configNotNull = /** @type {TypeConfig} */ (config);
    /** @type {{Name: string, Description: string, IsSizeAplicable: boolean} | undefined} */
    const typeInfo = configNotNull[`${typeId}`];
    return typeInfo ? typeInfo.Name : `${typeId}`;
}

/**
 * Get type ID from type name using store
 * @param {string} name
 * @returns {number}
 */
export function getTypeId(name) {
    /** @type {TypeConfig | null} */
    let config = null;
    const unsubscribe = typeConfig.subscribe(v => { config = v; });
    unsubscribe();
    
    if (!config) {
        return -1;
    }
    
    const entry = Object.entries(config).find(([key, value]) => value.Name === name);
    return entry ? parseInt(entry[0]) : -1;
}

/**
 * Get types as array using store
 * @returns {{id: string, name: string, description: string, isSizeApplicable: boolean}[]}
 */
export function getTypesArray() {
    /** @type {TypeConfig | null} */
    let config = null;
    const unsubscribe = typeConfig.subscribe(v => { config = v; });
    unsubscribe();
    
    if (!config) {
        return [];
    }
    
    // config is not null here due to check above
    const configNotNull = config;
    return Object.keys(configNotNull).map(key => {
        /** @type {{Name: string, Description: string, IsSizeAplicable: boolean}} */
        const typeInfo = configNotNull[key];
        return {
            id: key,
            name: typeInfo.Name,
            description: typeInfo.Description,
            isSizeApplicable: typeInfo.IsSizeAplicable
        };
    });
}