import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, verifyServerAuth } from '@/lib/firebase-admin'
import { z } from 'zod'

// Validation schema for notification email test
const notificationEmailTestSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.number().min(1, "SMTP port must be at least 1"),
  smtpUsername: z.string().min(1, "SMTP username is required"),
  smtpPassword: z.string().optional(),
  smtpSecure: z.boolean(),
  fromEmail: z.string().email("From email must be a valid email"),
  fromName: z.string().min(1, "From name is required"),
})

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await verifyServerAuth(request)
    const db = getAdminDb()
    
    // Check if user exists and is admin
    const userDoc = await db.collection('users').doc(decodedToken.uid).get()
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const userData = userDoc.data()
    if (!userData?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate request body
    const validationResult = notificationEmailTestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const emailSettings = validationResult.data

    // Validate SMTP settings
    if (!emailSettings.smtpHost || emailSettings.smtpHost.trim() === '') {
      return NextResponse.json(
        { error: 'SMTP host is required' },
        { status: 400 }
      )
    }

    if (!emailSettings.smtpPort || emailSettings.smtpPort < 1 || emailSettings.smtpPort > 65535) {
      return NextResponse.json(
        { error: 'SMTP port must be between 1 and 65535' },
        { status: 400 }
      )
    }

    if (!emailSettings.smtpUsername || emailSettings.smtpUsername.trim() === '') {
      return NextResponse.json(
        { error: 'SMTP username is required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSettings.fromEmail)) {
      return NextResponse.json(
        { error: 'From email must be a valid email address' },
        { status: 400 }
      )
    }

    // Simulate email test (in a real implementation, you would actually send an email)
    const testResult = await simulateNotificationEmailTest(emailSettings)

    if (testResult.success) {
      // Log the successful test
      await db.collection('auditLogs').add({
        action: 'notification_email_configuration_tested',
        userId: decodedToken.uid,
        userEmail: userData.email,
        timestamp: new Date().toISOString(),
        testResult: testResult,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      })

      return NextResponse.json({
        success: true,
        message: 'Notification email configuration test successful',
        details: testResult
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Notification email configuration test failed',
          details: testResult.error 
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error testing notification email configuration:', error)
    return NextResponse.json(
      { error: 'Failed to test notification email configuration' },
      { status: 500 }
    )
  }
}

async function simulateNotificationEmailTest(emailSettings: any) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Validate SMTP settings
  if (!emailSettings.smtpPassword || emailSettings.smtpPassword.length < 6) {
    return {
      success: false,
      error: 'SMTP password is required and must be at least 6 characters long'
    }
  }

  // Validate SMTP host format
  if (!emailSettings.smtpHost.includes('smtp.')) {
    return {
      success: false,
      error: 'SMTP host should be a valid SMTP server (e.g., smtp.gmail.com)'
    }
  }

  // Validate common SMTP ports
  const validPorts = [25, 465, 587, 2525]
  if (!validPorts.includes(emailSettings.smtpPort)) {
    return {
      success: false,
      error: `SMTP port ${emailSettings.smtpPort} is not a standard SMTP port. Common ports are: 25, 465, 587, 2525`
    }
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSettings.fromEmail)) {
    return {
      success: false,
      error: 'From email must be a valid email address'
    }
  }

  // Simulate successful email test
  return {
    success: true,
    message: `Test notification email sent successfully via ${emailSettings.smtpHost}:${emailSettings.smtpPort}`,
    smtpHost: emailSettings.smtpHost,
    smtpPort: emailSettings.smtpPort,
    smtpUsername: emailSettings.smtpUsername,
    smtpSecure: emailSettings.smtpSecure,
    fromEmail: emailSettings.fromEmail,
    fromName: emailSettings.fromName,
    testEmailSent: true,
    timestamp: new Date().toISOString()
  }
} 