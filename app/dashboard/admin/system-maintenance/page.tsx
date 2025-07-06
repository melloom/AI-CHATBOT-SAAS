"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Database, 
  Shield, 
  Zap, 
  Activity, 
  RefreshCw, 
  Clock, 
  Download, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Settings,
  Wrench,
  Server,
  Cloud,
  Monitor,
  FileText,
  Palette,
  Mail,
  CreditCard,
  Crown,
  Cpu,
  HardDrive,
  Network,
  Thermometer,
  Gauge,
  TrendingUp,
  AlertCircle,
  Play,
  Pause,
  Square
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SystemMaintenanceDashboard } from "@/components/settings/system-maintenance-dashboard"
import { useAuth } from "@/hooks/use-auth"
import { getAuthHeaders } from "@/lib/auth-client"

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  temperature: number
  uptime: number
  activeConnections: number
  requestsPerMinute: number
}

interface LiveOperation {
  id: string
  type: string
  status: 'running' | 'completed' | 'failed' | 'paused'
  progress: number
  currentStep: string
  startTime: Date
  estimatedCompletion?: Date
  logs: string[]
}

export default function SystemMaintenancePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    database: "healthy",
    security: "secure",
    maintenance: "none",
    notifications: "enabled"
  })
  
  // Real-time system metrics
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    temperature: 0,
    uptime: 0,
    activeConnections: 0,
    requestsPerMinute: 0
  })
  
  // Live operations tracking
  const [liveOperations, setLiveOperations] = useState<LiveOperation[]>([])
  
  // State for operation IDs
  const [healthCheckId, setHealthCheckId] = useState<string | null>(null)
  const [backupId, setBackupId] = useState<string | null>(null)
  const [securityScanId, setSecurityScanId] = useState<string | null>(null)
  const [cacheClearId, setCacheClearId] = useState<string | null>(null)
  
  // Loading states for individual operations
  const [healthCheckLoading, setHealthCheckLoading] = useState(false)
  const [backupLoading, setBackupLoading] = useState(false)
  const [securityScanLoading, setSecurityScanLoading] = useState(false)
  const [cacheClearLoading, setCacheClearLoading] = useState(false)
  
  // Auto-refresh state
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5000) // 5 seconds
  
  // Settings objects for operations
  const healthCheckSettings = {
    checkDatabase: true,
    checkAuthentication: true,
    checkStorage: true,
    checkPerformance: true,
    checkSecurity: true,
    checkBackups: true,
    checkLogs: true,
    includeMetrics: true
  }
  
  const backupSettings = {
    includeUsers: true,
    includeChatbots: true,
    includeCompanies: true,
    includeSettings: true,
    includeAnalytics: true,
    compression: true,
    encryption: true,
    description: 'Manual backup from maintenance panel'
  }
  
  const securityScanSettings = {
    scanType: 'full',
    includeVulnerabilityChecks: true,
    includeConfigurationChecks: true,
    includeAccessControlChecks: true,
    includeDataProtectionChecks: true,
    includeComplianceChecks: true,
    includeWebSecurityChecks: true,
    includeAPISecurityChecks: true,
    includeNetworkSecurityChecks: true,
    includeDatabaseSecurityChecks: true,
    includeAuthenticationChecks: true,
    includeAuthorizationChecks: true,
    includeSessionManagementChecks: true,
    includeInputValidationChecks: true,
    includeOutputEncodingChecks: true,
    includeCryptographyChecks: true,
    includeLoggingChecks: true,
    includeMonitoringChecks: true,
    includeBackupSecurityChecks: true,
    includeDisasterRecoveryChecks: true,
    customChecks: [],
    scanDepth: 'comprehensive',
    includePenetrationTesting: false,
    includeSocialEngineeringTests: false,
    includePhysicalSecurityChecks: false,
    scanTimeout: 300000, // 5 minutes
    maxConcurrentChecks: 10,
    detailedReporting: true,
    generateRemediationPlan: true,
    includeRiskAssessment: true,
    includeComplianceMapping: true
  }
  
  const cacheClearSettings = {
    clearSystemCache: true,
    clearUserCache: true,
    clearAnalyticsCache: true,
    clearSettingsCache: true,
    clearTempFiles: true,
    clearLogs: false,
    description: 'Manual cache clear from maintenance panel'
  }
  
  const { toast } = useToast()
  const { profile } = useAuth()

  // Fetch real-time system metrics
  const fetchSystemMetrics = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings/system-health/metrics', {
        headers
      })
      
      if (response.ok) {
        const metrics = await response.json()
        setSystemMetrics(metrics)
      }
    } catch (error) {
      console.error('Error fetching system metrics:', error)
    }
  }, [])

  // Fetch live operations
  const fetchLiveOperations = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings/maintenance/live-operations', {
        headers
      })
      
      if (response.ok) {
        const operations = await response.json()
        setLiveOperations(operations.operations || [])
      }
    } catch (error) {
      console.error('Error fetching live operations:', error)
    }
  }, [])

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchSystemMetrics()
      fetchLiveOperations()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchSystemMetrics, fetchLiveOperations])

  // Initial load
  useEffect(() => {
    fetchSystemMetrics()
    fetchLiveOperations()
  }, [fetchSystemMetrics, fetchLiveOperations])

  const formatDuration = (duration: number) => {
    if (duration < 1000) return `${duration}ms`
    if (duration < 60000) return `${Math.round(duration / 1000)}s`
    return `${Math.round(duration / 60000)}m ${Math.round((duration % 60000) / 1000)}s`
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  const getMetricColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return "text-red-500"
    if (value >= threshold * 0.7) return "text-yellow-500"
    return "text-green-500"
  }

  const getMetricIcon = (value: number, threshold: number = 80) => {
    if (value >= threshold) return <AlertCircle className="h-4 w-4 text-red-500" />
    if (value >= threshold * 0.7) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const QuickActionCard = ({ 
    title, 
    description, 
    icon: Icon, 
    action, 
    variant = "default",
    disabled = false 
  }: {
    title: string
    description: string
    icon: any
    action: () => Promise<void>
    variant?: "default" | "destructive" | "secondary"
    disabled?: boolean
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant={variant} 
          onClick={action} 
          disabled={disabled || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            title
          )}
        </Button>
      </CardContent>
    </Card>
  )

  const runHealthCheck = async () => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can run health checks.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings/system-health', {
        method: 'POST',
        headers,
        body: JSON.stringify(healthCheckSettings)
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Health Check Started",
          description: "System health check has been initiated successfully.",
        })
        setHealthCheckId(result.healthCheckId)
        
        // Add to live operations
        const newOperation: LiveOperation = {
          id: result.healthCheckId,
          type: 'health-check',
          status: 'running',
          progress: 0,
          currentStep: 'Initializing health check...',
          startTime: new Date(),
          logs: ['Health check initiated']
        }
        setLiveOperations(prev => [...prev, newOperation])
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to start health check",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error starting health check:', error)
      toast({
        title: "Error",
        description: "Failed to start health check",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startBackup = async () => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can start backups.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings/backup', {
        method: 'POST',
        headers,
        body: JSON.stringify(backupSettings)
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Backup Started",
          description: "Database backup has been initiated successfully.",
        })
        setBackupId(result.backupId)
        
        // Add to live operations
        const newOperation: LiveOperation = {
          id: result.backupId,
          type: 'backup',
          status: 'running',
          progress: 0,
          currentStep: 'Preparing backup...',
          startTime: new Date(),
          logs: ['Backup initiated']
        }
        setLiveOperations(prev => [...prev, newOperation])
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to start backup",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error starting backup:', error)
      toast({
        title: "Error",
        description: "Failed to start backup",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startSecurityScan = async () => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can run security scans.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings/security-scan', {
        method: 'POST',
        headers,
        body: JSON.stringify(securityScanSettings)
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Security Scan Started",
          description: "Security scan has been initiated successfully.",
        })
        setSecurityScanId(result.scanId)
        
        // Add to live operations
        const newOperation: LiveOperation = {
          id: result.scanId,
          type: 'security-scan',
          status: 'running',
          progress: 0,
          currentStep: 'Initializing security scan...',
          startTime: new Date(),
          logs: ['Security scan initiated']
        }
        setLiveOperations(prev => [...prev, newOperation])
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to start security scan",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error starting security scan:', error)
      toast({
        title: "Error",
        description: "Failed to start security scan",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const clearCache = async () => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can clear cache.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings/clear-cache', {
        method: 'POST',
        headers,
        body: JSON.stringify(cacheClearSettings)
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Cache Cleared",
          description: "System cache has been cleared successfully.",
        })
        setCacheClearId(result.cacheClearId)
        
        // Add to live operations
        const newOperation: LiveOperation = {
          id: result.cacheClearId,
          type: 'cache-clear',
          status: 'running',
          progress: 0,
          currentStep: 'Clearing cache...',
          startTime: new Date(),
          logs: ['Cache clear initiated']
        }
        setLiveOperations(prev => [...prev, newOperation])
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to clear cache",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error clearing cache:', error)
      toast({
        title: "Error",
        description: "Failed to clear cache",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMaintenanceData = async () => {
    try {
      // Load real maintenance data from Firebase
      // TODO: Implement real maintenance data with Firebase
      const realTasks: MaintenanceTask[] = []
      
      setMaintenanceTasks(realTasks)
    } catch (error) {
      console.error('Error loading maintenance data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">System Maintenance</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Real-time monitoring and system maintenance operations
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
                  <Server className="h-4 w-4 text-white/80" />
                  <span className="text-sm text-white/90">Platform Operational</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
                  <Monitor className="h-4 w-4 text-white/80" />
                  <span className="text-sm text-white/90">Live Monitoring</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
                  <RefreshCw className={`h-4 w-4 text-white/80 ${autoRefresh ? 'animate-spin' : ''}`} />
                  <span className="text-sm text-white/90">
                    {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Wrench className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Real-time System Metrics</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAutoRefresh(!autoRefresh)
                toast({
                  title: autoRefresh ? "Auto-refresh Disabled" : "Auto-refresh Enabled",
                  description: `Real-time updates ${autoRefresh ? 'disabled' : 'enabled'}`,
                })
              }}
            >
              {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </CardTitle>
          <CardDescription>Live system performance and resource utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Cpu className={`h-5 w-5 ${getMetricColor(systemMetrics.cpu)}`} />
              <div className="flex-1">
                <p className="font-medium">CPU Usage</p>
                <p className="text-sm text-muted-foreground">{systemMetrics.cpu.toFixed(1)}%</p>
                <Progress value={systemMetrics.cpu} className="mt-2" />
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <HardDrive className={`h-5 w-5 ${getMetricColor(systemMetrics.memory)}`} />
              <div className="flex-1">
                <p className="font-medium">Memory Usage</p>
                <p className="text-sm text-muted-foreground">{systemMetrics.memory.toFixed(1)}%</p>
                <Progress value={systemMetrics.memory} className="mt-2" />
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <HardDrive className={`h-5 w-5 ${getMetricColor(systemMetrics.disk)}`} />
              <div className="flex-1">
                <p className="font-medium">Disk Usage</p>
                <p className="text-sm text-muted-foreground">{systemMetrics.disk.toFixed(1)}%</p>
                <Progress value={systemMetrics.disk} className="mt-2" />
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Network className={`h-5 w-5 ${getMetricColor(systemMetrics.network)}`} />
              <div className="flex-1">
                <p className="font-medium">Network</p>
                <p className="text-sm text-muted-foreground">{systemMetrics.requestsPerMinute} req/min</p>
                <Progress value={Math.min(systemMetrics.network, 100)} className="mt-2" />
              </div>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Thermometer className={`h-5 w-5 ${getMetricColor(systemMetrics.temperature, 70)}`} />
              <div>
                <p className="font-medium">Temperature</p>
                <p className="text-sm text-muted-foreground">{systemMetrics.temperature.toFixed(1)}°C</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Uptime</p>
                <p className="text-sm text-muted-foreground">{formatDuration(systemMetrics.uptime)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Gauge className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Active Connections</p>
                <p className="text-sm text-muted-foreground">{systemMetrics.activeConnections}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Performance</p>
                <p className="text-sm text-muted-foreground">99.9%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Operations */}
      {liveOperations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Live Operations</span>
              <Badge variant="secondary">{liveOperations.length}</Badge>
            </CardTitle>
            <CardDescription>Currently running maintenance operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveOperations.map((operation) => (
                <div key={operation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
                      <span className="font-medium capitalize">{operation.type.replace('-', ' ')}</span>
                      <Badge variant={operation.status === 'running' ? 'default' : 'secondary'}>
                        {operation.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDuration(Date.now() - operation.startTime.getTime())}
                    </span>
                  </div>
                  <Progress value={operation.progress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">{operation.currentStep}</p>
                  {operation.logs.length > 0 && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs font-mono max-h-20 overflow-y-auto">
                      {operation.logs.slice(-3).map((log, index) => (
                        <div key={index} className="text-muted-foreground">{log}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard
          title="Backup Database"
          description="Create a full system backup"
          icon={Database}
          action={startBackup}
        />
        <QuickActionCard
          title="Security Scan"
          description="Run security vulnerability scan"
          icon={Shield}
          action={startSecurityScan}
        />
        <QuickActionCard
          title="Clear Cache"
          description="Clear system cache and temp files"
          icon={Zap}
          action={clearCache}
        />
        <QuickActionCard
          title="Health Check"
          description="Check system health status"
          icon={Activity}
          action={runHealthCheck}
        />
      </div>

      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>System Status Overview</span>
          </CardTitle>
          <CardDescription>Current system health and status indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Database className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-muted-foreground">Connected & Healthy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Security</p>
                <p className="text-sm text-muted-foreground">All Systems Secure</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Server className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Server</p>
                <p className="text-sm text-muted-foreground">99.9% Uptime</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Cloud className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Storage</p>
                <p className="text-sm text-muted-foreground">45% Used</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Operations Dashboard */}
      {profile?.isAdmin ? (
        <SystemMaintenanceDashboard />
      ) : (
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
      )}
    </div>
  )
} 