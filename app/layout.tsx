import "./globals.css"

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { ConditionalAppShell } from "@/components/conditional-app-shell"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SEO Agency CRM",
  description: "Comprehensive CRM platform for Digital Marketing & SEO Agencies",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <ConditionalAppShell>
              {children}
            </ConditionalAppShell>
          </ConvexClientProvider>
        </body>
    </html>
  )
}


