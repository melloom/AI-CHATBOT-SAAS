import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, verifyServerAuth } from '@/lib/firebase-admin'
import { z } from 'zod'

// Validation schema for backup request
const backupRequestSchema = z.object({
  includeUsers: z.boolean().default(true),
  includeChatbots: z.boolean().default(true),
  includeCompanies: z.boolean().default(true),
  includeSettings: z.boolean().default(true),
  includeAnalytics: z.boolean().default(true),
  compression: z.boolean().default(true),
  encryption: z.boolean().default(true),
  description: z.string().optional()
})

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
    const validatedData = backupRequestSchema.parse(body)

    // Create backup record
    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const backupData = {
      id: backupId,
      createdAt: new Date().toISOString(),
      createdBy: decodedToken.uid,
      createdByEmail: decodedToken.email,
      status: 'in_progress',
      progress: 0,
      description: validatedData.description || 'Manual backup',
      settings: validatedData,
      collections: [],
      totalRecords: 0,
      backupSize: 0,
      duration: 0,
      error: null
    }

    // Save backup record
    await db.collection('systemBackups').doc(backupId).set(backupData)

    // Start backup process asynchronously
    performBackup(backupId, validatedData, db)

    return NextResponse.json({ 
      success: true, 
      message: 'Backup started successfully',
      backupId: backupId
    })

  } catch (error) {
    console.error('Error starting backup:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid backup parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to start backup' },
      { status: 500 }
    )
  }
}

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

    // Get backup status
    const { searchParams } = new URL(request.url)
    const backupId = searchParams.get('id')

    if (backupId) {
      // Get specific backup
      const backupDoc = await db.collection('systemBackups').doc(backupId).get()
      if (!backupDoc.exists) {
        return NextResponse.json(
          { error: 'Backup not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(backupDoc.data())
    } else {
      // Get all backups
      const backupsSnapshot = await db.collection('systemBackups')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get()
      
      const backups = backupsSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }))

      return NextResponse.json({ backups })
    }

  } catch (error) {
    console.error('Error fetching backups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch backups' },
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

    // Get backup ID to delete
    const { searchParams } = new URL(request.url)
    const backupId = searchParams.get('id')

    if (!backupId) {
      return NextResponse.json(
        { error: 'Backup ID is required' },
        { status: 400 }
      )
    }

    // Check if backup exists
    const backupDoc = await db.collection('systemBackups').doc(backupId).get()
    if (!backupDoc.exists) {
      return NextResponse.json(
        { error: 'Backup not found' },
        { status: 404 }
      )
    }

    // Delete the backup
    await db.collection('systemBackups').doc(backupId).delete()

    return NextResponse.json({ 
      success: true, 
      message: 'Backup deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting backup:', error)
    return NextResponse.json(
      { error: 'Failed to delete backup' },
      { status: 500 }
    )
  }
}

async function performBackup(backupId: string, settings: any, db: any) {
  const startTime = Date.now()
  let totalRecords = 0
  let backupSize = 0
  const collections: string[] = []

  try {
    // Update status to in progress
    await db.collection('systemBackups').doc(backupId).update({
      status: 'in_progress',
      progress: 0
    })

    // Backup collections based on settings
    const collectionsToBackup = []
    
    if (settings.includeUsers) collectionsToBackup.push('users')
    if (settings.includeChatbots) collectionsToBackup.push('chatbots')
    if (settings.includeCompanies) collectionsToBackup.push('companies')
    if (settings.includeSettings) collectionsToBackup.push('systemSettings')
    if (settings.includeAnalytics) collectionsToBackup.push('analytics')

    for (let i = 0; i < collectionsToBackup.length; i++) {
      const collectionName = collectionsToBackup[i]
      
      // Update progress
      const progress = Math.round(((i + 1) / collectionsToBackup.length) * 100)
      await db.collection('systemBackups').doc(backupId).update({
        progress,
        currentCollection: collectionName
      })

      // Get all documents from collection
      const snapshot = await db.collection(collectionName).get()
      const documents = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }))

      // Store backup data
      const backupCollectionId = `${backupId}_${collectionName}`
      await db.collection('backupData').doc(backupCollectionId).set({
        backupId,
        collectionName,
        documents,
        documentCount: documents.length,
        createdAt: new Date().toISOString(),
        compression: settings.compression,
        encryption: settings.encryption
      })

      totalRecords += documents.length
      backupSize += JSON.stringify(documents).length
      collections.push(collectionName)

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Calculate duration
    const duration = Date.now() - startTime

    // Update backup record with completion
    await db.collection('systemBackups').doc(backupId).update({
      status: 'completed',
      progress: 100,
      totalRecords,
      backupSize,
      duration,
      collections,
      completedAt: new Date().toISOString(),
      currentCollection: null
    })

    console.log(`Backup ${backupId} completed successfully`)

  } catch (error) {
    console.error('Backup failed:', { backupId, error: error instanceof Error ? error.message : 'Unknown error' })
    
    // Update backup record with error
    await db.collection('systemBackups').doc(backupId).update({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      completedAt: new Date().toISOString()
    })
  }
} 