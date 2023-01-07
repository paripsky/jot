import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PackageJson = require('./package.json');
const externals = Object.keys(PackageJson.dependencies);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'JotUI',
      fileName: 'jot-ui',
    },
    rollupOptions: {
      external: externals,
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
