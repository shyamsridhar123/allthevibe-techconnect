"use client"

import { motion } from "framer-motion"

interface ScrollIndicatorProps {
  onClick?: () => void
}

export default function ScrollIndicator({ onClick }: ScrollIndicatorProps) {
  return (
    <motion.button
      onClick={onClick}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 5.2, duration: 0.8 }}
      aria-label="Scroll down for more content"
    >
      {/* Simple animated chevron */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="24" height="14" viewBox="0 0 24 14" 
          className="text-white/40 group-hover:text-white/70 transition-colors duration-300"
        >
          <path 
            d="M2 2l10 10 10-10" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.button>
  )
}
