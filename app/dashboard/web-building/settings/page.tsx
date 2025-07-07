"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Settings, 
  Save, 
  Globe, 
  Shield, 
  Bell, 
  CreditCard,
  Users,
  Database,
  Palette,
  Code,
  Mail,
  Phone,
  MapPin,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function WebVaultSettings() {
  const [settings, setSettings] = useState({
    // Company Information
    companyName: "WebVault Company",
    companyEmail: "contact@webvault.com",
    companyPhone: "+1 (555) 123-4567",
    companyAddress: "123 Web Street, Tech City, TC 12345",
    website: "https://webvault.com",
    
    // WebVault Configuration
    defaultDomain: "webvault.com",
    sslEnabled: true,
    autoBackup: true,
    maintenanceMode: false,
    analyticsEnabled: true,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    projectUpdates: true,
    securityAlerts: true,
    billingReminders: true,
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    ipWhitelist: "",
    
    // Billing Settings
    billingCycle: "monthly",
    autoRenewal: true,
    taxExempt: false,
    currency: "USD"
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus("saving")
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSaving(false)
    setSaveStatus("success")
    
    // Reset status after 3 seconds
    setTimeout(() => setSaveStatus("idle"), 3000)
  }

  const getStatusIcon = () => {
    switch (saveStatus) {
      case "saving": return <Clock className="h-4 w-4 animate-spin" />
      case "success": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error": return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Save className="h-4 w-4" />
    }
  }

  const getStatusText = () => {
    switch (saveStatus) {
      case "saving": return "Saving..."
      case "success": return "Settings saved!"
      case "error": return "Error saving"
      default: return "Save Changes"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">WebVault Settings</h1>
              <p className="text-gray-600">Configure your WebVault platform preferences and account settings</p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center space-x-2"
          >
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Company Information</span>
              </CardTitle>
              <CardDescription>
                Update your company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email Address</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input
                    id="companyPhone"
                    value={settings.companyPhone}
                    onChange={(e) => setSettings(prev => ({ ...prev, companyPhone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => setSettings(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Textarea
                  id="companyAddress"
                  value={settings.companyAddress}
                  onChange={(e) => setSettings(prev => ({ ...prev, companyAddress: e.target.value }))}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* WebVault Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>WebVault Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure your WebVault platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultDomain">Default Domain</Label>
                  <Input
                    id="defaultDomain"
                    value={settings.defaultDomain}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultDomain: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Billing Cycle</Label>
                  <Select value={settings.billingCycle} onValueChange={(value) => setSettings(prev => ({ ...prev, billingCycle: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SSL Certificate</Label>
                    <p className="text-sm text-gray-500">Enable SSL for all websites</p>
                  </div>
                  <Switch
                    checked={settings.sslEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sslEnabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-gray-500">Automatically backup websites daily</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBackup: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Put all websites in maintenance mode</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics</Label>
                    <p className="text-sm text-gray-500">Enable website analytics tracking</p>
                  </div>
                  <Switch
                    checked={settings.analyticsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, analyticsEnabled: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select value={settings.sessionTimeout.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Password Policy</Label>
                  <Select value={settings.passwordPolicy} onValueChange={(value) => setSettings(prev => ({ ...prev, passwordPolicy: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="strong">Strong</SelectItem>
                      <SelectItem value="very-strong">Very Strong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for all users</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="Enter IP addresses (one per line)"
                  value={settings.ipWhitelist}
                  onChange={(e) => setSettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
                  rows={3}
                />
                <p className="text-sm text-gray-500">Leave empty to allow all IPs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Websites</span>
                <Badge variant="secondary">24</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Storage</span>
                <Badge variant="secondary">2.4 GB</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SSL Certificates</span>
                <Badge variant="secondary">24/24</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <Badge className="bg-green-100 text-green-800">99.9%</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates via SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Project Updates</span>
                  <Switch
                    checked={settings.projectUpdates}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, projectUpdates: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Alerts</span>
                  <Switch
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, securityAlerts: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Billing Reminders</span>
                  <Switch
                    checked={settings.billingReminders}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, billingReminders: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Billing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Renewal</Label>
                  <p className="text-sm text-gray-500">Automatically renew services</p>
                </div>
                <Switch
                  checked={settings.autoRenewal}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoRenewal: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Tax Exempt</Label>
                  <p className="text-sm text-gray-500">Tax exempt organization</p>
                </div>
                <Switch
                  checked={settings.taxExempt}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, taxExempt: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 