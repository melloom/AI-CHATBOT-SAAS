import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientProviders } from "@/components/providers/client-providers"

// Force dynamic rendering for better real-time updates
export const dynamic = 'force-dynamic'

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: "ChatHub - Your Central Hub for AI Chatbots",
  description: "Create, manage, and deploy intelligent chatbots from one powerful platform",
  generator: 'v0.dev',
  icons: {
    icon: '/LOGO.png',
    shortcut: '/LOGO.png',
    apple: '/LOGO.png',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000'
}

// Service Worker Registration
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} dark-bg-cosmic`} suppressHydrationWarning={true}>
        <div suppressHydrationWarning>
          <ClientProviders>
            {children}
          </ClientProviders>
        </div>
      </body>
    </html>
  )
}
