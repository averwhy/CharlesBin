<script lang="ts">
    import Editor from "$lib/components/editor.svelte";

    let language = $state("typescript");
    let content = $state("");
</script>

<section class="h-full min-h-0">
    <div class="mx-auto flex h-full min-h-0 w-[97%] flex-col pt-2">
        <Editor bind:language bind:value={content} />
    </div>
</section>
