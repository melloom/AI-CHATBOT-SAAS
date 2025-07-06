import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, verifyServerAuth, canWrite } from '@/lib/firebase-admin'
import { z } from 'zod'

// Validation schema for security settings
const securitySettingsSchema = z.object({
  // Authentication Settings
  requireEmailVerification: z.boolean().default(true),
  requirePhoneVerification: z.boolean().default(false),
  enableTwoFactorAuth: z.boolean().default(true),
  allowSocialLogin: z.boolean().default(true),
  sessionTimeout: z.enum(['1h', '4h', '8h', '24h', '7d']).default('24h'),
  maxLoginAttempts: z.number().min(1).max(10).default(5),
  lockoutDuration: z.enum(['5m', '15m', '30m', '1h', '24h']).default('15m'),
  
  // Password Policy
  minPasswordLength: z.number().min(6).max(32).default(8),
  requireUppercase: z.boolean().default(true),
  requireLowercase: z.boolean().default(true),
  requireNumbers: z.boolean().default(true),
  requireSpecialChars: z.boolean().default(true),
  passwordExpiryDays: z.number().min(0).max(365).default(90),
  
  // Access Control
  adminOnlyAccess: z.boolean().default(false),
  ipWhitelist: z.string().optional(),
  allowedDomains: z.string().optional(),
  maxConcurrentSessions: z.number().min(1).max(10).default(3),
  requireVPN: z.boolean().default(false),
  geographicRestrictions: z.boolean().default(false),
  
  // Security Headers
  enableCSP: z.boolean().default(true),
  enableHSTS: z.boolean().default(true),
  enableXSSProtection: z.boolean().default(true),
  enableContentTypeOptions: z.boolean().default(true),
  
  // API Security
  enableRateLimiting: z.boolean().default(true),
  maxRequestsPerMinute: z.number().min(10).max(1000).default(100),
  enableAPIAuthentication: z.boolean().default(true),
  requireAPIKey: z.boolean().default(true),
  
  // Data Protection
  enableEncryption: z.boolean().default(true),
  enableBackupEncryption: z.boolean().default(true),
  dataRetentionDays: z.number().min(30).max(3650).default(365),
  enableAuditLogs: z.boolean().default(true),
  
  // Compliance
  gdprCompliance: z.boolean().default(true),
  ccpaCompliance: z.boolean().default(false),
  hipaaCompliance: z.boolean().default(false),
  soxCompliance: z.boolean().default(false)
})

export async function GET() {
  try {
    const db = getAdminDb()
    // Get security settings from Firestore
    const settingsDoc = await db.collection('securitySettings').doc('main').get()
    
    if (!settingsDoc.exists) {
      // Return default security settings if none exist
      return NextResponse.json({
        requireEmailVerification: true,
        requirePhoneVerification: false,
        enableTwoFactorAuth: true,
        allowSocialLogin: true,
        sessionTimeout: "24h",
        maxLoginAttempts: 5,
        lockoutDuration: "15m",
        minPasswordLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpiryDays: 90,
        adminOnlyAccess: false,
        ipWhitelist: "",
        allowedDomains: "",
        maxConcurrentSessions: 3,
        requireVPN: false,
        geographicRestrictions: false,
        enableCSP: true,
        enableHSTS: true,
        enableXSSProtection: true,
        enableContentTypeOptions: true,
        enableRateLimiting: true,
        maxRequestsPerMinute: 100,
        enableAPIAuthentication: true,
        requireAPIKey: true,
        enableEncryption: true,
        enableBackupEncryption: true,
        dataRetentionDays: 365,
        enableAuditLogs: true,
        gdprCompliance: true,
        ccpaCompliance: false,
        hipaaCompliance: false,
        soxCompliance: false
      })
    }

    return NextResponse.json(settingsDoc.data())
  } catch (error) {
    console.error('Error fetching security settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch security settings' },
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

    // Check if user can perform write operations
    const hasWritePermission = await canWrite(decodedToken.uid)
    if (!hasWritePermission) {
      return NextResponse.json(
        { error: 'Unauthorized - Read-only access only. Cannot modify settings.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate security settings
    const validatedSettings = securitySettingsSchema.parse(body)
    
    // Additional validation for IP whitelist format
    if (validatedSettings.ipWhitelist && validatedSettings.ipWhitelist.trim() !== '') {
      const ipAddresses = validatedSettings.ipWhitelist.split(',').map(ip => ip.trim())
      for (const ip of ipAddresses) {
        if (!isValidIPOrCIDR(ip)) {
          return NextResponse.json(
            { error: `Invalid IP address or CIDR range: ${ip}` },
            { status: 400 }
          )
        }
      }
    }
    
    // Additional validation for allowed domains format
    if (validatedSettings.allowedDomains && validatedSettings.allowedDomains.trim() !== '') {
      const domains = validatedSettings.allowedDomains.split(',').map(domain => domain.trim())
      for (const domain of domains) {
        if (!isValidDomain(domain)) {
          return NextResponse.json(
            { error: `Invalid domain format: ${domain}` },
            { status: 400 }
          )
        }
      }
    }

    // Save security settings to Firestore
    await db.collection('securitySettings').doc('main').set({
      ...validatedSettings,
      updatedAt: new Date().toISOString(),
      updatedBy: decodedToken.uid
    })

    // Log security settings update
    await db.collection('auditLogs').add({
      action: 'security_settings_updated',
      userId: decodedToken.uid,
      userEmail: userData.email,
      timestamp: new Date().toISOString(),
      details: {
        settings: validatedSettings,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Security settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating security settings:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update security settings' },
      { status: 500 }
    )
  }
}

// Helper function to validate IP address or CIDR range
function isValidIPOrCIDR(ip: string): boolean {
  // Simple IP validation - in production, use a more robust library
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}(\/\d{1,3})?$/
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

// Helper function to validate domain format
function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return domainRegex.test(domain)
} 