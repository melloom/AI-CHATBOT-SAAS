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
    const sessionId = request.headers.get('x-session-id') || decodedToken.uid

    // Validate session
    const sessionValidation = await authMiddleware.validateSession(sessionId)
    
    if (!sessionValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    // Check concurrent sessions
    const concurrentSessionsValid = await authMiddleware.checkConcurrentSessions(
      decodedToken.uid,
      sessionId
    )

    if (!concurrentSessionsValid) {
      return NextResponse.json(
        { error: 'Too many concurrent sessions' },
        { status: 429 }
      )
    }

    return NextResponse.json({
      valid: true,
      session: {
        sessionId,
        userId: decodedToken.uid,
        email: userData.email,
        isAdmin: userData.isAdmin || false,
        lastActivity: new Date().toISOString()
      },
      user: {
        uid: decodedToken.uid,
        email: userData.email,
        isAdmin: userData.isAdmin || false,
        emailVerified: userData.emailVerified || false,
        phoneVerified: userData.phoneVerified || false,
        twoFactorEnabled: userData.twoFactorEnabled || false,
        approvalStatus: userData.approvalStatus || 'pending'
      }
    })
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json(
      { error: 'Session validation failed' },
      { status: 401 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await verifyServerAuth(request)
    const db = getAdminDb()
    
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const sessionId = `${decodedToken.uid}_${Date.now()}`

    // Create new session
    await authMiddleware.createUserSession(
      decodedToken.uid,
      sessionId,
      ipAddress,
      userAgent
    )

    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Session created successfully'
    })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
} 