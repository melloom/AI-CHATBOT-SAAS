"use client"

import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

export interface WebVaultStats {
  projectsCompleted: number
  happyClients: number
  yearsExperience: number
  successRate: number
  totalWebsites: number
  activeWebsites: number
  maintenanceWebsites: number
  developmentWebsites: number
  totalServices: number
  activeServices: number
  draftServices: number
  totalRevenue: number
  platformStats: {
    activeWebsites: number
    totalStorage: number
    sslCertificates: number
    uptime: number
  }
}

export interface Website {
  id: string
  name: string
  url: string
  status: 'active' | 'maintenance' | 'offline' | 'development'
  type: 'ecommerce' | 'business' | 'portfolio' | 'blog'
  visitors: number
  pageViews: number
  lastUpdated: string
  uptime: number
  sslEnabled: boolean
  storageUsed: number
}

export interface Service {
  id: string
  name: string
  description: string
  category: 'web-design' | 'development' | 'hosting' | 'maintenance' | 'seo' | 'consulting'
  status: 'active' | 'inactive' | 'draft'
  price: number
  priceType: 'hourly' | 'fixed' | 'monthly'
  duration: string
  features: string[]
  popularity: number
  rating: number
  reviews: number
  createdAt: string
  updatedAt: string
}

export interface AnalyticsData {
  visitors: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: number
  conversionRate: number
  topPages: Array<{ page: string; views: number; percentage: number }>
  trafficSources: Array<{ source: string; visitors: number; percentage: number }>
  devices: Array<{ device: string; visitors: number; percentage: number }>
  timeSeries: Array<{ date: string; visitors: number; pageViews: number }>
}

export function useWebVaultStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<WebVaultStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const token = await user.getIdToken()
      const response = await fetch('/api/webvault/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch WebVault stats')
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('WebVault stats fetch error:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [user])

  return { stats, loading, error, refetch: fetchStats }
}

export function useWebVaultWebsites() {
  const { user } = useAuth()
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWebsites = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const token = await user.getIdToken()
      const response = await fetch('/api/webvault/websites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch websites')
      }

      const data = await response.json()
      setWebsites(data.websites)
    } catch (error) {
      console.error('Websites fetch error:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch websites')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWebsites()
  }, [user])

  return { websites, loading, error, refetch: fetchWebsites }
}

export function useWebVaultServices() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const token = await user.getIdToken()
      const response = await fetch('/api/webvault/services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch services')
      }

      const data = await response.json()
      setServices(data.services)
    } catch (error) {
      console.error('Services fetch error:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [user])

  return { services, loading, error, refetch: fetchServices }
}

export function useWebVaultAnalytics(selectedWebsite: string = 'all', timeRange: string = '7d') {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const token = await user.getIdToken()
      const response = await fetch(`/api/webvault/analytics?website=${selectedWebsite}&timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Analytics fetch error:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [user, selectedWebsite, timeRange])

  return { analytics, loading, error, refetch: fetchAnalytics }
} 