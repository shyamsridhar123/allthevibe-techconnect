"use client"

import { useRef, useState, useCallback } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import CTAButton from "./cta-button"

// CSS-animated walking cat component
function WalkingCat() {
  return (
    <div className="relative w-24 h-16 animate-cat-walk">
      {/* Cat body */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-8 bg-white rounded-full" />
      
      {/* Cat head */}
      <div className="absolute bottom-6 right-2 w-8 h-7 bg-white rounded-full">
        {/* Ears */}
        <div className="absolute -top-2 left-1 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-white" />
        <div className="absolute -top-2 right-1 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-white" />
        {/* Eyes */}
        <div className="absolute top-2 left-1.5 w-1.5 h-2 bg-black rounded-full animate-blink" />
        <div className="absolute top-2 right-1.5 w-1.5 h-2 bg-black rounded-full animate-blink" />
        {/* Nose */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-300 rounded-full" />
      </div>
      
      {/* Tail */}
      <div className="absolute bottom-5 left-1 w-6 h-1.5 bg-white rounded-full origin-right animate-tail-wag" style={{ transform: 'rotate(-30deg)' }} />
      
      {/* Front legs */}
      <div className="absolute bottom-0 right-6 w-1.5 h-4 bg-white rounded-full origin-top animate-front-leg" />
      <div className="absolute bottom-0 right-4 w-1.5 h-4 bg-white rounded-full origin-top animate-front-leg-alt" />
      
      {/* Back legs */}
      <div className="absolute bottom-0 left-4 w-1.5 h-4 bg-white rounded-full origin-top animate-back-leg" />
      <div className="absolute bottom-0 left-6 w-1.5 h-4 bg-white rounded-full origin-top animate-back-leg-alt" />
      
      <style jsx>{`
        @keyframes cat-walk {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes tail-wag {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(-10deg); }
        }
        @keyframes front-leg {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes front-leg-alt {
          0%, 100% { transform: rotate(15deg); }
          50% { transform: rotate(-15deg); }
        }
        @keyframes back-leg {
          0%, 100% { transform: rotate(10deg); }
          50% { transform: rotate(-10deg); }
        }
        @keyframes back-leg-alt {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .animate-cat-walk { animation: cat-walk 0.3s ease-in-out infinite; }
        .animate-tail-wag { animation: tail-wag 0.5s ease-in-out infinite; }
        .animate-front-leg { animation: front-leg 0.3s ease-in-out infinite; }
        .animate-front-leg-alt { animation: front-leg-alt 0.3s ease-in-out infinite; }
        .animate-back-leg { animation: back-leg 0.3s ease-in-out infinite; }
        .animate-back-leg-alt { animation: back-leg-alt 0.3s ease-in-out infinite; }
        .animate-blink { animation: blink 3s ease-in-out infinite; }
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
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="flex justify-center items-center"
                >
                  <WalkingCat />
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
