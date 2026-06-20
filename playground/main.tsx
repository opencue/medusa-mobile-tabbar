import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import {
  MobileTabBar,
  DEFAULT_LABELS,
  HomeOutline,
  HomeFill,
  StoreOutline,
  StoreFill,
  CubeOutline,
  CubeFill,
  BagOutline,
  BagFill,
} from "../src"
import type { TabItem } from "../src"

function Demo() {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr")
  const [active, setActive] = useState("home")
  const [cart, setCart] = useState(3)

  // Arabic labels when in RTL so the mirroring reads naturally.
  const labels =
    dir === "rtl"
      ? { home: "الرئيسية", store: "المتجر", categories: "المنتجات", cart: "السلة" }
      : DEFAULT_LABELS

  const cls = "h-6 w-6"
  const tabs: TabItem[] = [
    {
      id: "home",
      label: labels.home,
      onClick: () => setActive("home"),
      isActive: active === "home",
      icon: { outline: <HomeOutline className={cls} />, filled: <HomeFill className={cls} /> },
    },
    {
      id: "store",
      label: labels.store,
      onClick: () => setActive("store"),
      isActive: active === "store",
      icon: { outline: <StoreOutline className={cls} />, filled: <StoreFill className={cls} /> },
    },
    {
      id: "categories",
      label: labels.categories,
      onClick: () => setActive("categories"),
      isActive: active === "categories",
      icon: { outline: <CubeOutline className={cls} />, filled: <CubeFill className={cls} /> },
    },
    {
      id: "cart",
      label: labels.cart,
      onClick: () => setCart((c) => c + 1),
      isActive: false,
      badge: cart,
      icon: { outline: <BagOutline className={cls} />, filled: <BagFill className={cls} /> },
    },
  ]

  return (
    <div dir={dir} style={{ minHeight: "260vh", padding: "24px 20px 200px" }}>
      <div style={{ position: "sticky", top: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => setDir((d) => (d === "ltr" ? "rtl" : "ltr"))}
          style={btnStyle}
        >
          dir: {dir.toUpperCase()} — toggle
        </button>
        <button onClick={() => setCart((c) => Math.max(0, c - 1))} style={btnStyle}>
          badge −
        </button>
        <button onClick={() => setCart((c) => c + 1)} style={btnStyle}>
          badge +
        </button>
      </div>

      <h1 style={{ fontSize: 22, marginTop: 28 }}>medusa-mobile-tabbar playground</h1>
      <p style={{ opacity: 0.7, maxWidth: 520, lineHeight: 1.6 }}>
        Toggle direction to see the bar mirror (tab order + badge). Tap a tab for the
        press / active-icon pop. Scroll down to the bottom to see the collapse handle,
        then scroll back up to restore. The bar is <code>lg:hidden</code>, so use a
        narrow / mobile viewport.
      </p>

      <div style={{ marginTop: 40, display: "grid", gap: 16 }}>
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            style={{
              height: 96,
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>

      <MobileTabBar tabs={tabs} dir={dir} />
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "inherit",
  fontSize: 13,
  cursor: "pointer",
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
)
