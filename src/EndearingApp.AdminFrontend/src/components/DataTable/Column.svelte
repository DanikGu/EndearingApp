<script>
  import { useSortable } from "@dnd-kit-svelte/sortable";
  import { FieldDto } from "@apiclients/src";

  /** @type {FieldDto} */
  export let field;

  const { attributes, listeners, node } = useSortable({
    id: field.name,
  });
</script>

<div
  bind:this={node.current}
  {...attributes.current}
  {...listeners.current}
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

