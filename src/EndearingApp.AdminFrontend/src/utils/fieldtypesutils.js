import { getTypeName as getTypeNameFromStore, getTypeId as getTypeIdFromStore, ensureTypeConfig as ensureTypeConfigFromStore, getTypesArray as getTypesArrayFromStore } from '../stores/global';

// Re-export store functions for backward compatibility
export const getTypeName = getTypeNameFromStore;
export const getTypeId = getTypeIdFromStore;
export const ensureTypeConfig = ensureTypeConfigFromStore;
export const getTypesArray = getTypesArrayFromStore;

// Default export for backward compatibility
export default { getTypeName, ensureTypeConfig, getTypesArray, getTypeId };
