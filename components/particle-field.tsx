"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface ParticleFieldProps {
  count?: number
  color?: string
  size?: number
}

export default function ParticleField({ 
  count = 1500, 
  color = "#00ffff",
  size = 0.015
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const { pointer } = useThree()

  // Generate particle positions in a spherical volume
  const { positions, velocities, originalPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const originalPositions = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Spread particles in a large sphere
      const radius = 8 + Math.random() * 12
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi) - 5 // Offset back
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      
      originalPositions[i * 3] = x
      originalPositions[i * 3 + 1] = y
      originalPositions[i * 3 + 2] = z
      
      // Random velocities for subtle movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.002
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001
    }
    
    return { positions, velocities, originalPositions }
  }, [count])

  // Generate random sizes for each particle
  const sizes = useMemo(() => {
    const sizesArray = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      sizesArray[i] = size * (0.5 + Math.random() * 1.5)
    }
    return sizesArray
  }, [count, size])

  // Animate particles
  useFrame((state) => {
    if (!pointsRef.current) return
    
    const geometry = pointsRef.current.geometry
    const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute
    const positions = positionAttr.array as Float32Array
    const time = state.clock.getElapsedTime()
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Wave motion based on original position and time
      const ox = originalPositions[i3]
      const oy = originalPositions[i3 + 1]
      const oz = originalPositions[i3 + 2]
      
      // Gentle wave animation
      positions[i3] = ox + Math.sin(time * 0.3 + oy * 0.5) * 0.2
      positions[i3 + 1] = oy + Math.cos(time * 0.2 + ox * 0.3) * 0.3
      positions[i3 + 2] = oz + Math.sin(time * 0.25 + ox * 0.2) * 0.15
      
      // Mouse influence - particles gently pushed away from mouse
      const mouseX = pointer.x * 8
      const mouseY = pointer.y * 6
      
      const dx = positions[i3] - mouseX
      const dy = positions[i3 + 1] - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 3) {
        const force = (3 - dist) * 0.02
        positions[i3] += (dx / dist) * force
        positions[i3 + 1] += (dy / dist) * force
      }
    }
    
    positionAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Secondary layer with different color for depth
export function ParticleFieldPurple() {
  return <ParticleField count={800} color="#a855f7" size={0.012} />
}
