import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    test: {
        // The converters are pure, but the XML formatter and the Markdown
        // sanitiser need DOMParser / a document.
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
    },
});
