<script lang="ts">
    import { api } from "$lib/api";
    import { onMount } from "svelte";
    import { session } from "$lib/session.svelte";

    let pastes: Array<{
        short_id: string;
        language: string;
        created_at: string;
    }> = $state([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    onMount(async () => {
        try {
            const token = localStorage.getItem("authorization");
            const result = await api.pastes.get({
                headers: {
                    authorization: token,
                },
            });

            if (result.data?.pastes) {
                pastes = result.data.pastes.map((paste) => ({
                    short_id: paste.short_id,
                    created_at: paste.created_at.toISOString(),
                    language: paste.language || "plaintext",
                }));
            } else {
                error = "Failed to load pastes";
            }
        } catch (err) {
            error = "Failed to load pastes";
            console.error(err);
        } finally {
            loading = false;
        }
    });
</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">your pastes</h1>

    {#if loading}
        <p class="text-muted-foreground">Loading...</p>
    {:else if !session.user}
        <p class="text-destructive">try logging in first to view your pastes</p>
    {:else if error}
        <p class="text-destructive">{error}</p>
    {:else if pastes.length === 0}
        <p class="text-muted-foreground">no pastes yet</p>
    {:else}
        <div class="space-y-2">
            {#each pastes as paste}
                <a
                    href="/p/{paste.short_id}"
                    class="block p-3 border border-input rounded hover:bg-foreground/5 transition"
                >
                    <div class="font-mono text-sm">{paste.short_id}</div>
                    <div class="text-xs text-muted-foreground">
                        {paste.language} • {new Date(
                            paste.created_at,
                        ).toLocaleDateString()}
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>
