import { ActionApi, CustomEntitiesApi, FieldDto, FieldsApi, RelationshipsApi } from "@apiclients/src";
import { alertError, alertSuccsess } from "@utils/uiutils";

/** @typedef {import('../src/apiclient/src/model/CustomeEntityDTO').default} CustomEntity */
/** @typedef {import('../src/apiclient/src/model/FieldDto').default} FieldEntity */
/** @typedef {import('../src/apiclient/src/model/RelationshipDTO').default} RelationshipDTO  */


/**
 * @returns {Promise<[boolean, string | null]>} A promise that resolves with a tuple:
 * - The first element is a boolean indicating success.
 * - The second element is a string (or null) with error details.
 */
const applyChangesToDbApi = () => {
  return new Promise((res) => {
    /** @param {string | null} error */
    let callback = (error) => {
      if (error) {
        alertError("Db Update Failed");
        res([false, error]);
      } else {
        alertSuccsess("Db Structure Update Successfully");
        res([true, null]);
      }
    };

    try {
      let api = new ActionApi();
      api.apiActionUpdateDbStructurePost(callback);
    } catch (ex) {
      res([false, String(ex)]);
    }
  });
};

/**
 * Wrapper function for saving a custom entity via the API.
 *
 * @param {boolean} isNew - Indicates if the custom entity is new.
 * @param {CustomEntity} customEntity - The custom entity data.
 * @returns {Promise<[boolean, string | null]>} A promise that resolves to true if successful.
 */
const saveCustomEntityApi = (isNew, customEntity) => {
  return new Promise((resolve) => {
    /**
     * Callback for API action.
     * @param {string | null} error - Error message returned from the API, or null if successful.
     * @param {CustomEntity} [response] - Response object from the API.
     */
    const callBack = (error, response) => {
      try {
        if (error) {
          alertError("Error while saving custom entity. Changes didn't apply.");
          resolve([false, error]);
          return;
        }

        alertSuccsess("Success while saving custom entity.");

        if (response) {
          if (isNew) {
            customEntity = response;
            isNew = false;
          }
        }

        resolve([true, null]);
      } catch (exception) {
        resolve([false, String(exception)]);
      }
    };

    try {
      const api = new CustomEntitiesApi();

      if (isNew) {
        const newEntity = {
          Name: customEntity.name,
          DisplayName: customEntity.displayName,
          Description: customEntity.description,
        };
        api.apiCustomEntitiesPost({ body: newEntity }, callBack);
      } else {
        api.apiCustomEntitiesIdPut(customEntity.id, { body: customEntity }, callBack);
      }
    } catch (exception) {
      resolve([false, String(exception)]);
    }
  });
};

/**
 * Wrapper function for deleting a custom entity via the API.
 *
 * @param {CustomEntity} customEntity - The custom entity data.
 * @returns {Promise<[boolean, string | null]>} A promise that resolves to true if successful.
 */
const deleteCustomEntityApi = (customEntity) => {
  return new Promise((resolve) => {
    /**
     * Callback for API action.
     * @param {string | null} error - Error message returned from the API, or null if successful.
     */
    const callBack = (error) => {
      try {
        if (error) {
          alertError("Error while deleting custom entity. Changes didn't apply.", null);
          resolve([false, error]);
          return;
        }

        alertSuccsess("Success while deleting custom entity.", null);

        resolve([true, null]);
      } catch (exception) {
        resolve([false, String(exception)]);
      }
    };

    try {
      const api = new CustomEntitiesApi();
      api.apiCustomEntitiesIdDelete(customEntity.id, callBack);
    } catch (exception) {
      resolve([false, String(exception)]);
    }
  });
};

/**
 * Wrapper function for saving a relationship via the API.
 *
 * @param {RelationshipDTO} editedRelationship - The relationship data to be saved.
 * @param {CustomEntity} customEntity - The custom entity data.
 * @returns {Promise<[boolean, string | null]>} A promise that resolves with a tuple: [result, error].
 */
