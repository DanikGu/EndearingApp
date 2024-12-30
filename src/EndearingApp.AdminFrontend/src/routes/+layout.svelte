<script>
  import { onMount } from "svelte";
  import "../app.css";
  import { ensureTypeConfig } from "../utils/fieldtypesutils";
  import {
    DarkMode,
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
  } from "flowbite-svelte";
  let darkmodebtn =
    "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5  z-50";
  onMount(() => {
    ensureTypeConfig();
  });
</script>

<Navbar>
  <NavBrand href="/">
    <div class="bg-white p-2 rounded-lg me-3">
      <img src="/EndearingApp.svg" class="h-5 sm:h-9" alt="App Logo" />
    </div>
    <span
      class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
      >EndearingApp</span
    >
  </NavBrand>
  <NavHamburger></NavHamburger>
  <NavUl>
    <NavLi href="/">Home</NavLi>
    <NavLi href="/DataCustomizations">Data Customizations</NavLi>
    <NavLi href="/OdataExplorer">Odata Explorer</NavLi>
  </NavUl>
  <DarkMode btnClass={darkmodebtn}></DarkMode>
</Navbar>
<slot></slot>
<div
  class="globalToastContainer fixed right-0 bottom-0 flex gap-1 flex-col"
></div>
