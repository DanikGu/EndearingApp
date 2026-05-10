<script>
  import { useDroppable } from "@dnd-kit-svelte/core";

  let { id, children } = $props();

  const { setNodeRef, isOver } = useDroppable({
    get id() { return id; }
  });

  let containerStyle = $derived(`border-dashed border-2 p-4 rounded-md ${
    isOver ? "border-blue-500 dark:border-blue-400" : "border-gray-300 dark:border-gray-600"
  }`);
</script>

<div use:setNodeRef class={containerStyle}>
  {@render children?.()}
</div>