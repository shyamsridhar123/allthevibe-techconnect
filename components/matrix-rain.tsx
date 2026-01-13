"use client"

import { useEffect, useRef } from "react"

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789αβγδεζηθικλμνξοπρστυφχψωΣΦΨΩ@#$%^&*"
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)

    // Initialize drops with random starting positions
    const drops: number[] = []
    const speeds: number[] = []
    const opacities: number[] = []
    const hues: number[] = [] // Color variation per column
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50 - 10
      speeds[i] = Math.random() * 0.5 + 0.3
      opacities[i] = Math.random() * 0.4 + 0.2
      hues[i] = Math.random() * 60 + 180 // Range from cyan (180) to purple (240)
    }

    // Trail lengths for each column
    const trailLengths: number[] = []
    for (let i = 0; i < columns; i++) {
      trailLengths[i] = Math.floor(Math.random() * 15) + 8
    }

    function draw() {
      if (!ctx || !canvas) return

      // Dark fade effect with slight purple tint
      ctx.fillStyle = "rgba(5, 0, 15, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px "Courier New", monospace`

      for (let i = 0; i < drops.length; i++) {
        // Draw multiple characters for trail effect
        const trailLength = trailLengths[i]
        
        for (let j = 0; j < trailLength; j++) {
          const y = (drops[i] - j) * fontSize
          if (y < 0 || y > canvas.height) continue

          const text = characters[Math.floor(Math.random() * characters.length)]
          
          // Calculate opacity based on position in trail
          const trailOpacity = (1 - j / trailLength) * opacities[i]
          
          // Color gradient from cyan to purple based on column
          const hue = hues[i]
          const saturation = 100
          const lightness = j === 0 ? 70 : 50 - (j * 2) // Brighter head
          
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${trailOpacity})`
          ctx.fillText(text, i * fontSize, y)
        }

        // Move drop down
        drops[i] += speeds[i]

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height + trailLength * fontSize) {
          if (Math.random() > 0.98) {
            drops[i] = Math.random() * -20
            speeds[i] = Math.random() * 0.5 + 0.3
            opacities[i] = Math.random() * 0.4 + 0.2
            hues[i] = Math.random() * 60 + 180
          }
        }
      }
    }

    const interval = setInterval(draw, 40)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}
