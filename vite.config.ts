import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.ts'),
      name: 'vert-doc',
      fileName: (format) => `vert-easydoc-vue.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [vue(), dts({ insertTypesEntry: true })],
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `
  //         @import "${path.resolve(
  //           __dirname,
  //           'src/assets/styles/variables/_brand.scss'
  //         )}"
  //         @import "${path.resolve(__dirname, 'src/assets/styles/index.scss')}"
  //       `,
  //     },
  //   },
  // },
});
