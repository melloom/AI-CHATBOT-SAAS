"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getAuthHeaders } from "@/lib/auth-client"
import { 
  Database, 
  Users, 
  Building2, 
  RotateCcw, 
  Trash2, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Crown,
  RefreshCw,
  FileText,
  Archive
} from "lucide-react"

interface BackupItem {
  id: string
  originalId: string
  type: 'company' | 'user'
  data: any
  deletedAt: string
  deletedBy: string
  expiresAt: string
  canRecover: boolean
}

interface BackupStats {
  totalBackups: number
  companyBackups: number
  userBackups: number
  expiredBackups: number
  recoverableBackups: number
}

export default function BackupRecoveryComponent() {
  const [backups, setBackups] = useState<BackupItem[]>([])
  const [stats, setStats] = useState<BackupStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [recovering, setRecovering] = useState(false)
  const [showRecoverDialog, setShowRecoverDialog] = useState(false)
  const [backupToRecover, setBackupToRecover] = useState<BackupItem | null>(null)
  const [showCleanupDialog, setShowCleanupDialog] = useState(false)
  const [cleaningUp, setCleaningUp] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = async () => {
    try {
      setLoading(true)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings/backup-management', {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setBackups(data.backups || [])
        setStats(data.stats || null)
      } else {
        console.error('Failed to load backups')
        toast({
          title: "Error",
          description: "Failed to load backup data",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error loading backups:', error)
      toast({
        title: "Error",
        description: "Failed to load backup data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRecoverBackup = async (backup: BackupItem) => {
    setBackupToRecover(backup)
    setShowRecoverDialog(true)
  }

  const confirmRecoverBackup = async () => {
    if (!backupToRecover) return

    setRecovering(true)
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch('/api/settings/backup-management', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'recover',
          backupId: backupToRecover.id,
          type: backupToRecover.type
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast({
            title: "Recovery Successful",
            description: `${backupToRecover.type === 'company' ? 'Company' : 'User'} has been recovered successfully.`,
            variant: "default"
          })
          loadBackups() // Refresh the list
        } else {
          throw new Error('Recovery failed')
        }
      } else {
        throw new Error('Recovery failed')
      }
    } catch (error) {
      console.error('Error recovering backup:', error)
      toast({
        title: "Recovery Failed",
        description: "Failed to recover backup. It may have expired.",
        variant: "destructive"
      })
    } finally {
      setRecovering(false)
      setShowRecoverDialog(false)
      setBackupToRecover(null)
    }
  }

  const handleCleanupExpired = async () => {
    setCleaningUp(true)
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch('/api/settings/backup-management', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'cleanup'
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Cleanup Complete",
          description: `Removed ${result.deletedCount} expired backups.`,
          variant: "default"
        })
        loadBackups() // Refresh the list
      } else {
        throw new Error('Cleanup failed')
      }
    } catch (error) {
      console.error('Error cleaning up expired backups:', error)
      toast({
        title: "Cleanup Failed",
        description: "Failed to cleanup expired backups.",
        variant: "destructive"
      })
    } finally {
      setCleaningUp(false)
      setShowCleanupDialog(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getExpiryBadge = (expiresAt: string) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiresAt)
    
    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>
    } else if (daysUntilExpiry <= 7) {
      return <Badge variant="secondary">Expires in {daysUntilExpiry} days</Badge>
    } else {
      return <Badge variant="outline">Valid for {daysUntilExpiry} days</Badge>
    }
  }

  const getTypeIcon = (type: 'company' | 'user') => {
    return type === 'company' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />
  }

  const getTypeBadge = (type: 'company' | 'user') => {
    return (
      <Badge variant={type === 'company' ? 'default' : 'secondary'}>
        {type === 'company' ? 'Company' : 'User'}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading backup data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Archive className="w-6 h-6" />
            Backup Recovery
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and recover deleted companies and users (30-day retention)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCleanupDialog(true)}
            disabled={cleaningUp}
          >
            {cleaningUp ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Cleanup Expired
          </Button>
          <Button onClick={loadBackups}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBackups}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.companyBackups}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.userBackups}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recoverable</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.recoverableBackups}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.expiredBackups}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backups List */}
      <Card>
        <CardHeader>
          <CardTitle>Backup Items</CardTitle>
          <CardDescription>
            Deleted companies and users available for recovery
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8">
              <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No backup items found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(backup.type)}
                      {getTypeBadge(backup.type)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {backup.type === 'company' 
                          ? backup.data.companyName || 'Unknown Company'
                          : backup.data.email || 'Unknown User'
                        }
                      </p>
                      <p className="text-sm text-gray-500">
                        Deleted: {formatDate(backup.deletedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getExpiryBadge(backup.expiresAt)}
                    {backup.canRecover && getDaysUntilExpiry(backup.expiresAt) >= 0 ? (
                      <Button
                        size="sm"
                        onClick={() => handleRecoverBackup(backup)}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Recover
                      </Button>
                    ) : (
                      <Badge variant="destructive">Cannot Recover</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recovery Confirmation Dialog */}
      <Dialog open={showRecoverDialog} onOpenChange={setShowRecoverDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Recovery</DialogTitle>
            <DialogDescription>
              Are you sure you want to recover this {backupToRecover?.type}? 
              This will restore it to the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRecoverDialog(false)}
              disabled={recovering}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRecoverBackup}
              disabled={recovering}
            >
              {recovering ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              Recover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cleanup Confirmation Dialog */}
      <Dialog open={showCleanupDialog} onOpenChange={setShowCleanupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cleanup Expired Backups</DialogTitle>
            <DialogDescription>
              This will permanently delete all expired backup items. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCleanupDialog(false)}
              disabled={cleaningUp}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCleanupExpired}
              disabled={cleaningUp}
            >
              {cleaningUp ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Cleanup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 