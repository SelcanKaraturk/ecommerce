import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/react/src/main.jsx'],
      refresh: true,
      hmr: {
        host: 'e3280f0daed3.ngrok-free.app', // ngrok URL
        protocol: 'wss', // WebSocket Secure
      },
    }),
    react(),
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    cors:true,
    https: false,
  },
  resolve: {
    alias: {
       react: path.resolve('./resources/js/react/node_modules/react'),
      'react-dom': path.resolve('./resources/js/react/node_modules/react-dom'),
    },
  },
});
