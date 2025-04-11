<script>
  import { onMount } from "svelte";
  onMount(() => {
    setupColors();
  });

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
  <slot></slot>
</div>
<div class="bg-white"></div>

<style>
  @import "https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css";
  @import "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css";
</style>
