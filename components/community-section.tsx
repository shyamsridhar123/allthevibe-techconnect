"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import CTAButton from "./cta-button"

interface CommunitySectionProps {
  ctaLink: string
}

export default function CommunitySection({ ctaLink }: CommunitySectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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

          {/* Emoji decoration */}
          <motion.div 
            className="text-5xl sm:text-6xl mb-6"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🚀
          </motion.div>

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
