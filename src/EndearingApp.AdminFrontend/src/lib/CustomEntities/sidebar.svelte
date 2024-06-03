<script>
	// @ts-nocheck
	import { Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	export let EndearingAppList;
	export let onItemClick;
  	export let onNewClick;
	onMount(() => {
		console.log(EndearingAppList)
		EndearingAppList = EndearingAppList ?? [];
		EndearingAppList = [...EndearingAppList, { name: "Add New", icon: PlusOutline,  isAdd: true}];
		console.log(EndearingAppList)
	});
</script>

<div class="flex flex-col pr-6">
	<div class="text-xl">Custom Entities</div>
	<Listgroup active bind:items={EndearingAppList} let:item class="w-48" on:click={e => e.detail.isAdd ? onNewClick(e) : onItemClick(e)}>
		{#if item && item.icon}
			<svelte:component this={item.icon} class="w-4 h-4 me-2.5"/>
		{/if}
		{item && item.name}
	</Listgroup>
</div>
