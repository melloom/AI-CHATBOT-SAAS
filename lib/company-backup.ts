import { db } from './firebase'
import { 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  where,
  writeBatch,
  orderBy,
  limit
} from 'firebase/firestore'

export interface CompanyBackup {
  company: any
  users: any[]
  chatbots: any[]
  conversations: any[]
  analytics: any[]
  settings: any[]
  subscriptions: any[]
  notifications: any[]
  backups: {
    timestamp: string
    totalRecords: number
    collections: {
      users: number
      chatbots: number
      conversations: number
      analytics: number
      settings: number
      subscriptions: number
      notifications: number
    }
  }
}

export async function backupCompanyData(companyId: string): Promise<CompanyBackup> {
  console.log(`Starting backup for company: ${companyId}`)
  
  const backup: CompanyBackup = {
    company: null,
    users: [],
    chatbots: [],
    conversations: [],
    analytics: [],
    settings: [],
    subscriptions: [],
    notifications: [],
    backups: {
      timestamp: new Date().toISOString(),
      totalRecords: 0,
      collections: {
        users: 0,
        chatbots: 0,
        conversations: 0,
        analytics: 0,
        settings: 0,
        subscriptions: 0,
        notifications: 0
      }
    }
  }

  try {
    // Backup company data
    const companyDoc = await getDocs(query(collection(db, 'companies'), where('__name__', '==', companyId)))
    if (!companyDoc.empty) {
      backup.company = { id: companyId, ...companyDoc.docs[0].data() }
    }

    // Backup users
    const usersQuery = query(collection(db, 'users'), where('companyId', '==', companyId))
    const usersSnapshot = await getDocs(usersQuery)
    backup.users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    backup.backups.collections.users = backup.users.length

    // Backup chatbots
    const chatbotsQuery = query(collection(db, 'chatbots'), where('companyId', '==', companyId))
    const chatbotsSnapshot = await getDocs(chatbotsQuery)
    backup.chatbots = chatbotsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    backup.backups.collections.chatbots = backup.chatbots.length

    // Backup conversations
    const conversationsQuery = query(collection(db, 'conversations'), where('companyId', '==', companyId))
    const conversationsSnapshot = await getDocs(conversationsQuery)
    backup.conversations = conversationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    backup.backups.collections.conversations = backup.conversations.length

    // Backup analytics
    const analyticsQuery = query(collection(db, 'analytics'), where('companyId', '==', companyId))
    const analyticsSnapshot = await getDocs(analyticsQuery)
    backup.analytics = analyticsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    backup.backups.collections.analytics = backup.analytics.length

    // Backup settings
    const settingsQuery = query(collection(db, 'settings'), where('companyId', '==', companyId))
    const settingsSnapshot = await getDocs(settingsQuery)
    backup.settings = settingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    backup.backups.collections.settings = backup.settings.length

    // Backup subscriptions
    const subscriptionsQuery = query(collection(db, 'subscriptions'), where('companyId', '==', companyId))
    const subscriptionsSnapshot = await getDocs(subscriptionsQuery)
    backup.subscriptions = subscriptionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    backup.backups.collections.subscriptions = backup.subscriptions.length

    // Backup notifications
    const notificationsQuery = query(collection(db, 'notifications'), where('companyId', '==', companyId))
    const notificationsSnapshot = await getDocs(notificationsQuery)
    backup.notifications = notificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    backup.backups.collections.notifications = backup.notifications.length

    // Calculate total records
    backup.backups.totalRecords = Object.values(backup.backups.collections).reduce((sum, count) => sum + count, 0)

    console.log(`Backup completed for company ${companyId}:`, backup.backups)
    return backup

  } catch (error) {
    console.error(`Error backing up company ${companyId}:`, error)
    throw error
  }
}

export async function deleteCompanyData(companyId: string): Promise<void> {
  console.log(`Starting deletion for company: ${companyId}`)
  
  const batch = writeBatch(db)
  let totalDeleted = 0

  try {
    // Delete users
    const usersQuery = query(collection(db, 'users'), where('companyId', '==', companyId))
    const usersSnapshot = await getDocs(usersQuery)
    usersSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
      totalDeleted++
    })

    // Delete chatbots
    const chatbotsQuery = query(collection(db, 'chatbots'), where('companyId', '==', companyId))
    const chatbotsSnapshot = await getDocs(chatbotsQuery)
    chatbotsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
      totalDeleted++
    })

    // Delete conversations
    const conversationsQuery = query(collection(db, 'conversations'), where('companyId', '==', companyId))
    const conversationsSnapshot = await getDocs(conversationsQuery)
    conversationsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
      totalDeleted++
    })

    // Delete analytics
    const analyticsQuery = query(collection(db, 'analytics'), where('companyId', '==', companyId))
    const analyticsSnapshot = await getDocs(analyticsQuery)
    analyticsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
      totalDeleted++
    })

    // Delete settings
    const settingsQuery = query(collection(db, 'settings'), where('companyId', '==', companyId))
    const settingsSnapshot = await getDocs(settingsQuery)
    settingsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
      totalDeleted++
    })

    // Delete subscriptions
    const subscriptionsQuery = query(collection(db, 'subscriptions'), where('companyId', '==', companyId))
    const subscriptionsSnapshot = await getDocs(subscriptionsQuery)
    subscriptionsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
      totalDeleted++
    })

    // Delete notifications
    const notificationsQuery = query(collection(db, 'notifications'), where('companyId', '==', companyId))
    const notificationsSnapshot = await getDocs(notificationsQuery)
    notificationsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
      totalDeleted++
    })

    // Delete company document
    const companyRef = doc(db, 'companies', companyId)
    batch.delete(companyRef)
    totalDeleted++

    // Commit all deletions
    await batch.commit()
    
    console.log(`Successfully deleted company ${companyId} and ${totalDeleted} related records`)
  } catch (error) {
    console.error(`Error deleting company ${companyId}:`, error)
    throw error
  }
}

export function downloadBackupAsJSON(backup: CompanyBackup, companyName: string): void {
  const dataStr = JSON.stringify(backup, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `${companyName}_backup_${new Date().toISOString().split('T')[0]}.json`
  link.click()
  
  URL.revokeObjectURL(link.href)
} 