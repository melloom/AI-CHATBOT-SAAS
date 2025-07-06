"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Crown, 
  Settings, 
  Database, 
  Shield, 
  Globe, 
  AlertTriangle,
  Wrench,
  Users,
  Bell,
  Zap,
  Lock,
  Key,
  Server,
  Cloud,
  Monitor,
  FileText,
  Palette,
  Mail,
  CreditCard,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getAuthHeaders } from "@/lib/auth-client"
import { SystemSettingsForm } from "@/components/settings/system-settings-form"
import { SecuritySettingsForm } from "@/components/settings/security-settings-form"
import { MaintenanceSettingsForm } from "@/components/settings/maintenance-settings-form"
import { NotificationSettingsForm } from "@/components/settings/notification-settings-form"
import { DatabaseSettingsForm } from "@/components/settings/database-settings-form"
import { PlatformSettingsForm } from "@/components/settings/platform-settings-form"
import { SystemMaintenanceDashboard } from "@/components/settings/system-maintenance-dashboard"
import { PlatformConfigTest } from "@/components/settings/platform-config-test"
import { SystemPreferencesTest } from "@/components/settings/system-preferences-test"
import { FeatureTogglesTest } from "@/components/settings/feature-toggles-test"
import { LimitsQuotasTest } from "@/components/settings/limits-quotas-test"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [systemStatus, setSystemStatus] = useState({
    database: "healthy",
    security: "secure",
    maintenance: "none",
    notifications: "enabled"
  })

  const StatusBadge = ({ status, label }: { status: string; label: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "healthy":
        case "secure":
        case "enabled":
          return "bg-green-100 text-green-800 border-green-200"
        case "warning":
          return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "error":
        case "disabled":
          return "bg-red-100 text-red-800 border-red-200"
        case "maintenance":
          return "bg-orange-100 text-orange-800 border-orange-200"
        default:
          return "bg-gray-100 text-gray-800 border-gray-200"
      }
    }

    return (
      <Badge variant="outline" className={getStatusColor(status)}>
        {label}
      </Badge>
    )
  }

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { profile } = useAuth()
  const [settings, setSettings] = useState({
    platformName: "ChatHub AI",
    platformUrl: "https://chathub.ai",
    timezone: "UTC",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    maintenanceMode: false,
    debugMode: false,
    analyticsEnabled: true,
    userRegistration: true,
    emailNotifications: true,
    maxFileUploadSize: "10MB",
    sessionTimeout: "24h",
    maxUsersPerCompany: 100,
    maxChatbotsPerCompany: 10,
    maxCompanies: 1000,
    maxTeamsPerCompany: 10,
    maxStoragePerCompany: 100,
    maxFileSizePerUpload: 50,
    maxFilesPerUpload: 10,
    maxBackupRetention: 30,
    maxApiRequestsPerMinute: 1000,
    maxApiRequestsPerHour: 10000,
    maxConcurrentChats: 100,
    maxChatHistoryDays: 90,
    maxFreeUsers: 5,
    maxFreeChatbots: 2,
    maxProUsers: 50,
    maxProChatbots: 20,
    defaultCompanyPlan: "free",
    companyApprovalRequired: false,
    maxCompanyNameLength: 50,
    maxCompanyDescriptionLength: 500,
    defaultTheme: "light",
    customBranding: false,
    companyLogo: "",
    companyName: "",
    supportEmail: "support@chathub.ai",
    contactEmail: "contact@chathub.ai",
    termsOfService: "",
    privacyPolicy: "",
    systemAnnouncement: "",
    announcementEnabled: false,
    announcementType: "info",
    announcementExpiry: null
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const loadSettings = async () => {
    if (!profile?.isAdmin) return

    try {
      setLoading(true)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings', {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can save settings.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers,
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Settings have been updated successfully.",
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const error = await response.json()
        toast({
          title: "Save Failed",
          description: error.error || "Failed to save settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Save Error",
        description: "An error occurred while saving settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({
      platformName: "ChatHub AI",
      platformUrl: "https://chathub.ai",
      timezone: "UTC",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      maintenanceMode: false,
      debugMode: false,
      analyticsEnabled: true,
      userRegistration: true,
      emailNotifications: true,
      maxFileUploadSize: "10MB",
      sessionTimeout: "24h",
      maxUsersPerCompany: 100,
      maxChatbotsPerCompany: 10,
      maxCompanies: 1000,
      maxTeamsPerCompany: 10,
      maxStoragePerCompany: 100,
      maxFileSizePerUpload: 50,
      maxFilesPerUpload: 10,
      maxBackupRetention: 30,
      maxApiRequestsPerMinute: 1000,
      maxApiRequestsPerHour: 10000,
      maxConcurrentChats: 100,
      maxChatHistoryDays: 90,
      maxFreeUsers: 5,
      maxFreeChatbots: 2,
      maxProUsers: 50,
      maxProChatbots: 20,
      defaultCompanyPlan: "free",
      companyApprovalRequired: false,
      maxCompanyNameLength: 50,
      maxCompanyDescriptionLength: 500,
      defaultTheme: "light",
      customBranding: false,
      companyLogo: "",
      companyName: "",
      supportEmail: "support@chathub.ai",
      contactEmail: "contact@chathub.ai",
      termsOfService: "",
      privacyPolicy: "",
      systemAnnouncement: "",
      announcementEnabled: false,
      announcementType: "info",
      announcementExpiry: null
    })
    
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to defaults",
    })
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
                <h1 className="text-3xl md:text-4xl font-bold">System Settings</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Configure platform settings and system preferences
              </p>
              <div className="flex items-center space-x-4">
                <StatusBadge status={systemStatus.database} label="Database" />
                <StatusBadge status={systemStatus.security} label="Security" />
                <StatusBadge status={systemStatus.maintenance} label="Maintenance" />
                <StatusBadge status={systemStatus.notifications} label="Notifications" />
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Settings className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Quick action cards removed as requested */}
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <SystemSettingsForm />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettingsForm />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <MaintenanceSettingsForm />
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <DatabaseSettingsForm />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettingsForm />
        </TabsContent>

        <TabsContent value="platform" className="space-y-6">
          <PlatformSettingsForm />
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">System Operations</h2>
              <p className="text-muted-foreground">
                Monitor and manage system maintenance operations
              </p>
            </div>
            <Button onClick={() => window.location.href = "/dashboard/admin/settings/system-maintenance"}>
              <Wrench className="h-4 w-4 mr-2" />
              Open Maintenance Dashboard
            </Button>
          </div>
          <SystemMaintenanceDashboard />
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <PlatformConfigTest />
          <SystemPreferencesTest />
          <FeatureTogglesTest />
          <LimitsQuotasTest />
        </TabsContent>
      </Tabs>

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
    </div>
  )
} 