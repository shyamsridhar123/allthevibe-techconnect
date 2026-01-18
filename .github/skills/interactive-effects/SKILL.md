````skill
---
name: interactive-effects
description: Interactive visual effects including particle systems, cursor effects, scroll-triggered animations, hover interactions, and mouse-following elements. Apply when adding interactivity to landing pages, creating engaging hover states, or implementing scroll-based animations.
license: MIT
metadata:
  author: all-the-vibes
  version: "1.0.0"
---

# Interactive Effects Skill

Comprehensive guide for implementing interactive visual effects in React/Next.js applications. Covers particle systems, cursor effects, scroll animations, and mouse interactions.

## When to Apply

Reference these guidelines when:
- Adding particle backgrounds or decorative elements
- Creating custom cursor effects
- Implementing scroll-triggered animations
- Building hover interactions
- Adding mouse-following elements
- Creating interactive backgrounds

## Core Pattern Categories

| Category | Impact | Primary Use |
|----------|--------|-------------|
| Particle Systems | HIGH | Background atmosphere |
| Cursor Effects | MEDIUM | User engagement |
| Scroll Animations | HIGH | Content reveal |
| Hover Interactions | MEDIUM | Interactive elements |
| Mouse Tracking | LOW | Decorative effects |

## Quick Reference

### 1. Particle System (Canvas)

```tsx
"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}

export function ParticleBackground({ count = 100 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Setup
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    
    // Create particles
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#00ffff' : '#a855f7',
      alpha: Math.random() * 0.5 + 0.2
    }))
    
    let animationId: number
    
    const animate = () => {
      ctx.fillStyle = 'rgba(5, 0, 16, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        // Update position
        p.x += p.vx
        p.y += p.vy
        
        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        
        // Draw
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      })
      
      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 * (1 - dist / 100)})`
            ctx.stroke()
          }
        })
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [count])
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
}
```

### 2. Custom Cursor

```tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    
    // Detect hoverable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.matches('a, button, [role="button"], input, textarea, [data-cursor="pointer"]')) {
        setIsHovering(true)
      }
    }
    
    const handleMouseOut = () => setIsHovering(false)
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])
  
  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-cyan-400 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      
      {/* Trailing circle */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-cyan-400/50 pointer-events-none z-[9998]"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.5 : 0.3
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      />
    </>
  )
}
```

### 3. Scroll-Triggered Animation

```tsx
"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
}

export function ScrollReveal({ children, direction = "up" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const transforms = {
    up: useTransform(scrollYProgress, [0, 0.3], [50, 0]),
    down: useTransform(scrollYProgress, [0, 0.3], [-50, 0]),
    left: useTransform(scrollYProgress, [0, 0.3], [50, 0]),
    right: useTransform(scrollYProgress, [0, 0.3], [-50, 0])
  }
  
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const isHorizontal = direction === "left" || direction === "right"
  
  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        x: isHorizontal ? transforms[direction] : 0,
        y: !isHorizontal ? transforms[direction] : 0
      }}
    >
      {children}
    </motion.div>
  )
}
```

### 4. Mouse Tracking Element

```tsx
"use client"

import { useRef, useEffect, useState } from "react"

export function MouseTracker({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 20
      const y = (e.clientY - rect.top - rect.height / 2) / 20
      
      setPosition({ x, y })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
    <div
      ref={ref}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  )
}
```

### 5. Magnetic Button

```tsx
"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({ children, className = "", strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    setPosition({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength
    })
  }
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }
  
  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  )
}
```

### 6. Parallax Layer

```tsx
"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function ParallaxLayer({ children, speed = 0.5, className = "" }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed])
  
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
```

## Performance Guidelines

1. **Canvas Animations**: Use `requestAnimationFrame`, never `setInterval`
2. **Event Throttling**: Throttle mouse/scroll events to 60fps
3. **GPU Acceleration**: Use `transform` and `opacity` only
4. **Lazy Loading**: Dynamic import heavy animation components
5. **Visibility Check**: Pause off-screen animations
6. **Mobile Fallbacks**: Simplify or disable on mobile

## Common Mistakes

- ❌ Not cleaning up event listeners
- ❌ Creating new objects in animation loops
- ❌ Animating layout-triggering properties
- ❌ Too many particles on low-end devices
- ❌ Not respecting reduced motion preferences

## Full Implementation Guide

See `AGENTS.md` for complete implementation examples and advanced patterns.
````
