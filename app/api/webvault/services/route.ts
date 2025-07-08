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

    // Fetch services from Firebase
    const services = await getServices(userId)

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getServices(userId: string) {
  try {
    // Get services for this user
    const servicesQuery = adminDb.collection('services').where('ownerId', '==', userId)
    const servicesSnapshot = await servicesQuery.get()
    
    const services = servicesSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      name: doc.data().name || 'Unnamed Service',
      description: doc.data().description || '',
      category: doc.data().category || 'development',
      status: doc.data().status || 'draft',
      price: doc.data().price || 0,
      priceType: doc.data().priceType || 'fixed',
      duration: doc.data().duration || 'Varies',
      features: doc.data().features || [],
      popularity: doc.data().popularity || 0,
      rating: doc.data().rating || 0,
      reviews: doc.data().reviews || 0,
      createdAt: doc.data().createdAt || new Date().toISOString(),
      updatedAt: doc.data().updatedAt || new Date().toISOString()
    }))

    return services
  } catch (error) {
    console.error('Error getting services:', error)
    return []
  }
} 