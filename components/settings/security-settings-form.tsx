"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { SecurityTest } from "./security-test"
import { AccessControlTest } from "./access-control-test"
import { 
  Shield, 
  Lock, 
  Key, 
  Users, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Fingerprint,
  Server,
  Globe,
  Mail,
  Loader2,
  Info,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getAuthHeaders } from "@/lib/auth-client"

interface SecuritySettings {
  // Authentication Settings
  requireEmailVerification: boolean
  requirePhoneVerification: boolean
  enableTwoFactorAuth: boolean
  allowSocialLogin: boolean
  sessionTimeout: string
  maxLoginAttempts: number
  lockoutDuration: string
  
  // Password Policy
  minPasswordLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  passwordExpiryDays: number
  
  // Access Control
  adminOnlyAccess: boolean
  ipWhitelist: string
  allowedDomains: string
  maxConcurrentSessions: number
  requireVPN: boolean
  geographicRestrictions: boolean
  
  // Security Headers
  enableCSP: boolean
  enableHSTS: boolean
  enableXSSProtection: boolean
  enableContentTypeOptions: boolean
  
  // API Security
  enableRateLimiting: boolean
  maxRequestsPerMinute: number
  enableAPIAuthentication: boolean
  requireAPIKey: boolean
  
  // Data Protection
  enableEncryption: boolean
  enableBackupEncryption: boolean
  dataRetentionDays: number
  enableAuditLogs: boolean
  
  // Compliance
  gdprCompliance: boolean
  ccpaCompliance: boolean
  hipaaCompliance: boolean
  soxCompliance: boolean
}

