import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, verifyServerAuth } from '@/lib/firebase-admin'
import { z } from 'zod'

// Validation schema for cache clearing request
const clearCacheRequestSchema = z.object({
  clearSystemCache: z.boolean().default(true),
  clearUserCache: z.boolean().default(true),
  clearAnalyticsCache: z.boolean().default(true),
  clearSettingsCache: z.boolean().default(true),
  clearTempFiles: z.boolean().default(true),
  clearLogs: z.boolean().default(false),
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
    const validatedData = clearCacheRequestSchema.parse(body)

    // Create cache clearing record
    const cacheClearId = `cache_clear_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const cacheClearData = {
      id: cacheClearId,
      createdAt: new Date().toISOString(),
      createdBy: decodedToken.uid,
      createdByEmail: decodedToken.email,
      status: 'in_progress',
      progress: 0,
      description: validatedData.description || 'Manual cache clear',
      settings: validatedData,
      clearedItems: [],
      totalItems: 0,
      clearedSize: 0,
      duration: 0,
      error: null
    }

    // Save cache clear record
    await db.collection('cacheClears').doc(cacheClearId).set(cacheClearData)

    // Start cache clearing process asynchronously
    performCacheClear(cacheClearId, validatedData, db)

    return NextResponse.json({ 
      success: true, 
      message: 'Cache clearing started successfully',
      cacheClearId: cacheClearId
    })

  } catch (error) {
    console.error('Error starting cache clear:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid cache clear parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to start cache clear' },
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

    // Get cache clear status
    const { searchParams } = new URL(request.url)
    const cacheClearId = searchParams.get('id')

    if (cacheClearId) {
      // Get specific cache clear
      const cacheClearDoc = await db.collection('cacheClears').doc(cacheClearId).get()
      if (!cacheClearDoc.exists) {
        return NextResponse.json(
          { error: 'Cache clear not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(cacheClearDoc.data())
    } else {
      // Get all cache clears
      const cacheClearsSnapshot = await db.collection('cacheClears')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get()
      
      const cacheClears = cacheClearsSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }))

      return NextResponse.json({ cacheClears })
    }

  } catch (error) {
    console.error('Error fetching cache clears:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cache clears' },
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

    // Get cache clear ID to delete
    const { searchParams } = new URL(request.url)
    const cacheClearId = searchParams.get('id')

    if (!cacheClearId) {
      return NextResponse.json(
        { error: 'Cache clear ID is required' },
        { status: 400 }
      )
    }

    // Check if cache clear exists
    const cacheClearDoc = await db.collection('cacheClears').doc(cacheClearId).get()
    if (!cacheClearDoc.exists) {
      return NextResponse.json(
        { error: 'Cache clear record not found' },
        { status: 404 }
      )
    }

    // Delete the cache clear record
    await db.collection('cacheClears').doc(cacheClearId).delete()

    return NextResponse.json({ 
      success: true, 
      message: 'Cache clear record deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting cache clear record:', error)
    return NextResponse.json(
      { error: 'Failed to delete cache clear record' },
      { status: 500 }
    )
  }
}

async function performCacheClear(cacheClearId: string, settings: any, db: any) {
  const startTime = Date.now()
  const clearedItems: string[] = []
  let totalItems = 0
  let clearedSize = 0

  try {
    // Update status to in progress
    await db.collection('cacheClears').doc(cacheClearId).update({
      status: 'in_progress',
      progress: 0
    })

    const tasks = []

    // Add tasks based on settings
    if (settings.clearSystemCache) {
      tasks.push({ name: 'System Cache', task: clearSystemCache })
    }
    if (settings.clearUserCache) {
      tasks.push({ name: 'User Cache', task: clearUserCache })
    }
    if (settings.clearAnalyticsCache) {
      tasks.push({ name: 'Analytics Cache', task: clearAnalyticsCache })
    }
    if (settings.clearSettingsCache) {
      tasks.push({ name: 'Settings Cache', task: clearSettingsCache })
    }
    if (settings.clearTempFiles) {
      tasks.push({ name: 'Temp Files', task: clearTempFiles })
    }
    if (settings.clearLogs) {
      tasks.push({ name: 'Logs', task: clearLogs })
    }

    totalItems = tasks.length

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      
      // Update progress
      const progress = Math.round(((i + 1) / tasks.length) * 100)
      await db.collection('cacheClears').doc(cacheClearId).update({
        progress,
        currentTask: task.name
      })

      // Perform the task
      const result = await task.task(db)
      
      clearedItems.push(task.name)
      clearedSize += result.size || 0

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Calculate duration
    const duration = Date.now() - startTime

    // Update cache clear record with completion
    await db.collection('cacheClears').doc(cacheClearId).update({
      status: 'completed',
      progress: 100,
      clearedItems,
      totalItems,
      clearedSize,
      duration,
      completedAt: new Date().toISOString(),
      currentTask: null
    })

    console.log(`Cache clear ${cacheClearId} completed successfully`)

  } catch (error) {
    console.error('Cache clear failed:', { cacheClearId, error: error instanceof Error ? error.message : 'Unknown error' })
    
    // Update cache clear record with error
    await db.collection('cacheClears').doc(cacheClearId).update({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      completedAt: new Date().toISOString()
    })
  }
}

async function clearSystemCache(db: any) {
  try {
    // Clear system-level cache data
    const cacheRefs = await db.collection('systemCache').get()
    const batch = db.batch()
    
    cacheRefs.forEach((doc: any) => {
      batch.delete(doc.ref)
    })
    
    await batch.commit()
    
    return { 
      success: true, 
      size: cacheRefs.size * 1024, // Estimate size
      message: `Cleared ${cacheRefs.size} system cache entries` 
    }
  } catch (error) {
    console.error('Error clearing system cache:', error)
    return { 
      success: false, 
      size: 0, 
      message: 'Failed to clear system cache' 
    }
  }
}

async function clearUserCache(db: any) {
  try {
    // Clear user-specific cache data
    const userCacheRefs = await db.collection('userCache').get()
    const batch = db.batch()
    
    userCacheRefs.forEach((doc: any) => {
      batch.delete(doc.ref)
    })
    
    await batch.commit()
    
    return { 
      success: true, 
      size: userCacheRefs.size * 512, // Estimate size
      message: `Cleared ${userCacheRefs.size} user cache entries` 
    }
  } catch (error) {
    console.error('Error clearing user cache:', error)
    return { 
      success: false, 
      size: 0, 
      message: 'Failed to clear user cache' 
    }
  }
}

async function clearAnalyticsCache(db: any) {
  try {
    // Clear analytics cache data
    const analyticsCacheRefs = await db.collection('analyticsCache').get()
    const batch = db.batch()
    
    analyticsCacheRefs.forEach((doc: any) => {
      batch.delete(doc.ref)
    })
    
    await batch.commit()
    
    return { 
      success: true, 
      size: analyticsCacheRefs.size * 2048, // Estimate size
      message: `Cleared ${analyticsCacheRefs.size} analytics cache entries` 
    }
  } catch (error) {
    console.error('Error clearing analytics cache:', error)
    return { 
      success: false, 
      size: 0, 
      message: 'Failed to clear analytics cache' 
    }
  }
}

async function clearSettingsCache(db: any) {
  try {
    // Clear settings cache data
    const settingsCacheRefs = await db.collection('settingsCache').get()
    const batch = db.batch()
    
    settingsCacheRefs.forEach((doc: any) => {
      batch.delete(doc.ref)
    })
    
    await batch.commit()
    
    return { 
      success: true, 
      size: settingsCacheRefs.size * 256, // Estimate size
      message: `Cleared ${settingsCacheRefs.size} settings cache entries` 
    }
  } catch (error) {
    console.error('Error clearing settings cache:', error)
    return { 
      success: false, 
      size: 0, 
      message: 'Failed to clear settings cache' 
    }
  }
}

async function clearTempFiles(db: any) {
  try {
    // Clear temporary files data
    const tempFilesRefs = await db.collection('tempFiles').get()
    const batch = db.batch()
    
    tempFilesRefs.forEach((doc: any) => {
      batch.delete(doc.ref)
    })
    
    await batch.commit()
    
    return { 
      success: true, 
      size: tempFilesRefs.size * 4096, // Estimate size
      message: `Cleared ${tempFilesRefs.size} temporary files` 
    }
  } catch (error) {
    console.error('Error clearing temp files:', error)
    return { 
      success: false, 
      size: 0, 
      message: 'Failed to clear temporary files' 
    }
  }
}

async function clearLogs(db: any) {
  try {
    // Clear old log entries (keep last 1000)
    const logsRefs = await db.collection('systemLogs')
      .orderBy('createdAt', 'desc')
      .offset(1000)
      .get()
    
    const batch = db.batch()
    
    logsRefs.forEach((doc: any) => {
      batch.delete(doc.ref)
    })
    
    await batch.commit()
    
    return { 
      success: true, 
      size: logsRefs.size * 128, // Estimate size
      message: `Cleared ${logsRefs.size} old log entries` 
    }
  } catch (error) {
    console.error('Error clearing logs:', error)
    return { 
      success: false, 
      size: 0, 
      message: 'Failed to clear logs' 
    }
  }
} 