import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "All The Vibes - Neural Network Experience",
  description: "Experience the future with All The Vibes - A Matrix-inspired neural network visualization",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#050010]">
        {children}
      </body>
    </html>
  )
}
