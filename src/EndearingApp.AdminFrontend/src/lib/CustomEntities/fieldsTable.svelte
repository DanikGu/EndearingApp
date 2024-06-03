<script>
	// @ts-nocheck
	import { GetDbTypesSetting } from '$lib/ApiClient/Setting';
	import { EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import {
		Label,
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	export let fields;
	export let deleteField;
	export let addField;
	export let editField;
	let dbTypesSetting = {};
	const dbTypeToUserFriendlyType = (dbType) => {
		try {
			
			let displayName = dbTypesSetting.typesConfig[dbType].Name;

			return displayName;
		} catch {
			return dbType;
		}
	};
	async function LoadDbTypesSetting() {
		dbTypesSetting = await GetDbTypesSetting();
	}
</script>

{#await LoadDbTypesSetting()}
	<div>Loading...</div>
{:then nothing}

<Label>Fields</Label>
<Table hoverable={true} shadow>
	<TableHead defaultRow={false}>
		<tr>
			<TableHeadCell colspan="5">
				<Button size="xs" outline color="light" on:click={addField}>Add New</Button>
			</TableHeadCell>
		</tr>
		<tr>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Type</TableHeadCell>
			<TableHeadCell>Size</TableHeadCell>
			<TableHeadCell>Is Primary Key</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</tr>
	</TableHead>
	<TableBody class="divide-y">
		{#if fields?.length == 0 || !dbTypesSetting}
			<TableBodyRow>
				<TableBodyCell colspan="5">
					<div>No fields so far</div>
				</TableBodyCell>
			</TableBodyRow>
		{:else}
			{#each fields as field}
				<TableBodyRow>
					<TableBodyCell>{field.name ?? ''}</TableBodyCell>
					<TableBodyCell>{dbTypeToUserFriendlyType(field.type) ?? ''}</TableBodyCell>
					<TableBodyCell>{field.size ?? ''}</TableBodyCell>
					<TableBodyCell>{field.isPrimaryKey ?? false}</TableBodyCell>
					<TableBodyCell>
						<Button outline={true} class="!p-2" size="xs" on:click={() => editField(field.id)}>
							<EditOutline class="h-3" size="xs" />
						</Button>
						<Button outline={true} class="!p-2" size="xs" on:click={() => deleteField(field.id)}>
							<TrashBinOutline class="h-3" size="xs" />
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		{/if}
	</TableBody>
</Table>
{/await}