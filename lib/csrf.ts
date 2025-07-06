import { NextRequest } from 'next/server'
import crypto from 'crypto'

// CSRF token generation and validation
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32
  private static readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

  // Generate a new CSRF token
  static generateToken(): string {
    return crypto.randomBytes(this.TOKEN_LENGTH).toString('hex')
  }

  // Validate CSRF token
  static validateToken(token: string, storedToken: string, timestamp: number): boolean {
    if (!token || !storedToken) return false
    
    // Check if token is expired
    const now = Date.now()
    if (now - timestamp > this.TOKEN_EXPIRY) return false
    
    // Compare tokens
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(storedToken, 'hex')
    )
  }

  // Extract CSRF token from request
  static async extractToken(request: NextRequest): Promise<string | null> {
    // Check Authorization header first
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split('Bearer ')[1]
    }

    // Check X-CSRF-Token header
    const csrfHeader = request.headers.get('x-csrf-token')
    if (csrfHeader) {
      return csrfHeader
    }

    // Check form data
    try {
      const formData = await request.formData()
      const csrfField = formData.get('csrf_token')
      if (csrfField && typeof csrfField === 'string') {
        return csrfField
      }
    } catch (error) {
      // Form data not available or invalid
    }

    return null
  }

  // Verify CSRF token for API endpoints
  static async verifyCSRF(request: NextRequest, db: any): Promise<boolean> {
    const token = await this.extractToken(request)
    if (!token) return false

    try {
      // Get user from auth token
      const authHeader = request.headers.get('authorization')
      if (!authHeader?.startsWith('Bearer ')) return false

      const idToken = authHeader.split('Bearer ')[1]
      const adminAuth = (await import('./firebase-admin')).adminAuth
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      
      // Get user's stored CSRF token
      const userDoc = await db.collection('users').doc(decodedToken.uid).get()
      if (!userDoc.exists) return false

      const userData = userDoc.data()
      if (!userData.csrfToken || !userData.csrfTimestamp) return false

      return this.validateToken(token, userData.csrfToken, userData.csrfTimestamp)
    } catch (error) {
      console.error('CSRF verification error:', error)
      return false
    }
  }
}

// Rate limiting utility
export class RateLimiter {
  private static readonly WINDOW_MS = 15 * 60 * 1000 // 15 minutes
  private static readonly MAX_REQUESTS = 100 // Max requests per window
  private static readonly BLOCK_DURATION = 60 * 60 * 1000 // 1 hour block

  static async checkRateLimit(ip: string, db: any): Promise<{ allowed: boolean; remaining: number }> {
    const now = Date.now()
    const windowStart = now - this.WINDOW_MS

    try {
      // Get rate limit data
      const rateLimitDoc = await db.collection('rateLimits').doc(ip).get()
      let rateLimitData = rateLimitDoc.exists ? rateLimitDoc.data() : { requests: [], blocked: false, blockUntil: 0 }

      // Check if IP is blocked
      if (rateLimitData.blocked && now < rateLimitData.blockUntil) {
        return { allowed: false, remaining: 0 }
      }

      // Filter requests within current window
      const recentRequests = rateLimitData.requests?.filter((timestamp: number) => timestamp > windowStart) || []
      const requestCount = recentRequests.length

      if (requestCount >= this.MAX_REQUESTS) {
        // Block the IP
        await db.collection('rateLimits').doc(ip).set({
          requests: recentRequests,
          blocked: true,
          blockUntil: now + this.BLOCK_DURATION,
          lastUpdated: now
        })
        return { allowed: false, remaining: 0 }
      }

      // Add current request
      recentRequests.push(now)
      await db.collection('rateLimits').doc(ip).set({
        requests: recentRequests,
        blocked: false,
        blockUntil: 0,
        lastUpdated: now
      })

      return { allowed: true, remaining: this.MAX_REQUESTS - requestCount - 1 }
    } catch (error) {
      console.error('Rate limit check error:', error)
      return { allowed: true, remaining: this.MAX_REQUESTS }
    }
  }
}

// Input validation utility
export class InputValidator {
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validatePassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
  }

  static validateUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  static sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return typeof obj === 'string' ? this.sanitizeString(obj) : obj
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item))
    }

    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value)
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value)
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }
}

// Security headers utility
export class SecurityHeaders {
  static getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }
} 