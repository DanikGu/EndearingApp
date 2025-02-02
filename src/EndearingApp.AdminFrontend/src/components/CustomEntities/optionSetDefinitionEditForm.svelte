<script>
  import { Button, Input, Label } from "flowbite-svelte";
  import { applyChangesToDbApi } from "../../apiClientsWrapper";
  import { assignBlockingLoader, assignLoader } from "@utils/uiutils";
  import { OptionSetDefinitionsApi } from "@apiclients/src";

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
  const saveOptionSet = async () => {
    var api = new OptionSetDefinitionsApi();
    console.log("0");
    if (isNew) {
      console.log("1");
      var prom = new Promise((res, rej) => {
        // @ts-ignore
        const callback = (error, data) => {
          reloadParentData();
          if (data) {
            res(data);
          } else if (error) {
            rej(error);
          }
        };
        api.apiOptionSetDefinitionsPost(
          {
            /** @type { Partial<OptionSetDefinitionDTO> } */
            body: {
              name: optionSet.name,
            },
          },
          callback,
        );
      });

      assignLoader("Saving Option set", prom);
      await prom;
    } else {
      console.log("2");
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
