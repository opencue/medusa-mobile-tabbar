export { MobileTabBar, default } from "./components/MobileTabBar"
export { useTabBarHidden, useHideTabBar } from "./hooks/useTabBarHidden"
export {
  HomeOutline,
  HomeFill,
  StoreOutline,
  StoreFill,
  CubeOutline,
  CubeFill,
  BagOutline,
  BagFill,
} from "./components/icons"
export type { MobileTabBarProps, TabItem, TabLinkProps } from "./types"

/**
 * The component injects this stylesheet automatically at runtime. Exported for
 * SSR/no-FOUC: inline `STYLE_CSS` in a <style> tag, or import the shipped
 * `medusa-mobile-tabbar/styles.css`.
 */
export { STYLE_CSS } from "./styles"

/** English default labels — override with your i18n t() function. */
export const DEFAULT_LABELS = {
  home: "Home",
  store: "Store",
  categories: "Products",
  cart: "Cart",
  showNav: "Show navigation",
  mobileNav: "Mobile navigation",
} as const
