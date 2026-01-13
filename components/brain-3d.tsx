"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Line } from "@react-three/drei"
import type * as THREE from "three"

function NeuralGlobe() {
  const globeRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
    }
  })

  // Generate nodes distributed on a sphere using fibonacci spiral
  const nodes = useMemo(() => {
    const points: [number, number, number][] = []
    const numPoints = 60
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    
    for (let i = 0; i < numPoints; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints)
      
      const x = Math.sin(phi) * Math.cos(theta) * 0.9
      const y = Math.sin(phi) * Math.sin(theta) * 0.9
      const z = Math.cos(phi) * 0.9
      
      points.push([x, y, z])
    }
    
    return points
  }, [])

  // Create connections between nearby nodes
  const connections = useMemo(() => {
    const conns: [number, number][] = []
    const maxDistance = 0.65
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i][0] - nodes[j][0]
        const dy = nodes[i][1] - nodes[j][1]
        const dz = nodes[i][2] - nodes[j][2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        if (distance < maxDistance) {
          conns.push([i, j])
        }
      }
    }
    
    return conns
  }, [nodes])

  return (
    <group ref={globeRef}>
      {/* Outer glass sphere */}
      <Sphere args={[1.15, 64, 64]}>
        <meshPhysicalMaterial
          color="#0a4a5a"
          transparent
          opacity={0.1}
          roughness={0.1}
          metalness={0}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
        />
      </Sphere>

      {/* Wireframe sphere - outer ring */}
      <Sphere args={[1.15, 32, 32]}>
        <meshBasicMaterial 
          color="#00aaaa" 
          wireframe 
          transparent 
          opacity={0.12} 
        />
      </Sphere>
      
      {/* Inner wireframe sphere */}
      <Sphere args={[1.1, 24, 24]}>
        <meshBasicMaterial 
          color="#00dddd" 
          wireframe 
          transparent 
          opacity={0.06} 
        />
      </Sphere>

      {/* Neural nodes - glowing points on sphere surface */}
      {nodes.map((position, i) => (
        <group key={i} position={position}>
          {/* Core bright node */}
          <Sphere args={[0.035, 12, 12]}>
            <meshBasicMaterial color="#c0ffff" />
          </Sphere>
          {/* Inner glow */}
          <Sphere args={[0.055, 10, 10]}>
            <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
          </Sphere>
          {/* Outer soft glow */}
          <Sphere args={[0.08, 8, 8]}>
            <meshBasicMaterial color="#00ffff" transparent opacity={0.2} />
          </Sphere>
        </group>
      ))}

      {/* Neural connection lines */}
      {connections.map(([start, end], i) => (
        <Line
          key={i}
          points={[nodes[start], nodes[end]]}
          color="#00cccc"
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      ))}
    </group>
  )
}

export default function Brain3D() {
  return (
    <div className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] relative">
      {/* Ambient glow behind globe */}
      <div className="absolute inset-0 rounded-full bg-cyan-400/15 blur-3xl scale-125" />
      <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 3]} intensity={0.5} color="#00ffff" />
        <pointLight position={[-3, -2, 2]} intensity={0.3} color="#8b5cf6" />
        <pointLight position={[0, 0, 4]} intensity={0.4} color="#00dddd" />
        <NeuralGlobe />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
