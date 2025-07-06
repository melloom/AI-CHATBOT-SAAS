import { NextRequest, NextResponse } from 'next/server'
import { BackupManagementService } from '@/lib/backup-management'
import { getAdminDb, verifyServerAuth } from '@/lib/firebase-admin'

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

    const backupService = BackupManagementService.getInstance()
    const backups = await backupService.getAllBackups()
    const stats = await backupService.getBackupStats()

    return NextResponse.json({ backups, stats })
  } catch (error) {
    console.error('Failed to get backups:', error)
    return NextResponse.json({ error: 'Failed to get backups' }, { status: 500 })
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

    const { action, backupId, type } = await request.json()
    const backupService = BackupManagementService.getInstance()

    switch (action) {
      case 'recover':
        if (!backupId || !type) {
          return NextResponse.json({ error: 'Missing backupId or type' }, { status: 400 })
        }
        
        const success = await backupService.recoverBackup(backupId, type)
        return NextResponse.json({ success })

      case 'cleanup':
        const deletedCount = await backupService.cleanupExpiredBackups()
        return NextResponse.json({ deletedCount })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Failed to perform backup action:', error)
    return NextResponse.json({ error: 'Failed to perform backup action' }, { status: 500 })
  }
} 