<script>
  import { useSortable } from "@dnd-kit-svelte/sortable";
  import { FieldDto } from "@apiclients/src";
  import { flip } from "svelte/animate";
  import { CSS, styleObjectToString } from "@dnd-kit-svelte/utilities";

  /** @type {{field: FieldDto}} */
  let { field } = $props();

  const {
    attributes,
    listeners,
    node,
    isDragging,
    transform,
    isSorting,
    transition,
  } = useSortable({
    id: field.name,
  });
  const style = $derived(
    styleObjectToString({
      transform: CSS.Transform.toString(transform.current),
      transition: isSorting.current ? transition.current : undefined,
      zIndex: isDragging.current ? 1 : undefined,
    }),
  );
</script>

<div
  bind:this={node.current}
  {...attributes.current}
  {...listeners.current}
  {style}
  class="p-2 border rounded-md bg-gray-100 cursor-grab noselect"
>
  {field.displayName}
</div>

<style>
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
</style>
