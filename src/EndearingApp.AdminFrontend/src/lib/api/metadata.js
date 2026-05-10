import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { customEntities, optionSets, forms, ensureForms } from '../../stores/global';
import { fetchEntityById } from './odata';
import { success, failure } from './result';

/** @param {string} entityId
 *  @returns {Promise<import('./result').ApiResult<{ formId: string, formName: string } | null>>} */
export async function getFirstFormForEntity(entityId) {
  if (!browser) return success(null);
  await ensureForms();
  const allForms = get(forms);
  const entityForms = allForms.filter((/** @type {any} */ f) => f.customEntityId === entityId);
  if (entityForms.length === 0) return success(null);
  const form = entityForms[0];
  return success({ formId: form.id, formName: form.name });
}

/** @param {string} entityId
 *  @returns {Promise<import('./result').ApiResult<any[]>>} */
export async function getFormsForEntity(entityId) {
  if (!browser) return success([]);
  await ensureForms();
  const allForms = get(forms);
  return success(allForms.filter((/** @type {any} */ f) => f.customEntityId === entityId));
}

/** @param {string} entityId
 *  @returns {string | null} */
export function getEntityName(entityId) {
  const entities = get(customEntities);
  const entity = entities.find((/** @type {any} */ e) => e.id === entityId);
  return entity ? entity.name : null;
}

/** @param {string} entityId
 *  @returns {string | null} */
export function getEntityDisplayName(entityId) {
  const entities = get(customEntities);
  const entity = entities.find((/** @type {any} */ e) => e.id === entityId);
  return entity ? (entity.displayName || entity.name) : null;
}

/** @param {string} entityId
 *  @param {string} fieldId
 *  @returns {{ entityName: string | null, navigationPropName: string | null, field: any | null }} */
export function getLookupTargetForField(entityId, fieldId) {
  const entities = get(customEntities);
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
 *  @returns {Array<{ sourceFieldId: string, targetEntityName: string | null, navigationPropName: string | null, targetFields: any[] }>} */
export function getLookupRelationships(entityId) {
  const entities = get(customEntities);
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
 *  @returns {string | null} */
export function getOptionSetName(optionSetDefId, value) {
  const sets = get(optionSets);
  const def = sets.find((/** @type {any} */ s) => s.id === optionSetDefId);
  if (!def || !def.options) return null;
  const option = def.options.find((/** @type {any} */ o) => String(o.value) === String(value));
  return option ? option.name : null;
}

/** @param {string} entityId
 *  @returns {any | null} */
export function getEntityByIdFromStore(entityId) {
  const entities = get(customEntities);
  return entities.find((/** @type {any} */ e) => e.id === entityId) || null;
}

/** @param {string} entityName
 *  @param {string} id
 *  @returns {Promise<import('./result').ApiResult<any>>} */
export async function loadEntityWithName(entityName, id) {
  return fetchEntityById(entityName, id, { select: ['Id', 'Name'] });
}
