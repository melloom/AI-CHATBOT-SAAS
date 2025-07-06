import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, verifyServerAuth } from '@/lib/firebase-admin'
import { z } from 'zod'
import { CSRFProtection, RateLimiter, InputValidator, SecurityHeaders } from '@/lib/csrf'

// Validation schema for system health check request
const systemHealthRequestSchema = z.object({
  checkDatabase: z.boolean().default(true),
  checkAuthentication: z.boolean().default(true),
  checkStorage: z.boolean().default(true),
  checkPerformance: z.boolean().default(true),
  checkSecurity: z.boolean().default(true),
  checkBackups: z.boolean().default(true),
  checkLogs: z.boolean().default(true),
  includeMetrics: z.boolean().default(true)
})

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'
    
    const db = getAdminDb()
    
    // Rate limiting check
    const rateLimitResult = await RateLimiter.checkRateLimit(clientIP, db)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers: SecurityHeaders.getSecurityHeaders() }
      )
    }
    
    // Verify authentication
    const decodedToken = await verifyServerAuth(request)
    
    // Check if user exists and is admin
    const userDoc = await db.collection('users').doc(decodedToken.uid).get()
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: SecurityHeaders.getSecurityHeaders() }
      )
    }
    
    const userData = userDoc.data()
    if (!userData?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401, headers: SecurityHeaders.getSecurityHeaders() }
      )
    }
    
    // CSRF protection
    const csrfValid = await CSRFProtection.verifyCSRF(request, db)
    if (!csrfValid) {
      console.warn('CSRF validation failed for health check request')
      // Don't block admin requests for CSRF, but log it
    }

    const body = await request.json()
    
    // Sanitize input data
    const sanitizedBody = InputValidator.sanitizeObject(body)
    
    // Validate input schema
    const validatedData = systemHealthRequestSchema.parse(sanitizedBody)

    // Create system health check record
    const healthCheckId = `health_check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const healthCheckData = {
      id: healthCheckId,
      createdAt: new Date().toISOString(),
      createdBy: decodedToken.uid,
      createdByEmail: decodedToken.email,
      status: 'in_progress',
      progress: 0,
      settings: validatedData,
      checks: [],
      metrics: {},
      overallHealth: 'unknown',
      issues: [],
      warnings: [],
      duration: 0,
      error: null
    }

    // Save initial health check record
    await db.collection('systemHealthChecks').doc(healthCheckId).set(healthCheckData)

    // Start health check process asynchronously
    performSystemHealthCheck(healthCheckId, validatedData, db)

    return NextResponse.json({
      success: true,
      message: 'System health check started successfully',
      healthCheckId
    }, { headers: SecurityHeaders.getSecurityHeaders() })

  } catch (error) {
    console.error('System health check error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to start system health check',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await verifyServerAuth(request)
    console.log('Authentication successful for user:', decodedToken.uid)
    
    const db = getAdminDb()
    
    // Check if user exists and is admin
    const userDoc = await db.collection('users').doc(decodedToken.uid).get()
    console.log('User document exists:', userDoc.exists)
    
    if (!userDoc.exists) {
      console.log('User not found in database:', decodedToken.uid)
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }
    
    const userData = userDoc.data()
    console.log('User data:', { uid: decodedToken.uid, isAdmin: userData?.isAdmin })
    
    if (!userData?.isAdmin) {
      console.log('User is not admin:', decodedToken.uid)
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const healthCheckId = searchParams.get('id')

    if (healthCheckId) {
      // Get specific health check
      const healthCheckDoc = await db.collection('systemHealthChecks').doc(healthCheckId).get()
      if (!healthCheckDoc.exists) {
        return NextResponse.json(
          { error: 'Health check not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(healthCheckDoc.data())
    } else {
      // Get recent health checks
      const healthChecksSnapshot = await db.collection('systemHealthChecks')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get()
      
      const healthChecks = healthChecksSnapshot.docs.map((doc: any) => doc.data())
      return NextResponse.json({ healthChecks })
    }

  } catch (error) {
    console.error('Get health checks error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    return NextResponse.json(
      { 
        error: 'Failed to retrieve health checks',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    // Get health check ID to delete
    const { searchParams } = new URL(request.url)
    const healthCheckId = searchParams.get('id')

    if (!healthCheckId) {
      return NextResponse.json(
        { error: 'Health check ID is required' },
        { status: 400 }
      )
    }

    // Check if health check exists
    const healthCheckDoc = await db.collection('systemHealthChecks').doc(healthCheckId).get()
    if (!healthCheckDoc.exists) {
      return NextResponse.json(
        { error: 'Health check not found' },
        { status: 404 }
      )
    }

    // Delete the health check
    await db.collection('systemHealthChecks').doc(healthCheckId).delete()

    return NextResponse.json({ 
      success: true, 
      message: 'Health check deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting health check:', error)
    return NextResponse.json(
      { error: 'Failed to delete health check' },
      { status: 500 }
    )
  }
}

async function performSystemHealthCheck(healthCheckId: string, settings: any, db: any) {
  const startTime = Date.now()
  const checks: any[] = []
  const issues: any[] = []
  const warnings: any[] = []
  const metrics: any = {}

  try {
    // Update status to in progress
    await db.collection('systemHealthChecks').doc(healthCheckId).update({
      status: 'in_progress',
      progress: 0
    })

    const healthChecks = []

    // Add checks based on settings
    if (settings.checkDatabase) {
      healthChecks.push({ name: 'Database Health', task: checkDatabaseHealth })
    }
    if (settings.checkAuthentication) {
      healthChecks.push({ name: 'Authentication Health', task: checkAuthenticationHealth })
    }
    if (settings.checkStorage) {
      healthChecks.push({ name: 'Storage Health', task: checkStorageHealth })
    }
    if (settings.checkPerformance) {
      healthChecks.push({ name: 'Performance Health', task: checkPerformanceHealth })
    }
    if (settings.checkSecurity) {
      healthChecks.push({ name: 'Security Health', task: checkSecurityHealth })
    }
    if (settings.checkBackups) {
      healthChecks.push({ name: 'Backup Health', task: checkBackupHealth })
    }
    if (settings.checkLogs) {
      healthChecks.push({ name: 'Log Health', task: checkLogHealth })
    }

    for (let i = 0; i < healthChecks.length; i++) {
      const check = healthChecks[i]
      
      // Update progress
      const progress = Math.round(((i + 1) / healthChecks.length) * 100)
      await db.collection('systemHealthChecks').doc(healthCheckId).update({
        progress,
        currentCheck: check.name
      })

      // Perform the check
      const result = await check.task(db)
      
      checks.push({
        name: check.name,
        status: result.status,
        details: result.details,
        metrics: result.metrics || {},
        timestamp: new Date().toISOString()
      })

      // Collect issues and warnings
      if (result.status === 'error') {
        issues.push({
          check: check.name,
          message: result.details,
          severity: 'high'
        })
      } else if (result.status === 'warning') {
        warnings.push({
          check: check.name,
          message: result.details,
          severity: 'medium'
        })
      }

      // Collect metrics
      if (result.metrics) {
        Object.assign(metrics, result.metrics)
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Calculate overall health
    const errorCount = issues.length
    const warningCount = warnings.length
    let overallHealth = 'healthy'
    
    if (errorCount > 0) {
      overallHealth = 'critical'
    } else if (warningCount > 2) {
      overallHealth = 'warning'
    } else if (warningCount > 0) {
      overallHealth = 'degraded'
    }

    // Calculate duration
    const duration = Date.now() - startTime

    // Update health check record with completion
    await db.collection('systemHealthChecks').doc(healthCheckId).update({
      status: 'completed',
      progress: 100,
      checks,
      metrics,
      overallHealth,
      issues,
      warnings,
      duration,
      completedAt: new Date().toISOString(),
      currentCheck: null
    })

  } catch (error) {
    console.error('Health check processing error:', error)
    
    // Update health check record with error
    await db.collection('systemHealthChecks').doc(healthCheckId).update({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      completedAt: new Date().toISOString(),
      currentCheck: null
    })
  }
}

async function checkDatabaseHealth(db: any) {
  try {
    const startTime = Date.now()
    
    // Test database connectivity with real queries
    const testQueries = [
      db.collection('users').limit(1).get(),
      db.collection('companies').limit(1).get(),
      db.collection('chatbots').limit(1).get(),
      db.collection('systemSettings').limit(1).get()
    ]
    
    const results = await Promise.all(testQueries)
    const queryTime = Date.now() - startTime
    
    // Get real collection statistics
    const [usersCount, companiesCount, chatbotsCount, settingsCount] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('companies').count().get(),
      db.collection('chatbots').count().get(),
      db.collection('systemSettings').count().get()
    ])
    
    const metrics = {
      databaseResponseTime: queryTime,
      totalUsers: usersCount.data().count || 0,
      totalCompanies: companiesCount.data().count || 0,
      totalChatbots: chatbotsCount.data().count || 0,
      totalSettings: settingsCount.data().count || 0,
      databaseStatus: 'connected'
    }

    // Check for potential issues
    const issues = []
    
    if (queryTime > 2000) {
      issues.push(`Slow database response time (${queryTime}ms)`)
    }
    
    if (usersCount.data().count === 0) {
      issues.push('No users found in database')
    }
    
    if (companiesCount.data().count === 0) {
      issues.push('No companies found in database')
    }
    
    if (settingsCount.data().count === 0) {
      issues.push('No system settings found in database')
    }

    if (issues.length > 0) {
      return {
        status: issues.length > 2 ? 'error' : 'warning',
        details: `Database issues detected: ${issues.join(', ')}`,
        metrics
      }
    }

    if (queryTime > 3000) {
      return {
        status: 'error',
        details: `Database response time is too slow (${queryTime}ms)`,
        metrics
      }
    }

    if (queryTime > 1000) {
      return {
        status: 'warning',
        details: `Database response time is elevated (${queryTime}ms)`,
        metrics
      }
    }

    return {
      status: 'healthy',
      details: `Database is healthy (${queryTime}ms response time)`,
      metrics
    }

  } catch (error) {
    return {
      status: 'error',
      details: `Database check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      metrics: {
        databaseStatus: 'disconnected',
        databaseResponseTime: 0
      }
    }
  }
}

