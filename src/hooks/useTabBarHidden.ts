import { useEffect, useSyncExternalStore } from "react"

let hideCount = 0
const listeners = new Set<() => void>()

const notify = () => listeners.forEach((l) => l())
const acquire = () => { hideCount += 1; notify() }
const release = () => { hideCount = Math.max(0, hideCount - 1); notify() }

/** Returns true when at least one consumer has requested the tab bar hidden. */
export const useTabBarHidden = () =>
  useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => hideCount > 0,
    () => false
  )

/**
 * Request the floating tab bar be hidden while `hidden === true`.
 * Releases automatically on unmount or when `hidden` flips back to false.
 *
 * Use this in pages/components that show a full-height bottom sheet:
 *   useHideTabBar(isSheetOpen)
 */
export const useHideTabBar = (hidden: boolean) => {
  useEffect(() => {
    if (!hidden) return
    acquire()
    return () => release()
  }, [hidden])
}
