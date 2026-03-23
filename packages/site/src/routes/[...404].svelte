<script context="module" lang="ts">
    export const load = ({ route }: { route: { url: string } }) => ({
        status: 404,
        error: "Page could not be found.",
        props: { url: route.url },
    });
</script>

<script lang="ts">
    export let url: string;
</script>

<div class="four04">
    <h1>404 - Page Not Found</h1>
    <p>
        The page <code>{url}</code> could not be found. Please check the URL or
        go back to the <a href="/">homepage</a>.
    </p>
</div>

<style>
    .four04 {
        display: flex;
        align-items: center;
        flex-direction: column;
        text-align: center;
        gap: 1rem;
        padding: 2rem 1rem;
    }
</style>
