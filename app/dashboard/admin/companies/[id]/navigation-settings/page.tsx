"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { 
  ArrowLeft,
  Navigation,
  Settings,
  Building2,
  Save,
  RotateCcw,
  Upload,
  Palette,
  Globe,
  Eye,
  EyeOff
} from "lucide-react"

interface Company {
  id: string
  companyName: string
  email: string
  subscription: string
  status: 'approved' | 'pending' | 'rejected' | 'active' | 'inactive'
  domain?: string
  maintenanceMode?: boolean
  allowedPaths?: number
  blockedPaths?: number
  customRoutes?: number
}

interface NavigationSettings {
  customLogo: boolean
  customColors: boolean
  customDomain: boolean
  navigationItems: NavigationItem[]
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  secondaryColor: string
  logoUrl?: string
  domain?: string
  companyName: string
  favicon?: string
}

interface NavigationItem {
  id: string
  label: string
  path: string
  icon: string
  enabled: boolean
  order: number
}

export default function CompanyNavigationSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [settings, setSettings] = useState<NavigationSettings>({
    customLogo: false,
    customColors: false,
    customDomain: false,
    navigationItems: [
      { id: '1', label: 'Dashboard', path: '/dashboard', icon: 'Home', enabled: true, order: 1 },
      { id: '2', label: 'Chatbots', path: '/dashboard/chatbots', icon: 'Bot', enabled: true, order: 2 },
      { id: '3', label: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart', enabled: true, order: 3 },
      { id: '4', label: 'Settings', path: '/dashboard/settings', icon: 'Settings', enabled: true, order: 4 },
      { id: '5', label: 'Team', path: '/dashboard/team', icon: 'Users', enabled: false, order: 5 },
      { id: '6', label: 'Billing', path: '/dashboard/billing', icon: 'CreditCard', enabled: true, order: 6 }
    ],
    theme: 'auto',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    companyName: 'TechCorp Solutions'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadCompanyData(params.id as string)
    }
  }, [params.id])

  const loadCompanyData = async (companyId: string) => {
    try {
      console.log(`Loading company data for ID: ${companyId}`)
      
      // Get company data from Firebase
      const companyRef = doc(db, "companies", companyId)
      const companySnap = await getDoc(companyRef)
      
      if (companySnap.exists()) {
        const data = companySnap.data()
        const companyData = {
          id: companyId,
          companyName: data.companyName || "Unknown Company",
          email: data.email || "No email",
          subscription: data.subscription?.plan || "Free",
          status: data.status || "inactive",
          domain: data.domain || `${data.companyName?.toLowerCase().replace(/\s+/g, '')}.com`,
          maintenanceMode: data.maintenanceMode || false,
          allowedPaths: data.allowedPaths || 3,
          blockedPaths: data.blockedPaths || 2,
          customRoutes: data.customRoutes || 1
        }
        
        console.log(`Loaded company: ${companyData.companyName}`)
        setCompany(companyData)
        
        // Load navigation settings if they exist
        if (data.navigationSettings) {
          console.log("Loading existing navigation settings")
          setSettings({
            ...settings,
            ...data.navigationSettings,
            companyName: companyData.companyName
          })
        } else {
          console.log("No existing navigation settings found, using defaults")
        }
      } else {
        console.error(`Company with ID ${companyId} not found`)
        setCompany(null)
      }
    } catch (error) {
      console.error("Error loading company data:", error)
      setCompany(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!company) return
    
    setSaving(true)
    try {
      console.log("Saving navigation settings to Firebase...")
      
      const companyRef = doc(db, "companies", company.id)
      const settingsToSave = {
        customLogo: settings.customLogo,
        customColors: settings.customColors,
        customDomain: settings.customDomain,
        navigationItems: settings.navigationItems,
        theme: settings.theme,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        logoUrl: settings.logoUrl,
        domain: settings.domain,
        favicon: settings.favicon,
        lastUpdated: new Date().toISOString()
      }
      
      await updateDoc(companyRef, {
        navigationSettings: settingsToSave
      })
      
      console.log("Navigation settings saved successfully")
      console.log("Saved settings:", settingsToSave)
      
      // Add a small delay to show the success state
      setTimeout(() => {
        setSaving(false)
      }, 1000)
      
    } catch (error) {
      console.error("Error saving navigation settings:", error)
      setSaving(false)
      // You could add error toast notification here
    }
  }

  const handleReset = async () => {
    if (!company) return
    
    try {
      console.log("Resetting navigation settings to defaults...")
      
      const defaultSettings: NavigationSettings = {
        customLogo: false,
        customColors: false,
        customDomain: false,
        navigationItems: [
          { id: '1', label: 'Dashboard', path: '/dashboard', icon: 'Home', enabled: true, order: 1 },
          { id: '2', label: 'Chatbots', path: '/dashboard/chatbots', icon: 'Bot', enabled: true, order: 2 },
          { id: '3', label: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart', enabled: true, order: 3 },
          { id: '4', label: 'Settings', path: '/dashboard/settings', icon: 'Settings', enabled: true, order: 4 },
          { id: '5', label: 'Team', path: '/dashboard/team', icon: 'Users', enabled: false, order: 5 },
          { id: '6', label: 'Billing', path: '/dashboard/billing', icon: 'CreditCard', enabled: true, order: 6 }
        ],
        theme: 'auto' as const,
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        companyName: company.companyName
      }
      
      setSettings(defaultSettings)
      console.log("Settings reset to defaults")
      
      // Save the reset settings to Firebase
      const companyRef = doc(db, "companies", company.id)
      await updateDoc(companyRef, {
        navigationSettings: {
          ...defaultSettings,
          lastUpdated: new Date().toISOString()
        }
      })
      console.log("Reset settings saved to Firebase")
      
    } catch (error) {
      console.error("Error resetting settings:", error)
      // You could add error toast notification here
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSettings({...settings, logoUrl: e.target?.result as string})
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSettings({...settings, favicon: e.target?.result as string})
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDomainChange = (domain: string) => {
    setSettings({...settings, domain: domain})
  }

  const toggleNavigationItem = (itemId: string) => {
    const updatedItems = settings.navigationItems.map(item =>
      item.id === itemId ? {...item, enabled: !item.enabled} : item
    )
    setSettings({...settings, navigationItems: updatedItems})
  }

  const moveNavigationItem = (itemId: string, direction: 'up' | 'down') => {
    const items = [...settings.navigationItems]
    const currentIndex = items.findIndex(item => item.id === itemId)
    
    if (direction === 'up' && currentIndex > 0) {
      [items[currentIndex], items[currentIndex - 1]] = [items[currentIndex - 1], items[currentIndex]]
    } else if (direction === 'down' && currentIndex < items.length - 1) {
      [items[currentIndex], items[currentIndex + 1]] = [items[currentIndex + 1], items[currentIndex]]
    }
    
    const updatedItems = items.map((item, index) => ({...item, order: index + 1}))
    setSettings({...settings, navigationItems: updatedItems})
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading navigation settings...</p>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Company not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Navigation Settings</h1>
            <p className="text-gray-500">{company.companyName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
            {company.status}
          </Badge>
          <Badge variant="outline">{company.subscription}</Badge>
        </div>
      </div>

      {/* Company Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Company Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Details Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <Label className="text-sm font-medium text-muted-foreground">Company Name</Label>
              </div>
              <p className="text-xl font-semibold text-foreground">{company.companyName}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Label className="text-sm font-medium text-muted-foreground">Domain</Label>
              </div>
              <p className="text-xl font-semibold text-foreground">{company.domain}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              </div>
              <Badge 
                variant={company.status === 'active' ? 'default' : 'secondary'}
                className="text-sm px-3 py-1"
              >
                {company.status}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <Label className="text-sm font-medium text-muted-foreground">Maintenance Mode</Label>
              </div>
              <Badge 
                variant={company.maintenanceMode ? 'destructive' : 'secondary'}
                className="text-sm px-3 py-1"
              >
                {company.maintenanceMode ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>

          {/* Path Statistics */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">Allowed Paths</Label>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{company.allowedPaths || 0}</span>
                </div>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Paths that users can access</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-red-700 dark:text-red-300">Blocked Paths</Label>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{company.blockedPaths || 0}</span>
                </div>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">Paths that are restricted</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">Custom Routes</Label>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{company.customRoutes || 0}</span>
                </div>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Custom routing rules</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold text-foreground">Quick Actions</h4>
                <p className="text-sm text-muted-foreground">Manage company settings and status</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={company.maintenanceMode ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newMaintenanceMode = !(company.maintenanceMode || false)
                    setCompany({...company, maintenanceMode: newMaintenanceMode})
                    const companyRef = doc(db, "companies", company.id)
                    updateDoc(companyRef, { maintenanceMode: newMaintenanceMode })
                  }}
                >
                  {company.maintenanceMode ? 'Disable' : 'Enable'} Maintenance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.push(`/dashboard/admin/companies/${company.id}/users`)
                  }}
                >
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.push(`/dashboard/admin/companies/${company.id}/billing`)
                  }}
                >
                  View Billing
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Customization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Customization</span>
            </CardTitle>
            <CardDescription>
              Configure company-specific branding and appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Custom Logo */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Custom Logo</Label>
                  <p className="text-sm text-gray-500">Allow company to upload custom logo</p>
                </div>
                <Switch
                  checked={settings.customLogo}
                  onCheckedChange={(checked) => setSettings({...settings, customLogo: checked})}
                />
              </div>
              
              {settings.customLogo && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Company Logo" className="w-16 h-16 object-contain border rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 border rounded flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>Upload Logo</span>
                        </Button>
                      </Label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {settings.favicon ? (
                      <img src={settings.favicon} alt="Favicon" className="w-8 h-8 object-contain border rounded" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 border rounded flex items-center justify-center">
                        <Upload className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="favicon-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>Upload Favicon</span>
                        </Button>
                      </Label>
                      <input
                        id="favicon-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Colors */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Custom Colors</Label>
                  <p className="text-sm text-gray-500">Enable custom color scheme</p>
                </div>
                <Switch
                  checked={settings.customColors}
                  onCheckedChange={(checked) => setSettings({...settings, customColors: checked})}
                />
              </div>
              
              {settings.customColors && (
                <div className="space-y-4">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        placeholder="#6366f1"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        placeholder="#8b5cf6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Theme</Label>
                    <Select value={settings.theme} onValueChange={(value: 'light' | 'dark' | 'auto') => setSettings({...settings, theme: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Domain */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Custom Domain</Label>
                  <p className="text-sm text-gray-500">Allow custom domain configuration</p>
                </div>
                <Switch
                  checked={settings.customDomain}
                  onCheckedChange={(checked) => setSettings({...settings, customDomain: checked})}
                />
              </div>
              
              {settings.customDomain && (
                <div className="space-y-3">
                  <div>
                    <Label>Domain</Label>
                    <Input
                      value={settings.domain || ''}
                      onChange={(e) => handleDomainChange(e.target.value)}
                      placeholder="app.yourcompany.com"
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>• Configure your DNS to point to our servers</p>
                    <p>• SSL certificate will be automatically provisioned</p>
                    <p>• Domain verification required before activation</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Navigation className="w-5 h-5" />
              <span>Navigation Items</span>
            </CardTitle>
            <CardDescription>
              Configure which navigation items are visible and their order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settings.navigationItems
                .sort((a, b) => a.order - b.order)
                .map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">{item.icon.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{item.label}</p>
                        <Badge variant="outline" className="text-xs">#{item.order}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{item.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveNavigationItem(item.id, 'up')}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveNavigationItem(item.id, 'down')}
                        disabled={index === settings.navigationItems.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        ↓
                      </Button>
                    </div>
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={() => toggleNavigationItem(item.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Preview */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-medium mb-3 text-foreground">Navigation Preview</h4>
              <div className="flex flex-wrap gap-2">
                {settings.navigationItems
                  .filter(item => item.enabled)
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-2 px-3 py-2 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    style={{
                      borderColor: settings.customColors ? settings.primaryColor : 'hsl(var(--border))',
                      backgroundColor: settings.customColors ? `${settings.primaryColor}08` : 'hsl(var(--card))'
                    }}
                  >
                    <div 
                      className="w-4 h-4 rounded flex-shrink-0"
                      style={{ 
                        backgroundColor: settings.customColors ? settings.primaryColor : 'hsl(var(--primary))'
                      }}
                    ></div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
              {settings.navigationItems.filter(item => item.enabled).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No navigation items enabled</p>
                  <p className="text-xs mt-1">Enable items above to see them in the preview</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Path Management */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Path Management</span>
          </CardTitle>
          <CardDescription>
            Manage allowed paths, blocked paths, and custom routes for this company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Allowed Paths</Label>
                  <p className="text-sm text-gray-500">Paths that users can access</p>
                </div>
                <Badge variant="default" className="text-lg px-3 py-1">
                  {company.allowedPaths || 0}
                </Badge>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCount = (company.allowedPaths || 0) + 1
                    setCompany({...company, allowedPaths: newCount})
                    const companyRef = doc(db, "companies", company.id)
                    updateDoc(companyRef, { allowedPaths: newCount })
                  }}
                >
                  Add Path
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCount = Math.max(0, (company.allowedPaths || 0) - 1)
                    setCompany({...company, allowedPaths: newCount})
                    const companyRef = doc(db, "companies", company.id)
                    updateDoc(companyRef, { allowedPaths: newCount })
                  }}
                  disabled={(company.allowedPaths || 0) <= 0}
                >
                  Remove Path
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Blocked Paths</Label>
                  <p className="text-sm text-gray-500">Paths that are restricted</p>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {company.blockedPaths || 0}
                </Badge>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCount = (company.blockedPaths || 0) + 1
                    setCompany({...company, blockedPaths: newCount})
                    const companyRef = doc(db, "companies", company.id)
                    updateDoc(companyRef, { blockedPaths: newCount })
                  }}
                >
                  Add Block
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCount = Math.max(0, (company.blockedPaths || 0) - 1)
                    setCompany({...company, blockedPaths: newCount})
                    const companyRef = doc(db, "companies", company.id)
                    updateDoc(companyRef, { blockedPaths: newCount })
                  }}
                  disabled={(company.blockedPaths || 0) <= 0}
                >
                  Remove Block
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Custom Routes</Label>
                  <p className="text-sm text-gray-500">Custom routing rules</p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {company.customRoutes || 0}
                </Badge>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCount = (company.customRoutes || 0) + 1
                    setCompany({...company, customRoutes: newCount})
                    const companyRef = doc(db, "companies", company.id)
                    updateDoc(companyRef, { customRoutes: newCount })
                  }}
                >
                  Add Route
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCount = Math.max(0, (company.customRoutes || 0) - 1)
                    setCompany({...company, customRoutes: newCount})
                    const companyRef = doc(db, "companies", company.id)
                    updateDoc(companyRef, { customRoutes: newCount })
                  }}
                  disabled={(company.customRoutes || 0) <= 0}
                >
                  Remove Route
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Actions</span>
          </CardTitle>
          <CardDescription>
            Save or reset navigation settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="min-w-[140px]"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="min-w-[140px]"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Settings will be applied immediately</span>
            </div>
          </div>
          
          {/* Status Messages */}
          {saving && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700 dark:text-blue-300">Saving navigation settings...</span>
              </div>
            </div>
          )}
          
          {/* Action Tips */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Quick Tips:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>Save Settings:</strong> Persists all changes to the database</li>
              <li>• <strong>Reset to Default:</strong> Restores all navigation items to their default state</li>
              <li>• <strong>Custom Colors:</strong> Will be applied to the company's navigation when enabled</li>
              <li>• <strong>Navigation Order:</strong> Use the up/down arrows to reorder items</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 