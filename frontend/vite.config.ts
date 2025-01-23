import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPath from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react(), svgr(), tsconfigPath()],
  base: '/',
  resolve: {
    alias: {
      '@': '/src', // Maps @ to the src directory
    }  },
});
