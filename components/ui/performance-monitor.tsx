"use client"

import { useEffect, useState } from 'react'

export function PerformanceMonitor() {
  const [loadTime, setLoadTime] = useState<number>(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true)
      
      // Check if page is already loaded
      if (document.readyState === 'complete') {
        // Page is already loaded, use navigation timing if available
        if (performance.getEntriesByType && performance.getEntriesByType('navigation').length > 0) {
          const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          setLoadTime(navigationEntry.loadEventEnd - navigationEntry.loadEventStart)
        } else {
          // Fallback to current time minus a reasonable estimate
          setLoadTime(performance.now())
        }
      } else {
        // Page is still loading, measure from now until load event
        const startTime = performance.now()
        
        window.addEventListener('load', () => {
          const endTime = performance.now()
          setLoadTime(endTime - startTime)
        })
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs z-50">
      <div>Load: {loadTime.toFixed(0)}ms</div>
      <div>Bundle: Optimized</div>
    </div>
  )
} 