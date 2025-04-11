import { CustomeEntityDTO, CustomEntitiesApi, FormApi, FormDTO } from '@apiclients/src';
import { error } from '@sveltejs/kit';



/** @param { string } formId 
 ** @returns { Promise<FormDTO | null> } */
const loadFormById = (formId) => {
  return new Promise((res) => {
    const formApi = new FormApi();
    // @ts-ignore
    const callback = (error, form) => {
      if (form) {
        res(form);
        return;
      }
      res(null);
    }
    formApi.apiFormIdGet(formId, callback);
  });
}

/**
 * @param { string } customEntityId
 * @returns { Promise<CustomeEntityDTO> }
 */
const getCustomEntity = async (customEntityId) => {
  return new Promise((res) => {
    const api = new CustomEntitiesApi();
    // @ts-ignore
    let callBack = (error, customEntity) => {
      res(customEntity ?? {});
    }
    api.apiCustomEntitiesIdGet(customEntityId, callBack)
  });

}

/** 
 * @param { FormDTO } form 
 * @param { string } entityId
 * @returns { Promise<Object | null> } */
const loadEntityData = async (form, entityId) => {
  const customEntity = await getCustomEntity(form.customEntityId);
  const url = `/api/odata/${customEntity.name}(${entityId})`;
  const response = await fetch(url);

  if (response.status === 404) {
    return null;
  }

  if (response.status === 200) {
    return await response.json();
  }
  throw new Error(`Request to load entity data: ${url} failed with status: ${response.status}`);
}


export const load = async (/** @type {{ params: {formid: string, entityId: string}}} */{ params }) => {
  console.log(params);
  const form = await loadFormById(params.formid);
  const entityData = !!form ? await loadEntityData(form, params.entityId) : null;
  if (form && entityData) {
    console.log(entityData);
    return { form: form, entityData };
  }
  error(404, 'Not found');
};
export const ssr = false;
