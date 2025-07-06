"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Copy, Eye, EyeOff, RefreshCw, Navigation, Settings, Shield, Palette, Zap } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/hooks/use-settings"

export default function SettingsPage() {
  const { profile, updateProfile } = useAuth()
  const { settings, updateSettings } = useSettings()
  const { toast } = useToast()
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [companyProfile, setCompanyProfile] = useState({
    companyName: profile?.companyName || "",
    domain: profile?.domain || "",
    industry: profile?.industry || "",
  })

  const [webhookConfig, setWebhookConfig] = useState({
    url: settings?.webhookUrl || "",
    events: settings?.webhookEvents || [],
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      await updateProfile(companyProfile)
      toast({
        title: "Profile updated",
        description: "Your company profile has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveWebhook = async () => {
    setIsLoading(true)
    try {
      await updateSettings({ webhookUrl: webhookConfig.url, webhookEvents: webhookConfig.events })
      toast({
        title: "Webhook updated",
        description: "Your webhook configuration has been saved.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update webhook settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(settings?.apiKey || "api_key_placeholder")
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    })
  }

  const handleRegenerateApiKey = async () => {
    if (
      confirm(
        "Are you sure? This will invalidate your current API key and any integrations using it will stop working.",
      )
    ) {
      try {
        // TODO: Implement API key regeneration
        toast({
          title: "API key regenerated",
          description: "A new API key has been generated. Update your integrations.",
        })
      } catch (error) {
        toast({
          title: "Regeneration failed",
          description: "Failed to regenerate API key. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and integrations</p>
      </div>

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Update your company information and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={companyProfile.companyName}
                onChange={(e) => setCompanyProfile((prev) => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter your company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Company Domain</Label>
              <Input
                id="domain"
                value={companyProfile.domain}
                onChange={(e) => setCompanyProfile((prev) => ({ ...prev, domain: e.target.value }))}
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={companyProfile.industry}
              onValueChange={(value) => setCompanyProfile((prev) => ({ ...prev, industry: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSaveProfile} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage API keys for integrating with external services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={settings?.apiKey || "••••••••••••••••••••••••••••••••"}
                  readOnly
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button variant="outline" onClick={handleCopyApiKey}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleRegenerateApiKey}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Use this API key to authenticate requests to the ChatBot Pro API
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Configuration</CardTitle>
          <CardDescription>Configure webhooks to receive real-time notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={webhookConfig.url}
              onChange={(e) => setWebhookConfig((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://your-app.com/webhook"
            />
            <p className="text-sm text-muted-foreground">We'll send POST requests to this URL when events occur</p>
          </div>

          <div className="space-y-3">
            <Label>Event Types</Label>
            <div className="space-y-2">
              {[
                { id: "conversation.started", label: "Conversation Started" },
                { id: "conversation.ended", label: "Conversation Ended" },
                { id: "message.received", label: "Message Received" },
                { id: "handoff.requested", label: "Human Handoff Requested" },
              ].map((event) => (
                <div key={event.id} className="flex items-center space-x-2">
                  <Switch
                    id={event.id}
                    checked={webhookConfig.events.includes(event.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setWebhookConfig((prev) => ({
                          ...prev,
                          events: [...prev.events, event.id],
                        }))
                      } else {
                        setWebhookConfig((prev) => ({
                          ...prev,
                          events: prev.events.filter((e) => e !== event.id),
                        }))
                      }
                    }}
                  />
                  <Label htmlFor={event.id}>{event.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSaveWebhook} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Webhook Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* Navigation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="w-5 h-5" />
            <span>Navigation Settings</span>
          </CardTitle>
          <CardDescription>Customize your navigation experience and appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Appearance</h4>
                  <p className="text-sm text-gray-500">Customize themes and styling</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/dashboard/settings/navigation">Configure</a>
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Security</h4>
                  <p className="text-sm text-gray-500">Access controls and permissions</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/dashboard/settings/navigation">Configure</a>
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Performance</h4>
                  <p className="text-sm text-gray-500">Optimize loading and caching</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/dashboard/settings/navigation">Configure</a>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <div>
              <h4 className="font-semibold">Advanced Navigation Settings</h4>
              <p className="text-sm text-gray-600">Manage custom tabs, paths, and navigation behavior</p>
            </div>
            <Button asChild>
              <a href="/dashboard/settings/navigation">Manage Navigation</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified about important events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              {
                id: "email_notifications",
                label: "Email Notifications",
                description: "Receive email alerts for important events",
              },
              { id: "weekly_reports", label: "Weekly Reports", description: "Get weekly summary reports via email" },
              {
                id: "security_alerts",
                label: "Security Alerts",
                description: "Notifications about security-related events",
              },
              {
                id: "billing_notifications",
                label: "Billing Notifications",
                description: "Alerts about billing and subscription changes",
              },
            ].map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={setting.id}>{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Switch id={setting.id} defaultChecked />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
