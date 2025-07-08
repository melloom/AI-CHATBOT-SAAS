"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, MessageSquare, CreditCard, Plus, Users, TrendingUp, Clock, Zap, Target, Settings, Brain, Globe, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useChatbots } from "@/hooks/use-chatbots"
import { useSubscription } from "@/hooks/use-subscription"
import { useDashboardAnalytics } from "@/hooks/use-analytics"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Crown } from "lucide-react"
import { useImpersonation } from "@/components/providers/impersonation-provider"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ReadOnlyIndicator } from "@/components/ui/read-only-indicator"

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const { chatbots } = useChatbots()
  const { subscription } = useSubscription()
  const { getTodayConversations, getConversationGrowth, getSuccessRate } = useDashboardAnalytics()
  const { 
    impersonatedCompany, 
    setImpersonatedCompany, 
    impersonationMode, 
    setImpersonationMode,
    isImpersonating,
    canEdit
  } = useImpersonation()
  const [companies, setCompanies] = useState<any[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [editCompanyName, setEditCompanyName] = useState("")
  const [loadingCompanies, setLoadingCompanies] = useState(false)

  // Load companies for admin
  useEffect(() => {
    if (profile?.isAdmin) {
      loadCompanies()
    }
  }, [profile])

  const loadCompanies = async () => {
    setLoadingCompanies(true)
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("role", "!=", "admin"))
      const querySnapshot = await getDocs(q)
      
      const companiesData: any[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        companiesData.push({
          id: doc.id,
          companyName: data.companyName || "Unknown Company",
          email: data.email,
          subscription: data.subscription?.plan || "Free",
          chatbots: data.chatbots?.length || 0,
          conversations: data.conversations?.length || 0,
          lastActive: data.lastActive || "Never",
          status: data.status || "active"
        })
      })
      
      setCompanies(companiesData)
    } catch (error) {
      console.error("Error loading companies:", error)
      // No fallback data - show empty state
      setCompanies([])
    } finally {
      setLoadingCompanies(false)
    }
  }

  const isWebVaultOnly = profile?.platforms && Object.keys(profile.platforms).length === 1 && profile.platforms.webvault?.access;
  const quickActions = profile?.accountType === 'personal' ? [
    {
      title: "Create AI Assistant",
      description: "Build your personal AI assistant in minutes",
      icon: Plus,
      href: "/dashboard/personal-ai/create",
      gradient: "gradient-bg-1",
      badge: "Popular",
    },
    {
      title: "Browse Templates",
      description: "Ready-made AI assistant templates",
      icon: Bot,
      href: "/dashboard/personal-ai/templates",
      gradient: "gradient-bg-2",
      badge: "New",
    },
    {
      title: "Upgrade Plan",
      description: "Unlock advanced AI features and higher limits",
      icon: CreditCard,
      href: "/dashboard/billing",
      gradient: "gradient-bg-3",
      badge: "Recommended",
    },
    {
      title: "AI Settings",
      description: "Customize your AI preferences and behavior",
      icon: Settings,
      href: "/dashboard/personal-ai/settings",
      gradient: "gradient-bg-4",
      badge: null,
    },
  ] : isWebVaultOnly ? [
    {
      title: "Request New Web App",
      description: "Submit a request for a new website or web application",
      icon: Plus,
      href: "/dashboard/web-building/quote",
      gradient: "gradient-bg-1",
      badge: "Popular",
    },
    {
      title: "Manage Websites",
      description: "View and manage your existing websites",
      icon: Globe,
      href: "/dashboard/web-building",
      gradient: "gradient-bg-2",
      badge: "Manage",
    },
    {
      title: "Website Analytics",
      description: "Track your website performance and analytics",
      icon: BarChart3,
      href: "/dashboard/web-building/analytics",
      gradient: "gradient-bg-3",
      badge: "New",
    },
    {
      title: "WebVault Settings",
      description: "Configure your WebVault account and preferences",
      icon: Settings,
      href: "/dashboard/web-building/settings",
      gradient: "gradient-bg-4",
      badge: null,
    },
  ] : [
    {
      title: "Create Your First Bot",
      description: "Launch an AI assistant in under 5 minutes",
      icon: Plus,
      href: "/dashboard/chatbots",
      gradient: "gradient-bg-1",
      badge: "Popular",
    },
    {
      title: "Browse Templates",
      description: "Ready-made solutions for every industry",
      icon: Bot,
      href: "/dashboard/marketplace",
      gradient: "gradient-bg-2",
      badge: "New",
    },
    {
      title: "Upgrade Plan",
      description: "Unlock advanced features and higher limits",
      icon: CreditCard,
      href: "/dashboard/billing",
      gradient: "gradient-bg-3",
      badge: "Recommended",
    },
    {
      title: "Invite Team",
      description: "Collaborate with your team members",
      icon: Users,
      href: "/dashboard/team",
      gradient: "gradient-bg-4",
      badge: null,
    },
  ]

  const recentActivities = profile?.accountType === 'personal' ? [
    {
      icon: MessageSquare,
      title: "No recent activity",
      description: "Your AI assistants are ready to help",
      time: "Just now",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    }
  ] : isWebVaultOnly ? [
    {
      icon: Globe,
      title: "No recent activity",
      description: "Your WebVault dashboard is ready",
      time: "Just now",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    }
  ] : [
    {
      icon: MessageSquare,
      title: "No recent activity",
      description: "Your ChatHub dashboard is ready",
      time: "Just now",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    }
  ]

  // Render custom admin dashboard if admin and not impersonating
  if (profile?.isAdmin && !impersonatedCompany) {
    return (
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-pink-600 to-blue-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome, Admin!
              </h1>
              <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                <Crown className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium text-yellow-300">Admin</span>
              </div>
            </div>
            <p className="text-lg text-white/90 mb-4">
              This is your admin dashboard. Use the "View as" dropdown to impersonate a company, or manage the platform below.
            </p>
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-white/80" />
              <ReadOnlyIndicator isReadOnly={!canEdit} className="text-white/80" />
              <button 
                onClick={() => {
                  if (isImpersonating) {
                    // If already impersonating, toggle between view and edit modes
                    setImpersonationMode(impersonationMode === 'view' ? 'edit' : 'view')
                  } else {
                    // If not impersonating, start in view mode
                    setIsEditMode(!isEditMode)
                  }
                }}
                disabled={!canEdit}
                className={`text-sm transition-colors cursor-pointer underline decoration-dotted underline-offset-4 ${
                  canEdit 
                    ? 'text-white/80 hover:text-white' 
                    : 'text-white/40 cursor-not-allowed'
                }`}
                title={!canEdit ? "Read-only mode: Cannot switch to edit mode" : ""}
              >
                {isImpersonating 
                  ? (impersonationMode === 'edit' ? "Editing as:" : "Viewing as:")
                  : (isEditMode ? "Editing as:" : "Viewing as:")
                }
              </button>
              {isImpersonating && (
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    impersonationMode === 'edit' 
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {impersonationMode === 'edit' ? 'Edit Mode' : 'View Mode'}
                  </div>
                </div>
              )}
              {isEditMode && !isImpersonating && (
                <Input 
                  value={editCompanyName || (impersonatedCompany?.companyName || "My Dashboard")}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  placeholder="Enter company name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (editCompanyName && editCompanyName.trim()) {
                        // Update the impersonated company name
                        if (impersonatedCompany) {
                          setImpersonatedCompany({
                            ...impersonatedCompany,
                            companyName: editCompanyName.trim()
                          })
                        }
                        setIsEditMode(false)
                        setEditCompanyName("")
                      }
                    } else if (e.key === 'Escape') {
                      setIsEditMode(false)
                      setEditCompanyName("")
                    }
                  }}
                  onBlur={() => {
                    if (editCompanyName && editCompanyName.trim()) {
                      // Update the impersonated company name
                      if (impersonatedCompany) {
                        setImpersonatedCompany({
                          ...impersonatedCompany,
                          companyName: editCompanyName.trim()
                        })
                      }
                      setIsEditMode(false)
                      setEditCompanyName("")
                    } else {
                      setIsEditMode(false)
                      setEditCompanyName("")
                    }
                  }}
                />
              )}
              <Select value={impersonatedCompany?.id || "self"} onValueChange={(value) => {
                if (value === "self") {
                  setImpersonatedCompany(null)
                  setImpersonationMode('view')
                  setIsEditMode(false)
                } else {
                  const company = companies.find(c => c.id === value)
                  setImpersonatedCompany(company)
                  // Set mode based on current edit state
                  setImpersonationMode(isEditMode ? 'edit' : 'view')
                  setIsEditMode(false)
                }
              }}>
                <SelectTrigger className="w-64 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select a company to view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">My Dashboard</SelectItem>
                  {loadingCompanies ? (
                    <SelectItem value="loading" disabled>
                      Loading companies...
                    </SelectItem>
                  ) : (
                    companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.companyName} ({company.subscription})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {/* Admin widgets placeholder */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Company Management</CardTitle>
              <CardDescription>View and manage all companies</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => window.location.href = "/admin/companies"}>
                Go to Company Management
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Platform Stats</CardTitle>
              <CardDescription>See platform-wide analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Companies</span>
                  <span className="font-semibold">{companies.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Subscriptions</span>
                  <span className="font-semibold">{companies.filter(c => c.status === 'active').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Chatbots</span>
                  <span className="font-semibold">{companies.reduce((sum, c) => sum + c.chatbots, 0)}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => window.location.href = "/admin/analytics"}>
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Admin Quick Links</CardTitle>
              <CardDescription>Access admin tools and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" onClick={() => window.location.href = "/admin/companies"}>Manage Companies</Button>
                <Button variant="outline" onClick={() => window.location.href = "/admin/users"}>Manage Users</Button>
                <Button variant="outline" onClick={() => window.location.href = "/admin/settings"}>Platform Settings</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {profile?.accountType === 'personal'
                    ? `Welcome back to Personal AI, ${profile?.firstName || profile?.lastName || "there"}! 👋`
                    : (profile?.platforms && Object.keys(profile.platforms).length === 1 && profile.platforms.webvault?.access)
                      ? `Welcome back to WebVault, ${profile?.companyName || "there"}! 👋`
                      : `Welcome back to ChatHub, ${impersonatedCompany?.companyName || profile?.companyName || "there"}! 👋`
                  }
                </h1>
                {profile?.isAdmin && (
                  <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                    <Crown className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium text-yellow-300">Admin</span>
                  </div>
                )}
              </div>
              <p className="text-lg text-white/90 mb-4">
                {profile?.accountType === 'personal'
                  ? "Your personal AI assistants are working hard. Here's what's happening today."
                  : (profile?.platforms && Object.keys(profile.platforms).length === 1 && profile.platforms.webvault?.access)
                    ? "Manage your websites and web apps with WebVault. Here's what's happening today."
                    : "Your AI chatbots are working hard. Here's what's happening today."
                }
              </p>
              

              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: just now</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              {profile?.accountType === 'personal' ? 'Active AI Assistants' : 'Active Chatbots'}
            </CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-blue-900">
              {profile?.accountType === 'personal' ? '2' : (profile?.isAdmin && impersonatedCompany ? impersonatedCompany.chatbots : chatbots.length)}
            </div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {profile?.accountType === 'personal' 
                ? '2 currently active' 
                : (profile?.isAdmin && impersonatedCompany ? `${impersonatedCompany.chatbots} total` : `${chatbots.filter((bot) => bot.active).length} currently active`)
              }
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              {profile?.accountType === 'personal' ? 'AI Interactions Today' : 'Conversations Today'}
            </CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-green-900">
              {profile?.accountType === 'personal' ? '68' : (profile?.isAdmin && impersonatedCompany ? impersonatedCompany.conversations : getTodayConversations().length)}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {profile?.accountType === 'personal' 
                ? '+12% from yesterday' 
                : (profile?.isAdmin && impersonatedCompany ? "Total conversations" : getTodayConversations().length > 0 ? `+${getConversationGrowth()}% from yesterday` : "No conversations yet")
              }
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Current Plan</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-purple-900">
              <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">
                {profile?.isAdmin && impersonatedCompany ? impersonatedCompany.subscription : (subscription?.plan || "Free Plan")}
              </Badge>
            </div>
            <p className="text-xs text-purple-600 mt-1">
              {profile?.isAdmin && impersonatedCompany ? "Selected company plan" : (subscription?.daysLeft ? `${subscription.daysLeft} days left` : "No active subscription")}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Success Rate</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-orange-900">
              {profile?.accountType === 'personal' ? '95.2%' : `${getSuccessRate()}%`}
            </div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Zap className="w-3 h-3 mr-1" />
              {profile?.accountType === 'personal' ? 'Resolution accuracy' : getSuccessRate() > 0 ? 'Resolution accuracy' : 'No data available'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-200">Get started with these popular tasks</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 overflow-hidden">
                <div className={`h-2 ${action.gradient}`}></div>
                <CardHeader className="relative">
                  {action.badge && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">{action.badge}</Badge>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-sm">{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Enhanced Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                {profile?.accountType === 'personal' ? 'Recent AI Activity' : 'Recent Activity'}
              </CardTitle>
              <CardDescription className="dark:text-gray-200">
                {profile?.accountType === 'personal' 
                  ? 'Latest updates from your personal AI assistants' 
                  : 'Latest updates from your AI assistants'
                }
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="bg-white dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-700">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {recentActivities.map((activity, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${activity.bgColor}`}> 
                    <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-200 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-300 mt-2">{activity.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
