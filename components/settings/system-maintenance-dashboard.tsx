"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getAuthHeaders } from "@/lib/auth-client"
import { registerBackgroundRefresh, unregisterBackgroundRefresh } from "@/lib/background-refresh"
import { 
  Trash2, 
  Eye, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Database,
  Shield,
  Zap,
  Activity,
  FileText,
  BarChart3,
  Settings,
  Loader2
} from "lucide-react"

interface MaintenanceOperation {
  id: string
  createdAt: string
  createdBy: string
  createdByEmail: string
  status: 'completed' | 'in_progress' | 'failed'
  progress: number
  description: string
  duration?: number
  completedAt?: string
  error?: string
}

interface SecurityScanOperation extends MaintenanceOperation {
  vulnerabilities?: any[]
  recommendations?: any[]
  riskScore?: number
  totalChecks?: number
  passedChecks?: number
  failedChecks?: number
  currentCheck?: string
  report?: any
}

interface BackupOperation extends MaintenanceOperation {
  totalRecords?: number
  backupSize?: number
  collections?: string[]
  currentCollection?: string
}

interface CacheClearOperation extends MaintenanceOperation {
  clearedItems?: string[]
  totalItems?: number
  clearedSize?: number
  currentItem?: string
}

interface HealthCheckOperation extends MaintenanceOperation {
  checks?: any[]
  metrics?: any
  overallHealth?: string
  issues?: any[]
  warnings?: any[]
  currentCheck?: string
}

