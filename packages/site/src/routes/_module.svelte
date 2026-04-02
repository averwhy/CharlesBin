<!-- _module.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import { Toaster } from "$lib/components/ui/sonner/index";
    import { ModeWatcher } from "mode-watcher";
    import { Input } from "$lib/components/ui/input/index";
    import { Button } from "$lib/components/ui/button/index";
    import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

    let navBarRef: HTMLDivElement | null = null;
    let navHeight = 0;

    onMount(() => {
        if (!navBarRef) return;

        const updateNavHeight = () => {
            navHeight = navBarRef?.offsetHeight ?? 0;
        };

        updateNavHeight();

        const observer = new ResizeObserver(updateNavHeight);
        observer.observe(navBarRef);
        window.addEventListener("resize", updateNavHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateNavHeight);
        };
    });
</script>

<Toaster richColors />
<ModeWatcher />
<div
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 -z-10 bg-background"
></div>
<div class="flex min-h-dvh flex-col">
    <div class="flex shrink-0 flex-row" bind:this={navBarRef}>
        <div class="top-0 left-0 w-full">
            <NavigationMenu.Root>
                <NavigationMenu.List>
                    <NavigationMenu.Item>
                        <NavigationMenu.Link>
                            <a href="/" class="text-sm">charlesbin</a>
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>
                </NavigationMenu.List>
            </NavigationMenu.Root>
        </div>
        <div class="top-0 right-0">
            <NavigationMenu.Root>
                <NavigationMenu.List>
                    <NavigationMenu.Item>
                        <NavigationMenu.Link>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger class="text-sm">
                                    login
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content class="w-50 min-w-45">
                                    <DropdownMenu.Group>
                                        <DropdownMenu.Sub>
                                            <Input
                                                placeholder="email"
                                                class="w-full"
                                            />
                                        </DropdownMenu.Sub>
                                        <DropdownMenu.Sub>
                                            <Input
                                                placeholder="password"
                                                type="password"
                                                class="w-full"
                                            />
                                        </DropdownMenu.Sub>
                                    </DropdownMenu.Group>
                                    <DropdownMenu.Group
                                        class="flex w-full justify-end"
                                    >
                                        <Button variant="outline">login</Button>
                                    </DropdownMenu.Group>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                        <NavigationMenu.Link>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger class="text-sm">
                                    register
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content class="w-50 min-w-45">
                                    <DropdownMenu.Group>
                                        <DropdownMenu.Sub>
                                            <Input
                                                placeholder="email"
                                                class="w-full"
                                            />
                                        </DropdownMenu.Sub>
                                        <DropdownMenu.Sub>
                                            <Input
                                                placeholder="password"
                                                type="password"
                                                class="w-full"
                                            />
                                        </DropdownMenu.Sub>
                                    </DropdownMenu.Group>
                                    <DropdownMenu.Group
                                        class="flex w-full justify-end"
                                    >
                                        <Button variant="outline"
                                            >register</Button
                                        >
                                    </DropdownMenu.Group>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>
                </NavigationMenu.List>
            </NavigationMenu.Root>
        </div>
    </div>

    <main class="min-h-0 flex-1" style={`--shell-nav-h: ${navHeight}px;`}>
        <slot></slot>
    </main>
</div>
