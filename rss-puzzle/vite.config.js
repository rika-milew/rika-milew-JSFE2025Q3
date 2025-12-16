import { resolve } from 'path';
// import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default {
  base: './',
  build: {
    target: 'esnext',
    outDir: 'dist', 
    assetsDir: 'assets',
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