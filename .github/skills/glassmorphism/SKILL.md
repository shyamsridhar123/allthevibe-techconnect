````skill
---
name: glassmorphism
description: Glass morphism UI design patterns including frosted glass effects, blur backgrounds, translucent panels, and luminous UI elements. Apply when creating modern, sleek card components, modals, navigation, or any UI element that needs depth and elegance.
license: MIT
metadata:
  author: all-the-vibes
  version: "1.0.0"
---

# Glassmorphism Skill

Comprehensive guide for implementing glass morphism effects in React/Next.js applications. Covers frosted glass, blur effects, translucent panels, and luminous UI patterns.

## When to Apply

Reference these guidelines when:
- Creating card components with depth
- Building modals and overlays
- Designing navigation bars
- Implementing floating UI elements
- Adding visual hierarchy through transparency
- Creating futuristic/modern UI interfaces

## Core Pattern Categories

| Category | Impact | Primary Use |
|----------|--------|-------------|
| Frosted Glass | HIGH | Cards, modals, panels |
| Blur Backgrounds | MEDIUM | Navigation, headers |
| Luminous Borders | MEDIUM | Interactive elements |
| Gradient Overlays | LOW | Decorative accents |
| Reflections | LOW | Premium polish |

## Quick Reference

### 1. Basic Glass Card

```tsx
interface GlassCardProps {
  children: React.ReactNode
  className?: string
  blur?: 'sm' | 'md' | 'lg' | 'xl'
}

export function GlassCard({ children, className = "", blur = "md" }: GlassCardProps) {
  const blurValues = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }
  
  return (
    <div className={`
      relative rounded-2xl
      bg-white/10
      ${blurValues[blur]}
      border border-white/20
      shadow-xl shadow-black/10
      ${className}
    `}>
      {children}
    </div>
  )
}
```

### 2. Neon Glass Card (Matrix Theme)

```tsx
export function NeonGlassCard({ children, color = "cyan" }: { children: React.ReactNode; color?: "cyan" | "purple" }) {
  const colors = {
    cyan: {
      bg: 'from-cyan-500/10 to-cyan-500/5',
      border: 'border-cyan-500/30',
      glow: 'shadow-cyan-500/20'
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-500/30',
      glow: 'shadow-purple-500/20'
    }
  }
  
  const c = colors[color]
  
  return (
    <div className={`
      relative rounded-2xl p-6
      bg-gradient-to-br ${c.bg}
      backdrop-blur-xl
      border ${c.border}
      shadow-lg ${c.glow}
    `}>
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
```

### 3. Glass Navigation Bar

```tsx
export function GlassNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-white">Logo</div>
          <div className="flex gap-6">
            {['Home', 'About', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

### 4. Glass Modal

```tsx
interface GlassModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function GlassModal({ isOpen, onClose, children, title }: GlassModalProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">{children}</div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}
```

### 5. Glass Input Field

```tsx
interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function GlassInput({ label, error, className = "", ...props }: GlassInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm text-white/70">{label}</label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-xl
          bg-white/5 backdrop-blur-sm
          border border-white/10
          text-white placeholder:text-white/30
          focus:outline-none focus:border-cyan-400/50 focus:bg-white/10
          transition-colors
          ${error ? 'border-red-400/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
```

### 6. Glass Button

```tsx
interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost'
}

export function GlassButton({ children, variant = 'default', className = "", ...props }: GlassButtonProps) {
  const variants = {
    default: 'bg-white/10 hover:bg-white/20 border-white/20',
    primary: 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border-cyan-500/30',
    ghost: 'bg-transparent hover:bg-white/10 border-transparent hover:border-white/10'
  }
  
  return (
    <button
      className={`
        px-6 py-3 rounded-xl
        backdrop-blur-sm
        border
        ${variants[variant]}
        text-white font-medium
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
```

## Design Tokens

### Background Opacities

| Level | Value | Use Case |
|-------|-------|----------|
| Subtle | `5-10%` | Cards on dark bg |
| Light | `10-15%` | Modals, overlays |
| Medium | `15-25%` | Navigation, prominent UI |
| Strong | `25-40%` | High contrast needs |

### Blur Intensities

| Level | Tailwind | Use Case |
|-------|----------|----------|
| Subtle | `backdrop-blur-sm` | Light frosting |
| Default | `backdrop-blur-md` | Standard cards |
| Strong | `backdrop-blur-lg` | Prominent elements |
| Maximum | `backdrop-blur-xl` | Modal overlays |

### Border Opacities

| Level | Value | Use Case |
|-------|-------|----------|
| Subtle | `10-15%` | Secondary borders |
| Default | `20-30%` | Standard borders |
| Prominent | `30-50%` | Focus states, highlights |

## Performance Guidelines

1. **Limit blur layers**: Each blur layer is expensive - max 3-4 on screen
2. **Use `will-change`**: Add `will-change: transform` for animated glass elements
3. **Reduce on mobile**: Consider simpler effects on mobile devices
4. **Avoid blur on scroll**: Don't animate blur values during scroll
5. **Fixed dimensions**: Glass elements with fixed sizes perform better

## Common Mistakes

- ❌ Too many overlapping blur layers (kills performance)
- ❌ Pure white/black backgrounds (loses glass effect)
- ❌ Insufficient contrast for text readability
- ❌ Forgetting border for definition
- ❌ Using blur on rapidly moving elements

## Full Implementation Guide

See `AGENTS.md` for complete component library and advanced patterns.
````
