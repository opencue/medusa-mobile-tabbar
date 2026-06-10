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

/** English default labels — override with your i18n t() function. */
export const DEFAULT_LABELS = {
  home: "Home",
  store: "Store",
  categories: "Products",
  cart: "Cart",
  showNav: "Show navigation",
  mobileNav: "Mobile navigation",
} as const
