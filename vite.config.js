import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/react/src/main.jsx'],
            refresh: true,
        }),
        react(),
    ],
     assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.eot'],
    build: {
        outDir: 'public/build', // 🔥 Build dosyaları doğru yere gitsin
        emptyOutDir: true,
    }
});
