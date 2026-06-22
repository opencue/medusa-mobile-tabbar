import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useHideTabBar, useTabBarHidden } from "./useTabBarHidden"

describe("useHideTabBar ref-counting", () => {
  it("hides while at least one consumer requests it and releases on unmount", () => {
    const probe = renderHook(() => useTabBarHidden())
    expect(probe.result.current).toBe(false)

    const a = renderHook(() => useHideTabBar(true))
    expect(probe.result.current).toBe(true)

    const b = renderHook(() => useHideTabBar(true))
    expect(probe.result.current).toBe(true)

    a.unmount()
    expect(probe.result.current).toBe(true) // b still holding

    b.unmount()
    expect(probe.result.current).toBe(false)
  })

  it("does not acquire when hidden is false", () => {
    const probe = renderHook(() => useTabBarHidden())
    const passive = renderHook(() => useHideTabBar(false))
    expect(probe.result.current).toBe(false)
    passive.unmount()
    expect(probe.result.current).toBe(false)
  })
})
