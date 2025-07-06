"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Bot, 
  MessageSquare, 
  CreditCard, 
  Crown,
  Activity,
  Globe,
  Calendar,
  Clock,
  Eye,
  Download,
  Filter,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Shield,
  Database,
  Network,
  Server,
  Gauge,
  Target,
  Award,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Settings,
  Bell,
  Mail,
  Phone,
  MapPin,
  Globe2,
  Monitor,
  Smartphone,
  Tablet,
  Laptop
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface PlatformMetrics {
  totalRevenue: number
  monthlyRecurringRevenue: number
  averageRevenuePerUser: number
  customerLifetimeValue: number
  churnRate: number
  conversionRate: number
  userSatisfaction: number
  supportTickets: number
  averageResponseTime: number
  featureAdoption: number
}

interface UserDemographics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  returningUsers: number
  premiumUsers: number
  enterpriseUsers: number
  geographicDistribution: {
    [key: string]: number
  }
  deviceUsage: {
    desktop: number
    mobile: number
    tablet: number
  }
  subscriptionPlans: {
    [key: string]: number
  }
}

interface ChatbotMetrics {
  totalChatbots: number
  activeChatbots: number
  conversationsPerDay: number
  averageConversationLength: number
  userSatisfaction: number
  mostPopularFeatures: string[]
  topIndustries: {
    [key: string]: number
  }
}

