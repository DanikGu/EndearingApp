<script>
  import { onMount } from "svelte";

  /** @type {any} */
  let currentSchema = null;
  /** @type {any} */
  let currentComponents = null;
  /** @type {Function | null} */
  let afterMount = null;
  /** @type {any} */
  let Formio;
  const onInit = () => {
    setupColors();
    setupBuilder();
    listenMessages();
  };
  const listenMessages = () => {
    window.addEventListener("message", (event) => {
      const data = event.data; // The object the parent sent
      console.log("Received message from parent:", data);
      setupBuilder(data.currentSchema, data.components);
    });
  };

  /**
   * @param {any} newSchema
   * @param {any} newComponents
   **/
  const setupBuilder = (newSchema = null, newComponents = null) => {
    if (
      JSON.stringify(newSchema) === JSON.stringify(currentSchema) &&
      JSON.stringify(newComponents) === JSON.stringify(currentComponents)
    ) {
      return;
    }

    if (!Formio) {
      afterMount = () => setupBuilder(newSchema, newComponents);
      return;
    }
    currentSchema = newSchema;
    currentComponents = newComponents;
    Formio.builder(document.getElementById("builder"), newSchema ?? {}, {
      display: "form",
      editForm: {}, //getEditForm(),
      noNewEdit: true,
      noDefaultSubmitButton: true,
      builder: {
        resource: false,
        advanced: false,
        premium: false,
        custom: newComponents ?? {},
      },
    }).then(function (/** @type {any} */ instance) {
      var onBuild = function (/** @type {any} */ build) {
        currentSchema = instance.schema;
        let schema = instance.schema;
        window.parent.postMessage(
          { type: "formSchemaChanged", content: schema },
          "*",
        );
      };
      instance.on("change", onBuild);
    });
  };
  const setupColors = () => {
    window.addEventListener("storage", () => {
      checkMode();
      updateColorSchma();
    });
    const checkMode = () => {
      let isDarkMode = window.localStorage.getItem("color-theme") === "dark";
      let attrValue = isDarkMode ? "dark" : "light";
      document.body.dataset["bsTheme"] = attrValue;
    };
    checkMode();
    const updateColorSchma = () => {
      /** @type { HTMLElement | null } */
      const r = document.querySelector(":root");
      if (!r) {
        return;
      }
      const mainBgColor = getComputedStyle(
        parent.document.body,
      ).backgroundColor;
      r.style.setProperty("--bs-body-bg-custom", mainBgColor);
      r.style.setProperty("--bs-body-bg-rgb-custom", mainBgColor);
    };
    document.addEventListener("DOMContentLoaded", function () {
      updateColorSchma();
    });
  };
  const getEditForm = () => {
    const types = Object.keys(Formio.Components.components);
    /** @type {any} */
    const resultObject = {};
    types.forEach(
      (x) =>
        (resultObject[x] = [
          {
            key: "api",
            ignore: true,
          },
        ]),
    );
    return resultObject;
  };

  onMount(async () => {
    await import("../FormComponents/FormIoComponents/ActionButtons");
    await import("../FormComponents/FormIoComponents/LookupComponent");
    await import("@formio/js/dist/formio.full.min.css");
    await import("../FormComponents/styles/main.css");
    Formio = (await import("@formio/js")).Formio;

    onInit();
    if (afterMount) {
      afterMount();
      afterMount = null;
    }
  });
</script>

<div id="builder"></div>
