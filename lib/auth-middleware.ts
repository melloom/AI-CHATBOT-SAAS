import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'

export interface SecuritySettings {
  requireEmailVerification: boolean
  requirePhoneVerification: boolean
  enableTwoFactorAuth: boolean
  allowSocialLogin: boolean
  sessionTimeout: string
  maxLoginAttempts: number
  lockoutDuration: string
  adminOnlyAccess: boolean
  ipWhitelist: string
  allowedDomains: string
  maxConcurrentSessions: number
}

export interface LoginAttempt {
  userId: string
  email: string
  ipAddress: string
  timestamp: Date
  success: boolean
  userAgent: string
}

export interface UserSession {
  userId: string
  sessionId: string
  ipAddress: string
  userAgent: string
  createdAt: Date
  lastActivity: Date
  expiresAt: Date
}

class AuthMiddleware {
  private db: any
  private adminAuth: any

  constructor() {
    this.db = getAdminDb()
    this.adminAuth = getAdminAuth()
  }

  // Get security settings from Firestore
  async getSecuritySettings(): Promise<SecuritySettings> {
    try {
      const settingsDoc = await this.db.collection('securitySettings').doc('main').get()
      if (settingsDoc.exists) {
        return settingsDoc.data() as SecuritySettings
      }
      // Return default settings
      return {
        requireEmailVerification: true,
        requirePhoneVerification: false,
        enableTwoFactorAuth: true,
        allowSocialLogin: true,
        sessionTimeout: "24h",
        maxLoginAttempts: 5,
        lockoutDuration: "15m",
        adminOnlyAccess: false,
        ipWhitelist: "",
        allowedDomains: "",
        maxConcurrentSessions: 3
      }
    } catch (error) {
      console.error('Error fetching security settings:', error)
      throw error
    }
  }

  // Validate IP address against whitelist
  async validateIPAddress(ipAddress: string): Promise<boolean> {
    try {
      const settings = await this.getSecuritySettings()
      if (!settings.ipWhitelist || settings.ipWhitelist.trim() === '') {
        return true // No whitelist configured
      }

      const whitelistedIPs = settings.ipWhitelist.split(',').map(ip => ip.trim())
      return whitelistedIPs.some(ip => this.isIPInRange(ipAddress, ip))
    } catch (error) {
      console.error('Error validating IP address:', error)
      return false
    }
  }

  // Check if IP is in CIDR range
  private isIPInRange(ip: string, cidr: string): boolean {
    if (!cidr.includes('/')) {
      return ip === cidr
    }

    // Simple CIDR validation - in production, use a proper IP library
    const [network, bits] = cidr.split('/')
    const networkParts = network.split('.').map(Number)
    const ipParts = ip.split('.').map(Number)
    
    const mask = parseInt(bits)
    const networkNum = (networkParts[0] << 24) + (networkParts[1] << 16) + (networkParts[2] << 8) + networkParts[3]
    const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3]
    
    const maskNum = mask === 32 ? -1 : ~((1 << (32 - mask)) - 1)
    
