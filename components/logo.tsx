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
      <div className="absolute inset-0 blur-3xl opacity-60 bg-gradient-to-r from-cyan-400 to-purple-500" />

      {/* Main text */}
      <h1 className="relative text-7xl md:text-9xl font-bold text-center">
        <span
          className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
          style={{
            fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
            fontStyle: "italic",
            fontWeight: 700,
            letterSpacing: "0.02em",
            textShadow: "0 0 40px rgba(0, 221, 255, 0.8), 0 0 80px rgba(170, 102, 255, 0.6)",
          }}
        >
          all the vibes
        </span>
      </h1>
    </div>
  )
}
