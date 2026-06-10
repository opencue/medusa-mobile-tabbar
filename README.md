# medusa-mobile-tabbar

Floating iOS-style bottom tab bar for Medusa storefronts. Framework-agnostic — works with Next.js, TanStack Router, or plain React.

## Install

```bash
npm install medusa-mobile-tabbar
# or
pnpm add medusa-mobile-tabbar
```

Requires `react >= 18` as a peer dependency.

## Usage

### Next.js (teherguminet)

```tsx
// components/MobileNav.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MobileTabBar,
  HomeOutline, HomeFill,
  StoreOutline, StoreFill,
  CubeOutline, CubeFill,
  BagOutline, BagFill,
  type TabLinkProps,
} from "medusa-mobile-tabbar"

// Wire up your cart state however you do it in teherguminet
function useTeherguminetCart() {
  // replace with your real cart hook
  return { count: 0, isOpen: false, open: () => {} }
}

export function MobileNav() {
  const pathname = usePathname()
  const { count, isOpen, open } = useTeherguminetCart()

  const tabs = [
    {
      id: "home",
      label: "Főoldal",
      href: "/",
      isActive: pathname === "/",
      icon: { outline: <HomeOutline className="h-6 w-6" />, filled: <HomeFill className="h-6 w-6" /> },
    },
    {
      id: "store",
      label: "Áruház",
      href: "/store",
      isActive: pathname.startsWith("/store"),
      icon: { outline: <StoreOutline className="h-6 w-6" />, filled: <StoreFill className="h-6 w-6" /> },
    },
    {
      id: "categories",
      label: "Termékek",
      href: "/categories",
      isActive: pathname.startsWith("/categories") || pathname.startsWith("/products"),
      icon: { outline: <CubeOutline className="h-6 w-6" />, filled: <CubeFill className="h-6 w-6" /> },
    },
    {
      id: "cart",
      label: "Kosár",
      isActive: isOpen,
      onClick: open,
      badge: count,
      icon: { outline: <BagOutline className="h-6 w-6" />, filled: <BagFill className="h-6 w-6" /> },
    },
  ]

  return (
    <MobileTabBar
      tabs={tabs}
      renderLink={({ href, children, className, ...props }: TabLinkProps) => (
        <Link href={href} className={className} {...(props as object)}>
          {children}
        </Link>
      )}
    />
  )
}
```

Then in your layout:

```tsx
// app/layout.tsx
import { MobileNav } from "@/components/MobileNav"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <MobileNav />
      </body>
    </html>
  )
}
```

### TanStack Router (LIFTEDV2)

```tsx
import { Link, useLocation } from "@tanstack/react-router"
import { MobileTabBar, HomeOutline, HomeFill, ... } from "medusa-mobile-tabbar"

<MobileTabBar
  tabs={tabs}
  renderLink={({ href, children, className }) => (
    <Link to={href} className={className}>{children}</Link>
  )}
/>
```

## API

### `<MobileTabBar>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | `TabItem[]` | required | Array of tab definitions |
| `renderLink` | `(props: TabLinkProps) => ReactNode` | `<a>` tag | Custom link renderer |
| `className` | `string` | `""` | Extra classes on the `<nav>` |

### `TabItem`

```ts
type TabItem = {
  id: string
  label: string
  icon: { outline: ReactNode; filled: ReactNode }
  isActive: boolean
  badge?: number             // shows a red badge with this count
} & (
  | { href: string }         // link tab
  | { onClick: () => void }  // button tab (e.g. cart drawer)
)
```

### `useHideTabBar(hidden: boolean)`

Call in any page/component to hide the bar while `hidden` is true (e.g. while a full-height drawer is open). Releases automatically on unmount.

```tsx
import { useHideTabBar } from "medusa-mobile-tabbar"

function CheckoutPage() {
  useHideTabBar(true) // hide while on checkout
  return <div>...</div>
}
```

## Behaviour

- Hides automatically near the page bottom when scrolling down (reveals footer)
- Shrinks to 82% while actively scrolling down, springs back on idle
- Collapsed state shows a small pull handle — tap to restore
- `lg:hidden` — invisible on desktop (`>= 1024px`)
- Safe-area-inset-bottom aware (iPhone notch)
- Active tab: orange accent (`#ff5b2e`) with pill highlight
- Zero runtime dependencies beyond React
