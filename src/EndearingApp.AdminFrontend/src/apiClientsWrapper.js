import { ActionApi, CustomEntitiesApi, FieldDto, FieldsApi, RelationshipsApi } from "@apiclients/src";
import { alertError, alertSuccsess } from "@utils/uiutils";

/** @typedef {import('../src/apiclient/src/model/CustomeEntityDTO').default} CustomEntity */
/** @typedef {import('../src/apiclient/src/model/FieldDto').default} FieldEntity */
/** @typedef {import('../src/apiclient/src/model/RelationshipDTO').default} RelationshipDTO  */

/**
 * Represents an API error with structured details
 * @typedef {Object} ApiError
 * @property {string} message - Human readable error message
 * @property {number} [status] - HTTP status code
 * @property {any} [body] - Parsed error response body, if any
 * @property {string} [rawError] - Original error string from API client
 */

/**
 * Wrap an API callback to return a promise with structured error handling
 * @template T
 * @param {function(function(string, T, any): void): void} apiCall - API function that accepts a callback
 * @returns {Promise<[T | null, ApiError | null]>} Promise resolving to [data, error]
 */
function callApi(apiCall) {
    return new Promise((resolve) => {
        /** 
         * @param {string | null} error 
         * @param {T} data 
         * @param {any} response 
         */
        const callback = (error, data, response) => {
            try {
                if (error) {
                    /** @type {ApiError} */
                    let apiError = {
                        message: error,
                        rawError: error
                    };
                    
                    // Try to extract status from response
                    if (response && response.status) {
                        apiError.status = response.status;
                    }
                    
                    // Try to parse error response body if available
                    if (response && response.body) {
                        apiError.body = response.body;
                        // If body has a message property, use it
                        if (response.body.message || response.body.title) {
                            apiError.message = response.body.message || response.body.title || error;
                        }
                    } else if (response && response.text) {
                        // Try to parse JSON error text
                        try {
                            const parsed = JSON.parse(response.text);
                            apiError.body = parsed;
                            if (parsed.message || parsed.title) {
                                apiError.message = parsed.message || parsed.title || error;
                            }
                        } catch {
                            // Not JSON, keep raw error
                        }
                    }
                    
                    resolve([null, apiError]);
                } else {
                    resolve([data, null]);
                }
            } catch (exception) {
                /** @type {ApiError} */
                const apiError = {
                    message: String(exception),
                    rawError: String(exception)
                };
                resolve([null, apiError]);
            }
        };
        
        try {
            apiCall(callback);
        } catch (exception) {
            /** @type {ApiError} */
            const apiError = {
                message: String(exception),
                rawError: String(exception)
            };
            resolve([null, apiError]);
        }
    });
}

/**
 * Apply database structure changes
 * @returns {Promise<[boolean, ApiError | null]>} A promise that resolves with a tuple:
 * - The first element is a boolean indicating success.
 * - The second element is an ApiError object or null.
 */
const applyChangesToDbApi = () => {
    return new Promise(async (resolve) => {
        const api = new ActionApi();
        const [data, error] = await callApi((cb) => api.apiActionUpdateDbStructurePost(cb));
        
        if (error) {
            alertError("Db Update Failed");
            resolve([false, error]);
        } else {
            alertSuccsess("Db Structure Update Successfully");
            resolve([true, null]);
        }
    });
};

/**
 * Wrapper function for saving a custom entity via the API.
 *
 * @param {boolean} isNew - Indicates if the custom entity is new.
 * @param {CustomEntity} customEntity - The custom entity data.
 * @returns {Promise<[CustomEntity | null, ApiError | null]>} A promise that resolves to the saved entity or error.
 */
const saveCustomEntityApi = (isNew, customEntity) => {
    return new Promise(async (resolve) => {
        try {
            const api = new CustomEntitiesApi();
            let result;
            
            if (isNew) {
                const newEntity = {
                    Name: customEntity.name,
                    DisplayName: customEntity.displayName,
                    Description: customEntity.description,
                };
                [result] = await callApi((cb) => api.apiCustomEntitiesPost({ body: newEntity }, cb));
            } else {
                [result] = await callApi((cb) => api.apiCustomEntitiesIdPut(customEntity.id, { body: customEntity }, cb));
            }
            
            if (result) {
                alertSuccsess("Success while saving custom entity.");
                resolve([result, null]);
            } else {
                // Should have error from callApi
                alertError("Error while saving custom entity. Changes didn't apply.");
                resolve([null, { message: "Unknown error" }]);
            }
        } catch (/** @type {any} */ exception) {
            /** @type {ApiError} */
            const error = {
                message: String(exception),
                rawError: String(exception)
            };
            alertError("Error while saving custom entity. Changes didn't apply.");
            resolve([null, error]);
        }
    });
};

/**
 * Wrapper function for deleting a custom entity via the API.
 *
 * @param {CustomEntity} customEntity - The custom entity data.
 * @returns {Promise<[boolean, ApiError | null]>} A promise that resolves to true if successful.
 */
