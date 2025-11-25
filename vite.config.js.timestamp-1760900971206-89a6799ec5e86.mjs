// vite.config.js
import { defineConfig } from "file:///C:/laragon/www/LaravelReactApp/node_modules/vite/dist/node/index.js";
import laravel from "file:///C:/laragon/www/LaravelReactApp/node_modules/laravel-vite-plugin/dist/index.mjs";
import react from "file:///C:/laragon/www/LaravelReactApp/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    laravel({
      input: ["resources/js/react/src/main.jsx"],
      refresh: true,
      hmr: {
        host: "e3280f0daed3.ngrok-free.app",
        // ngrok URL
        protocol: "wss"
        // WebSocket Secure
      }
    }),
    react()
  ],
  server: {
    host: "127.0.0.1",
    port: 5173,
    cors: true,
    https: false
  },
  resolve: {
    alias: {
      react: path.resolve("./resources/js/react/node_modules/react"),
      "react-dom": path.resolve("./resources/js/react/node_modules/react-dom")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxsYXJhZ29uXFxcXHd3d1xcXFxMYXJhdmVsUmVhY3RBcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXGxhcmFnb25cXFxcd3d3XFxcXExhcmF2ZWxSZWFjdEFwcFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovbGFyYWdvbi93d3cvTGFyYXZlbFJlYWN0QXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgbGFyYXZlbCBmcm9tICdsYXJhdmVsLXZpdGUtcGx1Z2luJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIGxhcmF2ZWwoe1xuICAgICAgaW5wdXQ6IFsncmVzb3VyY2VzL2pzL3JlYWN0L3NyYy9tYWluLmpzeCddLFxuICAgICAgcmVmcmVzaDogdHJ1ZSxcbiAgICAgIGhtcjoge1xuICAgICAgICBob3N0OiAnZTMyODBmMGRhZWQzLm5ncm9rLWZyZWUuYXBwJywgLy8gbmdyb2sgVVJMXG4gICAgICAgIHByb3RvY29sOiAnd3NzJywgLy8gV2ViU29ja2V0IFNlY3VyZVxuICAgICAgfSxcbiAgICB9KSxcbiAgICByZWFjdCgpLFxuICBdLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMTI3LjAuMC4xJyxcbiAgICBwb3J0OiA1MTczLFxuICAgIGNvcnM6dHJ1ZSxcbiAgICBodHRwczogZmFsc2UsXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgIHJlYWN0OiBwYXRoLnJlc29sdmUoJy4vcmVzb3VyY2VzL2pzL3JlYWN0L25vZGVfbW9kdWxlcy9yZWFjdCcpLFxuICAgICAgJ3JlYWN0LWRvbSc6IHBhdGgucmVzb2x2ZSgnLi9yZXNvdXJjZXMvanMvcmVhY3Qvbm9kZV9tb2R1bGVzL3JlYWN0LWRvbScpLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1IsU0FBUyxvQkFBb0I7QUFDalQsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFFakIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsUUFBUTtBQUFBLE1BQ04sT0FBTyxDQUFDLGlDQUFpQztBQUFBLE1BQ3pDLFNBQVM7QUFBQSxNQUNULEtBQUs7QUFBQSxRQUNILE1BQU07QUFBQTtBQUFBLFFBQ04sVUFBVTtBQUFBO0FBQUEsTUFDWjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQUs7QUFBQSxJQUNMLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDSixPQUFPLEtBQUssUUFBUSx5Q0FBeUM7QUFBQSxNQUM5RCxhQUFhLEtBQUssUUFBUSw2Q0FBNkM7QUFBQSxJQUN6RTtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
