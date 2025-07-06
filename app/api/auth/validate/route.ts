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
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Validate authentication with security settings
    const validation = await authMiddleware.validateAuthentication(
      { uid: decodedToken.uid, email: userData.email, emailVerified: userData.emailVerified || false } as any,
      ipAddress,
      userAgent
    )

    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Authentication validation failed',
          details: validation.errors,
          warnings: validation.warnings
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      valid: true,
      user: {
        uid: decodedToken.uid,
        email: userData.email,
        isAdmin: userData.isAdmin || false,
        emailVerified: userData.emailVerified || false,
        phoneVerified: userData.phoneVerified || false,
        twoFactorEnabled: userData.twoFactorEnabled || false,
        approvalStatus: userData.approvalStatus || 'pending'
      },
      security: {
        ipAllowed: validation.errors.length === 0,
        emailVerified: userData.emailVerified || false,
        phoneVerified: userData.phoneVerified || false,
        twoFactorEnabled: userData.twoFactorEnabled || false
      }
    })
  } catch (error) {
    console.error('Authentication validation error:', error)
    return NextResponse.json(
      { error: 'Authentication validation failed' },
      { status: 401 }
    )
  }
} 