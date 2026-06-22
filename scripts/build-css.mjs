// Emits dist/styles.css from the single source of truth (STYLE_CSS in
// src/styles.ts), so SSR consumers can import the stylesheet directly.
// Runs from tsup's onSuccess, after dist/index.mjs has been built.
import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const { STYLE_CSS } = await import(resolve(here, "../dist/index.mjs"))

const out = resolve(here, "../dist/styles.css")
writeFileSync(out, `${STYLE_CSS.trim()}\n`)
console.log(`build-css: wrote ${out}`)
