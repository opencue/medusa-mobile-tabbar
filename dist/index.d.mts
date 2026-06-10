import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

type TabLinkProps = {
    href: string;
    children: ReactNode;
    className?: string;
    role?: string;
    "aria-selected"?: boolean;
    [key: string]: unknown;
};
type TabItem = {
    id: string;
    label: string;
    icon: {
        outline: ReactNode;
        filled: ReactNode;
    };
    isActive: boolean;
    badge?: number;
    href: string;
    onClick?: never;
} | {
    id: string;
    label: string;
    icon: {
        outline: ReactNode;
        filled: ReactNode;
    };
    isActive: boolean;
    badge?: number;
    href?: never;
    onClick: () => void;
};
type MobileTabBarProps = {
    tabs: TabItem[];
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
    renderLink?: (props: TabLinkProps) => ReactNode;
    /** Extra class names on the outer <nav> wrapper */
    className?: string;
};

declare const MobileTabBar: ({ tabs, renderLink, className, }: MobileTabBarProps) => react_jsx_runtime.JSX.Element | null;

/** Returns true when at least one consumer has requested the tab bar hidden. */
declare const useTabBarHidden: () => boolean;
/**
 * Request the floating tab bar be hidden while `hidden === true`.
 * Releases automatically on unmount or when `hidden` flips back to false.
 *
 * Use this in pages/components that show a full-height bottom sheet:
 *   useHideTabBar(isSheetOpen)
 */
declare const useHideTabBar: (hidden: boolean) => void;

type P = {
    className?: string;
};
declare const HomeOutline: ({ className }: P) => react_jsx_runtime.JSX.Element;
declare const HomeFill: ({ className }: P) => react_jsx_runtime.JSX.Element;
declare const StoreOutline: ({ className }: P) => react_jsx_runtime.JSX.Element;
declare const StoreFill: ({ className }: P) => react_jsx_runtime.JSX.Element;
declare const CubeOutline: ({ className }: P) => react_jsx_runtime.JSX.Element;
declare const CubeFill: ({ className }: P) => react_jsx_runtime.JSX.Element;
declare const BagOutline: ({ className }: P) => react_jsx_runtime.JSX.Element;
declare const BagFill: ({ className }: P) => react_jsx_runtime.JSX.Element;

export { BagFill, BagOutline, CubeFill, CubeOutline, HomeFill, HomeOutline, MobileTabBar, type MobileTabBarProps, StoreFill, StoreOutline, type TabItem, type TabLinkProps, MobileTabBar as default, useHideTabBar, useTabBarHidden };