export default function PlatformAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30d")
  const [autoRefresh, setAutoRefresh] = useState(true)
  
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics>({
    totalRevenue: 0,
    monthlyRecurringRevenue: 0,
    averageRevenuePerUser: 0,
    customerLifetimeValue: 0,
    churnRate: 0,
    conversionRate: 0,
    userSatisfaction: 0,
    supportTickets: 0,
    averageResponseTime: 0,
    featureAdoption: 0
  })
  
  const [userDemographics, setUserDemographics] = useState<UserDemographics>({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    returningUsers: 0,
    premiumUsers: 0,
    enterpriseUsers: 0,
    geographicDistribution: {},
    deviceUsage: {
      desktop: 0,
      mobile: 0,
      tablet: 0
    },
    subscriptionPlans: {}
  })
  
  const [chatbotMetrics, setChatbotMetrics] = useState<ChatbotMetrics>({
    totalChatbots: 0,
    activeChatbots: 0,
    conversationsPerDay: 0,
    averageConversationLength: 0,
    userSatisfaction: 0,
    mostPopularFeatures: [],
    topIndustries: {}
  })
  
  const { profile } = useAuth()

  useEffect(() => {
    loadPlatformAnalytics()
    
    if (autoRefresh) {
      const interval = setInterval(loadPlatformAnalytics, 60000) // 1 minute
      return () => clearInterval(interval)
    }
  }, [autoRefresh, dateRange])

  const loadPlatformAnalytics = async () => {
    try {
      setLoading(true)
      
      // Load real platform analytics from Firebase
      // TODO: Implement real platform analytics with Firebase
      const realPlatformMetrics: PlatformMetrics = {
        totalRevenue: 0,
        monthlyRecurringRevenue: 0,
        averageRevenuePerUser: 0,
        customerLifetimeValue: 0,
        churnRate: 0,
        conversionRate: 0,
        userSatisfaction: 0,
        supportTickets: 0,
        averageResponseTime: 0,
        featureAdoption: 0
      }
      
      const realUserDemographics: UserDemographics = {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        returningUsers: 0,
        premiumUsers: 0,
        enterpriseUsers: 0,
        geographicDistribution: {},
        deviceUsage: {
          desktop: 0,
          mobile: 0,
          tablet: 0
        },
        subscriptionPlans: {}
      }
      
      const realChatbotMetrics: ChatbotMetrics = {
        totalChatbots: 0,
        activeChatbots: 0,
        conversationsPerDay: 0,
        averageConversationLength: 0,
        userSatisfaction: 0,
        mostPopularFeatures: [],
        topIndustries: {}
      }
      
      setPlatformMetrics(realPlatformMetrics)
      setUserDemographics(realUserDemographics)
      setChatbotMetrics(realChatbotMetrics)
    } catch (error) {
      console.error("Error loading platform analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getMetricColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return "text-green-600"
    if (value >= threshold * 0.7) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading platform analytics...</p>
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
                <h1 className="text-3xl md:text-4xl font-bold">Platform Analytics</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Comprehensive platform performance and business metrics
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Real-time data</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Last {dateRange}</span>
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
                onClick={loadPlatformAnalytics}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="text-sm border rounded px-3 py-1"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
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
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Monthly Revenue</CardTitle>
                <div className="p-2 bg-green-500 rounded-lg">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-green-900">{formatCurrency(platformMetrics.monthlyRecurringRevenue)}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.4% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Active Users</CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-blue-900">{formatNumber(userDemographics.activeUsers)}</div>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  {formatPercentage((userDemographics.activeUsers / userDemographics.totalUsers) * 100)} active rate
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Active Chatbots</CardTitle>
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-purple-900">{formatNumber(chatbotMetrics.activeChatbots)}</div>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {formatNumber(chatbotMetrics.conversationsPerDay)} conv/day
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Satisfaction</CardTitle>
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Star className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-orange-900">{platformMetrics.userSatisfaction}/5</div>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Heart className="w-3 h-3 mr-1" />
                  User satisfaction score
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Business Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Business Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <span className="text-sm font-bold text-green-600">{formatPercentage(platformMetrics.conversionRate)}</span>
                  </div>
                  <Progress value={platformMetrics.conversionRate} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Churn Rate</span>
                    <span className="text-sm font-bold text-red-600">{formatPercentage(platformMetrics.churnRate)}</span>
                  </div>
                  <Progress value={platformMetrics.churnRate} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Feature Adoption</span>
                    <span className="text-sm font-bold text-blue-600">{formatPercentage(platformMetrics.featureAdoption)}</span>
                  </div>
                  <Progress value={platformMetrics.featureAdoption} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Response Time</span>
                    <span className="text-sm font-bold text-purple-600">{platformMetrics.averageResponseTime}h</span>
                  </div>
                  <Progress value={(platformMetrics.averageResponseTime / 24) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Revenue Analytics</span>
              </CardTitle>
              <CardDescription>
                Detailed revenue metrics and financial performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Revenue Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Total Revenue</span>
                      </div>
                      <span className="text-sm font-bold">{formatCurrency(platformMetrics.totalRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Monthly Recurring Revenue</span>
                      </div>
                      <span className="text-sm font-bold">{formatCurrency(platformMetrics.monthlyRecurringRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Avg Revenue Per User</span>
                      </div>
                      <span className="text-sm font-bold">{formatCurrency(platformMetrics.averageRevenuePerUser)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Customer Lifetime Value</span>
                      </div>
                      <span className="text-sm font-bold">{formatCurrency(platformMetrics.customerLifetimeValue)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Subscription Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(userDemographics.subscriptionPlans).map(([plan, count]) => (
                      <div key={plan} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{plan}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold">{formatNumber(count)}</span>
                          <Badge variant="outline" className="text-xs">
                            {formatPercentage((count / userDemographics.totalUsers) * 100)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>User Analytics</span>
              </CardTitle>
              <CardDescription>
                User demographics and behavior analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">User Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Total Users</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(userDemographics.totalUsers)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Active Users</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(userDemographics.activeUsers)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">New Users</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(userDemographics.newUsers)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Premium Users</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(userDemographics.premiumUsers)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Device Usage</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Desktop</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{userDemographics.deviceUsage.desktop}%</span>
                        <Progress value={userDemographics.deviceUsage.desktop} className="w-20 h-2" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Mobile</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{userDemographics.deviceUsage.mobile}%</span>
                        <Progress value={userDemographics.deviceUsage.mobile} className="w-20 h-2" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Tablet className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Tablet</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{userDemographics.deviceUsage.tablet}%</span>
                        <Progress value={userDemographics.deviceUsage.tablet} className="w-20 h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbots" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Chatbot Analytics</span>
              </CardTitle>
              <CardDescription>
                Chatbot performance and usage analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Chatbot Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Total Chatbots</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(chatbotMetrics.totalChatbots)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Active Chatbots</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(chatbotMetrics.activeChatbots)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Conversations/Day</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(chatbotMetrics.conversationsPerDay)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Avg Conversation Length</span>
                      </div>
                      <span className="text-sm font-bold">{chatbotMetrics.averageConversationLength} messages</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Top Industries</h3>
                  <div className="space-y-3">
                    {Object.entries(chatbotMetrics.topIndustries)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([industry, count]) => (
                      <div key={industry} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{industry}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold">{count}</span>
                          <Badge variant="outline" className="text-xs">
                            {formatPercentage((count / chatbotMetrics.totalChatbots) * 100)}
                          </Badge>
                        </div>
                      </div>
                    ))}
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