<script>
  import { onMount } from "svelte";
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
  onMount(() => {
    setupColors();
  });

  const setupColors = () => {
    window.addEventListener("storage", () => {
      checkMode();
      updateColorSchma();
    });
    const checkMode = () => {
      let isDarkMode =
        parent.document.documentElement.getAttribute("data-bs-theme") === "dark" ||
        window.localStorage.getItem("themePreference") === "dark";
      let attrValue = isDarkMode ? "dark" : "light";
      document.body.dataset["bsTheme"] = attrValue;
      document.documentElement.classList.toggle("dark", isDarkMode);
    };
    const updateColorSchma = () => {
      /** @type { HTMLElement | null } */
      const r = document.querySelector(":root");
      const mainBgColor = getComputedStyle(
        parent.document.body,
      ).backgroundColor;
      console.log("bg-color:", mainBgColor);
      if (mainBgColor) {
        r?.style.setProperty("--bs-body-bg-custom", mainBgColor);
        r?.style.setProperty("--bs-body-bg-rgb-custom", mainBgColor);
      }
    };
    checkMode();
    updateColorSchma();
  };
</script>

<div id="form-container">
  {@render children?.()}
</div>
<div class="bg-white"></div>

<style>
  @import "https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css";
  @import "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css";
</style>
