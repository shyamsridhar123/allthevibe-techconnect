"use client"

import { useEffect, useState, useRef } from "react"

interface CutsceneProps {
  onComplete: () => void
}

export default function Cutscene({ onComplete }: CutsceneProps) {
  const [catPosition, setCatPosition] = useState(-15) // Start off-screen left
  const [fadeOut, setFadeOut] = useState(false)
  const [time, setTime] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    // Cat walks across in 5 seconds
    const startTime = Date.now()
    const duration = 5000

    const animationFrame = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setTime(elapsed)
      
      // Ease-in-out for natural walking
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2
      
      // Move from -15% to 115% of screen width
      const position = -15 + easeProgress * 130
      setCatPosition(position)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animationFrame)
      } else {
        // Fade out after cat walks across
        setFadeOut(true)
        setTimeout(() => {
          onComplete()
        }, 800)
      }
    }

    frameRef.current = requestAnimationFrame(animationFrame)
    return () => cancelAnimationFrame(frameRef.current)
  }, [onComplete])

  // Calculate cat's scale based on position (perspective effect - slightly smaller at edges)
  const catScale = 1 - Math.abs(catPosition - 50) * 0.001
  
  // Subtle vertical bob synced with walk cycle
  const walkCycle = Math.sin(time * 0.02) * 2

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ perspective: '1200px' }}>
      {/* Deep background - brighter to see cat */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0520] via-[#12082a] to-[#0a0520]" />
      
      {/* 3D Room container */}
      <div 
        className="absolute inset-0"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: 'translateZ(-100px)'
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
          {/* Wall panels - left - purple tinted, brighter */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-[25%]"
            style={{
              background: 'linear-gradient(180deg, #2a1540 0%, #1a0c2a 50%, #120820 100%)',
              boxShadow: 'inset -10px 0 30px rgba(0,0,0,0.3)',
              borderRight: '3px solid #4a2a60'
            }}
          >
            {/* Wall texture */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(168,85,247,0.1) 20px, rgba(168,85,247,0.1) 21px)'
            }} />
          </div>
          
          {/* Wall panels - right - purple tinted, brighter */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-[25%]"
            style={{
              background: 'linear-gradient(180deg, #2a1540 0%, #1a0c2a 50%, #120820 100%)',
              boxShadow: 'inset 10px 0 30px rgba(0,0,0,0.3)',
              borderLeft: '3px solid #4a2a60'
            }}
          >
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(168,85,247,0.1) 20px, rgba(168,85,247,0.1) 21px)'
            }} />
          </div>
          
          {/* Doorway opening - with more visible glow */}
          <div 
            className="absolute left-[25%] right-[25%] top-0 bottom-0"
            style={{
              background: 'radial-gradient(ellipse at center 30%, #150a25 0%, #080412 50%, #030208 100%)',
              boxShadow: 'inset 0 0 100px rgba(0,255,255,0.15)'
            }}
          >
            {/* Door frame */}
            <div className="absolute inset-0 border-4 border-[#2a1840]" style={{ 
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' 
            }} />
            
            {/* Brighter cyan/purple glow from within */}
            <div 
              className="absolute inset-[10%] rounded-full opacity-50"
              style={{
                background: 'radial-gradient(circle, rgba(0,255,255,0.25) 0%, rgba(168,85,247,0.15) 50%, transparent 70%)',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            />
          </div>
        </div>

        {/* Left wall - 3D perspective - brighter purple */}
        <div 
          className="absolute left-0 top-[5%] bottom-[40%] w-[20%]"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateY(75deg)',
            transformOrigin: 'left center',
            background: 'linear-gradient(90deg, #100825 0%, #1a0c30 50%, #251240 100%)',
            boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.4)'
          }}
        >
          {/* Wall molding */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#3a2050] to-[#251240]" />
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#3a2050] to-[#251240]" />
        </div>

        {/* Right wall - 3D perspective - brighter purple */}
        <div 
          className="absolute right-0 top-[5%] bottom-[40%] w-[20%]"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateY(-75deg)',
            transformOrigin: 'right center',
            background: 'linear-gradient(-90deg, #100825 0%, #1a0c30 50%, #251240 100%)',
            boxShadow: 'inset 20px 0 40px rgba(0,0,0,0.4)'
          }}
        >
          {/* Cables hanging - cyan and purple, brighter */}
          <div className="absolute right-[20%] top-[10%] w-3 h-[60%]">
            <div className="w-full h-full bg-gradient-to-b from-[#00ffff] via-[#00aaaa] to-[#006666] rounded-full opacity-80" 
                 style={{ boxShadow: '0 0 15px rgba(0,255,255,0.5)' }} />
          </div>
          <div className="absolute right-[35%] top-[15%] w-2 h-[50%]">
            <div className="w-full h-full bg-gradient-to-b from-[#c084fc] via-[#a855f7] to-[#7c3aed] rounded-full opacity-80"
                 style={{ boxShadow: '0 0 15px rgba(168,85,247,0.5)' }} />
          </div>
          <div className="absolute right-[50%] top-[20%] w-2 h-[40%]">
            <div className="w-full h-full bg-gradient-to-b from-[#00ccdd] via-[#0099aa] to-[#006677] rounded-full opacity-70" />
          </div>
          
          {/* Wall molding */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#3a2050] to-[#251240]" />
        </div>
      </div>

      {/* 3D Checkered floor - brighter for visibility */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[50%]"
        style={{ 
          perspective: '800px',
          perspectiveOrigin: '50% 0%'
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
          {/* Main checkered pattern - brighter purple tinted */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                repeating-conic-gradient(
                  from 0deg at 60px 60px,
                  #2a1538 0deg 90deg,
                  #120a1c 90deg 180deg
                )
              `,
              backgroundSize: '120px 120px',
            }}
          />
          
          {/* Floor shine/reflection - stronger cyan tint */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0,255,255,0.12) 0%, rgba(168,85,247,0.05) 30%, transparent 70%, rgba(0,0,0,0.3) 100%)'
            }}
          />
          
          {/* Grid lines for depth - brighter */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px),
                linear-gradient(0deg, rgba(0,255,255,0.25) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        
        {/* Floor edge shadow - softer */}
        <div 
          className="absolute top-0 left-0 right-0 h-24"
          style={{
            background: 'linear-gradient(180deg, rgba(10,5,32,0.8) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* Ambient lighting from above - makes scene brighter */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(0,255,255,0.08) 0%, transparent 60%)'
        }}
      />

      {/* Ambient fog/atmosphere - purple/cyan, more visible */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 70%, rgba(168,85,247,0.12) 0%, transparent 50%)'
        }}
      />

      {/* Volumetric light from doorway - stronger */}
      <div 
        className="absolute left-[30%] right-[30%] top-[20%] bottom-[40%] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,255,255,0.08) 50%, rgba(168,85,247,0.1) 100%)',
          clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)'
        }}
      />

      {/* Spotlight on floor where cat walks */}
      <div 
        className="absolute bottom-[30%] left-0 right-0 h-[20%] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, rgba(0,255,255,0.06) 30%, rgba(168,85,247,0.08) 50%, rgba(0,255,255,0.06) 70%, transparent 90%)'
        }}
      />

      {/* Scanline CRT effect - cyan tinted */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 255, 255, 0.1) 1px, rgba(0, 255, 255, 0.1) 2px)',
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

      {/* Black Cat - 3D positioned with rim lighting for visibility */}
      <div
        className="absolute transition-none"
        style={{
          left: `${catPosition}%`,
          bottom: `38%`,
          transform: `translateX(-50%) scale(${catScale}) translateY(${walkCycle}px)`,
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.9)) drop-shadow(0 0 15px rgba(0,255,255,0.2))'
        }}
      >
        <svg
          viewBox="0 0 200 120"
          className="w-40 h-24 md:w-56 md:h-32 lg:w-72 lg:h-44"
          fill="none"
        >
          {/* Rim light glow behind cat */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Cat body - walking pose */}
          <g>
            {/* Outer glow/rim light - cyan outline */}
            <ellipse cx="100" cy="70" rx="54" ry="28" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.3" />
            <circle cx="155" cy="48" r="26" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.3" />
            
            {/* Tail - raised and curved, animated */}
            <path
              d="M 50 65 Q 20 50 25 20 Q 28 10 35 15"
              stroke="#1a1a1a"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              style={{
                transformOrigin: '50px 65px',
                animation: 'tailWag 0.8s ease-in-out infinite'
              }}
            />
            {/* Tail rim light */}
            <path
              d="M 50 65 Q 20 50 25 20 Q 28 10 35 15"
              stroke="#00ffff"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
              style={{
                transformOrigin: '50px 65px',
                animation: 'tailWag 0.8s ease-in-out infinite'
              }}
            />
            
            {/* Body */}
            <ellipse cx="100" cy="70" rx="52" ry="26" fill="#1a1a1a" />
            
            {/* Back legs - walking animation */}
            <g style={{ transformOrigin: '65px 78px', animation: 'backLeg 0.25s ease-in-out infinite' }}>
              <ellipse cx="60" cy="85" rx="12" ry="8" fill="#1a1a1a" />
              <rect x="55" y="82" width="12" height="28" rx="6" fill="#1a1a1a" />
              <ellipse cx="61" cy="112" rx="8" ry="5" fill="#151515" />
            </g>
            <g style={{ transformOrigin: '82px 80px', animation: 'backLegAlt 0.25s ease-in-out infinite' }}>
              <rect x="76" y="82" width="11" height="26" rx="5" fill="#1c1c1c" />
              <ellipse cx="81" cy="110" rx="7" ry="4" fill="#1a1a1a" />
            </g>
            
            {/* Neck */}
            <ellipse cx="135" cy="62" rx="18" ry="22" fill="#1a1a1a" />
            
            {/* Front legs - walking animation */}
            <g style={{ transformOrigin: '125px 82px', animation: 'frontLeg 0.25s ease-in-out infinite' }}>
              <rect x="118" y="80" width="10" height="30" rx="5" fill="#1a1a1a" />
              <ellipse cx="123" cy="112" rx="7" ry="5" fill="#151515" />
            </g>
            <g style={{ transformOrigin: '140px 82px', animation: 'frontLegAlt 0.25s ease-in-out infinite' }}>
              <rect x="134" y="80" width="10" height="28" rx="5" fill="#1c1c1c" />
              <ellipse cx="139" cy="110" rx="7" ry="4" fill="#1a1a1a" />
            </g>
            
            {/* Head */}
            <circle cx="155" cy="48" r="24" fill="#1a1a1a" />
            
            {/* Ears */}
            <polygon points="136,28 144,5 154,28" fill="#1a1a1a" />
            <polygon points="158,25 167,2 177,25" fill="#1a1a1a" />
            
            {/* Inner ears - slightly visible */}
            <polygon points="140,26 144,12 150,26" fill="#252525" />
            <polygon points="162,23 167,9 173,23" fill="#252525" />
            
            {/* Eyes - glowing cyan (matching primary color), with strong glow effect */}
            <ellipse cx="148" cy="46" rx="5" ry="6" fill="#00ffff" filter="url(#glow)">
              <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="164" cy="46" rx="5" ry="6" fill="#00ffff" filter="url(#glow)">
              <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
            </ellipse>
            {/* Eye outer glow - cyan */}
            <ellipse cx="148" cy="46" rx="10" ry="11" fill="none" stroke="#00ffff" strokeWidth="2" opacity="0.4">
              <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="164" cy="46" rx="10" ry="11" fill="none" stroke="#00ffff" strokeWidth="2" opacity="0.4">
              <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite" />
            </ellipse>
            {/* Pupils */}
            <ellipse cx="149" cy="46" rx="2" ry="5" fill="#005555" />
            <ellipse cx="165" cy="46" rx="2" ry="5" fill="#005555" />
            
            {/* Nose - slightly visible */}
            <polygon points="172,52 176,58 168,58" fill="#252525" />
            
            {/* Whiskers - more visible */}
            <g stroke="#333333" strokeWidth="0.8" opacity="0.7">
              <line x1="170" y1="54" x2="195" y2="50" />
              <line x1="170" y1="56" x2="198" y2="56" />
              <line x1="170" y1="58" x2="195" y2="62" />
            </g>
            
            {/* Subtle fur highlights on body */}
            <ellipse cx="90" cy="65" rx="30" ry="12" fill="#222222" opacity="0.5" />
            <ellipse cx="155" cy="42" rx="12" ry="8" fill="#222222" opacity="0.4" />
          </g>
          
          {/* Cat shadow on floor - elongated for 3D effect */}
          <ellipse cx="100" cy="118" rx="70" ry="6" fill="rgba(0,0,0,0.7)" 
                   style={{ filter: 'blur(4px)' }} />
        </svg>
      </div>

      {/* "Déjà vu" text - glitch effect with cyan glow */}
      <div
        className={`absolute top-[12%] left-1/2 -translate-x-1/2 font-mono text-lg md:text-xl tracking-[0.3em] transition-all duration-700 ${
          catPosition > 25 && catPosition < 75 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          color: '#00ffff',
          textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #a855f7',
          animation: catPosition > 25 && catPosition < 75 ? 'glitch 0.3s infinite' : 'none'
        }}
      >
        {"// déjà vu..."}
      </div>

      {/* Vignette for depth - matches landing page */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(5, 0, 16, 0.7) 100%)'
        }}
      />

      {/* Fade out overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          fadeOut ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundColor: '#050010' }}
      />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
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
        
        @keyframes glitch {
          0% { transform: translateX(-50%) translate(0); }
          20% { transform: translateX(-50%) translate(-2px, 1px); }
          40% { transform: translateX(-50%) translate(2px, -1px); }
          60% { transform: translateX(-50%) translate(-1px, -1px); }
          80% { transform: translateX(-50%) translate(1px, 1px); }
          100% { transform: translateX(-50%) translate(0); }
        }
      `}</style>
    </div>
  )
}
