import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ProjectsProvider } from "@/contexts/projects-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Launch Your Code - Share Your Projects",
  description: "Share your creations onchain, brought to you by Ryekun",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProjectsProvider>{children}</ProjectsProvider>
      </body>
    </html>
  )
}
