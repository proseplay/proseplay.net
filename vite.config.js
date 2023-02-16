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
        docs: resolve(__dirname, "docs/index.html")
      }
    },
    sourcemap: true
  }
});