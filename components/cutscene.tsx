"use client"

import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

interface CutsceneProps {
  onComplete: () => void
}

// Animation timing constants
const TIMING = {
  backgroundFade: 0,
  roomReveal: 0.2,
  floorReveal: 0.4,
  catEnter: 0.6,
  catWalkDuration: 4, // seconds
  textReveal: 2.5, // when cat reaches ~center
  fadeOutDuration: 1,
  totalDuration: 5000, // ms
  ghostCatDelay: 0.08, // delay multiplier for ghost cat (percentage behind main cat)
}

// Spring configurations
const springs = {
  smooth: { type: "spring" as const, stiffness: 100, damping: 20 },
  gentle: { type: "spring" as const, stiffness: 50, damping: 15, mass: 1.2 },
  stiff: { type: "spring" as const, stiffness: 300, damping: 30 },
}

// Particle types for dust motes
interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speedX: number
  speedY: number
  life: number
  maxLife: number
  type: 'dust' | 'digital'
}

// Spatial Audio Manager - creates immersive 3D audio
class SpatialAudioManager {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private ambientOscillator: OscillatorNode | null = null
  private ambientGain: GainNode | null = null
  private harmonicOscillator: OscillatorNode | null = null
  private footstepInterval: ReturnType<typeof setInterval> | null = null
  private pannerNode: StereoPannerNode | null = null
  private isInitialized = false

  async init(): Promise<boolean> {
    if (this.isInitialized || typeof window === 'undefined') return this.isInitialized
    
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported')
        return false
      }
      
      this.audioContext = new AudioContextClass()
      
      // Aggressively try to resume - poll until it works
      const tryResume = async () => {
        if (this.audioContext && this.audioContext.state === 'suspended') {
          try {
            await this.audioContext.resume()
          } catch {
            // Ignore, will retry
          }
        }
      }
      
      // Try immediately
      await tryResume()
      
      // Keep trying every 100ms for 3 seconds
      let attempts = 0
      const resumeInterval = setInterval(async () => {
        attempts++
        await tryResume()
        if (this.audioContext?.state === 'running' || attempts > 30) {
          clearInterval(resumeInterval)
        }
      }, 100)
      
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = 0.4 // Increased from 0.15
      this.masterGain.connect(this.audioContext.destination)
      
      // Create panner for spatial positioning
      this.pannerNode = this.audioContext.createStereoPanner()
      this.pannerNode.connect(this.masterGain)
      
      // Ambient doorway hum - low frequency drone
      this.ambientOscillator = this.audioContext.createOscillator()
      this.ambientGain = this.audioContext.createGain()
      this.ambientOscillator.type = 'sine'
      this.ambientOscillator.frequency.value = 55 // Low A1
      this.ambientGain.gain.value = 0.08 // Increased from 0.03
      this.ambientOscillator.connect(this.ambientGain)
      this.ambientGain.connect(this.masterGain)
      this.ambientOscillator.start()
      
      // Add subtle harmonic
      this.harmonicOscillator = this.audioContext.createOscillator()
      const harmonicGain = this.audioContext.createGain()
      this.harmonicOscillator.type = 'triangle'
      this.harmonicOscillator.frequency.value = 110
      harmonicGain.gain.value = 0.03 // Increased from 0.01
      this.harmonicOscillator.connect(harmonicGain)
      harmonicGain.connect(this.masterGain)
      this.harmonicOscillator.start()
      
