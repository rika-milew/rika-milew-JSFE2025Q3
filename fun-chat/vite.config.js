import { resolve } from 'path';

export default {
   resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
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