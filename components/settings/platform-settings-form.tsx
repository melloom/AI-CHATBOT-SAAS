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
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getAuthHeaders } from "@/lib/auth-client"
import { 
  Globe, 
  Mail, 
  CreditCard, 
  Shield, 
  Settings,
  Save,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  Key,
  Palette,
  Users,
  FileText,
  Zap,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Building,
  Phone,
  MapPin
} from "lucide-react"

interface PlatformSettings {
  // Platform Configuration
  platformName: string
  platformDomain: string
  logoUrl: string
  faviconUrl: string
  defaultLanguage: string
  defaultTimezone: string
  maxFileUploadSize: string
  allowedFileTypes: string
  
  // Email Configuration
  smtpProvider: string
  smtpApiKey: string
  fromEmail: string
  fromName: string
  
  // Payment Configuration
  paymentProvider: string
  currency: string
  stripePublishableKey: string
  stripeSecretKey: string
  paypalClientId: string
  paypalSecret: string
  taxRate: number
  
  // Security Configuration
  recaptchaSiteKey: string
  recaptchaSecretKey: string
  jwtSecret: string
  sessionSecret: string
  corsOrigins: string
  
  // Third-party Integrations
  googleAnalyticsId: string
  googleTagManagerId: string
  facebookPixelId: string
  hotjarId: string
  intercomAppId: string
  zendeskDomain: string
  slackWebhookUrl: string
  
  // API Configuration
  apiRateLimit: number
  rateLimitWindow: number
  apiKeyExpiry: number
  webhookTimeout: number
  maxWebhookRetries: number
  
  // Feature Flags
  enableUserRegistration: boolean
  enableEmailVerification: boolean
  enableTwoFactorAuth: boolean
  enableSocialLogin: boolean
  enableFileUpload: boolean
  enableRealTimeChat: boolean
  enableAnalytics: boolean
  enableNotifications: boolean
}