      this.isInitialized = true
      console.log('Spatial audio initialized successfully')
      return true
    } catch (err) {
      console.warn('Web Audio API initialization failed:', err)
      return false
    }
  }

  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  updateCatPosition(progress: number) {
    if (!this.pannerNode || !this.audioContext) return
    // Pan from -1 (left) to 1 (right) based on cat progress
    const pan = (progress * 2) - 1
    this.pannerNode.pan.setValueAtTime(pan, this.audioContext.currentTime)
  }

  playFootstep() {
    if (!this.audioContext || !this.pannerNode) return
    
    // Resume context if needed
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    const noise = this.audioContext.createOscillator()
    const noiseGain = this.audioContext.createGain()
    
    // Soft pad sound - increased volume
    osc.type = 'sine'
    osc.frequency.value = 80 + Math.random() * 40
    gain.gain.value = 0.06 // Increased from 0.02
    
    // Slight noise for texture - increased volume
    noise.type = 'triangle'
    noise.frequency.value = 200 + Math.random() * 100
    noiseGain.gain.value = 0.015 // Increased from 0.005
    
    osc.connect(gain)
    gain.connect(this.pannerNode)
    noise.connect(noiseGain)
    noiseGain.connect(this.pannerNode)
    
    osc.start()
    noise.start()
    
    // Quick decay
    gain.gain.setValueAtTime(0.06, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.12)
    noiseGain.gain.setValueAtTime(0.015, this.audioContext.currentTime)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08)
    
    osc.stop(this.audioContext.currentTime + 0.15)
    noise.stop(this.audioContext.currentTime + 0.1)
  }

  startFootsteps() {
    if (this.footstepInterval) return
    // Resume audio context when starting footsteps
    this.resume()
    // Cat footsteps - 4 per second for walking
    this.footstepInterval = setInterval(() => this.playFootstep(), 250)
  }

  stopFootsteps() {
    if (this.footstepInterval) {
      clearInterval(this.footstepInterval)
      this.footstepInterval = null
    }
  }

  intensifyAmbient(intensity: number) {
    if (!this.ambientGain || !this.audioContext) return
    const targetGain = 0.08 + intensity * 0.1 // Increased range
    this.ambientGain.gain.setTargetAtTime(targetGain, this.audioContext.currentTime, 0.1)
  }

  playGlitchSound() {
    if (!this.audioContext || !this.masterGain) return
    
    // Resume context if needed
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    // Static/glitch burst
    const bufferSize = this.audioContext.sampleRate * 0.1
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3
    }
    
    const source = this.audioContext.createBufferSource()
    const gain = this.audioContext.createGain()
    source.buffer = buffer
    gain.gain.value = 0.15 // Increased from 0.08
    source.connect(gain)
    gain.connect(this.masterGain)
    
    source.start()
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1)
    source.stop(this.audioContext.currentTime + 0.1)
  }

  dispose() {
    this.stopFootsteps()
    try {
      if (this.ambientOscillator) {
        this.ambientOscillator.stop()
      }
      if (this.harmonicOscillator) {
        this.harmonicOscillator.stop()
      }
      if (this.audioContext) {
        this.audioContext.close()
      }
    } catch (e) {
      // Oscillators may already be stopped
    }
    this.isInitialized = false
  }
}

