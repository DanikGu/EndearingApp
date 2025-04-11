<script>
  import { Button, Input, Label } from "flowbite-svelte";
  import { applyChangesToDbApi } from "../../apiClientsWrapper";
  import { assignBlockingLoader, assignLoader } from "@utils/uiutils";
  import { OptionDTO, OptionSetDefinitionsApi } from "@apiclients/src";

  /** @typedef {import('../../apiclient/src/model/OptionSetDefinitionDTO').default} OptionSetDefinitionDTO */

  /** @type {OptionSetDefinitionDTO[]} */
  export let optionSets;
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
    if (isNew) {
      let prom = new Promise((res, rej) => {
        const callback = (
          // @ts-ignore
          error,
          /** @type {OptionSetDefinitionDTO} */ data,
        ) => {
          if (data) {
            debugger;
            isNew = false;
            optionSet = data;
            optionSets.push(data);
            res(data);
          } else if (error) {
            rej(error);
          }
          reloadParentData();
        };
        api.apiOptionSetDefinitionsPost(
          {
            /** @type { Partial<OptionSetDefinitionDTO> } */
            body: {
              name: optionSet.name,
              options: optionSet.options,
            },
          },
          callback,
        );
      });

      assignLoader("Saving Option set", prom);
      await prom;
    } else {
      let prom = new Promise((res, rej) => {
        // @ts-ignore
        const callback = (error, data) => {
          reloadParentData();
          res(data);
        };
        api.apiOptionSetDefinitionsIdPut(
          optionSet.id,
          {
            /** @type { Partial<OptionSetDefinitionDTO> } */
            body: {
              id: optionSet.id,
              name: optionSet.name,
              options: optionSet.options,
            },
          },
          callback,
        );
      });

      assignLoader("Saving Option Set", prom);
      await prom;
    }
  };
  const deleteOptionSet = async () => {
    var api = new OptionSetDefinitionsApi();
    if (isNew) {
      return;
    }
    let prom = new Promise((res) => {
      const callback = () => {
        reloadParentData();
        res(true);
      };
      api.apiOptionSetDefinitionsIdDelete(optionSet.id, callback);
    });

    assignLoader("Deleting Option Set", prom);
    await prom;
  };
  let keyInput = "";
  let valueInput = "";
  function addItem() {
    if (!Number.isInteger(keyInput) || !valueInput) {
      return;
    }
    optionSet.options = [
      ...(optionSet.options ?? []),
      { value: keyInput, name: valueInput },
    ];
    keyInput = "";
    valueInput = "";
  }
  /** @param {OptionDTO} optionToDelete */
  function deleteItem(optionToDelete) {
    optionSet.options = optionSet.options.filter(
      (/** @type {OptionDTO} */ option) => option !== optionToDelete,
    );
  }
</script>

<div class="relative flex flex-col">
  <div class="flex flex-row justify-between">
    <div class="grid grid-cols-2 gap-4 w-full">
      <div class="mb-6 max-w-48 p-2">
        <Label for="large-input" class="block mb-2">Name</Label>
        <Input placeholder="Name of Option Set" bind:value={optionSet.name} />
      </div>
      <div class="flex flex-row gap-3 p-2 mb-auto ml-auto">
        <Button
          on:click={applyChangesToDb}
          class="h-10 mx-0"
          outline
          color="purple"
          >Apply to DB
        </Button>
        <Button
          on:click={saveOptionSet}
          class="h-10 mx-0"
          outline
          color="green"
        >
          Save
        </Button>
        <Button
          on:click={deleteOptionSet}
          class="h-10 mx-0"
          outline
          color="red"
        >
          Delete
        </Button>
      </div>
      <div>
        <div class="p-2 max-w-md mr-auto flex flex-row gap-3">
          <div
            class="block mb-1 text-sm font-medium text-gray-900 dark:text-white w-56"
          >
            Key
          </div>
          <div
            class="block mb-1 text-sm font-medium text-gray-900 dark:text-white w-96"
          >
            Value
          </div>
        </div>
        {#each optionSet.options as item}
          <div class="p-2 max-w-md mr-auto flex flex-row gap-3">
            <Input
              bind:value={item.value}
              placeholder="Enter key"
              type="number"
            />
            <Input bind:value={item.name} placeholder="Enter value" />
            <Button
              class="mt-auto w-60"
              outline
              on:click={() => deleteItem(item)}
              color="red"
            >
              Delete
            </Button>
          </div>
        {/each}
        <div class="p-2 max-w-md mr-auto flex flex-row gap-3">
          <Input bind:value={keyInput} placeholder="Enter key" type="number" />
          <Input bind:value={valueInput} placeholder="Enter value" />
          <Button class="mt-auto w-60" outline on:click={addItem} color="green">
            Add
          </Button>
        </div>
      </div>
    </div>
  </div>
</div>
