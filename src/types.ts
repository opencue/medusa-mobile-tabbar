import type { ReactNode } from "react"

export type TabLinkProps = {
  href: string
  children: ReactNode
  className?: string
  /** Set to "page" on the link for the currently-active route. */
  "aria-current"?: "page" | undefined
  /** Accessible name override (used to fold a badge count into the link name). */
  "aria-label"?: string
  [key: string]: unknown
}

export type TabItem =
  | {
      id: string
      label: string
      icon: { outline: ReactNode; filled: ReactNode }
      isActive: boolean
      badge?: number
      href: string
      onClick?: never
    }
  | {
      id: string
      label: string
      icon: { outline: ReactNode; filled: ReactNode }
      isActive: boolean
      badge?: number
      href?: never
      onClick: () => void
    }

export type MobileTabBarProps = {
  tabs: TabItem[]
  /**
   * Custom link renderer — swap in your router's Link component here.
   *
   * Next.js:
   *   renderLink={({ href, children, ...props }) => <Link href={href} {...props}>{children}</Link>}
   *
   * TanStack Router:
   *   renderLink={({ href, children, ...props }) => <RouterLink to={href} {...props}>{children}</RouterLink>}
   *
   * Defaults to a plain <a> tag when omitted.
   */
  renderLink?: (props: TabLinkProps) => ReactNode
  /** Override the two internal aria strings. Defaults to English. */
  ariaLabels?: {
    showNav?: string
    mobileNav?: string
  }
  /**
   * Layout direction for the bar. Tab order, badge position, and offsets all
   * mirror automatically for right-to-left languages (Arabic, Hebrew, Persian,
   * Urdu, …).
   *
   * - `"auto"` (default): read the document's direction (`<html dir>` /
   *   computed `direction`) on mount, SSR-safe.
   * - `"ltr"` / `"rtl"`: force a direction regardless of the document.
   */
  dir?: "ltr" | "rtl" | "auto"
  /** Extra class names on the outer <nav> wrapper */
  className?: string
}
