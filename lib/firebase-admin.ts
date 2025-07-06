import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Initialize Firebase Admin SDK
let adminApp: any = null
let adminAuth: any = null
let adminDb: any = null

// Check if we have the required environment variables
const hasServiceAccountCredentials = process.env.FIREBASE_PRIVATE_KEY && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PROJECT_ID

// Debug environment variables
console.log('Firebase Admin SDK Debug:', {
  hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
  hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
  hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
  hasServiceAccountCredentials,
  appsLength: getApps().length
})

if (hasServiceAccountCredentials) {
  try {
    // Check if app is already initialized
    const apps = getApps()
    if (apps.length === 0) {
      console.log('Initializing Firebase Admin SDK with service account credentials')
      
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
      }

      adminApp = initializeApp({
        credential: cert(serviceAccount as any),
        projectId: process.env.FIREBASE_PROJECT_ID
      })
    } else {
      console.log('Firebase Admin SDK already initialized, using existing app')
      adminApp = apps[0]
    }

    // Initialize services
    adminAuth = getAuth(adminApp)
    adminDb = getFirestore(adminApp)
    
    // Configure Firestore to ignore undefined properties (only if not already configured)
    try {
      adminDb.settings({
        ignoreUndefinedProperties: true
      })
    } catch (error) {
      // Settings already configured, ignore the error
      console.log('Firestore settings already configured')
    }
    
    console.log('Firebase Admin SDK initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error)
    throw error
  }
} else {
  console.error('Firebase Admin SDK not properly configured. Please check your .env.local file')
  console.error('Required variables: FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_PROJECT_ID')
  console.error('Make sure you have created a .env.local file in your project root')
}

// Export the initialized services
export { adminAuth, adminDb }

// Helper function to ensure services are initialized
export const getAdminAuth = () => {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth not available. Please check your environment configuration.')
  }
  return adminAuth
}

export const getAdminDb = () => {
  if (!adminDb) {
    throw new Error('Firebase Admin DB not available. Please check your environment configuration.')
  }
  return adminDb
}

// Server-side authentication helper
export const verifyServerAuth = async (request: Request) => {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('No auth header provided')
    }
    const token = authHeader.split('Bearer ')[1]
    if (!adminAuth) throw new Error('Admin auth not available')
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error('Server auth verification failed:', error)
    throw error
  }
}

// Server-side admin check
export const isServerAdmin = async (uid: string): Promise<boolean> => {
  if (!adminDb) throw new Error('Admin DB not available')
  const userDoc = await adminDb.collection('users').doc(uid).get()
  return userDoc.exists && userDoc.data()?.isAdmin === true
}

// Check if user is read-only admin
export const isReadOnlyAdmin = async (uid: string): Promise<boolean> => {
  if (!adminDb) throw new Error('Admin DB not available')
  const userDoc = await adminDb.collection('users').doc(uid).get()
  if (!userDoc.exists) return false
  const userData = userDoc.data()
  return userData?.isAdmin === true && userData?.isReadOnly === true
}

// Check if user can perform write operations
export const canWrite = async (uid: string): Promise<boolean> => {
  if (!adminDb) throw new Error('Admin DB not available')
  const userDoc = await adminDb.collection('users').doc(uid).get()
  if (!userDoc.exists) return false
  const userData = userDoc.data()
  // Regular admins can write, read-only admins cannot
  return userData?.isAdmin === true && userData?.isReadOnly !== true
}

// Server-side user operations
export const getServerUser = async (userId: string) => {
  if (!adminDb) throw new Error('Admin DB not available')
  const userDoc = await adminDb.collection('users').doc(userId).get()
  if (userDoc.exists) {
    return { id: userDoc.id, ...userDoc.data() }
  }
  throw new Error("User not found")
}

export const updateServerUser = async (userId: string, data: any) => {
  if (!adminDb) throw new Error('Admin DB not available')
  await adminDb.collection('users').doc(userId).update({
    ...data,
    updatedAt: new Date().toISOString()
  })
}

export const createServerUser = async (userId: string, data: any) => {
  if (!adminDb) throw new Error('Admin DB not available')
  await adminDb.collection('users').doc(userId).set({
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

export const listServerUsers = async (filters: any = {}) => {
  if (!adminDb) throw new Error('Admin DB not available')
  let query: any = adminDb.collection('users')
  if (filters.status && filters.status !== 'all') {
    query = query.where('approvalStatus', '==', filters.status)
  }
  if (filters.role && filters.role !== 'all') {
    query = query.where('role', '==', filters.role)
  }
  query = query.orderBy('createdAt', 'desc')
  if (filters.limit) {
    query = query.limit(parseInt(filters.limit))
  }
  const snapshot = await query.get()
  return snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data()
  }))
}

// Get all admin users
export const getAllAdminUsers = async () => {
  if (!adminDb) throw new Error('Admin DB not available')
  const adminUsersSnapshot = await adminDb.collection('users')
    .where('isAdmin', '==', true)
    .get()
  
  return adminUsersSnapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data()
  }))
}

// Send notification to all admin users
export const sendNotificationToAllAdmins = async (notificationData: {
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info' | 'system'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
}) => {
  if (!adminDb) throw new Error('Admin DB not available')
  
  try {
    // Get all admin users
    const adminUsers = await getAllAdminUsers()
    
    if (adminUsers.length === 0) {
      console.log('No admin users found to send notification to')
      return []
    }
    
    // Create notifications for each admin user
    const notificationPromises = adminUsers.map(async (adminUser: any) => {
      const notificationRef = await adminDb.collection('notifications').add({
        ...notificationData,
        userId: adminUser.id,
        isRead: false,
        createdAt: new Date().toISOString()
      })
      return notificationRef.id
    })
    
    const notificationIds = await Promise.all(notificationPromises)
    console.log(`Sent notification to ${adminUsers.length} admin users`)
    return notificationIds
    
  } catch (error) {
    console.error('Error sending notification to admin users:', error)
    throw error
  }
} 