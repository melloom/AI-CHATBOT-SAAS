import { NextRequest, NextResponse } from 'next/server'
import { CSRFProtection, RateLimiter, InputValidator, SecurityHeaders } from './csrf'

export interface SecurityConfig {
  enableRateLimiting: boolean
  enableCSRF: boolean
  enableInputValidation: boolean
  enableSecurityHeaders: boolean
  maxRequestsPerWindow: number
  windowMs: number
}

export class SecurityMiddleware {
  private static defaultConfig: SecurityConfig = {
    enableRateLimiting: true,
    enableCSRF: true,
    enableInputValidation: true,
    enableSecurityHeaders: true,
    maxRequestsPerWindow: 100,
    windowMs: 15 * 60 * 1000 // 15 minutes
  }

  static async applySecurity(
    request: NextRequest,
    db: any,
    config: Partial<SecurityConfig> = {}
  ): Promise<{ 
    allowed: boolean
    response?: NextResponse
    clientIP: string
    rateLimitRemaining: number
  }> {
    const finalConfig = { ...this.defaultConfig, ...config }
    const clientIP = this.getClientIP(request)

    // 1. Rate Limiting
    if (finalConfig.enableRateLimiting) {
      const rateLimitResult = await RateLimiter.checkRateLimit(clientIP, db)
      if (!rateLimitResult.allowed) {
        return {
          allowed: false,
          response: NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { 
              status: 429, 
              headers: finalConfig.enableSecurityHeaders ? SecurityHeaders.getSecurityHeaders() : {}
            }
          ),
          clientIP,
          rateLimitRemaining: 0
        }
      }
    }

    // 2. CSRF Protection
    if (finalConfig.enableCSRF) {
      const csrfValid = await CSRFProtection.verifyCSRF(request, db)
      if (!csrfValid) {
        console.warn(`CSRF validation failed for ${request.method} ${request.url}`)
        // For admin endpoints, we log but don't block
        // For user endpoints, you might want to block
      }
    }

    return {
      allowed: true,
      clientIP,
      rateLimitRemaining: 100 // Default value
    }
  }

  static getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           request.headers.get('cf-connecting-ip') ||
           'unknown'
  }

  static sanitizeRequestBody(body: any): any {
    return InputValidator.sanitizeObject(body)
  }

  static addSecurityHeaders(response: NextResponse): NextResponse {
    const securityHeaders = SecurityHeaders.getSecurityHeaders()
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  static validateInput(data: any, schema: any): { valid: boolean; errors?: any } {
    try {
      schema.parse(data)
      return { valid: true }
    } catch (error) {
      return { valid: false, errors: error }
    }
  }

  static logSecurityEvent(
    event: string,
    details: any,
    clientIP: string,
    userId?: string
  ): void {
    const securityLog = {
      timestamp: new Date().toISOString(),
      event,
      details,
      clientIP,
      userId,
      userAgent: 'unknown' // You can extract this from request headers
    }

    console.log('Security Event:', securityLog)
    
    // In production, you'd want to log to a security monitoring service
    // like AWS CloudWatch, Google Cloud Logging, or a SIEM system
  }

  static async auditRequest(
    request: NextRequest,
    response: NextResponse,
    db: any,
    userId?: string
  ): Promise<void> {
    const auditLog = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      clientIP: this.getClientIP(request),
      userId,
      statusCode: response.status,
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'unknown'
    }

    try {
      // Store audit log in database
      await db.collection('auditLogs').add(auditLog)
    } catch (error) {
      console.error('Failed to store audit log:', error)
    }
  }
}

// Security validation utilities
export class SecurityValidator {
  static validateEmail(email: string): boolean {
    return InputValidator.validateEmail(email)
  }

  static validatePassword(password: string): boolean {
    return InputValidator.validatePassword(password)
  }

  static validateUUID(uuid: string): boolean {
    return InputValidator.validateUUID(uuid)
  }

  static sanitizeString(input: string): string {
    return InputValidator.sanitizeString(input)
  }

  static validateAPIKey(apiKey: string): boolean {
    // Basic API key validation - should be at least 32 characters
    return typeof apiKey === 'string' && apiKey.length >= 32
  }

  static validateSessionToken(token: string): boolean {
    // Basic session token validation
    return typeof token === 'string' && token.length > 0
  }
}

// Security monitoring utilities
export class SecurityMonitor {
  static async detectSuspiciousActivity(
    request: NextRequest,
    db: any,
    userId?: string
  ): Promise<{ suspicious: boolean; reason?: string }> {
    const clientIP = SecurityMiddleware.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /sqlmap/i,
      /nikto/i,
      /nmap/i,
      /burp/i,
      /w3af/i,
      /acunetix/i,
      /nessus/i,
      /openvas/i,
      /sql injection/i,
      /xss/i,
      /csrf/i,
      /<script/i,
      /javascript:/i,
      /eval\(/i,
      /document\.write/i,
      /innerHTML/i
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(userAgent) || pattern.test(referer)) {
        await this.logSuspiciousActivity(clientIP, userId, 'Suspicious user agent or referer', {
          userAgent,
          referer,
          pattern: pattern.source
        }, db)
        return { suspicious: true, reason: 'Suspicious user agent or referer detected' }
      }
    }

    // Check for rapid requests from same IP
    const recentRequests = await this.getRecentRequests(clientIP, db)
    if (recentRequests.length > 50) { // More than 50 requests in last minute
      await this.logSuspiciousActivity(clientIP, userId, 'Rapid requests detected', {
        requestCount: recentRequests.length,
        timeWindow: '1 minute'
      }, db)
      return { suspicious: true, reason: 'Rapid requests detected' }
    }

    return { suspicious: false }
  }

  private static async getRecentRequests(clientIP: string, db: any): Promise<any[]> {
    try {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000)
      const requestsSnapshot = await db.collection('auditLogs')
        .where('clientIP', '==', clientIP)
        .where('timestamp', '>', oneMinuteAgo.toISOString())
        .get()
      
      return requestsSnapshot.docs.map((doc: any) => doc.data())
    } catch (error) {
      console.error('Error getting recent requests:', error)
      return []
    }
  }

  private static async logSuspiciousActivity(
    clientIP: string,
    userId: string | undefined,
    reason: string,
    details: any,
    db: any
  ): Promise<void> {
    const securityAlert = {
      timestamp: new Date().toISOString(),
      type: 'suspicious_activity',
      clientIP,
      userId,
      reason,
      details,
      severity: 'medium'
    }

    try {
      await db.collection('securityAlerts').add(securityAlert)
      console.warn('Security Alert:', securityAlert)
    } catch (error) {
      console.error('Failed to log security alert:', error)
    }
  }
} 