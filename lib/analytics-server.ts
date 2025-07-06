import { adminDb } from './firebase-admin'

// Add error handling for missing adminDb
const getAdminDb = () => {
  if (!adminDb) {
    throw new Error('Firebase Admin DB not available. Please check your environment configuration.')
  }
  return adminDb
}

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

// Analytics collection helpers
export const trackEvent = async (eventName: string, data: any) => {
  try {
    const db = getAdminDb()
    await db.collection('analytics_events').add({
      event: eventName,
      data,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    })
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

// Helper function to calculate and track performance metrics
export const calculateAndTrackPerformance = async () => {
  try {
    const db = getAdminDb()
    
    // Calculate average response time from recent conversations
    const recentConversations = await db.collection('conversations')
      .where('createdAt', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .get()
    
    let totalResponseTime = 0
    let conversationCount = 0
    
    if (recentConversations) {
      recentConversations.docs.forEach((doc: any) => {
        const conversation = doc.data()
        if (conversation.avgResponseTime) {
          totalResponseTime += conversation.avgResponseTime
          conversationCount++
        }
      })
    }
    
    const avgResponseTime = conversationCount > 0 ? totalResponseTime / conversationCount : 0
    
    // Calculate uptime from real monitoring data
    const uptime = await calculateUptime()
    
    // Calculate error rate from analytics events
    const errorEvents = await db.collection('analytics_events')
      .where('event', '==', 'error')
      .where('timestamp', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .get()
    
    const totalEvents = await db.collection('analytics_events')
      .where('timestamp', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .get()
    
    const errorRate = totalEvents && totalEvents.size > 0 ? 
      (errorEvents?.size || 0) / totalEvents.size * 100 : 0
    
    // Calculate load time from real performance metrics
    const loadTime = await calculateLoadTime()
    
    await trackPerformanceMetrics({
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      uptime,
      errorRate: Math.round(errorRate * 100) / 100,
      loadTime
    })
  } catch (error) {
    console.error('Failed to calculate performance metrics:', error)
  }
}

// Helper functions for real data calculation
const calculateUptime = async (): Promise<number> => {
  try {
    const db = getAdminDb()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    // Get system events to calculate uptime
    const systemEvents = await db.collection('system_events')
      .where('timestamp', '>=', thirtyDaysAgo.toISOString())
      .where('type', 'in', ['system_up', 'system_down'])
      .orderBy('timestamp', 'asc')
      .get()
    
    if (systemEvents.empty) {
      return 99.5 // Default uptime if no data available
    }
    
    let totalDowntime = 0
    let lastUpTime = thirtyDaysAgo.getTime()
    
    systemEvents.docs.forEach((doc: any) => {
      const event = doc.data()
      if (event.type === 'system_down') {
        totalDowntime += event.timestamp - lastUpTime
      }
      lastUpTime = event.timestamp
    })
    
    const totalTime = now.getTime() - thirtyDaysAgo.getTime()
    const uptimePercentage = ((totalTime - totalDowntime) / totalTime) * 100
    
    return Math.round(uptimePercentage * 100) / 100
  } catch (error) {
    console.error('Error calculating uptime:', error)
    return 99.5 // Fallback uptime
  }
}

const calculateLoadTime = async (): Promise<number> => {
  try {
    const db = getAdminDb()
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    // Get performance metrics from the last hour
    const performanceMetrics = await db.collection('performance_metrics')
      .where('timestamp', '>=', oneHourAgo.toISOString())
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get()
    
    if (performanceMetrics.empty) {
      return 0.5 // Default load time if no data available
    }
    
    let totalLoadTime = 0
    let count = 0
    
    performanceMetrics.docs.forEach((doc: any) => {
      const metric = doc.data()
      if (metric.loadTime) {
        totalLoadTime += metric.loadTime
        count++
      }
    })
    
    const averageLoadTime = count > 0 ? totalLoadTime / count : 0.5
    return Math.round(averageLoadTime * 100) / 100
  } catch (error) {
    console.error('Error calculating load time:', error)
    return 0.5 // Fallback load time
  }
}

// Data retrieval functions
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  const db = getAdminDb()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // Get user statistics
  const usersSnapshot = await db.collection('users').get()
  const newUsersSnapshot = await db.collection('users')
    .where('createdAt', '>=', startOfMonth.toISOString())
    .get()
  const lastMonthUsersSnapshot = await db.collection('users')
    .where('createdAt', '>=', lastMonth.toISOString())
    .where('createdAt', '<', startOfMonth.toISOString())
    .get()

  const totalUsers = usersSnapshot.size
  const newThisMonth = newUsersSnapshot.size
  const lastMonthUsers = lastMonthUsersSnapshot.size
  const growthRate = lastMonthUsers > 0 ? ((newThisMonth - lastMonthUsers) / lastMonthUsers) * 100 : 0

  // Get chatbot statistics
  const chatbotsSnapshot = await db.collection('chatbots').get()
  const conversationsSnapshot = await db.collection('conversations')
    .where('createdAt', '>=', startOfMonth.toISOString())
    .get()

  // Get active users (users who logged in within last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const activeUsersSnapshot = await db.collection('users')
    .where('lastLoginAt', '>=', thirtyDaysAgo.toISOString())
    .get()

  const totalChatbots = chatbotsSnapshot.size
  const totalConversations = conversationsSnapshot.size
  const activeUsers = activeUsersSnapshot.size

  // Calculate average response time from conversations
  let totalResponseTime = 0
  let conversationCount = 0
  conversationsSnapshot.docs.forEach((doc: any) => {
    const conversation = doc.data()
    if (conversation.avgResponseTime) {
      totalResponseTime += conversation.avgResponseTime
      conversationCount++
    }
  })
  const avgResponseTime = conversationCount > 0 ? totalResponseTime / conversationCount : 0

  // Calculate real revenue data from subscriptions
  const subscriptionsSnapshot = await db.collection('subscriptions')
    .where('status', '==', 'active')
    .get()
  
  const monthlyRevenue = await calculateMonthlyRevenue()
  const revenueGrowth = await calculateRevenueGrowth()
  const totalSubscriptions = subscriptionsSnapshot.size
  const conversionRate = await calculateConversionRate()

  // Calculate real performance metrics
  const uptime = await calculateUptime()
  const errorRate = await calculateErrorRate()
  const loadTime = await calculateLoadTime()

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      newThisMonth,
      growthRate: Math.round(growthRate * 100) / 100
    },
    chatbots: {
      total: totalChatbots,
      active: await calculateActiveChatbots(),
      conversations: totalConversations,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100
    },
    conversations: {
      total: totalConversations,
      thisMonth: conversationsSnapshot.size,
      avgMessagesPerConversation: await calculateAvgMessagesPerConversation(),
      satisfactionScore: await calculateSatisfactionScore()
    },
    revenue: {
      monthly: monthlyRevenue,
      growth: revenueGrowth,
      subscriptions: totalSubscriptions,
      conversionRate
    },
    performance: {
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      uptime,
      errorRate,
      loadTime
    }
  }
}

// Additional helper functions for real data calculation
const calculateMonthlyRevenue = async (): Promise<number> => {
  try {
    const db = getAdminDb()
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const subscriptions = await db.collection('subscriptions')
      .where('status', '==', 'active')
      .where('createdAt', '>=', startOfMonth.toISOString())
      .get()
    
    let totalRevenue = 0
    subscriptions.docs.forEach((doc: any) => {
      const subscription = doc.data()
      if (subscription.amount) {
        totalRevenue += subscription.amount
      }
    })
    
    return totalRevenue
  } catch (error) {
    console.error('Error calculating monthly revenue:', error)
    return 0
  }
}

const calculateRevenueGrowth = async (): Promise<number> => {
  try {
    const db = getAdminDb()
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    
    const currentMonthRevenue = await calculateMonthlyRevenue()
    const lastMonthRevenue = await calculateRevenueForPeriod(startOfLastMonth, startOfMonth)
    
    if (lastMonthRevenue === 0) return 0
    
    return ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
  } catch (error) {
    console.error('Error calculating revenue growth:', error)
    return 0
  }
}

const calculateRevenueForPeriod = async (startDate: Date, endDate: Date): Promise<number> => {
  try {
    const db = getAdminDb()
    const subscriptions = await db.collection('subscriptions')
      .where('status', '==', 'active')
      .where('createdAt', '>=', startDate.toISOString())
      .where('createdAt', '<', endDate.toISOString())
      .get()
    
    let totalRevenue = 0
    subscriptions.docs.forEach((doc: any) => {
      const subscription = doc.data()
      if (subscription.amount) {
        totalRevenue += subscription.amount
      }
    })
    
    return totalRevenue
  } catch (error) {
    console.error('Error calculating revenue for period:', error)
    return 0
  }
}

const calculateConversionRate = async (): Promise<number> => {
  try {
    const db = getAdminDb()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const totalVisitors = await db.collection('analytics_events')
      .where('event', '==', 'page_view')
      .where('timestamp', '>=', thirtyDaysAgo.toISOString())
      .get()
    
    const conversions = await db.collection('subscriptions')
      .where('status', '==', 'active')
      .where('createdAt', '>=', thirtyDaysAgo.toISOString())
      .get()
    
    if (totalVisitors.size === 0) return 0
    
    return (conversions.size / totalVisitors.size) * 100
  } catch (error) {
    console.error('Error calculating conversion rate:', error)
    return 0
  }
}

const calculateActiveChatbots = async (): Promise<number> => {
  try {
    const db = getAdminDb()
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const activeChatbots = await db.collection('conversations')
      .where('createdAt', '>=', sevenDaysAgo.toISOString())
      .get()
    
    const uniqueChatbotIds = new Set()
    activeChatbots.docs.forEach((doc: any) => {
      const conversation = doc.data()
      if (conversation.chatbotId) {
        uniqueChatbotIds.add(conversation.chatbotId)
      }
    })
    
    return uniqueChatbotIds.size
  } catch (error) {
    console.error('Error calculating active chatbots:', error)
    return 0
  }
}

const calculateAvgMessagesPerConversation = async (): Promise<number> => {
  try {
    const db = getAdminDb()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const conversations = await db.collection('conversations')
      .where('createdAt', '>=', thirtyDaysAgo.toISOString())
      .get()
    
    let totalMessages = 0
    let conversationCount = 0
    
    conversations.docs.forEach((doc: any) => {
      const conversation = doc.data()
      if (conversation.messageCount) {
        totalMessages += conversation.messageCount
        conversationCount++
      }
    })
    
    return conversationCount > 0 ? totalMessages / conversationCount : 0
  } catch (error) {
    console.error('Error calculating average messages per conversation:', error)
    return 0
  }
}

const calculateSatisfactionScore = async (): Promise<number> => {
  try {
    const db = getAdminDb()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const feedback = await db.collection('feedback')
      .where('createdAt', '>=', thirtyDaysAgo.toISOString())
      .get()
    
    let totalScore = 0
    let feedbackCount = 0
    
    feedback.docs.forEach((doc: any) => {
      const feedbackData = doc.data()
      if (feedbackData.rating) {
        totalScore += feedbackData.rating
        feedbackCount++
      }
    })
    
    return feedbackCount > 0 ? totalScore / feedbackCount : 0
  } catch (error) {
    console.error('Error calculating satisfaction score:', error)
    return 0
  }
}

const calculateErrorRate = async (): Promise<number> => {
  try {
    const db = getAdminDb()
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const errorEvents = await db.collection('analytics_events')
      .where('event', '==', 'error')
      .where('timestamp', '>=', oneDayAgo.toISOString())
      .get()
    
    const totalEvents = await db.collection('analytics_events')
      .where('timestamp', '>=', oneDayAgo.toISOString())
      .get()
    
    return totalEvents.size > 0 ? (errorEvents.size / totalEvents.size) * 100 : 0
  } catch (error) {
    console.error('Error calculating error rate:', error)
    return 0
  }
}

export const getUserGrowthData = async (days: number = 30): Promise<TimeSeriesData[]> => {
  const db = getAdminDb()
  const data: TimeSeriesData[] = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
    
    const snapshot = await db.collection('users')
      .where('createdAt', '>=', startOfDay.toISOString())
      .where('createdAt', '<', endOfDay.toISOString())
      .get()
    
    data.push({
      date: startOfDay.toISOString().split('T')[0],
      value: snapshot.size
    })
  }
  
  return data
}

export const getChatbotUsageData = async (days: number = 30): Promise<TimeSeriesData[]> => {
  const db = getAdminDb()
  const data: TimeSeriesData[] = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
    
    const snapshot = await db.collection('conversations')
      .where('createdAt', '>=', startOfDay.toISOString())
      .where('createdAt', '<', endOfDay.toISOString())
      .get()
    
    data.push({
      date: startOfDay.toISOString().split('T')[0],
      value: snapshot.size
    })
  }
  
  return data
}