export function SecuritySettingsForm() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SecuritySettings>({
    // Authentication Settings
    requireEmailVerification: true,
    requirePhoneVerification: false,
    enableTwoFactorAuth: true,
    allowSocialLogin: true,
    sessionTimeout: "24h",
    maxLoginAttempts: 5,
    lockoutDuration: "15m",
    
    // Password Policy
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiryDays: 90,
    
    // Access Control
    adminOnlyAccess: false,
    ipWhitelist: "",
    allowedDomains: "",
    maxConcurrentSessions: 3,
    requireVPN: false,
    geographicRestrictions: false,
    
    // Security Headers
    enableCSP: true,
    enableHSTS: true,
    enableXSSProtection: true,
    enableContentTypeOptions: true,
    
    // API Security
    enableRateLimiting: true,
    maxRequestsPerMinute: 100,
    enableAPIAuthentication: true,
    requireAPIKey: true,
    
    // Data Protection
    enableEncryption: true,
    enableBackupEncryption: true,
    dataRetentionDays: 365,
    enableAuditLogs: true,
    
    // Compliance
    gdprCompliance: true,
    ccpaCompliance: false,
    hipaaCompliance: false,
    soxCompliance: false
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const { profile } = useAuth()

  // Load security settings on component mount
  useEffect(() => {
    loadSecuritySettings()
  }, [])

  const loadSecuritySettings = async () => {
    try {
      setLoading(true)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings/security', {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        toast({
          title: "Settings Loaded",
          description: "Security settings loaded successfully",
        })
      } else {
        console.error('Failed to load security settings')
        toast({
          title: "Error",
          description: "Failed to load security settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading security settings:', error)
      toast({
        title: "Error",
        description: "Failed to load security settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }

  const handleSave = async () => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can modify security settings.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/settings/security', {
        method: 'POST',
        headers,
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: result.message || "Security settings saved successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save security settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error saving security settings:', error)
      toast({
        title: "Error",
        description: "Failed to save security settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Enhanced toggle handler with immediate feedback
  const handleToggle = (key: keyof SecuritySettings, value: boolean) => {
    setSettings({ ...settings, [key]: value })
    
    // Provide immediate feedback for important toggles
    const toggleMessages: Record<string, { title: string; description: string }> = {
      enableRateLimiting: {
        title: value ? "Rate Limiting Enabled" : "Rate Limiting Disabled",
        description: value ? "API rate limiting is now active" : "API rate limiting has been disabled"
      },
      enableAPIAuthentication: {
        title: value ? "API Authentication Enabled" : "API Authentication Disabled",
        description: value ? "API authentication is now required" : "API authentication has been disabled"
      },
      requireAPIKey: {
        title: value ? "API Key Required" : "API Key Optional",
        description: value ? "API keys are now required for all requests" : "API keys are now optional"
      },
      enableEncryption: {
        title: value ? "Data Encryption Enabled" : "Data Encryption Disabled",
        description: value ? "Data encryption is now active" : "Data encryption has been disabled"
      },
      enableBackupEncryption: {
        title: value ? "Backup Encryption Enabled" : "Backup Encryption Disabled",
        description: value ? "Backup encryption is now active" : "Backup encryption has been disabled"
      },
      enableAuditLogs: {
        title: value ? "Audit Logging Enabled" : "Audit Logging Disabled",
        description: value ? "Comprehensive audit logging is now active" : "Audit logging has been disabled"
      },
      gdprCompliance: {
        title: value ? "GDPR Compliance Enabled" : "GDPR Compliance Disabled",
        description: value ? "GDPR data protection is now active" : "GDPR compliance has been disabled"
      },
      ccpaCompliance: {
        title: value ? "CCPA Compliance Enabled" : "CCPA Compliance Disabled",
        description: value ? "CCPA data protection is now active" : "CCPA compliance has been disabled"
      },
      hipaaCompliance: {
        title: value ? "HIPAA Compliance Enabled" : "HIPAA Compliance Disabled",
        description: value ? "HIPAA data protection is now active" : "HIPAA compliance has been disabled"
      },
      soxCompliance: {
        title: value ? "SOX Compliance Enabled" : "SOX Compliance Disabled",
        description: value ? "SOX compliance is now active" : "SOX compliance has been disabled"
      },
      // Security Headers
      enableCSP: {
        title: value ? "Content Security Policy Enabled" : "Content Security Policy Disabled",
        description: value ? "CSP header is now active - preventing XSS attacks" : "CSP header has been disabled - XSS protection reduced"
      },
      enableHSTS: {
        title: value ? "HSTS Enabled" : "HSTS Disabled",
        description: value ? "HSTS header is now active - forcing HTTPS connections" : "HSTS header has been disabled - HTTPS enforcement reduced"
      },
      enableXSSProtection: {
        title: value ? "XSS Protection Enabled" : "XSS Protection Disabled",
        description: value ? "XSS protection header is now active" : "XSS protection header has been disabled"
      },
      enableContentTypeOptions: {
        title: value ? "Content Type Options Enabled" : "Content Type Options Disabled",
        description: value ? "Content type options header is now active - preventing MIME sniffing" : "Content type options header has been disabled"
      }
    }

    const message = toggleMessages[key]
    if (message) {
      toast({
        title: message.title,
        description: message.description,
        variant: value ? "default" : "destructive"
      })
    }
  }

  // Enhanced input handler with validation
  const handleInputChange = (key: keyof SecuritySettings, value: string | number) => {
    setSettings({ ...settings, [key]: value })
    
    // Clear validation error when user starts typing
    if (validationErrors[key as string]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[key as string]
        return newErrors
      })
    }
  }

  const SecurityAlert = ({ type, title, description }: { type: "warning" | "info" | "success"; title: string; description: string }) => (
    <Alert className={type === "warning" ? "border-yellow-200 bg-yellow-50" : type === "info" ? "border-blue-200 bg-blue-50" : "border-green-200 bg-green-50"}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>{title}</strong> - {description}
      </AlertDescription>
    </Alert>
  )

  // Calculate security score
  const calculateSecurityScore = () => {
    let score = 0
    let total = 0
    
    // API Security (20%)
    if (settings.enableRateLimiting) score += 20
    if (settings.enableAPIAuthentication) score += 20
    if (settings.requireAPIKey) score += 20
    total += 60
    
    // Data Protection (20%)
    if (settings.enableEncryption) score += 20
    if (settings.enableBackupEncryption) score += 20
    if (settings.enableAuditLogs) score += 20
    total += 60
    
    // Security Headers (20%)
    if (settings.enableCSP) score += 20
    if (settings.enableHSTS) score += 20
    if (settings.enableXSSProtection) score += 20
    if (settings.enableContentTypeOptions) score += 20
    total += 80
    
    // Compliance (20%)
    if (settings.gdprCompliance) score += 20
    if (settings.ccpaCompliance) score += 20
    if (settings.hipaaCompliance) score += 20
    if (settings.soxCompliance) score += 20
    total += 80
    
    // Authentication (20%)
    if (settings.enableTwoFactorAuth) score += 20
    if (settings.requireEmailVerification) score += 20
    total += 40
    
    return Math.round((score / total) * 100)
  }

  const securityScore = calculateSecurityScore()

  return (
    <div className="space-y-6">
      {/* Security Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Security Score</p>
                <p className="text-sm text-muted-foreground">{securityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">API Security</p>
                <p className="text-sm text-muted-foreground">
                  {settings.enableRateLimiting && settings.enableAPIAuthentication ? "Active" : "Needs Attention"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Data Protection</p>
                <p className="text-sm text-muted-foreground">
                  {settings.enableEncryption && settings.enableAuditLogs ? "Active" : "Needs Attention"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Compliance</p>
                <p className="text-sm text-muted-foreground">
                  {settings.gdprCompliance ? "GDPR Active" : "Needs Setup"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {!settings.enableRateLimiting && (
        <SecurityAlert
          type="warning"
          title="Rate Limiting Disabled"
          description="API rate limiting is disabled. This may leave your API vulnerable to abuse."
        />
      )}
      
      {!settings.enableEncryption && (
        <SecurityAlert
          type="warning"
          title="Data Encryption Disabled"
          description="Data encryption is disabled. Sensitive data may not be properly protected."
        />
      )}
      
      {!settings.enableAuditLogs && (
        <SecurityAlert
          type="warning"
          title="Audit Logging Disabled"
          description="Audit logging is disabled. Security events will not be tracked."
        />
      )}
      
      {!settings.enableCSP && (
        <SecurityAlert
          type="warning"
          title="Content Security Policy Disabled"
          description="CSP header is disabled. This may leave your application vulnerable to XSS attacks."
        />
      )}
      
      {!settings.enableHSTS && (
        <SecurityAlert
          type="warning"
          title="HSTS Disabled"
          description="HSTS header is disabled. HTTPS enforcement may be bypassed."
        />
      )}

      {/* Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Authentication Settings</span>
          </CardTitle>
          <CardDescription>Configure user authentication and verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Verification</Label>
                <p className="text-sm text-muted-foreground">Require email verification for new users</p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => handleToggle('requireEmailVerification', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Phone Verification</Label>
                <p className="text-sm text-muted-foreground">Require phone verification for new users</p>
              </div>
              <Switch
                checked={settings.requirePhoneVerification}
                onCheckedChange={(checked) => handleToggle('requirePhoneVerification', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Enable 2FA for all users</p>
              </div>
              <Switch
                checked={settings.enableTwoFactorAuth}
                onCheckedChange={(checked) => handleToggle('enableTwoFactorAuth', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Social Login</Label>
                <p className="text-sm text-muted-foreground">Allow login with social providers</p>
              </div>
              <Switch
                checked={settings.allowSocialLogin}
                onCheckedChange={(checked) => handleToggle('allowSocialLogin', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout</Label>
              <Select value={settings.sessionTimeout} onValueChange={(value) => handleInputChange('sessionTimeout', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="8h">8 Hours</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                min="1"
                max="10"
                className={validationErrors.maxLoginAttempts ? "border-red-500" : ""}
              />
              {validationErrors.maxLoginAttempts && (
                <p className="text-sm text-red-500">{validationErrors.maxLoginAttempts}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lockoutDuration">Lockout Duration</Label>
              <Select value={settings.lockoutDuration} onValueChange={(value) => handleInputChange('lockoutDuration', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="30m">30 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Fingerprint className="h-5 w-5" />
            <span>Password Policy</span>
          </CardTitle>
          <CardDescription>Configure password requirements and policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minPasswordLength">Minimum Password Length</Label>
              <Input
                id="minPasswordLength"
                type="number"
                value={settings.minPasswordLength}
                onChange={(e) => handleInputChange('minPasswordLength', parseInt(e.target.value))}
                min="6"
                max="32"
                className={validationErrors.minPasswordLength ? "border-red-500" : ""}
              />
              {validationErrors.minPasswordLength && (
                <p className="text-sm text-red-500">{validationErrors.minPasswordLength}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordExpiryDays">Password Expiry (Days)</Label>
              <Input
                id="passwordExpiryDays"
                type="number"
                value={settings.passwordExpiryDays}
                onChange={(e) => handleInputChange('passwordExpiryDays', parseInt(e.target.value))}
                min="0"
                max="365"
                className={validationErrors.passwordExpiryDays ? "border-red-500" : ""}
              />
              {validationErrors.passwordExpiryDays && (
                <p className="text-sm text-red-500">{validationErrors.passwordExpiryDays}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Uppercase</Label>
                <p className="text-sm text-muted-foreground">Require uppercase letters</p>
              </div>
              <Switch
                checked={settings.requireUppercase}
                onCheckedChange={(checked) => handleToggle('requireUppercase', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Lowercase</Label>
                <p className="text-sm text-muted-foreground">Require lowercase letters</p>
              </div>
              <Switch
                checked={settings.requireLowercase}
                onCheckedChange={(checked) => handleToggle('requireLowercase', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Numbers</Label>
                <p className="text-sm text-muted-foreground">Require numeric characters</p>
              </div>
              <Switch
                checked={settings.requireNumbers}
                onCheckedChange={(checked) => handleToggle('requireNumbers', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Special Characters</Label>
                <p className="text-sm text-muted-foreground">Require special characters</p>
              </div>
              <Switch
                checked={settings.requireSpecialChars}
                onCheckedChange={(checked) => handleToggle('requireSpecialChars', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Access Control</span>
          </CardTitle>
          <CardDescription>Configure access restrictions and session limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Admin Only Access</Label>
                <p className="text-sm text-muted-foreground">Restrict access to admin users only</p>
              </div>
              <Switch
                checked={settings.adminOnlyAccess}
                onCheckedChange={(checked) => handleToggle('adminOnlyAccess', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipWhitelist">IP Whitelist</Label>
              <Input
                id="ipWhitelist"
                placeholder="192.168.1.1, 10.0.0.0/24"
                value={settings.ipWhitelist}
                onChange={(e) => handleInputChange('ipWhitelist', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Comma-separated IP addresses or CIDR ranges</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowedDomains">Allowed Domains</Label>
              <Input
                id="allowedDomains"
                placeholder="example.com, company.org"
                value={settings.allowedDomains}
                onChange={(e) => handleInputChange('allowedDomains', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Comma-separated domain names</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxConcurrentSessions">Max Concurrent Sessions</Label>
              <Input
                id="maxConcurrentSessions"
                type="number"
                value={settings.maxConcurrentSessions}
                onChange={(e) => handleInputChange('maxConcurrentSessions', parseInt(e.target.value))}
                min="1"
                max="10"
                className={validationErrors.maxConcurrentSessions ? "border-red-500" : ""}
              />
              {validationErrors.maxConcurrentSessions && (
                <p className="text-sm text-red-500">{validationErrors.maxConcurrentSessions}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require VPN</Label>
                <p className="text-sm text-muted-foreground">Require VPN connection for access</p>
              </div>
              <Switch
                checked={settings.requireVPN}
                onCheckedChange={(checked) => handleToggle('requireVPN', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Geographic Restrictions</Label>
                <p className="text-sm text-muted-foreground">Restrict access by geographic location</p>
              </div>
              <Switch
                checked={settings.geographicRestrictions}
                onCheckedChange={(checked) => handleToggle('geographicRestrictions', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Headers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Headers</span>
          </CardTitle>
          <CardDescription>Configure HTTP security headers to protect against common web vulnerabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Content Security Policy (CSP)</Label>
                <p className="text-sm text-muted-foreground">Prevent XSS attacks by controlling resource loading</p>
              </div>
              <Switch
                checked={settings.enableCSP}
                onCheckedChange={(checked) => handleToggle('enableCSP', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>HTTP Strict Transport Security (HSTS)</Label>
                <p className="text-sm text-muted-foreground">Force HTTPS connections and prevent downgrade attacks</p>
              </div>
              <Switch
                checked={settings.enableHSTS}
                onCheckedChange={(checked) => handleToggle('enableHSTS', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>XSS Protection</Label>
                <p className="text-sm text-muted-foreground">Enable XSS protection headers for additional security</p>
              </div>
              <Switch
                checked={settings.enableXSSProtection}
                onCheckedChange={(checked) => handleToggle('enableXSSProtection', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Content Type Options</Label>
                <p className="text-sm text-muted-foreground">Prevent MIME type sniffing attacks</p>
              </div>
              <Switch
                checked={settings.enableContentTypeOptions}
                onCheckedChange={(checked) => handleToggle('enableContentTypeOptions', checked)}
              />
            </div>
          </div>
          
          {/* Security Headers Status */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">Security Headers Status</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${settings.enableCSP ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>CSP: {settings.enableCSP ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${settings.enableHSTS ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>HSTS: {settings.enableHSTS ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${settings.enableXSSProtection ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>XSS Protection: {settings.enableXSSProtection ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${settings.enableContentTypeOptions ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>Content Type: {settings.enableContentTypeOptions ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>API Security</span>
          </CardTitle>
          <CardDescription>Configure API access and rate limiting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">Enable API rate limiting</p>
              </div>
              <Switch
                checked={settings.enableRateLimiting}
                onCheckedChange={(checked) => handleToggle('enableRateLimiting', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>API Authentication</Label>
                <p className="text-sm text-muted-foreground">Require authentication for API access</p>
              </div>
              <Switch
                checked={settings.enableAPIAuthentication}
                onCheckedChange={(checked) => handleToggle('enableAPIAuthentication', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require API Key</Label>
                <p className="text-sm text-muted-foreground">Require API key for all requests</p>
              </div>
              <Switch
                checked={settings.requireAPIKey}
                onCheckedChange={(checked) => handleToggle('requireAPIKey', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRequestsPerMinute">Max Requests per Minute</Label>
              <Input
                id="maxRequestsPerMinute"
                type="number"
                value={settings.maxRequestsPerMinute}
                onChange={(e) => handleInputChange('maxRequestsPerMinute', parseInt(e.target.value))}
                min="10"
                max="1000"
                className={validationErrors.maxRequestsPerMinute ? "border-red-500" : ""}
              />
              {validationErrors.maxRequestsPerMinute && (
                <p className="text-sm text-red-500">{validationErrors.maxRequestsPerMinute}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Data Protection</span>
          </CardTitle>
          <CardDescription>Configure data encryption and retention policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Data Encryption</Label>
                <p className="text-sm text-muted-foreground">Encrypt data at rest</p>
              </div>
              <Switch
                checked={settings.enableEncryption}
                onCheckedChange={(checked) => handleToggle('enableEncryption', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup Encryption</Label>
                <p className="text-sm text-muted-foreground">Encrypt backup files</p>
              </div>
              <Switch
                checked={settings.enableBackupEncryption}
                onCheckedChange={(checked) => handleToggle('enableBackupEncryption', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Audit Logs</Label>
                <p className="text-sm text-muted-foreground">Enable comprehensive audit logging</p>
              </div>
              <Switch
                checked={settings.enableAuditLogs}
                onCheckedChange={(checked) => handleToggle('enableAuditLogs', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataRetentionDays">Data Retention (Days)</Label>
              <Input
                id="dataRetentionDays"
                type="number"
                value={settings.dataRetentionDays}
                onChange={(e) => handleInputChange('dataRetentionDays', parseInt(e.target.value))}
                min="30"
                max="3650"
                className={validationErrors.dataRetentionDays ? "border-red-500" : ""}
              />
              {validationErrors.dataRetentionDays && (
                <p className="text-sm text-red-500">{validationErrors.dataRetentionDays}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Compliance</span>
          </CardTitle>
          <CardDescription>Configure regulatory compliance settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>GDPR Compliance</Label>
                <p className="text-sm text-muted-foreground">Enable GDPR data protection</p>
              </div>
              <Switch
                checked={settings.gdprCompliance}
                onCheckedChange={(checked) => handleToggle('gdprCompliance', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>CCPA Compliance</Label>
                <p className="text-sm text-muted-foreground">Enable CCPA data protection</p>
              </div>
              <Switch
                checked={settings.ccpaCompliance}
                onCheckedChange={(checked) => handleToggle('ccpaCompliance', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>HIPAA Compliance</Label>
                <p className="text-sm text-muted-foreground">Enable HIPAA data protection</p>
              </div>
              <Switch
                checked={settings.hipaaCompliance}
                onCheckedChange={(checked) => handleToggle('hipaaCompliance', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SOX Compliance</Label>
                <p className="text-sm text-muted-foreground">Enable SOX compliance</p>
              </div>
              <Switch
                checked={settings.soxCompliance}
                onCheckedChange={(checked) => handleToggle('soxCompliance', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {saving && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Security Settings Saved
            </Badge>
          )}
          {Object.keys(validationErrors).length > 0 && (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              {Object.keys(validationErrors).length} Validation Error{Object.keys(validationErrors).length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadSecuritySettings} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving || loading || Object.keys(validationErrors).length > 0}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Security Settings"}
          </Button>
        </div>
      </div>

      {/* Security Test Component */}
      <SecurityTest />
      
      {/* Access Control Test Component */}
      <AccessControlTest />
    </div>
  )
} 