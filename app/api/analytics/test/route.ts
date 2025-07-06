import { NextRequest, NextResponse } from 'next/server'
import { verifyServerAuth, isServerAdmin } from '@/lib/firebase-admin'
import { calculateAndTrackPerformance } from '@/lib/analytics-server'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await verifyServerAuth(request)
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isServerAdmin(decodedToken.uid)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Calculate and track performance metrics
    await calculateAndTrackPerformance()

    return NextResponse.json({ 
      success: true, 
      message: 'Performance metrics calculated and tracked successfully' 
    })
  } catch (error) {
    console.error('Test analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate performance metrics' },
      { status: 500 }
    )
  }
} 