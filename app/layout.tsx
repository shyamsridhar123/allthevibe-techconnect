import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "OneShot - Neural Network Experience",
  description: "Experience the future with OneShot - A Matrix-inspired neural network visualization",
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
