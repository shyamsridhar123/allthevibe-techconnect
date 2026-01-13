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
    }, 4000)

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
    </div>
  )
}
