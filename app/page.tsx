"use client"

import { useEffect, useState } from "react"
import MatrixRain from "@/components/matrix-rain"
import Brain3D from "@/components/brain-3d"
import Logo from "@/components/logo"
import Cutscene from "@/components/cutscene"

export default function LandingPage() {
  const [showCutscene, setShowCutscene] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCutscene(false)
    }, 4000) // 4 second cutscene

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {showCutscene && <Cutscene onComplete={() => setShowCutscene(false)} />}

      <MatrixRain />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative flex flex-col items-center gap-8">
          <Brain3D />
          <Logo />
        </div>
      </div>

      {/* Sparkle decoration */}
      <div className="absolute bottom-12 right-12 z-10 animate-pulse">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 0L21.5 18.5L40 20L21.5 21.5L20 40L18.5 21.5L0 20L18.5 18.5L20 0Z"
            fill="url(#sparkle-gradient)"
          />
          <defs>
            <linearGradient id="sparkle-gradient" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#00FFFF" />
              <stop offset="100%" stopColor="#FF00FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
