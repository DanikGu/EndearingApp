<script>
	// @ts-nocheck
	import { EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';
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
    export let deleteRelationship;
    export let addRelationship;
    export let editRelationship;
	export let customEntities;
	export let customEntity;
	const getFieldNameById = (customeEntityId, fieldId) => {
		return customEntities.find(x => x.id == customeEntityId).fields.find(x => x.id == fieldId).name;
	} 
	const getCustomEntityNameById = (customeEntityId) => {
		return customEntities.find(x => x.id == customeEntityId).name;
	}	 
</script>

<Label>Relationship</Label>
<Table hoverable={true} shadow>
	<TableHead defaultRow={false}>
		<tr>
			<TableHeadCell colspan="4">
				<Button size="xs" outline color="light" on:click={addRelationship}>Add New</Button>
			</TableHeadCell>
		</tr>
		<tr>
			<TableHeadCell>From Field</TableHeadCell>
			<TableHeadCell>To Table</TableHeadCell>
			<TableHeadCell>To Field</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</tr>
	</TableHead>
	<TableBody class="divide-y">
		{#if !customEntity || customEntity?.relationships?.length == 0}
			<TableBodyRow>
				<TableBodyCell colspan="4">
					<div>No relationships so far</div>
				</TableBodyCell>
			</TableBodyRow>
		{:else}
			{#each customEntity.relationships as relationship}
				<TableBodyRow>
					<TableBodyCell>{getFieldNameById(customEntity.id, relationship.sourceFieldId) ?? ''}</TableBodyCell>
					<TableBodyCell>{getCustomEntityNameById(relationship.referencedCustomEntityId) ?? ''}</TableBodyCell>
					<TableBodyCell>{getFieldNameById(relationship.referencedCustomEntityId, relationship.referencedFieldId) ?? ''}</TableBodyCell>
					<TableBodyCell>
						<Button outline={true} class="!p-2" size="xs" on:click={() => editRelationship(relationship.id)}>
							<EditOutline class="h-3" size="xs" />
						</Button>
						<Button outline={true} class="!p-2" size="xs" on:click={() => deleteRelationship(relationship.id)}>
							<TrashBinOutline class="h-3" size="xs" />
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		{/if}
	</TableBody>
</Table>

