<script lang="ts">
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import {
        availableLanguages,
        detectLanguage,
        highlight,
    } from "@arborium/arborium";
    import "@arborium/arborium/themes/base.css";
    import "@arborium/arborium/themes/rustdoc-dark.css";
    import { onMount } from "svelte";

    import { api } from "$lib/api";
    import Languages from "./languages.svelte";

    interface Props {
        language: string;
        value?: string;
        readonly?: boolean;
    }

    let {
        language = $bindable("typescript"),
        value = $bindable(""),
        readonly = false,
    }: Props = $props();

    let editingLanguage = $state(false);
    let highlightedHtml = $state(" ");
    let editorScrollTop = $state(0);

    let textareaRef = $state<HTMLTextAreaElement | null>(null);
    let highlightRef = $state<HTMLPreElement | null>(null);
    let highlightRequestId = 0;

    let metaRef: HTMLParagraphElement | null = null;
    let metaHeight = 0;

    function onEditorBeforeInput(e: InputEvent) {
        if (e.inputType === "insertFromPaste") {
            if (value.length === 0) {
                // if the editor is empty, try to detect the language of the pasted content
                const pastedText = (e.data || "").trim();
                const detectedLanguage = detectLanguage(pastedText);
                if (detectedLanguage) {
                    console.log(
                        `sucessfully detected language: ${detectedLanguage}`,
                    );
                    language = detectedLanguage;
                }
            }
        }
    }

    const textareaHeight = $derived(
        `calc(100dvh - var(--shell-nav-h, 0px) - ${metaHeight}px - 2.5rem)`,
    );

    function toggleEditingLanguage() {
        editingLanguage = !editingLanguage;
    }

    function escapeHtml(source: string) {
        return source
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
    }

    async function updateHighlight(source: string, lang: string) {
        const requestId = ++highlightRequestId;

        if (source.length === 0) {
            highlightedHtml = " ";
            return;
        }

        try {
            const html = await highlight(lang, source);
            if (requestId !== highlightRequestId) return;
            highlightedHtml = html || " ";
        } catch {
            if (requestId !== highlightRequestId) return;
            highlightedHtml = escapeHtml(source);
        }
    }

    function syncEditorScroll() {
        if (!textareaRef) return;
        editorScrollTop = textareaRef.scrollTop;
        if (highlightRef) {
            highlightRef.scrollTop = textareaRef.scrollTop;
            highlightRef.scrollLeft = textareaRef.scrollLeft;
        }
    }

    $effect(() => {
        if (
            !availableLanguages.includes(language) &&
            language !== "plaintext"
        ) {
            console.warn(
                `language "${language}" is not supported, falling back to plaintext.`,
            );
            language = "plaintext";
        }
        const languageChoice = language;
        void updateHighlight(value, languageChoice);
    });

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

    async function publish() {
        const result = await api.pastes.post(
            { language, text: value },
            {
                headers: {
                    authorization: localStorage.getItem("authorization"),
                },
            },
        );
        if (result.data?.short_id) {
            location.assign(`/p/${result.data.short_id}`);
        }
    }
</script>

<div class="flex h-full min-h-0 flex-col">
    <p class="shrink-0 pb-1.5 text-xs" bind:this={metaRef}>
        {#if editingLanguage}
            <Languages
                bind:value={language}
                onSelectCallback={() => {
                    editingLanguage = !editingLanguage;
                }}
            />
        {:else}
            <button class="hover:underline" onclick={toggleEditingLanguage}
                >{language}</button
            >
        {/if} | {value.length} chars | {value.split("\n").length} lines
        {#if !readonly}
            |
            <button class="hover:underline" onclick={publish}>publish</button>
        {/if}
    </p>
    <div class="flex flex-row gap-1">
        <div
            class="w-9 overflow-hidden pt-2 text-right text-xs text-muted-foreground select-none leading-5"
        >
            <div style={`transform: translateY(-${editorScrollTop}px);`}>
                {#each value.split("\n") as _line, i}
                    <div>{i + 1}</div>
                {/each}
            </div>
        </div>
        <div class="relative min-h-0 flex-1 arborium-highlight-wrap">
            <pre
                aria-hidden="true"
                bind:this={highlightRef}
                class="pointer-events-none absolute inset-0 overflow-auto border border-input/40 px-2.5 py-2 text-xs leading-5 whitespace-pre"
                style={`height: ${textareaHeight}; min-height: ${textareaHeight}; color: #c9d1d9;`}><code
                    >{@html highlightedHtml}</code
                >
            </pre>

            <Textarea
                bind:ref={textareaRef}
                disabled={readonly}
                class="relative min-h-0 resize-none border-input/40 bg-transparent text-transparent caret-foreground selection:bg-foreground/20 focus-visible:border-input/55 focus-visible:ring-input/55 aria-invalid:ring-input/55 dark:aria-invalid:ring-input/55 leading-5"
                style={`height: ${textareaHeight}; min-height: ${textareaHeight};`}
                onbeforeinput={onEditorBeforeInput}
                onscroll={syncEditorScroll}
                bind:value
                spellcheck={false}
                autocapitalize="off"
                autocomplete="off"
            />
        </div>
    </div>
</div>
