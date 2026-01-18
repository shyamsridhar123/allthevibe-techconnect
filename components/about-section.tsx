"use client"

import { useRef } from "react"
import { motion, useInView, Variants } from "framer-motion"
import CTAButton from "./cta-button"

interface AboutSectionProps {
  ctaLink: string
}

export default function AboutSection({ ctaLink }: AboutSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
      className="relative min-h-screen flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8"
    >
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
          className="text-lg sm:text-xl md:text-2xl text-white/60 mb-8 font-light"
        >
          Empowering every team member to become a better software engineer
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
