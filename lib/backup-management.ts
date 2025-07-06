import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "./firebase"

export interface BackupItem {
  id: string
  originalId: string
  type: 'company' | 'user'
  data: any
  deletedAt: string
  deletedBy: string
  expiresAt: string
  canRecover: boolean
}

export class BackupManagementService {
  private static instance: BackupManagementService

  private constructor() {}

  static getInstance(): BackupManagementService {
    if (!BackupManagementService.instance) {
      BackupManagementService.instance = new BackupManagementService()
    }
    return BackupManagementService.instance
  }

  // Create backup when deleting company or user
  async createBackup(originalId: string, type: 'company' | 'user', data: any, deletedBy: string): Promise<string> {
    try {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

      const backupData = {
        originalId,
        type,
        data,
        deletedAt: new Date().toISOString(),
        deletedBy,
        expiresAt: expiresAt.toISOString(),
        canRecover: true
      }

      const collectionName = type === 'company' ? 'deleted_companies' : 'deleted_users'
      const docRef = await addDoc(collection(db, collectionName), backupData)
      
      console.log(`Backup created for ${type} ${originalId}: ${docRef.id}`)
      return docRef.id
    } catch (error) {
      console.error(`Failed to create backup for ${type} ${originalId}:`, error)
      throw error
    }
  }

  // Get all backups (for admin view)
  async getAllBackups(): Promise<BackupItem[]> {
    try {
      const [companyBackups, userBackups] = await Promise.all([
        this.getBackupsByType('company'),
        this.getBackupsByType('user')
      ])

      return [...companyBackups, ...userBackups].sort((a, b) => 
        new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
      )
    } catch (error) {
      console.error('Failed to get all backups:', error)
      throw error
    }
  }

  // Get backups by type
  async getBackupsByType(type: 'company' | 'user'): Promise<BackupItem[]> {
    try {
      const collectionName = type === 'company' ? 'deleted_companies' : 'deleted_users'
      const q = query(
        collection(db, collectionName),
        where('canRecover', '==', true),
        orderBy('deletedAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BackupItem[]
    } catch (error) {
      console.error(`Failed to get ${type} backups:`, error)
      throw error
    }
  }

  // Recover a deleted item
  async recoverBackup(backupId: string, type: 'company' | 'user'): Promise<boolean> {
    try {
      const collectionName = type === 'company' ? 'deleted_companies' : 'deleted_users'
      const backupDoc = await getDoc(doc(db, collectionName, backupId))
      
      if (!backupDoc.exists()) {
        throw new Error('Backup not found')
      }

      const backupData = backupDoc.data() as BackupItem
      
      // Check if backup is still valid (not expired)
      const expiresAt = new Date(backupData.expiresAt)
      if (expiresAt < new Date()) {
        throw new Error('Backup has expired and cannot be recovered')
      }

      // Restore the original data
      const originalCollection = type === 'company' ? 'companies' : 'users'
      await addDoc(collection(db, originalCollection), {
        ...backupData.data,
        recoveredAt: new Date().toISOString(),
        recoveredFrom: backupId
      })

      // Mark backup as recovered
      await updateDoc(doc(db, collectionName, backupId), {
        canRecover: false,
        recoveredAt: new Date().toISOString()
      })

      console.log(`Successfully recovered ${type} from backup ${backupId}`)
      return true
    } catch (error) {
      console.error(`Failed to recover ${type} from backup ${backupId}:`, error)
      throw error
    }
  }

  // Permanently delete expired backups
  async cleanupExpiredBackups(): Promise<number> {
    try {
      const now = new Date()
      let deletedCount = 0

      // Clean up expired company backups
      const companyBackups = await this.getBackupsByType('company')
      for (const backup of companyBackups) {
        const expiresAt = new Date(backup.expiresAt)
        if (expiresAt < now) {
          await deleteDoc(doc(db, 'deleted_companies', backup.id))
          deletedCount++
        }
      }

      // Clean up expired user backups
      const userBackups = await this.getBackupsByType('user')
      for (const backup of userBackups) {
        const expiresAt = new Date(backup.expiresAt)
        if (expiresAt < now) {
          await deleteDoc(doc(db, 'deleted_users', backup.id))
          deletedCount++
        }
      }

      console.log(`Cleaned up ${deletedCount} expired backups`)
      return deletedCount
    } catch (error) {
      console.error('Failed to cleanup expired backups:', error)
      throw error
    }
  }

  // Get backup statistics
  async getBackupStats(): Promise<{
    totalBackups: number
    companyBackups: number
    userBackups: number
    expiredBackups: number
    recoverableBackups: number
  }> {
    try {
      const allBackups = await this.getAllBackups()
      const now = new Date()
      
      const expiredBackups = allBackups.filter(backup => 
        new Date(backup.expiresAt) < now
      ).length

      const recoverableBackups = allBackups.filter(backup => 
        backup.canRecover && new Date(backup.expiresAt) >= now
      ).length

      return {
        totalBackups: allBackups.length,
        companyBackups: allBackups.filter(b => b.type === 'company').length,
        userBackups: allBackups.filter(b => b.type === 'user').length,
        expiredBackups,
        recoverableBackups
      }
    } catch (error) {
      console.error('Failed to get backup stats:', error)
      throw error
    }
  }
} 