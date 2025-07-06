import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Validate IP address against whitelist
    const ipAllowed = await authMiddleware.validateIPAddress(ipAddress)

    return NextResponse.json({
      ip: ipAddress,
      allowed: ipAllowed,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('IP validation error:', error)
    return NextResponse.json(
      { error: 'IP validation failed' },
      { status: 500 }
    )
  }
} 