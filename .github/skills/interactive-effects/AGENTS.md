# Interactive Effects - Complete Implementation Guide

**Version 1.0.0**  
All The Vibes Engineering  
January 2026

> **Note:**  
> This document provides comprehensive interactive effect patterns for futuristic UX.
> All implementations are performance-optimized with accessibility considerations.

---

## Table of Contents

1. [Particle Systems](#1-particle-systems)
2. [Cursor & Mouse Effects](#2-cursor--mouse-effects)
3. [Scroll Animations](#3-scroll-animations)
4. [Hover Interactions](#4-hover-interactions)
5. [Background Effects](#5-background-effects)
6. [Utility Hooks](#6-utility-hooks)

---

## 1. Particle Systems

### 1.1 Connected Particle Network

```tsx
"use client"

import { useEffect, useRef, useCallback } from "react"

interface NetworkParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export function ParticleNetwork({ 
  particleCount = 80,
  connectionDistance = 150,
  mouseInfluence = 100
}: {
  particleCount?: number
  connectionDistance?: number
  mouseInfluence?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<NetworkParticle[]>([])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    
    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1
    }))
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    
    let animationId: number
    
    const animate = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      ctx.fillStyle = 'rgba(5, 0, 16, 0.15)'
      ctx.fillRect(0, 0, width, height)
      
      const particles = particlesRef.current
      const mouse = mouseRef.current
      
      // Update and draw particles
      particles.forEach((p, i) => {
        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.hypot(dx, dy)
        
        if (dist < mouseInfluence) {
          const force = (mouseInfluence - dist) / mouseInfluence
          p.vx += (dx / dist) * force * 0.5
          p.vy += (dy / dist) * force * 0.5
        }
        
        // Apply velocity with friction
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99
        
        // Wrap around
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = '#00ffff'
        ctx.fill()
        
        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const d = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (d < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 * (1 - d / connectionDistance)})`
            ctx.lineWidth = 0.5
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
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [particleCount, connectionDistance, mouseInfluence])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
```

### 1.2 Floating Orbs

```tsx
"use client"

import { useEffect, useRef } from "react"

export function FloatingOrbs({ count = 15 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    // Create orbs
    const orbs: HTMLDivElement[] = []
    
    for (let i = 0; i < count; i++) {
      const orb = document.createElement('div')
      const size = 100 + Math.random() * 200
      const x = Math.random() * 100
      const y = Math.random() * 100
      const duration = 20 + Math.random() * 30
      const delay = Math.random() * -30
      const hue = Math.random() > 0.5 ? 180 : 280 // Cyan or purple
      
      orb.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        background: radial-gradient(circle, hsla(${hue}, 100%, 50%, 0.15), transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: float-orb ${duration}s ease-in-out ${delay}s infinite;
        filter: blur(40px);
      `
      
      orbs.push(orb)
      container.appendChild(orb)
    }
    
    // Add keyframes if not exists
    if (!document.getElementById('orb-keyframes')) {
      const style = document.createElement('style')
      style.id = 'orb-keyframes'
      style.textContent = `
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 40px) scale(1.05); }
        }
      `
      document.head.appendChild(style)
    }
    
    return () => {
      orbs.forEach(orb => orb.remove())
    }
  }, [count])
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}
```

---

## 2. Cursor & Mouse Effects

### 2.1 Spotlight Cursor

```tsx
"use client"

import { useEffect, useState } from "react"

export function SpotlightCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 255, 255, 0.06), transparent 40%)`
      }}
    />
  )
}
```

### 2.2 Trail Cursor

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Trail {
  id: number
  x: number
  y: number
}

export function TrailCursor({ trailLength = 10 }: { trailLength?: number }) {
  const [trails, setTrails] = useState<Trail[]>([])
  const idRef = useRef(0)
  
  useEffect(() => {
    let lastTime = 0
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < 16) return // Throttle to ~60fps
      lastTime = now
      
      idRef.current++
      setTrails(prev => {
        const newTrails = [...prev, { id: idRef.current, x: e.clientX, y: e.clientY }]
        return newTrails.slice(-trailLength)
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [trailLength])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {trails.map((trail, i) => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-3 h-3 rounded-full bg-cyan-400"
            style={{
              left: trail.x - 6,
              top: trail.y - 6,
              opacity: (i + 1) / trails.length * 0.5
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
```

### 2.3 Ripple Click Effect

```tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Ripple {
  id: number
  x: number
  y: number
}

export function RippleClick() {
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
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-20 h-20 rounded-full border-2 border-cyan-400"
            style={{
              left: ripple.x - 40,
              top: ripple.y - 40
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
```

---

## 3. Scroll Animations

### 3.1 Scroll Progress Indicator

```tsx
"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 origin-left z-50"
      style={{ scaleX }}
    />
  )
}
```

### 3.2 Staggered List Reveal

```tsx
"use client"

import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

interface StaggerListProps {
  items: React.ReactNode[]
  className?: string
}

export function StaggerList({ items, className = "" }: StaggerListProps) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {items.map((item, i) => (
        <motion.li key={i} variants={itemVariants}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

### 3.3 Parallax Text

```tsx
"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxTextProps {
  children: string
  baseVelocity?: number
}

export function ParallaxText({ children, baseVelocity = 5 }: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const x = useTransform(scrollYProgress, [0, 1], [0, -500 * baseVelocity])
  
  return (
    <div ref={ref} className="overflow-hidden whitespace-nowrap">
      <motion.div style={{ x }} className="inline-flex gap-8">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-6xl font-bold text-white/10">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
```

### 3.4 Scroll-Triggered Counter

```tsx
"use client"

import { useRef, useState, useEffect } from "react"
import { useInView } from "framer-motion"

interface CounterProps {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
}

export function ScrollCounter({ target, duration = 2000, prefix = "", suffix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!isInView) return
    
    let startTime: number
    let animationId: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }
    
    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [isInView, target, duration])
  
  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
```

---

## 4. Hover Interactions

### 4.1 Tilt Card

```tsx
"use client"

import { useState, useRef } from "react"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  tiltAmount?: number
}

export function TiltCard({ children, className = "", tiltAmount = 10 }: TiltCardProps) {
  const [transform, setTransform] = useState("")
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
  const cardRef = useRef<HTMLDivElement>(null)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    const rotateX = (y - 0.5) * -tiltAmount
    const rotateY = (x - 0.5) * tiltAmount
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
    setGlarePosition({ x: x * 100, y: y * 100 })
  }
  
  const handleMouseLeave = () => {
    setTransform("")
    setGlarePosition({ x: 50, y: 50 })
  }
  
  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform,
        transition: transform ? 'none' : 'transform 0.3s ease-out'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Glare effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15), transparent 50%)`,
          opacity: transform ? 1 : 0,
          transition: 'opacity 0.3s'
        }}
      />
    </div>
  )
}
```

