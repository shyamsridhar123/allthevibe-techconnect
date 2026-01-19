"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface LogoProps {
  showCTA?: boolean
  ctaLink?: string
}

export default function Logo({ showCTA = false, ctaLink = "#" }: LogoProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay the logo appearance for dramatic effect
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 4700)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      animate={isVisible ? {
        y: [0, -5, 0],
      } : {}}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Subtle glow effect behind text */}
      <motion.div 
        className="absolute inset-0 blur-3xl bg-white/10"
        animate={isVisible ? {
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.05, 1]
        } : { opacity: 0 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main logo container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Main text - "one shot." */}
        <h1 className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center whitespace-nowrap">
          <span
            className="relative inline-block text-white"
            style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: "0.02em",
              textShadow: "0 0 40px rgba(255, 255, 255, 0.3)",
            }}
          >
            one shot.
          </span>
        </h1>
        
        {/* Tagline - And Your Vibes Become Magic */}
        <p className="text-xs sm:text-sm text-white/50 tracking-[0.15em] mt-3 sm:mt-4 font-light">
          And Your Vibes Become Magic
        </p>
        
        {/* Divider dot */}
        <div className="w-1 h-1 rounded-full bg-white/30 mt-5 sm:mt-6" />
        
        {/* ALL THE VIBES */}
        <h2 className="relative text-sm sm:text-base md:text-lg text-center mt-5 sm:mt-6 tracking-[0.3em] sm:tracking-[0.4em] uppercase">
          <span className="text-white font-medium">
            ALL THE VIBES
          </span>
        </h2>
        
        {/* Since line */}
        <p className="text-xs text-white/50 tracking-[0.2em] mt-1.5 uppercase font-light">
          SINCE 2025
        </p>
      </div>

      {/* Optional CTA below logo */}
      {showCTA && isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex justify-center"
        >
          <motion.a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 border border-white/40 hover:border-white/80 bg-white/5 hover:bg-white/15 backdrop-blur-sm"
            style={{
              color: '#ffffff',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Pulse glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255,255,255,0.1)',
                  '0 0 40px rgba(255,255,255,0.2)',
                  '0 0 20px rgba(255,255,255,0.1)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Start Your Journey
              <motion.svg 
                className="w-4 h-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </motion.svg>
            </span>
          </motion.a>
        </motion.div>
      )}
    </motion.div>
  )
}
