"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Navigation, 
  Settings, 
  Shield, 
  Globe, 
  Route, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Building2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Search,
  Filter,
  MoreVertical,
  LayoutDashboard,
  Bot,
  MessageSquare,
  Store,
  CreditCard,
  Crown,
  Palette,
  Zap,
  Target,
  BarChart3
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface NavigationTab {
  id: string
  name: string
  icon: string
  path: string
  description: string
  status: 'active' | 'hidden' | 'disabled'
  order: number
  accessLevel: 'all' | 'admin' | 'premium'
  customIcon?: string
  badge?: string
  badgeColor?: string
}

interface NavigationSettings {
  companyId: string
  companyName: string
  theme: 'light' | 'dark' | 'auto'
  sidebarCollapsed: boolean
  showIcons: boolean
  showLabels: boolean
  customTabs: NavigationTab[]
  defaultTabs: NavigationTab[]
  maintenanceMode: boolean
  maintenanceMessage: string
  allowedPaths: string[]
  blockedPaths: string[]
  customRoutes: {
    id: string
    path: string
    name: string
    description: string
    status: 'active' | 'maintenance' | 'disabled'
    accessLevel: 'public' | 'private' | 'admin'
  }[]
  securitySettings: {
    ipWhitelist: boolean
    twoFactorRequired: boolean
    sessionTimeout: boolean
    sessionTimeoutMinutes: number
  }
  performanceSettings: {
    lazyLoading: boolean
    preloadCritical: boolean
    cacheNavigation: boolean
  }
}

