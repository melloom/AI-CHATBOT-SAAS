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

    // Fetch WebVault stats from Firebase
    const stats = await getWebVaultStats(userId)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching WebVault stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getWebVaultStats(userId: string) {
  try {
    // Get user's companies (for business accounts)
    const companiesQuery = adminDb.collection('companies').where('ownerId', '==', userId)
    const companiesSnapshot = await companiesQuery.get()
    
    // Get websites for this user/company
    const websitesQuery = adminDb.collection('websites').where('ownerId', '==', userId)
    const websitesSnapshot = await websitesQuery.get()
    
    // Get services for this user/company
    const servicesQuery = adminDb.collection('services').where('ownerId', '==', userId)
    const servicesSnapshot = await servicesQuery.get()
    
    // Calculate stats
    const websites = websitesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const companies = companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Calculate dashboard stats
    const stats = {
      projectsCompleted: websites.filter(w => w.status === 'completed').length,
      happyClients: companies.length,
      yearsExperience: calculateYearsExperience(userId),
      successRate: calculateSuccessRate(websites),
      totalWebsites: websites.length,
      activeWebsites: websites.filter(w => w.status === 'active').length,
      maintenanceWebsites: websites.filter(w => w.status === 'maintenance').length,
      developmentWebsites: websites.filter(w => w.status === 'development').length,
      totalServices: services.length,
      activeServices: services.filter(s => s.status === 'active').length,
      draftServices: services.filter(s => s.status === 'draft').length,
      totalRevenue: services.filter(s => s.status === 'active').reduce((sum, s) => sum + (s.price || 0), 0),
      platformStats: {
        activeWebsites: websites.filter(w => w.status === 'active').length,
        totalStorage: calculateTotalStorage(websites),
        sslCertificates: websites.filter(w => w.sslEnabled).length,
        uptime: calculateAverageUptime(websites)
      }
    }

    return stats
  } catch (error) {
    console.error('Error calculating WebVault stats:', error)
    // Return default stats if there's an error
    return {
      projectsCompleted: 0,
      happyClients: 0,
      yearsExperience: 0,
      successRate: 0,
      totalWebsites: 0,
      activeWebsites: 0,
      maintenanceWebsites: 0,
      developmentWebsites: 0,
      totalServices: 0,
      activeServices: 0,
      draftServices: 0,
      totalRevenue: 0,
      platformStats: {
        activeWebsites: 0,
        totalStorage: 0,
        sslCertificates: 0,
        uptime: 99.9
      }
    }
  }
}

function calculateYearsExperience(userId: string): number {
  // TODO: Implement based on user registration date or profile data
  return 2 // Default value
}

function calculateSuccessRate(websites: any[]): number {
  if (websites.length === 0) return 0
  const completed = websites.filter(w => w.status === 'completed').length
  return Math.round((completed / websites.length) * 100)
}

function calculateTotalStorage(websites: any[]): number {
  // TODO: Implement based on actual storage usage
  return websites.length * 100 // Mock calculation: 100MB per website
}

function calculateAverageUptime(websites: any[]): number {
  if (websites.length === 0) return 99.9
  // TODO: Implement based on actual uptime monitoring
  return 99.9 // Default value
} 