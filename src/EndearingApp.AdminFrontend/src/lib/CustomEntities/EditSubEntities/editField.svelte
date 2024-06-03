<script>
	// @ts-nocheck
	import { GetDbTypesSetting } from '$lib/ApiClient/Setting';
	import { Modal, Button, Label, Input, Select, Checkbox } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	export let open;
	export let fieldModel;
	export let handleSave;
	let dbTypesSetting = {};
	let options = [];
	$: stringSize = `${fieldModel.size ?? ''}`;
	const setFieldSize = (event) => {
		let value = null;
		console.log(event.target.value);
		let parsedValue = parseInt(event.target.value);
		console.log(parsedValue);
		if (parsedValue !== NaN) {
			value = parsedValue;
		}
		fieldModel.size = value;
		console.log(fieldModel.size);
		stringSize = `${fieldModel.size ?? ''}`;
	};
	const getTypeConfig = (type) => {
		if (!dbTypesSetting.typesConfig) {
			return;
		}
		console.log(type);
		const config = dbTypesSetting.typesConfig[`${type.toString()}`] ?? {
			IsSizeAplicable: true,
			IsPrimaryKeyAplicable: true
		};
		return config;
	};
	$: IsSizeAplicable =
		(fieldModel && fieldModel.type && getTypeConfig(fieldModel.type)?.IsSizeAplicable) || false;
	$: isPrimaryKeyApplicable =
		(fieldModel && fieldModel.type && getTypeConfig(fieldModel.type)?.IsPrimaryKeyAplicable) ||
		false;
	async function LoadDbTypesSetting() {
		dbTypesSetting = await GetDbTypesSetting();
		console.log(dbTypesSetting);
		options = Object.entries(dbTypesSetting.typesConfig).map(([key, value]) => {
			//console.log(key , value);
			return {
				name: value.Name,
				value: parseInt(key)
			};
		});
	}
</script>

{#await LoadDbTypesSetting()}
	<div>Loading...</div>
{:then nothing}
	<Modal title="Edit" bind:open autoclose>
		<div class="mb-6">
			<Label for="name" class="block mb-2">Field Name</Label>
			<Input id="name" placeholder="Field Name" bind:value={fieldModel.name} />
		</div>
		<div class="mb-6">
			<Label for="field-type" class="block mb-2">Field Type</Label>
			<Select id="field-type" class="mt-2" items={options} bind:value={fieldModel.type} />
		</div>
		{#if IsSizeAplicable}
			<div class="mb-6">
				<Label for="size-input" class="block mb-2">Field Size</Label>
				<Input
					id="size-input"
					placeholder="Size"
					type="number"
					on:change={setFieldSize}
					value={stringSize}
				/>
			</div>
		{/if}
		{#if isPrimaryKeyApplicable}
			<div class="mb-6">
				<Checkbox id="is-primary-key" bind:checked={fieldModel.isPrimaryKey}>Is Primary</Checkbox>
			</div>
		{/if}
		<svelte:fragment slot="footer">
			<Button
				on:click={() => {
					if (handleSave) {
						handleSave(fieldModel);
					}
				}}>Save</Button
			>
			<Button color="alternative">Cancle</Button>
		</svelte:fragment>
	</Modal>
{/await}
