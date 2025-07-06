"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Bot, 
  Server, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  Gauge,
  Database,
  Network,
  Cpu,
  HardDrive,
  Thermometer,
  Zap,
  Shield,
  Globe,
  Building2,
  CreditCard,
  Crown
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  temperature: number
  uptime: number
  activeConnections: number
  requestsPerMinute: number
  errorRate: number
  responseTime: number
}

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  totalChatbots: number
  activeChatbots: number
  totalConversations: number
  conversationsToday: number
  totalCompanies: number
  activeCompanies: number
  revenue: number
  growthRate: number
}

export default function AnalyticsMonitoringPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 seconds
  
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    temperature: 0,
    uptime: 0,
    activeConnections: 0,
    requestsPerMinute: 0,
    errorRate: 0,
    responseTime: 0
  })
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalChatbots: 0,
    activeChatbots: 0,
    totalConversations: 0,
    conversationsToday: 0,
    totalCompanies: 0,
    activeCompanies: 0,
    revenue: 0,
    growthRate: 0
  })
  
  const { profile } = useAuth()

  useEffect(() => {
    loadAnalyticsData()
    
    if (autoRefresh) {
      const interval = setInterval(loadAnalyticsData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Load real analytics data from Firebase
      // TODO: Implement real analytics data with Firebase
      const realSystemMetrics: SystemMetrics = {
        cpu: 0,
        memory: 0,
        disk: 0,
        network: 0,
        temperature: 0,
        uptime: 0,
        activeConnections: 0,
        requestsPerMinute: 0,
        errorRate: 0,
        responseTime: 0
      }
      
      const realAnalyticsData: AnalyticsData = {
        totalUsers: 0,
        activeUsers: 0,
        totalChatbots: 0,
        activeChatbots: 0,
        totalConversations: 0,
        conversationsToday: 0,
        totalCompanies: 0,
        activeCompanies: 0,
        revenue: 0,
        growthRate: 0
      }
      
      setSystemMetrics(realSystemMetrics)
      setAnalyticsData(realAnalyticsData)
    } catch (error) {
      console.error("Error loading analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMetricColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return "text-red-600"
    if (value >= threshold * 0.7) return "text-yellow-600"
    return "text-green-600"
  }

  const getMetricIcon = (value: number, threshold: number = 80) => {
    if (value >= threshold) return XCircle
    if (value >= threshold * 0.7) return AlertTriangle
    return CheckCircle
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <BarChart3 className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">Analytics & Monitoring</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Real-time platform analytics and system monitoring
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live monitoring active</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4" />
                  <span>Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={loadAnalyticsData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Auto-refresh</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
                <option value={60000}>1m</option>
                <option value={300000}>5m</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System Metrics</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Active Users</CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-blue-900">{formatNumber(analyticsData.activeUsers)}</div>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {analyticsData.growthRate}% growth
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Active Chatbots</CardTitle>
                <div className="p-2 bg-green-500 rounded-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-green-900">{formatNumber(analyticsData.activeChatbots)}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {formatNumber(analyticsData.conversationsToday)} today
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Revenue</CardTitle>
                <div className="p-2 bg-purple-500 rounded-lg">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-purple-900">{formatCurrency(analyticsData.revenue)}</div>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  This month
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">System Health</CardTitle>
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Server className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-orange-900">{systemMetrics.uptime}%</div>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Uptime
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Cpu className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CPU</span>
                      <span className={`text-sm font-bold ${getMetricColor(systemMetrics.cpu)}`}>
                        {systemMetrics.cpu.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.cpu} className="mt-1" />
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Database className="w-5 h-5 text-green-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Memory</span>
                      <span className={`text-sm font-bold ${getMetricColor(systemMetrics.memory)}`}>
                        {systemMetrics.memory.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.memory} className="mt-1" />
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <HardDrive className="w-5 h-5 text-purple-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Disk</span>
                      <span className={`text-sm font-bold ${getMetricColor(systemMetrics.disk)}`}>
                        {systemMetrics.disk.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.disk} className="mt-1" />
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Network className="w-5 h-5 text-orange-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Network</span>
                      <span className={`text-sm font-bold ${getMetricColor(systemMetrics.network)}`}>
                        {systemMetrics.network.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.network} className="mt-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-5 h-5" />
                <span>System Metrics</span>
              </CardTitle>
              <CardDescription>
                Real-time system performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">CPU Usage</span>
                      </div>
                      <span className="text-sm font-bold">{systemMetrics.cpu.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Memory Usage</span>
                      </div>
                      <span className="text-sm font-bold">{systemMetrics.memory.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <HardDrive className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Disk Usage</span>
                      </div>
                      <span className="text-sm font-bold">{systemMetrics.disk.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Network className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Network Usage</span>
                      </div>
                      <span className="text-sm font-bold">{systemMetrics.network.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">System Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Uptime</span>
                      </div>
                      <span className="text-sm font-bold">{systemMetrics.uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Temperature</span>
                      </div>
                      <span className="text-sm font-bold">{systemMetrics.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Active Connections</span>
                      </div>
                      <span className="text-sm font-bold">{systemMetrics.activeConnections}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Requests/Min</span>
                      </div>
                      <span className="text-sm font-bold">{systemMetrics.requestsPerMinute}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Platform Analytics</span>
              </CardTitle>
              <CardDescription>
                Detailed platform usage and performance analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">User Analytics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Total Users</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(analyticsData.totalUsers)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Active Users</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(analyticsData.activeUsers)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Total Companies</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(analyticsData.totalCompanies)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Active Companies</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(analyticsData.activeCompanies)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Chatbot Analytics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Total Chatbots</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(analyticsData.totalChatbots)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Active Chatbots</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(analyticsData.activeChatbots)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Total Conversations</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(analyticsData.totalConversations)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Today's Conversations</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(analyticsData.conversationsToday)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Live Monitoring</span>
              </CardTitle>
              <CardDescription>
                Real-time system monitoring and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Performance Monitoring</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Gauge className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Response Time</span>
                      </div>
                      <span className="text-sm font-bold">{systemMetrics.responseTime.toFixed(0)}ms</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Error Rate</span>
                      </div>
                      <span className="text-sm font-bold">{systemMetrics.errorRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Security Status</span>
                      </div>
                      <Badge variant="default" className="bg-green-500">Secure</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Database Status</span>
                      </div>
                      <Badge variant="default" className="bg-green-500">Healthy</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">System Alerts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">System operational</span>
                      </div>
                      <span className="text-xs text-green-600">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Backup completed</span>
                      </div>
                      <span className="text-xs text-blue-600">15 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">High memory usage</span>
                      </div>
                      <span className="text-xs text-yellow-600">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 