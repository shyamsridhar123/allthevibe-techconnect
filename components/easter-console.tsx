"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const consoleMessages = [
  { text: "> Initializing All The Vibes...", delay: 0 },
  { text: "> Neural network: ACTIVE", delay: 300 },
  { text: "> Vibe check: PASSED ✓", delay: 600 },
  { text: "> AI systems: ONLINE", delay: 900 },
  { text: "> Welcome to 2026.", delay: 1200 },
]

export default function EasterConsole() {
  const [showConsole, setShowConsole] = useState(false)
  const [visibleLines, setVisibleLines] = useState(0)
  const lastTapRef = useRef(0)
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-dismiss after 4 seconds when console is shown
  useEffect(() => {
    if (showConsole) {
      // Clear any existing timeout
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current)
      }
      
      // Set new timeout to dismiss
      dismissTimeoutRef.current = setTimeout(() => {
        setShowConsole(false)
      }, 4000)
    }
    
    return () => {
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current)
      }
    }
  }, [showConsole])

  const handleDoubleTap = useCallback((e: MouseEvent | TouchEvent) => {
    // Ignore if clicking on interactive elements
    const target = e.target as HTMLElement
    if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.closest('[role="button"]') ||
      target.closest('input') ||
      target.closest('textarea')
    ) {
      return
    }

    // Only trigger on hero section (first screen / above the fold)
    const clickY = 'touches' in e 
      ? (e as TouchEvent).changedTouches?.[0]?.clientY ?? 0
      : (e as MouseEvent).clientY
    
    // Only work if user is in the top portion of the viewport (hero area)
    if (window.scrollY > window.innerHeight * 0.5 || clickY > window.innerHeight) {
      return
    }

    const now = Date.now()
    const timeSinceLastTap = now - lastTapRef.current

    if (timeSinceLastTap < 300 && timeSinceLastTap > 50) {
      // Double tap detected!
      e.preventDefault()
      
      setShowConsole(prev => {
        if (!prev) {
          // Vibrate on mobile
          if (navigator.vibrate) {
            navigator.vibrate(50)
          }
          
          // Reset and type out lines one by one
          setVisibleLines(0)
          consoleMessages.forEach((_, index) => {
            setTimeout(() => {
              setVisibleLines(index + 1)
            }, consoleMessages[index].delay)
          })
          
          return true
        }
        return prev
      })
    }
    
    lastTapRef.current = now
  }, [])

  useEffect(() => {
    // Use touchend for mobile, click for desktop
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length === 1 || e.touches.length === 0) {
        handleDoubleTap(e)
      }
    }

    window.addEventListener('touchend', handleTouch, { passive: false })
    window.addEventListener('click', handleDoubleTap)

    return () => {
      window.removeEventListener('touchend', handleTouch)
      window.removeEventListener('click', handleDoubleTap)
    }
  }, [handleDoubleTap])

  return (
    <AnimatePresence>
      {showConsole && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
        >
          <div 
            className="relative px-6 py-4 rounded-lg min-w-[300px] max-w-[90vw]"
            style={{
              background: 'rgba(5, 0, 16, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="ml-2 text-[10px] text-white/40 font-mono uppercase tracking-wider">
                system.log
              </span>
            </div>

            {/* Console lines */}
            <div className="font-mono text-xs sm:text-sm space-y-1">
              {consoleMessages.slice(0, visibleLines).map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/80"
                  style={{
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {msg.text}
                </motion.div>
              ))}
              
              {/* Blinking cursor */}
              {visibleLines > 0 && visibleLines < consoleMessages.length && (
                <motion.span
                  className="inline-block w-2 h-4 bg-white/70 ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </div>

            {/* Scanline effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.02) 2px, rgba(255, 255, 255, 0.02) 4px)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
