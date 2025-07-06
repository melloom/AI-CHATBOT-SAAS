// Client-safe analytics interfaces and types
// Server-side analytics functions are in analytics-server.ts

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

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
    fill?: boolean
  }[]
}

// Client-side analytics tracking functions
export const trackEvent = async (eventName: string, data: any) => {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event: eventName, data })
    })
    
    if (!response.ok) {
      throw new Error('Failed to track event')
    }
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}

export const trackUserActivity = async (userId: string, activity: string, metadata?: any) => {
  await trackEvent('user_activity', {
    userId,
    activity,
    metadata
  })
}

export const trackChatbotUsage = async (chatbotId: string, companyId: string, action: string, metadata?: any) => {
  await trackEvent('chatbot_usage', {
    chatbotId,
    companyId,
    action,
    metadata
  })
}

export const trackConversation = async (conversationId: string, chatbotId: string, messageCount: number, duration: number) => {
  await trackEvent('conversation', {
    conversationId,
    chatbotId,
    messageCount,
    duration,
    timestamp: new Date().toISOString()
  })
}

export const trackPerformanceMetrics = async (metrics: {
  avgResponseTime: number
  uptime: number
  errorRate: number
  loadTime: number
}) => {
  await trackEvent('performance_metric', {
    ...metrics,
    timestamp: new Date().toISOString()
  })
}

// Client-side data formatting functions
export const formatChartData = (timeSeriesData: TimeSeriesData[], label: string): ChartData => {
  return {
    labels: timeSeriesData.map(item => item.date),
    datasets: [{
      label,
      data: timeSeriesData.map(item => item.value),
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      fill: true
    }]
  }
}

export const formatMultiLineChartData = (
  datasets: { data: TimeSeriesData[], label: string, color: string }[]
): ChartData => {
  return {
    labels: datasets[0]?.data.map(item => item.date) || [],
    datasets: datasets.map(dataset => ({
      label: dataset.label,
      data: dataset.data.map(item => item.value),
      backgroundColor: dataset.color + '20',
      borderColor: dataset.color,
      borderWidth: 2,
      fill: false
    }))
  }
} 