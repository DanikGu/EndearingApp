import { browser } from '$app/environment';
import { getCustomEntities, getOptionSets, getForms } from '@stores/global';
import { fetchEntityById } from './odata';
import { success, failure } from './result';

/** @param {string} entityId
 *  @returns {Promise<import('./result').ApiResult<{ formId: string, formName: string } | null>>} */
export async function getFirstFormForEntity(entityId) {
  if (!browser) return success(null);
  const allForms = await getForms();
  const entityForms = allForms.filter((/** @type {any} */ f) => f.customEntityId === entityId);
  if (entityForms.length === 0) return success(null);
  const form = entityForms[0];
  return success({ formId: form.id, formName: form.name });
}

/** @param {string} entityId
 *  @returns {Promise<import('./result').ApiResult<any[]>>} */
export async function getFormsForEntity(entityId) {
  if (!browser) return success([]);
  const allForms = await getForms();
  return success(allForms.filter((/** @type {any} */ f) => f.customEntityId === entityId));
}

/** @param {string} entityId
 *  @returns {Promise<string | null>} */
export async function getEntityName(entityId) {
  const entities = await getCustomEntities();
  const entity = entities.find((/** @type {any} */ e) => e.id === entityId);
  return entity ? entity.name : null;
}

/** @param {string} entityId
 *  @returns {Promise<string | null>} */
export async function getEntityDisplayName(entityId) {
  const entities = await getCustomEntities();
  const entity = entities.find((/** @type {any} */ e) => e.id === entityId);
  return entity ? (entity.displayName || entity.name) : null;
}

/** @param {string} entityId
 *  @param {string} fieldId
 *  @returns {Promise<{ entityName: string | null, navigationPropName: string | null, field: any | null }>} */
export async function getLookupTargetForField(entityId, fieldId) {
  const entities = await getCustomEntities();
  const entity = entities.find((/** @type {any} */ e) => e.id === entityId);
  if (!entity || !entity.relationships) return { entityName: null, navigationPropName: null, field: null };

  const rel = entity.relationships.find((/** @type {any} */ r) => r.sourceFieldId === fieldId);
  if (!rel) return { entityName: null, navigationPropName: null, field: null };

  const sourceField = entity.fields?.find((/** @type {any} */ f) => f.id === fieldId);
  const targetEntity = entities.find((/** @type {any} */ e) => e.id === rel.referencedCustomEntityId);
  if (!targetEntity) return { entityName: null, navigationPropName: null, field: null };

  return {
    entityName: targetEntity.name,
    navigationPropName: sourceField ? `${sourceField.name}_Etn` : null,
    field: targetEntity.fields ? targetEntity.fields.find((/** @type {any} */ f) => f.id === rel.referencedFieldId) : null,
  };
}

/** @param {string} entityId
 *  @returns {Promise<Array<{ sourceFieldId: string, targetEntityName: string | null, navigationPropName: string | null, targetFields: any[] }>>} */
export async function getLookupRelationships(entityId) {
  const entities = await getCustomEntities();
  const entity = entities.find((/** @type {any} */ e) => e.id === entityId);
  if (!entity || !entity.relationships) return [];

  return entity.relationships
    .map((/** @type {any} */ rel) => {
      const targetEntity = entities.find((/** @type {any} */ e) => e.id === rel.referencedCustomEntityId);
      if (!targetEntity) return null;
      const sourceField = entity.fields?.find((/** @type {any} */ f) => f.id === rel.sourceFieldId);
      return {
        sourceFieldId: rel.sourceFieldId,
        targetEntityName: targetEntity.name,
        navigationPropName: sourceField ? `${sourceField.name}_Etn` : null,
        targetFields: targetEntity.fields || [],
        isCollection: false,
        collectionNavPropName: rel.constraintName ? `${rel.constraintName}_EtnColl` : null,
      };
    })
    .filter((/** @type {any} */ x) => x !== null);
}

/** @param {string} optionSetDefId
 *  @param {number | string} value
 *  @returns {Promise<string | null>} */
export async function getOptionSetName(optionSetDefId, value) {
  const sets = await getOptionSets();
  const def = sets.find((/** @type {any} */ s) => s.id === optionSetDefId);
  if (!def || !def.options) return null;
  const option = def.options.find((/** @type {any} */ o) => String(o.value) === String(value));
  return option ? option.name : null;
}

/** @param {string} entityId
 *  @returns {Promise<any | null>} */
export async function getEntityByIdFromStore(entityId) {
  const entities = await getCustomEntities();
  return entities.find((/** @type {any} */ e) => e.id === entityId) || null;
}

/** @param {string} entityName
 *  @param {string} id
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function loadEntityWithName(entityName, id) {
  return fetchEntityById(entityName, id, { select: ['Id', 'Name'] });
}

/** @param {string} id
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function fetchCustomEntityById(id) {
  if (!browser) return success(null);
  const { CustomEntitiesApi } = await import('@apiclients/src');
  return new Promise((res) => {
    const api = new CustomEntitiesApi();
    const callback = (/** @type {any} */ err, /** @type {any} */ data) => {
      if (err) res(failure(err));
      else res(success(data));
    };
    api.apiCustomEntitiesIdGet(id, callback);
  });
}
