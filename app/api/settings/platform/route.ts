import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, verifyServerAuth } from '@/lib/firebase-admin'
import { z } from 'zod'

// Validation schema for platform settings
const platformSettingsSchema = z.object({
  // Platform Configuration
  platformName: z.string().min(1, "Platform name is required"),
  platformDomain: z.string().min(1, "Platform domain is required"),
  logoUrl: z.string().url("Logo URL must be a valid URL").optional(),
  faviconUrl: z.string().url("Favicon URL must be a valid URL").optional(),
  defaultLanguage: z.string().min(1, "Default language is required"),
  defaultTimezone: z.string().min(1, "Default timezone is required"),
  maxFileUploadSize: z.string().min(1, "Max file upload size is required"),
  allowedFileTypes: z.string().min(1, "Allowed file types are required"),
  
  // Email Configuration
  smtpProvider: z.string().min(1, "SMTP provider is required"),
  smtpApiKey: z.string().optional(),
  fromEmail: z.string().email("From email must be a valid email"),
  fromName: z.string().min(1, "From name is required"),
  
  // Payment Configuration
  paymentProvider: z.string().min(1, "Payment provider is required"),
  currency: z.string().min(1, "Currency is required"),
  stripePublishableKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  paypalClientId: z.string().optional(),
  paypalSecret: z.string().optional(),
  taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
  
  // Security Configuration
  recaptchaSiteKey: z.string().optional(),
  recaptchaSecretKey: z.string().optional(),
  jwtSecret: z.string().optional(),
  sessionSecret: z.string().optional(),
  corsOrigins: z.string().optional(),
  
  // Third-party Integrations
  googleAnalyticsId: z.string().optional(),
  googleTagManagerId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  hotjarId: z.string().optional(),
  intercomAppId: z.string().optional(),
  zendeskDomain: z.string().optional(),
  slackWebhookUrl: z.string().url("Slack webhook URL must be a valid URL").optional(),
  
  // API Configuration
  apiRateLimit: z.number().min(1, "API rate limit must be at least 1"),
  rateLimitWindow: z.number().min(60, "Rate limit window must be at least 60 seconds"),
  apiKeyExpiry: z.number().min(1, "API key expiry must be at least 1 day"),
  webhookTimeout: z.number().min(5, "Webhook timeout must be at least 5 seconds"),
  maxWebhookRetries: z.number().min(0, "Max webhook retries must be at least 0"),
  
  // Feature Flags
  enableUserRegistration: z.boolean(),
  enableEmailVerification: z.boolean(),
  enableTwoFactorAuth: z.boolean(),
  enableSocialLogin: z.boolean(),
  enableFileUpload: z.boolean(),
  enableRealTimeChat: z.boolean(),
  enableAnalytics: z.boolean(),
  enableNotifications: z.boolean(),
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

    // Get platform settings from Firestore
    const settingsDoc = await db.collection('platformSettings').doc('main').get()
    
    if (!settingsDoc.exists) {
      // Return default settings if none exist
      return NextResponse.json({
        // Platform Configuration
        platformName: "ChatHub AI",
        platformDomain: "chathub.ai",
        logoUrl: "https://example.com/logo.png",
        faviconUrl: "https://example.com/favicon.ico",
        defaultLanguage: "English",
        defaultTimezone: "UTC",
        maxFileUploadSize: "10 MB",
        allowedFileTypes: "jpg,jpeg,png,gif,pdf,doc,docx,txt",
        
        // Email Configuration
        smtpProvider: "SendGrid",
        smtpApiKey: "",
        fromEmail: "noreply@chathub.ai",
        fromName: "ChatHub AI",
        
        // Payment Configuration
        paymentProvider: "Stripe",
        currency: "USD ($)",
        stripePublishableKey: "pk_test_...",
        stripeSecretKey: "",
        paypalClientId: "",
        paypalSecret: "",
        taxRate: 0,
        
        // Security Configuration
        recaptchaSiteKey: "6Lc...",
        recaptchaSecretKey: "",
        jwtSecret: "",
        sessionSecret: "",
        corsOrigins: "https://example.com,https://app.example.com",
        
        // Third-party Integrations
        googleAnalyticsId: "G-XXXXXXXXXX",
        googleTagManagerId: "GTM-XXXXXXX",
        facebookPixelId: "XXXXXXXXXX",
        hotjarId: "XXXXXXXXXX",
        intercomAppId: "XXXXXXXXXX",
        zendeskDomain: "company.zendesk.com",
        slackWebhookUrl: "https://hooks.slack.com/services/...",
        
        // API Configuration
        apiRateLimit: 100,
        rateLimitWindow: 900,
        apiKeyExpiry: 365,
        webhookTimeout: 30,
        maxWebhookRetries: 3,
        
        // Feature Flags
        enableUserRegistration: true,
        enableEmailVerification: true,
        enableTwoFactorAuth: true,
        enableSocialLogin: true,
        enableFileUpload: true,
        enableRealTimeChat: true,
        enableAnalytics: true,
        enableNotifications: true,
      })
    }

    return NextResponse.json(settingsDoc.data())
  } catch (error) {
    console.error('Error fetching platform settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform settings' },
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
    const validationResult = platformSettingsSchema.safeParse(body)
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
    if (settings.platformName.trim() === '') {
      return NextResponse.json(
        { error: 'Platform name cannot be empty' },
        { status: 400 }
      )
    }

    // Validate platform domain format
    if (settings.platformDomain && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(settings.platformDomain)) {
      return NextResponse.json(
        { error: 'Platform domain must be a valid domain name' },
        { status: 400 }
      )
    }

    // Validate email format
    if (settings.fromEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.fromEmail)) {
      return NextResponse.json(
        { error: 'From email must be a valid email address' },
        { status: 400 }
      )
    }

    // Validate timezone
    const validTimezones = [
      'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 
      'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'
    ]
    if (settings.defaultTimezone && !validTimezones.includes(settings.defaultTimezone)) {
      return NextResponse.json(
        { error: 'Invalid timezone selected' },
        { status: 400 }
      )
    }

    // Validate language
    const validLanguages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Korean']
    if (settings.defaultLanguage && !validLanguages.includes(settings.defaultLanguage)) {
      return NextResponse.json(
        { error: 'Invalid language selected' },
        { status: 400 }
      )
    }

    // Validate file upload size
    const validFileSizes = ['1 MB', '5 MB', '10 MB', '25 MB', '50 MB']
    if (settings.maxFileUploadSize && !validFileSizes.includes(settings.maxFileUploadSize)) {
      return NextResponse.json(
        { error: 'Invalid max file upload size selected' },
        { status: 400 }
      )
    }

    // Validate SMTP provider
    const validSmtpProviders = ['SendGrid', 'Mailgun', 'AWS SES', 'SMTP']
    if (settings.smtpProvider && !validSmtpProviders.includes(settings.smtpProvider)) {
      return NextResponse.json(
        { error: 'Invalid SMTP provider selected' },
        { status: 400 }
      )
    }

    // Validate payment provider
    const validPaymentProviders = ['Stripe', 'PayPal', 'Square', 'Custom']
    if (settings.paymentProvider && !validPaymentProviders.includes(settings.paymentProvider)) {
      return NextResponse.json(
        { error: 'Invalid payment provider selected' },
        { status: 400 }
      )
    }

    // Validate currency
    const validCurrencies = ['USD ($)', 'EUR (€)', 'GBP (£)', 'CAD (C$)', 'AUD (A$)']
    if (settings.currency && !validCurrencies.includes(settings.currency)) {
      return NextResponse.json(
        { error: 'Invalid currency selected' },
        { status: 400 }
      )
    }

    // Save settings to Firestore
    await db.collection('platformSettings').doc('main').set({
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: decodedToken.uid
    })

    // Log the settings update
    await db.collection('auditLogs').add({
      action: 'platform_settings_updated',
      userId: decodedToken.uid,
      userEmail: userData.email,
      timestamp: new Date().toISOString(),
      changes: settings,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    })

    return NextResponse.json({
      success: true,
      message: 'Platform settings updated successfully'
    })

  } catch (error) {
    console.error('Error updating platform settings:', error)
    return NextResponse.json(
      { error: 'Failed to update platform settings' },
      { status: 500 }
    )
  }
} 