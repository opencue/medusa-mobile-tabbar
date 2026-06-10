// src/components/MobileTabBar.tsx
import { useEffect as useEffect2, useRef, useState } from "react";

// src/hooks/useTabBarHidden.ts
import { useEffect, useSyncExternalStore } from "react";
var hideCount = 0;
var listeners = /* @__PURE__ */ new Set();
var notify = () => listeners.forEach((l) => l());
var acquire = () => {
  hideCount += 1;
  notify();
};
var release = () => {
  hideCount = Math.max(0, hideCount - 1);
  notify();
};
var useTabBarHidden = () => useSyncExternalStore(
  (cb) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  () => hideCount > 0,
  () => false
);
var useHideTabBar = (hidden) => {
  useEffect(() => {
    if (!hidden) return;
    acquire();
    return () => release();
  }, [hidden]);
};

// src/components/MobileTabBar.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var TAB_BASE = "inline-flex min-w-[72px] flex-col items-center gap-[3px] rounded-[20px] px-[14px] pt-2 pb-[7px] text-[10.5px] font-medium tracking-[0.005em] text-white/55 transition-[color,background-color,transform] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:text-white/85 active:scale-[0.94]";
var TAB_ACTIVE = "!text-[#ff5b2e] bg-[rgba(255,91,46,0.12)]";
var COLLAPSE_NEAR_BOTTOM_PX = 220;
var SHRINK_AFTER_PX = 48;
var DefaultLink = ({ href, children, className, ...props }) => /* @__PURE__ */ jsx("a", { href, className, ...props, children });
var MobileTabBar = ({
  tabs,
  renderLink,
  className = ""
}) => {
  const hidden = useTabBarHidden();
  const [collapsed, setCollapsed] = useState(false);
  const [compact, setCompact] = useState(false);
  const lastYRef = useRef(0);
  const idleTimerRef = useRef(null);
  useEffect2(() => {
    if (typeof window === "undefined") return;
    lastYRef.current = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          const viewport = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;
          const nearBottom = y + viewport >= docHeight - COLLAPSE_NEAR_BOTTOM_PX;
          const goingDown = y > lastYRef.current + 2;
          const goingUp = y < lastYRef.current - 2;
          if (goingDown && nearBottom) setCollapsed(true);
          else if (goingUp) setCollapsed(false);
          if (y <= SHRINK_AFTER_PX) setCompact(false);
          else if (goingDown) setCompact(true);
          else if (goingUp) setCompact(false);
          lastYRef.current = y;
          ticking = false;
        });
      }
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setCompact(false), 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);
  if (hidden) return null;
  const LinkRenderer = renderLink ?? DefaultLink;
  const renderTab = (tab) => {
    const icon = /* @__PURE__ */ jsxs("span", { className: "relative inline-flex h-[26px] w-[26px] items-center justify-center", children: [
      tab.isActive ? tab.icon.filled : tab.icon.outline,
      (tab.badge ?? 0) > 0 && /* @__PURE__ */ jsx(
        "span",
        {
          className: "pointer-events-none absolute -top-[3px] -right-[7px] inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#ff5b2e] px-[5px] text-[10px] font-bold leading-none text-white [font-variant-numeric:tabular-nums]",
          style: { boxShadow: "0 0 0 2px rgba(20,20,22,0.95)" },
          children: tab.badge
        }
      )
    ] });
    const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
      icon,
      /* @__PURE__ */ jsx("span", { className: "leading-none", children: tab.label })
    ] });
    const tabClass = `${TAB_BASE} ${tab.isActive ? TAB_ACTIVE : ""}`;
    if (tab.onClick) {
      return /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: tab.onClick,
          role: "tab",
          "aria-selected": tab.isActive,
          className: tabClass,
          children: inner
        },
        tab.id
      );
    }
    return /* @__PURE__ */ jsx("span", { role: "tab", "aria-selected": tab.isActive, children: LinkRenderer({
      href: tab.href,
      children: inner,
      className: tabClass,
      "aria-selected": tab.isActive
    }) }, tab.id);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        "aria-label": "Show navigation",
        "aria-hidden": !collapsed,
        tabIndex: collapsed ? 0 : -1,
        onClick: () => setCollapsed(false),
        className: "fixed left-1/2 z-[90] rounded-full border border-white/[0.08] backdrop-blur-[20px] backdrop-saturate-[1.6] transition-[transform,opacity] duration-200 ease-out lg:hidden",
        style: {
          bottom: "max(2px, calc(env(safe-area-inset-bottom) - 22px))",
          width: 60,
          height: 8,
          transform: `translateX(-50%) scale(${collapsed ? 1 : 0.4})`,
          opacity: collapsed ? 1 : 0,
          pointerEvents: collapsed ? "auto" : "none",
          transitionDelay: collapsed ? "120ms" : "0ms",
          background: "rgba(20, 20, 22, 0.55)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 22px -10px rgba(0,0,0,0.55)"
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "nav",
      {
        role: "tablist",
        "aria-label": "Mobile navigation",
        "aria-hidden": collapsed,
        className: `fixed left-1/2 z-[90] inline-flex items-stretch gap-[2px] rounded-[26px] border border-white/[0.08] backdrop-blur-[28px] backdrop-saturate-[1.8] transition-[transform,opacity,padding] ease-[cubic-bezier(0.34,0.02,0.5,1)] lg:hidden ${collapsed ? "duration-[180ms]" : "duration-300"} ${compact ? "p-1" : "p-1.5"} ${className}`,
        style: {
          bottom: "max(2px, calc(env(safe-area-inset-bottom) - 26px))",
          transform: `translateX(-50%) scale(${collapsed ? 0.3 : compact ? 0.82 : 1})`,
          transformOrigin: "bottom center",
          opacity: collapsed ? 0 : compact ? 0.96 : 1,
          pointerEvents: collapsed ? "none" : "auto",
          background: "rgba(20, 20, 22, 0.72)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 50px -18px rgba(0,0,0,0.7), 0 6px 18px -8px rgba(0,0,0,0.5)"
        },
        children: tabs.map(renderTab)
      }
    )
  ] });
};
var MobileTabBar_default = MobileTabBar;

