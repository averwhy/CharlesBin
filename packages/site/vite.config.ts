import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import routify from '@roxi/routify/vite-plugin'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), svelte(), routify()],
    resolve: {
        alias: {
            $lib: path.resolve("./src/lib"),
        },
    },
});