### 4.2 Expanding Hover Effect

```tsx
"use client"

import { motion } from "framer-motion"

export function ExpandingHover({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="relative"
      whileHover="hover"
    >
      {/* Expanding background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl"
        initial={{ scale: 0, opacity: 0 }}
        variants={{
          hover: { scale: 1.05, opacity: 1 }
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <motion.div
        className="relative z-10"
        variants={{
          hover: { scale: 1.02 }
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
```

---

## 5. Background Effects

### 5.1 Grid Background

```tsx
export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Radial fade */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, #050010 70%)'
        }}
      />
    </div>
  )
}
```

### 5.2 Animated Gradient Background

```tsx
"use client"

export function AnimatedGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(-45deg, #00ffff, #050010, #a855f7, #050010)',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 15s ease infinite'
        }}
      />
      
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}
```

---

## 6. Utility Hooks

### 6.1 useMousePosition

```tsx
"use client"

import { useState, useEffect } from "react"

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return position
}
```

### 6.2 useReducedMotion

```tsx
"use client"

import { useState, useEffect } from "react"

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  return reducedMotion
}
```

### 6.3 useScrollDirection

```tsx
"use client"

import { useState, useEffect } from "react"

type ScrollDirection = "up" | "down" | null

export function useScrollDirection() {
  const [direction, setDirection] = useState<ScrollDirection>(null)
  
  useEffect(() => {
    let lastScroll = window.scrollY
    
    const handleScroll = () => {
      const current = window.scrollY
      if (current > lastScroll) {
        setDirection("down")
      } else if (current < lastScroll) {
        setDirection("up")
      }
      lastScroll = current
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return direction
}
```

---

## Performance Checklist

- [ ] Use `requestAnimationFrame` for all animations
- [ ] Throttle mouse/scroll events
- [ ] Use `will-change` sparingly
- [ ] Clean up all event listeners
- [ ] Test on low-end devices
- [ ] Respect reduced motion preferences
- [ ] Use CSS transforms only (not layout properties)
- [ ] Limit particle count on mobile
