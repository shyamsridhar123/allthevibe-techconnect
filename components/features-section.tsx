"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}

const features: Feature[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "AI-Powered Creation",
    description: "Leverage cutting-edge AI tools to bring your ideas to life faster than ever before.",
    gradient: "from-cyan-400 to-cyan-600"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "Vibrant Community",
    description: "Connect with like-minded builders and innovators who share your passion for the future.",
    gradient: "from-purple-400 to-purple-600"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Lightning Fast",
    description: "Ship ideas at the speed of thought with optimized workflows and instant feedback.",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    title: "Modular Building",
    description: "Mix and match components to create unique experiences that stand out.",
    gradient: "from-green-400 to-emerald-600"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Safe & Secure",
    description: "Build with confidence knowing your projects and data are protected.",
    gradient: "from-blue-400 to-indigo-600"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Global Reach",
    description: "Connect with creators from around the world and build without boundaries.",
    gradient: "from-pink-400 to-rose-600"
  }
]

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Card */}
      <div 
        className="relative p-6 sm:p-8 rounded-2xl transition-all duration-300 h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(0,255,255,0.05) 0%, rgba(168,85,247,0.05) 100%)',
          border: '1px solid rgba(0,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(168,85,247,0.1) 100%)`,
            opacity: 0
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400/30 rounded-tl-lg transition-colors group-hover:border-cyan-400/60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-400/30 rounded-tr-lg transition-colors group-hover:border-cyan-400/60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-purple-400/30 rounded-bl-lg transition-colors group-hover:border-purple-400/60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-purple-400/30 rounded-br-lg transition-colors group-hover:border-purple-400/60" />

        {/* Icon */}
        <div 
          className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${feature.gradient} text-white`}
          style={{
            boxShadow: isHovered ? `0 0 30px rgba(0,255,255,0.3)` : 'none',
            transition: 'box-shadow 0.3s'
          }}
        >
          {feature.icon}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-white/50 leading-relaxed">
          {feature.description}
        </p>

        {/* Animated border on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: '1px solid transparent',
            background: 'linear-gradient(90deg, rgba(0,255,255,0.5), rgba(168,85,247,0.5)) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            opacity: 0
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      ref={ref}
      id="features" 
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      {/* Section glow */}
      <div 
        className="absolute top-1/2 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.06) 0%, transparent 60%)',
          filter: 'blur(80px)',
          transform: 'translate(-50%, -50%)'
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 60%)',
          filter: 'blur(80px)',
          transform: 'translate(50%, 50%)'
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-purple-400" />
            <span className="text-purple-400 text-xs font-mono uppercase tracking-widest">Features</span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-purple-400" />
          </div>

          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: 'linear-gradient(90deg, #00ffff 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Built for the Future
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Everything you need to build, create, and innovate with AI by your side.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
