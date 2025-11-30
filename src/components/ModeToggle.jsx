"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-10 h-5 rounded-full transition-colors duration-300 
        ${isDark ? "bg-white/20 border border-gray-500" : "bg-gray-300 border border-gray-400"}`}
    >
      <span
        className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
          ${isDark ? "translate-x-5 bg-primary" : "translate-x-0 bg-primary"}`}
      />
    </button>
  )
}
