<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import Sidebar from '$lib/CustomEntities/sidebar.svelte';
	import Edit from '$lib/CustomEntities/edit.svelte';
	import { getUUID } from '$lib/utils';
	import { LoadCustomeEntitites, DeleteCustomEntity } from '$lib/ApiClient/CustomEntity';
	let customeEntities = [];
	let selectedEntity = null;
	let sidebarConfig = null;
	let isNew = false;
	const deleteEntity = async (name) => {
		if ((selectedEntity.name = name)) {
			selectedEntity = null;
		}
		await DeleteCustomEntity(name);
		loadSideBar();
	};
	const addEntityCallback = async () => {
		loadSideBar();
	};
	const loadSideBar = async () => {
		customeEntities = await LoadCustomeEntitites();
		console.log(customeEntities);
		sidebarConfig = {
			key: getUUID(),
			EndearingAppList: customeEntities.map((x) => {
				return { name: x.name, id: x.id };
			}),
			onItemClick: (e) => {
				selectedEntity = customeEntities.find((x) => x.id == e.detail.id);
				isNew = false;
			},
			onNewClick: (e) => {
				isNew = true;
				selectedEntity = {
					id: getUUID(),
					name: '',
					fields: [
						{
							id: getUUID(),
							name: 'Id',
							type: 13,
							size: null,
							isPrimaryKey: true
						}
					],
					relationships: []
				};
			}
		};
	};
	onMount(async function () {
		loadSideBar();
	});
</script>

<div class="flex">
	{#if !!sidebarConfig}
		{#key sidebarConfig.key}
			<Sidebar
				bind:EndearingAppList={sidebarConfig.EndearingAppList}
				onItemClick={sidebarConfig.onItemClick}
				onNewClick={sidebarConfig.onNewClick}
			/>
		{/key}
	{:else}
		<div>Lodaing...</div>
	{/if}
	{#if selectedEntity === null}
		<div class="flex w-full h-full items-center justify-center">
			<div>Select entity</div>
		</div>
	{:else}
		<Edit customEntities={customeEntities} customEntity={selectedEntity} {isNew} {deleteEntity} addEntityCallback={addEntityCallback}/>
	{/if}
</div>
