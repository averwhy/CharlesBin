<script lang="ts">
    import { onMount } from "svelte";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { Separator } from "$lib/components/ui/separator/index";

    interface Props {
        language: string;
        value?: string;
    }

    let { language = $bindable("typescript"), value = $bindable("") }: Props =
        $props();

    let metaRef: HTMLParagraphElement | null = null;
    let metaHeight = 0;

    const textareaHeight = $derived(
        `calc(100dvh - var(--shell-nav-h, 0px) - ${metaHeight}px - 2.5rem)`,
    );

    onMount(() => {
        if (!metaRef) return;

        const updateMetaHeight = () => {
            metaHeight = metaRef?.offsetHeight ?? 0;
        };

        updateMetaHeight();

        const observer = new ResizeObserver(updateMetaHeight);
        observer.observe(metaRef);
        window.addEventListener("resize", updateMetaHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateMetaHeight);
        };
    });
</script>

<div class="flex h-full min-h-0 flex-col">
    <p class="shrink-0 pb-1.5 text-xs" bind:this={metaRef}>
        {language} | {value.length} chars | {value.split("\n").length} lines
    </p>
    <div class="flex flex-row gap-1">
        <div
            class="flex flex-col text-xs text-muted-foreground select-none pt-2.5 gap-4"
        >
            {#each value.split("\n") as line, i}
                {i + 1}<br />
            {/each}
        </div>
        <Separator orientation="vertical" />
        <Textarea
            class="min-h-0 resize-none border-input/40 bg-background focus-visible:border-input/55 focus-visible:ring-input/55 aria-invalid:ring-input/55 dark:bg-background dark:aria-invalid:ring-input/55"
            style={`height: ${textareaHeight}; min-height: ${textareaHeight};`}
            bind:value
        />
    </div>
</div>
