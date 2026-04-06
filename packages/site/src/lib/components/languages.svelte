<script lang="ts">
    import CheckIcon from "@lucide/svelte/icons/check";
    import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
    import { tick } from "svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";
    import { availableLanguages } from "@arborium/arborium";

    interface Props {
        value: string;
        onSelectCallback?: () => void;
    }

    const languages = availableLanguages.map((lang) => ({
        value: lang,
        label: lang
    }));
    languages.push({ value: "plaintext", label: "plaintext" });

    let { value = $bindable(""), onSelectCallback }: Props = $props();

    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement | null>(null);

    const selectedValue = $derived(
        languages.find((f) => f.value === value)?.label,
    );

    function closeAndFocusTrigger() {
        open = false;
        tick().then(() => {
            triggerRef?.focus();
        });
    }
</script>

<Popover.Root bind:open>
    <Popover.Trigger bind:ref={triggerRef}>
        {#snippet child({ props })}
            <Button
                {...props}
                variant="outline"
                class="w-50 justify-between"
                role="combobox"
                aria-expanded={open}
            >
                {selectedValue || "select a language..."}
                <ChevronsUpDownIcon class="opacity-50" />
            </Button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-50 p-0">
        <Command.Root>
            <Command.Input placeholder="search language..." />
            <Command.List>
                <Command.Empty>no language found</Command.Empty>
                <Command.Group value="languages">
                    {#each languages as lang (lang.value)}
                        <Command.Item
                            value={lang.value}
                            onSelect={() => {
                                value = lang.value;
                                console.log("selected language:", lang.value);
                                closeAndFocusTrigger();
                                onSelectCallback?.();
                            }}
                        >
                            <CheckIcon
                                class={cn(
                                    value !== lang.value && "text-transparent",
                                )}
                            />
                            {lang.label}
                        </Command.Item>
                    {/each}
                </Command.Group>
            </Command.List>
        </Command.Root>
    </Popover.Content>
</Popover.Root>
