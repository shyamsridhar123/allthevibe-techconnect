````skill
---
name: matrix-effects
description: Matrix-themed visual effects including digital rain, glitch effects, terminal animations, and cyberpunk aesthetics. Apply when creating Matrix-inspired UI components, implementing digital rain backgrounds, adding glitch animations, or building terminal/hacker-style interfaces.
license: MIT
metadata:
  author: all-the-vibes
  version: "1.0.0"
---

# Matrix Effects Skill

Comprehensive guide for implementing Matrix-themed visual effects in React/Next.js applications. Includes patterns for digital rain, glitch effects, terminal animations, and cyberpunk UI elements optimized for performance.

## When to Apply

Reference these guidelines when:
- Implementing digital rain / matrix rain backgrounds
- Adding glitch or distortion effects to text/images
- Creating terminal/hacker-style UI elements
- Building cyberpunk-themed interfaces
- Adding scan line or CRT monitor effects
- Implementing typewriter/code typing animations

## Core Effect Categories

| Category | Impact | Primary Use |
|----------|--------|-------------|
| Digital Rain | HIGH | Background atmosphere |
| Glitch Effects | MEDIUM | Text/image emphasis |
| Terminal UI | HIGH | Interactive elements |
| Scan Lines | LOW | Atmospheric overlay |
| Data Stream | MEDIUM | Decorative elements |

## Quick Reference

### 1. Digital Rain (Canvas-Based)

#### Performance Rules
- `rain-canvas-offscreen` - Use OffscreenCanvas for heavy animations
- `rain-requestAnimationFrame` - Never use setInterval for animations
- `rain-column-pooling` - Reuse column objects instead of creating new ones
- `rain-character-cache` - Pre-render character sprites to avoid text rendering

#### Implementation Pattern

```tsx
// High-performance matrix rain with column pooling
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Use device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    ctx.scale(dpr, dpr)
    
    const fontSize = 16
    const columns = Math.floor(window.innerWidth / fontSize)
    
    // Column pool - reuse objects
    const drops: number[] = Array(columns).fill(1)
    const speeds: number[] = Array.from({ length: columns }, () => Math.random() * 0.5 + 0.5)
    
    // Character set - Matrix-style
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'
    
    let animationId: number
    
    const draw = () => {
      // Fade effect - creates trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      
      ctx.fillStyle = '#0f0'
      ctx.font = `${fontSize}px monospace`
      
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        
        // Head character brighter
        ctx.fillStyle = '#fff'
        ctx.fillText(char, x, y)
        
        // Trail characters
        ctx.fillStyle = '#0f0'
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize)
        
        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += speeds[i]
      }
      
      animationId = requestAnimationFrame(draw)
    }
    
    draw()
    return () => cancelAnimationFrame(animationId)
  }, [])
  
  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}
```

### 2. Glitch Effects (CSS-Based)

#### Effect Types
- `glitch-text` - Text distortion with clip-path animation
- `glitch-image` - Image channel separation
- `glitch-screen` - Full screen flicker effect
- `glitch-hover` - Trigger on interaction

#### Text Glitch Pattern

```css
/* Performant glitch using CSS only */
@keyframes glitch {
  0% {
    clip-path: inset(40% 0 61% 0);
    transform: translate(-2px, 2px);
  }
  20% {
    clip-path: inset(92% 0 1% 0);
    transform: translate(1px, -1px);
  }
  40% {
    clip-path: inset(43% 0 1% 0);
    transform: translate(-1px, 1px);
  }
  60% {
    clip-path: inset(25% 0 58% 0);
    transform: translate(2px, -2px);
  }
  80% {
    clip-path: inset(54% 0 7% 0);
    transform: translate(-2px, 2px);
  }
  100% {
    clip-path: inset(58% 0 43% 0);
    transform: translate(1px, -1px);
  }
}

.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  left: 2px;
  text-shadow: -2px 0 #ff00ff;
  animation: glitch 0.3s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: 2px 0 #00ffff;
  animation: glitch 0.3s infinite linear alternate-reverse;
  animation-delay: 0.1s;
}
```

#### React Component

```tsx
const GlitchText = ({ children, className = '' }: { children: string; className?: string }) => (
  <span className={`glitch-text ${className}`} data-text={children}>
    {children}
  </span>
)
```

### 3. Terminal UI Patterns

#### Typing Animation

```tsx
const TypewriterText = ({ text, speed = 50 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, speed)
    
    return () => clearInterval(timer)
  }, [text, speed])
  
  // Cursor blink
  useEffect(() => {
    const cursor = setInterval(() => setCursorVisible(v => !v), 500)
    return () => clearInterval(cursor)
  }, [])
  
  return (
    <span className="font-mono text-green-400">
      {displayedText}
      <span className={cursorVisible ? 'opacity-100' : 'opacity-0'}>█</span>
    </span>
  )
}
```

#### Terminal Container

```tsx
const TerminalWindow = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-black/80 border border-green-500/30 rounded-lg overflow-hidden backdrop-blur-sm">
    {/* Title bar */}
    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border-b border-green-500/20">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <span className="ml-2 text-green-400 text-sm font-mono">terminal</span>
    </div>
    {/* Content */}
    <div className="p-4 font-mono text-green-400 text-sm">
      {children}
    </div>
  </div>
)
```

### 4. Scan Line Overlay

```css
.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 255, 0.03) 2px,
    rgba(0, 255, 255, 0.03) 4px
  );
}

/* Animated scan line */
.scanline-moving {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 255, 255, 0.3),
    transparent
  );
  animation: scanline 6s linear infinite;
  pointer-events: none;
  z-index: 101;
}

@keyframes scanline {
  0% { top: 0; }
  100% { top: 100%; }
}
```

### 5. Data Stream Effect

```tsx
const DataStream = ({ text = '01', speed = 20 }: { text?: string; speed?: number }) => {
  const [stream, setStream] = useState<string[]>([])
  
  useEffect(() => {
    const chars = text.split('')
    const interval = setInterval(() => {
      setStream(prev => {
        const newStream = [...prev, chars[Math.floor(Math.random() * chars.length)]]
        if (newStream.length > 50) newStream.shift()
        return newStream
      })
    }, speed)
    
    return () => clearInterval(interval)
  }, [text, speed])
  
  return (
    <div className="font-mono text-cyan-400/50 text-xs whitespace-nowrap overflow-hidden">
      {stream.join('')}
    </div>
  )
}
```

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Matrix Green | `#00ff00` | Primary text, highlights |
| Cyan Glow | `#00ffff` | Accents, UI elements |
| Deep Black | `#050010` | Backgrounds |
| Purple Accent | `#a855f7` | Secondary elements |
| Warning Red | `#ff0000` | Alerts, glitch effects |
| Digital Blue | `#0066ff` | Links, interactive |

## Performance Guidelines

1. **Canvas animations**: Use `requestAnimationFrame`, never `setInterval`
2. **CSS over JS**: Prefer CSS animations for simple effects
3. **GPU acceleration**: Use `transform` and `opacity` for animations
4. **Lazy loading**: Dynamic import heavy effect components
5. **Visibility API**: Pause animations when tab is hidden
6. **Memory management**: Clean up intervals/RAF in useEffect cleanup

## Anti-Patterns

- ❌ Using `setInterval` for animations (causes jank)
- ❌ Animating `width`, `height`, `top`, `left` (triggers reflow)
- ❌ Creating new objects in animation loops
- ❌ Text rendering in canvas on every frame without caching
- ❌ Not cleaning up animation frames on unmount

## Full Implementation Guide

See `AGENTS.md` for complete implementation examples and advanced patterns.
````