export default function CompanyNavigationSettingsPage() {
  const [settings, setSettings] = useState<NavigationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [editingTab, setEditingTab] = useState<NavigationTab | null>(null)
  const [showAddTabDialog, setShowAddTabDialog] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    // Load real navigation settings from Firebase
    // TODO: Implement real navigation settings with Firebase
    const defaultSettings: NavigationSettings = {
      companyId: "",
      companyName: "",
      theme: "auto",
      sidebarCollapsed: false,
      showIcons: true,
      showLabels: true,
      defaultTabs: [
        {
          id: "dashboard",
          name: "Dashboard",
          icon: "LayoutDashboard",
          path: "/dashboard",
          description: "Main dashboard overview",
          status: "active" as const,
          order: 1,
          accessLevel: "all"
        },
        {
          id: "chatbots",
          name: "Chatbots",
          icon: "Bot",
          path: "/dashboard/chatbots",
          description: "Manage your chatbots",
          status: "active" as const,
          order: 2,
          accessLevel: "all"
        },
        {
          id: "marketplace",
          name: "Marketplace",
          icon: "Store",
          path: "/dashboard/marketplace",
          description: "Browse chatbot templates",
          status: "active" as const,
          order: 3,
          accessLevel: "all"
        },
        {
          id: "billing",
          name: "Billing",
          icon: "CreditCard",
          path: "/dashboard/billing",
          description: "Manage subscriptions and billing",
          status: "active" as const,
          order: 4,
          accessLevel: "all"
        },
        {
          id: "team",
          name: "Team",
          icon: "Users",
          path: "/dashboard/team",
          description: "Manage team members",
          status: "active" as const,
          order: 5,
          accessLevel: "admin"
        },
        {
          id: "settings",
          name: "Settings",
          icon: "Settings",
          path: "/dashboard/settings",
          description: "Configure your account",
          status: "active" as const,
          order: 6,
          accessLevel: "admin"
        }
      ],
      customTabs: [],
      maintenanceMode: false,
      maintenanceMessage: "We're performing scheduled maintenance. Please check back soon.",
      allowedPaths: ["/dashboard", "/chatbots", "/billing", "/team", "/settings"],
      blockedPaths: ["/admin", "/debug", "/internal"],
      customRoutes: [],
      securitySettings: {
        ipWhitelist: false,
        twoFactorRequired: true,
        sessionTimeout: true,
        sessionTimeoutMinutes: 30
      },
      performanceSettings: {
        lazyLoading: true,
        preloadCritical: true,
        cacheNavigation: true
      }
    }

    setSettings(defaultSettings)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'hidden': return 'bg-gray-100 text-gray-800'
      case 'disabled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'all': return 'bg-blue-100 text-blue-800'
      case 'admin': return 'bg-red-100 text-red-800'
      case 'premium': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      LayoutDashboard,
      Bot,
      MessageSquare,
      Store,
      CreditCard,
      Users,
      Settings,
      BarChart3,
      Navigation,
      Shield,
      Globe,
      Route
    }
    return iconMap[iconName] || Settings
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

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No settings found</p>
      </div>
    )
  }

  const allTabs = [...settings.defaultTabs, ...settings.customTabs].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Navigation className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">Navigation Settings</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Customize your company's navigation experience
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Navigation active</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Building2 className="w-4 h-4" />
                  <span>{settings.companyName}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Route className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tabs">Navigation Tabs</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Navigation Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {allTabs.length}
                    </div>
                    <div className="text-sm text-blue-600">Total Tabs</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {allTabs.filter(tab => tab.status === 'active').length}
                    </div>
                    <div className="text-sm text-green-600">Active Tabs</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Default Tabs</span>
                    <Badge variant="outline">{settings.defaultTabs.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Custom Tabs</span>
                    <Badge variant="outline">{settings.customTabs.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Custom Routes</span>
                    <Badge variant="outline">{settings.customRoutes.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Appearance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Icons</span>
                    <Switch checked={settings.showIcons} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Labels</span>
                    <Switch checked={settings.showLabels} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Collapsed Sidebar</span>
                    <Switch checked={settings.sidebarCollapsed} />
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Theme</Label>
                  <Select value={settings.theme}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Security Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2FA Required</span>
                    <Switch checked={settings.securitySettings.twoFactorRequired} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Timeout</span>
                    <Switch checked={settings.securitySettings.sessionTimeout} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IP Whitelist</span>
                    <Switch checked={settings.securitySettings.ipWhitelist} />
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Security Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tabs" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Navigation Tabs</h3>
              <p className="text-gray-600">Manage your navigation tabs and their visibility</p>
            </div>
            <Button onClick={() => setShowAddTabDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Tab
            </Button>
          </div>

          <div className="grid gap-4">
            {allTabs.map((tab) => {
              const IconComponent = getIconComponent(tab.icon)
              return (
                <Card key={tab.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{tab.name}</h4>
                            {tab.badge && (
                              <Badge className={tab.badgeColor === 'purple' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                {tab.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{tab.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(tab.status)}>
                              {tab.status}
                            </Badge>
                            <Badge className={getAccessLevelColor(tab.accessLevel)}>
                              {tab.accessLevel}
                            </Badge>
                            <span className="text-xs text-gray-400">Order: {tab.order}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingTab(tab)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate Tab
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Tab
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Visual Settings</span>
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your navigation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Show Icons</Label>
                      <p className="text-sm text-gray-500">Display icons next to navigation items</p>
                    </div>
                    <Switch checked={settings.showIcons} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Show Labels</Label>
                      <p className="text-sm text-gray-500">Display text labels for navigation items</p>
                    </div>
                    <Switch checked={settings.showLabels} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Collapsed Sidebar</Label>
                      <p className="text-sm text-gray-500">Start with sidebar collapsed</p>
                    </div>
                    <Switch checked={settings.sidebarCollapsed} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Theme</Label>
                    <Select value={settings.theme}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light Theme</SelectItem>
                        <SelectItem value="dark">Dark Theme</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Customization</span>
                </CardTitle>
                <CardDescription>
                  Advanced customization options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Custom CSS</Label>
                  <Textarea 
                    placeholder="Add custom CSS for navigation styling..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Custom JavaScript</Label>
                  <Textarea 
                    placeholder="Add custom JavaScript for navigation behavior..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Access Controls</span>
                </CardTitle>
                <CardDescription>
                  Configure security and access settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for all users</p>
                    </div>
                    <Switch checked={settings.securitySettings.twoFactorRequired} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Session Timeout</Label>
                      <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                    </div>
                    <Switch checked={settings.securitySettings.sessionTimeout} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">IP Whitelist</Label>
                      <p className="text-sm text-gray-500">Restrict access to specific IP addresses</p>
                    </div>
                    <Switch checked={settings.securitySettings.ipWhitelist} />
                  </div>
                </div>

                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <Input 
                    type="number" 
                    value={settings.securitySettings.sessionTimeoutMinutes}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Path Restrictions</span>
                </CardTitle>
                <CardDescription>
                  Manage allowed and blocked paths
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Allowed Paths</Label>
                  <div className="space-y-2 mt-2">
                    {settings.allowedPaths.map((path, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                        <span className="font-mono text-sm">{path}</span>
                        <Button variant="ghost" size="sm">
                          <XCircle className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Allowed Path
                  </Button>
                </div>

                <div>
                  <Label>Blocked Paths</Label>
                  <div className="space-y-2 mt-2">
                    {settings.blockedPaths.map((path, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                        <span className="font-mono text-sm">{path}</span>
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Blocked Path
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Performance Settings</span>
                </CardTitle>
                <CardDescription>
                  Optimize navigation performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Lazy Loading</Label>
                      <p className="text-sm text-gray-500">Load navigation items on demand</p>
                    </div>
                    <Switch checked={settings.performanceSettings.lazyLoading} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Preload Critical</Label>
                      <p className="text-sm text-gray-500">Preload critical navigation paths</p>
                    </div>
                    <Switch checked={settings.performanceSettings.preloadCritical} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Cache Navigation</Label>
                      <p className="text-sm text-gray-500">Cache navigation state</p>
                    </div>
                    <Switch checked={settings.performanceSettings.cacheNavigation} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </CardTitle>
                <CardDescription>
                  Navigation usage analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-blue-600">Navigation Clicks (30 days)</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                    <div className="text-sm text-green-600">Navigation Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2.3s</div>
                    <div className="text-sm text-purple-600">Average Load Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Custom Tab Dialog */}
      <Dialog open={showAddTabDialog} onOpenChange={setShowAddTabDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Navigation Tab</DialogTitle>
            <DialogDescription>
              Create a new custom navigation tab for your company
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tab Name</Label>
              <Input placeholder="Enter tab name..." />
            </div>
            <div>
              <Label>Path</Label>
              <Input placeholder="/dashboard/custom-tab" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe what this tab is for..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Access Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="admin">Admin Only</SelectItem>
                    <SelectItem value="premium">Premium Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTabDialog(false)}>
              Cancel
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Tab
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 