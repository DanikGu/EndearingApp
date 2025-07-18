<script>
  import { onMount } from "svelte";

  /**
   * @typedef {Object} Props
   * @property {any} [currentSchema]
   * @property {any} [currentComponents]
   */

  /** @type {Props} */
  let { currentSchema = $bindable(null), currentComponents = $bindable(null) } =
    $props();
  /** @type {any} */
  let Formio = $state(null);

  $effect(() => {
    if (!Formio) {
      return;
    }
    let currSchema = $state.snapshot(currentSchema);
    Formio.builder(document.getElementById("builder"), currSchema ?? {}, {
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
      var onBuild = function (/** @type {any} */ _) {
        currentSchema = instance.schema;
      };
      instance.on("change", onBuild);
    });
  });
  onMount(async () => {
    await import("../FormComponents/FormIoComponents/ActionButtons");
    await import("../FormComponents/FormIoComponents/LookupComponent");
    await import("@formio/js/dist/formio.full.min.css");
    await import("../FormComponents/styles/main.css");
    Formio = (await import("@formio/js")).Formio;
  });
</script>

<div id="builder"></div>
