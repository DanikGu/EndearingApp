<script>
  import {
    CustomeEntityDTO,
    CustomEntitiesApi,
    FieldDto,
    FormDTO,
  } from "@apiclients/src";
  import { onMount } from "svelte";
  /** @typedef {import('@formio/js').Form} Form */

  /** @type {any} */
  export let entityData = {};
  /** @type {FormDTO} */
  export let form;
  /** @type {HTMLElement} */
  let formElem;
  /** @type {Function | null} */
  export let onFormSubmit = null;
  /** @type {Form | null}*/
  let formioForm = null;

  /** @type {CustomeEntityDTO} */
  let customEntity;

  /** @param { string } msg */
  const alertWarning = (msg) => {
    if (!formioForm) {
      return;
    }
    formioForm.options.noAlerts = false;
    // @ts-ignore
    formioForm.setAlert("warning", msg, {});
    formioForm.options.noAlerts = true;
  };
  /** @param { string } msg */
  const alertSuccsess = (msg) => {
    if (!formioForm) {
      return;
    }
    formioForm.options.noAlerts = false;
    // @ts-ignore
    formioForm.setAlert("success", msg, {});
    formioForm.options.noAlerts = true;
  };
  /** @param { string } msg */
  const alert = (msg) => {
    if (!formioForm) {
      return;
    }
    formioForm.options.noAlerts = false;
    // @ts-ignore
    formioForm.setAlert("info", msg, {});
    formioForm.options.noAlerts = true;
  };
  /** @param { string } msg */
  const alertError = (msg) => {
    if (!formioForm) {
      return;
    }
    formioForm.options.noAlerts = false;
    // @ts-ignore
    formioForm.setAlert("danger", msg, {});
    formioForm.options.noAlerts = true;
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
      alert(`Entity updated`);
    } else {
      const url = `/api/odata/${customEntity.name}`;
      entityData = await postData(url, entityData);
      alert(`Entity created`);
      window.location.replace(window.location + "/" + entityData.Id);
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

  const putData = async (url = "", data = {}) => {
    const response = await fetch(url, {
      method: "PUT",
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
    if (!entityData.Id) {
      return;
    }
    const url = `/api/odata/${customEntity.name}(${entityData.Id})`;
    const response = await fetch(url);
    const etn = response.json();
    entityData = etn;
  };
  const updateFormFromEntityData = () => {
    Object.keys(entityData).forEach((key) => {
      // @ts-ignore
      let component = formioForm.getComponent(key);
      console.log(entityData, key, component);
      if (component) {
        component.setValue(entityData[key]);
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
    if (response.ok) {
      window.location.replace(
        window.location.href.substring(
          0,
          window.location.href.lastIndexOf("/"),
        ),
      );
    } else {
      alertError(`HTTP error! Status: ${response.status}`);
    }
  };

  /** @param { HTMLElement } targetElement
   *  @param { string } message */
  const showLoader = (targetElement, message) => {
    const overlay = document.createElement("div");
    overlay.className = "bg-body";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "calc(100% + 50px)";
    overlay.style.opacity = "0.6";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.backdropFilter = "blur(5px)";
    overlay.style.zIndex = "9999";
    overlay.style.borderRadius = "inherit";

    const spinner = document.createElement("i");
    spinner.className = "bi bi-arrow-clockwise";
    spinner.style.fontSize = "2rem";
    spinner.style.animation = "spin 1s linear infinite";

    const text = document.createElement("p");
    text.innerText = message;
    text.style.marginTop = "10px";
    text.style.fontSize = "1rem";
    text.style.color = "#333";

    overlay.appendChild(spinner);
    overlay.appendChild(text);

    if (getComputedStyle(targetElement).position === "static") {
      targetElement.style.position = "relative";
    }

    targetElement.appendChild(overlay);

    return () => overlay.remove();
  };
  onMount(async () => {
    const { Formio } = await import("@formio/js");
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
        formioForm.options.noAlerts = true;
      }
      // @ts-ignore
      formioForm?.on("EntityDelete", function (eventData) {
        delteCurrentEntity();
      });
      // bind form to entityData
      // @ts-ignore
      formioForm?.on("change", function (eventData) {
        Object.keys(eventData.data).forEach((key) => {
          const isField = customEntity.fields.find(
            (/** @type {FieldDto} */ x) => x.name == key && !x.isSystemField,
          );
          if (!isField) {
            return;
          }
          entityData[key] = eventData.data[key];
        });
      });
      formioForm?.on(
        "EntitySave",
        async function (/** @type {any} */ eventData) {
          const removeLoader = showLoader(formElem, "Saving...");
          try {
            if (onFormSubmit) {
              onFormSubmit(eventData);
              return;
            }

            // await new Promise((res) => setTimeout(res, 2000));
            await saveEntity();
          } catch (ex) {
            console.log(ex);
            formioForm?.emit("submitError", [
              "Unhandaled error while submiting",
            ]);
          } finally {
            removeLoader();
          }
        },
      );
    }
  });
</script>

<div class="p-4 dark:text-white" id="form" bind:this={formElem}></div>
