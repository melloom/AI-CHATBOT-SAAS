"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { 
  Settings, 
  Globe, 
  Palette, 
  Mail, 
  Clock, 
  Users, 
  FileText,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react"

interface SystemSettings {
  platformName: string
  platformUrl: string
  timezone: string
  language: string
  dateFormat: string
  timeFormat: string
  maintenanceMode: boolean
  debugMode: boolean
  analyticsEnabled: boolean
  userRegistration: boolean
  emailNotifications: boolean
  maxFileUploadSize: string
  sessionTimeout: string
  maxUsersPerCompany: number
  maxChatbotsPerCompany: number
  maxCompanies: number
  maxTeamsPerCompany: number
  maxStoragePerCompany: number
  maxFileSizePerUpload: number
  maxFilesPerUpload: number
  maxBackupRetention: number
  maxApiRequestsPerMinute: number
  maxApiRequestsPerHour: number
  maxConcurrentChats: number
  maxChatHistoryDays: number
  maxFreeUsers: number
  maxFreeChatbots: number
  maxProUsers: number
  maxProChatbots: number
  defaultCompanyPlan: string
  companyApprovalRequired: boolean
  maxCompanyNameLength: number
  maxCompanyDescriptionLength: number
  defaultTheme: string
  customBranding: boolean
  companyLogo: string
  companyName: string
  supportEmail: string
  contactEmail: string
  supportPhone: string
  salesEmail: string
  companyWebsite: string
  companyAddress: string
  companyPhone: string
  twitterHandle: string
  linkedinUrl: string
  facebookUrl: string
  instagramHandle: string
  businessHours: string
  supportTimezone: string
  emergencyEmail: string
  emergencyPhone: string
  contactFormEnabled: boolean
  liveChatEnabled: boolean
  supportTicketsEnabled: boolean
  knowledgeBaseEnabled: boolean
  termsOfService: string
  privacyPolicy: string
  systemAnnouncement: string
  announcementEnabled: boolean
  announcementType: "info" | "success" | "warning" | "error"
  announcementExpiry: string | null
}