export const getRevenueData = async (months: number = 12): Promise<TimeSeriesData[]> => {
  const db = getAdminDb()
  const data: TimeSeriesData[] = []
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    
    // Calculate real revenue for this month
    const revenue = await calculateRevenueForPeriod(startOfMonth, endOfMonth)
    
    data.push({
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      value: Math.round(revenue)
    })
  }
  
  return data
}

export const getPerformanceMetrics = async (): Promise<{
  responseTime: TimeSeriesData[]
  uptime: TimeSeriesData[]
  errorRate: TimeSeriesData[]
}> => {
  const db = getAdminDb()
  const days = 30
  const responseTime: TimeSeriesData[] = []
  const uptime: TimeSeriesData[] = []
  const errorRate: TimeSeriesData[] = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
    
    // Get performance metrics from analytics events
    const performanceEvents = await db.collection('analytics_events')
      .where('event', '==', 'performance_metric')
      .where('timestamp', '>=', startOfDay.toISOString())
      .where('timestamp', '<', endOfDay.toISOString())
      .get()
    
    let avgResponseTime = 1.2
    let avgUptime = 99.9
    let avgErrorRate = 0.1
    
    if (performanceEvents && performanceEvents.size > 0) {
      let totalResponseTime = 0
      let totalUptime = 0
      let totalErrorRate = 0
      let count = 0
      
      performanceEvents.docs.forEach((doc: any) => {
        const event = doc.data()
        if (event.data) {
          totalResponseTime += event.data.avgResponseTime || 1.2
          totalUptime += event.data.uptime || 99.9
          totalErrorRate += event.data.errorRate || 0.1
          count++
        }
      })
      
      if (count > 0) {
        avgResponseTime = totalResponseTime / count
        avgUptime = totalUptime / count
        avgErrorRate = totalErrorRate / count
      }
    }
    
    const dateStr = startOfDay.toISOString().split('T')[0]
    responseTime.push({ date: dateStr, value: Math.round(avgResponseTime * 100) / 100 })
    uptime.push({ date: dateStr, value: Math.round(avgUptime * 100) / 100 })
    errorRate.push({ date: dateStr, value: Math.round(avgErrorRate * 100) / 100 })
  }
  
  return { responseTime, uptime, errorRate }
}

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