    return (networkNum & maskNum) === (ipNum & maskNum)
  }

  // Check login attempts and lockout status
  async checkLoginAttempts(email: string, ipAddress: string): Promise<{ allowed: boolean; remainingAttempts: number; lockoutUntil?: Date }> {
    try {
      const settings = await this.getSecuritySettings()
      const now = new Date()
      const lockoutDurationMs = this.parseDuration(settings.lockoutDuration)

      // Get recent failed attempts
      const failedAttempts = await this.db.collection('loginAttempts')
        .where('email', '==', email)
        .where('ipAddress', '==', ipAddress)
        .where('success', '==', false)
        .where('timestamp', '>', new Date(now.getTime() - lockoutDurationMs))
        .orderBy('timestamp', 'desc')
        .limit(settings.maxLoginAttempts)
        .get()

      const recentFailures = failedAttempts.docs.length

      if (recentFailures >= settings.maxLoginAttempts) {
        const oldestFailure = failedAttempts.docs[recentFailures - 1].data().timestamp.toDate()
        const lockoutUntil = new Date(oldestFailure.getTime() + lockoutDurationMs)
        
        if (now < lockoutUntil) {
          return {
            allowed: false,
            remainingAttempts: 0,
            lockoutUntil
          }
        }
      }

      return {
        allowed: true,
        remainingAttempts: Math.max(0, settings.maxLoginAttempts - recentFailures)
      }
    } catch (error) {
      console.error('Error checking login attempts:', error)
      return { allowed: true, remainingAttempts: 5 }
    }
  }

  // Record login attempt
  async recordLoginAttempt(attempt: LoginAttempt): Promise<void> {
    try {
      await this.db.collection('loginAttempts').add({
        ...attempt,
        timestamp: new Date()
      })
    } catch (error) {
      console.error('Error recording login attempt:', error)
    }
  }

  // Validate email verification
  async validateEmailVerification(user: User): Promise<boolean> {
    try {
      const settings = await this.getSecuritySettings()
      if (!settings.requireEmailVerification) {
        return true
      }

      return user.emailVerified
    } catch (error) {
      console.error('Error validating email verification:', error)
      return false
    }
  }

  // Validate phone verification
  async validatePhoneVerification(user: User): Promise<boolean> {
    try {
      const settings = await this.getSecuritySettings()
      if (!settings.requirePhoneVerification) {
        return true
      }

      // Check if user has verified phone number
      const userDoc = await this.db.collection('users').doc(user.uid).get()
      if (userDoc.exists) {
        const userData = userDoc.data()
        return userData?.phoneVerified === true
      }

      return false
    } catch (error) {
      console.error('Error validating phone verification:', error)
      return false
    }
  }

  // Validate 2FA
  async validateTwoFactorAuth(user: User): Promise<boolean> {
    try {
      const settings = await this.getSecuritySettings()
      if (!settings.enableTwoFactorAuth) {
        return true
      }

      // Check if user has 2FA enabled and verified
      const userDoc = await this.db.collection('users').doc(user.uid).get()
      if (userDoc.exists) {
        const userData = userDoc.data()
        return userData?.twoFactorEnabled === true && userData?.twoFactorVerified === true
      }

      return false
    } catch (error) {
      console.error('Error validating 2FA:', error)
      return false
    }
  }

  // Check concurrent sessions
  async checkConcurrentSessions(userId: string, sessionId: string): Promise<boolean> {
    try {
      const settings = await this.getSecuritySettings()
      const now = new Date()

      // Get active sessions for user
      const activeSessions = await this.db.collection('userSessions')
        .where('userId', '==', userId)
        .where('expiresAt', '>', now)
        .get()

      const sessionCount = activeSessions.docs.length

      // If we're at the limit, remove oldest session
      if (sessionCount >= settings.maxConcurrentSessions) {
        const oldestSession = activeSessions.docs.reduce((oldest: any, current: any) => {
          const oldestData = oldest.data()
          const currentData = current.data()
          return oldestData.lastActivity < currentData.lastActivity ? oldest : current
        })

        await this.db.collection('userSessions').doc(oldestSession.id).delete()
      }

      return true
    } catch (error) {
      console.error('Error checking concurrent sessions:', error)
      return true
    }
  }

  // Create user session
  async createUserSession(userId: string, sessionId: string, ipAddress: string, userAgent: string): Promise<void> {
    try {
      const settings = await this.getSecuritySettings()
      const now = new Date()
      const sessionTimeoutMs = this.parseDuration(settings.sessionTimeout)
      const expiresAt = new Date(now.getTime() + sessionTimeoutMs)

      await this.db.collection('userSessions').doc(sessionId).set({
        userId,
        sessionId,
        ipAddress,
        userAgent,
        createdAt: now,
        lastActivity: now,
        expiresAt
      })
    } catch (error) {
      console.error('Error creating user session:', error)
    }
  }

  // Update session activity
  async updateSessionActivity(sessionId: string): Promise<void> {
    try {
      await this.db.collection('userSessions').doc(sessionId).update({
        lastActivity: new Date()
      })
    } catch (error) {
      console.error('Error updating session activity:', error)
    }
  }

  // Validate session
  async validateSession(sessionId: string): Promise<{ valid: boolean; userId?: string }> {
    try {
      const sessionDoc = await this.db.collection('userSessions').doc(sessionId).get()
      if (!sessionDoc.exists) {
        return { valid: false }
      }

      const sessionData = sessionDoc.data() as UserSession
      const now = new Date()

      if (now > sessionData.expiresAt) {
        // Session expired, remove it
        await this.db.collection('userSessions').doc(sessionId).delete()
        return { valid: false }
      }

      // Update last activity
      await this.updateSessionActivity(sessionId)

      return { valid: true, userId: sessionData.userId }
    } catch (error) {
      console.error('Error validating session:', error)
      return { valid: false }
    }
  }

  // Parse duration string to milliseconds
  private parseDuration(duration: string): number {
    const unit = duration.slice(-1)
    const value = parseInt(duration.slice(0, -1))

    switch (unit) {
      case 'm': return value * 60 * 1000
      case 'h': return value * 60 * 60 * 1000
      case 'd': return value * 24 * 60 * 60 * 1000
      default: return 15 * 60 * 1000 // Default 15 minutes
    }
  }

  // Validate domain restrictions
  async validateDomain(email: string): Promise<boolean> {
    try {
      const settings = await this.getSecuritySettings()
      if (!settings.allowedDomains || settings.allowedDomains.trim() === '') {
        return true // No domain restrictions
      }

      const emailDomain = email.split('@')[1]
      const allowedDomains = settings.allowedDomains.split(',').map(domain => domain.trim())
      
      return allowedDomains.some(domain => emailDomain === domain)
    } catch (error) {
      console.error('Error validating domain:', error)
      return false
    }
  }

  // Check admin-only access
  async checkAdminOnlyAccess(user: User): Promise<boolean> {
    try {
      const settings = await this.getSecuritySettings()
      if (!settings.adminOnlyAccess) {
        return true
      }

      const userDoc = await this.db.collection('users').doc(user.uid).get()
      if (userDoc.exists) {
        const userData = userDoc.data()
        return userData?.isAdmin === true
      }

      return false
    } catch (error) {
      console.error('Error checking admin access:', error)
      return false
    }
  }

  // Comprehensive authentication validation
  async validateAuthentication(user: User, ipAddress: string, userAgent: string): Promise<{
    valid: boolean
    errors: string[]
    warnings: string[]
  }> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Check IP whitelist
      const ipAllowed = await this.validateIPAddress(ipAddress)
      if (!ipAllowed) {
        errors.push('Access denied: IP address not in whitelist')
      }

      // Check admin-only access
      const adminAccess = await this.checkAdminOnlyAccess(user)
      if (!adminAccess) {
        errors.push('Access denied: Admin-only mode is enabled')
      }

      // Check email verification
      const emailVerified = await this.validateEmailVerification(user)
      if (!emailVerified) {
        errors.push('Email verification required')
      }

      // Check phone verification
      const phoneVerified = await this.validatePhoneVerification(user)
      if (!phoneVerified) {
        errors.push('Phone verification required')
      }

      // Check 2FA
      const twoFactorValid = await this.validateTwoFactorAuth(user)
      if (!twoFactorValid) {
        errors.push('Two-factor authentication required')
      }

      // Check domain restrictions
      const domainValid = await this.validateDomain(user.email || '')
      if (!domainValid) {
        errors.push('Email domain not allowed')
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings
      }
    } catch (error) {
      console.error('Error validating authentication:', error)
      return {
        valid: false,
        errors: ['Authentication validation failed'],
        warnings: []
      }
    }
  }
}

export const authMiddleware = new AuthMiddleware() 