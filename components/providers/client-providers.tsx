"use client"

import dynamic from 'next/dynamic'
import { ThemeProvider } from "@/components/theme-provider"

// Dynamic imports for better performance
const Toaster = dynamic(() => import("@/components/ui/toaster").then(mod => ({ default: mod.Toaster })), {
  ssr: false,
  loading: () => null
})

const AuthProvider = dynamic(() => import("@/components/providers/auth-provider").then(mod => ({ default: mod.AuthProvider })), {
  ssr: false,
  loading: () => null
})

const AnalyticsProvider = dynamic(() => import("@/components/providers/analytics-provider").then(mod => ({ default: mod.AnalyticsProvider })), {
  ssr: false,
  loading: () => null
})

const PerformanceMonitor = dynamic(() => import("@/components/ui/performance-monitor").then(mod => ({ default: mod.PerformanceMonitor })), {
  ssr: false,
  loading: () => null
})



interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <AnalyticsProvider>
          {children}
          <Toaster />
        </AnalyticsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 