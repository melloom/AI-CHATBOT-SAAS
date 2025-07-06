import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, verifyServerAuth } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const db = getAdminDb()
    // Get system settings from Firestore
    const settingsDoc = await db.collection('systemSettings').doc('main').get()
    
    if (!settingsDoc.exists) {
      // Return default settings if none exist
      return NextResponse.json({
        platformName: "ChatHub AI",
        platformUrl: "https://chathub.ai",
        timezone: "UTC",
        language: "en",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h",
        maintenanceMode: false,
        debugMode: false,
        analyticsEnabled: true,
        userRegistration: true,
        emailNotifications: true,
        maxFileUploadSize: "10MB",
        sessionTimeout: "24h",
        maxUsersPerCompany: 100,
        maxChatbotsPerCompany: 10,
        maxCompanies: 1000,
        maxTeamsPerCompany: 10,
        maxStoragePerCompany: 100,
        maxFileSizePerUpload: 50,
        maxFilesPerUpload: 10,
        maxBackupRetention: 30,
        maxApiRequestsPerMinute: 1000,
        maxApiRequestsPerHour: 10000,
        maxConcurrentChats: 100,
        maxChatHistoryDays: 90,
        maxFreeUsers: 5,
        maxFreeChatbots: 2,
        maxProUsers: 50,
        maxProChatbots: 20,
        defaultCompanyPlan: "free",
        companyApprovalRequired: false,
        maxCompanyNameLength: 50,
        maxCompanyDescriptionLength: 500,
        defaultTheme: "light",
        customBranding: false,
        companyLogo: "",
        companyName: "",
        supportEmail: "support@chathub.ai",
        contactEmail: "contact@chathub.ai",
        termsOfService: "",
        privacyPolicy: `# Privacy Policy

## 1. Information We Collect

### Personal Information
- Email address and name when you register
- Company information and user roles
- Chatbot configurations and conversation data
- Usage analytics and performance metrics

### Technical Information
- IP addresses and browser information
- Session data and authentication tokens
- System logs and error reports
- Backup and security scan data

## 2. How We Use Your Information

### Service Provision
- Provide chatbot functionality and management
- Process payments and subscriptions
- Send notifications and system updates
- Maintain system security and performance

### Analytics and Improvement
- Analyze usage patterns to improve services
- Monitor system performance and security
- Generate reports and insights
- Develop new features and capabilities

## 3. Data Security

### Protection Measures
- Encryption of data in transit and at rest
- Regular security scans and vulnerability assessments
- Access controls and authentication requirements
- Backup and disaster recovery procedures

### Data Retention
- User data retained while account is active
- Backup data retained for 30 days
- Analytics data retained for 90 days
- Logs retained for security monitoring

## 4. Data Sharing

### Third-Party Services
- Firebase for data storage and authentication
- Payment processors for subscription billing
- Analytics services for usage tracking
- Email services for notifications

### Legal Requirements
- May disclose data if required by law
- Will notify users of any data breaches
- Cooperate with law enforcement when necessary

## 5. Your Rights

### Access and Control
- View and update your personal information
- Delete your account and associated data
- Export your data in standard formats
- Opt-out of non-essential communications

### Contact Information
- Email: privacy@chathub.ai
- Support: support@chathub.ai
- Address: [Your Company Address]

## 6. Updates to This Policy

We may update this privacy policy from time to time. Users will be notified of significant changes via email or system announcements.

**Last Updated**: ${new Date().toISOString().split('T')[0]}`,
        systemAnnouncement: "",
        announcementEnabled: false,
        announcementType: "info",
        announcementExpiry: null
      })
    }

    return NextResponse.json(settingsDoc.data())
  } catch (error) {
    console.error('Error fetching system settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system settings' },
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
    
    // Validate required fields
    if (!body.platformName || body.platformName.trim() === '') {
      return NextResponse.json(
        { error: 'Platform name is required' },
        { status: 400 }
      )
    }

    // Validate platform URL format
    if (body.platformUrl && body.platformUrl.trim() !== '') {
      try {
        const url = new URL(body.platformUrl)
        if (!url.protocol || !url.hostname) {
          return NextResponse.json(
            { error: 'Platform URL must be a valid URL with protocol (e.g., https://example.com)' },
            { status: 400 }
          )
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Platform URL must be a valid URL' },
          { status: 400 }
        )
      }
    }

    // Validate timezone
    const validTimezones = [
      'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 
      'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'
    ]
    if (body.timezone && !validTimezones.includes(body.timezone)) {
      return NextResponse.json(
        { error: 'Invalid timezone selected' },
        { status: 400 }
      )
    }

    // Validate language
    const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko']
    if (body.language && !validLanguages.includes(body.language)) {
      return NextResponse.json(
        { error: 'Invalid language selected' },
        { status: 400 }
      )
    }

    // Validate date format
    const validDateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']
    if (body.dateFormat && !validDateFormats.includes(body.dateFormat)) {
      return NextResponse.json(
        { error: 'Invalid date format selected' },
        { status: 400 }
      )
    }

    // Validate time format
    const validTimeFormats = ['12h', '24h']
    if (body.timeFormat && !validTimeFormats.includes(body.timeFormat)) {
      return NextResponse.json(
        { error: 'Invalid time format selected' },
        { status: 400 }
      )
    }

    // Validate session timeout
    const validSessionTimeouts = ['1h', '4h', '8h', '24h', '7d']
    if (body.sessionTimeout && !validSessionTimeouts.includes(body.sessionTimeout)) {
      return NextResponse.json(
        { error: 'Invalid session timeout selected' },
        { status: 400 }
      )
    }

    // Validate max file upload size
    const validFileSizes = ['1MB', '5MB', '10MB', '25MB', '50MB']
    if (body.maxFileUploadSize && !validFileSizes.includes(body.maxFileUploadSize)) {
      return NextResponse.json(
        { error: 'Invalid max file upload size selected' },
        { status: 400 }
      )
    }

    // Validate feature toggles (boolean fields)
    const booleanFields = [
      'maintenanceMode', 'debugMode', 'analyticsEnabled', 
      'userRegistration', 'emailNotifications', 'customBranding',
      'announcementEnabled'
    ]
    
    for (const field of booleanFields) {
      if (body[field] !== undefined && typeof body[field] !== 'boolean') {
        return NextResponse.json(
          { error: `${field} must be a boolean value` },
          { status: 400 }
        )
      }
    }

    // Validate announcement settings if enabled
    if (body.announcementEnabled) {
      if (!body.systemAnnouncement || body.systemAnnouncement.trim() === '') {
        return NextResponse.json(
          { error: 'Announcement message is required when announcement is enabled' },
          { status: 400 }
        )
      }
      
      if (!['info', 'success', 'warning', 'error'].includes(body.announcementType)) {
        return NextResponse.json(
          { error: 'Invalid announcement type' },
          { status: 400 }
        )
      }
    }

    // Validate numeric fields
    if (body.maxUsersPerCompany && (isNaN(body.maxUsersPerCompany) || body.maxUsersPerCompany < 1)) {
      return NextResponse.json(
        { error: 'Max users per company must be a positive number' },
        { status: 400 }
      )
    }

    if (body.maxChatbotsPerCompany && (isNaN(body.maxChatbotsPerCompany) || body.maxChatbotsPerCompany < 1)) {
      return NextResponse.json(
        { error: 'Max chatbots per company must be a positive number' },
        { status: 400 }
      )
    }

    // Prepare settings data with validation
    const settingsData = {
      ...body,
      platformName: body.platformName.trim(),
      systemAnnouncement: body.systemAnnouncement?.trim() || '',
      updatedAt: new Date().toISOString(),
      updatedBy: decodedToken.email
    }

    // Save to Firestore
    await db.collection('systemSettings').doc('main').set(settingsData, { merge: true })

    // If system announcement is being updated and enabled, trigger notification to all users
    if (body.systemAnnouncement && body.announcementEnabled && body.systemAnnouncement.trim() !== '') {
      await triggerSystemAnnouncement(body.systemAnnouncement.trim(), body.announcementType || 'info')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'System settings updated successfully' 
    })
  } catch (error) {
    console.error('Error updating system settings:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('auth')) {
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update system settings' },
      { status: 500 }
    )
  }
}

async function triggerSystemAnnouncement(message: string, type: string = 'info') {
  try {
    const db = getAdminDb()
    // Get all users
    const usersSnapshot = await db.collection('users').get()
    
    // Create announcement notification for each user
    const batch = db.batch()
    
    usersSnapshot.forEach((doc: any) => {
      const notificationRef = db.collection('notifications').doc()
      batch.set(notificationRef, {
        userId: doc.id,
        title: 'System Announcement',
        message: message,
        type: type,
        category: 'system',
        read: false,
        createdAt: new Date().toISOString(),
        metadata: {
          automated: true,
          trigger: 'system_announcement',
          announcementType: type
        }
      })
    })
    
    await batch.commit()
    console.log(`System announcement sent to ${usersSnapshot.size} users`)
  } catch (error) {
    console.error('Error sending system announcement:', error)
  }
} 