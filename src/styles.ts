/**
 * Self-contained styles for the tab bar — no Tailwind (or any build step)
 * required. Every color/size that's worth theming reads a CSS variable with the
 * current design as the inline fallback, so consumers can rebrand by setting
 * e.g. `--mtb-accent` on any ancestor (`:root`, a wrapper, …) and it cascades
 * in. See README "Styling & theming".
 */
export const STYLE_ELEMENT_ID = "medusa-mobile-tabbar-styles"

export const STYLE_CSS: string = `
.mtb-nav, .mtb-handle, .mtb-tab, .mtb-icon, .mtb-badge, .mtb-indicator {
  box-sizing: border-box;
}

.mtb-nav {
  position: fixed;
  left: 50%;
  z-index: 90;
  display: inline-flex;
  align-items: stretch;
  gap: 2px;
  padding: 6px;
  border-radius: var(--mtb-radius, 26px);
  border: 1px solid var(--mtb-border, rgba(255, 255, 255, 0.08));
  background: var(--mtb-surface, rgba(20, 20, 22, 0.72));
  -webkit-backdrop-filter: blur(28px) saturate(1.8);
  backdrop-filter: blur(28px) saturate(1.8);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 20px 50px -18px rgba(0, 0, 0, 0.7), 0 6px 18px -8px rgba(0, 0, 0, 0.5);
  transform-origin: bottom center;
  transition-property: transform, opacity, padding;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.34, 0.02, 0.5, 1);
}

.mtb-handle {
  position: fixed;
  left: 50%;
  z-index: 90;
  width: 60px;
  height: 8px;
  padding: 0;
  border-radius: 9999px;
  border: 1px solid var(--mtb-border, rgba(255, 255, 255, 0.08));
  background: var(--mtb-surface-handle, rgba(20, 20, 22, 0.55));
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 8px 22px -10px rgba(0, 0, 0, 0.55);
  cursor: pointer;
  transition-property: transform, opacity;
  transition-duration: 200ms;
  transition-timing-function: ease-out;
}

.mtb-indicator {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  border-radius: 20px;
  background: var(--mtb-accent-soft, rgba(255, 91, 46, 0.12));
  pointer-events: none;
  will-change: transform, width;
  transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1),
    width 320ms cubic-bezier(0.34, 1.56, 0.64, 1),
    height 320ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 180ms ease;
}

.mtb-tab {
  position: relative;
  z-index: 1;
  display: inline-flex;
  min-width: 72px;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 14px 7px;
  border: 0;
  border-radius: 20px;
  background: transparent;
  color: var(--mtb-text, rgba(255, 255, 255, 0.55));
  font-family: inherit;
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.005em;
  text-decoration: none;
  cursor: pointer;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mtb-tab:hover {
  color: var(--mtb-text-hover, rgba(255, 255, 255, 0.85));
}

.mtb-tab:active {
  transform: scale(0.9);
}

.mtb-tab--active,
.mtb-tab--active:hover {
  color: var(--mtb-accent, #ff5b2e);
}

.mtb-icon {
  position: relative;
  display: inline-flex;
  height: 26px;
  width: 26px;
  align-items: center;
  justify-content: center;
  transform: scale(1);
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mtb-icon--active {
  transform: scale(1.1);
}

.mtb-label {
  line-height: 1;
}

.mtb-badge {
  position: absolute;
  top: -3px;
  inset-inline-end: -7px;
  display: inline-flex;
  height: 17px;
  min-width: 17px;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border-radius: 9999px;
  background: var(--mtb-accent, #ff5b2e);
  color: var(--mtb-badge-text, #fff);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  box-shadow: 0 0 0 2px var(--mtb-badge-ring, rgba(20, 20, 22, 0.95));
}

/* Match the original lg:hidden — hide on large (desktop) viewports. */
@media (min-width: 1024px) {
  .mtb-nav,
  .mtb-handle {
    display: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mtb-nav,
  .mtb-handle,
  .mtb-tab,
  .mtb-icon,
  .mtb-indicator {
    transition: none !important;
  }
  .mtb-tab:active {
    transform: none !important;
  }
}
`

let injected = false

/**
 * Inject the stylesheet once per document (idempotent, SSR-safe). Multiple bars
 * share a single <style> element. For SSR/no-FOUC, import the shipped
 * `medusa-mobile-tabbar/styles.css` (or inline `STYLE_CSS`) instead.
 */
export const ensureStyles = (): void => {
  if (injected || typeof document === "undefined") return
  injected = true
  if (document.getElementById(STYLE_ELEMENT_ID)) return
  const el = document.createElement("style")
  el.id = STYLE_ELEMENT_ID
  el.textContent = STYLE_CSS
  document.head.appendChild(el)
}
