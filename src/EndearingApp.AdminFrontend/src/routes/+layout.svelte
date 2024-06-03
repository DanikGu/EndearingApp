<script>
    import TopMenu from "$lib/Components/shared/top-menu.svelte";
    import "../app.css";
</script>


<TopMenu></TopMenu>
<div id="main" class="pl-4 ">
    <slot></slot>
</div>