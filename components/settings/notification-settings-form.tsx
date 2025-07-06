"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  Smartphone, 
  Settings, 
  Shield, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Volume2,
  Vibrate,
  Badge,
  Send,
  TestTube
} from "lucide-react"

interface NotificationSettings {
  email: {
    smtp: {
      host: string
      port: number
      username: string
      password: string
      fromEmail: string
      fromName: string
      useTLS: boolean
    }
    enabled: boolean
  }
  sms: {
    enabled: boolean
    provider: string
    apiKey?: string
  }
  push: {
    enabled: boolean
    serverKey: string
    appId: string
  }
  inApp: {
    enabled: boolean
  }
  userNotifications: {
    newUserRegistration: boolean
    passwordReset: boolean
    securityAlerts: boolean
    maintenanceUpdates: boolean
    systemUpdates: boolean
  }
  adminNotifications: {
    newUserRegistration: boolean
    securityBreach: boolean
    systemErrors: boolean
    highUsageAlerts: boolean
  }
  preferences: {
    sound: boolean
    vibration: boolean
    badge: boolean
    quietHours: boolean
    quietHoursStart?: string
    quietHoursEnd?: string
  }
}

export function NotificationSettingsForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        username: '',
        password: '',
        fromEmail: 'noreply@chathub.ai',
        fromName: 'ChatHub AI',
        useTLS: true
      },
      enabled: true
    },
    sms: {
      enabled: false,
      provider: 'twilio'
    },
    push: {
      enabled: false,
      serverKey: '',
      appId: ''
    },
    inApp: {
      enabled: true
    },
    userNotifications: {
      newUserRegistration: true,
      passwordReset: true,
      securityAlerts: true,
      maintenanceUpdates: true,
      systemUpdates: true
    },
    adminNotifications: {
      newUserRegistration: true,
      securityBreach: true,
      systemErrors: true,
      highUsageAlerts: true
    },
    preferences: {
      sound: true,
      vibration: true,
      badge: true,
      quietHours: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00'
    }
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const token = await user?.getIdToken()
      
      const response = await fetch('/api/settings/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        console.error('Failed to load notification settings')
      }
    } catch (error) {
      console.error('Error loading notification settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const token = await user?.getIdToken()
      
      const response = await fetch('/api/settings/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification settings saved successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save notification settings",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving notification settings:', error)
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const testEmailConfiguration = async () => {
    try {
      setTestingEmail(true)
      const token = await user?.getIdToken()
      
      const response = await fetch('/api/settings/notifications/test-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          smtpConfig: settings.email.smtp,
          testEmail: settings.email.smtp.username // Send to the configured email
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Test Email Sent",
          description: "Test email sent successfully. Please check your inbox.",
        })
      } else {
        toast({
          title: "Test Failed",
          description: result.error || "Failed to send test email",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error testing email configuration:', error)
      toast({
        title: "Error",
        description: "Failed to test email configuration",
        variant: "destructive"
      })
    } finally {
      setTestingEmail(false)
    }
  }

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev }
      const keys = path.split('.')
      let current: any = newSettings
      
      // Validate path to prevent prototype pollution
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          console.warn('Attempted prototype pollution attack detected:', path)
          return prev
        }
        if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
          current[key] = {}
        }
        current = current[key]
      }
      
      const lastKey = keys[keys.length - 1]
      if (lastKey === '__proto__' || lastKey === 'constructor' || lastKey === 'prototype') {
        console.warn('Attempted prototype pollution attack detected:', path)
        return prev
      }
      
      current[lastKey] = value
      return newSettings
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notification settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Settings</h2>
          <p className="text-muted-foreground">
            Configure how notifications are sent and displayed
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Types
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings for email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-enabled">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via email
                  </p>
                </div>
                <Switch
                  id="email-enabled"
                  checked={settings.email.enabled}
                  onCheckedChange={(checked) => updateSettings('email.enabled', checked)}
                />
              </div>

              {settings.email.enabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input
                        id="smtp-host"
                        value={settings.email.smtp.host}
                        onChange={(e) => updateSettings('email.smtp.host', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input
                        id="smtp-port"
                        type="number"
                        value={settings.email.smtp.port}
                        onChange={(e) => updateSettings('email.smtp.port', parseInt(e.target.value))}
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">SMTP Username</Label>
                      <Input
                        id="smtp-username"
                        value={settings.email.smtp.username}
                        onChange={(e) => updateSettings('email.smtp.username', e.target.value)}
                        placeholder="your-email@gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">SMTP Password</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        value={settings.email.smtp.password}
                        onChange={(e) => updateSettings('email.smtp.password', e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from-email">From Email</Label>
                      <Input
                        id="from-email"
                        value={settings.email.smtp.fromEmail}
                        onChange={(e) => updateSettings('email.smtp.fromEmail', e.target.value)}
                        placeholder="noreply@chathub.ai"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from-name">From Name</Label>
                      <Input
                        id="from-name"
                        value={settings.email.smtp.fromName}
                        onChange={(e) => updateSettings('email.smtp.fromName', e.target.value)}
                        placeholder="ChatHub AI"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-tls"
                      checked={settings.email.smtp.useTLS}
                      onCheckedChange={(checked) => updateSettings('email.smtp.useTLS', checked)}
                    />
                    <Label htmlFor="use-tls">Use Secure Connection (TLS)</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={testEmailConfiguration} 
                      disabled={testingEmail}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <TestTube className="h-4 w-4" />
                      {testingEmail ? "Testing..." : "Test Email Configuration"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Notifications
                </CardTitle>
                <CardDescription>
                  Configure notifications sent to users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new users register
                    </p>
                  </div>
                  <Switch
                    checked={settings.userNotifications.newUserRegistration}
                    onCheckedChange={(checked) => updateSettings('userNotifications.newUserRegistration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Password Reset</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify on password reset requests
                    </p>
                  </div>
                  <Switch
                    checked={settings.userNotifications.passwordReset}
                    onCheckedChange={(checked) => updateSettings('userNotifications.passwordReset', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify on security-related events
                    </p>
                  </div>
                  <Switch
                    checked={settings.userNotifications.securityAlerts}
                    onCheckedChange={(checked) => updateSettings('userNotifications.securityAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about maintenance schedules
                    </p>
                  </div>
                  <Switch
                    checked={settings.userNotifications.maintenanceUpdates}
                    onCheckedChange={(checked) => updateSettings('userNotifications.maintenanceUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about system updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.userNotifications.systemUpdates}
                    onCheckedChange={(checked) => updateSettings('userNotifications.systemUpdates', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Admin Notifications
                </CardTitle>
                <CardDescription>
                  Configure notifications sent to administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify admins of new registrations
                    </p>
                  </div>
                  <Switch
                    checked={settings.adminNotifications.newUserRegistration}
                    onCheckedChange={(checked) => updateSettings('adminNotifications.newUserRegistration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Security Breach</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify admins of security issues
                    </p>
                  </div>
                  <Switch
                    checked={settings.adminNotifications.securityBreach}
                    onCheckedChange={(checked) => updateSettings('adminNotifications.securityBreach', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Errors</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify admins of system errors
                    </p>
                  </div>
                  <Switch
                    checked={settings.adminNotifications.systemErrors}
                    onCheckedChange={(checked) => updateSettings('adminNotifications.systemErrors', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>High Usage Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify admins of high system usage
                    </p>
                  </div>
                  <Switch
                    checked={settings.adminNotifications.highUsageAlerts}
                    onCheckedChange={(checked) => updateSettings('adminNotifications.highUsageAlerts', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  SMS Notifications
                </CardTitle>
                <CardDescription>
                  Send notifications via SMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable SMS notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.sms.enabled}
                    onCheckedChange={(checked) => updateSettings('sms.enabled', checked)}
                  />
                </div>

                {settings.sms.enabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sms-provider">SMS Provider</Label>
                      <Input
                        id="sms-provider"
                        value={settings.sms.provider}
                        onChange={(e) => updateSettings('sms.provider', e.target.value)}
                        placeholder="twilio"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms-api-key">API Key</Label>
                      <Input
                        id="sms-api-key"
                        type="password"
                        value={settings.sms.apiKey || ''}
                        onChange={(e) => updateSettings('sms.apiKey', e.target.value)}
                        placeholder="Enter API key"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
                <CardDescription>
                  Configure push notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send push notifications to devices
                    </p>
                  </div>
                  <Switch
                    checked={settings.push.enabled}
                    onCheckedChange={(checked) => updateSettings('push.enabled', checked)}
                  />
                </div>

                {settings.push.enabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="push-server-key">Server Key</Label>
                      <Input
                        id="push-server-key"
                        value={settings.push.serverKey}
                        onChange={(e) => updateSettings('push.serverKey', e.target.value)}
                        placeholder="Enter server key"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="push-app-id">App ID</Label>
                      <Input
                        id="push-app-id"
                        value={settings.push.appId}
                        onChange={(e) => updateSettings('push.appId', e.target.value)}
                        placeholder="Enter app ID"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  In-App Notifications
                </CardTitle>
                <CardDescription>
                  Show notifications within the app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable in-app notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.inApp.enabled}
                    onCheckedChange={(checked) => updateSettings('inApp.enabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure notification behavior and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <div>
                      <Label>Notification Sound</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sound for notifications
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.preferences.sound}
                    onCheckedChange={(checked) => updateSettings('preferences.sound', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Vibrate className="h-4 w-4" />
                    <div>
                      <Label>Notification Vibration</Label>
                      <p className="text-sm text-muted-foreground">
                        Vibrate for notifications
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.preferences.vibration}
                    onCheckedChange={(checked) => updateSettings('preferences.vibration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="h-4 w-4" />
                    <div>
                      <Label>Notification Badge</Label>
                      <p className="text-sm text-muted-foreground">
                        Show badge count for notifications
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.preferences.badge}
                    onCheckedChange={(checked) => updateSettings('preferences.badge', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <div>
                      <Label>Quiet Hours</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable quiet hours for notifications
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.preferences.quietHours}
                    onCheckedChange={(checked) => updateSettings('preferences.quietHours', checked)}
                  />
                </div>
              </div>

              {settings.preferences.quietHours && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-hours-start">Quiet Hours Start</Label>
                    <Input
                      id="quiet-hours-start"
                      type="time"
                      value={settings.preferences.quietHoursStart || '22:00'}
                      onChange={(e) => updateSettings('preferences.quietHoursStart', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-hours-end">Quiet Hours End</Label>
                    <Input
                      id="quiet-hours-end"
                      type="time"
                      value={settings.preferences.quietHoursEnd || '08:00'}
                      onChange={(e) => updateSettings('preferences.quietHoursEnd', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}