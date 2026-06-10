"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useTabBarHidden } from "../hooks/useTabBarHidden"
import type { MobileTabBarProps, TabLinkProps } from "../types"

const TAB_BASE =
  "inline-flex min-w-[72px] flex-col items-center gap-[3px] rounded-[20px] px-[14px] pt-2 pb-[7px] text-[10.5px] font-medium tracking-[0.005em] text-white/55 transition-[color,background-color,transform] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:text-white/85 active:scale-[0.94]"
const TAB_ACTIVE = "!text-[#ff5b2e] bg-[rgba(255,91,46,0.12)]"

const COLLAPSE_NEAR_BOTTOM_PX = 220
const SHRINK_AFTER_PX = 48

const DefaultLink = ({ href, children, className, ...props }: TabLinkProps) => (
  <a href={href} className={className} {...(props as Record<string, unknown>)}>
    {children}
  </a>
)

export const MobileTabBar = ({
  tabs,
  renderLink,
  ariaLabels,
  className = "",
}: MobileTabBarProps) => {
  const showNavLabel = ariaLabels?.showNav ?? "Show navigation"
  const mobileNavLabel = ariaLabels?.mobileNav ?? "Mobile navigation"
  const hidden = useTabBarHidden()
  const [collapsed, setCollapsed] = useState(false)
  const [compact, setCompact] = useState(false)
  const lastYRef = useRef(0)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    const icon = (
      <span className="relative inline-flex h-[26px] w-[26px] items-center justify-center">
        {tab.isActive ? tab.icon.filled : tab.icon.outline}
        {(tab.badge ?? 0) > 0 && (
          <span
            className="pointer-events-none absolute -top-[3px] -right-[7px] inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#ff5b2e] px-[5px] text-[10px] font-bold leading-none text-white [font-variant-numeric:tabular-nums]"
            style={{ boxShadow: "0 0 0 2px rgba(20,20,22,0.95)" }}
          >
            {tab.badge}
          </span>
        )}
      </span>
    )

    const inner = (
      <>
        {icon}
        <span className="leading-none">{tab.label}</span>
      </>
    )

    const tabClass = `${TAB_BASE} ${tab.isActive ? TAB_ACTIVE : ""}`

    if (tab.onClick) {
      return (
        <button
          key={tab.id}
          type="button"
          onClick={tab.onClick}
          role="tab"
          aria-selected={tab.isActive}
          className={tabClass}
        >
          {inner}
        </button>
      )
    }

    return (
      <span key={tab.id} role="tab" aria-selected={tab.isActive}>
        {LinkRenderer({
          href: tab.href as string,
          children: inner,
          className: tabClass,
          "aria-selected": tab.isActive,
        })}
      </span>
    )
  }

  return (
    <>
      {/* Collapsed handle — tap to restore the nav */}
      <button
        type="button"
        aria-label={showNavLabel}
        aria-hidden={!collapsed}
        tabIndex={collapsed ? 0 : -1}
        onClick={() => setCollapsed(false)}
        className="fixed left-1/2 z-[90] rounded-full border border-white/[0.08] backdrop-blur-[20px] backdrop-saturate-[1.6] transition-[transform,opacity] duration-200 ease-out lg:hidden"
        style={{
          bottom: "max(2px, calc(env(safe-area-inset-bottom) - 22px))",
          width: 60,
          height: 8,
          transform: `translateX(-50%) scale(${collapsed ? 1 : 0.4})`,
          opacity: collapsed ? 1 : 0,
          pointerEvents: collapsed ? "auto" : "none",
          transitionDelay: collapsed ? "120ms" : "0ms",
          background: "rgba(20, 20, 22, 0.55)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 22px -10px rgba(0,0,0,0.55)",
        }}
      />

      <nav
        role="tablist"
        aria-label={mobileNavLabel}
        aria-hidden={collapsed}
        className={`fixed left-1/2 z-[90] inline-flex items-stretch gap-[2px] rounded-[26px] border border-white/[0.08] backdrop-blur-[28px] backdrop-saturate-[1.8] transition-[transform,opacity,padding] ease-[cubic-bezier(0.34,0.02,0.5,1)] lg:hidden ${collapsed ? "duration-[180ms]" : "duration-300"} ${compact ? "p-1" : "p-1.5"} ${className}`}
        style={{
          bottom: "max(2px, calc(env(safe-area-inset-bottom) - 26px))",
          transform: `translateX(-50%) scale(${collapsed ? 0.3 : compact ? 0.82 : 1})`,
          transformOrigin: "bottom center",
          opacity: collapsed ? 0 : compact ? 0.96 : 1,
          pointerEvents: collapsed ? "none" : "auto",
          background: "rgba(20, 20, 22, 0.72)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 50px -18px rgba(0,0,0,0.7), 0 6px 18px -8px rgba(0,0,0,0.5)",
        }}
      >
        {tabs.map(renderTab)}
      </nav>
    </>
  )
}

export default MobileTabBar
