"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Crown, 
  TrendingUp, 
  Users, 
  Bot, 
  MessageSquare, 
  DollarSign, 
  Activity,
  Zap,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  Settings,
  BarChart3,
  LineChart,
  PieChart,
  Eye,
  EyeOff
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts'

import { useAnalytics } from '@/hooks/use-analytics'

interface AnalyticsDashboardProps {
  showPerformance?: boolean
  showRevenue?: boolean
  showUserMetrics?: boolean
  showChatbotMetrics?: boolean
  refreshInterval?: number
}

export function AnalyticsDashboard({
  showPerformance = true,
  showRevenue = true,
  showUserMetrics = true,
  showChatbotMetrics = true,
  refreshInterval = 30000
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState("30")
  const [showRealTime, setShowRealTime] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  
  const { 
    overview, 
    userGrowth, 
    chatbotUsage, 
    revenue, 
    performance, 
    loading, 
    error, 
    refetch 
  } = useAnalytics(parseInt(timeRange))

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    description,
    trend = "up"
  }: {
    title: string
    value: string | number
    change?: number
    icon: any
    description: string
    trend?: "up" | "down"
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            )}
            <span className={trend === "up" ? "text-green-500" : "text-red-500"}>
              {change}%
            </span>
            <span>from last month</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )

  const ChartCard = ({ 
    title, 
    description, 
    children 
  }: {
    title: string
    description: string
    children: React.ReactNode
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {children}
        </div>
      </CardContent>
    </Card>
  )

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Analytics</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8 w-full max-w-none overflow-x-hidden relative z-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="h-8 w-8 text-yellow-300" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Platform Analytics</h1>
              </div>
              <p className="text-base sm:text-lg text-white/90 mb-4">
                Monitor platform performance and usage metrics
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  {showRealTime ? "Real-time" : "Static"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRealTime(!showRealTime)}
                  className="text-white hover:bg-white/10"
                >
                  {showRealTime ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refetch}
                  disabled={loading}
                  className="text-white hover:bg-white/10"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {loading ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : overview ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Users"
            value={overview.users.total.toLocaleString()}
            change={overview.users.growthRate}
            icon={Users}
            description={`${overview.users.active.toLocaleString()} active users`}
            trend={overview.users.growthRate >= 0 ? "up" : "down"}
          />
          <MetricCard
            title="Active Chatbots"
            value={overview.chatbots.active}
            change={overview.chatbots.total > 0 ? Math.round(((overview.chatbots.active - overview.chatbots.total) / overview.chatbots.total) * 100) : 0}
            icon={Bot}
            description={`${overview.chatbots.total} total chatbots`}
            trend={overview.chatbots.active >= overview.chatbots.total * 0.8 ? "up" : "down"}
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${overview.revenue.monthly.toLocaleString()}`}
            change={overview.revenue.growth}
            icon={DollarSign}
            description={`${overview.revenue.subscriptions} subscriptions`}
            trend={overview.revenue.growth >= 0 ? "up" : "down"}
          />
          <MetricCard
            title="Avg Response Time"
            value={`${overview.performance.avgResponseTime}s`}
            change={overview.performance.avgResponseTime < 1.5 ? -5.2 : 5.2}
            icon={Clock}
            description="Platform performance"
            trend={overview.performance.avgResponseTime < 1.5 ? "down" : "up"}
          />
        </div>
      ) : null}

      {/* Performance Monitor */}


      {/* Charts */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            <ChartCard title="User Growth" description="New user registrations over time">
              {userGrowth.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: any) => [value, "New Users"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No user growth data available</p>
                  </div>
                </div>
              )}
            </ChartCard>

            <ChartCard title="Chatbot Usage" description="Daily conversation volume">
              {chatbotUsage.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chatbotUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: any) => [value, "Conversations"]}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No chatbot usage data available</p>
                  </div>
                </div>
              )}
            </ChartCard>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Conversation Metrics</span>
                </CardTitle>
                <CardDescription>Key conversation statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Conversations</span>
                  <span className="font-semibold">{overview?.conversations.total?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Messages/Conversation</span>
                  <span className="font-semibold">{overview?.conversations.avgMessagesPerConversation || '0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Satisfaction Score</span>
                  <span className="font-semibold">{overview?.conversations.satisfactionScore || '0'}/5</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
                <CardDescription>System performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="font-semibold text-green-600">{overview?.performance.uptime || '99.9'}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Error Rate</span>
                  <span className="font-semibold text-red-600">{overview?.performance.errorRate || '0.1'}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Load Time</span>
                  <span className="font-semibold">{overview?.performance.loadTime || '0.8'}s</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>Common admin tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/dashboard/admin/users'}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View All Users
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/dashboard/admin/chatbots'}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Manage Chatbots
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/dashboard/admin/companies'}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Companies
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/dashboard/admin/settings'}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard title="User Growth Trend" description="Daily new user registrations">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: any) => [value, "New Users"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartCard>

            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>User distribution by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Active Users', value: overview?.users.active || 0, color: '#8b5cf6' },
                          { name: 'Inactive Users', value: (overview?.users.total || 0) - (overview?.users.active || 0), color: '#e5e7eb' },
                          { name: 'New This Month', value: overview?.users.newThisMonth || 0, color: '#10b981' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[
                          { name: 'Active Users', value: overview?.users.active || 0, color: '#8b5cf6' },
                          { name: 'Inactive Users', value: (overview?.users.total || 0) - (overview?.users.active || 0), color: '#e5e7eb' },
                          { name: 'New This Month', value: overview?.users.newThisMonth || 0, color: '#10b981' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard title="Response Time" description="Average response time over time">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={performance?.responseTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: any) => [`${value}s`, "Response Time"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Uptime & Error Rate" description="System reliability metrics">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={performance?.uptime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: any) => [`${value}%`, "Uptime"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard title="Monthly Revenue" description="Revenue trends over the past year">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value + "-01").toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value + "-01").toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by subscription tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Starter Plan</span>
                    <span className="font-semibold">$9,900</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Professional Plan</span>
                    <span className="font-semibold">$29,900</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Enterprise</span>
                    <span className="font-semibold">$79,900</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span>${overview?.revenue.monthly.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 