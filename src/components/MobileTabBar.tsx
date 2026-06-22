"use client"

import {
  Fragment,
  useCallback,
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useTabBarHidden } from "../hooks/useTabBarHidden"
import { ensureStyles } from "../styles"
import type { MobileTabBarProps, TabLinkProps } from "../types"

const COLLAPSE_NEAR_BOTTOM_PX = 220
const SHRINK_AFTER_PX = 48

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

const DefaultLink = ({ href, children, className, ...props }: TabLinkProps) => (
  <a href={href} className={className} {...(props as Record<string, unknown>)}>
    {children}
  </a>
)

/** Short tactile pulse on tap, where the platform supports it. */
const vibrate = () => {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(10)
  }
}

export const MobileTabBar = ({
  tabs,
  renderLink,
  ariaLabels,
  dir = "auto",
  activeId,
  haptics = false,
  className = "",
}: MobileTabBarProps) => {
  const showNavLabel = ariaLabels?.showNav ?? "Show navigation"
  const mobileNavLabel = ariaLabels?.mobileNav ?? "Mobile navigation"
  const hidden = useTabBarHidden()
  const [collapsed, setCollapsed] = useState(false)
  const [compact, setCompact] = useState(false)
  // Default to "ltr" until mounted so SSR markup matches the first client render.
  const [autoDir, setAutoDir] = useState<"ltr" | "rtl">("ltr")
  const lastYRef = useRef(0)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const [indicator, setIndicator] = useState({ x: 0, y: 0, w: 0, h: 0, visible: false })

  // Inject the self-contained stylesheet once (before layout, so measurements
  // below see the real sizes). No Tailwind required.
  useInsertionEffect(() => {
    ensureStyles()
  }, [])

  useEffect(() => {
    if (dir !== "auto" || typeof document === "undefined") return
    const root = document.documentElement
    const detect = () => {
      const declared = root.getAttribute("dir")
      const resolved =
        declared === "rtl" || declared === "ltr"
          ? declared
          : getComputedStyle(root).direction === "rtl"
            ? "rtl"
            : "ltr"
      setAutoDir(resolved)
    }
    detect()
    const observer = new MutationObserver(detect)
    observer.observe(root, { attributes: true, attributeFilter: ["dir"] })
    return () => observer.disconnect()
  }, [dir])

  const resolvedDir = dir === "auto" ? autoDir : dir

  // Index of the active tab — controlled `activeId` wins, else per-tab isActive.
  const activeIndex = tabs.findIndex((t) =>
    activeId != null ? t.id === activeId : !!t.isActive
  )

  // Position the sliding pill over the active tab. The nav's first child is the
  // indicator, so tab N is child N+1. offsetLeft/Top are layout-correct in both
  // LTR and RTL, so no direction-specific math is needed.
  const measure = useCallback(() => {
    const nav = navRef.current
    if (!nav || activeIndex < 0) {
      setIndicator((s) => (s.visible ? { ...s, visible: false } : s))
      return
    }
    const el = nav.children[activeIndex + 1] as HTMLElement | undefined
    if (!el) return
    setIndicator({
      x: el.offsetLeft,
      y: el.offsetTop,
      w: el.offsetWidth,
      h: el.offsetHeight,
      visible: true,
    })
  }, [activeIndex])

  useIsoLayoutEffect(() => {
    measure()
  }, [measure, compact, resolvedDir, tabs.length])

  useEffect(() => {
    const nav = navRef.current
    if (!nav || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(() => measure())
    ro.observe(nav)
    return () => ro.disconnect()
  }, [measure])

  useEffect(() => {
    if (typeof window === "undefined") return
    lastYRef.current = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(() => {
          const y = window.scrollY
          const viewport = window.innerHeight
          const docHeight = document.documentElement.scrollHeight
          const nearBottom = y + viewport >= docHeight - COLLAPSE_NEAR_BOTTOM_PX
          const goingDown = y > lastYRef.current + 2
          const goingUp = y < lastYRef.current - 2
          if (goingDown && nearBottom) setCollapsed(true)
          else if (goingUp) setCollapsed(false)
          if (y <= SHRINK_AFTER_PX) setCompact(false)
          else if (goingDown) setCompact(true)
          else if (goingUp) setCompact(false)
          lastYRef.current = y
          ticking = false
        })
      }
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => setCompact(false), 180)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  if (hidden) return null

  const LinkRenderer = renderLink ?? DefaultLink

  const renderTab = (tab: MobileTabBarProps["tabs"][number]): ReactNode => {
    // Controlled `activeId` wins when set; otherwise fall back to per-tab isActive.
    const isActive = activeId != null ? tab.id === activeId : !!tab.isActive
    const badgeCount = tab.badge ?? 0
    const badgeText = badgeCount > 99 ? "99+" : String(badgeCount)
    // When there's a badge, give the control an accessible name that includes the
    // count (e.g. "Cart, 3") instead of a bare number floating in the icon.
    const accessibleLabel = badgeCount > 0 ? `${tab.label}, ${badgeText}` : undefined

    const icon = (
      <span className={`mtb-icon${isActive ? " mtb-icon--active" : ""}`}>
        {isActive ? tab.icon.filled : tab.icon.outline}
        {badgeCount > 0 && (
          <span className="mtb-badge" aria-hidden="true">
            {badgeText}
          </span>
        )}
      </span>
    )

    const inner = (
      <>
        {icon}
        <span className="mtb-label">{tab.label}</span>
      </>
    )

    const tabClass = `mtb-tab${isActive ? " mtb-tab--active" : ""}`

    if (tab.onClick) {
      const onClick = tab.onClick
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => {
            if (haptics) vibrate()
            onClick()
          }}
          aria-pressed={isActive}
          aria-label={accessibleLabel}
          className={tabClass}
        >
          {inner}
        </button>
      )
    }

    return (
      <Fragment key={tab.id}>
        {LinkRenderer({
          href: tab.href as string,
          children: inner,
          className: tabClass,
          "aria-current": isActive ? "page" : undefined,
          "aria-label": accessibleLabel,
          // Reinforce the tap; navigation still proceeds (no preventDefault).
          onClick: haptics ? vibrate : undefined,
        })}
      </Fragment>
    )
  }

  return (
    <>
      {/* Collapsed handle — tap to restore the nav */}
      <button
        type="button"
        dir={resolvedDir}
        aria-label={showNavLabel}
        aria-hidden={!collapsed}
        tabIndex={collapsed ? 0 : -1}
        onClick={() => setCollapsed(false)}
        className="mtb-handle"
        style={{
          bottom: "max(2px, calc(env(safe-area-inset-bottom) - 22px))",
          transform: `translateX(-50%) scale(${collapsed ? 1 : 0.4})`,
          opacity: collapsed ? 1 : 0,
          pointerEvents: collapsed ? "auto" : "none",
          transitionDelay: collapsed ? "120ms" : "0ms",
        }}
      />

      <nav
        ref={navRef}
        dir={resolvedDir}
        aria-label={mobileNavLabel}
        aria-hidden={collapsed}
        className={`mtb-nav ${className}`.trim()}
        style={{
          bottom: "max(2px, calc(env(safe-area-inset-bottom) - 26px))",
          transform: `translateX(-50%) scale(${collapsed ? 0.3 : compact ? 0.82 : 1})`,
          opacity: collapsed ? 0 : compact ? 0.96 : 1,
          pointerEvents: collapsed ? "none" : "auto",
          padding: compact ? 4 : 6,
          transitionDuration: collapsed ? "180ms" : "300ms",
        }}
      >
        <span
          className="mtb-indicator"
          aria-hidden="true"
          style={{
            transform: `translate(${indicator.x}px, ${indicator.y}px)`,
            width: indicator.w,
            height: indicator.h,
            opacity: indicator.visible ? 1 : 0,
          }}
        />
        {tabs.map(renderTab)}
      </nav>
    </>
  )
}

export default MobileTabBar