export function SystemSettingsForm() {
  const { toast } = useToast()
  const { user, profile } = useAuth()
  const [settings, setSettings] = useState<SystemSettings>({
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
      supportPhone: "",
      salesEmail: "",
      companyWebsite: "",
      companyAddress: "",
      companyPhone: "",
      twitterHandle: "",
      linkedinUrl: "",
      facebookUrl: "",
      instagramHandle: "",
      businessHours: "",
      supportTimezone: "America/New_York",
      emergencyEmail: "",
      emergencyPhone: "",
      contactFormEnabled: true,
      liveChatEnabled: false,
      supportTicketsEnabled: true,
      knowledgeBaseEnabled: false,
      termsOfService: "",
      privacyPolicy: "",
      systemAnnouncement: "",
      announcementEnabled: false,
      announcementType: "info",
      announcementExpiry: null
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Load current settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        } else {
          console.error('Failed to load settings:', response.status)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        toast({
          title: "Error",
          description: "Failed to load system settings. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setInitialLoading(false)
      }
    }

    if (user) {
      loadSettings()
    } else {
      setInitialLoading(false)
    }
  }, [user, toast])

  const handleSave = async () => {
    setLoading(true)
    try {
      // Check if user is admin
      if (!profile?.isAdmin) {
        toast({
          title: "Access Denied",
          description: "Only administrators can modify system settings.",
          variant: "destructive",
        })
        return
      }

      // Get current user token for authentication
      const { auth } = await import('@/lib/firebase')
      const token = await auth.currentUser?.getIdToken()
      
      if (!token) {
        throw new Error('No authentication token available')
      }

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save settings')
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: result.message || "System settings saved successfully!",
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can reset system settings.",
        variant: "destructive",
      })
      return
    }

    // Reset to default values
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
      supportPhone: "",
      salesEmail: "",
      companyWebsite: "",
      companyAddress: "",
      companyPhone: "",
      twitterHandle: "",
      linkedinUrl: "",
      facebookUrl: "",
      instagramHandle: "",
      businessHours: "",
      supportTimezone: "America/New_York",
      emergencyEmail: "",
      emergencyPhone: "",
      contactFormEnabled: true,
      liveChatEnabled: false,
      supportTicketsEnabled: true,
      knowledgeBaseEnabled: false,
      termsOfService: "",
      privacyPolicy: "",
      systemAnnouncement: "",
      announcementEnabled: false,
      announcementType: "info",
      announcementExpiry: null
    })
  }

  // Show loading state while initializing
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading system settings...</span>
        </div>
      </div>
    )
  }

  // Check if user is admin
  if (!profile?.isAdmin) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
          <h3 className="text-lg font-semibold">Access Denied</h3>
          <p className="text-muted-foreground">
            Only administrators can access system settings.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Platform Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Platform Configuration</span>
          </CardTitle>
          <CardDescription>Basic platform settings and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                placeholder="Enter platform name"
              />
              {settings.platformName && (
                <p className="text-sm text-muted-foreground">
                  Current: {settings.platformName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="platformUrl">Platform URL</Label>
              <Input
                id="platformUrl"
                value={settings.platformUrl}
                onChange={(e) => setSettings({ ...settings, platformUrl: e.target.value })}
                placeholder="https://yourplatform.com"
                type="url"
              />
              {settings.platformUrl && !settings.platformUrl.startsWith('http') && (
                <p className="text-sm text-yellow-600">
                  ⚠️ URL should start with http:// or https://
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Default Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
              {settings.timezone && (
                <p className="text-sm text-muted-foreground">
                  Current: {settings.timezone}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Default Language</Label>
              <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                </SelectContent>
              </Select>
              {settings.language && (
                <p className="text-sm text-muted-foreground">
                  Current: {settings.language === 'en' ? 'English' : settings.language.toUpperCase()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>System Preferences</span>
          </CardTitle>
          <CardDescription>System behavior and performance settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select value={settings.dateFormat} onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  <SelectItem value="MM-DD-YYYY">MM-DD-YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Time Format</Label>
              <Select value={settings.timeFormat} onValueChange={(value) => setSettings({ ...settings, timeFormat: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout</Label>
              <Select value={settings.sessionTimeout} onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="8h">8 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxFileUploadSize">Max File Upload Size</Label>
              <Select value={settings.maxFileUploadSize} onValueChange={(value) => setSettings({ ...settings, maxFileUploadSize: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1MB">1 MB</SelectItem>
                  <SelectItem value="5MB">5 MB</SelectItem>
                  <SelectItem value="10MB">10 MB</SelectItem>
                  <SelectItem value="25MB">25 MB</SelectItem>
                  <SelectItem value="50MB">50 MB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Feature Toggles</span>
          </CardTitle>
          <CardDescription>Enable or disable platform features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Temporarily disable platform access</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Debug Mode</Label>
                <p className="text-sm text-muted-foreground">Enable detailed logging and debugging</p>
              </div>
              <Switch
                checked={settings.debugMode}
                onCheckedChange={(checked) => setSettings({ ...settings, debugMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics</Label>
                <p className="text-sm text-muted-foreground">Enable usage analytics and tracking</p>
              </div>
              <Switch
                checked={settings.analyticsEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, analyticsEnabled: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new user registrations</p>
              </div>
              <Switch
                checked={settings.userRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, userRegistration: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications to users</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Custom Branding</Label>
                <p className="text-sm text-muted-foreground">Allow companies to customize branding</p>
              </div>
              <Switch
                checked={settings.customBranding}
                onCheckedChange={(checked) => setSettings({ ...settings, customBranding: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limits and Quotas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Limits and Quotas</span>
          </CardTitle>
          <CardDescription>Set platform limits and user quotas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Limits */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Company Limits</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxUsersPerCompany">Max Users per Company</Label>
                <Input
                  id="maxUsersPerCompany"
                  type="number"
                  value={settings.maxUsersPerCompany}
                  onChange={(e) => setSettings({ ...settings, maxUsersPerCompany: parseInt(e.target.value) })}
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground">Maximum number of users allowed per company</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxChatbotsPerCompany">Max Chatbots per Company</Label>
                <Input
                  id="maxChatbotsPerCompany"
                  type="number"
                  value={settings.maxChatbotsPerCompany}
                  onChange={(e) => setSettings({ ...settings, maxChatbotsPerCompany: parseInt(e.target.value) })}
                  placeholder="10"
                />
                <p className="text-xs text-muted-foreground">Maximum number of chatbots per company</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCompanies">Max Companies</Label>
                <Input
                  id="maxCompanies"
                  type="number"
                  value={settings.maxCompanies || 1000}
                  onChange={(e) => setSettings({ ...settings, maxCompanies: parseInt(e.target.value) })}
                  placeholder="1000"
                />
                <p className="text-xs text-muted-foreground">Maximum number of companies on platform</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTeamsPerCompany">Max Teams per Company</Label>
                <Input
                  id="maxTeamsPerCompany"
                  type="number"
                  value={settings.maxTeamsPerCompany || 10}
                  onChange={(e) => setSettings({ ...settings, maxTeamsPerCompany: parseInt(e.target.value) })}
                  placeholder="10"
                />
                <p className="text-xs text-muted-foreground">Maximum number of teams per company</p>
              </div>
            </div>
          </div>

          {/* Storage Limits */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Storage Limits</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxStoragePerCompany">Max Storage per Company (GB)</Label>
                <Input
                  id="maxStoragePerCompany"
                  type="number"
                  value={settings.maxStoragePerCompany || 100}
                  onChange={(e) => setSettings({ ...settings, maxStoragePerCompany: parseInt(e.target.value) })}
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground">Maximum storage space per company in GB</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFileSizePerUpload">Max File Size per Upload (MB)</Label>
                <Input
                  id="maxFileSizePerUpload"
                  type="number"
                  value={settings.maxFileSizePerUpload || 50}
                  onChange={(e) => setSettings({ ...settings, maxFileSizePerUpload: parseInt(e.target.value) })}
                  placeholder="50"
                />
                <p className="text-xs text-muted-foreground">Maximum file size for single upload</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFilesPerUpload">Max Files per Upload</Label>
                <Input
                  id="maxFilesPerUpload"
                  type="number"
                  value={settings.maxFilesPerUpload || 10}
                  onChange={(e) => setSettings({ ...settings, maxFilesPerUpload: parseInt(e.target.value) })}
                  placeholder="10"
                />
                <p className="text-xs text-muted-foreground">Maximum number of files per upload</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxBackupRetention">Max Backup Retention (Days)</Label>
                <Input
                  id="maxBackupRetention"
                  type="number"
                  value={settings.maxBackupRetention || 30}
                  onChange={(e) => setSettings({ ...settings, maxBackupRetention: parseInt(e.target.value) })}
                  placeholder="30"
                />
                <p className="text-xs text-muted-foreground">How long to keep backups</p>
              </div>
            </div>
          </div>

          {/* API Limits */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">API Limits</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxApiRequestsPerMinute">Max API Requests per Minute</Label>
                <Input
                  id="maxApiRequestsPerMinute"
                  type="number"
                  value={settings.maxApiRequestsPerMinute || 1000}
                  onChange={(e) => setSettings({ ...settings, maxApiRequestsPerMinute: parseInt(e.target.value) })}
                  placeholder="1000"
                />
                <p className="text-xs text-muted-foreground">Rate limit per minute per company</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxApiRequestsPerHour">Max API Requests per Hour</Label>
                <Input
                  id="maxApiRequestsPerHour"
                  type="number"
                  value={settings.maxApiRequestsPerHour || 10000}
                  onChange={(e) => setSettings({ ...settings, maxApiRequestsPerHour: parseInt(e.target.value) })}
                  placeholder="10000"
                />
                <p className="text-xs text-muted-foreground">Rate limit per hour per company</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxConcurrentChats">Max Concurrent Chats</Label>
                <Input
                  id="maxConcurrentChats"
                  type="number"
                  value={settings.maxConcurrentChats || 100}
                  onChange={(e) => setSettings({ ...settings, maxConcurrentChats: parseInt(e.target.value) })}
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground">Maximum concurrent chat sessions</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxChatHistoryDays">Max Chat History (Days)</Label>
                <Input
                  id="maxChatHistoryDays"
                  type="number"
                  value={settings.maxChatHistoryDays || 90}
                  onChange={(e) => setSettings({ ...settings, maxChatHistoryDays: parseInt(e.target.value) })}
                  placeholder="90"
                />
                <p className="text-xs text-muted-foreground">How long to keep chat history</p>
              </div>
            </div>
          </div>

          {/* Subscription Limits */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Subscription Limits</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxFreeUsers">Max Free Users</Label>
                <Input
                  id="maxFreeUsers"
                  type="number"
                  value={settings.maxFreeUsers || 5}
                  onChange={(e) => setSettings({ ...settings, maxFreeUsers: parseInt(e.target.value) })}
                  placeholder="5"
                />
                <p className="text-xs text-muted-foreground">Maximum users for free tier</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFreeChatbots">Max Free Chatbots</Label>
                <Input
                  id="maxFreeChatbots"
                  type="number"
                  value={settings.maxFreeChatbots || 2}
                  onChange={(e) => setSettings({ ...settings, maxFreeChatbots: parseInt(e.target.value) })}
                  placeholder="2"
                />
                <p className="text-xs text-muted-foreground">Maximum chatbots for free tier</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxProUsers">Max Pro Users</Label>
                <Input
                  id="maxProUsers"
                  type="number"
                  value={settings.maxProUsers || 50}
                  onChange={(e) => setSettings({ ...settings, maxProUsers: parseInt(e.target.value) })}
                  placeholder="50"
                />
                <p className="text-xs text-muted-foreground">Maximum users for pro tier</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxProChatbots">Max Pro Chatbots</Label>
                <Input
                  id="maxProChatbots"
                  type="number"
                  value={settings.maxProChatbots || 20}
                  onChange={(e) => setSettings({ ...settings, maxProChatbots: parseInt(e.target.value) })}
                  placeholder="20"
                />
                <p className="text-xs text-muted-foreground">Maximum chatbots for pro tier</p>
              </div>
            </div>
          </div>

          {/* Company Selection Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Company Selection Options</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultCompanyPlan">Default Company Plan</Label>
                <Select 
                  value={settings.defaultCompanyPlan || 'free'} 
                  onValueChange={(value) => setSettings({ ...settings, defaultCompanyPlan: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Default plan for new companies</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyApprovalRequired">Company Approval Required</Label>
                <Select 
                  value={settings.companyApprovalRequired ? 'true' : 'false'} 
                  onValueChange={(value) => setSettings({ ...settings, companyApprovalRequired: value === 'true' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Require admin approval for new companies</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCompanyNameLength">Max Company Name Length</Label>
                <Input
                  id="maxCompanyNameLength"
                  type="number"
                  value={settings.maxCompanyNameLength || 50}
                  onChange={(e) => setSettings({ ...settings, maxCompanyNameLength: parseInt(e.target.value) })}
                  placeholder="50"
                />
                <p className="text-xs text-muted-foreground">Maximum characters for company names</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCompanyDescriptionLength">Max Company Description Length</Label>
                <Input
                  id="maxCompanyDescriptionLength"
                  type="number"
                  value={settings.maxCompanyDescriptionLength || 500}
                  onChange={(e) => setSettings({ ...settings, maxCompanyDescriptionLength: parseInt(e.target.value) })}
                  placeholder="500"
                />
                <p className="text-xs text-muted-foreground">Maximum characters for company descriptions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Contact Information</span>
          </CardTitle>
          <CardDescription>Platform contact details and support information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Primary Contact Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  placeholder="support@company.com"
                />
                <p className="text-xs text-muted-foreground">Primary support email for user inquiries</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="contact@company.com"
                />
                <p className="text-xs text-muted-foreground">General contact email for business inquiries</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  type="tel"
                  value={settings.supportPhone || ""}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
                <p className="text-xs text-muted-foreground">Support phone number for urgent issues</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesEmail">Sales Email</Label>
                <Input
                  id="salesEmail"
                  type="email"
                  value={settings.salesEmail || ""}
                  onChange={(e) => setSettings({ ...settings, salesEmail: e.target.value })}
                  placeholder="sales@company.com"
                />
                <p className="text-xs text-muted-foreground">Sales inquiries and business development</p>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Company Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  placeholder="Your Company Name"
                />
                <p className="text-xs text-muted-foreground">Official company name for legal purposes</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  value={settings.companyWebsite || ""}
                  onChange={(e) => setSettings({ ...settings, companyWebsite: e.target.value })}
                  placeholder="https://www.company.com"
                />
                <p className="text-xs text-muted-foreground">Official company website URL</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  value={settings.companyAddress || ""}
                  onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                  placeholder="123 Business Street, City, State, ZIP"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Physical address for legal correspondence</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input
                  id="companyPhone"
                  type="tel"
                  value={settings.companyPhone || ""}
                  onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                  placeholder="+1 (555) 987-6543"
                />
                <p className="text-xs text-muted-foreground">Main company phone number</p>
              </div>
            </div>
          </div>

          {/* Social Media & Additional Contact */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Social Media & Additional Contact</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="twitterHandle">Twitter Handle</Label>
                <Input
                  id="twitterHandle"
                  type="text"
                  value={settings.twitterHandle || ""}
                  onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                  placeholder="@companyname"
                />
                <p className="text-xs text-muted-foreground">Official Twitter/X handle</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={settings.linkedinUrl || ""}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/company/companyname"
                />
                <p className="text-xs text-muted-foreground">Company LinkedIn profile</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  type="url"
                  value={settings.facebookUrl || ""}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/companyname"
                />
                <p className="text-xs text-muted-foreground">Company Facebook page</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramHandle">Instagram Handle</Label>
                <Input
                  id="instagramHandle"
                  type="text"
                  value={settings.instagramHandle || ""}
                  onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                  placeholder="@companyname"
                />
                <p className="text-xs text-muted-foreground">Official Instagram handle</p>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Business Hours</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessHours">Business Hours</Label>
                <Input
                  id="businessHours"
                  type="text"
                  value={settings.businessHours || ""}
                  onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                  placeholder="Monday - Friday: 9:00 AM - 6:00 PM EST"
                />
                <p className="text-xs text-muted-foreground">Standard business hours for support</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Support Timezone</Label>
                <Select 
                  value={settings.supportTimezone || "America/New_York"} 
                  onValueChange={(value) => setSettings({ ...settings, supportTimezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Timezone for support hours</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Emergency Contact</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyEmail">Emergency Email</Label>
                <Input
                  id="emergencyEmail"
                  type="email"
                  value={settings.emergencyEmail || ""}
                  onChange={(e) => setSettings({ ...settings, emergencyEmail: e.target.value })}
                  placeholder="emergency@company.com"
                />
                <p className="text-xs text-muted-foreground">For critical system issues and outages</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={settings.emergencyPhone || ""}
                  onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })}
                  placeholder="+1 (555) 999-8888"
                />
                <p className="text-xs text-muted-foreground">24/7 emergency contact number</p>
              </div>
            </div>
          </div>

          {/* Contact Preferences */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Contact Preferences</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Contact Form</Label>
                  <p className="text-sm text-muted-foreground">Show contact form on platform</p>
                </div>
                <Switch
                  checked={settings.contactFormEnabled !== false}
                  onCheckedChange={(checked) => setSettings({ ...settings, contactFormEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Live Chat</Label>
                  <p className="text-sm text-muted-foreground">Show live chat support widget</p>
                </div>
                <Switch
                  checked={settings.liveChatEnabled || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, liveChatEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Support Tickets</Label>
                  <p className="text-sm text-muted-foreground">Allow users to create support tickets</p>
                </div>
                <Switch
                  checked={settings.supportTicketsEnabled !== false}
                  onCheckedChange={(checked) => setSettings({ ...settings, supportTicketsEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Knowledge Base</Label>
                  <p className="text-sm text-muted-foreground">Show help articles and documentation</p>
                </div>
                <Switch
                  checked={settings.knowledgeBaseEnabled || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, knowledgeBaseEnabled: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Announcement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>System Announcement</span>
          </CardTitle>
          <CardDescription>Display a system-wide announcement to all users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Announcement</Label>
              <p className="text-sm text-muted-foreground">Show announcement to all users</p>
            </div>
            <Switch
              checked={settings.announcementEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, announcementEnabled: checked })}
            />
          </div>
          
          {settings.announcementEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="systemAnnouncement">Announcement Message</Label>
                <Textarea
                  id="systemAnnouncement"
                  value={settings.systemAnnouncement}
                  onChange={(e) => setSettings({ ...settings, systemAnnouncement: e.target.value })}
                  placeholder="Enter system announcement message..."
                  rows={4}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="announcementType">Announcement Type</Label>
                  <Select 
                    value={settings.announcementType} 
                    onValueChange={(value: "info" | "success" | "warning" | "error") => setSettings({ ...settings, announcementType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="announcementExpiry">Expiry Date (Optional)</Label>
                  <Input
                    id="announcementExpiry"
                    type="datetime-local"
                    value={settings.announcementExpiry || ""}
                    onChange={(e) => setSettings({ ...settings, announcementExpiry: e.target.value || null })}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {saved && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Settings Saved
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
} 