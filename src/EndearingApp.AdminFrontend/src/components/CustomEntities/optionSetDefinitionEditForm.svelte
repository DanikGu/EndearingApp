<script>
  import { Button, Input, Label } from "flowbite-svelte";
  import { applyChangesToDbApi } from "../../apiClientsWrapper";
  import { assignBlockingLoader } from "@utils/uiutils";

  /** @typedef {import('../../apiclient/src/model/OptionSetDefinitionDTO').default} OptionSetDefinitionDTO */
  /** @type {OptionSetDefinitionDTO} */

  export let optionSet;
  /** @type {boolean} */

  export let isNew;

  /** @type {Function} */
  export let reloadParentData;

  const applyChangesToDb = () => {
    const prom = applyChangesToDbApi();
    assignBlockingLoader("Updating Db", prom);
  };
  const saveOptionSet = () => {
    if (isNew) {
    } else {
    }
  };
  const deleteOptionSet = () => {};
</script>

<div class="relative flex flex-col">
  <div class="flex flex-row justify-between">
    <div class="grid grid-cols-2 gap-4">
      <div class="mb-6 max-w-48 p-2">
        <Label for="large-input" class="block mb-2">Name</Label>
        <Input placeholder="Name of Option Set" bind:value={optionSet.name} />
      </div>
    </div>
    <div class="flex flex-row gap-3 p-2 mb-auto">
      <Button
        on:click={applyChangesToDb}
        class="h-10 mx-0"
        outline
        color="purple"
        >Apply to DB
      </Button>
      <Button on:click={saveOptionSet} class="h-10 mx-0" outline color="green">
        Save
      </Button>
      <Button on:click={deleteOptionSet} class="h-10 mx-0" outline color="red">
        Delete
      </Button>
    </div>
  </div>
</div>
