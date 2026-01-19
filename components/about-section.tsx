"use client"

import { useRef, useState, useCallback } from "react"
import { motion, useInView, Variants, AnimatePresence } from "framer-motion"
import CTAButton from "./cta-button"

interface AboutSectionProps {
  ctaLink: string
}

export default function AboutSection({ ctaLink }: AboutSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  // Easter egg: Click → Long Press → Double Click pattern
  const [showArchitect, setShowArchitect] = useState(false)
  const [easterEggStep, setEasterEggStep] = useState(0) // 0: waiting for click, 1: waiting for long press, 2: waiting for double click
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pressStartTimeRef = useRef<number>(0)
  const lastClickTimeRef = useRef<number>(0)

  const resetEasterEgg = useCallback(() => {
    setEasterEggStep(0)
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current)
  }, [])

  const handlePointerDown = useCallback(() => {
    pressStartTimeRef.current = Date.now()
    
    if (easterEggStep === 1) {
      // Waiting for long press - start timer
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current)
      longPressTimerRef.current = setTimeout(() => {
        // Long press successful, move to step 2
        setEasterEggStep(2)
        // Vibrate feedback
        if (navigator.vibrate) navigator.vibrate(50)
        // Reset if double click doesn't happen in 3 seconds
        stepTimeoutRef.current = setTimeout(resetEasterEgg, 3000)
      }, 600) // 600ms for long press
    }
  }, [easterEggStep, resetEasterEgg])

  const handlePointerUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }
  }, [])

  const handleSectionClick = useCallback((e: React.MouseEvent) => {
    // Ignore clicks on interactive elements like buttons/links
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) {
      return
    }
    
    const pressDuration = Date.now() - pressStartTimeRef.current
    const timeSinceLastClick = Date.now() - lastClickTimeRef.current
    lastClickTimeRef.current = Date.now()
    
    if (easterEggStep === 0 && pressDuration < 500) {
      // First quick click detected
      setEasterEggStep(1)
      if (navigator.vibrate) navigator.vibrate(30)
      // Reset if long press doesn't complete in 3 seconds
      stepTimeoutRef.current = setTimeout(resetEasterEgg, 3000)
    } else if (easterEggStep === 2 && pressDuration < 400 && timeSinceLastClick < 400) {
      // Double click detected! Trigger the easter egg
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current)
      setShowArchitect(true)
      setEasterEggStep(0)
      // Vibrate pattern
      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
      // Hide after 2 seconds
      setTimeout(() => {
        setShowArchitect(false)
        resetEasterEgg()
      }, 2000)
    }
  }, [easterEggStep, resetEasterEgg])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  }

  return (
    <section 
      ref={ref}
      id="about" 
      className="relative min-h-screen flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 select-none"
      onClick={handleSectionClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* "Find the Architect" Easter Egg Overlay */}
      <AnimatePresence>
        {showArchitect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050010]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                exit: { duration: 1.5 }
              }}
              className="text-center px-8"
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest font-mono uppercase"
                style={{
                  color: '#00ff00',
                  textShadow: '0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.5), 0 0 80px rgba(0, 255, 0, 0.3)',
                }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  textShadow: [
                    '0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.5), 0 0 80px rgba(0, 255, 0, 0.3)',
                    '0 0 30px rgba(0, 255, 0, 1), 0 0 60px rgba(0, 255, 0, 0.7), 0 0 100px rgba(0, 255, 0, 0.4)',
                    '0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.5), 0 0 80px rgba(0, 255, 0, 0.3)',
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                FIND THE AI ARCHITECT
              </motion.h2>
              
              {/* Matrix-style falling characters */}
              <motion.div 
                className="absolute inset-0 pointer-events-none overflow-hidden font-mono text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-green-500/40"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-5%`,
                    }}
                    animate={{
                      y: ['0vh', '110vh'],
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 4,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "linear"
                    }}
                  >
                    {String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 60%)',
          filter: 'blur(60px)'
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative max-w-4xl mx-auto text-center"
      >
        {/* Decorative line */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
          <span className="text-white/60 text-xs uppercase tracking-widest">About</span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
        </motion.div>

        {/* Main heading */}
        <motion.h2 
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 text-white"
          style={{
            fontFamily: "'Times New Roman', 'Georgia', serif",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          All The Vibes
        </motion.h2>

        {/* Tagline */}
        <motion.p 
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-white/70 mb-8 font-light leading-relaxed"
        >
          Where engineers come together to master AI-assisted development
          <br />
          <span className="text-white/50 text-base sm:text-lg">— and become 10x more effective</span>
        </motion.p>

        {/* Description */}
        <motion.div 
          variants={itemVariants}
          className="max-w-3xl mx-auto mb-12"
        >
          <p className="text-base sm:text-lg text-white/50 leading-relaxed mb-6">
            All The Vibes is an internal Industry Solutions Delivery (ISD) community dedicated 
            to empowering every team member to leverage AI-assisted development (&quot;vibe coding&quot;) 
            and become a better software engineer.
          </p>
          <p className="text-base sm:text-lg text-white/50 leading-relaxed mb-6">
            Our mission is to create an inclusive, learning-oriented community where anyone can code 
            and everyone can continuously upskill, ultimately influencing how ISD (and eventually Microsoft) 
            builds software.
          </p>
          <p className="text-base sm:text-lg text-white/50 leading-relaxed">
            In practice, this means fostering a culture of collaboration and innovation around AI coding tools, 
            sharing best practices, and raising the bar for engineering excellence.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants}>
          <CTAButton href={ctaLink} size="lg">
            Join Us
          </CTAButton>
        </motion.div>

        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-20 h-20 border-l border-t border-white/10" />
        <div className="absolute top-0 right-0 w-20 h-20 border-r border-t border-white/10" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-l border-b border-white/10" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-r border-b border-white/10" />
      </motion.div>
    </section>
  )
}
