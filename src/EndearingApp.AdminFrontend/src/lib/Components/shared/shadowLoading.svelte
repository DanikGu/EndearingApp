<script>
// @ts-nocheck

    import { Spinner } from 'flowbite-svelte';
    export let text = "";
</script>

<div class="absolute top-0 left-0 z-50 bg-opacity-25 bg-green-300 w-full h-full flex items-center justify-center">
    <div class="flex gap-4 flex-col items-center justify-center">
        <Spinner class="opacity-100" color="green"/>
        <p>{text}</p>
    </div>
</div>