"use client"

import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

export interface AnalyticsData {
  users: {
    total: number
    active: number
    newThisMonth: number
    growthRate: number
  }
  chatbots: {
    total: number
    active: number
    conversations: number
    avgResponseTime: number
  }
  conversations: {
    total: number
    thisMonth: number
    avgMessagesPerConversation: number
    satisfactionScore: number
  }
  revenue: {
    monthly: number
    growth: number
    subscriptions: number
    conversionRate: number
  }
  performance: {
    avgResponseTime: number
    uptime: number
    errorRate: number
    loadTime: number
  }
}

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

export interface AnalyticsState {
  overview: AnalyticsData | null
  userGrowth: TimeSeriesData[]
  chatbotUsage: TimeSeriesData[]
  revenue: TimeSeriesData[]
  performance: {
    responseTime: TimeSeriesData[]
    uptime: TimeSeriesData[]
    errorRate: TimeSeriesData[]
  } | null
  loading: boolean
  error: string | null
}

export function useAnalytics(timeRange: number = 30) {
  const { user } = useAuth()
  const [state, setState] = useState<AnalyticsState>({
    overview: null,
    userGrowth: [],
    chatbotUsage: [],
    revenue: [],
    performance: null,
    loading: true,
    error: null
  })

  const fetchAnalytics = async () => {
    if (!user) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const token = await user.getIdToken()
      const response = await fetch(`/api/analytics?days=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const data = await response.json()
      
      setState({
        overview: data.overview,
        userGrowth: data.userGrowth,
        chatbotUsage: data.chatbotUsage,
        revenue: data.revenue,
        performance: data.performance,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Analytics fetch error:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics'
      }))
    }
  }

  const trackEvent = async (event: string, data: any) => {
    if (!user) return

    try {
      const token = await user.getIdToken()
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event, data })
      })
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [user, timeRange])

  const refetch = () => {
    fetchAnalytics()
  }

  return {
    ...state,
    refetch,
    trackEvent
  }
}

export function useAnalyticsData(type: 'overview' | 'user-growth' | 'chatbot-usage' | 'revenue' | 'performance', timeRange: number = 30) {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const token = await user.getIdToken()
      const response = await fetch(`/api/analytics?type=${type}&days=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Analytics data fetch error:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user, type, timeRange])

  return { data, loading, error, refetch: fetchData }
} 