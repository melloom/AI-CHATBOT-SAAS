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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { 
  Wrench, 
  AlertTriangle, 
  Users, 
  Globe,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info,
  Bell,
  Settings,
  Server,
  Database,
  Zap,
  CalendarIcon,
  Clock,
  Eye,
  ExternalLink,
  Shield,
  Key,
  FileText
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function MaintenanceSettingsForm() {
  const [settings, setSettings] = useState({
    // Maintenance Mode
    maintenanceMode: false,
    maintenanceMessage: "We're performing scheduled maintenance. Please check back soon.",
    maintenanceTitle: "Scheduled Maintenance",
    maintenanceSubtitle: "We're working to improve your experience",
    maintenanceImage: "",
    maintenanceTheme: "dark",
    
    // Scheduled Maintenance
    scheduledMaintenance: false,
    maintenanceStartDate: new Date(),
    maintenanceStartTime: "02:00",
    maintenanceDuration: "2h",
    maintenanceType: "planned",
    
    // Access Control
    allowAdminAccess: true,
    allowWhitelistedIPs: false,
    whitelistedIPs: "",
    maintenanceBypassCode: "",
    
    // Notifications
    notifyUsersBeforeMaintenance: true,
    notificationAdvanceHours: 24,
    notifyUsersAfterMaintenance: true,
    sendEmailNotifications: true,
    sendSMSNotifications: false,
    
    // Maintenance Page Customization
    showProgressBar: true,
    showEstimatedTime: true,
    showContactInfo: true,
    showSocialLinks: true,
    customCSS: "",
    customJS: "",
    
    // System Maintenance
    autoBackupBeforeMaintenance: true,
    clearCacheAfterMaintenance: true,
    restartServicesAfterMaintenance: false,
    runHealthChecksAfterMaintenance: true,
    
    // Contact Information
    contactEmail: "support@chathub.ai",
    contactPhone: "+1 (555) 123-4567",
    statusPageUrl: "",
    
    // New fields
    logAccessAttempts: false
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [maintenanceActive, setMaintenanceActive] = useState(false)

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('maintenanceSettings')
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsedSettings }))
      } catch (error) {
        console.error('Error loading maintenance settings:', error)
      }
    }
  }, [])

  // Enhanced toggle function with validation
  const handleToggle = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Show immediate feedback
    toast({
      title: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${value ? 'Enabled' : 'Disabled'}`,
      description: value ? 'This feature is now active' : 'This feature is now disabled',
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Validate settings
      const errors = []
      
      if (settings.scheduledMaintenance) {
        if (!settings.maintenanceStartDate) {
          errors.push("Maintenance start date is required")
        }
        if (!settings.maintenanceStartTime) {
          errors.push("Maintenance start time is required")
        }
        if (!settings.maintenanceDuration) {
          errors.push("Maintenance duration is required")
        }
      }
      
      if (settings.notifyUsersBeforeMaintenance && settings.notificationAdvanceHours < 1) {
        errors.push("Advance notification hours must be at least 1")
      }
      
      if (settings.allowWhitelistedIPs && !settings.whitelistedIPs.trim()) {
        errors.push("Whitelisted IP addresses are required when enabled")
      }
      
      if (errors.length > 0) {
        toast({
          title: "Validation Error",
          description: errors.join(", "),
          variant: "destructive"
        })
        return
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage for persistence
      localStorage.setItem('maintenanceSettings', JSON.stringify(settings))
      
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      
      toast({
        title: "Success",
        description: "Maintenance settings saved successfully!",
      })
    } catch (error) {
      console.error('Error saving maintenance settings:', error)
      toast({
        title: "Error",
        description: "Failed to save maintenance settings",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  const handleToggleMaintenance = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setMaintenanceActive(!maintenanceActive)
    setLoading(false)
  }

  const MaintenanceAlert = ({ type, title, description }: { type: "warning" | "info" | "success"; title: string; description: string }) => (
    <Alert className={type === "warning" ? "border-yellow-200 bg-yellow-50" : type === "info" ? "border-blue-200 bg-blue-50" : "border-green-200 bg-green-50"}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>{title}</strong> - {description}
      </AlertDescription>
    </Alert>
  )

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Button
          variant={maintenanceActive ? "destructive" : "default"}
          onClick={handleToggleMaintenance}
          disabled={loading}
          className="h-auto p-4 flex flex-col items-center space-y-2"
        >
          <Wrench className="h-6 w-6" />
          <span>{maintenanceActive ? "Disable Maintenance" : "Enable Maintenance"}</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={loading}
          className="h-auto p-4 flex flex-col items-center space-y-2"
        >
          <Save className="h-6 w-6" />
          <span>Save Settings</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.location.href = "/maintenance"}
          className="h-auto p-4 flex flex-col items-center space-y-2"
        >
          <Eye className="h-6 w-6" />
          <span>Preview Page</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setSettings({ ...settings, scheduledMaintenance: !settings.scheduledMaintenance })}
          className="h-auto p-4 flex flex-col items-center space-y-2"
        >
          <CalendarIcon className="h-6 w-6" />
          <span>Schedule Maintenance</span>
        </Button>
      </div>

      {/* Status Alert */}
      {maintenanceActive && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Maintenance mode is currently active. Users will see the maintenance page.
          </AlertDescription>
        </Alert>
      )}

      {saved && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Maintenance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wrench className="h-5 w-5" />
            <span>Maintenance Status</span>
          </CardTitle>
          <CardDescription>Current maintenance mode status and controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {maintenanceActive ? (
                <XCircle className="h-6 w-6 text-red-500" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
              <div>
                <p className="font-medium">
                  {maintenanceActive ? "Maintenance Mode Active" : "System Online"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {maintenanceActive 
                    ? "Platform is currently under maintenance" 
                    : "All systems are operational"
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Maintenance Mode Settings</span>
          </CardTitle>
          <CardDescription>Configure maintenance page appearance and behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Templates */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Quick Templates</h4>
            <div className="grid gap-2 md:grid-cols-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSettings({
                    ...settings,
                    maintenanceTitle: "Scheduled Maintenance",
                    maintenanceSubtitle: "We're working to improve your experience",
                    maintenanceMessage: "We're performing scheduled maintenance to enhance our platform. Please check back soon.",
                    maintenanceTheme: "dark"
                  })
                  toast({
                    title: "Template Applied",
                    description: "Standard maintenance template applied",
                  })
                }}
                className="h-auto p-3 flex flex-col items-center space-y-1"
              >
                <Wrench className="h-4 w-4" />
                <span className="text-xs">Standard</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSettings({
                    ...settings,
                    maintenanceTitle: "Emergency Maintenance",
                    maintenanceSubtitle: "We're addressing a critical issue",
                    maintenanceMessage: "We're currently performing emergency maintenance to resolve a critical issue. We apologize for the inconvenience and are working to restore service as quickly as possible.",
                    maintenanceTheme: "dark"
                  })
                  toast({
                    title: "Template Applied",
                    description: "Emergency maintenance template applied",
                  })
                }}
                className="h-auto p-3 flex flex-col items-center space-y-1"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs">Emergency</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSettings({
                    ...settings,
                    maintenanceTitle: "System Upgrade",
                    maintenanceSubtitle: "We're upgrading our systems",
                    maintenanceMessage: "We're performing a system upgrade to bring you new features and improved performance. This maintenance is expected to be completed shortly.",
                    maintenanceTheme: "light"
                  })
                  toast({
                    title: "Template Applied",
                    description: "System upgrade template applied",
                  })
                }}
                className="h-auto p-3 flex flex-col items-center space-y-1"
              >
                <Zap className="h-4 w-4" />
                <span className="text-xs">Upgrade</span>
              </Button>
            </div>
          </div>

          {/* Basic Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Page Content</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maintenanceTitle">Maintenance Title</Label>
                <Input
                  id="maintenanceTitle"
                  value={settings.maintenanceTitle}
                  onChange={(e) => setSettings({ ...settings, maintenanceTitle: e.target.value })}
                  placeholder="Scheduled Maintenance"
                />
                <p className="text-xs text-muted-foreground">
                  {settings.maintenanceTitle.length}/50 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceSubtitle">Maintenance Subtitle</Label>
                <Input
                  id="maintenanceSubtitle"
                  value={settings.maintenanceSubtitle}
                  onChange={(e) => setSettings({ ...settings, maintenanceSubtitle: e.target.value })}
                  placeholder="We're working to improve your experience"
                />
                <p className="text-xs text-muted-foreground">
                  {settings.maintenanceSubtitle.length}/100 characters
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
              <Textarea
                id="maintenanceMessage"
                value={settings.maintenanceMessage}
                onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                placeholder="We're performing scheduled maintenance. Please check back soon."
                rows={4}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {settings.maintenanceMessage.length}/500 characters
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(settings.maintenanceMessage)
                    toast({
                      title: "Message Copied",
                      description: "Maintenance message copied to clipboard",
                    })
                  }}
                >
                  Copy Message
                </Button>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Appearance</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maintenanceTheme">Maintenance Page Theme</Label>
                <Select value={settings.maintenanceTheme} onValueChange={(value) => setSettings({ ...settings, maintenanceTheme: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark Theme</SelectItem>
                    <SelectItem value="light">Light Theme</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose the visual theme for the maintenance page
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceImage">Custom Image URL (Optional)</Label>
                <Input
                  id="maintenanceImage"
                  value={settings.maintenanceImage}
                  onChange={(e) => setSettings({ ...settings, maintenanceImage: e.target.value })}
                  placeholder="https://example.com/maintenance-image.png"
                />
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSettings({ ...settings, maintenanceImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop" })
                      toast({
                        title: "Default Image Set",
                        description: "Default maintenance image applied",
                      })
                    }}
                  >
                    Use Default
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSettings({ ...settings, maintenanceImage: "" })
                      toast({
                        title: "Image Removed",
                        description: "Custom image has been removed",
                      })
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Page Features */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Page Features</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Show Progress Bar</Label>
                  <p className="text-sm text-muted-foreground">Display maintenance progress</p>
                </div>
                <Switch
                  checked={settings.showProgressBar}
                  onCheckedChange={(checked) => handleToggle('showProgressBar', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Show Estimated Time</Label>
                  <p className="text-sm text-muted-foreground">Display estimated completion time</p>
                </div>
                <Switch
                  checked={settings.showEstimatedTime}
                  onCheckedChange={(checked) => handleToggle('showEstimatedTime', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Show Contact Info</Label>
                  <p className="text-sm text-muted-foreground">Display contact information</p>
                </div>
                <Switch
                  checked={settings.showContactInfo}
                  onCheckedChange={(checked) => handleToggle('showContactInfo', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Show Social Links</Label>
                  <p className="text-sm text-muted-foreground">Display social media links</p>
                </div>
                <Switch
                  checked={settings.showSocialLinks}
                  onCheckedChange={(checked) => handleToggle('showSocialLinks', checked)}
                />
              </div>
            </div>
          </div>

          {/* Custom Code */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Custom Code (Advanced)</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customCSS">Custom CSS</Label>
                <Textarea
                  id="customCSS"
                  value={settings.customCSS}
                  onChange={(e) => setSettings({ ...settings, customCSS: e.target.value })}
                  placeholder="/* Add custom CSS styles here */"
                  rows={4}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">Add custom CSS to style the maintenance page</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customJS">Custom JavaScript</Label>
                <Textarea
                  id="customJS"
                  value={settings.customJS}
                  onChange={(e) => setSettings({ ...settings, customJS: e.target.value })}
                  placeholder="// Add custom JavaScript here"
                  rows={4}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">Add custom JavaScript functionality</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Contact Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Support Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail || "support@chathub.ai"}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="support@chathub.ai"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Support Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={settings.contactPhone || "+1 (555) 123-4567"}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusPageUrl">Status Page URL (Optional)</Label>
              <Input
                id="statusPageUrl"
                type="url"
                value={settings.statusPageUrl || ""}
                onChange={(e) => setSettings({ ...settings, statusPageUrl: e.target.value })}
                placeholder="https://status.chathub.ai"
              />
              <p className="text-sm text-muted-foreground">Link to your status page for real-time updates</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarComponent className="h-5 w-5" />
            <span>Scheduled Maintenance</span>
          </CardTitle>
          <CardDescription>Schedule future maintenance windows</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Scheduled Maintenance</Label>
              <p className="text-sm text-muted-foreground">Automatically enable maintenance at scheduled time</p>
            </div>
            <Switch
              checked={settings.scheduledMaintenance}
              onCheckedChange={(checked) => handleToggle('scheduledMaintenance', checked)}
            />
          </div>
          {settings.scheduledMaintenance && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(settings.maintenanceStartDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" side="bottom">
                      <CalendarComponent
                        mode="single"
                        selected={settings.maintenanceStartDate}
                        onSelect={(date: Date | undefined) => date && setSettings({ ...settings, maintenanceStartDate: date })}
                        initialFocus
                        className="rounded-md border"
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceStartTime">Start Time</Label>
                  <Input
                    id="maintenanceStartTime"
                    type="time"
                    value={settings.maintenanceStartTime}
                    onChange={(e) => setSettings({ ...settings, maintenanceStartTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceDuration">Duration</Label>
                  <Select value={settings.maintenanceDuration} onValueChange={(value) => setSettings({ ...settings, maintenanceDuration: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30m">30 minutes</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="2h">2 hours</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="8h">8 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceType">Maintenance Type</Label>
                  <Select value={settings.maintenanceType} onValueChange={(value) => setSettings({ ...settings, maintenanceType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned Maintenance</SelectItem>
                      <SelectItem value="emergency">Emergency Maintenance</SelectItem>
                      <SelectItem value="upgrade">System Upgrade</SelectItem>
                      <SelectItem value="security">Security Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant={settings.maintenanceType === 'emergency' ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => setSettings({ ...settings, maintenanceType: 'emergency' })}
                    >
                      High
                    </Button>
                    <Button
                      variant={settings.maintenanceType === 'planned' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSettings({ ...settings, maintenanceType: 'planned' })}
                    >
                      Normal
                    </Button>
                    <Button
                      variant={settings.maintenanceType === 'upgrade' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setSettings({ ...settings, maintenanceType: 'upgrade' })}
                    >
                      Low
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Maintenance Schedule Preview */}
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Maintenance Schedule Preview</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Start:</strong> {format(settings.maintenanceStartDate, "PPP")} at {settings.maintenanceStartTime}</p>
                  <p><strong>Duration:</strong> {settings.maintenanceDuration}</p>
                  <p><strong>Type:</strong> {settings.maintenanceType === 'planned' ? 'Planned Maintenance' : 'Emergency Maintenance'}</p>
                  {settings.notifyUsersBeforeMaintenance && (
                    <p><strong>Advance Notice:</strong> {settings.notificationAdvanceHours} hours before</p>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Access Control</span>
          </CardTitle>
          <CardDescription>Configure who can access the platform during maintenance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Admin Access */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Admin Access</h4>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Label className="text-base">Allow Admin Access</Label>
                  <Badge variant={settings.allowAdminAccess ? "default" : "secondary"}>
                    {settings.allowAdminAccess ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Admins can bypass maintenance mode and access the platform normally
                </p>
                {settings.allowAdminAccess && (
                  <p className="text-xs text-green-600">
                    ✓ Admin users will have full access during maintenance
                  </p>
                )}
              </div>
              <Switch
                checked={settings.allowAdminAccess}
                onCheckedChange={(checked) => handleToggle('allowAdminAccess', checked)}
              />
            </div>
          </div>

          {/* IP Whitelist */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">IP Address Control</h4>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Label className="text-base">Allow Whitelisted IPs</Label>
                  <Badge variant={settings.allowWhitelistedIPs ? "default" : "secondary"}>
                    {settings.allowWhitelistedIPs ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Allow specific IP addresses or ranges to access during maintenance
                </p>
                {settings.allowWhitelistedIPs && (
                  <p className="text-xs text-blue-600">
                    ✓ Whitelisted IPs will bypass maintenance restrictions
                  </p>
                )}
              </div>
              <Switch
                checked={settings.allowWhitelistedIPs}
                onCheckedChange={(checked) => handleToggle('allowWhitelistedIPs', checked)}
              />
            </div>
            
            {settings.allowWhitelistedIPs && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <Label htmlFor="whitelistedIPs">Whitelisted IP Addresses</Label>
                  <Textarea
                    id="whitelistedIPs"
                    value={settings.whitelistedIPs}
                    onChange={(e) => setSettings({ ...settings, whitelistedIPs: e.target.value })}
                    placeholder="192.168.1.1&#10;10.0.0.0/8&#10;172.16.0.0/12&#10;203.0.113.0/24"
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Enter one IP address or CIDR range per line
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentIP = "192.168.1.100" // This would be detected from the request
                        setSettings({ 
                          ...settings, 
                          whitelistedIPs: settings.whitelistedIPs 
                            ? `${settings.whitelistedIPs}\n${currentIP}` 
                            : currentIP 
                        })
                        toast({
                          title: "Current IP Added",
                          description: `Added ${currentIP} to whitelist`,
                        })
                      }}
                    >
                      Add Current IP
                    </Button>
                  </div>
                </div>
                
                {/* IP Validation */}
                {settings.whitelistedIPs && (
                  <div className="space-y-2">
                    <Label className="text-sm">IP Validation</Label>
                    <div className="space-y-1">
                      {settings.whitelistedIPs.split('\n').filter(ip => ip.trim()).map((ip, index) => {
                        const isValid = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip.trim()) ||
                                       /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(?:3[0-2]|[12]?[0-9])$/.test(ip.trim())
                        return (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            {isValid ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className={isValid ? "text-green-700" : "text-red-700"}>
                              {ip.trim()}
                            </span>
                            {!isValid && (
                              <span className="text-red-500 text-xs">Invalid format</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Emergency Bypass */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Emergency Access</h4>
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="maintenanceBypassCode">Maintenance Bypass Code</Label>
                <div className="flex space-x-2">
                  <Input
                    id="maintenanceBypassCode"
                    value={settings.maintenanceBypassCode}
                    onChange={(e) => setSettings({ ...settings, maintenanceBypassCode: e.target.value })}
                    placeholder="Enter bypass code for emergency access"
                    type="password"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
                      setSettings({ ...settings, maintenanceBypassCode: code })
                      toast({
                        title: "Bypass Code Generated",
                        description: `Generated code: ${code}`,
                      })
                    }}
                  >
                    Generate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSettings({ ...settings, maintenanceBypassCode: "" })
                      toast({
                        title: "Bypass Code Cleared",
                        description: "Emergency bypass code has been cleared",
                      })
                    }}
                  >
                    Clear
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Code to bypass maintenance mode for emergency access (optional)
                </p>
                {settings.maintenanceBypassCode && (
                  <div className="flex items-center space-x-2 text-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Keep this code secure - it provides emergency access</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Access Logging */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Access Logging</h4>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Label className="text-base">Log Access Attempts</Label>
                  <Badge variant={settings.logAccessAttempts ? "default" : "secondary"}>
                    {settings.logAccessAttempts ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Log all access attempts during maintenance for security monitoring
                </p>
              </div>
              <Switch
                checked={settings.logAccessAttempts}
                onCheckedChange={(checked) => handleToggle('logAccessAttempts', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Summary</span>
          </CardTitle>
          <CardDescription>Current access control configuration overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin Access</span>
                </div>
                <Badge variant={settings.allowAdminAccess ? "default" : "secondary"}>
                  {settings.allowAdminAccess ? "Allowed" : "Blocked"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">IP Whitelist</span>
                </div>
                <Badge variant={settings.allowWhitelistedIPs ? "default" : "secondary"}>
                  {settings.allowWhitelistedIPs ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span className="text-sm font-medium">Bypass Code</span>
                </div>
                <Badge variant={settings.maintenanceBypassCode ? "default" : "secondary"}>
                  {settings.maintenanceBypassCode ? "Set" : "Not Set"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Access Logging</span>
                </div>
                <Badge variant={settings.logAccessAttempts ? "default" : "secondary"}>
                  {settings.logAccessAttempts ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Security Level</span>
                </div>
                <Badge variant={
                  settings.allowAdminAccess && settings.allowWhitelistedIPs 
                    ? "destructive" 
                    : settings.allowAdminAccess 
                    ? "default" 
                    : "secondary"
                }>
                  {settings.allowAdminAccess && settings.allowWhitelistedIPs 
                    ? "High Access" 
                    : settings.allowAdminAccess 
                    ? "Admin Only" 
                    : "Restricted"
                  }
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Whitelisted IPs</span>
                </div>
                <Badge variant="outline">
                  {settings.whitelistedIPs ? 
                    settings.whitelistedIPs.split('\n').filter(ip => ip.trim()).length : 
                    0
                  } IPs
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Security Recommendations */}
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Security Recommendations</h4>
                <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                  {!settings.logAccessAttempts && (
                    <li>• Enable access logging for security monitoring</li>
                  )}
                  {settings.allowWhitelistedIPs && !settings.whitelistedIPs.trim() && (
                    <li>• Add specific IP addresses to the whitelist</li>
                  )}
                  {!settings.maintenanceBypassCode && (
                    <li>• Set a bypass code for emergency access</li>
                  )}
                  {settings.allowAdminAccess && settings.allowWhitelistedIPs && (
                    <li>• Consider restricting access to admin only for higher security</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>Configure maintenance notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notify Users Before Maintenance</Label>
                <p className="text-sm text-muted-foreground">Send advance notification to users</p>
              </div>
              <Switch
                checked={settings.notifyUsersBeforeMaintenance}
                onCheckedChange={(checked) => handleToggle('notifyUsersBeforeMaintenance', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notify Users After Maintenance</Label>
                <p className="text-sm text-muted-foreground">Send completion notification to users</p>
              </div>
              <Switch
                checked={settings.notifyUsersAfterMaintenance}
                onCheckedChange={(checked) => handleToggle('notifyUsersAfterMaintenance', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send maintenance notifications via email</p>
              </div>
              <Switch
                checked={settings.sendEmailNotifications}
                onCheckedChange={(checked) => handleToggle('sendEmailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send maintenance notifications via SMS</p>
              </div>
              <Switch
                checked={settings.sendSMSNotifications}
                onCheckedChange={(checked) => handleToggle('sendSMSNotifications', checked)}
              />
            </div>
          </div>
          {settings.notifyUsersBeforeMaintenance && (
            <div className="space-y-2">
              <Label htmlFor="notificationAdvanceHours">Advance Notification (Hours)</Label>
              <Input
                id="notificationAdvanceHours"
                type="number"
                value={settings.notificationAdvanceHours}
                onChange={(e) => setSettings({ ...settings, notificationAdvanceHours: parseInt(e.target.value) })}
                min="1"
                max="168"
              />
              <p className="text-sm text-muted-foreground">How many hours before maintenance to notify users</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>System Maintenance</span>
          </CardTitle>
          <CardDescription>Configure system maintenance tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Backup Before Maintenance</Label>
                <p className="text-sm text-muted-foreground">Create backup before maintenance starts</p>
              </div>
              <Switch
                checked={settings.autoBackupBeforeMaintenance}
                onCheckedChange={(checked) => handleToggle('autoBackupBeforeMaintenance', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Clear Cache After Maintenance</Label>
                <p className="text-sm text-muted-foreground">Clear system cache after maintenance</p>
              </div>
              <Switch
                checked={settings.clearCacheAfterMaintenance}
                onCheckedChange={(checked) => handleToggle('clearCacheAfterMaintenance', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Restart Services After Maintenance</Label>
                <p className="text-sm text-muted-foreground">Restart system services after maintenance</p>
              </div>
              <Switch
                checked={settings.restartServicesAfterMaintenance}
                onCheckedChange={(checked) => handleToggle('restartServicesAfterMaintenance', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Run Health Checks After Maintenance</Label>
                <p className="text-sm text-muted-foreground">Verify system health after maintenance</p>
              </div>
              <Switch
                checked={settings.runHealthChecksAfterMaintenance}
                onCheckedChange={(checked) => handleToggle('runHealthChecksAfterMaintenance', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Page Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Maintenance Page Preview</span>
          </CardTitle>
          <CardDescription>Preview how your maintenance page will appear to users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary/20">
                  <Wrench className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {settings.maintenanceTitle || "Scheduled Maintenance"}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {settings.maintenanceSubtitle || "We're working to improve your experience"}
                </p>
                <p className="text-sm leading-relaxed max-w-md mx-auto">
                  {settings.maintenanceMessage || "We're performing scheduled maintenance. Please check back soon."}
                </p>
              </div>

              {settings.showProgressBar && (
                <div className="max-w-xs mx-auto space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              )}

              {settings.showEstimatedTime && (
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Estimated completion: 2 hours</span>
                </div>
              )}

              {settings.showContactInfo && (
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="text-muted-foreground">Need help? Contact us:</span>
                  <a href={`mailto:${settings.contactEmail || 'support@chathub.ai'}`} className="text-primary hover:underline">
                    {settings.contactEmail || 'support@chathub.ai'}
                  </a>
                </div>
              )}

              {settings.statusPageUrl && (
                <div className="flex items-center justify-center">
                  <Button variant="link" size="sm" className="text-primary">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Status Page
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => window.open('/maintenance', '_blank')}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>View Full Preview</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Content Validation</span>
          </CardTitle>
          <CardDescription>Validate your maintenance page content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Title Validation</Label>
                <div className="flex items-center space-x-2">
                  {settings.maintenanceTitle.length > 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {settings.maintenanceTitle.length > 0 ? "Valid" : "Required"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {settings.maintenanceTitle.length}/50 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Subtitle Validation</Label>
                <div className="flex items-center space-x-2">
                  {settings.maintenanceSubtitle.length > 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {settings.maintenanceSubtitle.length > 0 ? "Valid" : "Required"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {settings.maintenanceSubtitle.length}/100 characters
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Message Validation</Label>
              <div className="flex items-center space-x-2">
                {settings.maintenanceMessage.length > 10 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">
                  {settings.maintenanceMessage.length > 10 ? "Valid" : "Too short"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {settings.maintenanceMessage.length}/500 characters (minimum 10)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Theme Validation</Label>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Valid</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Theme: {settings.maintenanceTheme}
              </p>
            </div>
            
            {settings.maintenanceImage && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Image Validation</Label>
                <div className="flex items-center space-x-2">
                  {settings.maintenanceImage.startsWith('http') ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {settings.maintenanceImage.startsWith('http') ? "Valid URL" : "Invalid URL"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {settings.maintenanceImage}
                </p>
              </div>
            )}
          </div>
          
          {/* Overall Status */}
          <div className="mt-4 p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Status</span>
              <Badge variant={
                settings.maintenanceTitle.length > 0 && 
                settings.maintenanceSubtitle.length > 0 && 
                settings.maintenanceMessage.length > 10
                  ? "default" 
                  : "secondary"
              }>
                {settings.maintenanceTitle.length > 0 && 
                 settings.maintenanceSubtitle.length > 0 && 
                 settings.maintenanceMessage.length > 10
                  ? "Ready" 
                  : "Incomplete"
                }
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {settings.maintenanceTitle.length > 0 && 
               settings.maintenanceSubtitle.length > 0 && 
               settings.maintenanceMessage.length > 10
                ? "All required fields are completed"
                : "Please complete all required fields"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 