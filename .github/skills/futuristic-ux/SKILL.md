````skill
---
name: futuristic-ux
description: Futuristic user experience patterns including 3D interfaces, neural network visualizations, holographic UI, sci-fi dashboards, and immersive interactions. Apply when building AI-focused landing pages, tech conference websites, or creating next-generation user interfaces.
license: MIT
metadata:
  author: all-the-vibes
  version: "1.0.0"
---

# Futuristic UX Skill

Comprehensive guide for creating futuristic, immersive user experiences for AI/tech-focused applications. Optimized for landing pages, conference websites, and cutting-edge product showcases.

## When to Apply

Reference these guidelines when:
- Building AI/ML focused landing pages
- Creating tech conference or product launch websites
- Implementing 3D UI elements and interactions
- Designing holographic or sci-fi styled interfaces
- Building neural network or data visualizations
- Creating immersive hero sections

## Core Pattern Categories

| Category | Impact | Primary Use |
|----------|--------|-------------|
| 3D Interfaces | CRITICAL | Hero sections, product showcases |
| Neural Visualizations | HIGH | AI/ML themed content |
| Holographic UI | MEDIUM | Cards, modals, navigation |
| Immersive Scroll | HIGH | Storytelling, reveals |
| Data Streams | MEDIUM | Background atmosphere |

## Quick Reference

### 1. 3D Hero Sections

#### R3F Neural Globe Pattern

```tsx
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Line } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

export function NeuralHero() {
  return (
    <div className="h-screen relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} color="#00ffff" />
        
        <NeuralGlobe />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.2} />
        </EffectComposer>
      </Canvas>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          The Future Is Now
        </h1>
      </div>
    </div>
  )
}
```

### 2. Holographic Cards

```tsx
interface HoloCardProps {
  children: React.ReactNode
  className?: string
}

export function HoloCard({ children, className = "" }: HoloCardProps) {
  return (
    <div className={`
      relative p-6 rounded-2xl
      bg-gradient-to-br from-cyan-500/10 to-purple-500/10
      backdrop-blur-xl
      border border-cyan-500/20
      before:absolute before:inset-0 before:rounded-2xl
      before:bg-gradient-to-r before:from-cyan-400/0 before:via-cyan-400/10 before:to-purple-400/0
      before:animate-shimmer
      overflow-hidden
      ${className}
    `}>
      {/* Scan line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-400/50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-purple-400/50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-purple-400/50" />
      
      {children}
    </div>
  )
}
```

### 3. Immersive Scroll Reveal

```tsx
"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ScrollRevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8])
  
  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="min-h-screen flex items-center justify-center"
    >
      {children}
    </motion.div>
  )
}
```

### 4. AI Loading States

```tsx
export function AILoadingState({ text = "Processing" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Neural pulse animation */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-cyan-500/40 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-cyan-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L12 22M2 12L22 12M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>
      
      {/* Animated text */}
      <div className="flex items-center gap-1 text-cyan-400 font-mono">
        <span>{text}</span>
        <span className="animate-pulse">.</span>
        <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
        <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
      </div>
    </div>
  )
}
```

### 5. Futuristic Navigation

```tsx
export function FuturisticNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <span className="text-black font-bold">V</span>
          </div>
          <span className="font-bold text-white">ALL THE VIBES</span>
        </div>
        
        {/* Nav items with hover effect */}
        <div className="flex items-center gap-8">
          {['About', 'Speakers', 'Schedule', 'Register'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-white/70 hover:text-white transition-colors group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
        
        {/* CTA */}
        <button className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-shadow">
          Get Tickets
        </button>
      </div>
    </nav>
  )
}
```

## Design Principles

1. **Depth & Layers** - Use z-index, blur, and transparency to create depth
2. **Glow & Bloom** - Add bloom effects to make elements feel luminous
3. **Motion** - Subtle constant motion creates life (auto-rotate, pulse, float)
4. **Color Gradients** - Cyan to purple is the core futuristic palette
5. **Glass Morphism** - Frosted glass effects for UI containers
6. **Data Visualization** - Show abstract data flows as decoration

## Performance Guidelines

1. **3D Elements**: Always use dynamic imports with `ssr: false`
2. **Heavy Effects**: Use `content-visibility: auto` for off-screen sections
3. **Animations**: Prefer CSS transforms over layout-triggering properties
4. **Images**: Use Next.js Image with blur placeholders
5. **Fonts**: Preload display fonts, use system fonts for body

## Anti-Patterns

- ❌ Overloading the page with competing animations
- ❌ Using heavy 3D scenes on mobile without fallbacks
- ❌ Ignoring accessibility (contrast, motion reduction)
- ❌ Not providing loading states for async content
- ❌ Making text unreadable with excessive effects

## Full Implementation Guide

See `AGENTS.md` for complete implementation examples including:
- Full landing page structure
- Speaker cards with 3D hover
- Countdown timers
- Ticket pricing sections
- Footer with data streams
````
