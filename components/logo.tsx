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
      <div className="absolute inset-0 blur-3xl opacity-40 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

      {/* Main logo container with decorative lines */}
      <div className="relative flex items-center justify-center">
        {/* Left decorative line */}
        <div className="hidden md:flex items-center mr-4">
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-cyan-400 opacity-80" />
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00ffff] ml-1" />
        </div>

        {/* Main text */}
        <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-bold text-center whitespace-nowrap">
          <span
            className="relative inline-block"
            style={{
              fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
              fontStyle: "italic",
              letterSpacing: "0.02em",
              background: "linear-gradient(90deg, #00ffff 0%, #00d4ff 30%, #a855f7 70%, #c084fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(0, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.4))",
            }}
          >
            all the vibes
          </span>
        </h1>

        {/* Right decorative line */}
        <div className="hidden md:flex items-center ml-4">
          <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7] mr-1" />
          <div className="w-24 h-[2px] bg-gradient-to-r from-purple-400 via-purple-400 to-transparent opacity-80" />
        </div>
      </div>

      {/* Subtle underline glow */}
      <div className="mt-2 mx-auto w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
    </div>
  )
}
