import { error } from '@sveltejs/kit';
import { ensureCustomEntities, ensureForms, forms, customEntities } from '../../../../../../stores/global';
import { get } from 'svelte/store';

const loadFormById = async (/** @type {string} */ formId) => {
  const { FormApi } = await import('@apiclients/src');
  return new Promise((res) => {
    const formApi = new FormApi();
    const callback = (/** @type {any} */ err, /** @type {any} */ form) => { res(form ?? null); };
    formApi.apiFormIdGet(formId, callback);
  });
};

export const load = async (/** @type {{ params: {appId: string, entity: string, entityId: string}, url: URL}} */ { params, url }) => {
  await ensureCustomEntities();
  const entities = get(customEntities);
  const entity = entities.find((/** @type {any} */ e) => e.name === params.entity || e.id === params.entity);
  if (!entity) error(404, 'Entity not found');

  const formIdParam = url.searchParams.get('form');
  let form = null;

  if (formIdParam) {
    form = await loadFormById(formIdParam);
  }

  if (!form) {
    await ensureForms();
    const allForms = get(forms);
    const entityForms = allForms.filter((/** @type {any} */ f) => f.customEntityId === entity.id);
    form = entityForms.length > 0 ? entityForms[0] : null;
  }

  if (!form) error(404, 'No form found for this entity');

  const { fetchEntityById } = await import('$lib/api/odata');
  const { data: entityData, error: fetchError } = await fetchEntityById(entity.name, params.entityId);
  if (fetchError || !entityData) error(404, 'Entity data not found');

  const allForms = get(forms);
  const availableForms = allForms.filter((/** @type {any} */ f) => f.customEntityId === entity.id);

  return { form, entityData, entityName: entity.name, availableForms };
};
export const ssr = false;
