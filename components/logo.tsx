"use client"

import { useEffect, useState } from "react"

export default function Logo() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay the logo appearance for dramatic effect
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 4500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
    >
      {/* Glow effect behind text */}
      <div className="absolute inset-0 blur-3xl opacity-50 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />

      {/* Main text */}
      <h1 className="relative text-6xl md:text-8xl font-bold text-center">
        <span
          className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
          style={{
            fontFamily: "Brush Script MT, cursive",
            fontStyle: "italic",
            letterSpacing: "0.05em",
            textShadow: "0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(255, 0, 255, 0.3)",
          }}
        >
          all the vibes
        </span>
      </h1>

      {/* Neon underline effect */}
      <div className="mt-4 h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 rounded-full opacity-60 blur-sm" />
    </div>
  )
}
