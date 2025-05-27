<script>
  import { onMount } from "svelte";
  import { ensureTypeConfig } from "../../utils/fieldtypesutils";
  import "../../app.css";
  import {
    Nav,
    Navbar,
    NavItem,
    NavbarBrand,
    NavLink,
    ThemeToggler,
    Button,
    Row,
    Icon,
    Col,
  } from "@sveltestrap/sveltestrap";
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
  let currentColorMode = $state("dark");
  const toggleColorMode = () => {
    // @ts-ignore
    window.togglePageTheme();
    // @ts-ignore
    currentColorMode = window.getCurrentTheme();
  };
  onMount(() => {
    ensureTypeConfig();
    // @ts-ignore
    currentColorMode = window.getCurrentTheme();
  });
</script>

<Navbar>
  <NavbarBrand href="/">
    <Row>
      <div class="w-auto">
        <div class="bg-white p-2 rounded-lg me-3">
          <img src="/EndearingApp.svg" class="h-5 sm:h-9" alt="App Logo" />
        </div>
      </div>
      <Col xs="6" class="justify-items-center content-center">
        <div>EndearingApp</div>
      </Col>
    </Row>
  </NavbarBrand>
  <Nav>
    <NavItem>
      <NavLink href="/DataCustomizations">Data Customizations</NavLink>
    </NavItem>
    <NavItem>
      <NavLink href="/FormEditor">Form Editor</NavLink>
    </NavItem>
    <NavItem>
      <NavLink href="/OdataExplorer">Odata Explorer</NavLink>
    </NavItem>
  </Nav>
  <ThemeToggler>
    {#if currentColorMode == "dark"}
      <Button outline color="light" on:click={() => toggleColorMode()}>
        <Icon name="moon" />
      </Button>
    {/if}
    {#if currentColorMode == "light"}
      <Button outline color="dark" on:click={() => toggleColorMode()}>
        <Icon name="sun" />
      </Button>
    {/if}
  </ThemeToggler>
</Navbar>
{@render children?.()}
<div
  class="globalToastContainer fixed right-0 bottom-0 flex gap-1 flex-col"
></div>