export default function Cutscene({ onComplete }: CutsceneProps) {
  const [phase, setPhase] = useState<'intro' | 'walking' | 'fadeout' | 'complete'>('intro')
  const [catProgress, setCatProgress] = useState(0) // 0 to 1
  const [ghostCatProgress, setGhostCatProgress] = useState(0) // Delayed ghost cat
  const [animationData, setAnimationData] = useState<object | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [screenTear, setScreenTear] = useState(false)
  const [lightFlicker, setLightFlicker] = useState(1)
  const [cameraShake, setCameraShake] = useState({ x: 0, y: 0 })
  const [audioReady, setAudioReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  
  // Refs for audio and canvas
  const audioManager = useRef<SpatialAudioManager | null>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const particleIdCounter = useRef(0)

  // Detect mobile and screen size
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(isTouchDevice || width < 768)
      setIsSmallScreen(width < 640)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Memoize animation data to prevent re-renders
  const memoizedAnimationData = useMemo(() => animationData, [animationData])

  // Skip handler for accessibility
  const handleSkip = useCallback(() => {
    audioManager.current?.dispose()
    setPhase('complete')
    onComplete()
  }, [onComplete])

  // Initialize spatial audio - try to auto-start aggressively
  useEffect(() => {
    if (prefersReducedMotion) return
    
    audioManager.current = new SpatialAudioManager()
    
    // Try to init immediately - the AudioManager will poll to resume
    const initAudio = async () => {
      if (audioManager.current) {
        const success = await audioManager.current.init()
        if (success) {
          setAudioReady(true)
        }
      }
    }
    
    // Initialize immediately
    initAudio()
    
    // Also handle any user interaction to ensure audio works
    const handleInteraction = async () => {
      await audioManager.current?.resume()
      setAudioReady(true)
    }
    
    // Listen for first interaction as backup (mouse move counts in some browsers)
    document.addEventListener('click', handleInteraction, { once: true })
    document.addEventListener('keydown', handleInteraction, { once: true })
    document.addEventListener('touchstart', handleInteraction, { once: true })
    document.addEventListener('mousemove', handleInteraction, { once: true })
    document.addEventListener('scroll', handleInteraction, { once: true })
    
    return () => {
      audioManager.current?.dispose()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('mousemove', handleInteraction)
      document.removeEventListener('scroll', handleInteraction)
    }
  }, [prefersReducedMotion])

  // Handle reduced motion preference
  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete()
    }
  }, [prefersReducedMotion, onComplete])

  // Light flicker effect
  useEffect(() => {
    if (prefersReducedMotion || phase === 'complete') return
    
    const flicker = () => {
      // Random subtle flicker
      setLightFlicker(0.85 + Math.random() * 0.3)
    }
    
    // Occasional flicker
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        flicker()
        setTimeout(() => setLightFlicker(1), 50 + Math.random() * 100)
      }
    }, 500)
    
    return () => clearInterval(interval)
  }, [prefersReducedMotion, phase])

  // Camera shake effect - reduced on mobile
  useEffect(() => {
    if (prefersReducedMotion || phase === 'complete') return
    
    // Disable camera shake on mobile for performance and less distraction
    if (isMobile) {
      setCameraShake({ x: 0, y: 0 })
      return
    }
    
    let frameId: number
    const shake = () => {
      // Very subtle camera shake
      const intensity = 0.5
      setCameraShake({
        x: (Math.random() - 0.5) * intensity,
        y: (Math.random() - 0.5) * intensity
      })
      frameId = requestAnimationFrame(shake)
    }
    
    frameId = requestAnimationFrame(shake)
    return () => cancelAnimationFrame(frameId)
  }, [prefersReducedMotion, phase, isMobile])

  // Screen tear glitch effect at key moments
  useEffect(() => {
    if (prefersReducedMotion || phase !== 'walking') return
    
    // Trigger screen tear when text appears and disappears
    const tearTimers: ReturnType<typeof setTimeout>[] = []
    
    const triggerTear = () => {
      setScreenTear(true)
      audioManager.current?.playGlitchSound()
      tearTimers.push(setTimeout(() => setScreenTear(false), 100 + Math.random() * 150))
    }
    
    // Random tears during walk
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        triggerTear()
      }
    }, 800)
    
    return () => {
      clearInterval(interval)
      tearTimers.forEach(t => clearTimeout(t))
    }
  }, [prefersReducedMotion, phase])

  // Particle system - dust motes and digital fragments
  useEffect(() => {
    if (prefersReducedMotion || phase === 'complete') return
    
    const canvas = particleCanvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    let animationFrameId: number
    let localParticles: Particle[] = []
    
    // Spawn new particles
    const spawnParticle = (type: 'dust' | 'digital') => {
      const id = particleIdCounter.current++
      const particle: Particle = {
        id,
        x: type === 'dust' 
          ? canvas.width * 0.35 + Math.random() * canvas.width * 0.3 // Doorway area
          : Math.random() * canvas.width,
        y: type === 'dust'
          ? canvas.height * 0.1 + Math.random() * canvas.height * 0.4
          : Math.random() * canvas.height,
        size: type === 'dust' ? 1 + Math.random() * 2 : 2 + Math.random() * 4,
        opacity: 0.1 + Math.random() * 0.4,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: type === 'dust' ? 0.1 + Math.random() * 0.3 : (Math.random() - 0.5) * 0.8,
        life: 0,
        maxLife: 100 + Math.random() * 200,
        type
      }
      localParticles.push(particle)
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Spawn new particles - fewer on mobile for performance
      const maxParticles = isMobile ? 25 : 60
      const spawnChance = isMobile ? 0.15 : 0.3
      
      if (localParticles.length < maxParticles && Math.random() < spawnChance) {
        spawnParticle(Math.random() < 0.7 ? 'dust' : 'digital')
      }
      
      // Update and draw particles
      localParticles = localParticles.filter(p => {
        p.life++
        p.x += p.speedX
        p.y += p.speedY
        
        // Fade based on life
        const lifeRatio = p.life / p.maxLife
        const currentOpacity = p.opacity * (1 - lifeRatio) * lightFlicker
        
        if (p.life >= p.maxLife || currentOpacity < 0.01) {
          return false
        }
        
        ctx.save()
        
        if (p.type === 'dust') {
          // Dust motes - soft white circles
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`)
          gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Digital fragments - white rectangles
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
          ctx.fillRect(p.x, p.y, p.size * 0.3, p.size)
          
          // Occasional character
          if (Math.random() < 0.02) {
            ctx.font = `${p.size * 2}px monospace`
            ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), p.x, p.y)
          }
        }
        
        ctx.restore()
        return true
      })
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [prefersReducedMotion, phase, lightFlicker, isMobile])

  // Load the Lottie animation with preload consideration
  useEffect(() => {
    const controller = new AbortController()
    
    fetch('/animations/cat-walk.json', { signal: controller.signal })
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(() => {
        // Fallback if animation fails to load
        console.log('Cat animation not found, using fallback')
      })

    return () => controller.abort()
  }, [])

  // Main animation sequence
  useEffect(() => {
    if (prefersReducedMotion) return

    // Phase 1: Intro (room reveals)
    const introTimer = setTimeout(() => {
      setPhase('walking')
      audioManager.current?.startFootsteps()
    }, TIMING.catEnter * 1000)

    return () => clearTimeout(introTimer)
  }, [prefersReducedMotion])

  // Cat walking animation with spring-like easing + ghost cat delay
  useEffect(() => {
    if (phase !== 'walking') return

    const startTime = Date.now()
    const duration = TIMING.catWalkDuration * 1000
    let frameId: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      const rawProgress = Math.min(elapsed / duration, 1)
      
      // Custom spring-like easing for organic movement
      const springEase = (t: number) => {
        const c4 = (2 * Math.PI) / 3
        return t === 0 ? 0 : t === 1 ? 1 : 
          t < 0.5 
            ? (1 - Math.pow(2, -10 * t * 2) * Math.cos((t * 2 * 10 - 0.75) * c4)) / 2
            : (1 + Math.pow(2, -10 * (t * 2 - 1)) * Math.cos(((t * 2 - 1) * 10 - 0.75) * c4)) / 2
      }
      
      // Smoother ease-in-out with slight overshoot feel
      const easeProgress = rawProgress < 0.5
        ? 4 * rawProgress * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2

      setCatProgress(easeProgress)
      
      // Ghost cat follows behind with delay
      const ghostRaw = Math.max(0, rawProgress - TIMING.ghostCatDelay)
      const ghostEase = ghostRaw < 0.5
        ? 4 * ghostRaw * ghostRaw * ghostRaw
        : 1 - Math.pow(-2 * ghostRaw + 2, 3) / 2
      setGhostCatProgress(ghostEase)
      
      // Update spatial audio panning
      audioManager.current?.updateCatPosition(easeProgress)
      
      // Intensify ambient based on door proximity (peaks at center)
      const doorProximity = 1 - Math.abs(easeProgress - 0.5) * 2
      audioManager.current?.intensifyAmbient(doorProximity)

      if (rawProgress < 1) {
        frameId = requestAnimationFrame(animate)
      } else {
        audioManager.current?.stopFootsteps()
        setPhase('fadeout')
        setTimeout(() => {
          audioManager.current?.dispose()
          setPhase('complete')
          onComplete()
        }, TIMING.fadeOutDuration * 1000)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frameId)
      audioManager.current?.stopFootsteps()
    }
  }, [phase, onComplete])

  // Calculate cat position and effects based on progress
  const catPosition = -15 + catProgress * 130 // -15% to 115%
  const ghostCatPosition = -15 + ghostCatProgress * 130 // Ghost follows behind
  const catScale = 1 - Math.abs(catProgress * 100 - 50) * 0.001
  const ghostCatScale = 1 - Math.abs(ghostCatProgress * 100 - 50) * 0.001
  const showText = catProgress > 0.2 && catProgress < 0.8
  const showGhostCat = ghostCatProgress > 0 && ghostCatProgress < 0.95 && phase === 'walking' && !isSmallScreen // Hide ghost on very small screens
  const doorwayIntensity = 0.5 + Math.sin(catProgress * Math.PI) * 0.5 // Peaks at center
  const cableSwayIntensity = catProgress > 0.5 ? (catProgress - 0.5) * 2 : 0 // Sways when cat passes
  
  // Responsive positioning
  const catBottomPosition = isSmallScreen ? '32%' : '36%'
  const textTopPosition = isSmallScreen ? '8%' : '12%'

  // Don't render if reduced motion is preferred
  if (prefersReducedMotion) return null

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden touch-none" 
      style={{ 
        perspective: isSmallScreen ? '800px' : '1200px',
        transform: `translate(${cameraShake.x}px, ${cameraShake.y}px)`
      }}
    >
      {/* Particle canvas - dust motes and digital fragments */}
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 pointer-events-none z-[45]"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Screen tear effect overlay */}
      {screenTear && (
        <div className="absolute inset-0 z-[55] pointer-events-none">
          {/* Horizontal tear lines */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0"
              style={{
                top: `${20 + i * 25 + Math.random() * 10}%`,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), rgba(200,200,200,0.5), transparent)',
                transform: `translateX(${(Math.random() - 0.5) * 20}px)`,
              }}
            />
          ))}
          {/* Static burst */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }}
          />
        </div>
      )}
      {/* Skip button for accessibility - larger touch target on mobile */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={handleSkip}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[60] 
                   px-3 py-2 sm:px-4 sm:py-2 
                   font-mono text-xs sm:text-sm text-white/70 
                   border border-white/30 rounded backdrop-blur-sm
                   hover:text-white hover:border-white/60 hover:bg-white/10
                   active:bg-white/20
                   transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50
                   min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Skip cutscene"
      >
        Skip →
      </motion.button>



      {/* Deep background - staged reveal */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#0a0a0a]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: TIMING.backgroundFade }}
      />
      
      {/* 3D Room container - staged reveal */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: TIMING.roomReveal, ease: "easeOut" }}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: 'translateZ(-100px)',
          willChange: 'transform, opacity'
        }}
      >
        {/* Back wall with doorway */}
        <div 
          className="absolute left-[10%] right-[10%] top-[5%] h-[55%]"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(-200px) scale(0.7)',
            transformOrigin: 'center bottom'
          }}
        >
          {/* Wall panels - left - monochrome gray */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-[25%]"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 50%, #080808 100%)',
              boxShadow: 'inset -10px 0 30px rgba(0,0,0,0.3)',
              borderRight: '3px solid #2a2a2a'
            }}
          >
            {/* Wall texture */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)'
            }} />
          </div>
          
          {/* Wall panels - right - monochrome gray */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-[25%]"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 50%, #080808 100%)',
              boxShadow: 'inset 10px 0 30px rgba(0,0,0,0.3)',
              borderLeft: '3px solid #2a2a2a'
            }}
          >
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)'
            }} />
          </div>
          
          {/* Doorway opening - with dynamic glow based on cat position */}
          <motion.div 
            className="absolute left-[25%] right-[25%] top-0 bottom-0"
            animate={{
              boxShadow: `inset 0 0 ${100 + doorwayIntensity * 50}px rgba(255,255,255,${0.1 + doorwayIntensity * 0.1})`
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'radial-gradient(ellipse at center 30%, #151515 0%, #0a0a0a 50%, #030303 100%)',
              filter: `brightness(${lightFlicker})`
            }}
          >
            {/* Door frame */}
            <div className="absolute inset-0 border-4 border-[#1a1a1a]" style={{ 
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' 
            }} />
            
            {/* White glow from within - intensifies as cat passes */}
            <motion.div 
              className="absolute inset-[10%] rounded-full"
              animate={{ 
                opacity: (0.3 + doorwayIntensity * 0.4) * lightFlicker,
                scale: 1 + doorwayIntensity * 0.15
              }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(200,200,200,0.08) 50%, transparent 70%)',
              }}
            />
            
            {/* Volumetric light rays from doorway */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ opacity: doorwayIntensity * 0.6 * lightFlicker }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0"
                  style={{
                    left: `${20 + i * 15}%`,
                    width: '2px',
                    height: '150%',
                    background: `linear-gradient(to bottom, transparent, rgba(255,255,255,${0.1 + i * 0.02}), transparent)`,
                    transformOrigin: 'bottom center',
                    transform: `rotate(${-20 + i * 10}deg)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Left wall - 3D perspective - monochrome gray */}
        <div 
          className="absolute left-0 top-[5%] bottom-[40%] w-[20%]"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateY(75deg)',
            transformOrigin: 'left center',
            background: 'linear-gradient(90deg, #0a0a0a 0%, #121212 50%, #181818 100%)',
            boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.4)'
          }}
        >
          {/* Wall molding */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#222222] to-[#181818]" />
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#222222] to-[#181818]" />
        </div>

        {/* Right wall - 3D perspective - monochrome gray */}
        <div 
          className="absolute right-0 top-[5%] bottom-[40%] w-[20%]"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateY(-75deg)',
            transformOrigin: 'right center',
            background: 'linear-gradient(-90deg, #0a0a0a 0%, #121212 50%, #181818 100%)',
            boxShadow: 'inset 20px 0 40px rgba(0,0,0,0.4)'
          }}
        >
          {/* Cables hanging - white/gray, with dynamic sway */}
          <motion.div 
            className="absolute right-[20%] top-[10%] w-3 h-[60%]"
            animate={{ 
              rotate: cableSwayIntensity * 8,
              x: cableSwayIntensity * 3 
            }}
            transition={springs.gentle}
            style={{ transformOrigin: 'top center' }}
          >
            <div className="w-full h-full bg-gradient-to-b from-[#ffffff] via-[#aaaaaa] to-[#666666] rounded-full opacity-80" 
                 style={{ boxShadow: '0 0 15px rgba(255,255,255,0.3)' }} />
          </motion.div>
          <motion.div 
            className="absolute right-[35%] top-[15%] w-2 h-[50%]"
            animate={{ 
              rotate: cableSwayIntensity * -6,
              x: cableSwayIntensity * -2 
            }}
            transition={{ ...springs.gentle, delay: 0.1 }}
            style={{ transformOrigin: 'top center' }}
          >
            <div className="w-full h-full bg-gradient-to-b from-[#cccccc] via-[#888888] to-[#444444] rounded-full opacity-80"
                 style={{ boxShadow: '0 0 15px rgba(255,255,255,0.2)' }} />
          </motion.div>
          <motion.div 
            className="absolute right-[50%] top-[20%] w-2 h-[40%]"
            animate={{ 
              rotate: cableSwayIntensity * 5,
              x: cableSwayIntensity * 2 
            }}
            transition={{ ...springs.gentle, delay: 0.2 }}
            style={{ transformOrigin: 'top center' }}
          >
            <div className="w-full h-full bg-gradient-to-b from-[#dddddd] via-[#999999] to-[#555555] rounded-full opacity-70" />
          </motion.div>
          
          {/* Wall molding */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#222222] to-[#181818]" />
        </div>
      </motion.div>

      {/* 3D Checkered floor - staged reveal with perspective animation */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[50%]"
        initial={{ opacity: 0, rotateX: 60 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.8, delay: TIMING.floorReveal, ease: "easeOut" }}
        style={{ 
          perspective: '800px',
          perspectiveOrigin: '50% 0%',
          willChange: 'transform, opacity'
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            transform: 'rotateX(75deg) translateZ(0px)',
            transformOrigin: 'center top',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Main checkered pattern - monochrome */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                repeating-conic-gradient(
                  from 0deg at 60px 60px,
                  #1a1a1a 0deg 90deg,
                  #0a0a0a 90deg 180deg
                )
              `,
              backgroundSize: '120px 120px',
            }}
          />
          
          {/* Floor shine/reflection - white tint */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(200,200,200,0.03) 30%, transparent 70%, rgba(0,0,0,0.3) 100%)'
            }}
          />
          
          {/* Grid lines for depth - white */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(0deg, rgba(255,255,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />

          {/* Dynamic floor pulse following cat */}
          <motion.div 
            className="absolute pointer-events-none"
            animate={{
              left: `${catPosition - 10}%`,
              opacity: phase === 'walking' ? 0.4 : 0
            }}
            transition={{ duration: 0.1 }}
            style={{
              width: '20%',
              height: '100%',
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 60%)',
              filter: 'blur(20px)'
            }}
          />
        </div>
        
        {/* Floor edge shadow - softer */}
        <div 
          className="absolute top-0 left-0 right-0 h-24"
          style={{
            background: 'linear-gradient(180deg, rgba(5,5,5,0.8) 0%, transparent 100%)'
          }}
        />
      </motion.div>

      {/* Ambient lighting from above - makes scene brighter */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.05) 0%, transparent 60%)'
        }}
      />

      {/* Ambient fog/atmosphere - gray */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 70%, rgba(150,150,150,0.06) 0%, transparent 50%)'
        }}
      />

      {/* Volumetric light from doorway - dynamic intensity with light rays */}
      <motion.div 
        className="absolute left-[30%] right-[30%] top-[20%] bottom-[40%] pointer-events-none"
        animate={{
          opacity: (0.5 + doorwayIntensity * 0.5) * lightFlicker
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 50%, rgba(200,200,200,0.06) 100%)',
          clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)'
        }}
      >
        {/* Dust particles visible in light beam */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at ${50 + Math.sin(Date.now() / 1000) * 10}% ${30 + Math.cos(Date.now() / 800) * 10}%, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }} />
      </motion.div>

      {/* Spotlight on floor where cat walks - follows cat */}
      <motion.div 
        className="absolute bottom-[30%] h-[20%] pointer-events-none"
        animate={{
          left: `${Math.max(0, catPosition - 20)}%`,
          right: `${Math.max(0, 100 - catPosition - 20)}%`,
        }}
        transition={{ duration: 0.1 }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(200,200,200,0.04) 40%, transparent 70%)'
        }}
      />

      {/* Scanline CRT effect - white tinted */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.1) 1px, rgba(255, 255, 255, 0.1) 2px)',
            backgroundSize: '100% 3px'
          }}
        />
      </div>

      {/* Digital noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          filter: 'contrast(200%) brightness(150%)'
        }}
      />

      {/* Ghost Cat - Déjà vu effect - semi-transparent duplicate following behind */}
      <AnimatePresence>
        {showGhostCat && (
          <motion.div
            className="absolute pointer-events-none"
            initial={{ opacity: 0, x: '-50%' }}
            animate={{ 
              opacity: 0.35,
              x: '-50%'
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              left: `${ghostCatPosition}%`,
              bottom: catBottomPosition,
              transform: `translateX(-50%) scale(${ghostCatScale})`,
              transformStyle: 'preserve-3d',
              filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5)) blur(1px) hue-rotate(10deg)',
              willChange: 'transform, left',
              mixBlendMode: 'screen'
            }}
          >
            {/* Ghost Lottie Cat Animation */}
            {memoizedAnimationData ? (
              <div className="w-48 h-28 md:w-64 md:h-36 lg:w-80 lg:h-44">
                <Lottie
                  animationData={memoizedAnimationData}
                  loop
                  autoplay
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    filter: 'brightness(0.7) saturate(0) drop-shadow(0 0 15px rgba(255,255,255,0.4))',
                    opacity: 0.6
                  }}
                />
              </div>
            ) : (
              /* Ghost fallback silhouette */
              <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-56 md:h-32 lg:w-72 lg:h-40 relative opacity-40">
                <svg viewBox="0 0 200 100" className="w-full h-full" style={{ filter: 'blur(2px)' }}>
                  <g fill="rgba(255,255,255,0.3)">
                    <ellipse cx="100" cy="55" rx="45" ry="22" />
                    <circle cx="145" cy="40" r="20" />
                    <polygon points="130,22 138,5 146,22" />
                    <polygon points="148,20 156,3 164,20" />
                    <ellipse cx="125" cy="48" rx="15" ry="18" />
                  </g>
                </svg>
              </div>
            )}
            
            {/* Ghost glow trail */}
            <div 
              className="absolute inset-0 -z-10 blur-2xl opacity-50"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.25) 0%, transparent 70%)',
                transform: 'scale(1.5)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Black Cat - with GPU-optimized transforms */}
      <AnimatePresence>
        {phase !== 'complete' && (
          <motion.div
            className="absolute"
            initial={{ opacity: 0, x: '-50%' }}
            animate={{ 
              opacity: phase === 'fadeout' ? 0 : 1,
              x: '-50%'
            }}
            transition={{ duration: 0.5 }}
            style={{
              left: `${catPosition}%`,
              bottom: catBottomPosition,
              transform: `translateX(-50%) scale(${catScale})`,
              transformStyle: 'preserve-3d',
              filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(255,255,255,0.2))',
              willChange: 'transform, left'
            }}
          >
            {/* Lottie Cat Animation */}
            {memoizedAnimationData ? (
              <div className="w-36 h-22 sm:w-44 sm:h-26 md:w-60 md:h-34 lg:w-76 lg:h-42">
                <Lottie
                  animationData={memoizedAnimationData}
                  loop
                  autoplay
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    filter: 'brightness(1.2) saturate(0.3) drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                  }}
                />
              </div>
            ) : (
              /* Fallback: Simple CSS animated cat silhouette */
              <div className="w-36 h-22 sm:w-44 sm:h-26 md:w-60 md:h-34 lg:w-76 lg:h-42 relative">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  {/* Simple elegant cat silhouette */}
                  <defs>
                    <filter id="catGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Cat body silhouette */}
                  <g fill="#1a1a1a" className={phase === 'walking' ? 'animate-walk' : ''}>
                    {/* Body */}
                    <ellipse cx="100" cy="55" rx="45" ry="22" />
                    {/* Head */}
                    <circle cx="145" cy="40" r="20" />
                    {/* Ears */}
                    <polygon points="130,22 138,5 146,22" />
                    <polygon points="148,20 156,3 164,20" />
                    {/* Neck */}
                    <ellipse cx="125" cy="48" rx="15" ry="18" />
                    {/* Tail */}
                    <path 
                      d="M 55 50 Q 25 40 30 15 Q 33 5 38 10" 
                      stroke="#1a1a1a" 
                      strokeWidth="7" 
                      strokeLinecap="round" 
                      fill="none"
                      className="animate-tail"
                    />
                    {/* Front legs */}
                    <rect x="125" y="65" width="8" height="25" rx="4" className="animate-front-leg" />
                    <rect x="138" y="65" width="8" height="23" rx="4" className="animate-front-leg-alt" />
                    {/* Back legs */}
                    <rect x="65" y="65" width="9" height="26" rx="4" className="animate-back-leg" />
                    <rect x="78" y="65" width="8" height="24" rx="4" className="animate-back-leg-alt" />
                  </g>
                  
                  {/* Glowing eyes */}
                  <g filter="url(#catGlow)">
                    <ellipse cx="140" cy="38" rx="4" ry="5" fill="#ffffff">
                      <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                    </ellipse>
                    <ellipse cx="152" cy="38" rx="4" ry="5" fill="#ffffff">
                      <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                    </ellipse>
                  </g>
                  
                  {/* Eye glow rings */}
                  <ellipse cx="140" cy="38" rx="7" ry="8" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
                  <ellipse cx="152" cy="38" rx="7" ry="8" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
                  
                  {/* Rim light outline */}
                  <ellipse cx="100" cy="55" rx="46" ry="23" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
                  <circle cx="145" cy="40" r="21" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
                  
                  {/* Shadow */}
                  <ellipse cx="100" cy="92" rx="55" ry="5" fill="rgba(0,0,0,0.5)" style={{ filter: 'blur(3px)' }} />
                </svg>
              </div>
            )}
            
            {/* Additional glow effect behind cat */}
            <div 
              className="absolute inset-0 -z-10 blur-xl opacity-30"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, transparent 70%)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Déjà vu" text - enhanced glitch effect with chromatic aberration and screen tear */}
      <AnimatePresence>
        {showText && phase === 'walking' && (
          <motion.div
            className="absolute left-1/2 font-mono text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] px-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ x: '-50%', top: textTopPosition }}
          >
            {/* Scan line overlay on text */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            
            {/* Chromatic aberration layers - grayscale */}
            <motion.span
              className="absolute inset-0 text-gray-300/60"
              animate={{
                x: [0, -3, 3, -2, 1, 0],
                y: [0, 1, -1, 0],
                opacity: [0.5, 0.9, 0.4, 0.8, 0.5],
                clipPath: screenTear 
                  ? [`inset(0 0 50% 0)`, `inset(50% 0 0 0)`, `inset(0)`]
                  : 'inset(0)'
              }}
              transition={{ duration: 0.12, repeat: Infinity, repeatType: "reverse" }}
              style={{ mixBlendMode: 'screen' }}
            >
              {"// déjà vu..."}
            </motion.span>
            <motion.span
              className="absolute inset-0 text-gray-400/60"
              animate={{
                x: [0, 3, -3, 2, -1, 0],
                y: [0, -1, 1, 0],
                opacity: [0.5, 0.8, 0.5, 0.9, 0.5]
              }}
              transition={{ duration: 0.12, repeat: Infinity, repeatType: "reverse", delay: 0.03 }}
              style={{ mixBlendMode: 'screen' }}
            >
              {"// déjà vu..."}
            </motion.span>
            <motion.span
              className="absolute inset-0 text-gray-500/30"
              animate={{
                x: [0, 1, -1, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 0.15, repeat: Infinity }}
              style={{ mixBlendMode: 'screen' }}
            >
              {"// déjà vu..."}
            </motion.span>
            
            {/* Main text with glitch */}
            <motion.span
              className="relative"
              animate={{
                x: [0, -2, 1, -1, 2, 0],
                y: [0, 1, -1, 1, -1, 0],
                skewX: screenTear ? [0, 2, -2, 0] : 0,
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
              style={{
                color: '#ffffff',
                textShadow: `
                  0 0 10px #ffffff, 
                  0 0 20px #ffffff, 
                  0 0 30px #aaaaaa, 
                  2px 0 #888888, 
                  -2px 0 #ffffff,
                  0 0 40px rgba(255,255,255,0.5)
                `,
              }}
            >
              {"// déjà vu..."}
            </motion.span>
            
            {/* Flicker/interference burst */}
            <motion.div
              className="absolute inset-0 bg-white/10 pointer-events-none"
              animate={{
                opacity: [0, 0, 0, 0.3, 0, 0, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette for depth - matches landing page */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(5, 5, 5, 0.7) 100%)'
        }}
      />

      {/* Ambient occlusion - darker corners and edges */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 200px 50px rgba(0,0,0,0.5)',
        }}
      />

      {/* CRT curvature effect - subtle */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.15) 100%)',
        }}
      />

      {/* Depth of field blur at edges */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: 'blur(0px)',
          mask: 'radial-gradient(ellipse at center, transparent 70%, black 100%)',
          WebkitMask: 'radial-gradient(ellipse at center, transparent 70%, black 100%)',
        }}
      />

      {/* Fade out overlay - enhanced with scale and blur */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: phase === 'fadeout' ? 1 : 0,
          scale: phase === 'fadeout' ? 1.05 : 1,
          filter: phase === 'fadeout' ? 'blur(8px)' : 'blur(0px)'
        }}
        transition={{ duration: TIMING.fadeOutDuration, ease: "easeInOut" }}
        style={{ backgroundColor: '#050010' }}
      />

      <style jsx>{`
        .animate-tail {
          transform-origin: 55px 50px;
          animation: tailWag 0.8s ease-in-out infinite;
        }
        
        .animate-front-leg {
          transform-origin: 129px 65px;
          animation: frontLeg 0.3s ease-in-out infinite;
        }
        
        .animate-front-leg-alt {
          transform-origin: 142px 65px;
          animation: frontLegAlt 0.3s ease-in-out infinite;
        }
        
        .animate-back-leg {
          transform-origin: 69px 65px;
          animation: backLeg 0.3s ease-in-out infinite;
        }
        
        .animate-back-leg-alt {
          transform-origin: 82px 65px;
          animation: backLegAlt 0.3s ease-in-out infinite;
        }
        
        @keyframes tailWag {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes frontLeg {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(12deg); }
        }
        
        @keyframes frontLegAlt {
          0%, 100% { transform: rotate(12deg); }
          50% { transform: rotate(-12deg); }
        }
        
        @keyframes backLeg {
          0%, 100% { transform: rotate(10deg); }
          50% { transform: rotate(-10deg); }
        }
        
        @keyframes backLegAlt {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  )
}
