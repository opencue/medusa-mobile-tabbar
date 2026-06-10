import type { ReactNode } from "react"

export type TabLinkProps = {
  href: string
  children: ReactNode
  className?: string
  role?: string
  "aria-selected"?: boolean
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
  /** Extra class names on the outer <nav> wrapper */
  className?: string
}
