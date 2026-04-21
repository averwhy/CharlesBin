<!-- _module.svelte -->
<script lang="ts">
    import { api } from "$lib/api";
    import { Button } from "$lib/components/ui/button/index";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Input } from "$lib/components/ui/input/index";
    import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
    import { Toaster } from "$lib/components/ui/sonner/index";
    import { session } from "$lib/session.svelte";
    import { ModeWatcher } from "mode-watcher";
    import { onMount } from "svelte";

    let navBarRef: HTMLDivElement | null = null;
    let navHeight = $state(0);

    let loginEmail = $state(""),
        loginPassword = $state(""),
        registerEmail = $state(""),
        registerPassword = $state("");

    onMount(() => {
        const token = localStorage.getItem("authorization");
        if (token) {
            api.user
                .get({ headers: { authorization: token } })
                .then(response => {
                    if (response.data) {
                        session.user = response.data;
                    } else {
                        localStorage.removeItem("authorization");
                    }
                })
                .catch(() => {
                    localStorage.removeItem("authorization");
                });
        }
    });

    async function handleLogin() {
        const result = await api.login.post({
            email: loginEmail,
            password: loginPassword,
        });

        if (result.error) {
            console.error("Login failed:", result.error);
        } else {
            console.log("Login successful:", result.data);
            localStorage.setItem("authorization", result.data.token);
            session.user = result.data.user;
        }
    }

    async function handleRegister() {
        const result = await api.register.post({
            email: registerEmail,
            password: registerPassword,
        });

        if (result.error) {
            console.error("Registration failed:", result.error);
        } else {
            console.log("Registration successful:", result.data);
            localStorage.setItem("authorization", result.data.token);
            session.user = result.data.user;
        }
    }

    async function handleLogout() {
        localStorage.removeItem("authorization");
        session.user = null;
    }

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
<div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 bg-background"></div>
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
                    <!-- TODO replace with something better -->
                    {#if session.user}
                        <NavigationMenu.Item>
                            <NavigationMenu.Link>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger class="text-sm">logout</DropdownMenu.Trigger>
                                    <DropdownMenu.Content class="w-50 min-w-45">
                                        <DropdownMenu.Group class="flex w-full justify-end">
                                            <Button onclick={handleLogout} variant="outline">logout</Button>
                                        </DropdownMenu.Group>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </NavigationMenu.Link>
                        </NavigationMenu.Item>
                    {:else}
                        <NavigationMenu.Item>
                            <NavigationMenu.Link>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger class="text-sm">login</DropdownMenu.Trigger>
                                    <DropdownMenu.Content class="w-50 min-w-45">
                                        <DropdownMenu.Group>
                                            <DropdownMenu.Sub>
                                                <Input bind:value={loginEmail} placeholder="email" class="w-full" />
                                            </DropdownMenu.Sub>
                                            <DropdownMenu.Sub>
                                                <Input
                                                    bind:value={loginPassword}
                                                    placeholder="password"
                                                    type="password"
                                                    class="w-full"
                                                />
                                            </DropdownMenu.Sub>
                                        </DropdownMenu.Group>
                                        <DropdownMenu.Group class="flex w-full justify-end">
                                            <Button onclick={handleLogin} variant="outline">login</Button>
                                        </DropdownMenu.Group>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </NavigationMenu.Link>
                        </NavigationMenu.Item>
                        <NavigationMenu.Item>
                            <NavigationMenu.Link>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger class="text-sm">register</DropdownMenu.Trigger>
                                    <DropdownMenu.Content class="w-50 min-w-45">
                                        <DropdownMenu.Group>
                                            <DropdownMenu.Sub>
                                                <Input bind:value={registerEmail} placeholder="email" class="w-full" />
                                            </DropdownMenu.Sub>
                                            <DropdownMenu.Sub>
                                                <Input
                                                    bind:value={registerPassword}
                                                    placeholder="password"
                                                    type="password"
                                                    class="w-full"
                                                />
                                            </DropdownMenu.Sub>
                                        </DropdownMenu.Group>
                                        <DropdownMenu.Group class="flex w-full justify-end">
                                            <Button onclick={handleRegister} variant="outline">register</Button>
                                        </DropdownMenu.Group>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </NavigationMenu.Link>
                        </NavigationMenu.Item>
                    {/if}
                </NavigationMenu.List>
            </NavigationMenu.Root>
        </div>
    </div>

    <main class="min-h-0 flex-1" style={`--shell-nav-h: ${navHeight}px;`}>
        <!-- svelte-ignore slot_element_deprecated -->
        <slot />
    </main>
</div>
