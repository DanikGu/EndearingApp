export { success, failure } from './result';
export {
  buildODataUrl,
  fetchEntities,
  fetchEntityById,
  fullTextSearch,
  fetchFirstPage,
  createEntity,
  updateEntity,
  deleteEntity,
} from './odata';
export {
  getFirstFormForEntity,
  getFormsForEntity,
  getEntityName,
  getEntityDisplayName,
  getLookupTargetForField,
  getLookupRelationships,
  getOptionSetName,
  getEntityByIdFromStore,
  loadEntityWithName,
  fetchCustomEntityById,
} from './metadata';
