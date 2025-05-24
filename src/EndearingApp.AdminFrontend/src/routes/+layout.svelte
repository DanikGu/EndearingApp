<script>
  import { Theme } from "@sveltestrap/sveltestrap";
  import { onMount } from "svelte";
  /** @type {string} */
  let theme;
  onMount(() => {
    // @ts-ignore
    window.getCurrentTheme();
    // @ts-ignore
    theme = window.getCurrentTheme();
    // @ts-ignore
    window.addChangeThemeCallback(() => {
      // @ts-ignore
      theme = window.getCurrentTheme();
    });
  });
</script>

<Theme {theme}>
  <slot></slot>
</Theme>
