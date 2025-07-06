// Background refresh service for real-time updates
class BackgroundRefreshService {
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private callbacks: Map<string, () => void> = new Map()

  // Register a refresh function with a unique key
  register(key: string, callback: () => void, intervalMs: number = 30000) {
    // Clear existing interval if it exists
    this.unregister(key)

    // Store the callback
    this.callbacks.set(key, callback)

    // Create new interval
    const interval = setInterval(() => {
      const callback = this.callbacks.get(key)
      if (callback) {
        try {
          callback()
        } catch (error) {
          console.error('Background refresh error:', { key, error })
        }
      }
    }, intervalMs)

    this.intervals.set(key, interval)
    console.log(`Background refresh registered for ${key} (${intervalMs}ms)`)
  }

  // Unregister a refresh function
  unregister(key: string) {
    const interval = this.intervals.get(key)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(key)
      this.callbacks.delete(key)
      console.log(`Background refresh unregistered for ${key}`)
    }
  }

  // Unregister all intervals
  unregisterAll() {
    this.intervals.forEach((interval, key) => {
      clearInterval(interval)
      console.log(`Background refresh unregistered for ${key}`)
    })
    this.intervals.clear()
    this.callbacks.clear()
  }

  // Get all registered keys
  getRegisteredKeys(): string[] {
    return Array.from(this.intervals.keys())
  }

  // Check if a key is registered
  isRegistered(key: string): boolean {
    return this.intervals.has(key)
  }
}

// Create singleton instance
export const backgroundRefreshService = new BackgroundRefreshService()

// Convenience functions
export const registerBackgroundRefresh = (
  key: string, 
  callback: () => void, 
  intervalMs: number = 30000
) => {
  backgroundRefreshService.register(key, callback, intervalMs)
}

export const unregisterBackgroundRefresh = (key: string) => {
  backgroundRefreshService.unregister(key)
}

export const unregisterAllBackgroundRefresh = () => {
  backgroundRefreshService.unregisterAll()
} 