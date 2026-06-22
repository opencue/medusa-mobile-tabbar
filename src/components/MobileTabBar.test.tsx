import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { MobileTabBar } from "./MobileTabBar"
import type { TabItem } from "../types"

const icon = { outline: <svg data-testid="outline" />, filled: <svg data-testid="filled" /> }

const linkTabs = (overrides: Partial<TabItem> = {}): TabItem[] => [
  { id: "home", label: "Home", href: "/", isActive: true, icon },
  { id: "store", label: "Store", href: "/store", isActive: false, icon },
  { id: "cart", label: "Cart", href: "/cart", isActive: false, badge: 3, icon, ...overrides } as TabItem,
]

const nav = () => screen.getByRole("navigation", { name: "Mobile navigation" })

afterEach(() => {
  document.documentElement.removeAttribute("dir")
})

describe("dir resolution", () => {
  it("forces the direction when dir is passed explicitly", () => {
    render(<MobileTabBar tabs={linkTabs()} dir="rtl" />)
    expect(nav()).toHaveAttribute("dir", "rtl")
  })

  it("reads the document direction when dir='auto' and reacts to live changes", async () => {
    document.documentElement.setAttribute("dir", "rtl")
    render(<MobileTabBar tabs={linkTabs()} />) // dir defaults to "auto"

    await waitFor(() => expect(nav()).toHaveAttribute("dir", "rtl"))

    await act(async () => {
      document.documentElement.setAttribute("dir", "ltr")
    })
    await waitFor(() => expect(nav()).toHaveAttribute("dir", "ltr"))
  })
})

describe("badge", () => {
  it("folds the count into the tab's accessible name and hides the visual badge", () => {
    render(<MobileTabBar tabs={linkTabs()} dir="ltr" />)
    expect(screen.getByRole("link", { name: "Cart, 3" })).toBeInTheDocument()
    expect(screen.getByText("3")).toHaveAttribute("aria-hidden", "true")
  })

  it("caps the visual badge and accessible name at 99+", () => {
    render(<MobileTabBar tabs={linkTabs({ badge: 150 })} dir="ltr" />)
    expect(screen.getByRole("link", { name: "Cart, 99+" })).toBeInTheDocument()
    expect(screen.getByText("99+")).toBeInTheDocument()
  })

  it("omits the badge when the count is zero", () => {
    render(<MobileTabBar tabs={linkTabs({ badge: 0 })} dir="ltr" />)
    expect(screen.getByRole("link", { name: "Cart" })).toBeInTheDocument()
    expect(screen.queryByText("0")).not.toBeInTheDocument()
  })
})

describe("active semantics", () => {
  it("marks the active link with aria-current='page' and leaves others unset", () => {
    render(<MobileTabBar tabs={linkTabs()} dir="ltr" />)
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "Store" })).not.toHaveAttribute("aria-current")
  })

  it("uses aria-pressed for action (onClick) tabs", () => {
    const tabs: TabItem[] = [
      { id: "home", label: "Home", onClick: () => {}, isActive: true, icon },
    ]
    render(<MobileTabBar tabs={tabs} dir="ltr" />)
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-pressed", "true")
  })
})

describe("controlled activeId", () => {
  it("activeId selects the active tab and overrides per-tab isActive", () => {
    // Every tab claims isActive:false, but activeId="store" should win.
    const tabs: TabItem[] = [
      { id: "home", label: "Home", href: "/", isActive: false, icon },
      { id: "store", label: "Store", href: "/store", isActive: false, icon },
    ]
    render(<MobileTabBar tabs={tabs} dir="ltr" activeId="store" />)
    expect(screen.getByRole("link", { name: "Store" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current")
  })

  it("works without any per-tab isActive booleans", () => {
    const tabs: TabItem[] = [
      { id: "home", label: "Home", href: "/", icon },
      { id: "store", label: "Store", href: "/store", icon },
    ]
    render(<MobileTabBar tabs={tabs} dir="ltr" activeId="home" />)
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page")
  })
})

describe("haptics", () => {
  it("vibrates on tap only when enabled", async () => {
    const vibrate = vi.fn()
    vi.stubGlobal("navigator", { ...navigator, vibrate })
    const user = userEvent.setup()
    const onClick = vi.fn()
    const tabs: TabItem[] = [{ id: "cart", label: "Cart", onClick, isActive: false, icon }]

    const { rerender } = render(<MobileTabBar tabs={tabs} dir="ltr" haptics />)
    await user.click(screen.getByRole("button", { name: "Cart" }))
    expect(vibrate).toHaveBeenCalledWith(10)
    expect(onClick).toHaveBeenCalledTimes(1)

    vibrate.mockClear()
    rerender(<MobileTabBar tabs={tabs} dir="ltr" />) // haptics off
    await user.click(screen.getByRole("button", { name: "Cart" }))
    expect(vibrate).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })
})
