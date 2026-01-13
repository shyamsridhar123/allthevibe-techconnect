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

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?"
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)

    // Initialize drops
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    // Color gradient positions for each column
    const colorPositions: number[] = []
    for (let i = 0; i < columns; i++) {
      colorPositions[i] = Math.random()
    }

    function draw() {
      if (!ctx || !canvas) return

      // Fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)]

        // Gradient from cyan to purple
        const gradientPosition = (colorPositions[i] + Date.now() * 0.00005) % 1
        const r = Math.floor(0 + gradientPosition * 255)
        const g = Math.floor(255 - gradientPosition * 255)
        const b = Math.floor(255)

        // Brighter at the head of the drop
        const alpha = drops[i] > 0 ? 1 : 0
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`

        ctx.font = `${fontSize}px monospace`
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 35)

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
