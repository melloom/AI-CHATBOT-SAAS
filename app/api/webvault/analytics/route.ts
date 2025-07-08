import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Verify the Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    // Get user data to check platform access
    const userDoc = await adminDb.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()
    
    // Check if user has WebVault access
    if (!userData?.platforms?.webvault?.status || userData.platforms.webvault.status !== 'active') {
      return NextResponse.json({ error: 'WebVault access required' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const selectedWebsite = searchParams.get('website') || 'all'
    const timeRange = searchParams.get('timeRange') || '7d'

    // Fetch analytics data from Firebase
    const analyticsData = await getAnalyticsData(userId, selectedWebsite, timeRange)

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getAnalyticsData(userId: string, selectedWebsite: string, timeRange: string) {
  try {
    // Get websites for this user
    const websitesQuery = adminDb.collection('websites').where('ownerId', '==', userId)
    const websitesSnapshot = await websitesQuery.get()
    
    const websites = websitesSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      name: doc.data().name || 'Unnamed Website',
      url: doc.data().url || '',
      visitors: doc.data().visitors || 0,
      pageViews: doc.data().pageViews || 0,
      bounceRate: doc.data().bounceRate || 0,
      avgSessionDuration: doc.data().avgSessionDuration || 0,
      conversionRate: doc.data().conversionRate || 0
    }))

    // Filter by selected website if not 'all'
    const filteredWebsites = selectedWebsite === 'all' 
      ? websites 
      : websites.filter(w => w.url === selectedWebsite)

    // Calculate aggregate analytics
    const analytics = {
      visitors: filteredWebsites.reduce((sum, w) => sum + w.visitors, 0),
      pageViews: filteredWebsites.reduce((sum, w) => sum + w.pageViews, 0),
      bounceRate: filteredWebsites.length > 0 
        ? filteredWebsites.reduce((sum, w) => sum + w.bounceRate, 0) / filteredWebsites.length 
        : 0,
      avgSessionDuration: filteredWebsites.length > 0 
        ? filteredWebsites.reduce((sum, w) => sum + w.avgSessionDuration, 0) / filteredWebsites.length 
        : 0,
      conversionRate: filteredWebsites.length > 0 
        ? filteredWebsites.reduce((sum, w) => sum + w.conversionRate, 0) / filteredWebsites.length 
        : 0,
      topPages: [], // No mock data, return empty array
      trafficSources: [], // No mock data, return empty array
      devices: [], // No mock data, return empty array
      timeSeries: [] // No mock data, return empty array
    }

    return analytics
  } catch (error) {
    console.error('Error getting analytics data:', error)
    return {
      visitors: 0,
      pageViews: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      conversionRate: 0,
      topPages: [],
      trafficSources: [],
      devices: [],
      timeSeries: []
    }
  }
} 