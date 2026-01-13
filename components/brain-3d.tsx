"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function BrainWireframe() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.1
    }
  })

  const brainGeometry = () => {
    const vertices: number[] = []
    const cyanColor = new THREE.Color(0x00ddff)
    const purpleColor = new THREE.Color(0xaa66ff)

    // Create brain outline shape - left hemisphere (cyan)
    const leftPoints: [number, number, number][] = []
    const segments = 50
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const angle = t * Math.PI

      // Brain-shaped curve with bulges for frontal and occipital lobes
      let x = -0.3 - Math.cos(angle) * 1.0
      let y = Math.sin(angle) * 1.1 - 0.05
      const z = Math.sin(angle * 2) * 0.25 + Math.cos(angle * 3) * 0.15

      // Add bulge for frontal lobe
      if (angle < Math.PI * 0.3) {
        x -= 0.2 * (1 - angle / (Math.PI * 0.3))
        y += 0.15 * (1 - angle / (Math.PI * 0.3))
      }

      // Add bulge for occipital lobe
      if (angle > Math.PI * 0.7) {
        x += 0.15 * ((angle - Math.PI * 0.7) / (Math.PI * 0.3))
        y -= 0.1 * ((angle - Math.PI * 0.7) / (Math.PI * 0.3))
      }

      leftPoints.push([x, y, z])
    }

    // Create brain outline shape - right hemisphere (purple)
    const rightPoints: [number, number, number][] = []
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const angle = t * Math.PI

      let x = 0.3 + Math.cos(angle) * 1.0
      let y = Math.sin(angle) * 1.1 - 0.05
      const z = Math.sin(angle * 2) * 0.25 + Math.cos(angle * 3) * 0.15

      // Add bulge for frontal lobe
      if (angle < Math.PI * 0.3) {
        x += 0.2 * (1 - angle / (Math.PI * 0.3))
        y += 0.15 * (1 - angle / (Math.PI * 0.3))
      }

      // Add bulge for occipital lobe
      if (angle > Math.PI * 0.7) {
        x -= 0.15 * ((angle - Math.PI * 0.7) / (Math.PI * 0.3))
        y -= 0.1 * ((angle - Math.PI * 0.7) / (Math.PI * 0.3))
      }

      rightPoints.push([x, y, z])
    }

    // Draw left hemisphere outline
    for (let i = 0; i < leftPoints.length - 1; i++) {
      vertices.push(...leftPoints[i], ...leftPoints[i + 1])
    }

    // Draw right hemisphere outline
    for (let i = 0; i < rightPoints.length - 1; i++) {
      vertices.push(...rightPoints[i], ...rightPoints[i + 1])
    }

    // Brain fold details (sulci) - left hemisphere
    const leftFolds = [
      // Central sulcus
      [
        [-0.3, 0.9, 0.2],
        [-0.4, 0.5, 0.25],
        [-0.5, 0.0, 0.2],
        [-0.55, -0.4, 0.15],
      ],
      // Superior frontal sulcus
      [
        [-0.5, 0.85, 0.1],
        [-0.6, 0.6, 0.15],
        [-0.7, 0.3, 0.1],
        [-0.75, 0.0, 0.05],
      ],
      // Lateral sulcus (Sylvian fissure)
      [
        [-0.4, 0.3, 0.3],
        [-0.6, 0.15, 0.35],
        [-0.8, -0.1, 0.3],
        [-0.95, -0.35, 0.2],
      ],
      // Inferior frontal sulcus
      [
        [-0.7, 0.75, -0.05],
        [-0.8, 0.5, 0.0],
        [-0.9, 0.2, -0.05],
        [-0.95, -0.1, -0.1],
      ],
      // Precentral sulcus
      [
        [-0.45, 0.8, 0.0],
        [-0.5, 0.45, 0.05],
        [-0.55, 0.1, 0.0],
        [-0.6, -0.25, -0.05],
      ],
      // Postcentral sulcus
      [
        [-0.2, 0.85, 0.15],
        [-0.3, 0.55, 0.2],
        [-0.4, 0.2, 0.15],
        [-0.45, -0.15, 0.1],
      ],
      // Intraparietal sulcus
      [
        [-0.35, 0.7, -0.1],
        [-0.45, 0.4, -0.05],
        [-0.55, 0.05, -0.1],
        [-0.6, -0.3, -0.15],
      ],
      // Additional detail folds
      [
        [-0.65, 0.65, 0.2],
        [-0.7, 0.35, 0.25],
        [-0.75, 0.0, 0.2],
      ],
      [
        [-0.85, 0.5, 0.1],
        [-0.9, 0.2, 0.15],
        [-0.95, -0.1, 0.1],
      ],
      [
        [-0.55, 0.55, -0.15],
        [-0.6, 0.25, -0.1],
        [-0.65, -0.05, -0.15],
      ],
    ]

    // Brain fold details - right hemisphere
    const rightFolds = [
      // Central sulcus
      [
        [0.3, 0.9, 0.2],
        [0.4, 0.5, 0.25],
        [0.5, 0.0, 0.2],
        [0.55, -0.4, 0.15],
      ],
      // Superior frontal sulcus
      [
        [0.5, 0.85, 0.1],
        [0.6, 0.6, 0.15],
        [0.7, 0.3, 0.1],
        [0.75, 0.0, 0.05],
      ],
      // Lateral sulcus
      [
        [0.4, 0.3, 0.3],
        [0.6, 0.15, 0.35],
        [0.8, -0.1, 0.3],
        [0.95, -0.35, 0.2],
      ],
      // Inferior frontal sulcus
      [
        [0.7, 0.75, -0.05],
        [0.8, 0.5, 0.0],
        [0.9, 0.2, -0.05],
        [0.95, -0.1, -0.1],
      ],
      // Precentral sulcus
      [
        [0.45, 0.8, 0.0],
        [0.5, 0.45, 0.05],
        [0.55, 0.1, 0.0],
        [0.6, -0.25, -0.05],
      ],
      // Postcentral sulcus
      [
        [0.2, 0.85, 0.15],
        [0.3, 0.55, 0.2],
        [0.4, 0.2, 0.15],
        [0.45, -0.15, 0.1],
      ],
      // Intraparietal sulcus
      [
        [0.35, 0.7, -0.1],
        [0.45, 0.4, -0.05],
        [0.55, 0.05, -0.1],
        [0.6, -0.3, -0.15],
      ],
      // Additional detail folds
      [
        [0.65, 0.65, 0.2],
        [0.7, 0.35, 0.25],
        [0.75, 0.0, 0.2],
      ],
      [
        [0.85, 0.5, 0.1],
        [0.9, 0.2, 0.15],
        [0.95, -0.1, 0.1],
      ],
      [
        [0.55, 0.55, -0.15],
        [0.6, 0.25, -0.1],
        [0.65, -0.05, -0.15],
      ],
    ]

    // Corpus callosum connections (center connections between hemispheres)
    const corpusCallosum = [
      [
        [-0.25, 0.5, 0.15],
        [0, 0.48, 0.18],
        [0.25, 0.5, 0.15],
      ],
      [
        [-0.3, 0.3, 0.1],
        [0, 0.28, 0.12],
        [0.3, 0.3, 0.1],
      ],
      [
        [-0.28, 0.1, 0.08],
        [0, 0.08, 0.1],
        [0.28, 0.1, 0.08],
      ],
      [
        [-0.25, -0.1, 0.05],
        [0, -0.12, 0.08],
        [0.25, -0.1, 0.05],
      ],
    ]

    // Add all fold lines
    const allFolds = [...leftFolds, ...rightFolds, ...corpusCallosum]
    allFolds.forEach((fold) => {
      for (let i = 0; i < fold.length - 1; i++) {
        vertices.push(...fold[i], ...fold[i + 1])
      }
    })

    // Create more cross-section curves for depth
    const layers = 3
    for (let layer = 0; layer < layers; layer++) {
      const depth = -0.2 + layer * 0.2

      // Left hemisphere layer
      for (let i = 0; i < segments; i += 2) {
        const t = i / segments
        const angle = t * Math.PI
        const x = -0.3 - Math.cos(angle) * (0.9 - layer * 0.1)
        const y = Math.sin(angle) * (1.0 - layer * 0.1) - 0.05
        const z = depth

        const t2 = (i + 2) / segments
        const angle2 = t2 * Math.PI
        const x2 = -0.3 - Math.cos(angle2) * (0.9 - layer * 0.1)
        const y2 = Math.sin(angle2) * (1.0 - layer * 0.1) - 0.05
        const z2 = depth

        vertices.push(x, y, z, x2, y2, z2)
      }

      // Right hemisphere layer
      for (let i = 0; i < segments; i += 2) {
        const t = i / segments
        const angle = t * Math.PI
        const x = 0.3 + Math.cos(angle) * (0.9 - layer * 0.1)
        const y = Math.sin(angle) * (1.0 - layer * 0.1) - 0.05
        const z = depth

        const t2 = (i + 2) / segments
        const angle2 = t2 * Math.PI
        const x2 = 0.3 + Math.cos(angle2) * (0.9 - layer * 0.1)
        const y2 = Math.sin(angle2) * (1.0 - layer * 0.1) - 0.05
        const z2 = depth

        vertices.push(x, y, z, x2, y2, z2)
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))

    return geometry
  }

  const sphereCageGeometry = () => {
    const vertices: number[] = []
    const radius = 1.65
    const segments = 24

    // Latitude lines
    for (let lat = 0; lat < segments / 2; lat++) {
      const phi1 = (lat / (segments / 2)) * Math.PI
      const phi2 = ((lat + 1) / (segments / 2)) * Math.PI

      for (let lon = 0; lon < segments; lon++) {
        const theta1 = (lon / segments) * Math.PI * 2
        const theta2 = ((lon + 1) / segments) * Math.PI * 2

        vertices.push(
          radius * Math.sin(phi1) * Math.cos(theta1),
          radius * Math.cos(phi1) - 0.05,
          radius * Math.sin(phi1) * Math.sin(theta1),
          radius * Math.sin(phi1) * Math.cos(theta2),
          radius * Math.cos(phi1) - 0.05,
          radius * Math.sin(phi1) * Math.sin(theta2),
        )
      }
    }

    // Longitude lines
    for (let lon = 0; lon < segments; lon++) {
      const theta = (lon / segments) * Math.PI * 2

      for (let lat = 0; lat < segments / 2; lat++) {
        const phi1 = (lat / (segments / 2)) * Math.PI
        const phi2 = ((lat + 1) / (segments / 2)) * Math.PI

        vertices.push(
          radius * Math.sin(phi1) * Math.cos(theta),
          radius * Math.cos(phi1) - 0.05,
          radius * Math.sin(phi1) * Math.sin(theta),
          radius * Math.sin(phi2) * Math.cos(theta),
          radius * Math.cos(phi2) - 0.05,
          radius * Math.sin(phi2) * Math.sin(theta),
        )
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))

    return geometry
  }

  return (
    <group ref={groupRef}>
      {/* Outer sphere cage */}
      <lineSegments geometry={sphereCageGeometry()}>
        <lineBasicMaterial color="#4488ff" transparent opacity={0.4} />
      </lineSegments>

      {/* Brain structure with gradient coloring */}
      <lineSegments geometry={brainGeometry()}>
        <shaderMaterial
          vertexShader={`
            varying vec3 vPosition;
            void main() {
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vPosition;
            void main() {
              // Gradient from cyan (left) to purple (right)
              float t = (vPosition.x + 1.3) / 2.6;
              t = clamp(t, 0.0, 1.0);
              vec3 cyan = vec3(0.0, 0.87, 1.0); // Bright cyan #00ddff
              vec3 purple = vec3(0.67, 0.4, 1.0); // Bright purple #aa66ff
              vec3 color = mix(cyan, purple, t);
              gl_FragColor = vec4(color, 1.0);
            }
          `}
          transparent
        />
      </lineSegments>
    </group>
  )
}

export default function Brain3D() {
  return (
    <div className="w-[400px] h-[400px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#00ddff" />
        <pointLight position={[-5, -5, 5]} intensity={1.2} color="#aa66ff" />
        <BrainWireframe />
      </Canvas>
    </div>
  )
}