export function PlatformSettingsForm() {
  const { toast } = useToast()
  const { user, profile } = useAuth()
  const [settings, setSettings] = useState<PlatformSettings>({
    // Platform Configuration
    platformName: "ChatHub AI",
    platformDomain: "chathub.ai",
    logoUrl: "https://example.com/logo.png",
    faviconUrl: "https://example.com/favicon.ico",
    defaultLanguage: "English",
    defaultTimezone: "UTC",
    maxFileUploadSize: "10 MB",
    allowedFileTypes: "jpg,jpeg,png,gif,pdf,doc,docx,txt",
    
    // Email Configuration
    smtpProvider: "SendGrid",
    smtpApiKey: "",
    fromEmail: "noreply@chathub.ai",
    fromName: "ChatHub AI",
    
    // Payment Configuration
    paymentProvider: "Stripe",
    currency: "USD ($)",
    stripePublishableKey: "pk_test_...",
    stripeSecretKey: "",
    paypalClientId: "",
    paypalSecret: "",
    taxRate: 0,
    
    // Security Configuration
    recaptchaSiteKey: "6Lc...",
    recaptchaSecretKey: "",
    jwtSecret: "",
    sessionSecret: "",
    corsOrigins: "https://example.com,https://app.example.com",
    
    // Third-party Integrations
    googleAnalyticsId: "G-XXXXXXXXXX",
    googleTagManagerId: "GTM-XXXXXXX",
    facebookPixelId: "XXXXXXXXXX",
    hotjarId: "XXXXXXXXXX",
    intercomAppId: "XXXXXXXXXX",
    zendeskDomain: "company.zendesk.com",
    slackWebhookUrl: "https://hooks.slack.com/services/...",
    
    // API Configuration
    apiRateLimit: 100,
    rateLimitWindow: 900,
    apiKeyExpiry: 365,
    webhookTimeout: 30,
    maxWebhookRetries: 3,
    
    // Feature Flags
    enableUserRegistration: true,
    enableEmailVerification: true,
    enableTwoFactorAuth: true,
    enableSocialLogin: true,
    enableFileUpload: true,
    enableRealTimeChat: true,
    enableAnalytics: true,
    enableNotifications: true,
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSecrets, setShowSecrets] = useState(false)

  // Load settings on component mount
  useEffect(() => {
    loadPlatformSettings()
  }, [])

  const loadPlatformSettings = async () => {
    try {
      setLoading(true)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings/platform', {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        toast({
          title: "Settings Loaded",
          description: "Platform settings loaded successfully",
        })
      } else {
        console.error('Failed to load platform settings')
        toast({
          title: "Error",
          description: "Failed to load platform settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading platform settings:', error)
      toast({
        title: "Error",
        description: "Failed to load platform settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can modify platform settings.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings/platform', {
        method: 'POST',
        headers,
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: result.message || "Platform settings saved successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save platform settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error saving platform settings:', error)
      toast({
        title: "Error",
        description: "Failed to save platform settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestIntegration = async (integration: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/settings/test-${integration}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast({
          title: `${integration.charAt(0).toUpperCase() + integration.slice(1)} Test Successful`,
          description: `${integration} configuration is working correctly.`,
        })
      } else {
        const error = await response.json()
        toast({
          title: `${integration.charAt(0).toUpperCase() + integration.slice(1)} Test Failed`,
          description: error.error || `Failed to test ${integration} configuration`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: `${integration.charAt(0).toUpperCase() + integration.slice(1)} Test Error`,
        description: `An error occurred while testing ${integration}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!profile?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">Only administrators can access platform settings.</p>
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
                placeholder="ChatHub AI"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platformDomain">Platform Domain</Label>
              <Input
                id="platformDomain"
                value={settings.platformDomain}
                onChange={(e) => setSettings({ ...settings, platformDomain: e.target.value })}
                placeholder="chathub.ai"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faviconUrl">Favicon URL</Label>
              <Input
                id="faviconUrl"
                value={settings.faviconUrl}
                onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                placeholder="https://example.com/favicon.ico"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">Default Language</Label>
              <Select value={settings.defaultLanguage} onValueChange={(value) => setSettings({ ...settings, defaultLanguage: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Portuguese">Portuguese</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                  <SelectItem value="Korean">Korean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultTimezone">Default Timezone</Label>
              <Select value={settings.defaultTimezone} onValueChange={(value) => setSettings({ ...settings, defaultTimezone: value })}>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxFileUploadSize">Max File Upload Size</Label>
              <Select value={settings.maxFileUploadSize} onValueChange={(value) => setSettings({ ...settings, maxFileUploadSize: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 MB">1 MB</SelectItem>
                  <SelectItem value="5 MB">5 MB</SelectItem>
                  <SelectItem value="10 MB">10 MB</SelectItem>
                  <SelectItem value="25 MB">25 MB</SelectItem>
                  <SelectItem value="50 MB">50 MB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
              <Input
                id="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value })}
                placeholder="jpg,jpeg,png,gif,pdf,doc,docx,txt"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Configuration</span>
          </CardTitle>
          <CardDescription>Configure email provider and templates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtpProvider">SMTP Provider</Label>
              <Select value={settings.smtpProvider} onValueChange={(value) => setSettings({ ...settings, smtpProvider: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SendGrid">SendGrid</SelectItem>
                  <SelectItem value="Mailgun">Mailgun</SelectItem>
                  <SelectItem value="AWS SES">AWS SES</SelectItem>
                  <SelectItem value="SMTP">Custom SMTP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpApiKey">API Key</Label>
              <div className="relative">
                <Input
                  id="smtpApiKey"
                  type={showSecrets ? "text" : "password"}
                  value={settings.smtpApiKey}
                  onChange={(e) => setSettings({ ...settings, smtpApiKey: e.target.value })}
                  placeholder="Enter API key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={settings.fromEmail}
                onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                placeholder="noreply@chathub.ai"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={settings.fromName}
                onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                placeholder="ChatHub AI"
              />
            </div>
          </div>
          <Button onClick={() => handleTestIntegration("email")} disabled={loading} variant="outline">
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Test Email Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Payment Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Configuration</span>
          </CardTitle>
          <CardDescription>Configure payment providers and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="paymentProvider">Payment Provider</Label>
              <Select value={settings.paymentProvider} onValueChange={(value) => setSettings({ ...settings, paymentProvider: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stripe">Stripe</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Square">Square</SelectItem>
                  <SelectItem value="Custom">Custom Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD ($)">USD ($)</SelectItem>
                  <SelectItem value="EUR (€)">EUR (€)</SelectItem>
                  <SelectItem value="GBP (£)">GBP (£)</SelectItem>
                  <SelectItem value="CAD (C$)">CAD (C$)</SelectItem>
                  <SelectItem value="AUD (A$)">AUD (A$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripePublishableKey">Stripe Publishable Key</Label>
              <Input
                id="stripePublishableKey"
                value={settings.stripePublishableKey}
                onChange={(e) => setSettings({ ...settings, stripePublishableKey: e.target.value })}
                placeholder="pk_test_..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
              <div className="relative">
                <Input
                  id="stripeSecretKey"
                  type={showSecrets ? "text" : "password"}
                  value={settings.stripeSecretKey}
                  onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                  placeholder="sk_test_..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paypalClientId">PayPal Client ID</Label>
              <Input
                id="paypalClientId"
                value={settings.paypalClientId}
                onChange={(e) => setSettings({ ...settings, paypalClientId: e.target.value })}
                placeholder="Enter PayPal Client ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paypalSecret">PayPal Secret</Label>
              <div className="relative">
                <Input
                  id="paypalSecret"
                  type={showSecrets ? "text" : "password"}
                  value={settings.paypalSecret}
                  onChange={(e) => setSettings({ ...settings, paypalSecret: e.target.value })}
                  placeholder="Enter PayPal Secret"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>
          <Button onClick={() => handleTestIntegration("payment")} disabled={loading} variant="outline">
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Test Payment Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Security Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Configuration</span>
          </CardTitle>
          <CardDescription>Configure security settings and keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recaptchaSiteKey">reCAPTCHA Site Key</Label>
              <Input
                id="recaptchaSiteKey"
                value={settings.recaptchaSiteKey}
                onChange={(e) => setSettings({ ...settings, recaptchaSiteKey: e.target.value })}
                placeholder="6Lc..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recaptchaSecretKey">reCAPTCHA Secret Key</Label>
              <div className="relative">
                <Input
                  id="recaptchaSecretKey"
                  type={showSecrets ? "text" : "password"}
                  value={settings.recaptchaSecretKey}
                  onChange={(e) => setSettings({ ...settings, recaptchaSecretKey: e.target.value })}
                  placeholder="6Lc..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jwtSecret">JWT Secret</Label>
              <div className="relative">
                <Input
                  id="jwtSecret"
                  type={showSecrets ? "text" : "password"}
                  value={settings.jwtSecret}
                  onChange={(e) => setSettings({ ...settings, jwtSecret: e.target.value })}
                  placeholder="Enter JWT secret"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionSecret">Session Secret</Label>
              <div className="relative">
                <Input
                  id="sessionSecret"
                  type={showSecrets ? "text" : "password"}
                  value={settings.sessionSecret}
                  onChange={(e) => setSettings({ ...settings, sessionSecret: e.target.value })}
                  placeholder="Enter session secret"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="corsOrigins">CORS Origins</Label>
              <Input
                id="corsOrigins"
                value={settings.corsOrigins}
                onChange={(e) => setSettings({ ...settings, corsOrigins: e.target.value })}
                placeholder="https://example.com,https://app.example.com"
              />
              <p className="text-sm text-muted-foreground">Comma-separated list of allowed origins</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Third-party Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ExternalLink className="h-5 w-5" />
            <span>Third-party Integrations</span>
          </CardTitle>
          <CardDescription>Configure analytics and third-party services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
              <Input
                id="googleAnalyticsId"
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
              <Input
                id="googleTagManagerId"
                value={settings.googleTagManagerId}
                onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
                placeholder="GTM-XXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
              <Input
                id="facebookPixelId"
                value={settings.facebookPixelId}
                onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })}
                placeholder="XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotjarId">Hotjar ID</Label>
              <Input
                id="hotjarId"
                value={settings.hotjarId}
                onChange={(e) => setSettings({ ...settings, hotjarId: e.target.value })}
                placeholder="XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intercomAppId">Intercom App ID</Label>
              <Input
                id="intercomAppId"
                value={settings.intercomAppId}
                onChange={(e) => setSettings({ ...settings, intercomAppId: e.target.value })}
                placeholder="XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zendeskDomain">Zendesk Domain</Label>
              <Input
                id="zendeskDomain"
                value={settings.zendeskDomain}
                onChange={(e) => setSettings({ ...settings, zendeskDomain: e.target.value })}
                placeholder="company.zendesk.com"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="slackWebhookUrl">Slack Webhook URL</Label>
              <Input
                id="slackWebhookUrl"
                value={settings.slackWebhookUrl}
                onChange={(e) => setSettings({ ...settings, slackWebhookUrl: e.target.value })}
                placeholder="https://hooks.slack.com/services/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>API Configuration</span>
          </CardTitle>
          <CardDescription>Configure API settings and rate limiting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apiRateLimit">API Rate Limit</Label>
              <Input
                id="apiRateLimit"
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => setSettings({ ...settings, apiRateLimit: parseInt(e.target.value) })}
                min="1"
                max="10000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rateLimitWindow">Rate Limit Window (seconds)</Label>
              <Input
                id="rateLimitWindow"
                type="number"
                value={settings.rateLimitWindow}
                onChange={(e) => setSettings({ ...settings, rateLimitWindow: parseInt(e.target.value) })}
                min="60"
                max="3600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKeyExpiry">API Key Expiry (days)</Label>
              <Input
                id="apiKeyExpiry"
                type="number"
                value={settings.apiKeyExpiry}
                onChange={(e) => setSettings({ ...settings, apiKeyExpiry: parseInt(e.target.value) })}
                min="1"
                max="3650"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookTimeout">Webhook Timeout (seconds)</Label>
              <Input
                id="webhookTimeout"
                type="number"
                value={settings.webhookTimeout}
                onChange={(e) => setSettings({ ...settings, webhookTimeout: parseInt(e.target.value) })}
                min="5"
                max="300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxWebhookRetries">Max Webhook Retries</Label>
              <Input
                id="maxWebhookRetries"
                type="number"
                value={settings.maxWebhookRetries}
                onChange={(e) => setSettings({ ...settings, maxWebhookRetries: parseInt(e.target.value) })}
                min="0"
                max="10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Feature Flags</span>
          </CardTitle>
          <CardDescription>Enable or disable platform features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new user registrations</p>
              </div>
              <Switch
                checked={settings.enableUserRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, enableUserRegistration: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Verification</Label>
                <p className="text-sm text-muted-foreground">Require email verification</p>
              </div>
              <Switch
                checked={settings.enableEmailVerification}
                onCheckedChange={(checked) => setSettings({ ...settings, enableEmailVerification: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Enable 2FA for users</p>
              </div>
              <Switch
                checked={settings.enableTwoFactorAuth}
                onCheckedChange={(checked) => setSettings({ ...settings, enableTwoFactorAuth: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Social Login</Label>
                <p className="text-sm text-muted-foreground">Allow social media login</p>
              </div>
              <Switch
                checked={settings.enableSocialLogin}
                onCheckedChange={(checked) => setSettings({ ...settings, enableSocialLogin: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>File Upload</Label>
                <p className="text-sm text-muted-foreground">Allow file uploads</p>
              </div>
              <Switch
                checked={settings.enableFileUpload}
                onCheckedChange={(checked) => setSettings({ ...settings, enableFileUpload: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Real-time Chat</Label>
                <p className="text-sm text-muted-foreground">Enable real-time messaging</p>
              </div>
              <Switch
                checked={settings.enableRealTimeChat}
                onCheckedChange={(checked) => setSettings({ ...settings, enableRealTimeChat: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics</Label>
                <p className="text-sm text-muted-foreground">Enable usage analytics</p>
              </div>
              <Switch
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => setSettings({ ...settings, enableAnalytics: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable push notifications</p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="min-w-[120px]"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 