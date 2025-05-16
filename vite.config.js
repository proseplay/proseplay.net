import { defineConfig } from "vite";
import postcssNesting from 'postcss-nesting';
import { resolve } from "path";

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        postcssNesting
      ],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        playground: resolve(__dirname, "playground/index.html"),
        display: resolve(__dirname, "display/index.html"),
        learn: resolve(__dirname, "learn/index.html"),
        reference: resolve(__dirname, "reference/index.html")
      }
    },
    sourcemap: true
  }
});