const saveRelationshipApi = (editedRelationship, customEntity) => {
  return new Promise((resolve) => {
    /**
     * Callback for API action.
     * @param {string | null} error - Error message returned from the API, or null if successful.
     * @param {Object} [response] - Response object from the API.
     */
    const callBack = (error, response) => {
      try {
        if (error) {
          alertError("Error while saving field. Changes didn't apply", null);
          resolve([false, error]);
          return;
        }

        alertSuccsess("Success while saving field", null);

        resolve([true, null]);
      } catch (exception) {
        resolve([false, String(exception)]);
      }
    };

    try {
      const api = new RelationshipsApi();
      // @ts-ignore
      editedRelationship.CustomEntityId = customEntity.id;
      api.apiRelationshipsPost({ body: editedRelationship }, callBack);
    } catch (exception) {
      resolve([false, String(exception)]);
    }
  });
};

/**
 * Wrapper function for saving a field via the API.
 *
 * @param {FieldDto} editedField - The field data to be saved.
 * @param {CustomEntity} customEntity - The custom entity data.
 * @returns {Promise<[boolean, string | null]>} A promise that resolves with a tuple: [result, error].
 */
const saveFieldApi = (editedField, customEntity) => {
  return new Promise((resolve) => {
    /**
     * Callback for API action.
     * @param {string | null} error - Error message returned from the API, or null if successful.
     */
    const callBack = (error) => {
      try {
        if (error) {
          alertError("Error while saving field. Changes didn't apply", null);
          resolve([false, error]);
          return;
        }

        alertSuccsess("Success while saving field", null);

        resolve([true, null]);
      } catch (exception) {
        resolve([false, String(exception)]);
      }
    };

    try {
      const api = new FieldsApi();

      if (editedField?.id) {
        api.apiFieldsPatch(
          { id: editedField?.id, fieldDelta: JSON.stringify(editedField) },
          callBack
        );
      } else {
        editedField.customEntityId = customEntity.id;
        api.apiFieldsPost({ body: editedField }, callBack);
      }
    } catch (exception) {
      resolve([false, String(exception)]);
    }
  });
};


/**
 * Wrapper function for deleting a field via the API.
 *
 * @param {string} id - The ID of the field to delete.
 * @returns {Promise<[boolean, string | null]>} A promise that resolves with a tuple: [result, error].
 */
const deleteFieldApi = (id) => {
  return new Promise((resolve) => {
    /**
     * Callback for API action.
     * @param {string | null} error - Error message returned from the API, or null if successful.
     */
    const callBack = (error) => {
      try {
        if (error) {
          alertError("Error while deleting field. Changes didn't apply", null);
          resolve([false, error]);
          return;
        }

        alertSuccsess("Success while deleting field", null);

        resolve([true, null]);
      } catch (exception) {
        resolve([false, String(exception)]);
      }
    };

    try {
      const api = new FieldsApi();
      api.apiFieldsIdDelete(id, callBack);
    } catch (exception) {
      resolve([false, String(exception)]);
    }
  });
};
/**
 * Wrapper function for deleting a relationship via the API.
 *
 * @param {string} id - The ID of the relationship to delete.
 * @returns {Promise<[boolean, string | null]>} A promise that resolves with a tuple: [result, error].
 */
const deleteRelationshipApi = (id) => {
  return new Promise((resolve) => {
    /**
     * Callback for API action.
     * @param {string | null} error - Error message returned from the API, or null if successful.
     */
    const callBack = (error) => {
      try {
        if (error) {
          alertError("Error while deleting relationship. Changes didn't apply", null);
          resolve([false, error]);
          return;
        }

        alertSuccsess("Success while deleting relationship", null);

        resolve([true, null]);
      } catch (exception) {
        resolve([false, String(exception)]);
      }
    };

    try {
      const api = new RelationshipsApi();
      api.apiRelationshipsIdDelete(id, callBack);
    } catch (exception) {
      resolve([false, String(exception)]);
    }
  });
};

export { saveCustomEntityApi, deleteCustomEntityApi, saveRelationshipApi, saveFieldApi, deleteFieldApi, deleteRelationshipApi, applyChangesToDbApi };
