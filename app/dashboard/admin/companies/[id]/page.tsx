"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Building2, 
  Bot, 
  MessageSquare, 
  Users,
  CreditCard,
  Calendar,
  Mail,
  Globe,
  Activity,
  Settings
} from "lucide-react"

interface Company {
  id: string
  companyName: string
  email: string
  subscription: string
  chatbots: number
  conversations: number
  lastActive: string
  status: 'approved' | 'pending' | 'rejected' | 'active' | 'inactive'
  createdAt?: string
  website?: string
  phone?: string
  address?: string
}

interface Chatbot {
  id: string
  name: string
  status: 'active' | 'inactive'
  conversations: number
  lastActive: string
}

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadCompanyData(params.id as string)
    }
  }, [params.id])

  const loadCompanyData = async (companyId: string) => {
    try {
      // Load real company data from Firebase
      // TODO: Implement real company data with Firebase
      setCompany(null)
      setChatbots([])
    } catch (error) {
      console.error("Error loading company data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading company details...</p>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Company not found</p>
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
            <h1 className="text-3xl font-bold">{company.companyName}</h1>
            <p className="text-gray-500">Company Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
            {company.status}
          </Badge>
          <Badge variant="outline">{company.subscription}</Badge>
        </div>
      </div>

      {/* Company Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Company Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{company.email}</span>
            </div>
            {company.website && (
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-gray-400" />
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  {company.website}
                </a>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center space-x-3">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{company.phone}</span>
              </div>
            )}
            {company.address && (
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{company.address}</span>
              </div>
            )}
            {company.createdAt && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">Joined {company.createdAt}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Activity Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Chatbots</span>
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">{company.chatbots}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Conversations</span>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                <span className="font-semibold">{company.conversations.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Active</span>
              <span className="text-sm font-medium">{company.lastActive}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subscription</span>
              <Badge variant="outline">{company.subscription}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chatbots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>Company Chatbots</span>
          </CardTitle>
          <CardDescription>
            {chatbots.length} chatbots • {chatbots.filter(c => c.status === 'active').length} active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chatbots.map((chatbot) => (
              <div
                key={chatbot.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{chatbot.name}</h3>
                    <p className="text-sm text-gray-500">
                      {chatbot.conversations} conversations • Last active {chatbot.lastActive}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>
                    {chatbot.status}
                  </Badge>
                                     <Button 
                     variant="outline" 
                     size="sm"
                     className="hover:bg-transparent hover:border-gray-300"
                     onClick={() => router.push(`/dashboard/admin/companies/${company.id}/chatbots/${chatbot.id}`)}
                   >
                     View Details
                   </Button>
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
            Manage company settings and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button onClick={() => router.push(`/dashboard/admin/companies/${company.id}/navigation-settings`)}>
              <Settings className="w-4 h-4 mr-2" />
              Navigation Settings
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push(`/dashboard/admin/companies/${company.id}/users`)}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push(`/dashboard/admin/companies/${company.id}/billing`)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 