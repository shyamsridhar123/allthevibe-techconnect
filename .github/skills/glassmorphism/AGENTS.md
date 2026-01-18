# Glassmorphism - Complete Implementation Guide

**Version 1.0.0**  
All The Vibes Engineering  
January 2026

> **Note:**  
> This document provides comprehensive glassmorphism patterns optimized for futuristic,
> Matrix-themed interfaces. All components are performance-optimized.

---

## Table of Contents

1. [Component Library](#1-component-library)
2. [Advanced Patterns](#2-advanced-patterns)
3. [Animation Integration](#3-animation-integration)
4. [Theming System](#4-theming-system)
5. [Accessibility](#5-accessibility)

---

## 1. Component Library

### 1.1 Glass Panel (Foundation Component)

```tsx
"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg" | "xl" | "2xl"
  opacity?: "subtle" | "light" | "medium" | "strong"
  border?: boolean
  glow?: "none" | "cyan" | "purple" | "mixed"
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, blur = "lg", opacity = "light", border = true, glow = "none", children, ...props }, ref) => {
    const blurClasses = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
      "2xl": "backdrop-blur-2xl"
    }
    
    const opacityClasses = {
      subtle: "bg-white/5",
      light: "bg-white/10",
      medium: "bg-white/15",
      strong: "bg-white/25"
    }
    
    const glowClasses = {
      none: "",
      cyan: "shadow-lg shadow-cyan-500/10",
      purple: "shadow-lg shadow-purple-500/10",
      mixed: "shadow-lg shadow-cyan-500/5"
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl",
          blurClasses[blur],
          opacityClasses[opacity],
          border && "border border-white/10",
          glowClasses[glow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassPanel.displayName = "GlassPanel"
```

### 1.2 Glass Card with Hover Effect

```tsx
"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  glowColor?: "cyan" | "purple"
}

export function GlassCard({ 
  children, 
  className = "", 
  hoverEffect = true,
  glowColor = "cyan"
}: GlassCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !hoverEffect) return
    
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }
  
  const glowStyles = {
    cyan: "rgba(0, 255, 255, 0.15)",
    purple: "rgba(168, 85, 247, 0.15)"
  }
  
  return (
    <div
      ref={cardRef}
      className={cn(
        "relative rounded-2xl p-6",
        "bg-gradient-to-br from-white/10 to-white/5",
        "backdrop-blur-xl",
        "border border-white/10",
        "transition-all duration-300",
        isHovered && "border-white/20",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight effect */}
      {hoverEffect && isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowStyles[glowColor]}, transparent 60%)`
          }}
        />
      )}
      
      {/* Top reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
```

### 1.3 Animated Glass Border

```tsx
"use client"

interface AnimatedGlassCardProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGlassCard({ children, className = "" }: AnimatedGlassCardProps) {
  return (
    <div className={`relative rounded-2xl p-[1px] ${className}`}>
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-50 animate-gradient-x" />
      
      {/* Inner card */}
      <div className="relative rounded-2xl bg-[#050010]/90 backdrop-blur-xl p-6">
        {children}
      </div>
      
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
```

### 1.4 Glass Tabs

```tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface GlassTabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export function GlassTabs({ tabs, defaultTab }: GlassTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  
  return (
    <div className="space-y-4">
      {/* Tab headers */}
      <div className="flex p-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative flex-1 py-2 px-4 rounded-lg text-sm font-medium
              transition-colors duration-200
              ${activeTab === tab.id ? 'text-white' : 'text-white/50 hover:text-white/70'}
            `}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg bg-white/10 border border-white/20"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  )
}
```

### 1.5 Glass Dropdown

```tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Option {
  value: string
  label: string
}

interface GlassDropdownProps {
  options: Option[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export function GlassDropdown({ options, value, onChange, placeholder = "Select..." }: GlassDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  const selected = options.find(o => o.value === value)
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
      >
        <span className={selected ? "text-white" : "text-white/50"}>
          {selected?.label || placeholder}
        </span>
        <svg 
          className={`w-5 h-5 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#0a0a1a]/95 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden z-50"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange?.(option.value)
                  setIsOpen(false)
                }}
                className={`
                  w-full px-4 py-3 text-left transition-colors
                  ${option.value === value 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'}
                `}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

---

## 2. Advanced Patterns

### 2.1 Glass Morphing Shape

```tsx
"use client"

import { useEffect, useRef } from "react"

export function MorphingGlassBlob() {
  const blobRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    let animationId: number
    let time = 0
    
    const animate = () => {
      time += 0.01
      
      if (blobRef.current) {
        const scale1 = 1 + Math.sin(time) * 0.1
        const scale2 = 1 + Math.cos(time * 1.3) * 0.1
        const rotate = Math.sin(time * 0.5) * 10
        
        blobRef.current.style.transform = `scale(${scale1}, ${scale2}) rotate(${rotate}deg)`
      }
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    return () => cancelAnimationFrame(animationId)
  }, [])
  
  return (
    <div
      ref={blobRef}
      className="w-64 h-64 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20"
      style={{ willChange: 'transform' }}
    />
  )
}
```

### 2.2 Layered Glass Depth

```tsx
export function LayeredGlassDepth({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Background layer - most blurred */}
      <div className="absolute inset-4 rounded-2xl bg-purple-500/10 backdrop-blur-2xl" />
      
      {/* Middle layer */}
      <div className="absolute inset-2 rounded-2xl bg-cyan-500/10 backdrop-blur-xl" />
      
      {/* Front layer - least blurred */}
      <div className="relative rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-6">
        {children}
      </div>
    </div>
  )
}
```

### 2.3 Glass with Scan Line

```tsx
export function ScanlineGlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-xl" />
      
      {/* Scan line animation */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 255, 255, 0.1) 50%, transparent 100%)',
          backgroundSize: '100% 10px',
          animation: 'scanline 3s linear infinite'
        }}
      />
      
      {/* Border */}
      <div className="absolute inset-0 rounded-2xl border border-cyan-500/30" />
      
      {/* Content */}
      <div className="relative p-6">{children}</div>
      
      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  )
}
```

---

## 3. Animation Integration

### 3.1 Glass Reveal Animation

```tsx
"use client"

import { motion } from "framer-motion"

export function GlassReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 20,
        backdropFilter: 'blur(0px)'
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        backdropFilter: 'blur(20px)'
      }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true }}
      className="rounded-2xl bg-white/10 border border-white/10 p-6"
    >
      {children}
    </motion.div>
  )
}
```

### 3.2 Hover Glow Effect

```tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export function GlowOnHover({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className="relative rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow layer */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 blur-lg"
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Card */}
      <div className="relative rounded-2xl bg-[#050010]/90 backdrop-blur-xl border border-white/10 p-6">
        {children}
      </div>
    </motion.div>
  )
}
```

---

## 4. Theming System

### 4.1 Glass Theme Provider

```tsx
"use client"

import { createContext, useContext, ReactNode } from "react"

interface GlassTheme {
  blur: "sm" | "md" | "lg" | "xl"
  opacity: number
  borderOpacity: number
  glowColor: string
}

const defaultTheme: GlassTheme = {
  blur: "xl",
  opacity: 0.1,
  borderOpacity: 0.1,
  glowColor: "rgba(0, 255, 255, 0.2)"
}

const GlassThemeContext = createContext<GlassTheme>(defaultTheme)

export function GlassThemeProvider({ 
  children, 
  theme = defaultTheme 
}: { 
  children: ReactNode
  theme?: Partial<GlassTheme>
}) {
  return (
    <GlassThemeContext.Provider value={{ ...defaultTheme, ...theme }}>
      {children}
    </GlassThemeContext.Provider>
  )
}

export function useGlassTheme() {
  return useContext(GlassThemeContext)
}
```

### 4.2 CSS Custom Properties

```css
:root {
  --glass-blur: 20px;
  --glass-bg-opacity: 0.1;
  --glass-border-opacity: 0.1;
  --glass-glow: rgba(0, 255, 255, 0.2);
  
  /* Matrix theme overrides */
  --glass-accent-1: rgba(0, 255, 255, 0.2);
  --glass-accent-2: rgba(168, 85, 247, 0.2);
}

.glass-panel {
  backdrop-filter: blur(var(--glass-blur));
  background: rgba(255, 255, 255, var(--glass-bg-opacity));
  border: 1px solid rgba(255, 255, 255, var(--glass-border-opacity));
}

.glass-panel--cyan {
  box-shadow: 0 10px 40px var(--glass-accent-1);
}

.glass-panel--purple {
  box-shadow: 0 10px 40px var(--glass-accent-2);
}
```

---

## 5. Accessibility

### 5.1 Ensuring Contrast

```tsx
interface AccessibleGlassCardProps {
  children: React.ReactNode
  highContrast?: boolean
}

export function AccessibleGlassCard({ children, highContrast = false }: AccessibleGlassCardProps) {
  return (
    <div className={`
      rounded-2xl p-6
      ${highContrast 
        ? 'bg-black/80 border-2 border-white/40' 
        : 'bg-white/10 backdrop-blur-xl border border-white/10'}
    `}>
      <div className={highContrast ? 'text-white' : 'text-white/90'}>
        {children}
      </div>
    </div>
  )
}
```

### 5.2 Reduced Motion Support

```tsx
"use client"

import { useReducedMotion } from "framer-motion"

export function MotionSafeGlass({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <div className={`
      rounded-2xl p-6 bg-white/10 border border-white/10
      ${shouldReduceMotion ? '' : 'backdrop-blur-xl transition-all duration-300 hover:bg-white/15'}
    `}>
      {children}
    </div>
  )
}
```

---

## Performance Checklist

- [ ] Maximum 3-4 blur layers visible at once
- [ ] Use `will-change: transform` for animated elements
- [ ] Simplify effects on mobile (reduce blur intensity)
- [ ] Avoid animating `backdrop-filter` values
- [ ] Use fixed dimensions where possible
- [ ] Test on low-end devices
