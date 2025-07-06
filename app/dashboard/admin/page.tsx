"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Building2, 
  CreditCard, 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  Search,
  Eye,
  Settings,
  Crown
} from "lucide-react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { registerBackgroundRefresh, unregisterBackgroundRefresh } from "@/lib/background-refresh"

interface Company {
  id: string
  companyName: string
  email: string
  subscription: string
  chatbots: number
  conversations: number
  lastActive: string
  status: 'approved' | 'pending' | 'rejected' | 'active' | 'inactive'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadCompanies()
    
    // Set up background refresh every 30 seconds
    registerBackgroundRefresh('admin-dashboard', loadCompanies, 30000)
    
    return () => {
      unregisterBackgroundRefresh('admin-dashboard')
    }
  }, [])

  const loadCompanies = async () => {
    try {
      const companiesRef = collection(db, "companies")
      const querySnapshot = await getDocs(companiesRef)
      
      const companiesData: Company[] = []
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
          status: data.approvalStatus || "pending"
        })
      })
      
      setCompanies(companiesData)
    } catch (error) {
      console.error("Error loading companies:", error)
      // No fallback data - show empty state
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    totalCompanies: companies.length,
    approvedCompanies: companies.filter(c => c.status === 'approved').length,
    pendingCompanies: companies.filter(c => c.status === 'pending').length,
    rejectedCompanies: companies.filter(c => c.status === 'rejected').length,
    activeCompanies: companies.filter(c => c.status === 'active').length,
    totalChatbots: companies.reduce((sum, c) => sum + c.chatbots, 0),
    totalConversations: companies.reduce((sum, c) => sum + c.conversations, 0),
    proSubscriptions: companies.filter(c => c.subscription === 'Pro').length,
    enterpriseSubscriptions: companies.filter(c => c.subscription === 'Enterprise').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Manage all ChatHub companies and monitor platform performance
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Platform operational</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{stats.totalCompanies} companies</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-16 h-16 text-white" />
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
            <CardTitle className="text-sm font-medium text-blue-800">Total Companies</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Building2 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-blue-900">{stats.totalCompanies}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats.activeCompanies} active
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Chatbots</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-green-900">{stats.totalChatbots}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <MessageSquare className="w-3 h-3 mr-1" />
              Across all companies
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
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats.enterpriseSubscriptions} enterprise
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Total Conversations</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-orange-900">{stats.totalConversations.toLocaleString()}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Platform-wide
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Companies</CardTitle>
              <CardDescription>
                Overview of all companies using ChatHub
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{company.companyName}</h3>
                    <p className="text-sm text-gray-500">{company.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                        {company.status}
                      </Badge>
                      <Badge variant="outline">{company.subscription}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {company.chatbots} chatbots • {company.conversations} conversations
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-transparent hover:border-gray-300"
                      onClick={() => router.push(`/dashboard/admin/companies/${company.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-transparent hover:border-gray-300"
                      onClick={() => router.push(`/dashboard/admin/companies/${company.id}/navigation-settings`)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
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