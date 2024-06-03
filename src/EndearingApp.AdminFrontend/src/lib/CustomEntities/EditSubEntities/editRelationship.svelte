<script>
	// @ts-nocheck
	import { Modal, Button, Label, Input, Select, Checkbox } from 'flowbite-svelte';
	export let open;
	export let relationshipModel;
	export let handleSave;
	export let customEntity;
	export let customEntities;

	$: sourceFieldsOptions = customEntity.fields.map(x => { return {  name: x.name, value: x.id } });
	$: customEmtitiesOptions = customEntities.map(x => { return {  name: x.name, value: x.id } });
	$: referencedFieldsOptions = relationshipModel.referencedCustomEntityId ? 
		customEntities.find(x => x.id == relationshipModel.referencedCustomEntityId).
		fields.map(x => { return {  name: x.name, value: x.id } }) : 
		[];
</script>
<Modal title="Edit" bind:open autoclose>
	<div class="mb-6">
		<Label for="name" class="block mb-2">Constraint Name</Label>
		<Input id="name" placeholder="Constraint Name" bind:value={relationshipModel.constraintName} />
	</div>
	<div class="mb-6">
		<Label for="field-type" class="block mb-2">Source Field</Label>
		<Select id="field-type" class="mt-2" items={sourceFieldsOptions} bind:value={relationshipModel.sourceFieldId} />
	</div>
	<div class="mb-6">
		<Label for="field-type" class="block mb-2">Referenced Table</Label>
		<Select id="field-type" class="mt-2" items={customEmtitiesOptions} bind:value={relationshipModel.referencedCustomEntityId} />
	</div>
	<div class="mb-6">
		<Label for="field-type" class="block mb-2">Referenced Field</Label>
		<Select id="field-type" class="mt-2" items={referencedFieldsOptions} bind:value={relationshipModel.referencedFieldId} />
	</div>
	<svelte:fragment slot="footer">
		<Button
			on:click={() => {
				if (handleSave) {
					handleSave(relationshipModel);
				}
			}}
		>Save</Button>
		<Button color="alternative">Cancle</Button>
	</svelte:fragment>
</Modal>