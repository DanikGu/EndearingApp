import { error } from '@sveltejs/kit';
import { getEntityByIdFromStore } from '$lib/api/metadata';
import { ensureCustomEntities } from '../../../../../stores/global';

const loadFormById = async (/** @type {string} */ formId) => {
  const { FormApi } = await import('@apiclients/src');
  return new Promise((res) => {
    const formApi = new FormApi();
    const callback = (/** @type {any} */ err, /** @type {any} */ form) => { res(form ?? null); };
    formApi.apiFormIdGet(formId, callback);
  });
};

export const load = async (/** @type {{ params: {formid: string, entityId: string}}} */ { params }) => {
  const form = await loadFormById(params.formid);
  if (!form) error(404, 'Not found');

  const { fetchEntityById } = await import('$lib/api/odata');
  await ensureCustomEntities();
  const entity = getEntityByIdFromStore(form.customEntityId);
  if (!entity) error(404, 'Entity not found');

  const { data: entityData, error: fetchError } = await fetchEntityById(entity.name, params.entityId);
  if (fetchError || !entityData) error(404, 'Entity data not found');

  return { form, entityData };
};
export const ssr = false;
