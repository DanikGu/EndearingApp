<script>
	// @ts-nocheck
	import { Label, Input, Button, ButtonGroup, Spinner } from 'flowbite-svelte';
	import FieldsTable from './fieldsTable.svelte';
	import RelationshipsTable from './relationshipsTable.svelte';
	import EditField from './EditSubEntities/editField.svelte';
	import { SaveCustomEntity } from '$lib/ApiClient/CustomEntity';
	import { TrashBinOutline } from 'flowbite-svelte-icons';
	import { getUUID } from '$lib/utils';
	import ShadowLoading from '$lib/Components/shared/shadowLoading.svelte';
	import EditRelationship from './EditSubEntities/editRelationship.svelte';
	export let customEntity;
	export let customEntities;
	export let isNew = false;
	export let deleteEntity = (name) => {};
	export let addEntityCallback = async () => {};
	$: isEdit = !isNew;
	let isLoading = false;
	let editFieldOpen = false;
	let editRealationshipOpen = false;
	let editedField = {};
	let editedRealationship = {};
	let fieldsKey = getUUID();
	let relationshipsKey = getUUID();
	console.log(customEntity);
	const editField = async (id) => {
		editFieldOpen = true;
		editedField = customEntity.fields.find((x) => x.id === id);
	};
	const addField = async () => {
		editFieldOpen = true;
		editedField = {
			id: getUUID(),
			name: "",
			type: "",
			size: null,
			isPrimaryKey: false
		}
	}
	const deleteField = async (id) => {
		customEntity.fields = customEntity.fields.filter((x) => x.id !== id);
	};
	const editRelationship = async (id) => {
		editRealationshipOpen = true;
		editedRealationship = customEntity.relationships.find((x) => x.id === id);
		console.log(editedRealationship);
	};
	const addRelationship = async () => {
		editRealationshipOpen = true;
		editedRealationship = {
			id : getUUID(),
			sourceCustomEntityId : customEntity.id,
        	sourceFieldId : "",
        	referencedFieldId : "",
        	referencedCustomEntityId : "",
        	constraintName : ""
		}
		console.log(editedRealationship);
	};
	const deleteRelationship = async (id) => {
		customEntity.relationships = customEntity.relationships.filter((x) => x.id !== id);
	};
	const handleSave = async () => {
		isLoading = true;
		try 
		{
			console.log(customEntity);
			await SaveCustomEntity(customEntity, isNew);
			if (isNew) {
				await addEntityCallback();
				isNew = false;
			}
		}
		catch {
			showErrorModal("Chlen")
		}
		isLoading = false;
	};
	const handleAddField = (field) => {
		let isFieldExists = customEntity.fields.some(x => x === field);
		console.log(isFieldExists);
		if (!isFieldExists) 
		{
			customEntity.fields = [...customEntity.fields, field];
		}
		fieldsKey = getUUID();
	}
	const handleAddRelationship = (relationship) => {
		let isRelationshipExists = customEntity.relationships.some(x => x === relationship);
		console.log(isRelationshipExists);
		if (!isRelationshipExists) 
		{
			customEntity.relationships = [...customEntity.relationships, relationship];
		}
		relationshipsKey = getUUID();
	}
	const showErrorModal = (msg) => {
		alert(msg);
	}
</script>

<div>
	{#if isLoading}
		<ShadowLoading text="Loading..." />
	{/if}
	
	<div class="mb-6 grid grid-cols-2 ">
		<Label for="large-input" class="block mb-2">Name</Label>
		<ButtonGroup class="shadow-none justify-end">
			<Button class="max-w-28" color="green" on:click={handleSave}> Save </Button>
			{#if isEdit}
				<Button class="!p-2" size="xs" color="red" on:click={() => deleteEntity(customEntity.name)}>
					<TrashBinOutline class="h-3" size="xs" />
				</Button>
			{/if}
		</ButtonGroup>
		<Input
			class="max-w-60"
			id="large-input"
			bind:disabled={isEdit}
			placeholder="Name"
			required
			bind:value={customEntity.name}
		/>
	</div>
	<div class="grid grid-cols-2">
		<div class="mr-6">
			{#key fieldsKey}
				<FieldsTable 
					bind:fields={customEntity.fields} 
					{deleteField} 
					{editField} 
					{addField}>
				</FieldsTable>
			{/key}
		</div>
		<div>
			{#key relationshipsKey}
				<RelationshipsTable
					bind:customEntity={customEntity} 
					bind:customEntities={customEntities} 
					{deleteRelationship}
					{addRelationship}
					{editRelationship}>
				</RelationshipsTable>
			
			{/key}
		</div>
	</div>
	<EditField bind:open={editFieldOpen} fieldModel={editedField} handleSave={handleAddField}></EditField>
	{#key fieldsKey}
		<EditRelationship 
			bind:customEntity={customEntity} 
			bind:customEntities={customEntities} 
			bind:open={editRealationshipOpen} 
			bind:relationshipModel={editedRealationship} 
			handleSave={handleAddRelationship}>
		</EditRelationship>
	{/key}
</div>
