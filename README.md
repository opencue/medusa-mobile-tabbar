# medusa-mobile-tabbar

Floating iOS-style bottom tab bar for Medusa storefronts. Works with Next.js, TanStack Router, or plain React. **No Tailwind or CSS setup required** — the bar ships its own styles. Zero runtime deps beyond React.

## Install

```bash
npm install medusa-mobile-tabbar
```

## Minimal usage (plain `<a>` links, English defaults)

```tsx
"use client"
import { usePathname } from "next/navigation"
import {
  MobileTabBar, DEFAULT_LABELS,
  HomeOutline, HomeFill,
  StoreOutline, StoreFill,
  CubeOutline, CubeFill,
  BagOutline, BagFill,
} from "medusa-mobile-tabbar"

export function MobileNav({ cartCount = 0, onCartOpen = () => {} }) {
  const p = usePathname()
  return (
    <MobileTabBar tabs={[
      { id: "home",       label: DEFAULT_LABELS.home,       href: "/",           isActive: p === "/",
        icon: { outline: <HomeOutline className="h-6 w-6" />, filled: <HomeFill className="h-6 w-6" /> } },
      { id: "store",      label: DEFAULT_LABELS.store,      href: "/store",      isActive: p.startsWith("/store"),
        icon: { outline: <StoreOutline className="h-6 w-6" />, filled: <StoreFill className="h-6 w-6" /> } },
      { id: "categories", label: DEFAULT_LABELS.categories, href: "/categories", isActive: p.startsWith("/categories") || p.startsWith("/products"),
        icon: { outline: <CubeOutline className="h-6 w-6" />, filled: <CubeFill className="h-6 w-6" /> } },
      { id: "cart",       label: DEFAULT_LABELS.cart,       onClick: onCartOpen, isActive: false, badge: cartCount,
        icon: { outline: <BagOutline className="h-6 w-6" />, filled: <BagFill className="h-6 w-6" /> } },
    ]} />
  )
}
```

Drop `<MobileNav />` anywhere in your layout — it is `lg:hidden` by default.

## With i18n (pass translated strings)

Replace the `DEFAULT_LABELS.*` values with your `t()` calls:

```tsx
// Next.js + next-intl / any t() function
const t = useTranslations()

tabs={[
  { id: "home", label: t("nav.home"), href: "/", ... },
  { id: "cart", label: t("cart.title"), onClick: openCart, ... },
]}
```

## Styling & theming

The bar is fully styled out of the box — **no Tailwind, no CSS import, no
config**. It injects a small self-contained stylesheet at runtime the first time
it mounts (once per page, shared by every instance). It only renders below
`1024px` (a built-in `min-width: 1024px` hides it on desktop) and respects
`prefers-reduced-motion`.

Icon **sizing** is yours to control — the bar doesn't size your icons. Use
whatever you like (Tailwind `h-6 w-6`, inline `style`, an SVG `width`/`height`,
or a CSS rule like `.mtb-icon svg { width: 22px }`).

### Theme with CSS variables

Override any of these on an ancestor (`:root`, a layout wrapper, …) — they
cascade in. Defaults shown:

| Variable | Default | What it sets |
|---|---|---|
| `--mtb-accent` | `#ff5b2e` | active label/icon + badge background |
| `--mtb-accent-soft` | `rgba(255,91,46,0.12)` | sliding active pill |
| `--mtb-surface` | `rgba(20,20,22,0.72)` | nav glass background |
| `--mtb-surface-handle` | `rgba(20,20,22,0.55)` | collapsed handle |
| `--mtb-text` | `rgba(255,255,255,0.55)` | inactive label/icon |
| `--mtb-text-hover` | `rgba(255,255,255,0.85)` | hover color |
| `--mtb-border` | `rgba(255,255,255,0.08)` | hairline border |
| `--mtb-radius` | `26px` | nav corner radius |
| `--mtb-badge-text` | `#fff` | badge text |
| `--mtb-badge-ring` | `rgba(20,20,22,0.95)` | badge outline ring |

