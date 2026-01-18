# Matrix Effects - Complete Implementation Guide

**Version 1.0.0**  
All The Vibes Engineering  
January 2026

> **Note:**  
> This document provides comprehensive implementation patterns for Matrix-themed visual effects.
> Optimized for AI-assisted code generation with strict performance guidelines.

---

## Table of Contents

1. [Digital Rain Systems](#1-digital-rain-systems)
2. [Glitch Effects](#2-glitch-effects)
3. [Terminal Animations](#3-terminal-animations)
4. [CRT/Retro Effects](#4-crtretro-effects)
5. [Data Visualization](#5-data-visualization)
6. [Performance Optimization](#6-performance-optimization)

---

## 1. Digital Rain Systems

### 1.1 High-Performance Canvas Rain

**Impact: CRITICAL (main visual element)**

The digital rain effect is the signature Matrix visual. This implementation uses column pooling and character caching for optimal performance.

```tsx
"use client"

import { useEffect, useRef, useCallback } from "react"

interface MatrixRainConfig {
  fontSize?: number
  fadeSpeed?: number
  colorPrimary?: string
  colorSecondary?: string
  characterSet?: string
}

export function MatrixRain({
  fontSize = 16,
  fadeSpeed = 0.05,
  colorPrimary = "#00ff00",
  colorSecondary = "#00ffff",
  characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコ0123456789@#$%"
}: MatrixRainConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  
  // Stable draw function that doesn't recreate on every render
  const draw = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    drops: number[],
    speeds: number[],
    hues: number[],
    characters: string
  ) => {
    // Fade effect - creates trails
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeSpeed})`
    ctx.fillRect(0, 0, width, height)
    
    ctx.font = `${fontSize}px "Courier New", monospace`
    
    const columns = drops.length
    
    for (let i = 0; i < columns; i++) {
      const char = characters[Math.floor(Math.random() * characters.length)]
      const x = i * fontSize
      const y = drops[i] * fontSize
      
      // Head character - brightest
      ctx.fillStyle = "#ffffff"
      ctx.fillText(char, x, y)
      
      // Trail characters with hue variation
      for (let j = 1; j < 8; j++) {
        const trailY = y - j * fontSize
        if (trailY < 0) continue
        
        const opacity = 1 - (j / 8)
        ctx.fillStyle = `hsla(${hues[i]}, 100%, 50%, ${opacity * 0.7})`
        ctx.fillText(
          characters[Math.floor(Math.random() * characters.length)],
          x,
          trailY
        )
      }
      
      // Reset column when it goes off screen
      if (y > height && Math.random() > 0.975) {
        drops[i] = 0
        speeds[i] = Math.random() * 0.5 + 0.3
        hues[i] = Math.random() * 60 + 120 // Green to cyan range
      }
      
      drops[i] += speeds[i]
    }
  }, [fontSize, fadeSpeed])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    // Setup canvas with device pixel ratio
    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      ctx.scale(dpr, dpr)
      
      return { width: rect.width, height: rect.height }
    }
    
    let { width, height } = setupCanvas()
    
    // Initialize column state
    const columns = Math.floor(width / fontSize)
    const drops: number[] = []
    const speeds: number[] = []
    const hues: number[] = []
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50
      speeds[i] = Math.random() * 0.5 + 0.3
      hues[i] = Math.random() * 60 + 120
    }
    
    // Animation loop
    const animate = () => {
      draw(ctx, width, height, drops, speeds, hues, characterSet)
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    // Handle resize
    const handleResize = () => {
      const dimensions = setupCanvas()
      width = dimensions.width
      height = dimensions.height
    }
    
    window.addEventListener("resize", handleResize)
    
    // Pause when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationRef.current)
      } else {
        animate()
      }
    }
    
    document.addEventListener("visibilitychange", handleVisibility)
    
    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [draw, fontSize, characterSet])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: "transparent" }}
    />
  )
}
```

### 1.2 CSS-Only Matrix Rain (Lightweight Alternative)

For simpler use cases where canvas isn't needed:

```tsx
export function CSSMatrixRain() {
  const columns = 40
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 text-green-400 font-mono text-xs opacity-60"
          style={{
            left: `${(i / columns) * 100}%`,
            animation: `matrix-fall ${3 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} className="opacity-[var(--opacity)]" style={{ '--opacity': 1 - j * 0.05 } as React.CSSProperties}>
              {String.fromCharCode(0x30A0 + Math.random() * 96)}
            </div>
          ))}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  )
}
```

---

## 2. Glitch Effects

### 2.1 RGB Split Glitch Text

```tsx
"use client"

import { useState, useEffect } from "react"

interface GlitchTextProps {
  children: string
  className?: string
  intensity?: "low" | "medium" | "high"
  continuous?: boolean
}

export function GlitchText({ 
  children, 
  className = "",
  intensity = "medium",
  continuous = false
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(continuous)
  
  useEffect(() => {
    if (continuous) return
    
    // Random glitch bursts
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 150 + Math.random() * 200)
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [continuous])
  
  const intensityConfig = {
    low: { offset: 1, duration: 0.1 },
    medium: { offset: 2, duration: 0.15 },
    high: { offset: 4, duration: 0.2 }
  }
  
  const config = intensityConfig[intensity]
  
  return (
    <span 
      className={`relative inline-block ${className}`}
      data-text={children}
    >
      {children}
      
      {/* Red channel */}
      <span
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          color: '#ff0000',
          mixBlendMode: 'screen',
          clipPath: isGlitching ? 'inset(10% 0 60% 0)' : 'none',
          transform: isGlitching ? `translate(${config.offset}px, 0)` : 'none',
          opacity: isGlitching ? 0.8 : 0,
          transition: `all ${config.duration}s steps(2)`,
        }}
        aria-hidden="true"
      >
        {children}
      </span>
      
      {/* Blue channel */}
      <span
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          color: '#00ffff',
          mixBlendMode: 'screen',
          clipPath: isGlitching ? 'inset(40% 0 20% 0)' : 'none',
          transform: isGlitching ? `translate(-${config.offset}px, 0)` : 'none',
          opacity: isGlitching ? 0.8 : 0,
          transition: `all ${config.duration}s steps(2)`,
        }}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  )
}
```

### 2.2 Glitch Image Effect

```tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface GlitchImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function GlitchImage({ src, alt, width, height, className = "" }: GlitchImageProps) {
  const [glitchState, setGlitchState] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitchState(Math.floor(Math.random() * 3) + 1)
        setTimeout(() => setGlitchState(0), 100 + Math.random() * 150)
      }
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base image */}
      <Image src={src} alt={alt} width={width} height={height} className="relative z-10" />
      
      {/* Glitch overlays */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          filter: glitchState === 1 ? 'hue-rotate(90deg)' : 'none',
          clipPath: glitchState === 1 ? 'inset(20% 0 50% 0)' : 'none',
          transform: glitchState === 1 ? 'translateX(5px)' : 'none',
          opacity: glitchState === 1 ? 0.7 : 0,
        }}
      />
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          filter: glitchState === 2 ? 'hue-rotate(-90deg)' : 'none',
          clipPath: glitchState === 2 ? 'inset(60% 0 10% 0)' : 'none',
          transform: glitchState === 2 ? 'translateX(-5px)' : 'none',
          opacity: glitchState === 2 ? 0.7 : 0,
        }}
      />
    </div>
  )
}
```

---

## 3. Terminal Animations

### 3.1 Advanced Typewriter with Commands

```tsx
"use client"

import { useState, useEffect, useCallback } from "react"

interface TerminalLine {
  type: "command" | "output" | "error" | "success"
  text: string
  delay?: number
}

interface TerminalProps {
  lines: TerminalLine[]
  typingSpeed?: number
  className?: string
  onComplete?: () => void
}

export function Terminal({ 
  lines, 
  typingSpeed = 30, 
  className = "",
  onComplete 
}: TerminalProps) {
  const [displayedLines, setDisplayedLines] = useState<{ type: string; text: string }[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  
  // Cursor blink
  useEffect(() => {
    const cursor = setInterval(() => setShowCursor(v => !v), 530)
    return () => clearInterval(cursor)
  }, [])
  
  // Typing animation
  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      onComplete?.()
      return
    }
    
    const currentLine = lines[currentLineIndex]
    
    if (currentCharIndex === 0 && currentLine.delay) {
      const delayTimer = setTimeout(() => {
        setCurrentCharIndex(1)
      }, currentLine.delay)
      return () => clearTimeout(delayTimer)
    }
    
    if (currentCharIndex <= currentLine.text.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev]
          if (newLines.length === currentLineIndex) {
            newLines.push({ type: currentLine.type, text: "" })
          }
          newLines[currentLineIndex].text = currentLine.text.slice(0, currentCharIndex)
          return newLines
        })
        setCurrentCharIndex(prev => prev + 1)
      }, currentLine.type === "output" ? typingSpeed / 3 : typingSpeed)
      
      return () => clearTimeout(timer)
    } else {
      // Move to next line
      const nextTimer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1)
        setCurrentCharIndex(0)
      }, 300)
      return () => clearTimeout(nextTimer)
    }
  }, [currentLineIndex, currentCharIndex, lines, typingSpeed, onComplete])
  
  const getLineStyle = (type: string) => {
    switch (type) {
      case "command": return "text-cyan-400"
      case "output": return "text-green-400/80"
      case "error": return "text-red-400"
      case "success": return "text-green-400"
      default: return "text-green-400"
    }
  }
  
  return (
    <div className={`bg-black/90 rounded-lg border border-green-500/30 overflow-hidden ${className}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border-b border-green-500/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-green-400/70 text-sm font-mono">neural-terminal</span>
      </div>
      
      {/* Terminal content */}
      <div className="p-4 font-mono text-sm space-y-1 min-h-[200px]">
        {displayedLines.map((line, i) => (
          <div key={i} className={`flex items-start ${getLineStyle(line.type)}`}>
            {line.type === "command" && (
              <span className="text-purple-400 mr-2">❯</span>
            )}
            <span>{line.text}</span>
            {i === displayedLines.length - 1 && currentLineIndex < lines.length && (
              <span className={`ml-0.5 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>█</span>
            )}
          </div>
        ))}
        {currentLineIndex >= lines.length && (
          <div className="flex items-center text-cyan-400">
            <span className="text-purple-400 mr-2">❯</span>
            <span className={showCursor ? 'opacity-100' : 'opacity-0'}>█</span>
          </div>
        )}
      </div>
    </div>
  )
}
```

### 3.2 Command Input Terminal

```tsx
"use client"

import { useState, useRef, useEffect } from "react"

interface CommandTerminalProps {
  onCommand?: (command: string) => string
  initialOutput?: string[]
  className?: string
}

export function CommandTerminal({ 
  onCommand,
  initialOutput = ["Welcome to Neural Terminal v2.0", "Type 'help' for available commands"],
  className = ""
}: CommandTerminalProps) {
  const [history, setHistory] = useState<{ type: 'input' | 'output'; text: string }[]>(
    initialOutput.map(text => ({ type: 'output', text }))
  )
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // Add command to history
    setHistory(prev => [...prev, { type: 'input', text: input }])
    setCommandHistory(prev => [...prev, input])
    setHistoryIndex(-1)
    
    // Process command
    const output = onCommand?.(input) ?? `Command not found: ${input}`
    setHistory(prev => [...prev, { type: 'output', text: output }])
    
    setInput("")
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex)
          setInput(commandHistory[commandHistory.length - 1 - newIndex])
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [history])
  
  // Focus input on click
  const handleContainerClick = () => {
    inputRef.current?.focus()
  }
  
  return (
    <div 
      className={`bg-black/95 rounded-lg border border-cyan-500/30 overflow-hidden ${className}`}
      onClick={handleContainerClick}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-cyan-400/70 text-sm font-mono">neural-cmd</span>
      </div>
      
      {/* Terminal content */}
      <div ref={containerRef} className="p-4 font-mono text-sm h-[300px] overflow-y-auto">
        {history.map((item, i) => (
          <div key={i} className="mb-1">
            {item.type === 'input' ? (
              <div className="text-cyan-400">
                <span className="text-purple-400">❯ </span>
                {item.text}
              </div>
            ) : (
              <div className="text-green-400/80 pl-4">{item.text}</div>
            )}
          </div>
        ))}
        
        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center text-cyan-400">
          <span className="text-purple-400">❯ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none caret-cyan-400"
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  )
}
```

---

## 4. CRT/Retro Effects

### 4.1 CRT Screen Effect

```tsx
export function CRTEffect({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Content */}
      <div className="relative z-10">{children}</div>
      
      {/* Scan lines */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)',
        }}
      />
      
      {/* RGB pixel grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 opacity-10"
        style={{
          background: `
            repeating-linear-gradient(90deg, 
              rgba(255, 0, 0, 0.3) 0px, 
              rgba(0, 255, 0, 0.3) 1px, 
              rgba(0, 0, 255, 0.3) 2px,
              transparent 3px
            )
          `,
          backgroundSize: '3px 100%',
        }}
      />
      
      {/* Screen flicker */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 animate-pulse"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          animation: 'flicker 0.15s infinite',
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
      
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.97; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
```

### 4.2 Noise Overlay

```tsx
"use client"

import { useEffect, useRef } from "react"

export function NoiseOverlay({ opacity = 0.05 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = 200
    canvas.height = 200
    
    const imageData = ctx.createImageData(200, 200)
    
    const generateNoise = () => {
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.random() * 255
        imageData.data[i] = value     // R
        imageData.data[i + 1] = value // G
        imageData.data[i + 2] = value // B
        imageData.data[i + 3] = 255   // A
      }
      ctx.putImageData(imageData, 0, 0)
    }
    
    const interval = setInterval(generateNoise, 50)
    generateNoise()
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      style={{
        opacity,
        mixBlendMode: 'overlay',
        transform: 'scale(10)',
        imageRendering: 'pixelated',
      }}
    />
  )
}
```

---

## 5. Data Visualization

### 5.1 Binary Stream

```tsx
"use client"

import { useState, useEffect } from "react"

interface BinaryStreamProps {
  columns?: number
  speed?: number
  className?: string
}

export function BinaryStream({ columns = 10, speed = 100, className = "" }: BinaryStreamProps) {
  const [streams, setStreams] = useState<string[][]>([])
  
  useEffect(() => {
    // Initialize streams
    const initial = Array.from({ length: columns }, () => 
      Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0')
    )
    setStreams(initial)
    
    // Animate
    const interval = setInterval(() => {
      setStreams(prev => prev.map(stream => {
        const newStream = [...stream]
        newStream.shift()
        newStream.push(Math.random() > 0.5 ? '1' : '0')
        return newStream
      }))
    }, speed)
    
    return () => clearInterval(interval)
  }, [columns, speed])
  
  return (
    <div className={`flex gap-1 font-mono text-xs ${className}`}>
      {streams.map((stream, i) => (
        <div key={i} className="flex flex-col">
          {stream.map((bit, j) => (
            <span 
              key={j} 
              className="text-green-400"
              style={{ opacity: 0.3 + (j / stream.length) * 0.7 }}
            >
              {bit}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
```

### 5.2 Network Grid

```tsx
"use client"

import { useEffect, useRef } from "react"

export function NetworkGrid({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = 400
    canvas.height = 400
    
    const nodes: { x: number; y: number; pulse: number }[] = []
    const gridSize = 8
    const spacing = canvas.width / gridSize
    
    // Create grid of nodes
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        nodes.push({
          x: spacing / 2 + i * spacing,
          y: spacing / 2 + j * spacing,
          pulse: Math.random() * Math.PI * 2
        })
      }
    }
    
    let animationId: number
    
    const animate = (time: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw connections
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)'
      ctx.lineWidth = 1
      
      nodes.forEach((node, i) => {
        nodes.forEach((other, j) => {
          if (i >= j) return
          const dist = Math.hypot(node.x - other.x, node.y - other.y)
          if (dist < spacing * 1.5) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        })
      })
      
      // Draw nodes
      nodes.forEach(node => {
        const pulse = Math.sin(time / 1000 + node.pulse) * 0.5 + 0.5
        const radius = 3 + pulse * 2
        
        // Glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 255, ${0.2 * pulse})`
        ctx.fill()
        
        // Core
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + pulse * 0.5})`
        ctx.fill()
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate(0)
    
    return () => cancelAnimationFrame(animationId)
  }, [])
  
  return <canvas ref={canvasRef} className={className} />
}
```

---

## 6. Performance Optimization

### 6.1 Visibility-Aware Animation

```tsx
import { useEffect, useRef, useState } from "react"

export function useVisibilityAnimation() {
  const [isVisible, setIsVisible] = useState(true)
  const animationRef = useRef<number>(0)
  
  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(!document.hidden)
    }
    
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])
  
  const startAnimation = (callback: () => void) => {
    const animate = () => {
      if (isVisible) {
        callback()
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    animate()
  }
  
  const stopAnimation = () => {
    cancelAnimationFrame(animationRef.current)
  }
  
  return { isVisible, startAnimation, stopAnimation, animationRef }
}
```

### 6.2 Intersection Observer for Effects

```tsx
import { useEffect, useRef, useState } from "react"

export function useInViewAnimation<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    )
    
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  
  return { ref, isInView }
}
```

---

## Integration Example

```tsx
import { MatrixRain } from "./matrix-rain"
import { GlitchText } from "./glitch-text"
import { Terminal } from "./terminal"
import { CRTEffect } from "./crt-effect"
import { NoiseOverlay } from "./noise-overlay"

export function MatrixLandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-green-400">
      {/* Background effects */}
      <MatrixRain />
      <NoiseOverlay opacity={0.03} />
      
      {/* Content */}
      <CRTEffect>
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <GlitchText className="text-6xl font-bold mb-8" intensity="high">
            ALL THE VIBES
          </GlitchText>
          
          <Terminal
            lines={[
              { type: "command", text: "initialize --neural-network" },
              { type: "output", text: "Loading consciousness matrix...", delay: 500 },
              { type: "output", text: "Synchronizing vibes...", delay: 300 },
              { type: "success", text: "SYSTEM READY", delay: 500 },
            ]}
            className="w-full max-w-2xl mx-auto"
          />
        </main>
      </CRTEffect>
    </div>
  )
}
```
