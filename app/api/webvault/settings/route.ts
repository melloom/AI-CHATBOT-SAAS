import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

// Settings fields to support
const SETTINGS_FIELDS = [
  // Company Info
  'companyName', 'companyEmail', 'companyPhone', 'companyAddress', 'website',
  // WebVault Configuration
  'defaultDomain', 'sslEnabled', 'autoBackup', 'maintenanceMode', 'analyticsEnabled',
  // Notification Settings
  'emailNotifications', 'smsNotifications', 'projectUpdates', 'securityAlerts', 'billingReminders',
  // Security Settings
  'twoFactorAuth', 'sessionTimeout', 'passwordPolicy', 'ipWhitelist',
  // Billing Settings
  'billingCycle', 'autoRenewal', 'taxExempt', 'currency'
]

const SETTINGS_COLLECTION = 'webvaultSettings'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    // Find companyId for this user (assume user doc has companyId)
    const userDoc = await adminDb.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const userData = userDoc.data()
    const companyId = userData?.companyId || userId // fallback: use userId as companyId

    // Fetch settings for this company
    const settingsDoc = await adminDb.collection(SETTINGS_COLLECTION).doc(companyId).get()
    if (!settingsDoc.exists) {
      // Pre-populate with default settings
      const defaultSettings = {
        companyName: userData.displayName || '',
        companyEmail: userData.email || '',
        companyPhone: '',
        companyAddress: '',
        website: '',
        defaultDomain: '',
        sslEnabled: false,
        autoBackup: false,
        maintenanceMode: false,
        analyticsEnabled: false,
        emailNotifications: false,
        smsNotifications: false,
        projectUpdates: false,
        securityAlerts: false,
        billingReminders: false,
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordPolicy: 'strong',
        ipWhitelist: '',
        billingCycle: 'monthly',
        autoRenewal: false,
        taxExempt: false,
        currency: 'USD',
      }
      await adminDb.collection(SETTINGS_COLLECTION).doc(companyId).set(defaultSettings)
      return NextResponse.json(defaultSettings)
    }
    return NextResponse.json(settingsDoc.data())
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    // Find companyId for this user (assume user doc has companyId)
    const userDoc = await adminDb.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const userData = userDoc.data()
    const companyId = userData?.companyId || userId

    const body = await request.json()
    // Only allow known fields
    const updateData: Record<string, any> = {}
    for (const key of SETTINGS_FIELDS) {
      if (key in body) updateData[key] = body[key]
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }
    await adminDb.collection(SETTINGS_COLLECTION).doc(companyId).set(updateData, { merge: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 