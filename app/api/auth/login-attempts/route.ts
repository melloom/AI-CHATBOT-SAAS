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

    // Check login attempts
    const loginCheck = await authMiddleware.checkLoginAttempts(
      userData.email,
      ipAddress
    )

    return NextResponse.json({
      email: userData.email,
      ipAddress,
      allowed: loginCheck.allowed,
      remainingAttempts: loginCheck.remainingAttempts,
      lockoutUntil: loginCheck.lockoutUntil?.toISOString(),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Login attempts check error:', error)
    return NextResponse.json(
      { error: 'Failed to check login attempts' },
      { status: 500 }
    )
  }
} 