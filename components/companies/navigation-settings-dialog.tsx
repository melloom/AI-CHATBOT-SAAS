"use client"

import { useState } from "react"
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
  MoreVertical
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface NavigationPath {
  id: string
  path: string
  name: string
  description: string
  status: 'active' | 'maintenance' | 'disabled'
  accessLevel: 'public' | 'private' | 'admin'
  maintenanceMessage?: string
  lastUpdated: string
  companyId: string
}

interface Company {
  id: string
  name: string
  domain: string
  status: 'active' | 'suspended' | 'maintenance'
  navigationSettings: {
    maintenanceMode: boolean
    maintenanceMessage: string
    allowedPaths: string[]
    blockedPaths: string[]
    customRoutes: NavigationPath[]
    maintenanceSchedule?: {
      startTime: string
      endTime: string
      timezone: string
    }
  }
}

interface NavigationSettingsDialogProps {
  company: Company | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NavigationSettingsDialog({ company, open, onOpenChange }: NavigationSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [settings, setSettings] = useState(company?.navigationSettings)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-blue-100 text-blue-800'
      case 'private': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!company) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Navigation Settings - {company.name}</span>
          </DialogTitle>
          <DialogDescription>
            Configure navigation paths, maintenance settings, and access controls for {company.domain}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="paths">Paths</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Company Info</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input value={company.name} readOnly />
                  </div>
                  <div>
                    <Label>Domain</Label>
                    <Input value={company.domain} readOnly />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={company.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {company.navigationSettings.allowedPaths.length}
                      </div>
                      <div className="text-sm text-blue-600">Allowed Paths</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {company.navigationSettings.blockedPaths.length}
                      </div>
                      <div className="text-sm text-red-600">Blocked Paths</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {company.navigationSettings.customRoutes.length}
                      </div>
                      <div className="text-sm text-green-600">Custom Routes</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {company.navigationSettings.maintenanceMode ? "ON" : "OFF"}
                      </div>
                      <div className="text-sm text-yellow-600">Maintenance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="paths" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Allowed Paths</span>
                  </CardTitle>
                  <CardDescription>
                    Paths that are accessible to users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {company.navigationSettings.allowedPaths.map((path, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <span className="font-mono text-sm">{path}</span>
                      <Button variant="ghost" size="sm">
                        <XCircle className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Allowed Path
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Blocked Paths</span>
                  </CardTitle>
                  <CardDescription>
                    Paths that are restricted from access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {company.navigationSettings.blockedPaths.map((path, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                      <span className="font-mono text-sm">{path}</span>
                      <Button variant="ghost" size="sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Blocked Path
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Route className="w-4 h-4" />
                  <span>Custom Routes</span>
                </CardTitle>
                <CardDescription>
                  Company-specific custom navigation routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {company.navigationSettings.customRoutes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Route className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{route.name}</h4>
                          <p className="text-sm text-gray-500">{route.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getAccessLevelColor(route.accessLevel)}>
                              {route.accessLevel}
                            </Badge>
                            <Badge variant={route.status === 'active' ? 'default' : 'secondary'}>
                              {route.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Route
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span>Maintenance Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure maintenance mode and scheduling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">
                      Enable maintenance mode to restrict access to the platform
                    </p>
                  </div>
                  <Switch 
                    checked={company.navigationSettings.maintenanceMode}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Maintenance Message</Label>
                    <Textarea 
                      value={company.navigationSettings.maintenanceMessage}
                      placeholder="Enter maintenance message..."
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label>Start Time</Label>
                      <Input 
                        type="time" 
                        value={company.navigationSettings.maintenanceSchedule?.startTime}
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input 
                        type="time" 
                        value={company.navigationSettings.maintenanceSchedule?.endTime}
                      />
                    </div>
                    <div>
                      <Label>Timezone</Label>
                      <Select value={company.navigationSettings.maintenanceSchedule?.timezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">EST</SelectItem>
                          <SelectItem value="PST">PST</SelectItem>
                          <SelectItem value="GMT">GMT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Access Controls</span>
                  </CardTitle>
                  <CardDescription>
                    Configure security and access settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">IP Whitelist</Label>
                      <p className="text-sm text-gray-500">Restrict access to specific IP addresses</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">2FA Required</Label>
                      <p className="text-sm text-gray-500">Require two-factor authentication</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Session Timeout</Label>
                      <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Security Logs</span>
                  </CardTitle>
                  <CardDescription>
                    Monitor security events and access attempts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Failed login attempt</span>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Successful login</span>
                      </div>
                      <span className="text-xs text-gray-500">5 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Blocked IP access</span>
                      </div>
                      <span className="text-xs text-gray-500">10 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 