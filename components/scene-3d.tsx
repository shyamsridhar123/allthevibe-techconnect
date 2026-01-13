"use client"

import { useRef, useMemo, useState, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Sphere, Line } from "@react-three/drei"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import * as THREE from "three"

// ============================================
// PARTICLE FIELD COMPONENT
// ============================================
function ParticleField({ count = 1500, color = "#00ffff" }: { count?: number; color?: string }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { pointer } = useThree()
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 2 + Math.random() * 8
      
      temp.push({
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        scale: 0.01 + Math.random() * 0.03,
        speed: 0.1 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
      })
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()

    particles.forEach((particle, i) => {
      const { position, scale, speed, offset } = particle
      
      // Wave motion
      const wave = Math.sin(time * speed + offset) * 0.15
      
      // Mouse influence
      const mouseInfluence = new THREE.Vector3(pointer.x * 0.5, pointer.y * 0.5, 0)
      const distToMouse = position.distanceTo(mouseInfluence.multiplyScalar(3))
      const mouseEffect = Math.max(0, 1 - distToMouse / 4) * 0.3

      dummy.position.set(
        position.x + wave + mouseEffect * pointer.x,
        position.y + wave * 0.5 + mouseEffect * pointer.y,
        position.z + wave * 0.3
      )
      
      // Pulse scale
      const pulseScale = scale * (1 + Math.sin(time * 2 + offset) * 0.3)
      dummy.scale.setScalar(pulseScale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  )
}

// ============================================
// INTERACTIVE NEURAL GLOBE
// ============================================
interface NeuralGlobeProps {
  onNodeHover?: (index: number | null) => void
  onNodeClick?: (index: number) => void
  isActive?: boolean
}

function NeuralGlobe({ onNodeHover, onNodeClick, isActive = true }: NeuralGlobeProps) {
  const globeRef = useRef<THREE.Group>(null)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [pulsingNodes, setPulsingNodes] = useState<Set<number>>(new Set())
  const pulseTimeRef = useRef<{ [key: number]: number }>({})

  useFrame((state) => {
    if (globeRef.current && isActive) {
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

  // Create connections between nearby nodes with neighbor mapping
  const { connections, neighbors } = useMemo(() => {
    const conns: [number, number][] = []
    const neighborMap: Map<number, number[]> = new Map()
    const maxDistance = 0.65
    
    // Initialize neighbor map
    for (let i = 0; i < nodes.length; i++) {
      neighborMap.set(i, [])
    }
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i][0] - nodes[j][0]
        const dy = nodes[i][1] - nodes[j][1]
        const dz = nodes[i][2] - nodes[j][2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        if (distance < maxDistance) {
          conns.push([i, j])
          neighborMap.get(i)!.push(j)
          neighborMap.get(j)!.push(i)
        }
      }
    }
    
    return { connections: conns, neighbors: neighborMap }
  }, [nodes])

  // Handle node click - trigger ripple effect
  const handleNodeClick = useCallback((index: number) => {
    onNodeClick?.(index)
    
    // Start ripple from clicked node
    const visited = new Set<number>()
    const queue: { node: number; delay: number }[] = [{ node: index, delay: 0 }]
    
    const propagate = () => {
      if (queue.length === 0) return
      
      const { node, delay } = queue.shift()!
      if (visited.has(node)) {
        propagate()
        return
      }
      
      visited.add(node)
      
      setTimeout(() => {
        setPulsingNodes(prev => new Set([...prev, node]))
        pulseTimeRef.current[node] = Date.now()
        
        // Remove pulse after animation
        setTimeout(() => {
          setPulsingNodes(prev => {
            const next = new Set(prev)
            next.delete(node)
            return next
          })
        }, 500)
        
        // Add neighbors to queue
        const nodeNeighbors = neighbors.get(node) || []
        nodeNeighbors.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            queue.push({ node: neighbor, delay: 80 })
          }
        })
        
        propagate()
      }, delay)
    }
    
    propagate()
  }, [neighbors, onNodeClick])

  const handlePointerOver = useCallback((index: number) => {
    setHoveredNode(index)
    onNodeHover?.(index)
    document.body.style.cursor = 'pointer'
  }, [onNodeHover])

  const handlePointerOut = useCallback(() => {
    setHoveredNode(null)
    onNodeHover?.(null)
    document.body.style.cursor = 'default'
  }, [onNodeHover])

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

      {/* Neural nodes - interactive glowing points */}
      {nodes.map((position, i) => {
        const isHovered = hoveredNode === i
        const isPulsing = pulsingNodes.has(i)
        const scale = isHovered ? 1.5 : isPulsing ? 1.8 : 1
        const coreColor = isHovered ? "#ffffff" : isPulsing ? "#ff00ff" : "#c0ffff"
        const glowColor = isPulsing ? "#ff00ff" : "#00ffff"
        
        return (
          <group 
            key={i} 
            position={position}
            scale={scale}
            onClick={(e) => {
              e.stopPropagation()
              handleNodeClick(i)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              handlePointerOver(i)
            }}
            onPointerOut={handlePointerOut}
          >
            {/* Core bright node */}
            <Sphere args={[0.035, 12, 12]}>
              <meshBasicMaterial color={coreColor} />
            </Sphere>
            {/* Inner glow */}
            <Sphere args={[0.055, 10, 10]}>
              <meshBasicMaterial color={glowColor} transparent opacity={isPulsing ? 0.8 : 0.5} />
            </Sphere>
            {/* Outer soft glow */}
            <Sphere args={[0.08, 8, 8]}>
              <meshBasicMaterial color={glowColor} transparent opacity={isPulsing ? 0.5 : 0.2} />
            </Sphere>
          </group>
        )
      })}

      {/* Neural connection lines */}
      {connections.map(([start, end], i) => {
        const isHighlighted = hoveredNode === start || hoveredNode === end
        const isPulsingConnection = pulsingNodes.has(start) || pulsingNodes.has(end)
        
        return (
          <Line
            key={i}
            points={[nodes[start], nodes[end]]}
            color={isPulsingConnection ? "#ff00ff" : isHighlighted ? "#00ffff" : "#00cccc"}
            lineWidth={isHighlighted || isPulsingConnection ? 2 : 1}
            transparent
            opacity={isHighlighted ? 0.9 : isPulsingConnection ? 0.7 : 0.4}
          />
        )
      })}
    </group>
  )
}

// ============================================
// MAIN 3D SCENE COMPONENT
// ============================================
interface Scene3DProps {
  showParticles?: boolean
  showGlobe?: boolean
  bloomIntensity?: number
  className?: string
}

export default function Scene3D({ 
  showParticles = true, 
  showGlobe = true,
  bloomIntensity = 1.5,
  className = ""
}: Scene3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 3.2], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 3]} intensity={0.5} color="#00ffff" />
        <pointLight position={[-3, -2, 2]} intensity={0.3} color="#8b5cf6" />
        <pointLight position={[0, 0, 4]} intensity={0.4} color="#00dddd" />
        
        {/* Particle Fields */}
        {showParticles && (
          <>
            <ParticleField count={1200} color="#00ffff" />
            <ParticleField count={400} color="#a855f7" />
          </>
        )}
        
        {/* Neural Globe */}
        {showGlobe && <NeuralGlobe />}
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
        
        {/* Postprocessing Effects */}
        <EffectComposer>
          <Bloom
            intensity={bloomIntensity}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0005, 0.0005)}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

// Export individual components for flexibility
export { NeuralGlobe, ParticleField }
