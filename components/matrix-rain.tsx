"use client"

import { useEffect, useRef, useState } from "react"

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [overdrive, setOverdrive] = useState(false)

  // Listen for Matrix overdrive easter egg event
  useEffect(() => {
    const handleOverdrive = (e: CustomEvent<{ active: boolean }>) => {
      setOverdrive(e.detail.active)
    }

    window.addEventListener('matrixOverdrive', handleOverdrive as EventListener)
    return () => {
      window.removeEventListener('matrixOverdrive', handleOverdrive as EventListener)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Classic Matrix green for overdrive mode, otherwise monochrome
    const normalCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789αβγδεζηθικλμνξοπρστυφχψωΣΦΨΩ@#$%^&*"
    const matrixCharacters = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789"
    
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)

    // Initialize drops with random starting positions
    const drops: number[] = []
    const speeds: number[] = []
    const opacities: number[] = []
    const brightness: number[] = [] // Grayscale brightness variation
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50 - 10
      speeds[i] = Math.random() * 0.5 + 0.3
      opacities[i] = Math.random() * 0.4 + 0.2
      brightness[i] = Math.random() * 40 + 60 // Range from 60% to 100% brightness
    }

    // Trail lengths for each column
    const trailLengths: number[] = []
    for (let i = 0; i < columns; i++) {
      trailLengths[i] = Math.floor(Math.random() * 15) + 8
    }

    // Highlight tracking - which characters are currently highlighted
    // Key: "col-row", Value: brightness multiplier (fades from 1 to 0)
    const highlights: Map<string, number> = new Map()

    function draw() {
      if (!ctx || !canvas) return

      // Dark fade effect - pure black
      ctx.fillStyle = overdrive ? "rgba(0, 0, 0, 0.05)" : "rgba(5, 0, 16, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px "Courier New", monospace`
      
      // Choose character set based on mode
      const characters = overdrive ? matrixCharacters : normalCharacters

      // Fade existing highlights
      highlights.forEach((value, key) => {
        const newValue = value - 0.03
        if (newValue <= 0) {
          highlights.delete(key)
        } else {
          highlights.set(key, newValue)
        }
      })

      for (let i = 0; i < drops.length; i++) {
        // Draw multiple characters for trail effect
        const trailLength = trailLengths[i]
        
        // Speed multiplier for overdrive mode
        const speedMultiplier = overdrive ? 3 : 1
        
        for (let j = 0; j < trailLength; j++) {
          const y = (drops[i] - j) * fontSize
          if (y < 0 || y > canvas.height) continue

          const text = characters[Math.floor(Math.random() * characters.length)]
          const row = Math.floor(y / fontSize)
          const key = `${i}-${row}`
          
          // Randomly highlight characters (low chance per frame)
          if (Math.random() < 0.003 && !highlights.has(key)) {
            highlights.set(key, 1)
          }
          
          // Check if this character is highlighted
          const highlightIntensity = highlights.get(key) || 0
          
          // Calculate opacity based on position in trail
          const trailOpacity = (1 - j / trailLength) * opacities[i] * (overdrive ? 1.5 : 1)
          
          if (overdrive) {
            // Classic Matrix green in overdrive mode
            const greenIntensity = j === 0 ? 255 : Math.max(100, 255 - j * 15)
            if (highlightIntensity > 0) {
              // Highlighted: boost to bright white-green
              const boost = highlightIntensity
              ctx.fillStyle = `rgba(${Math.floor(200 * boost)}, 255, ${Math.floor(200 * boost)}, ${Math.min(1, trailOpacity + boost * 0.5)})`
            } else {
              ctx.fillStyle = `rgba(0, ${greenIntensity}, 0, ${Math.min(1, trailOpacity)})`
            }
          } else {
            // Monochrome - white/gray based on brightness and trail position
            const baseBrightness = brightness[i]
            const lightness = j === 0 ? baseBrightness : baseBrightness - (j * 3)
            if (highlightIntensity > 0) {
              // Highlighted: boost to full white
              const boostedLightness = lightness + (100 - lightness) * highlightIntensity
              const boostedOpacity = trailOpacity + (1 - trailOpacity) * highlightIntensity * 0.6
              ctx.fillStyle = `hsla(0, 0%, ${Math.min(100, boostedLightness)}%, ${boostedOpacity})`
            } else {
              ctx.fillStyle = `hsla(0, 0%, ${Math.max(20, lightness)}%, ${trailOpacity})`
            }
          }
          
          ctx.fillText(text, i * fontSize, y)
        }

        // Move drop down - faster in overdrive
        drops[i] += speeds[i] * speedMultiplier

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height + trailLength * fontSize) {
          const resetChance = overdrive ? 0.9 : 0.98
          if (Math.random() > resetChance) {
            drops[i] = Math.random() * -20
            speeds[i] = Math.random() * 0.5 + 0.3
            opacities[i] = Math.random() * 0.4 + 0.2
            brightness[i] = Math.random() * 40 + 60
          }
        }
      }
    }

    const interval = setInterval(draw, overdrive ? 20 : 40)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [overdrive])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}
