import { NextRequest, NextResponse } from 'next/server'
import { verifyServerAuth, isServerAdmin } from '@/lib/firebase-admin'
import { 
  getAnalyticsData, 
  getUserGrowthData, 
  getChatbotUsageData, 
  getRevenueData, 
  getPerformanceMetrics,
  trackEvent
} from '@/lib/analytics-server'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await verifyServerAuth(request)
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin for analytics access
    const isAdmin = await isServerAdmin(decodedToken.uid)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const type = searchParams.get('type')

    let data: any = {}

    if (type === 'user-growth') {
      data = await getUserGrowthData(days)
    } else if (type === 'chatbot-usage') {
      data = await getChatbotUsageData(days)
    } else if (type === 'revenue') {
      data = await getRevenueData(12) // Always get 12 months for revenue
    } else if (type === 'performance') {
      data = await getPerformanceMetrics()
    } else {
      // Get all analytics data
      const [
        overview,
        userGrowth,
        chatbotUsage,
        revenue,
        performance
      ] = await Promise.all([
        getAnalyticsData(),
        getUserGrowthData(days),
        getChatbotUsageData(days),
        getRevenueData(12),
        getPerformanceMetrics()
      ])

      data = {
        overview,
        userGrowth,
        chatbotUsage,
        revenue,
        performance
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await verifyServerAuth(request)
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { event, data } = body

    if (!event) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 })
    }

    // Track the event
    await trackEvent(event, {
      ...data,
      userId: decodedToken.uid,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
} 