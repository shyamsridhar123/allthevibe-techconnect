"use client"

export default function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Grid pattern - white */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Smaller grid overlay - gray */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200, 200, 200, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 200, 200, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '15px 15px'
        }}
      />

      {/* Radial fade from center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, #050010 70%)'
        }}
      />

      {/* Corner fades */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, #050010 0%, transparent 10%, transparent 90%, #050010 100%),
            linear-gradient(to bottom, #050010 0%, transparent 10%, transparent 90%, #050010 100%)
          `
        }}
      />
    </div>
  )
}
