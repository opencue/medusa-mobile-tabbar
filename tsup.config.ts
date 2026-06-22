import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    options.jsx = "automatic"
  },
  // Emit dist/styles.css from STYLE_CSS for SSR consumers who import the sheet.
  onSuccess: "node scripts/build-css.mjs",
})
