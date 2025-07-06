"use client"

import { useEffect } from "react"
import { getAnalytics } from "firebase/analytics"
import { app } from "@/lib/firebase"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize analytics only on client side after mount
    if (typeof window !== 'undefined') {
      try {
        getAnalytics(app)
      } catch (error) {
        console.log("Analytics not available:", error)
      }
    }
  }, [])

  return <>{children}</>
} 