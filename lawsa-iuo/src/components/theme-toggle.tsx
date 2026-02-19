"use client"

import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="p-2 rounded-full bg-muted/50 animate-pulse">
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <HugeiconsIcon icon={Sun02Icon} className="w-5 h-5 text-yellow-500" />
      ) : (
        <HugeiconsIcon icon={Moon02Icon} className="w-5 h-5 text-slate-600" />
      )}
    </button>
  )
}
