import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// Standalone playground for medusa-mobile-tabbar.
// Imports the component straight from ../src, so allow Vite to read the parent.
export default defineConfig({
  plugins: [react()],
  server: {
    fs: { allow: [".."] },
  },
})
