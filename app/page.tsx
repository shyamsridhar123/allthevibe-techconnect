"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Logo from "@/components/logo"
import Cutscene from "@/components/cutscene"

// Dynamic import for 3D scene to avoid SSR issues
const Scene3D = dynamic(() => import("@/components/scene-3d"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#050010]" />
  )
})

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [showCutscene, setShowCutscene] = useState(true)
  const [cutsceneComplete, setCutsceneComplete] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setShowCutscene(false)
      setCutsceneComplete(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return <div className="w-full h-screen bg-[#050010]" />
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050010]">
      {/* Cutscene overlay */}
      {showCutscene && <Cutscene onComplete={() => {
        setShowCutscene(false)
        setCutsceneComplete(true)
      }} />}

      {/* Full-screen 3D scene with particles and neural globe */}
      <div className="absolute inset-0 z-0">
        <Scene3D 
          showParticles={true} 
          showGlobe={true}
          bloomIntensity={cutsceneComplete ? 1.5 : 2.5}
        />
      </div>

      {/* Logo overlay - positioned below the globe */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative flex flex-col items-center mt-[280px] md:mt-[350px]">
          <div className="pointer-events-auto">
            <Logo />
          </div>
        </div>
      </div>

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(5, 0, 16, 0.7) 100%)'
        }}
      />

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

      {/* Subtle scanline effect */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
        }}
      />
    </div>
  )
}
