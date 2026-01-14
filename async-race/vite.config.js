import { resolve } from 'path';

export default {
   resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@api': resolve(__dirname, 'src/api'),
      '@app': resolve(__dirname, 'src/app'),
      '@components': resolve(__dirname, 'src/components'),
      '@data': resolve(__dirname, 'src/data'),
      '@state': resolve(__dirname, 'src/state'),
      '@/types': resolve(__dirname, 'src/types'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@utils': resolve(__dirname, 'src/utils'),
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