<script>
  import {
    CustomeEntityDTO,
    CustomEntitiesApi,
    FieldDto,
    FormDTO,
  } from "@apiclients/src";
  import { showBlockingLoader } from "@utils/uiutils";
  import { onMount } from "svelte";
  /** @typedef {import('@formio/js').Form} Form */

  /**
   * @typedef {Object} Props
   * @property {any} [entityData]
   * @property {FormDTO} form
   * @property {Function | null} [onAfterSave]
   * @property {Function | null} [onAfterDelete]
   */

  /** @type {Props} */
  let {
    entityData = $bindable({}),
    form = $bindable(),
    onAfterSave = null,
    onAfterDelete = null,
  } = $props();

  /** @type {HTMLElement | undefined} */
  let formElem = $state();

  /** @type {Form | null}*/
  let formioForm = null;

  /** @type {CustomeEntityDTO} */
  let customEntity;

  /** @param { string } msg */
  const alertWarning = (msg) => {
    if (!formioForm) {
      return;
    }
    // @ts-ignore
    formioForm.setAlert("warning", msg, {});
  };
  /** @param { string } msg */
  const alertSuccsess = (msg) => {
    if (!formioForm) {
      return;
    }
    // @ts-ignore
    formioForm.setAlert("success", msg, {});
    formioForm.options.noAlerts = true;
  };
  /** @param { string } msg */
  const alertMsg = (msg) => {
    if (!formioForm) {
      return;
    }
    // @ts-ignore
    formioForm.setAlert("info", msg, {});
  };
  /** @param { string } msg */
  const alertError = (msg) => {
    if (!formioForm) {
      return;
    }
    formioForm.options.noAlerts = false;
    // @ts-ignore
    formioForm.setAlert("danger", msg, {});
  };

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
      };
      api.apiCustomEntitiesIdGet(customEntityId, callBack);
    });
  };

  const saveEntity = async () => {
    if (entityData.Id) {
      const url = `/api/odata/${customEntity.name}(${entityData.Id})`;
      await patchData(url, entityData);
      alertMsg(`Entity updated`);
    } else {
      const url = `/api/odata/${customEntity.name}`;
      entityData = await postData(url, entityData);
      alertMsg(`Entity created`);
      return;
    }

    updateFormFromEntityData();
  };
  const patchData = async (url = "", data = {}) => {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      alertError(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  };

  const postData = async (url = "", data = {}) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      alertError(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  };
  const loadEntityData = async () => {
    console.log(entityData);
    if (!entityData?.Id) {
      return;
    }
    const url = `/api/odata/${customEntity.name}(${entityData.Id})`;
    const response = await fetch(url);
    const etn = await response.json();
    entityData = etn;
  };

  /** @param {any} dateStr */
  const reverseConvertDateFormat = (dateStr) => {
    const isString = typeof dateStr === "string" || dateStr instanceof String;
    if (!isString || !dateStr) {
      return dateStr;
    }
    const regex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    // @ts-ignore
    if (!regex.test(dateStr)) {
      return dateStr;
    }
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };
  /** @param {any} dateStr */
  const convertDateFormat = (dateStr) => {
    const isString = typeof dateStr === "string" || dateStr instanceof String;
    if (!isString || !dateStr) {
      return dateStr;
    }
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    // @ts-ignore
    if (!regex.test(dateStr)) {
      return dateStr;
    }

    const [month, day, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };
  const updateFormFromEntityData = () => {
    Object.keys(entityData).forEach((key) => {
      // @ts-ignore
      let component = formioForm.getComponent(key);

      if (component) {
        const isDate = component.type === "day";
        let value = entityData[key];
        if (isDate) {
          value = reverseConvertDateFormat(value);
        }
        component.setValue(value);
      }
    });
  };
  const delteCurrentEntity = async () => {
    if (!entityData.Id) {
      alertWarning("Entity have to be saved before deleted ");
      return;
    }
    const url = `/api/odata/${customEntity.name}(${entityData.Id})`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      alertError(`HTTP error! Status: ${response.status}`);
    }
  };
  onMount(async () => {
    const { Formio } = await import("@formio/js");
    // @ts-ignore
    window.Formio = Formio;
    await import("../../FormComponents/FormIoComponents/ActionButtons");
    await import("../../FormComponents/FormIoComponents/LookupComponent");
    await import("@formio/js/dist/formio.full.min.css");
    await import("../AppComponents/styles/layout.css");

    customEntity = await getCustomEntity(form.customEntityId);

    if (form?.jsonSchema) {
      formioForm = await Formio.createForm(
        formElem,
        JSON.parse(form.jsonSchema),
        {
          noAlerts: true,
        },
      );
      console.log(entityData);
      await loadEntityData();
      updateFormFromEntityData();
      if (formioForm) {
        // @ts-ignore
        formioForm.nosubmit = true;
      }
      // @ts-ignore
      formioForm?.on("EntityDelete", async function (eventData) {
        await delteCurrentEntity();
        onAfterDelete && onAfterDelete();
      });

      // bind form to entityData
      // @ts-ignore
      formioForm?.on("change", function (eventData) {
        console.log("Change called", eventData);
        // @ts-ignore
        formioForm?.alert?.remove();
        Object.keys(eventData.data).forEach((key) => {
          const isField = customEntity.fields.find(
            (/** @type {FieldDto} */ x) => x.name == key,
          );
          if (!isField) {
            return;
          }
          // @ts-ignore
          const isDate = formioForm?.getComponent(key)?.type === "day";
          let value = eventData.data[key];
          if (isDate) {
            value = convertDateFormat(value);
          }
          entityData[key] = value;
        });
      });
      formioForm?.on(
        "EntitySave",
        async function (/** @type {any} */ eventData) {
          // const removeLoader = showLoader(formElem, "Saving...");
          const removeLoader = showBlockingLoader("Saving...", formElem);
          try {
            // @ts-ignore
            const isValid = formioForm.checkValidity(null, true, null, false);
            // @ts-ignore
            formioForm.checkData();
            if (isValid) {
              await saveEntity();
            }
            if (onAfterSave) {
              onAfterSave(entityData);
            }
          } catch (ex) {
            console.log(ex);
            alertError("Unhandaled error while saving");
          } finally {
            removeLoader();
          }
        },
      );
    }
  });
</script>

<div class="p-4 dark:text-white relative" id="form" bind:this={formElem}></div>
