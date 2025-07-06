"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Bot, 
  Crown, 
  Search,
  Eye,
  Settings,
  Plus,
  MessageSquare,
  Users
} from "lucide-react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Chatbot {
  id: string
  name: string
  companyName: string
  status: 'active' | 'inactive' | 'draft'
  conversations: number
  lastActive: string
  type: 'customer-support' | 'sales' | 'general'
  companyId: string
}

export default function AdminChatbotsPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadChatbots()
  }, [])

  const loadChatbots = async () => {
    try {
      setLoading(true)
      console.log("Loading all chatbots from Firebase...")
      
      const chatbotsRef = collection(db, "chatbots")
      const q = query(chatbotsRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      
      const chatbotsData: Chatbot[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        chatbotsData.push({
          id: doc.id,
          name: data.name || "Unnamed Bot",
          companyName: data.companyName || "Unknown Company",
          status: data.active ? 'active' : 'inactive',
          conversations: data.conversations || 0,
          lastActive: data.lastActive || "Never",
          type: data.type || 'general',
          companyId: data.companyId || ""
        })
      })
      
      console.log(`Loaded ${chatbotsData.length} chatbots from Firebase`)
      setChatbots(chatbotsData)
    } catch (error) {
      console.error("Error loading chatbots:", error)
      setChatbots([])
    } finally {
      setLoading(false)
    }
  }

  const filteredChatbots = chatbots.filter(chatbot =>
    chatbot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chatbot.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    totalChatbots: chatbots.length,
    activeChatbots: chatbots.filter(c => c.status === 'active').length,
    totalConversations: chatbots.reduce((sum, c) => sum + c.conversations, 0),
    customerSupport: chatbots.filter(c => c.type === 'customer-support').length,
    sales: chatbots.filter(c => c.type === 'sales').length,
    general: chatbots.filter(c => c.type === 'general').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading chatbots...</p>
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
                <Crown className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">Chatbot Management</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Manage all chatbots across the platform
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Platform operational</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bot className="w-4 h-4" />
                  <span>{stats.totalChatbots} chatbots</span>
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

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Chatbots</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-blue-900">{stats.totalChatbots}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <MessageSquare className="w-3 h-3 mr-1" />
              {stats.activeChatbots} active
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Conversations</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-green-900">{stats.totalConversations.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Bot className="w-3 h-3 mr-1" />
              Across all chatbots
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Customer Support</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-purple-900">{stats.customerSupport}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <Bot className="w-3 h-3 mr-1" />
              Support chatbots
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Sales Bots</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-orange-900">{stats.sales}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Bot className="w-3 h-3 mr-1" />
              Sales chatbots
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search chatbots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chatbots Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChatbots.map((chatbot) => (
          <Card key={chatbot.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                    <p className="text-sm text-gray-500">{chatbot.companyName}</p>
                  </div>
                </div>
                <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>
                  {chatbot.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type</span>
                <Badge variant="outline">{chatbot.type}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Conversations</span>
                <Badge variant="outline">{chatbot.conversations.toLocaleString()}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Active</span>
                <span className="text-sm text-gray-500">{chatbot.lastActive}</span>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChatbots.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chatbots found</h3>
            <p className="text-gray-500 mb-4">
              {chatbots.length === 0 
                ? "No chatbots have been created yet." 
                : "No chatbots match your search criteria."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 