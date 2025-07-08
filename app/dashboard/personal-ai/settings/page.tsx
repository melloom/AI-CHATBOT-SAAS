"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Zap, 
  Settings, 
  CreditCard,
  Brain,
  MessageCircle,
  Calendar,
  FileText,
  Search,
  Mic,
  Palette,
  Save,
  Eye,
  EyeOff
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function PersonalAISettings() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    // Profile Settings
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: user?.email || "",
    timezone: "UTC",
    language: "en",
    
    // AI Preferences
    aiPersonality: "professional",
    responseLength: "medium",
    autoSave: true,
    voiceEnabled: false,
    
    // Privacy Settings
    dataCollection: true,
    analytics: true,
    shareUsage: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: false,
    
    // Security Settings
    twoFactorEnabled: false,
    sessionTimeout: "24h",
    apiKeyVisible: false
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings Saved",
        description: "Your personal AI settings have been updated successfully.",
        variant: "default"
      })
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Personal AI Settings</h1>
          <p className="text-muted-foreground">Manage your AI preferences and account settings</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <CardTitle>Profile Settings</CardTitle>
              </div>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) => handleSettingChange('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) => handleSettingChange('lastName', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  disabled
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <CardTitle>AI Preferences</CardTitle>
              </div>
              <CardDescription>Customize how your AI assistants behave and respond</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="aiPersonality">AI Personality</Label>
                <Select value={settings.aiPersonality} onValueChange={(value) => handleSettingChange('aiPersonality', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="responseLength">Response Length</Label>
                <Select value={settings.responseLength} onValueChange={(value) => handleSettingChange('responseLength', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSave">Auto-save conversations</Label>
                  <p className="text-sm text-muted-foreground">Automatically save your chat history</p>
                </div>
                <Switch
                  id="autoSave"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voiceEnabled">Voice interactions</Label>
                  <p className="text-sm text-muted-foreground">Enable voice commands and responses</p>
                </div>
                <Switch
                  id="voiceEnabled"
                  checked={settings.voiceEnabled}
                  onCheckedChange={(checked) => handleSettingChange('voiceEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <CardTitle>Privacy & Data</CardTitle>
              </div>
              <CardDescription>Control how your data is collected and used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dataCollection">Data collection</Label>
                  <p className="text-sm text-muted-foreground">Help improve AI by sharing usage data</p>
                </div>
                <Switch
                  id="dataCollection"
                  checked={settings.dataCollection}
                  onCheckedChange={(checked) => handleSettingChange('dataCollection', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics">Analytics</Label>
                  <p className="text-sm text-muted-foreground">Track usage patterns and performance</p>
                </div>
                <Switch
                  id="analytics"
                  checked={settings.analytics}
                  onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="shareUsage">Share usage insights</Label>
                  <p className="text-sm text-muted-foreground">Anonymously share usage patterns</p>
                </div>
                <Switch
                  id="shareUsage"
                  checked={settings.shareUsage}
                  onCheckedChange={(checked) => handleSettingChange('shareUsage', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-orange-600" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push notifications</Label>
                  <p className="text-sm text-muted-foreground">Get real-time updates</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports">Weekly reports</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly AI usage summaries</p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="monthlyReports">Monthly reports</Label>
                  <p className="text-sm text-muted-foreground">Receive monthly productivity insights</p>
                </div>
                <Switch
                  id="monthlyReports"
                  checked={settings.monthlyReports}
                  onCheckedChange={(checked) => handleSettingChange('monthlyReports', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium">{settings.firstName} {settings.lastName}</p>
                  <p className="text-sm text-muted-foreground">{settings.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Member since:</span>
                  <span className="font-medium">January 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Account type:</span>
                  <Badge variant="outline">Personal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactor">Two-factor authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch
                  id="twoFactor"
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorEnabled', checked)}
                />
              </div>
              <div>
                <Label htmlFor="sessionTimeout">Session timeout</Label>
                <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange('sessionTimeout', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="8h">8 hours</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="apiKeyVisible">Show API key</Label>
                  <p className="text-sm text-muted-foreground">Display your API key</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSettingChange('apiKeyVisible', !settings.apiKeyVisible)}
                >
                  {settings.apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 