<script>
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>
<Navbar  >
    <NavBrand href="/">
      <img src="/images/EndearingApp.svg" class="me-3 h-6 sm:h-9" alt="Endearing CRM" />
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Endearing CRM</span>
    </NavBrand>
    <NavHamburger  />
    <NavUl >
      <NavLi href="/">Home</NavLi>
      <NavLi href="/about">About</NavLi>
      <NavLi href="/CustomEntities">Custom Entities</NavLi>
    </NavUl>
</Navbar>