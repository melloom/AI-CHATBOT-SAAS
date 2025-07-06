import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, verifyServerAuth } from '@/lib/firebase-admin'
import { z } from 'zod'

// Validation schema for notification settings
const notificationSettingsSchema = z.object({
  // Email Configuration
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.number().min(1, "SMTP port must be at least 1").max(65535, "SMTP port must be at most 65535"),
  smtpUsername: z.string().min(1, "SMTP username is required"),
  smtpPassword: z.string().optional(),
  smtpSecure: z.boolean(),
  fromEmail: z.string().email("From email must be a valid email"),
  fromName: z.string().min(1, "From name is required"),
  
  // Notification Types
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  inAppNotifications: z.boolean(),
  
  // User Notifications
  notifyNewUserRegistration: z.boolean(),
  notifyPasswordReset: z.boolean(),
  notifySecurityAlerts: z.boolean(),
  notifyMaintenanceUpdates: z.boolean(),
  notifySystemUpdates: z.boolean(),
  
  // Admin Notifications
  notifyAdminNewUser: z.boolean(),
  notifyAdminSecurityBreach: z.boolean(),
  notifyAdminSystemErrors: z.boolean(),
  notifyAdminHighUsage: z.boolean(),
  
  // SMS Configuration
  smsProvider: z.string().min(1, "SMS provider is required"),
  smsApiKey: z.string().optional(),
  smsApiSecret: z.string().optional(),
  smsFromNumber: z.string().optional(),
  
  // Push Notification Configuration
  pushNotificationServerKey: z.string().optional(),
  pushNotificationAppId: z.string().optional(),
  
  // Notification Preferences
  notificationSound: z.boolean(),
  notificationVibration: z.boolean(),
  notificationBadge: z.boolean(),
  quietHoursEnabled: z.boolean(),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
})

export async function GET(request: NextRequest) {
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

    // Get notification settings from Firestore
    const settingsDoc = await db.collection('notificationSettings').doc('main').get()
    
    if (!settingsDoc.exists) {
      // Return default settings if none exist
      return NextResponse.json({
        // Email Configuration
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpUsername: "melvin.a.p.cruz@gmail.com",
        smtpPassword: "",
        smtpSecure: true,
        fromEmail: "noreply@chathub.ai",
        fromName: "ChatHub AI",
        
        // Notification Types
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        inAppNotifications: true,
        
        // User Notifications
        notifyNewUserRegistration: true,
        notifyPasswordReset: true,
        notifySecurityAlerts: true,
        notifyMaintenanceUpdates: true,
        notifySystemUpdates: false,
        
        // Admin Notifications
        notifyAdminNewUser: true,
        notifyAdminSecurityBreach: true,
        notifyAdminSystemErrors: true,
        notifyAdminHighUsage: true,
        
        // SMS Configuration
        smsProvider: "twilio",
        smsApiKey: "",
        smsApiSecret: "",
        smsFromNumber: "",
        
        // Push Notification Configuration
        pushNotificationServerKey: "",
        pushNotificationAppId: "",
        
        // Notification Preferences
        notificationSound: true,
        notificationVibration: true,
        notificationBadge: true,
        quietHoursEnabled: false,
        quietHoursStart: "22:00",
        quietHoursEnd: "08:00"
      })
    }

    return NextResponse.json(settingsDoc.data())
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification settings' },
      { status: 500 }
    )
  }
}

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
    const validationResult = notificationSettingsSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const settings = validationResult.data

    // Additional validation
    if (settings.smtpHost.trim() === '') {
      return NextResponse.json(
        { error: 'SMTP host cannot be empty' },
        { status: 400 }
      )
    }

    // Validate SMTP port
    if (settings.smtpPort < 1 || settings.smtpPort > 65535) {
      return NextResponse.json(
        { error: 'SMTP port must be between 1 and 65535' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.fromEmail)) {
      return NextResponse.json(
        { error: 'From email must be a valid email address' },
        { status: 400 }
      )
    }

    // Validate SMTP provider
    const validSmtpProviders = ['smtp.gmail.com', 'smtp.mailgun.org', 'smtp.sendgrid.net', 'smtp.mailchimp.com']
    if (settings.smtpHost && !validSmtpProviders.includes(settings.smtpHost) && !settings.smtpHost.includes('smtp.')) {
      return NextResponse.json(
        { error: 'SMTP host should be a valid SMTP server' },
        { status: 400 }
      )
    }

    // Validate SMS provider
    const validSmsProviders = ['twilio', 'aws-sns', 'nexmo', 'custom']
    if (settings.smsNotifications && settings.smsProvider && !validSmsProviders.includes(settings.smsProvider)) {
      return NextResponse.json(
        { error: 'Invalid SMS provider selected' },
        { status: 400 }
      )
    }

    // Validate quiet hours if enabled
    if (settings.quietHoursEnabled) {
      if (!settings.quietHoursStart || !settings.quietHoursEnd) {
        return NextResponse.json(
          { error: 'Quiet hours start and end times are required when quiet hours is enabled' },
          { status: 400 }
        )
      }
      
      // Validate time format (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(settings.quietHoursStart) || !timeRegex.test(settings.quietHoursEnd)) {
        return NextResponse.json(
          { error: 'Quiet hours times must be in HH:MM format' },
          { status: 400 }
        )
      }
    }

    // Save settings to Firestore
    await db.collection('notificationSettings').doc('main').set({
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: decodedToken.uid
    })

    // Log the settings update
    await db.collection('auditLogs').add({
      action: 'notification_settings_updated',
      userId: decodedToken.uid,
      userEmail: userData.email,
      timestamp: new Date().toISOString(),
      changes: settings,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    })

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully'
    })

  } catch (error) {
    console.error('Error updating notification settings:', error)
    return NextResponse.json(
      { error: 'Failed to update notification settings' },
      { status: 500 }
    )
  }
} 