import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
plugins: [react()]
  // plugins: [react()],
  // build: {
  //   outDir: 'public/build',
  //   emptyOutDir: true,
  //   manifest: true,
  //    rollupOptions: {
  //     input: {
  //       app: resolve(__dirname, 'resources/js/react/main.jsx'),
  //     },
  //   },
  // },
  //base: '/react/',
//plugins: [react()],
//   server: {
//   proxy: {
//     '/api': 'http://127.0.0.1:8000',
//     '/sanctum': 'http://127.0.0.1:8000',
//   }
// }
})


