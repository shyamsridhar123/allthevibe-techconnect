"use client"

import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import MatrixRain from "@/components/matrix-rain"
import Logo from "@/components/logo"
import Cutscene from "@/components/cutscene"
import SpotlightCursor from "@/components/spotlight-cursor"
import RippleClick from "@/components/ripple-click"
import FloatingOrbs from "@/components/floating-orbs"
import ScrollIndicator from "@/components/scroll-indicator"
import ScrollProgress from "@/components/scroll-progress"
import Navigation from "@/components/navigation"
import GridBackground from "@/components/grid-background"
import AboutSection from "@/components/about-section"
import CommunitySection from "@/components/community-section"

// CTA link to Teams community
const CTA_LINK = "https://teams.microsoft.com/l/entity/683f3525-d193-4a67-8d91-22093beab1ca/?context=%7B%22internalId%22%3A%2219%3AeyJfdHlwZSI6Ikdyb3VwIiwiaWQiOiIyMzQ4NzIwNjE5NTIifQ%40EngageCommunity%22%2C%22contextType%22%3A%22engageCommunity%22%2C%22subEntityId%22%3A%22%7B%5C%22deepLinkType%5C%22%3A%5C%22crossapp%5C%22%2C%5C%22path%5C%22%3A%5C%22%2Fgroups%2FeyJfdHlwZSI6Ikdyb3VwIiwiaWQiOiIyMzQ4NzIwNjE5NTIifQ%2Fall%5C%22%7D%22%7D"

// Dynamic import for 3D scene to avoid SSR issues
const Scene3D = dynamic(() => import("@/components/scene-3d"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#050010]" />
  )
})

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [showCutscene, setShowCutscene] = useState(true)
  const [cutsceneComplete, setCutsceneComplete] = useState(false)
  const aboutRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setShowCutscene(false)
      setCutsceneComplete(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!mounted) {
    return <div className="w-full h-screen bg-[#050010]" />
  }

  return (
    <div className="relative w-full min-h-screen bg-[#050010]">
      {/* Global interactive effects */}
      <SpotlightCursor />
      <RippleClick />
      <ScrollProgress />
      <Navigation ctaLink={CTA_LINK} />
      
      {/* Cutscene overlay */}
      {showCutscene && <Cutscene onComplete={() => {
        setShowCutscene(false)
        setCutsceneComplete(true)
      }} />}

      {/* === HERO SECTION === */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background layers */}
        <GridBackground />
        <FloatingOrbs />
        <MatrixRain />

        {/* 3D scene with neural globe - middle layer */}
        <div className="absolute inset-0 z-5 flex items-center justify-center">
          <div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] -mt-16 sm:-mt-12 md:-mt-8">
            <Scene3D 
              showParticles={false} 
              showGlobe={true}
              bloomIntensity={cutsceneComplete ? 1.5 : 2.5}
            />
          </div>
        </div>

        {/* Logo overlay - positioned below the globe */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="relative flex flex-col items-center mt-[180px] sm:mt-[220px] md:mt-[280px] lg:mt-[320px] px-4">
            <div className="pointer-events-auto">
              <Logo showCTA={true} ctaLink={CTA_LINK} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <ScrollIndicator onClick={scrollToAbout} />

        {/* Vignette effect */}
        <div 
          className="absolute inset-0 z-5 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 30%, rgba(5, 0, 16, 0.7) 100%)'
          }}
        />

        {/* Subtle scanline effect */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
          }}
        />
      </section>

      {/* === CONTENT SECTIONS === */}
      <div ref={aboutRef}>
        <AboutSection ctaLink={CTA_LINK} />
      </div>
      
      <CommunitySection ctaLink={CTA_LINK} />
    </div>
  )
}
