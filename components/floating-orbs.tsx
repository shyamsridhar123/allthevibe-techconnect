"use client"

import { motion } from "framer-motion"

interface OrbProps {
  size: number
  x: string
  y: string
  duration: number
  delay: number
  opacity: number
}

function Orb({ size, x, y, duration, delay, opacity }: OrbProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, rgba(255, 255, 255, ${opacity}), transparent 70%)`,
        filter: 'blur(40px)',
      }}
      animate={{
        x: [0, 30, -20, 20, 0],
        y: [0, -30, 20, 40, 0],
        scale: [1, 1.1, 0.9, 1.05, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

const orbs: OrbProps[] = [
  { size: 300, x: "10%", y: "20%", duration: 25, delay: 0, opacity: 0.03 },
  { size: 250, x: "70%", y: "15%", duration: 30, delay: -5, opacity: 0.04 },
  { size: 200, x: "80%", y: "60%", duration: 22, delay: -10, opacity: 0.03 },
  { size: 350, x: "20%", y: "70%", duration: 28, delay: -15, opacity: 0.04 },
  { size: 180, x: "50%", y: "40%", duration: 20, delay: -8, opacity: 0.03 },
  { size: 220, x: "30%", y: "85%", duration: 26, delay: -12, opacity: 0.04 },
]

export default function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {orbs.map((orb, i) => (
        <Orb key={i} {...orb} />
      ))}
    </div>
  )
}