```css
:root {
  --mtb-accent: #3b82f6;
  --mtb-accent-soft: rgba(59, 130, 246, 0.14);
}
```

### SSR / avoiding a first-paint flash

Because the stylesheet is injected on mount, a server-rendered page shows one
unstyled frame before hydration. To avoid it, ship the styles eagerly — either
import the stylesheet once in your app entry:

```ts
import "medusa-mobile-tabbar/styles.css"
```

or inline the exported `STYLE_CSS` string into a `<style>` tag during SSR.

## RTL / bidirectional languages

The bar mirrors automatically for right-to-left languages (Arabic, Hebrew,
Persian, Urdu, …): tab order reverses and the badge moves to the start side.

By default `dir="auto"` reads the document direction (`<html dir>` / computed
`direction`) and updates if it changes — so if your app already sets the page
direction, you don't need to do anything. To force it, pass `dir`:

```tsx
<MobileTabBar tabs={tabs} dir="rtl" />
```

> **SSR tip:** with `dir="auto"` the bar renders left-to-right until it mounts and
> reads the document, so a server-rendered RTL page shows a one-frame LTR layout.
> If you render RTL on the server, pass `dir="rtl"` explicitly to avoid the flash.

## With Next.js `Link`

```tsx
import Link from "next/link"
import { type TabLinkProps } from "medusa-mobile-tabbar"

<MobileTabBar
  tabs={tabs}
  renderLink={({ href, children, className, ...props }: TabLinkProps) => (
    <Link href={href} className={className} {...(props as object)}>{children}</Link>
  )}
/>
```

## With TanStack Router `Link`

```tsx
import { Link } from "@tanstack/react-router"

<MobileTabBar
  tabs={tabs}
  renderLink={({ href, children, className }) => (
    <Link to={href} className={className}>{children}</Link>
  )}
/>
```

## Hide the bar from a page

```tsx
import { useHideTabBar } from "medusa-mobile-tabbar"

function CheckoutPage() {
  useHideTabBar(true) // hides while mounted
}
```

## API

### `<MobileTabBar>`

| Prop | Type | Default |
|---|---|---|
| `tabs` | `TabItem[]` | required |
| `renderLink` | `(props: TabLinkProps) => ReactNode` | `<a>` tag |
| `ariaLabels` | `{ showNav?: string; mobileNav?: string }` | English |
| `dir` | `"ltr" \| "rtl" \| "auto"` | `"auto"` |
| `activeId` | `string` | — |
| `haptics` | `boolean` | `false` |
| `className` | `string` | `""` |

### Controlled active tab (`activeId`)

Instead of setting `isActive` on every tab, pass the active tab's `id` once — the
matching tab becomes active and the per-tab booleans can be dropped:

```tsx
const p = usePathname()
const activeId =
  p === "/" ? "home" : p.startsWith("/store") ? "store" : "categories"

<MobileTabBar activeId={activeId} tabs={[
  { id: "home",  label: "Home",  href: "/",      icon: { /* … */ } },
  { id: "store", label: "Store", href: "/store", icon: { /* … */ } },
]} />
```

`isActive` still works when `activeId` is omitted, so existing code is unaffected.

### Haptics

Pass `haptics` to fire a short `navigator.vibrate(10)` on tap (Android Chrome et
al.; a no-op where unsupported, e.g. iOS Safari):

```tsx
<MobileTabBar haptics tabs={tabs} />
```

### `DEFAULT_LABELS`

```ts
{ home: "Home", store: "Store", categories: "Products", cart: "Cart",
  showNav: "Show navigation", mobileNav: "Mobile navigation" }
```

### `TabItem`

```ts
type TabItem = {
  id: string
  label: string
  icon: { outline: ReactNode; filled: ReactNode }
  isActive?: boolean // optional — or drive it with the activeId prop
  badge?: number
} & ({ href: string } | { onClick: () => void })
```

## Playground

Preview LTR/RTL mirroring, the sliding active indicator, the press / active-icon
animations, live accent theming, and the scroll-collapse behavior locally (use a
narrow viewport — the bar is hidden ≥1024px):

```bash
npm install
npm run playground
```
