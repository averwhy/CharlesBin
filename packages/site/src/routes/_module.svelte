<!-- _module.svelte -->
<script lang="ts">
    import { Toaster } from "$lib/components/ui/sonner/index";
    import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
</script>

<Toaster richColors />
<div
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 -z-10 bg-background"
></div>
<div class="flex flex-row">
    <div class="top-0 left-0 w-full">
        <NavigationMenu.Root>
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Link>
                        <a href="/" class="text-sm">paste</a>
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
                        <a href="/login" class="text-sm">login</a>
                    </NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <NavigationMenu.Link>
                        <a href="/signup" class="text-sm">signup</a>
                    </NavigationMenu.Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu.Root>
    </div>
</div>

<slot></slot>
