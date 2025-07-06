"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Bot, 
  Brain, 
  MessageCircle, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  Users,
  TrendingUp,
  Mail,
  Calendar,
  FileText,
  Search,
  Mic,
  Settings,
  Globe,
  Smartphone,
  Database,
  Palette,
  Code,
  Headphones,
  Plus,
  Sparkles,
  Activity,
  BarChart3,
  CreditCard
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { personalAIAgentPlans, aiAgentServices } from "@/lib/pricing-config"

interface PersonalAI {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive' | 'training'
  createdAt: string
  lastUsed: string
  conversations: number
  plan: string
  addons: string[]
}

export default function PersonalAIDashboard() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [personalAIs, setPersonalAIs] = useState<PersonalAI[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate loading personal AI data
    setTimeout(() => {
      setPersonalAIs([
        {
          id: "1",
          name: "Email Assistant",
          type: "Email Management",
          status: "active",
          createdAt: "2024-01-15",
          lastUsed: "2024-01-20",
          conversations: 45,
          plan: "Professional",
          addons: ["Calendar Optimization", "Document Assistant"]
        },
        {
          id: "2",
          name: "Research Helper",
          type: "Research Assistant",
          status: "active",
          createdAt: "2024-01-10",
          lastUsed: "2024-01-19",
          conversations: 23,
          plan: "Basic",
          addons: ["Custom Training"]
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const stats = {
    totalAIs: personalAIs.length,
    activeAIs: personalAIs.filter(ai => ai.status === 'active').length,
    totalConversations: personalAIs.reduce((sum, ai) => sum + ai.conversations, 0),
    proSubscriptions: personalAIs.filter(ai => ai.plan === 'Professional').length
  }

  const filteredAIs = personalAIs.filter(ai =>
    ai.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ai.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your AI assistants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Personal AI Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Brain className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">Personal AI Dashboard</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Manage your personal AI assistants and boost your productivity
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bot className="w-4 h-4" />
                  <span>{stats.totalAIs} AI assistants</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Brain className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total AI Assistants</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-blue-900">{stats.totalAIs}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats.activeAIs} active
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Conversations</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-green-900">{stats.totalConversations}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Activity className="w-3 h-3 mr-1" />
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Pro Subscriptions</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-purple-900">{stats.proSubscriptions}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <Star className="w-3 h-3 mr-1" />
              Premium features
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Productivity Score</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-orange-900">94%</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/personal-ai-agents')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Create New AI</CardTitle>
                <CardDescription>Set up a new personal AI assistant</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/personal-ai/templates')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Templates</CardTitle>
                <CardDescription>Browse pre-built AI templates</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/personal-ai/settings')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>Manage your AI preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* AI Assistants List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your AI Assistants</h2>
            <p className="text-muted-foreground">Manage and interact with your personal AI assistants</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search AI assistants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={() => router.push('/personal-ai-agents')}>
              <Plus className="w-4 h-4 mr-2" />
              Add AI Assistant
            </Button>
          </div>
        </div>

        {filteredAIs.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No AI assistants yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Create your first personal AI assistant to boost your productivity
            </p>
            <Button onClick={() => router.push('/personal-ai-agents')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First AI
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAIs.map((ai) => (
              <Card key={ai.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/dashboard/personal-ai/${ai.id}`)}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <Badge 
                      variant={ai.status === 'active' ? 'default' : 'secondary'}
                      className={ai.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                    >
                      {ai.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{ai.name}</CardTitle>
                  <CardDescription>{ai.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>{ai.conversations} conversations</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Last used {ai.lastUsed}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Plan:</span>
                      <Badge variant="outline">{ai.plan}</Badge>
                    </div>
                    {ai.addons.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Addons:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ai.addons.map((addon, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {addon}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button className="w-full" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with AI
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 