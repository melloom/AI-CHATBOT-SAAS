"use client"

import { useCallback, useRef, useState, useEffect } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export function usePerformanceCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
) {
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map())

  const getCachedData = useCallback((cacheKey: string): T | null => {
    const entry = cacheRef.current.get(cacheKey)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      cacheRef.current.delete(cacheKey)
      return null
    }

    return entry.data
  }, [])

  const setCachedData = useCallback((cacheKey: string, data: T, customTtl?: number) => {
    cacheRef.current.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || ttl
    })
  }, [ttl])

  const fetchWithCache = useCallback(async (): Promise<T> => {
    const cached = getCachedData(key)
    if (cached) {
      return cached
    }

    const data = await fetcher()
    setCachedData(key, data)
    return data
  }, [key, fetcher, getCachedData, setCachedData])

  const invalidateCache = useCallback((cacheKey?: string) => {
    if (cacheKey) {
      cacheRef.current.delete(cacheKey)
    } else {
      cacheRef.current.clear()
    }
  }, [])

  return {
    fetchWithCache,
    getCachedData: () => getCachedData(key),
    setCachedData: (data: T, customTtl?: number) => setCachedData(key, data, customTtl),
    invalidateCache: () => invalidateCache(key),
    clearAllCache: () => invalidateCache()
  }
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  return useCallback(
    ((...args: any[]) => {
      const now = Date.now()

      if (now - lastRun.current >= delay) {
        callback(...args)
        lastRun.current = now
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args)
          lastRun.current = Date.now()
        }, delay - (now - lastRun.current))
      }
    }) as T,
    [callback, delay]
  )
} 