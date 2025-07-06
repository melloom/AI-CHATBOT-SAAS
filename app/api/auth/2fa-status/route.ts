import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, verifyServerAuth } from '@/lib/firebase-admin'
import { authMiddleware } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await verifyServerAuth(request)
    const db = getAdminDb()
    
    // Check if user exists
    const userDoc = await db.collection('users').doc(decodedToken.uid).get()
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const userData = userDoc.data()

    // Check 2FA status
    const twoFactorValid = await authMiddleware.validateTwoFactorAuth({
      uid: decodedToken.uid,
      email: userData.email,
      emailVerified: userData.emailVerified || false
    } as any)

    return NextResponse.json({
      enabled: userData.twoFactorEnabled || false,
      verified: userData.twoFactorVerified || false,
      required: twoFactorValid,
      email: userData.email,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('2FA status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check 2FA status' },
      { status: 500 }
    )
  }
} 