// src/components/icons.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var HomeOutline = ({ className }) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
    children: [
      /* @__PURE__ */ jsx2("path", { d: "M3 11l9-7 9 7" }),
      /* @__PURE__ */ jsx2("path", { d: "M5 10v10h14V10" }),
      /* @__PURE__ */ jsx2("path", { d: "M10 20v-6h4v6" })
    ]
  }
);
var HomeFill = ({ className }) => /* @__PURE__ */ jsx2(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
    children: /* @__PURE__ */ jsx2("path", { d: "M3.2 11.2l8.8-6.8 8.8 6.8V20a1 1 0 0 1-1 1h-4.6v-6h-6.4v6H4.2a1 1 0 0 1-1-1z" })
  }
);
var StoreOutline = ({ className }) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
    children: [
      /* @__PURE__ */ jsx2("path", { d: "M3 9l2-5h14l2 5" }),
      /* @__PURE__ */ jsx2("path", { d: "M3 9v11h18V9" }),
      /* @__PURE__ */ jsx2("path", { d: "M9 14h6" })
    ]
  }
);
var StoreFill = ({ className }) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "currentColor",
    strokeWidth: "1.2",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
    children: [
      /* @__PURE__ */ jsx2("path", { d: "M3 4.5h18L22.5 9a2.5 2.5 0 0 1-4.5 1.5A2.5 2.5 0 0 1 13.5 9a2.5 2.5 0 0 1-4.5 1.5A2.5 2.5 0 0 1 4.5 9 2.5 2.5 0 0 1 1.5 9L3 4.5z" }),
      /* @__PURE__ */ jsx2("path", { d: "M4 11.5V20h6v-5h4v5h6v-8.5" })
    ]
  }
);
var CubeOutline = ({ className }) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
    children: [
      /* @__PURE__ */ jsx2("path", { d: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" }),
      /* @__PURE__ */ jsx2("path", { d: "M4 7.5l8 4.5 8-4.5" }),
      /* @__PURE__ */ jsx2("path", { d: "M12 12v9" })
    ]
  }
);
var CubeFill = ({ className }) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "currentColor",
    strokeWidth: "1.2",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
    children: [
      /* @__PURE__ */ jsx2("path", { d: "M12 2.6L3.4 7.4v9.2L12 21.4l8.6-4.8V7.4L12 2.6zm0 2.2 6.6 3.7L12 12.2 5.4 8.5 12 4.8z", opacity: "0.55" }),
      /* @__PURE__ */ jsx2("path", { d: "M12 12.2L5.4 8.5v8l6.6 3.7v-8zm0 0 6.6-3.7v8L12 20.2v-8z" })
    ]
  }
);
var BagOutline = ({ className }) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
    children: [
      /* @__PURE__ */ jsx2("path", { d: "M6 7h12l-1 13H7L6 7z" }),
      /* @__PURE__ */ jsx2("path", { d: "M9 7V4a3 3 0 016 0v3" })
    ]
  }
);
var BagFill = ({ className }) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "currentColor",
    strokeWidth: "1.2",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
    children: [
      /* @__PURE__ */ jsx2("path", { d: "M6.2 7.5h11.6l-1.05 12.6a1 1 0 0 1-1 .9H8.25a1 1 0 0 1-1-.9L6.2 7.5z" }),
      /* @__PURE__ */ jsx2("path", { d: "M8.5 9V5.5a3.5 3.5 0 0 1 7 0V9", fill: "none", strokeWidth: "1.8", strokeLinecap: "round" })
    ]
  }
);
export {
  BagFill,
  BagOutline,
  CubeFill,
  CubeOutline,
  HomeFill,
  HomeOutline,
  MobileTabBar,
  StoreFill,
  StoreOutline,
  MobileTabBar_default as default,
  useHideTabBar,
  useTabBarHidden
};
