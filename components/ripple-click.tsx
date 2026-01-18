"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Ripple {
  id: number
  x: number
  y: number
}

export default function RippleClick() {
  const [ripples, setRipples] = useState<Ripple[]>([])

  useEffect(() => {
    let id = 0

    const handleClick = (e: MouseEvent) => {
      id++
      const newRipple = { id, x: e.clientX, y: e.clientY }
      setRipples(prev => [...prev, newRipple])

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 1000)
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute"
            style={{
              left: ripple.x - 30,
              top: ripple.y - 30,
              width: 60,
              height: 60,
            }}
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-white/60" />
            {/* Inner glow */}
            <div 
              className="absolute inset-2 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
