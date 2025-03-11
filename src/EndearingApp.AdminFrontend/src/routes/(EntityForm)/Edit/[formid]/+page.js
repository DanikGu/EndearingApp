import { FormApi, FormDTO } from '@apiclients/src';
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


export const load = async (/** @type {{ params: {formid: string}}} */{ params }) => {
  console.log(params);
  const form = await loadFormById(params.formid);
  if (form) {
    return { form: form };
  }
  error(404, 'Not found');
};
export const ssr = false;
