"use client"

import { useEffect, useState } from "react"

interface CutsceneProps {
  onComplete: () => void
}

export default function Cutscene({ onComplete }: CutsceneProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Scanning lines effect */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="h-px bg-cyan-400 mb-8"
            style={{
              animation: `scan 2s linear infinite`,
              animationDelay: `${i * 0.04}s`,
            }}
          />
        ))}
      </div>

      {/* Terminal-style text */}
      <div className="relative z-10 font-mono text-cyan-400 text-xl md:text-2xl space-y-4 px-8">
        <div className={`transition-opacity duration-500 ${phase >= 1 ? "opacity-100" : "opacity-0"}`}>
          {">"} INITIALIZING NEURAL NETWORK...
        </div>
        <div className={`transition-opacity duration-500 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}>
          {">"} LOADING CONSCIOUSNESS MATRIX...
        </div>
        <div className={`transition-opacity duration-500 ${phase >= 3 ? "opacity-100" : "opacity-0"}`}>
          {">"} SYNCHRONIZING VIBES...
        </div>
        <div className={`transition-opacity duration-500 ${phase >= 4 ? "opacity-100" : "opacity-0"}`}>
          <span className="text-green-400">{">"} SYSTEM READY</span>
          <span className="animate-pulse ml-2">█</span>
        </div>
      </div>

      {/* Fade out */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-1000 ${
          phase >= 4 ? "opacity-0" : "opacity-0"
        }`}
      />

      <style jsx>{`
        @keyframes scan {
          from {
            transform: translateY(-100vh);
          }
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  )
}
