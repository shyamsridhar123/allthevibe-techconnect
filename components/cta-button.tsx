"use client"

import { motion } from "framer-motion"

interface CTAButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function CTAButton({ 
  href, 
  children, 
  className = "",
  size = "md"
}: CTAButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        relative inline-flex items-center justify-center gap-2
        rounded-full font-medium text-white
        border border-white/30 hover:border-white/60
        hover:bg-white/10
        transition-all duration-300
        ${sizeClasses[size]}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Subtle glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(20px)',
        }}
        whileHover={{ opacity: 0.4 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <svg 
          className="w-4 h-4" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </motion.a>
  )
}
