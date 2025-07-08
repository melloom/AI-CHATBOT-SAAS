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

    // Fetch websites from Firebase
    const websites = await getWebsites(userId)

    return NextResponse.json({ websites })
  } catch (error) {
    console.error('Error fetching websites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getWebsites(userId: string) {
  try {
    // Get websites for this user
    const websitesQuery = adminDb.collection('websites').where('ownerId', '==', userId)
    const websitesSnapshot = await websitesQuery.get()
    
    const websites = websitesSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      name: doc.data().name || 'Unnamed Website',
      url: doc.data().url || '',
      status: doc.data().status || 'development',
      type: doc.data().type || 'business',
      visitors: doc.data().visitors || 0,
      pageViews: doc.data().pageViews || 0,
      lastUpdated: doc.data().lastUpdated || new Date().toISOString(),
      uptime: doc.data().uptime || 99.9,
      sslEnabled: doc.data().sslEnabled || false,
      storageUsed: doc.data().storageUsed || 0
    }))

    return websites
  } catch (error) {
    console.error('Error getting websites:', error)
    return []
  }
} 