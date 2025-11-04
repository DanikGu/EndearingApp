<script>
  import { useDroppable } from "@dnd-kit-svelte/core";

  /** @type {string} */
  export let id;

  const { setNodeRef, isOver } = useDroppable({ id });

  $: containerStyle = `border-dashed border-2 p-4 rounded-md ${
    isOver ? "border-blue-500" : "border-gray-300"
  }`;
</script>

<div use:setNodeRef class={containerStyle}>
  <slot />
</div>