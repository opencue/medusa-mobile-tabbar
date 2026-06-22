# medusa-mobile-tabbar

Floating iOS-style bottom tab bar for Medusa storefronts. Works with Next.js, TanStack Router, or plain React. Zero runtime deps beyond React.

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

Preview LTR/RTL mirroring, the press / active-icon animations, and the
scroll-collapse behavior locally (use a narrow viewport — the bar is
`lg:hidden`):

```bash
npm install
npm run playground
```
