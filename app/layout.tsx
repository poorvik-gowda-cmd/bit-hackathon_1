import './globals.css'
import type React from "react"
// ... existing code ...
import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PayFlow - UPI Payment & Expense Tracking",
  description: "Secure UPI payments with AI-powered expense tracking",
  // ... existing code ...
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}


