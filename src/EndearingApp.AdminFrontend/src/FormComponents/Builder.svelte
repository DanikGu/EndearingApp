<script>
  import { onMount } from "svelte";

  /** @type {any} */
  export let currentSchema = null;
  /** @type {any} */
  export let currentComponents = null;
  /** @type {any} */
  let Formio;

  const setupBuilder = () => {
    Formio.builder(document.getElementById("builder"), currentSchema ?? {}, {
      display: "form",
      editForm: {},
      noNewEdit: true,
      noDefaultSubmitButton: true,
      builder: {
        resource: false,
        advanced: false,
        premium: false,
        custom: currentComponents ?? {},
      },
    }).then(function (/** @type {any} */ instance) {
      var onBuild = function (/** @type {any} */ build) {
        currentSchema = instance.schema;
      };
      instance.on("change", onBuild);
    });
  };

  onMount(async () => {
    await import("../FormComponents/FormIoComponents/ActionButtons");
    await import("../FormComponents/FormIoComponents/LookupComponent");
    await import("@formio/js/dist/formio.full.min.css");
    await import("../FormComponents/styles/main.css");
    Formio = (await import("@formio/js")).Formio;
    setupBuilder();
  });
</script>

<div id="builder"></div>
