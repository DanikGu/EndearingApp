<script>
  import { Theme } from "@sveltestrap/sveltestrap";
  import { onMount } from "svelte";
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
  /** @type {string} */
  let theme = $state("light");
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
  {@render children?.()}
</Theme>
