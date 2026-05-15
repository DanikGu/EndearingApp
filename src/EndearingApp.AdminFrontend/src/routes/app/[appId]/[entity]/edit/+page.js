import { error } from '@sveltejs/kit';
import { getCustomEntities, getForms } from '@stores/global';

const loadFormById = async (/** @type {string} */ formId) => {
  const { FormApi } = await import('@apiclients/src');
  return new Promise((res) => {
    const formApi = new FormApi();
    const callback = (/** @type {any} */ err, /** @type {any} */ form) => { res(form ?? null); };
    formApi.apiFormIdGet(formId, callback);
  });
};

export const load = async (/** @type {{ params: {appId: string, entity: string}, url: URL}} */ { params, url }) => {
  const entities = await getCustomEntities();
  const entity = entities.find((/** @type {any} */ e) => e.name === params.entity || e.id === params.entity);
  if (!entity) error(404, 'Entity not found');

  const formIdParam = url.searchParams.get('form');
  let form = null;

  if (formIdParam) {
    form = await loadFormById(formIdParam);
  }

  if (!form) {
    const allForms = await getForms();
    const entityForms = allForms.filter((/** @type {any} */ f) => f.customEntityId === entity.id);
    form = entityForms.length > 0 ? entityForms[0] : null;
  }

  if (!form) error(404, 'No form found for this entity');

  const allForms = await getForms();
  const availableForms = allForms.filter((/** @type {any} */ f) => f.customEntityId === entity.id);

  return { form, entityData: {}, entityName: entity.name, availableForms };
};
export const ssr = false;
