import Inspect from 'vite-plugin-inspect';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default {
  publicDir: 'assets',
  plugins: [
    Inspect(),
    ViteImageOptimizer({
      png: {
        quality: 90,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
    }),
    tsconfigPaths(),
    checker({
      typescript: true,
      eslint: { lintCommand: 'eslint "./src/**/*.{ts,js}"' }
    }),
  ],
  base: './',
  build: {
    target: 'esnext',
    outDir: 'dist', 
    minify: false,
    compact: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
      },
    },
  },
};