"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  CreditCard, 
  Receipt,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  Eye
} from "lucide-react"

interface Company {
  id: string
  companyName: string
  email: string
  subscription: string
  status: 'approved' | 'pending' | 'rejected' | 'active' | 'inactive'
}

interface BillingInfo {
  currentPlan: string
  monthlyAmount: number
  nextBillingDate: string
  paymentMethod: string
  cardLast4: string
  status: 'active' | 'past_due' | 'cancelled'
  usage: {
    chatbots: number
    conversations: number
    storage: number
  }
  limits: {
    chatbots: number
    conversations: number
    storage: number
  }
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  description: string
  invoiceNumber: string
}

export default function CompanyBillingPage() {
  const params = useParams()
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
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
      setBillingInfo(null)
      setInvoices([])
    } catch (error) {
      console.error("Error loading company data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default'
      case 'pending': return 'secondary'
      case 'overdue': return 'destructive'
      default: return 'outline'
    }
  }

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading billing information...</p>
        </div>
      </div>
    )
  }

  if (!company || !billingInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Billing information not found</p>
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
            <h1 className="text-3xl font-bold">Billing & Subscription</h1>
            <p className="text-gray-500">{company.companyName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
            {company.status}
          </Badge>
          <Badge variant="outline">{company.subscription}</Badge>
        </div>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Current Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Plan</span>
                <span className="font-semibold">{billingInfo.currentPlan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monthly Amount</span>
                <span className="font-semibold">${billingInfo.monthlyAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next Billing</span>
                <span className="font-semibold">{billingInfo.nextBillingDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Method</span>
                <span className="font-semibold">{billingInfo.paymentMethod} •••• {billingInfo.cardLast4}</span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Usage</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Chatbots</span>
                    <span>{billingInfo.usage.chatbots}/{billingInfo.limits.chatbots}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{width: `${getUsagePercentage(billingInfo.usage.chatbots, billingInfo.limits.chatbots)}%`}}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Conversations</span>
                    <span>{billingInfo.usage.conversations.toLocaleString()}/{billingInfo.limits.conversations.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{width: `${getUsagePercentage(billingInfo.usage.conversations, billingInfo.limits.conversations)}%`}}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Storage</span>
                    <span>{billingInfo.usage.storage}GB/{billingInfo.limits.storage}GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{width: `${getUsagePercentage(billingInfo.usage.storage, billingInfo.limits.storage)}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5" />
                <span>Invoices</span>
              </CardTitle>
              <CardDescription>
                Recent billing history and invoices
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{invoice.description}</h3>
                    <p className="text-sm text-gray-500">{invoice.invoiceNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">${invoice.amount}</span>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
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
            Manage billing and subscription settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button>
              <CreditCard className="w-4 h-4 mr-2" />
              Update Payment Method
            </Button>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Billing History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 