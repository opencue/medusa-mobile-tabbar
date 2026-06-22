// Makes the @testing-library/jest-dom matchers visible to `tsc` during
// type-check (they're registered at runtime via test/setup.ts).
import "@testing-library/jest-dom/vitest"
