"use client"

import { useEffect } from "react"

interface ShortcutHandlers {
  onNewCard?: () => void
  onSearch?: () => void
  onToggleEdit?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey

      if (isMod && e.key === "n") {
        e.preventDefault()
        handlers.onNewCard?.()
      }
      if (isMod && e.key === "k") {
        e.preventDefault()
        handlers.onSearch?.()
      }
      if (isMod && e.key === "e") {
        e.preventDefault()
        handlers.onToggleEdit?.()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handlers])
}
