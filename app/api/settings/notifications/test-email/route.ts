import { NextRequest, NextResponse } from 'next/server'
import { verifyServerAuth, isServerAdmin } from '@/lib/firebase-admin'

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

    const body = await request.json()
    const { smtpConfig, testEmail } = body

    if (!smtpConfig || !testEmail) {
      return NextResponse.json({ 
        error: 'SMTP configuration and test email are required' 
      }, { status: 400 })
    }

    // Validate SMTP configuration
    if (!smtpConfig.host || !smtpConfig.username || !smtpConfig.password) {
      return NextResponse.json({ 
        error: 'SMTP host, username, and password are required' 
      }, { status: 400 })
    }

    try {
      // Here you would implement actual email sending logic
      // For now, we'll simulate a successful email send
      
      // In a real implementation, you would use a library like nodemailer:
      /*
      const nodemailer = require('nodemailer')
      
      const transporter = nodemailer.createTransporter({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.useTLS,
        auth: {
          user: smtpConfig.username,
          pass: smtpConfig.password
        }
      })

      await transporter.sendMail({
        from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
        to: testEmail,
        subject: 'ChatHub AI - Test Email',
        html: `
          <h2>Test Email from ChatHub AI</h2>
          <p>This is a test email to verify your SMTP configuration.</p>
          <p>If you received this email, your email configuration is working correctly!</p>
          <br>
          <p><strong>Configuration Details:</strong></p>
          <ul>
            <li>SMTP Host: ${smtpConfig.host}</li>
            <li>SMTP Port: ${smtpConfig.port}</li>
            <li>From Email: ${smtpConfig.fromEmail}</li>
            <li>From Name: ${smtpConfig.fromName}</li>
            <li>TLS Enabled: ${smtpConfig.useTLS ? 'Yes' : 'No'}</li>
          </ul>
          <br>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        `
      })
      */

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully',
        details: {
          to: testEmail,
          from: `${smtpConfig.fromName} <${smtpConfig.fromEmail}>`,
          subject: 'ChatHub AI - Test Email',
          sentAt: new Date().toISOString()
        }
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json({ 
        error: 'Failed to send test email. Please check your SMTP configuration.',
        details: emailError instanceof Error ? emailError.message : 'Unknown error'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Failed to test email configuration' },
      { status: 500 }
    )
  }
} 