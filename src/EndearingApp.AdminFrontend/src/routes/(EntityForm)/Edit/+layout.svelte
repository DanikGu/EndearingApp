<script>
  import { onMount } from "svelte";

  onMount(() => {
    checkMode();
    window.addEventListener("storage", () => {
      checkMode();
    });
  });

  const checkMode = () => {
    let isDarkMode = window.localStorage.getItem("color-theme") === "dark";
    let attrValue = isDarkMode ? "dark" : "light";
    document.body.dataset["bsTheme"] = attrValue;
  };
</script>

<slot></slot>

<div class="bg-white"></div>

<style>
  @import "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css";
  @import "https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css";
  @import "https://cdn.form.io/formiojs/formio.form.min.css";
  @import "../Edit/layout.css";
</style>
