<script>
  import { FormDTO } from "@apiclients/src";
  import { onMount } from "svelte";
  import EditFormComponent from "../../../../../components/AppComponents/EditFormComponent.svelte";

  /** @type { { data : { form: FormDTO, entityData: Object }} } */
  let { data } = $props();
</script>

<EditFormComponent bind:form={data.form} bind:entityData={data.entityData} />
