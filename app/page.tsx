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
    <div className="relative w-full h-screen overflow-hidden bg-[#050010]">
      {showCutscene && <Cutscene onComplete={() => setShowCutscene(false)} />}

      <MatrixRain />

      {/* Ambient glow effects */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative flex flex-col items-center gap-4">
          <Brain3D />
          <Logo />
        </div>
      </div>

      {/* Sparkle decoration */}
      <div className="absolute bottom-12 right-12 z-10 animate-pulse">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 0L21.5 18.5L40 20L21.5 21.5L20 40L18.5 21.5L0 20L18.5 18.5L20 0Z"
            fill="url(#sparkle-gradient)"
          />
          <defs>
            <linearGradient id="sparkle-gradient" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#00FFFF" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
