<script lang="ts">
    import { api } from "$lib/api";
    import Editor from "$lib/components/editor.svelte";
    import { params } from "@roxi/routify";

    const id = $params.paste;

    const paste = api.pastes({ short_id: id }).get();

    paste.then(response => {
        if (!response.data) {
            location.assign("/");
        }
    });
</script>

{#await paste then { data }}
    {#if data}
        {@const { language, text } = data}
        <section class="h-full min-h-0">
            <div class="mx-auto flex h-full min-h-0 w-[97%] flex-col pt-2">
                <Editor language={language || "plaintext"} value={text} readonly />
            </div>
        </section>
    {/if}
{/await}