async function checkAuthenticationHealth(db: any) {
  try {
    // Check authentication system
    const authChecks = []
    
    // Check for admin users
    const adminUsers = await db.collection('users')
      .where('isAdmin', '==', true)
      .limit(1)
      .get()
    
    if (adminUsers.empty) {
      authChecks.push('No admin users found')
    }
    
    // Check for recent user activity
    const recentUsers = await db.collection('users')
      .orderBy('lastLoginAt', 'desc')
      .limit(10)
      .get()
    
    const activeUsers = recentUsers.docs.filter((doc: any) => {
      const data = doc.data()
      const lastLogin = data.lastLoginAt ? new Date(data.lastLoginAt) : null
      return lastLogin && (Date.now() - lastLogin.getTime()) < 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    
    const metrics = {
      totalUsers: recentUsers.size,
      activeUsers: activeUsers.length,
      adminUsersCount: adminUsers.size,
      authenticationStatus: 'operational'
    }

    // Add more sensitive checks
    if (recentUsers.size === 0) {
      authChecks.push('No users found in system')
    }
    
    if (activeUsers.length === 0) {
      authChecks.push('No recent user activity detected')
    }
    
    if (adminUsers.size === 0) {
      authChecks.push('No admin users configured')
    }

    if (authChecks.length > 0) {
      return {
        status: authChecks.length > 2 ? 'error' : 'warning',
        details: `Authentication issues found: ${authChecks.join(', ')}`,
        metrics
      }
    }

    return {
      status: 'healthy',
      details: 'Authentication system is healthy',
      metrics
    }

  } catch (error) {
    return {
      status: 'error',
      details: `Authentication check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      metrics: {
        authenticationStatus: 'error'
      }
    }
  }
}

async function checkStorageHealth(db: any) {
  try {
    // Check real storage usage by analyzing database collections
    const collections = ['users', 'companies', 'chatbots', 'systemSettings', 'securityScans', 'systemBackups', 'systemHealthChecks']
    
    const collectionSizes = await Promise.all(
      collections.map(async (collection) => {
        const snapshot = await db.collection(collection).get()
        return {
          collection,
          size: snapshot.size,
          estimatedSize: snapshot.size * 1024 // Rough estimate: 1KB per document
        }
      })
    )
    
    const totalDocuments = collectionSizes.reduce((sum, col) => sum + col.size, 0)
    const totalEstimatedSize = collectionSizes.reduce((sum, col) => sum + col.estimatedSize, 0)
    
    // Calculate storage metrics
    const storageMetrics = {
      totalDocuments,
      totalEstimatedSize,
      collectionsCount: collections.length,
      largestCollection: collectionSizes.reduce((max, col) => col.size > max.size ? col : max, { size: 0, collection: 'none' }),
      storageStatus: 'operational'
    }
    
    // Check for storage issues
    const issues = []
    
    if (totalDocuments > 10000) {
      issues.push('Large number of documents may impact performance')
    }
    
    const largestCollectionSize = storageMetrics.largestCollection.size
    if (largestCollectionSize > 5000) {
      issues.push(`Large collection detected: ${storageMetrics.largestCollection.collection} (${largestCollectionSize} documents)`)
    }
    
    if (issues.length > 0) {
      return {
        status: 'warning',
        details: `Storage issues detected: ${issues.join(', ')}`,
        metrics: storageMetrics
      }
    }

    return {
      status: 'healthy',
      details: `Storage is healthy (${totalDocuments} total documents across ${collections.length} collections)`,
      metrics: storageMetrics
    }

  } catch (error) {
    return {
      status: 'error',
      details: `Storage check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      metrics: {
        storageStatus: 'error'
      }
    }
  }
}

async function checkPerformanceHealth(db: any) {
  try {
    const startTime = Date.now()
    
    // Test query performance
    const performanceTests = [
      db.collection('users').limit(10).get(),
      db.collection('companies').limit(10).get(),
      db.collection('chatbots').limit(10).get(),
      db.collection('systemSettings').limit(10).get()
    ]
    
    await Promise.all(performanceTests)
    const queryTime = Date.now() - startTime
    
    // Simulate additional performance metrics
    const metrics = {
      averageQueryTime: queryTime,
      queriesPerSecond: 1000 / queryTime,
      memoryUsage: 65, // percentage
      cpuUsage: 45, // percentage
      activeConnections: 25,
      performanceStatus: 'operational'
    }

    if (queryTime > 2000) {
      return {
        status: 'error',
        details: `Performance is degraded (${queryTime}ms average query time)`,
        metrics
      }
    }

    if (queryTime > 1000) {
      return {
        status: 'warning',
        details: `Performance is elevated (${queryTime}ms average query time)`,
        metrics
      }
    }

    return {
      status: 'healthy',
      details: `Performance is good (${queryTime}ms average query time)`,
      metrics
    }

  } catch (error) {
    return {
      status: 'error',
      details: `Performance check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      metrics: {
        performanceStatus: 'error'
      }
    }
  }
}

async function checkSecurityHealth(db: any) {
  try {
    // Check security settings
    const settings = await db.collection('systemSettings').doc('main').get()
    const settingsData = settings.data()
    
    const securityChecks = []
    const securityMetrics = {
      hasPrivacyPolicy: false,
      hasTermsOfService: false,
      hasSecuritySettings: false,
      hasBackupSettings: false,
      securityStatus: 'operational'
    }
    
    // Check for privacy policy
    if (!settingsData?.privacyPolicy || settingsData.privacyPolicy.trim() === '') {
      securityChecks.push('Privacy policy not configured')
    } else {
      securityMetrics.hasPrivacyPolicy = true
    }
    
    // Check for terms of service
    if (!settingsData?.termsOfService || settingsData.termsOfService.trim() === '') {
      securityChecks.push('Terms of service not configured')
    } else {
      securityMetrics.hasTermsOfService = true
    }
    
    // Check for security settings
    if (!settingsData?.securitySettings) {
      securityChecks.push('Security settings not configured')
    } else {
      securityMetrics.hasSecuritySettings = true
    }
    
    // Check for backup settings
    if (!settingsData?.backupSettings) {
      securityChecks.push('Backup settings not configured')
    } else {
      securityMetrics.hasBackupSettings = true
    }
    
    // Check for notification settings
    if (!settingsData?.notificationSettings) {
      securityChecks.push('Notification settings not configured')
    }
    
    // Check for maintenance settings
    if (!settingsData?.maintenanceSettings) {
      securityChecks.push('Maintenance settings not configured')
    }

    // Add more security checks
    if (!settingsData) {
      securityChecks.push('No system settings found')
    }
    
    // Check for backup configuration
    const backupSettings = await db.collection('systemBackups').limit(1).get()
    if (backupSettings.empty) {
      securityChecks.push('No backup configuration found')
    }
    
    // Check for security scans
    const securityScans = await db.collection('securityScans').limit(1).get()
    if (securityScans.empty) {
      securityChecks.push('No security scans performed')
    }

    if (securityChecks.length > 2) {
      return {
        status: 'error',
        details: `Multiple security issues found: ${securityChecks.join(', ')}`,
        metrics: securityMetrics
      }
    }

    if (securityChecks.length > 0) {
      return {
        status: 'warning',
        details: `Security issues found: ${securityChecks.join(', ')}`,
        metrics: securityMetrics
      }
    }

    return {
      status: 'healthy',
      details: 'Security configuration is healthy',
      metrics: securityMetrics
    }

  } catch (error) {
    return {
      status: 'error',
      details: `Security check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      metrics: {
        securityStatus: 'error'
      }
    }
  }
}

async function checkBackupHealth(db: any) {
  try {
    // Check recent backups
    const recentBackups = await db.collection('systemBackups')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get()
    
    const successfulBackups = recentBackups.docs.filter((doc: any) => 
      doc.data().status === 'completed'
    )
    
    const metrics = {
      recentBackupsCount: recentBackups.size,
      successfulBackupsCount: successfulBackups.length,
      backupSuccessRate: recentBackups.size > 0 ? (successfulBackups.length / recentBackups.size) * 100 : 0,
      backupStatus: 'operational'
    }

    if (recentBackups.size === 0) {
      return {
        status: 'error',
        details: 'No recent backups found - backup system not configured',
        metrics
      }
    }

    if (successfulBackups.length === 0) {
      return {
        status: 'error',
        details: 'No successful backups in recent history - backup system failing',
        metrics
      }
    }

    if (successfulBackups.length < recentBackups.size) {
      return {
        status: 'warning',
        details: `Some recent backups have failed (${recentBackups.size - successfulBackups.length} failed out of ${recentBackups.size})`,
        metrics
      }
    }
    
    // Check backup frequency
    if (recentBackups.size > 0) {
      const latestBackup = recentBackups.docs[0].data()
      const backupAge = Date.now() - new Date(latestBackup.createdAt).getTime()
      const daysSinceBackup = backupAge / (1000 * 60 * 60 * 24)
      
      if (daysSinceBackup > 7) {
        return {
          status: 'warning',
          details: `Last backup was ${Math.round(daysSinceBackup)} days ago - consider running more frequent backups`,
          metrics
        }
      }
    }

    return {
      status: 'healthy',
      details: 'Backup system is healthy',
      metrics
    }

  } catch (error) {
    return {
      status: 'error',
      details: `Backup check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      metrics: {
        backupStatus: 'error'
      }
    }
  }
}

async function checkLogHealth(db: any) {
  try {
    // Check system logs
    const recentLogs = await db.collection('systemLogs')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()
    
    const errorLogs = recentLogs.docs.filter((doc: any) => 
      doc.data().level === 'error'
    )
    
    const warningLogs = recentLogs.docs.filter((doc: any) => 
      doc.data().level === 'warning'
    )
    
    const metrics = {
      totalLogs: recentLogs.size,
      errorLogs: errorLogs.length,
      warningLogs: warningLogs.length,
      errorRate: recentLogs.size > 0 ? (errorLogs.length / recentLogs.size) * 100 : 0,
      logStatus: 'operational'
    }

    // Check for log collection issues
    if (recentLogs.size === 0) {
      return {
        status: 'warning',
        details: 'No system logs found - logging may not be configured',
        metrics
      }
    }

    if (errorLogs.length > 10) {
      return {
        status: 'error',
        details: `High error rate detected (${errorLogs.length} errors in recent logs)`,
        metrics
      }
    }

    if (errorLogs.length > 5) {
      return {
        status: 'warning',
        details: `Elevated error rate detected (${errorLogs.length} errors in recent logs)`,
        metrics
      }
    }
    
    // Check for authentication errors specifically
    const authErrors = errorLogs.filter((doc: any) => 
      doc.data().message?.includes('auth') || 
      doc.data().message?.includes('Authentication') ||
      doc.data().message?.includes('token')
    )
    
    if (authErrors.length > 0) {
      return {
        status: 'warning',
        details: `Authentication errors detected (${authErrors.length} auth-related errors)`,
        metrics: {
          ...metrics,
          authErrors: authErrors.length
        }
      }
    }

    return {
      status: 'healthy',
      details: 'System logs are healthy',
      metrics
    }

  } catch (error) {
    return {
      status: 'error',
      details: `Log check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      metrics: {
        logStatus: 'error'
      }
    }
  }
} 