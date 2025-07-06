"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Route, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Globe,
  Shield,
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
  Navigation,
  Settings,
  Building2
} from "lucide-react"
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

interface MaintenancePath {
  id: string
  path: string
  name: string
  description: string
  status: 'active' | 'maintenance' | 'disabled'
  accessLevel: 'public' | 'private' | 'admin' | 'maintenance'
  maintenanceMessage?: string
  maintenanceSchedule?: {
    startTime: string
    endTime: string
    timezone: string
    daysOfWeek: string[]
  }
  lastUpdated: string
  companyId: string
}

interface MaintenancePathsConfigProps {
  companyId: string
  companyName: string
}

export function MaintenancePathsConfig({ companyId, companyName }: MaintenancePathsConfigProps) {
  const [paths, setPaths] = useState<MaintenancePath[]>([
    {
      id: "1",
      path: "/dashboard",
      name: "Dashboard",
      description: "Main dashboard access",
      status: "active",
      accessLevel: "public",
      lastUpdated: "2024-01-15T10:30:00Z",
      companyId
    },
    {
      id: "2",
      path: "/admin",
      name: "Admin Panel",
      description: "Administrative functions",
      status: "maintenance",
      accessLevel: "admin",
      maintenanceMessage: "Admin panel under maintenance",
      lastUpdated: "2024-01-15T09:15:00Z",
      companyId
    },
    {
      id: "3",
      path: "/billing",
      name: "Billing System",
      description: "Payment and subscription management",
      status: "active",
      accessLevel: "private",
      lastUpdated: "2024-01-15T08:45:00Z",
      companyId
    }
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'disabled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-blue-100 text-blue-800'
      case 'private': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPaths = paths.filter(path => {
    const matchesSearch = path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.path.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || path.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Navigation className="w-6 h-6" />
            <span>Maintenance Paths Configuration</span>
          </h2>
          <p className="text-gray-600">Configure navigation paths and maintenance settings for {companyName}</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Path
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search paths..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paths Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPaths.map((path) => (
          <Card key={path.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    path.status === 'active' ? 'bg-green-100' : 
                    path.status === 'maintenance' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <Route className={`w-5 h-5 ${
                      path.status === 'active' ? 'text-green-600' : 
                      path.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{path.name}</CardTitle>
                    <p className="text-sm text-gray-500 font-mono">{path.path}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Path
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{path.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className={getStatusColor(path.status)}>
                  {path.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Access Level</span>
                <Badge className={getAccessLevelColor(path.accessLevel)}>
                  {path.accessLevel}
                </Badge>
              </div>

              {path.maintenanceMessage && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Maintenance Message</span>
                  </div>
                  <p className="text-sm text-yellow-700">{path.maintenanceMessage}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Last updated</span>
                <span>{new Date(path.lastUpdated).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Bulk operations and maintenance controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-4">
              <h4 className="font-medium">Maintenance Mode</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable Maintenance</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Global Message</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Scheduled Maintenance</span>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Access Controls</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">IP Restrictions</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">2FA Required</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Session Timeout</span>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Monitoring</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Path Monitoring</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Error Logging</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Performance Tracking</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Maintenance Schedule</span>
          </CardTitle>
          <CardDescription>
            Configure scheduled maintenance windows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label>Start Time</Label>
                <Input type="time" defaultValue="02:00" />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="time" defaultValue="04:00" />
              </div>
              <div>
                <Label>Timezone</Label>
                <Select defaultValue="UTC">
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

            <div className="space-y-4">
              <div>
                <Label>Days of Week</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <Button key={day} variant="outline" size="sm" className="text-xs">
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Maintenance Message</Label>
                <Textarea 
                  placeholder="Enter maintenance message..."
                  rows={3}
                  defaultValue="Scheduled maintenance is in progress. We apologize for any inconvenience."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 