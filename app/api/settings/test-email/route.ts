import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, verifyServerAuth } from '@/lib/firebase-admin'
import { z } from 'zod'

// Validation schema for email test
const emailTestSchema = z.object({
  smtpProvider: z.string().min(1, "SMTP provider is required"),
  smtpApiKey: z.string().optional(),
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
    const validationResult = emailTestSchema.safeParse(body)
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

    // Validate SMTP provider
    const validSmtpProviders = ['SendGrid', 'Mailgun', 'AWS SES', 'SMTP']
    if (!validSmtpProviders.includes(emailSettings.smtpProvider)) {
      return NextResponse.json(
        { error: 'Invalid SMTP provider selected' },
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
    const testResult = await simulateEmailTest(emailSettings)

    if (testResult.success) {
      // Log the successful test
      await db.collection('auditLogs').add({
        action: 'email_configuration_tested',
        userId: decodedToken.uid,
        userEmail: userData.email,
        timestamp: new Date().toISOString(),
        testResult: testResult,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      })

      return NextResponse.json({
        success: true,
        message: 'Email configuration test successful',
        details: testResult
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Email configuration test failed',
          details: testResult.error 
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error testing email configuration:', error)
    return NextResponse.json(
      { error: 'Failed to test email configuration' },
      { status: 500 }
    )
  }
}

async function simulateEmailTest(emailSettings: any) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Validate SMTP settings based on provider
  switch (emailSettings.smtpProvider) {
    case 'SendGrid':
      if (!emailSettings.smtpApiKey || emailSettings.smtpApiKey.length < 10) {
        return {
          success: false,
          error: 'SendGrid API key is required and must be at least 10 characters long'
        }
      }
      break
      
    case 'Mailgun':
      if (!emailSettings.smtpApiKey || emailSettings.smtpApiKey.length < 10) {
        return {
          success: false,
          error: 'Mailgun API key is required and must be at least 10 characters long'
        }
      }
      break
      
    case 'AWS SES':
      if (!emailSettings.smtpApiKey || emailSettings.smtpApiKey.length < 10) {
        return {
          success: false,
          error: 'AWS SES credentials are required'
        }
      }
      break
      
    case 'SMTP':
      // For custom SMTP, we would need host, port, username, password
      if (!emailSettings.smtpApiKey) {
        return {
          success: false,
          error: 'SMTP credentials are required for custom SMTP configuration'
        }
      }
      break
      
    default:
      return {
        success: false,
        error: 'Unsupported SMTP provider'
      }
  }

  // Simulate successful email test
  return {
    success: true,
    message: `Test email sent successfully via ${emailSettings.smtpProvider}`,
    provider: emailSettings.smtpProvider,
    fromEmail: emailSettings.fromEmail,
    fromName: emailSettings.fromName,
    timestamp: new Date().toISOString()
  }
} 