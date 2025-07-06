"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Bot, 
  MessageSquare, 
  Activity,
  Settings,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  BarChart
} from "lucide-react"

interface Chatbot {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'training'
  conversations: number
  lastActive: string
  createdAt: string
  model: string
  accuracy: number
  responseTime: number
  companyId: string
  companyName: string
}

interface Conversation {
  id: string
  timestamp: string
  userMessage: string
  botResponse: string
  rating?: number
  duration: number
}

export default function ChatbotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [chatbot, setChatbot] = useState<Chatbot | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.chatbotId && params.id) {
      loadChatbotData(params.chatbotId as string, params.id as string)
    }
  }, [params.chatbotId, params.id])

  const loadChatbotData = async (chatbotId: string, companyId: string) => {
    try {
      // Load real chatbot data from Firebase
      // TODO: Implement real chatbot data with Firebase
      setChatbot(null)
      setConversations([])
    } catch (error) {
      console.error("Error loading chatbot data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading chatbot details...</p>
        </div>
      </div>
    )
  }

  if (!chatbot) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Chatbot not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{chatbot.name}</h1>
            <p className="text-gray-500">{chatbot.companyName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>
            {chatbot.status}
          </Badge>
          <Badge variant="outline">{chatbot.model}</Badge>
        </div>
      </div>

      {/* Chatbot Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>Chatbot Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm text-gray-600">{chatbot.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{chatbot.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">{chatbot.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Active</p>
                <p className="font-medium">{chatbot.lastActive}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Conversations</p>
                <p className="font-medium">{chatbot.conversations.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Accuracy</span>
              <div className="flex items-center space-x-2">
                <BarChart className="w-4 h-4 text-green-500" />
                <span className="font-semibold">{chatbot.accuracy}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Response Time</span>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">{chatbot.responseTime}s</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>
                {chatbot.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Recent Conversations</span>
          </CardTitle>
          <CardDescription>
            Latest interactions with this chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {conversation.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">Rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < conversation.rating! ? "text-yellow-400" : "text-gray-300"}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <span className="text-sm text-gray-500">{conversation.duration}s</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">User:</p>
                    <p className="text-sm">{conversation.userMessage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Bot:</p>
                    <p className="text-sm">{conversation.botResponse}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Manage chatbot settings and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Configure Bot
            </Button>
            <Button variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Training Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 