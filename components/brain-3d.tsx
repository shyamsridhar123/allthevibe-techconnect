"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Line } from "@react-three/drei"
import type * as THREE from "three"

function BrainWireframe() {
  const brainRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
      brainRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  // Brain structure with interconnected nodes
  const nodes = [
    // Left hemisphere
    [-0.8, 0.5, 0],
    [-0.6, 0.7, 0.2],
    [-0.7, 0.3, 0.3],
    [-0.9, 0.1, 0.1],
    [-0.5, 0.5, -0.2],
    [-0.6, 0.2, 0],
    [-0.8, -0.1, 0.3],
    [-0.5, -0.3, 0.2],
    // Right hemisphere
    [0.8, 0.5, 0],
    [0.6, 0.7, 0.2],
    [0.7, 0.3, 0.3],
    [0.9, 0.1, 0.1],
    [0.5, 0.5, -0.2],
    [0.6, 0.2, 0],
    [0.8, -0.1, 0.3],
    [0.5, -0.3, 0.2],
    // Center connections
    [0, 0.6, 0.1],
    [0, 0.3, 0.2],
    [0, 0, 0.1],
    [0, -0.3, 0],
    // Cerebellum
    [-0.3, -0.5, -0.3],
    [0.3, -0.5, -0.3],
    [0, -0.6, -0.2],
  ]

  const connections = [
    // Left hemisphere connections
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 3],
    [0, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [2, 6],
    // Right hemisphere connections
    [8, 9],
    [8, 10],
    [9, 10],
    [10, 11],
    [8, 12],
    [12, 13],
    [13, 14],
    [14, 15],
    [10, 14],
    // Inter-hemisphere connections
    [0, 16],
    [8, 16],
    [1, 16],
    [9, 16],
    [2, 17],
    [10, 17],
    [5, 18],
    [13, 18],
    [6, 19],
    [14, 19],
    [7, 19],
    [15, 19],
    // Cerebellum connections
    [19, 20],
    [19, 21],
    [19, 22],
    [20, 22],
    [21, 22],
  ]

  return (
    <group ref={brainRef}>
      {/* Outer sphere */}
      <Sphere args={[1.5, 32, 32]}>
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.15} />
      </Sphere>

      {/* Inner sphere */}
      <Sphere args={[1.3, 24, 24]}>
        <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.1} />
      </Sphere>

      {/* Brain nodes */}
      {nodes.map((position, i) => (
        <Sphere key={i} args={[0.05, 8, 8]} position={position as [number, number, number]}>
          <meshBasicMaterial color={i % 2 === 0 ? "#00ffff" : "#ff00ff"} />
        </Sphere>
      ))}

      {/* Connection lines */}
      {connections.map(([start, end], i) => (
        <Line
          key={i}
          points={[nodes[start], nodes[end]]}
          color={i % 3 === 0 ? "#00ffff" : i % 3 === 1 ? "#ff00ff" : "#00aaff"}
          lineWidth={1}
          transparent
          opacity={0.6}
        />
      ))}
    </group>
  )
}

export default function Brain3D() {
  return (
    <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
        <BrainWireframe />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