const deleteCustomEntityApi = (customEntity) => {
    return new Promise(async (resolve) => {
        try {
            const api = new CustomEntitiesApi();
            const [, error] = await callApi((cb) => api.apiCustomEntitiesIdDelete(customEntity.id, cb));
            
            if (error) {
                alertError("Error while deleting custom entity. Changes didn't apply.");
                resolve([false, error]);
            } else {
                alertSuccsess("Success while deleting custom entity.");
                resolve([true, null]);
            }
        } catch (/** @type {any} */ exception) {
            /** @type {ApiError} */
            const error = {
                message: String(exception),
                rawError: String(exception)
            };
            alertError("Error while deleting custom entity. Changes didn't apply.");
            resolve([false, error]);
        }
    });
};

/**
 * Wrapper function for saving a relationship via the API.
 *
 * @param {RelationshipDTO} editedRelationship - The relationship data to be saved.
 * @param {CustomEntity} customEntity - The custom entity data.
 * @returns {Promise<[boolean, ApiError | null]>} A promise that resolves with a tuple: [result, error].
 */
const saveRelationshipApi = (editedRelationship, customEntity) => {
    return new Promise(async (resolve) => {
        try {
            const api = new RelationshipsApi();
            // @ts-ignore
            editedRelationship.CustomEntityId = customEntity.id;
            const [, error] = await callApi((cb) => api.apiRelationshipsPost({ body: editedRelationship }, cb));
            
            if (error) {
                alertError("Error while saving field. Changes didn't apply");
                resolve([false, error]);
            } else {
                alertSuccsess("Success while saving field");
                resolve([true, null]);
            }
        } catch (/** @type {any} */ exception) {
            /** @type {ApiError} */
            const error = {
                message: String(exception),
                rawError: String(exception)
            };
            alertError("Error while saving field. Changes didn't apply");
            resolve([false, error]);
        }
    });
};

/**
 * Wrapper function for saving a field via the API.
 *
 * @param {FieldDto} editedField - The field data to be saved.
 * @param {CustomEntity} customEntity - The custom entity data.
 * @returns {Promise<[boolean, ApiError | null]>} A promise that resolves with a tuple: [result, error].
 */
const saveFieldApi = (editedField, customEntity) => {
    return new Promise(async (resolve) => {
        try {
            const api = new FieldsApi();

            if (editedField?.id) {
                const [, error] = await callApi((cb) => 
                    api.apiFieldsPatch({ id: editedField?.id, fieldDelta: JSON.stringify(editedField) }, cb)
                );
                
                if (error) {
                    alertError("Error while saving field. Changes didn't apply");
                    resolve([false, error]);
                    return;
                }
            } else {
                editedField.customEntityId = customEntity.id;
                const [, error] = await callApi((cb) => 
                    api.apiFieldsPost({ body: editedField }, cb)
                );
                
                if (error) {
                    alertError("Error while saving field. Changes didn't apply");
                    resolve([false, error]);
                    return;
                }
            }

            alertSuccsess("Success while saving field");
            resolve([true, null]);
        } catch (/** @type {any} */ exception) {
            /** @type {ApiError} */
            const error = {
                message: String(exception),
                rawError: String(exception)
            };
            alertError("Error while saving field. Changes didn't apply");
            resolve([false, error]);
        }
    });
};

/**
 * Wrapper function for deleting a field via the API.
 *
 * @param {string} id - The ID of the field to delete.
 * @returns {Promise<[boolean, ApiError | null]>} A promise that resolves with a tuple: [result, error].
 */
const deleteFieldApi = (id) => {
    return new Promise(async (resolve) => {
        try {
            const api = new FieldsApi();
            const [, error] = await callApi((cb) => api.apiFieldsIdDelete(id, cb));
            
            if (error) {
                alertError("Error while deleting field. Changes didn't apply");
                resolve([false, error]);
            } else {
                alertSuccsess("Success while deleting field");
                resolve([true, null]);
            }
        } catch (/** @type {any} */ exception) {
            /** @type {ApiError} */
            const error = {
                message: String(exception),
                rawError: String(exception)
            };
            alertError("Error while deleting field. Changes didn't apply");
            resolve([false, error]);
        }
    });
};

/**
 * Wrapper function for deleting a relationship via the API.
 *
 * @param {string} id - The ID of the relationship to delete.
 * @returns {Promise<[boolean, ApiError | null]>} A promise that resolves with a tuple: [result, error].
 */
const deleteRelationshipApi = (id) => {
    return new Promise(async (resolve) => {
        try {
            const api = new RelationshipsApi();
            const [, error] = await callApi((cb) => api.apiRelationshipsIdDelete(id, cb));
            
            if (error) {
                alertError("Error while deleting relationship. Changes didn't apply");
                resolve([false, error]);
            } else {
                alertSuccsess("Success while deleting relationship");
                resolve([true, null]);
            }
        } catch (/** @type {any} */ exception) {
            /** @type {ApiError} */
            const error = {
                message: String(exception),
                rawError: String(exception)
            };
            alertError("Error while deleting relationship. Changes didn't apply");
            resolve([false, error]);
        }
    });
};

export { saveCustomEntityApi, deleteCustomEntityApi, saveRelationshipApi, saveFieldApi, deleteFieldApi, deleteRelationshipApi, applyChangesToDbApi };