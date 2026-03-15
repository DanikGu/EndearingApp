<script>
  import {
    Button,
    Input,
    Label,
    Row,
    Col,
    FormGroup,
  } from "@sveltestrap/sveltestrap";
  import { applyChangesToDbApi } from "../../apiClientsWrapper";
  import { assignBlockingLoader, assignLoader } from "@utils/uiutils";
  import { OptionDTO, OptionSetDefinitionsApi } from "@apiclients/src";
  import { fetchOptionSets } from "../../stores/global";

  /** @typedef {import('../../apiclient/src/model/OptionSetDefinitionDTO').default} OptionSetDefinitionDTO */
  /** @typedef {import('../../apiclient/src/model/OptionDTO').default} OptionDTO_local */

  /**
   * @typedef {Object} Props
   * @property {OptionSetDefinitionDTO | null} optionSet
   * @property {boolean} isNew
   */

  /** @type {Props} */
  let {
    optionSet = $bindable(),
    isNew = $bindable(),
  } = $props();

  let optionsKey = $state(crypto.randomUUID());
  /** @type {HTMLDivElement | null | undefined} */
  let formContainer = $state();

  const applyChangesToDb = () => {
    const prom = applyChangesToDbApi();
    assignBlockingLoader("Updating Db", prom, formContainer);
  };

  const saveOptionSet = async () => {
    if (!optionSet) return;
    const os = optionSet; // local non-null reference
    var api = new OptionSetDefinitionsApi();
    if (isNew) {
      let prom = new Promise((res, rej) => {
        const callback = (
          // @ts-ignore
          error,
          /** @type {OptionSetDefinitionDTO} */ data,
        ) => {
          if (data) {
            isNew = false;
            os.id = data.id;
            if (!os.options) os.options = [];
            // Update local optionSet with data from server
            optionSet = { ...os, ...data };
            // Refresh the global store
            fetchOptionSets();
            res(data);
          } else if (error) {
            rej(error);
          }
        };
        api.apiOptionSetDefinitionsPost(
          {
            /** @type { Partial<OptionSetDefinitionDTO> } */
            body: {
              name: os.name,
              options: os.options || [],
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
          if (error) rej(error);
          else {
            // Refresh the global store
            fetchOptionSets();
            res(data);
          }
        };
        api.apiOptionSetDefinitionsIdPut(
          os.id,
          {
            /** @type { Partial<OptionSetDefinitionDTO> } */
            body: {
              id: os.id,
              name: os.name,
              options: os.options || [],
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
    if (isNew || !optionSet || !optionSet.id) {
      // If it's a new unsaved option set, clear selection
      optionSet = null;
      return;
    }
    const os = optionSet; // local non-null reference
    let prom = new Promise((res, rej) => {
      // @ts-ignore
      const callback = (error, data) => {
        if (error) {
          rej(error);
        } else {
          // Refresh the global store
          fetchOptionSets();
          res(true);
        }
      };
      api.apiOptionSetDefinitionsIdDelete(os.id, callback);
    });

    assignLoader("Deleting Option Set", prom);
    try {
      await prom;
    } catch (error) {
      console.error("Failed to delete option set", error);
    }
  };

  let keyInput = $state("");
  let valueInput = $state("");

  function addItem() {
    if (!optionSet) return;
    const numericKey = parseInt(keyInput);
    if (isNaN(numericKey) || !valueInput.trim()) {
      return;
    }
    const newOption = { value: numericKey, name: valueInput.trim() };
    optionSet.options = [...(optionSet.options || []), newOption];
    keyInput = "";
    valueInput = "";
    optionsKey = crypto.randomUUID();
  }

  /** @param {OptionDTO_local} optionToDelete */
  function deleteItem(optionToDelete) {
    if (!optionSet || !optionSet.options) return;
    optionSet.options = optionSet.options.filter(
      (/** @type {OptionDTO_local} */ option) =>
        !(
          option.value === optionToDelete.value &&
          option.name === optionToDelete.name
        ),
    );
    optionsKey = crypto.randomUUID();
  }
</script>

{#if optionSet}
<div class="position-relative d-flex flex-column p-3" bind:this={formContainer}>
  <Row class="mb-4 align-items-start">
    <Col md="6">
      <FormGroup>
        <Label for="optionSetName" class="mb-2">Name</Label>
        <Input
          id="optionSetName"
          placeholder="Name of Option Set"
          bind:value={optionSet.name}
        />
      </FormGroup>
    </Col>
    <Col
      md="6"
      class="d-flex justify-content-md-end align-items-start gap-2 mt-3 mt-md-0"
    >
      <Button on:click={applyChangesToDb} outline color="info">
        Apply to DB
      </Button>
      <Button on:click={saveOptionSet} outline color="success">
        Save Option Set
      </Button>
      <Button
        on:click={deleteOptionSet}
        outline
        color="danger"
        disabled={isNew && !optionSet?.id}>Delete Option Set</Button
      >
    </Col>
  </Row>

  <Row class="mt-3">
    <Col md="10" lg="8">
      <h5>Options</h5>
      {#key optionsKey}
        {#if optionSet && optionSet.options && optionSet.options.length > 0}
          <div class="p-2 mb-1 fw-bold d-none d-md-flex row gx-2">
            <div class="col">Key</div>
            <div class="col">Value</div>
            <div class="col-3 text-end">Action</div>
          </div>
          {#each optionSet.options as item, i (item.value + "-" + i)}
            <Row class="g-2 mb-2 align-items-center">
              <Col xs="12" md>
                <Label for={`optionKey-${i}`} class="visually-hidden">Key</Label>
                <Input
                  id={`optionKey-${i}`}
                  bind:value={item.value}
                  type="number"
                  placeholder="Key"
                />
              </Col>
              <Col xs="12" md>
                <Label for={`optionName-${i}`} class="visually-hidden">Value</Label>
                <Input
                  id={`optionName-${i}`}
                  bind:value={item.name}
                  placeholder="Value"
                />
              </Col>
              <Col xs="12" md="3" class="text-md-end mt-2 mt-md-0">
                <Button
                  outline
                  color="danger"
                  size="sm"
                  on:click={() => deleteItem(item)}
                  class="w-100">Delete</Button>
              </Col>
            </Row>
          {/each}
        {:else}
          <p class="text-muted fst-italic">No options defined yet.</p>
        {/if}
      {/key}

      <Row class="g-2 mt-3 pt-3 border-top align-items-center">
        <Col xs="12" md>
          <Label for="newOptionKey" class="fw-bold mb-1">New Key</Label>
          <Input
            id="newOptionKey"
            bind:value={keyInput}
            type="number"
            placeholder="Enter numeric key"
          />
        </Col>
        <Col xs="12" md>
          <Label for="newOptionValue" class="fw-bold mb-1">New Value</Label>
          <Input
            id="newOptionValue"
            bind:value={valueInput}
            placeholder="Enter display value"
          />
        </Col>
        <Col xs="12" md="3" class="text-md-end align-self-end mt-2 mt-md-0">
          <Button
            outline
            color="success"
            size="sm"
            on:click={addItem}
            class="w-100">Add Option</Button
          >
        </Col>
      </Row>
    </Col>
  </Row>
</div>
{/if}