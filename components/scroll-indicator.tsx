"use client"

import { motion } from "framer-motion"

interface ScrollIndicatorProps {
  onClick?: () => void
}

export default function ScrollIndicator({ onClick }: ScrollIndicatorProps) {
  return (
    <motion.button
      onClick={onClick}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer group"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 5.5, duration: 0.8 }}
      aria-label="Scroll down for more content"
    >
      {/* Text */}
      <span className="text-xs font-mono text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">
        Explore
      </span>
      
      {/* Animated arrow container */}
      <motion.div
        className="relative w-6 h-10 rounded-full border border-white/30 group-hover:border-white/60 transition-colors"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Inner dot */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
          animate={{ 
            top: ["20%", "60%", "20%"],
            opacity: [1, 0.5, 1]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      
      {/* Glow effect */}
      <div 
        className="absolute bottom-0 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          filter: 'blur(10px)'
        }}
      />
    </motion.button>
  )
}
