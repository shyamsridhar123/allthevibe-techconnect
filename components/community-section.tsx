"use client"

import { useRef, useState, useCallback } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import CTAButton from "./cta-button"

// CSS-animated black cat with glowing eyes in spotlight
function SpotlightCat() {
  return (
    <div className="relative w-32 h-24 flex items-center justify-center">
      {/* Spotlight beam from above */}
      <div 
        className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-32"
        style={{
          background: 'conic-gradient(from 180deg at 50% 0%, transparent 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 70%)',
          clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
        }}
      />
      
      {/* Spotlight glow on floor */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />
      
      {/* The cat */}
      <div className="relative w-20 h-14 animate-cat-breathe z-10">
        {/* Cat body - black silhouette */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-7 bg-black rounded-full shadow-lg" />
        
        {/* Cat head */}
        <div className="absolute bottom-5 right-1 w-8 h-7 bg-black rounded-full">
          {/* Ears - pointy triangles */}
          <div className="absolute -top-2 left-0.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-black" />
          <div className="absolute -top-2 right-0.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-black" />
          {/* Inner ears */}
          <div className="absolute -top-1 left-1.5 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-gray-800" />
          <div className="absolute -top-1 right-1.5 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-gray-800" />
          
          {/* Glowing eyes */}
          <div className="absolute top-2.5 left-1.5 w-1.5 h-1.5 rounded-full animate-glow-pulse" 
               style={{ 
                 background: 'radial-gradient(circle, #ffff00 30%, #ffaa00 70%)',
                 boxShadow: '0 0 6px 2px rgba(255, 255, 0, 0.6), 0 0 12px 4px rgba(255, 200, 0, 0.3)',
               }} />
          <div className="absolute top-2.5 right-1.5 w-1.5 h-1.5 rounded-full animate-glow-pulse" 
               style={{ 
                 background: 'radial-gradient(circle, #ffff00 30%, #ffaa00 70%)',
                 boxShadow: '0 0 6px 2px rgba(255, 255, 0, 0.6), 0 0 12px 4px rgba(255, 200, 0, 0.3)',
               }} />
          {/* Eye pupils - vertical slits */}
          <div className="absolute top-2.5 left-2 w-0.5 h-1 bg-black rounded-full" />
          <div className="absolute top-2.5 right-2 w-0.5 h-1 bg-black rounded-full" />
          
          {/* Nose */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-gray-700 rounded-full" />
        </div>
        
        {/* Tail - curved up */}
        <div className="absolute bottom-3 left-0 w-5 h-1.5 bg-black rounded-full origin-right animate-tail-slow" 
             style={{ transform: 'rotate(-20deg)' }} />
        <div className="absolute bottom-4 -left-1 w-3 h-1.5 bg-black rounded-full" 
             style={{ transform: 'rotate(-60deg)' }} />
        
        {/* Front paws */}
        <div className="absolute bottom-0 right-4 w-2 h-2 bg-black rounded-full" />
        <div className="absolute bottom-0 right-7 w-2 h-2 bg-black rounded-full" />
        
        {/* Back paws */}
        <div className="absolute bottom-0 left-4 w-2.5 h-2 bg-black rounded-full" />
      </div>
      
      <style jsx>{`
        @keyframes cat-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-1px) scale(1.01); }
        }
        @keyframes tail-slow {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(-35deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.9; filter: brightness(1.3); }
        }
        .animate-cat-breathe { animation: cat-breathe 2s ease-in-out infinite; }
        .animate-tail-slow { animation: tail-slow 3s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

interface CommunitySectionProps {
  ctaLink: string
}

export default function CommunitySection({ ctaLink }: CommunitySectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  // Easter egg: Triple-tap rocket to reveal cat walk animation
  const [showCat, setShowCat] = useState(false)
  const tapCountRef = useRef(0)
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleRocketTap = useCallback(() => {
    tapCountRef.current += 1
    
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current)
    }
    
    tapTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0
    }, 400) // Reset tap count after 400ms
    
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0
      
      setShowCat(true)
      
      // Vibrate on mobile if supported
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50])
      }
      
      // Hide after 3 seconds
      setTimeout(() => setShowCat(false), 3000)
    }
  }, [])

  return (
    <section 
      ref={ref}
      id="community" 
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Animated background stripes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] w-full"
            style={{
              top: `${20 + i * 15}%`,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${0.03 + i * 0.01}) 50%, transparent 100%)`,
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Center glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 50%)',
          filter: 'blur(60px)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-4xl mx-auto text-center"
      >
        {/* Card container */}
        <div 
          className="relative p-8 sm:p-12 lg:p-16 rounded-3xl"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/20 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/20 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/20 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/20 rounded-br-xl" />

          {/* Scan line effect */}
          <motion.div
            className="absolute inset-x-0 h-[2px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
            }}
            animate={{
              top: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Emoji decoration - Triple tap for easter egg! */}
          <motion.div 
            className="text-5xl sm:text-6xl mb-6 cursor-pointer select-none relative overflow-visible"
            animate={showCat ? {} : { 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            onClick={handleRocketTap}
            whileTap={{ scale: 0.9 }}
            style={{ minHeight: '80px' }}
          >
            <AnimatePresence mode="wait">
              {showCat ? (
                <motion.div
                  key="cat"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="flex justify-center items-center"
                >
                  <SpotlightCat />
                </motion.div>
              ) : (
                <motion.span
                  key="rocket"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  🚀
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Secret found toast */}
          <AnimatePresence>
            {showCat && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs text-white/90 bg-white/10 border border-white/20 backdrop-blur-sm whitespace-nowrap z-10"
                style={{
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                }}
              >
                🐱 You found the glitch in the matrix!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heading */}
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 text-white"
            style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            Ready to Join the Vibe?
          </h2>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-white/60 mb-6 max-w-2xl mx-auto">
            Join 500+ engineers learning to build faster with AI.
            <br className="hidden sm:block" />
            Share prompts, ship projects, and level up together.
          </p>

          {/* Benefits chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Daily Tips', 'Project Showcases', 'Live Sessions', 'And a Lot of Fun'].map((benefit) => (
              <span 
                key={benefit}
                className="px-3 py-1 text-xs text-white/70 bg-white/5 border border-white/10 rounded-full"
              >
                {benefit}
              </span>
            ))}
          </div>

          {/* CTA */}
          <CTAButton href={ctaLink} size="lg">
            Start Your Journey
          </CTAButton>
        </div>
      </motion.div>
    </section>
  )
}
