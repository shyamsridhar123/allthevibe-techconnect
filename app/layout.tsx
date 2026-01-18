import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "OneShot = All the Vibes",
  description: "All The Vibes is a live, interactive meet-up where we explore the art and science of AI pair programming—also known as vibe coding.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "OneShot = All the Vibes",
    description: "All The Vibes is a live, interactive meet-up where we explore the art and science of AI pair programming—also known as vibe coding.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "All The Vibes - OneShot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneShot - All The Vibes",
    description: "All The Vibes is a live, interactive meet-up where we explore the art and science of AI pair programming—also known as vibe coding.",
    images: ["/images/og-image.png"],
  },
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