export function SystemMaintenanceDashboard() {
  const [operations, setOperations] = useState({
    backups: [] as BackupOperation[],
    securityScans: [] as SecurityScanOperation[],
    cacheClears: [] as CacheClearOperation[],
    healthChecks: [] as HealthCheckOperation[]
  })
  const [loading, setLoading] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const { toast } = useToast()
  const { profile } = useAuth()

  const fetchOperations = useCallback(async () => {
    if (!profile?.isAdmin) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      
      const [backupsRes, securityScansRes, cacheClearsRes, healthChecksRes] = await Promise.all([
        fetch('/api/settings/backup', { headers }),
        fetch('/api/settings/security-scan', { headers }),
        fetch('/api/settings/clear-cache', { headers }),
        fetch('/api/settings/system-health', { headers })
      ])

      const backups = backupsRes.ok ? await backupsRes.json() : { backups: [] }
      const securityScans = securityScansRes.ok ? await securityScansRes.json() : { scans: [] }
      const cacheClears = cacheClearsRes.ok ? await cacheClearsRes.json() : { cacheClears: [] }
      const healthChecks = healthChecksRes.ok ? await healthChecksRes.json() : { healthChecks: [] }

      const newOperations = {
        backups: backups.backups || [],
        securityScans: securityScans.scans || [],
        cacheClears: cacheClears.cacheClears || [],
        healthChecks: healthChecks.healthChecks || []
      }

      // Check for newly completed operations
      const previousOperations = operations
      const newlyCompleted = newOperations.securityScans.filter((op: SecurityScanOperation) => 
        op.status === 'completed' && 
        !previousOperations.securityScans.some((prev: SecurityScanOperation) => 
          prev.id === op.id && prev.status === 'in_progress'
        )
      )

      if (newlyCompleted.length > 0) {
        toast({
          title: "Operations Completed",
          description: `${newlyCompleted.length} operation(s) have completed`,
        })
      }
      setOperations(newOperations)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching operations:', error)
      toast({
        title: "Error",
        description: "Failed to fetch operations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [profile?.isAdmin, toast])

  const deleteOperation = async (type: string, id: string) => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can delete operations.",
        variant: "destructive",
      })
      return
    }

    setDeleting(id)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`/api/settings/${type}?id=${id}`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `${type} deleted successfully`,
        })
        
        // Close dialog if the deleted operation is currently being viewed
        if (selectedOperation && selectedOperation.id === id) {
          setShowDetails(false)
          setSelectedOperation(null)
        }
        
        fetchOperations()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || `Failed to delete ${type}`,
          variant: "destructive",
        })
      }
    } catch (error) {
              console.error('Error deleting item:', { type, error })
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  const viewOperationDetails = async (type: string, id: string) => {
    if (!profile?.isAdmin) return

    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`/api/settings/${type}?id=${id}`, { headers })

      if (response.ok) {
        const operation = await response.json()
        console.log('Operation details received:', operation) // Debug log
        
        // Ensure we have the required fields with fallbacks
        const operationWithDefaults = {
          id: operation.id || id,
          status: operation.status || 'unknown',
          createdAt: operation.createdAt || new Date().toISOString(),
          createdByEmail: operation.createdByEmail || operation.createdBy || 'System',
          duration: operation.duration || 0,
          completedAt: operation.completedAt,
          description: operation.description || `${type} operation`,
          progress: operation.progress || 0,
          error: operation.error,
          type,
          ...operation // Spread the rest of the operation data
        }
        
        setSelectedOperation(operationWithDefaults)
        setShowDetails(true)
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        toast({
          title: "Error",
          description: `Failed to fetch ${type} details: ${errorData.error || 'Unknown error'}`,
          variant: "destructive",
        })
      }
    } catch (error) {
              console.error('Error fetching details:', { type, error })
      toast({
        title: "Error",
        description: `Failed to fetch ${type} details`,
        variant: "destructive",
      })
    }
  }

  const downloadReport = (operation: any) => {
    // Check if operation is completed
    if (operation.status === 'in_progress') {
      toast({
        title: "Download Not Available",
        description: "Report is not available while the scan is in progress. Please wait for completion.",
        variant: "destructive",
      })
      return
    }

    if (operation.status === 'failed') {
      toast({
        title: "Download Not Available",
        description: "Report is not available for failed operations.",
        variant: "destructive",
      })
      return
    }

    // Determine the operation type
    let operationType = operation.type
    if (!operationType) {
      // Try to infer type from operation properties
      if (operation.vulnerabilities !== undefined) {
        operationType = 'security-scan'
      } else if (operation.backupSize !== undefined) {
        operationType = 'backup'
      } else if (operation.clearedItems !== undefined) {
        operationType = 'cache-clear'
      } else if (operation.checks !== undefined) {
        operationType = 'health-check'
      } else {
        operationType = 'unknown'
      }
    }

    const report = {
      operation: {
        id: operation.id,
        type: operationType,
        createdAt: operation.createdAt,
        status: operation.status,
        duration: operation.duration
      },
      details: operation
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${operationType}_${operation.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download Complete",
      description: "Report downloaded successfully",
    })
  }

  useEffect(() => {
    if (!profile?.isAdmin) {
      setLoading(false)
      return
    }
    
    fetchOperations()
    
    // Set up background refresh every 30 seconds
    registerBackgroundRefresh('system-maintenance', fetchOperations, 30000)
    
    return () => {
      unregisterBackgroundRefresh('system-maintenance')
    }
  }, [profile?.isAdmin, fetchOperations])

  const getStatusBadge = (status: string, vulnerabilities?: any[]) => {
    switch (status) {
      case 'completed':
        if (vulnerabilities && vulnerabilities.length > 0) {
          return <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">Completed with Issues</Badge>
        }
        return <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Completed</Badge>
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">In Progress</Badge>
      case 'failed':
        return <Badge variant="secondary" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">Failed</Badge>
      case 'unknown':
      default:
        return <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string, vulnerabilities?: any[]) => {
    switch (status) {
      case 'completed':
        if (vulnerabilities && vulnerabilities.length > 0) {
          return <AlertTriangle className="h-4 w-4 text-yellow-500" />
        }
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDuration = (duration: number) => {
    if (!duration) return 'N/A'
    const seconds = Math.floor(duration / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const formatSize = (bytes: number) => {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const OperationCard = ({ 
    operation, 
    type, 
    icon: Icon, 
    title, 
    color 
  }: { 
    operation: any, 
    type: string, 
    icon: any, 
    title: string, 
    color: string 
  }) => (
    <Card className={`hover:shadow-md transition-shadow ${operation.status === 'in_progress' ? 'ring-2 ring-blue-200 bg-blue-50/50' : ''}`}>
      <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className={`h-5 w-5 ${color}`} />
              <CardTitle className="text-lg">{title}</CardTitle>

            </div>
            {getStatusBadge(operation.status, operation.vulnerabilities)}
          </div>
        <CardDescription>
          {operation.description || `${title} operation`}

          {operation.status === 'completed' && type === 'security-scan' && operation.vulnerabilities && (
            <div className="mt-1 text-xs">
              {operation.vulnerabilities.length > 0 ? (
                <span className="text-yellow-600">
                  ⚠️ Found {operation.vulnerabilities.length} security issue{operation.vulnerabilities.length !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-green-600">
                  ✅ No security issues found
                </span>
              )}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created:</span>
            <span>{new Date(operation.createdAt).toLocaleString()}</span>
          </div>
          
          {operation.duration && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span>{formatDuration(operation.duration)}</span>
            </div>
          )}

          {operation.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium">{operation.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${operation.progress || 0}%` }}
                />
              </div>

              {operation.totalChecks && (
                <div className="text-xs text-muted-foreground">
                  {operation.passedChecks || 0} passed, {operation.failedChecks || 0} failed of {operation.totalChecks} total checks
                </div>
              )}
            </div>
          )}

          {type === 'security-scan' && operation.riskScore !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Risk Score:</span>
              <Badge variant={operation.riskScore > 80 ? "secondary" : operation.riskScore > 50 ? "default" : "destructive"}>
                {operation.riskScore}/100
              </Badge>
            </div>
          )}

          {type === 'security-scan' && operation.status === 'failed' && operation.error && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Error:</span>
              <div className="text-red-600 text-xs max-w-xs truncate" title={operation.error}>
                {operation.error}
              </div>
            </div>
          )}

          {type === 'security-scan' && operation.status === 'completed' && operation.vulnerabilities && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Problems Found:</span>
              <div className="flex items-center space-x-1">
                {operation.vulnerabilities.filter((v: any) => v.severity === 'high').length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {operation.vulnerabilities.filter((v: any) => v.severity === 'high').length} Critical
                  </Badge>
                )}
                {operation.vulnerabilities.filter((v: any) => v.severity === 'medium').length > 0 && (
                  <Badge variant="default" className="text-xs">
                    {operation.vulnerabilities.filter((v: any) => v.severity === 'medium').length} Important
                  </Badge>
                )}
                {operation.vulnerabilities.filter((v: any) => v.severity === 'low').length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {operation.vulnerabilities.filter((v: any) => v.severity === 'low').length} Minor
                  </Badge>
                )}
                {operation.vulnerabilities.length === 0 && (
                  <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    No Issues
                  </Badge>
                )}
              </div>
            </div>
          )}

          {type === 'backup' && operation.backupSize && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Size:</span>
              <span>{formatSize(operation.backupSize)}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => viewOperationDetails(type, operation.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => downloadReport(operation)}
              disabled={operation.status === 'in_progress'}
              title={operation.status === 'in_progress' ? 'Report not available while scan is in progress' : 'Download report'}
              className={operation.status === 'in_progress' ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteOperation(type, operation.id)}
              disabled={deleting === operation.id}
            >
              {deleting === operation.id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (!profile?.isAdmin) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Access Denied</span>
            </CardTitle>
            <CardDescription>Only administrators can access system maintenance features.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground">Only administrators can access system maintenance features.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Maintenance Operations</h2>
          <p className="text-muted-foreground">
            Monitor and manage system maintenance operations

            <span className="ml-2 text-xs text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-2">

          <Button onClick={fetchOperations} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Security Scans</p>
                <p className="text-2xl font-bold">{operations.securityScans.length}</p>

              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Backups</p>
                <p className="text-2xl font-bold">{operations.backups.length}</p>

              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Cache Clears</p>
                <p className="text-2xl font-bold">{operations.cacheClears.length}</p>

              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Health Checks</p>
                <p className="text-2xl font-bold">{operations.healthChecks.length}</p>

              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Security Scans */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Security Scans</h3>
            <Badge variant="secondary">{operations.securityScans.length}</Badge>
          </div>
          <div className="space-y-3">
            {operations.securityScans.map((scan) => (
              <OperationCard
                key={scan.id}
                operation={scan}
                type="security-scan"
                icon={Shield}
                title="Security Scan"
                color="text-blue-500"
              />
            ))}
            {operations.securityScans.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No security scans found
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Backups */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Backups</h3>
            <Badge variant="secondary">{operations.backups.length}</Badge>
          </div>
          <div className="space-y-3">
            {operations.backups.map((backup) => (
              <OperationCard
                key={backup.id}
                operation={backup}
                type="backup"
                icon={Database}
                title="Backup"
                color="text-green-500"
              />
            ))}
            {operations.backups.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No backups found
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Cache Clears */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Cache Clears</h3>
            <Badge variant="secondary">{operations.cacheClears.length}</Badge>
          </div>
          <div className="space-y-3">
            {operations.cacheClears.map((cacheClear) => (
              <OperationCard
                key={cacheClear.id}
                operation={cacheClear}
                type="clear-cache"
                icon={Zap}
                title="Cache Clear"
                color="text-yellow-500"
              />
            ))}
            {operations.cacheClears.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No cache clears found
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Health Checks */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Health Checks</h3>
            <Badge variant="secondary">{operations.healthChecks.length}</Badge>
          </div>
          <div className="space-y-3">
            {operations.healthChecks.map((healthCheck) => (
              <OperationCard
                key={healthCheck.id}
                operation={healthCheck}
                type="system-health"
                icon={Activity}
                title="Health Check"
                color="text-purple-500"
              />
            ))}
            {operations.healthChecks.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No health checks found
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Operation Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedOperation?.type === 'security-scan' && <Shield className="h-5 w-5 text-blue-500" />}
              {selectedOperation?.type === 'backup' && <Database className="h-5 w-5 text-green-500" />}
              {selectedOperation?.type === 'clear-cache' && <Zap className="h-5 w-5 text-yellow-500" />}
              {selectedOperation?.type === 'system-health' && <Activity className="h-5 w-5 text-purple-500" />}
              <span>Operation Details</span>
            </DialogTitle>
            <DialogDescription>
              Detailed information about the selected operation
            </DialogDescription>
          </DialogHeader>
          
          {selectedOperation ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">ID:</span>
                      <span className="ml-2 font-mono">{selectedOperation.id || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <span className="ml-2">{getStatusBadge(selectedOperation.status || 'unknown')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>
                      <span className="ml-2">
                        {selectedOperation.createdAt ? 
                          new Date(selectedOperation.createdAt).toLocaleString() : 
                          'Invalid Date'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <span className="ml-2">
                        {selectedOperation.duration ? 
                          formatDuration(selectedOperation.duration) : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Created By:</span>
                      <span className="ml-2">
                        {selectedOperation.createdByEmail || selectedOperation.createdBy || 'System'}
                      </span>
                    </div>
                    {selectedOperation.completedAt && (
                      <div>
                        <span className="font-medium">Completed:</span>
                        <span className="ml-2">
                          {new Date(selectedOperation.completedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Security Scan Specific Details */}
              {selectedOperation.type === 'security-scan' && selectedOperation.report && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Risk Score:</span>
                          <span className="ml-2">{selectedOperation.riskScore}/100</span>
                        </div>
                        <div>
                          <span className="font-medium">Total Checks:</span>
                          <span className="ml-2">{selectedOperation.totalChecks}</span>
                        </div>
                        <div>
                          <span className="font-medium">Passed:</span>
                          <span className="ml-2 text-green-600">{selectedOperation.passedChecks}</span>
                        </div>
                        <div>
                          <span className="font-medium">Failed:</span>
                          <span className="ml-2 text-red-600">{selectedOperation.failedChecks}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Problems and Issues Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <span>Problems & Issues Found</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* High Severity Issues */}
                        {selectedOperation.vulnerabilities?.filter((v: any) => v.severity === 'high').length > 0 && (
                          <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950/20">
                            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                              🔴 High Severity Issues ({selectedOperation.vulnerabilities.filter((v: any) => v.severity === 'high').length})
                            </h4>
                            <div className="space-y-2">
                              {selectedOperation.vulnerabilities
                                .filter((v: any) => v.severity === 'high')
                                .map((vuln: any, index: number) => (
                                  <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-800">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="font-medium text-red-800 dark:text-red-200">{vuln.name}</h5>
                                      <Badge variant="destructive">Critical</Badge>
                                    </div>
                                    <p className="text-sm text-red-700 dark:text-red-300 mb-2">{vuln.description}</p>
                                    {vuln.recommendation && (
                                      <p className="text-sm dark:text-gray-200"><strong>Fix:</strong> {vuln.recommendation}</p>
                                    )}
                                    {vuln.details && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Details:</strong> {vuln.details}</p>
                                    )}
                                    {vuln.impact && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Impact:</strong> {vuln.impact}</p>
                                    )}
                                    {vuln.likelihood && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Likelihood:</strong> {vuln.likelihood}</p>
                                    )}
                                    {vuln.remediation && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Remediation:</strong> {vuln.remediation}</p>
                                    )}
                                    {vuln.implementation && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Implementation:</strong> {vuln.implementation}</p>
                                    )}
                                    {vuln.effort && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Effort:</strong> {vuln.effort}</p>
                                    )}
                                    {vuln.cost && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Cost:</strong> {vuln.cost}</p>
                                    )}
                                    {(vuln.cwe || vuln.cvss) && (
                                      <div className="flex items-center space-x-2 mt-2 text-xs">
                                        {vuln.cwe && <Badge variant="outline">{vuln.cwe}</Badge>}
                                        {vuln.cvss && <Badge variant="outline">CVSS: {vuln.cvss}</Badge>}
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Medium Severity Issues */}
                        {selectedOperation.vulnerabilities?.filter((v: any) => v.severity === 'medium').length > 0 && (
                          <div className="p-4 border border-yellow-200 dark:border-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                              🟡 Medium Severity Issues ({selectedOperation.vulnerabilities.filter((v: any) => v.severity === 'medium').length})
                            </h4>
                            <div className="space-y-2">
                              {selectedOperation.vulnerabilities
                                .filter((v: any) => v.severity === 'medium')
                                .map((vuln: any, index: number) => (
                                  <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded border border-yellow-200 dark:border-yellow-800">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="font-medium text-yellow-800 dark:text-yellow-200">{vuln.name}</h5>
                                      <Badge variant="default">Important</Badge>
                                    </div>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">{vuln.description}</p>
                                    {vuln.recommendation && (
                                      <p className="text-sm dark:text-gray-200"><strong>Fix:</strong> {vuln.recommendation}</p>
                                    )}
                                    {vuln.details && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Details:</strong> {vuln.details}</p>
                                    )}
                                    {vuln.impact && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Impact:</strong> {vuln.impact}</p>
                                    )}
                                    {vuln.likelihood && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Likelihood:</strong> {vuln.likelihood}</p>
                                    )}
                                    {vuln.remediation && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Remediation:</strong> {vuln.remediation}</p>
                                    )}
                                    {vuln.implementation && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Implementation:</strong> {vuln.implementation}</p>
                                    )}
                                    {vuln.effort && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Effort:</strong> {vuln.effort}</p>
                                    )}
                                    {vuln.cost && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Cost:</strong> {vuln.cost}</p>
                                    )}
                                    {(vuln.cwe || vuln.cvss) && (
                                      <div className="flex items-center space-x-2 mt-2 text-xs">
                                        {vuln.cwe && <Badge variant="outline">{vuln.cwe}</Badge>}
                                        {vuln.cvss && <Badge variant="outline">CVSS: {vuln.cvss}</Badge>}
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Low Severity Issues */}
                        {selectedOperation.vulnerabilities?.filter((v: any) => v.severity === 'low').length > 0 && (
                          <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                              🔵 Low Severity Issues ({selectedOperation.vulnerabilities.filter((v: any) => v.severity === 'low').length})
                            </h4>
                            <div className="space-y-2">
                              {selectedOperation.vulnerabilities
                                .filter((v: any) => v.severity === 'low')
                                .map((vuln: any, index: number) => (
                                  <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="font-medium text-blue-800 dark:text-blue-200">{vuln.name}</h5>
                                      <Badge variant="secondary">Minor</Badge>
                                    </div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">{vuln.description}</p>
                                    {vuln.recommendation && (
                                      <p className="text-sm dark:text-gray-200"><strong>Fix:</strong> {vuln.recommendation}</p>
                                    )}
                                    {vuln.details && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Details:</strong> {vuln.details}</p>
                                    )}
                                    {vuln.impact && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Impact:</strong> {vuln.impact}</p>
                                    )}
                                    {vuln.likelihood && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Likelihood:</strong> {vuln.likelihood}</p>
                                    )}
                                    {vuln.remediation && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Remediation:</strong> {vuln.remediation}</p>
                                    )}
                                    {vuln.implementation && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Implementation:</strong> {vuln.implementation}</p>
                                    )}
                                    {vuln.effort && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Effort:</strong> {vuln.effort}</p>
                                    )}
                                    {vuln.cost && (
                                      <p className="text-sm mt-1 dark:text-gray-200"><strong>Cost:</strong> {vuln.cost}</p>
                                    )}
                                    {(vuln.cwe || vuln.cvss) && (
                                      <div className="flex items-center space-x-2 mt-2 text-xs">
                                        {vuln.cwe && <Badge variant="outline">{vuln.cwe}</Badge>}
                                        {vuln.cvss && <Badge variant="outline">CVSS: {vuln.cvss}</Badge>}
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* No Issues Found */}
                        {(!selectedOperation.vulnerabilities || selectedOperation.vulnerabilities.length === 0) && (
                          <div className="p-4 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-950/20">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                              <h4 className="font-semibold text-green-800 dark:text-green-200">No Security Issues Found</h4>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                              Great! No security vulnerabilities were detected in this scan.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  {selectedOperation.recommendations && selectedOperation.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Settings className="h-5 w-5 text-blue-500" />
                          <span>Recommendations</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedOperation.recommendations?.map((rec: any, index: number) => (
                            <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium dark:text-gray-100">{rec.title}</h5>
                                <Badge variant={rec.priority === 'high' ? 'destructive' : 'default'}>
                                  {rec.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                                </Badge>
                              </div>
                              <p className="text-sm mb-2 dark:text-gray-200">{rec.description}</p>
                              {rec.category && (
                                <p className="text-sm dark:text-gray-200"><strong>Category:</strong> {rec.category}</p>
                              )}
                              {rec.implementation && (
                                <p className="text-sm mt-1 dark:text-gray-200"><strong>Implementation:</strong> {rec.implementation}</p>
                              )}
                              {rec.effort && (
                                <p className="text-sm mt-1 dark:text-gray-200"><strong>Effort:</strong> {rec.effort}</p>
                              )}
                              {rec.cost && (
                                <p className="text-sm mt-1 dark:text-gray-200"><strong>Cost:</strong> {rec.cost}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Compliance Impact */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Compliance Impact</CardTitle>
                      <CardDescription>Regulatory compliance status and requirements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedOperation.report?.compliance ? (
                        <div className="space-y-3">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
                            <h5 className="font-medium mb-2 dark:text-gray-100">Compliance Overview</h5>
                            {selectedOperation.report.compliance.overallCompliance && (
                              <p className="text-sm mb-2 dark:text-gray-200">
                                <strong>Overall Compliance:</strong> {selectedOperation.report.compliance.overallCompliance}
                              </p>
                            )}
                            {selectedOperation.report.compliance.complianceScore && (
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="text-lg font-bold dark:text-gray-100">
                                  {selectedOperation.report.compliance.complianceScore}%
                                </div>
                                <Badge variant={selectedOperation.report.compliance.complianceScore > 80 ? 'default' : 'destructive'}>
                                  {selectedOperation.report.compliance.complianceScore > 80 ? 'Compliant' : 'Non-Compliant'}
                                </Badge>
                              </div>
                            )}
                            {selectedOperation.report.compliance.regulatoryRequirements && (
                              <div className="mt-2">
                                <p className="text-sm font-medium dark:text-gray-100">Regulatory Requirements:</p>
                                <ul className="text-sm mt-1 space-y-1 dark:text-gray-200">
                                  {selectedOperation.report.compliance.regulatoryRequirements.map((req: string, index: number) => (
                                    <li key={index} className="ml-4">• {req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedOperation.report.compliance.complianceGaps && (
                              <div className="mt-2">
                                <p className="text-sm font-medium dark:text-gray-100">Compliance Gaps:</p>
                                <ul className="text-sm mt-1 space-y-1">
                                  {selectedOperation.report.compliance.complianceGaps.map((gap: string, index: number) => (
                                    <li key={index} className="ml-4 text-red-600 dark:text-red-400">• {gap}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedOperation.report.compliance.recommendations && (
                              <div className="mt-2">
                                <p className="text-sm font-medium dark:text-gray-100">Compliance Recommendations:</p>
                                <ul className="text-sm mt-1 space-y-1 dark:text-gray-200">
                                  {selectedOperation.report.compliance.recommendations.map((rec: string, index: number) => (
                                    <li key={index} className="ml-4">• {rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No compliance data available</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Risk Assessment */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Assessment</CardTitle>
                      <CardDescription>Overall security posture and risk analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedOperation.report?.riskAssessment ? (
                        <div className="space-y-3">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
                            <h5 className="font-medium mb-2 dark:text-gray-100">Overall Risk Score</h5>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="text-2xl font-bold dark:text-gray-100">
                                {selectedOperation.report.riskAssessment.riskScore || selectedOperation.riskScore || 0}/100
                              </div>
                              <Badge variant={selectedOperation.report.riskAssessment.riskScore > 70 ? 'default' : 'destructive'}>
                                {selectedOperation.report.riskAssessment.riskScore > 70 ? 'Good' : 'Needs Attention'}
                              </Badge>
                            </div>
                            {selectedOperation.report.riskAssessment.overallRisk && (
                              <p className="text-sm dark:text-gray-200"><strong>Risk Level:</strong> {selectedOperation.report.riskAssessment.overallRisk}</p>
                            )}
                            {selectedOperation.report.riskAssessment.riskFactors && (
                              <div className="mt-2">
                                <p className="text-sm font-medium dark:text-gray-100">Key Risk Factors:</p>
                                <ul className="text-sm mt-1 space-y-1 dark:text-gray-200">
                                  {selectedOperation.report.riskAssessment.riskFactors.map((factor: string, index: number) => (
                                    <li key={index} className="ml-4">• {factor}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedOperation.report.riskAssessment.mitigationStrategies && (
                              <div className="mt-2">
                                <p className="text-sm font-medium dark:text-gray-100">Mitigation Strategies:</p>
                                <ul className="text-sm mt-1 space-y-1 dark:text-gray-200">
                                  {selectedOperation.report.riskAssessment.mitigationStrategies.map((strategy: string, index: number) => (
                                    <li key={index} className="ml-4">• {strategy}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No risk assessment data available</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Remediation Plan */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Remediation Plan</CardTitle>
                      <CardDescription>Step-by-step fix timeline and priorities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedOperation.report?.remediationPlan ? (
                        <div className="space-y-3">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
                            <h5 className="font-medium mb-2 dark:text-gray-100">Remediation Overview</h5>
                            {selectedOperation.report.remediationPlan.overallTimeline && (
                              <p className="text-sm mb-2 dark:text-gray-200">
                                <strong>Timeline:</strong> {selectedOperation.report.remediationPlan.overallTimeline}
                              </p>
                            )}
                            {selectedOperation.report.remediationPlan.priorityOrder && (
                              <div className="mt-2">
                                <p className="text-sm font-medium dark:text-gray-100">Priority Order:</p>
                                <ol className="text-sm mt-1 space-y-1 dark:text-gray-200">
                                  {selectedOperation.report.remediationPlan.priorityOrder.map((item: string, index: number) => (
                                    <li key={index} className="ml-4">{(index + 1)}. {item}</li>
                                  ))}
                                </ol>
                              </div>
                            )}
                            {selectedOperation.report.remediationPlan.implementationSteps && (
                              <div className="mt-2">
                                <p className="text-sm font-medium dark:text-gray-100">Implementation Steps:</p>
                                <ul className="text-sm mt-1 space-y-1 dark:text-gray-200">
                                  {selectedOperation.report.remediationPlan.implementationSteps.map((step: string, index: number) => (
                                    <li key={index} className="ml-4">• {step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedOperation.report.remediationPlan.resourceRequirements && (
                              <div className="mt-2">
                                <p className="text-sm font-medium dark:text-gray-100">Resource Requirements:</p>
                                <ul className="text-sm mt-1 space-y-1 dark:text-gray-200">
                                  {selectedOperation.report.remediationPlan.resourceRequirements.map((resource: string, index: number) => (
                                    <li key={index} className="ml-4">• {resource}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedOperation.report.remediationPlan.estimatedCost && (
                              <p className="text-sm mt-2 dark:text-gray-200">
                                <strong>Estimated Cost:</strong> {selectedOperation.report.remediationPlan.estimatedCost}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No remediation plan available</p>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Backup Specific Details */}
              {selectedOperation.type === 'backup' && (
                <Card>
                                      <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-green-500" />
                        <span>Backup Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Basic Backup Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {selectedOperation.backupSize && (
                            <div>
                              <span className="font-medium">Total Size:</span>
                              <span className="ml-2">{formatSize(selectedOperation.backupSize)}</span>
                            </div>
                          )}
                          {selectedOperation.totalRecords && (
                            <div>
                              <span className="font-medium">Total Records:</span>
                              <span className="ml-2">{selectedOperation.totalRecords.toLocaleString()}</span>
                            </div>
                          )}
                          {selectedOperation.duration && (
                            <div>
                              <span className="font-medium">Backup Duration:</span>
                              <span className="ml-2">{formatDuration(selectedOperation.duration)}</span>
                            </div>
                          )}
                          {selectedOperation.collections && (
                            <div>
                              <span className="font-medium">Collections:</span>
                              <span className="ml-2">{selectedOperation.collections.length}</span>
                            </div>
                          )}
                        </div>

                        {/* Collections Details */}
                        {selectedOperation.collections && selectedOperation.collections.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Backed Up Collections:</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedOperation.collections.map((collection: string, index: number) => (
                                <Badge key={index} variant="outline" className="justify-start">
                                  <Database className="h-3 w-3 mr-1" />
                                  {collection}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Backup Performance */}
                        {selectedOperation.backupSize && selectedOperation.duration && (
                          <div>
                            <h5 className="font-medium mb-2">Backup Performance:</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Backup Speed:</span>
                                <span>{formatSize(selectedOperation.backupSize / (selectedOperation.duration / 1000))}/s</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Records per Second:</span>
                                <span>{selectedOperation.totalRecords ? Math.round(selectedOperation.totalRecords / (selectedOperation.duration / 1000)) : 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Cache Clear Specific Details */}
              {selectedOperation.type === 'clear-cache' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span>Cache Clear Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Basic Cache Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {selectedOperation.clearedSize && (
                          <div>
                            <span className="font-medium">Cleared Size:</span>
                            <span className="ml-2">{formatSize(selectedOperation.clearedSize)}</span>
                          </div>
                        )}
                        {selectedOperation.totalItems && (
                          <div>
                            <span className="font-medium">Total Items:</span>
                            <span className="ml-2">{selectedOperation.totalItems.toLocaleString()}</span>
                          </div>
                        )}
                        {selectedOperation.duration && (
                          <div>
                            <span className="font-medium">Clear Duration:</span>
                            <span className="ml-2">{formatDuration(selectedOperation.duration)}</span>
                          </div>
                        )}
                        {selectedOperation.clearedItems && (
                          <div>
                            <span className="font-medium">Cache Types:</span>
                            <span className="ml-2">{selectedOperation.clearedItems.length}</span>
                          </div>
                        )}
                      </div>

                      {/* Cleared Items Details */}
                      {selectedOperation.clearedItems && selectedOperation.clearedItems.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">Cleared Cache Types:</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedOperation.clearedItems.map((item: string, index: number) => (
                              <Badge key={index} variant="outline" className="justify-start">
                                <Zap className="h-3 w-3 mr-1" />
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cache Performance */}
                      {selectedOperation.clearedSize && selectedOperation.duration && (
                        <div>
                          <h5 className="font-medium mb-2">Clear Performance:</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Clear Speed:</span>
                              <span>{formatSize(selectedOperation.clearedSize / (selectedOperation.duration / 1000))}/s</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Items per Second:</span>
                              <span>{selectedOperation.totalItems ? Math.round(selectedOperation.totalItems / (selectedOperation.duration / 1000)) : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Health Check Specific Details */}
              {selectedOperation.type === 'system-health' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-purple-500" />
                      <span>Health Check Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">

                      {/* Basic Health Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {selectedOperation.overallHealth && (
                          <div>
                            <span className="font-medium">Overall Health:</span>
                            <Badge 
                              variant={selectedOperation.overallHealth === 'healthy' ? 'default' : 
                                      selectedOperation.overallHealth === 'warning' ? 'secondary' : 'destructive'}
                              className="ml-2"
                            >
                              {selectedOperation.overallHealth}
                            </Badge>
                          </div>
                        )}
                        {selectedOperation.checks && (
                          <div>
                            <span className="font-medium">Total Checks:</span>
                            <span className="ml-2">{selectedOperation.checks.length}</span>
                          </div>
                        )}
                        {selectedOperation.issues && (
                          <div>
                            <span className="font-medium">Issues Found:</span>
                            <span className="ml-2 text-red-600">{selectedOperation.issues.length}</span>
                          </div>
                        )}
                        {selectedOperation.warnings && (
                          <div>
                            <span className="font-medium">Warnings:</span>
                            <span className="ml-2 text-yellow-600">{selectedOperation.warnings.length}</span>
                          </div>
                        )}
                      </div>

                      {/* Individual Health Checks */}
                      {selectedOperation.checks && selectedOperation.checks.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">Individual Health Checks:</h5>
                          <div className="space-y-3">
                            {selectedOperation.checks.map((check: any, index: number) => (
                              <div key={index} className={`p-3 rounded border ${
                                check.status === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                                check.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                                'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                              }`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">{check.name}</span>
                                  <Badge 
                                    variant={check.status === 'error' ? 'destructive' : 
                                            check.status === 'warning' ? 'secondary' : 'default'}
                                    className="text-xs"
                                  >
                                    {check.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                                  {check.details}
                                </p>
                                {check.metrics && Object.keys(check.metrics).length > 0 && (
                                  <div className="mt-2 text-xs">
                                    <span className="font-medium">Metrics:</span>
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                      {Object.entries(check.metrics).map(([key, value]: [string, any]) => (
                                        <div key={key}>
                                          <span className="text-muted-foreground">{key}:</span>
                                          <span className="ml-1">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Health Metrics */}
                      {selectedOperation.metrics && (
                        <div>
                          <h5 className="font-medium mb-2">System Metrics:</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {Object.entries(selectedOperation.metrics).map(([key, value]: [string, any]) => (
                              <div key={key}>
                                <span className="font-medium">{key}:</span>
                                <span className="ml-2">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Health Issues */}
                      {selectedOperation.issues && selectedOperation.issues.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2 text-red-600 dark:text-red-400">Health Issues:</h5>
                          <div className="space-y-2">
                            {selectedOperation.issues.map((issue: any, index: number) => (
                              <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                                <div className="flex items-center space-x-2 mb-1">
                                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                  <span className="font-medium text-red-800 dark:text-red-200">
                                    {issue.check || issue.name || `Issue ${index + 1}`}
                                  </span>
                                </div>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                  {issue.message || issue.description || 'No description available'}
                                </p>
                                {issue.severity && (
                                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                    <strong>Severity:</strong> {issue.severity}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Health Warnings */}
                      {selectedOperation.warnings && selectedOperation.warnings.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2 text-yellow-600 dark:text-yellow-400">Health Warnings:</h5>
                          <div className="space-y-2">
                            {selectedOperation.warnings.map((warning: any, index: number) => (
                              <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                                <div className="flex items-center space-x-2 mb-1">
                                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                  <span className="font-medium text-yellow-800 dark:text-yellow-200">
                                    {warning.check || warning.name || `Warning ${index + 1}`}
                                  </span>
                                </div>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                  {warning.message || warning.description || 'No description available'}
                                </p>
                                {warning.severity && (
                                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                                    <strong>Severity:</strong> {warning.severity}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Information */}
              {selectedOperation.error && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Error Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{selectedOperation.error}</AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => downloadReport(selectedOperation)}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button
                  onClick={() => deleteOperation(selectedOperation.type, selectedOperation.id)}
                  variant="destructive"
                  disabled={deleting === selectedOperation.id}
                >
                  {deleting === selectedOperation.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Operation
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <p>No operation details available</p>
              <p className="text-sm mt-2">The operation data could not be loaded.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 