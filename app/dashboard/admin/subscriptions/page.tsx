"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  CreditCard, 
  Crown, 
  Search,
  Eye,
  Settings,
  Plus,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Filter,
  ArrowRight,
  Building2
} from "lucide-react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Subscription {
  id: string
  companyId: string
  companyName: string
  plan: 'Free' | 'Starter' | 'Pro' | 'Enterprise'
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  amount: number
  currency: string
  nextBilling: string
  startDate: string
  users: number
  features: string[]
  createdAt: string
  updatedAt: string
}

const categories = ["All", "Active", "Trialing", "Cancelled", "Past Due"]

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const router = useRouter()

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      console.log("Loading all subscriptions from Firebase...")
      
      const companiesRef = collection(db, "companies")
      const q = query(companiesRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      
      const subscriptionsData: Subscription[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.subscription) {
          subscriptionsData.push({
            id: doc.id,
            companyId: doc.id,
            companyName: data.companyName || "Unknown Company",
            plan: data.subscription.plan || "Free",
            status: data.subscription.status || "active",
            amount: data.subscription.amount || 0,
            currency: data.subscription.currency || "USD",
            nextBilling: data.subscription.nextBilling || "N/A",
            startDate: data.subscription.startDate || data.createdAt,
            users: data.users?.length || 0,
            features: data.subscription.features || [],
            createdAt: data.createdAt,
            updatedAt: data.updatedAt || data.createdAt
          })
        }
      })
      
      console.log(`Loaded ${subscriptionsData.length} subscriptions from Firebase`)
      setSubscriptions(subscriptionsData)
    } catch (error) {
      console.error("Error loading subscriptions:", error)
      setSubscriptions([])
    } finally {
      setLoading(false)
    }
  }

  const getGradientClass = (index: number) => {
    const gradients = [
      "bg-gradient-to-r from-blue-500 to-purple-600",
      "bg-gradient-to-r from-green-500 to-teal-600",
      "bg-gradient-to-r from-orange-500 to-red-600",
      "bg-gradient-to-r from-purple-500 to-pink-600",
      "bg-gradient-to-r from-indigo-500 to-blue-600",
      "bg-gradient-to-r from-emerald-500 to-green-600"
    ]
    return gradients[index % gradients.length]
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Enterprise': return '👑'
      case 'Pro': return '⭐'
      case 'Starter': return '🚀'
      default: return '🆓'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'trialing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'past_due': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getFeatures = (subscription: Subscription) => {
    const features = []
    if (subscription.users > 0) features.push(`${subscription.users} users`)
    if (subscription.amount > 0) features.push(`$${subscription.amount}/month`)
    if (subscription.plan !== 'Free') features.push(subscription.plan)
    return features
  }

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.plan.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || subscription.status === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const stats = {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    totalRevenue: subscriptions.reduce((sum, s) => sum + s.amount, 0),
    proSubscriptions: subscriptions.filter(s => s.plan === 'Pro').length,
    enterpriseSubscriptions: subscriptions.filter(s => s.plan === 'Enterprise').length,
    totalUsers: subscriptions.reduce((sum, s) => sum + s.users, 0)
  }

  const handleViewSubscription = (subscription: Subscription) => {
    router.push(`/dashboard/admin/companies/${subscription.companyId}/subscription`)
  }

  const handleManageSubscription = (subscription: Subscription) => {
    router.push(`/dashboard/admin/companies/${subscription.companyId}/subscription/settings`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading subscriptions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">Subscription Management</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Manage all subscriptions and billing across the platform
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Platform operational</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CreditCard className="w-4 h-4" />
                  <span>{stats.totalSubscriptions} subscriptions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${stats.totalRevenue.toLocaleString()}/month</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CreditCard className="w-16 h-16 text-white" />
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
            <CardTitle className="text-sm font-medium text-blue-800">Total Subscriptions</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-blue-900">{stats.totalSubscriptions}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats.activeSubscriptions} active
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Monthly Revenue</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-green-900">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Monthly recurring
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Pro Plans</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <Star className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-purple-900">{stats.proSubscriptions}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <Crown className="w-3 h-3 mr-1" />
              {stats.enterpriseSubscriptions} enterprise
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Total Users</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-orange-900">{stats.totalUsers}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Users className="w-3 h-3 mr-1" />
              Across all plans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search subscriptions by company or plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubscriptions.map((subscription, index) => (
          <Card
            key={subscription.id}
            className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
          >
            {/* Gradient header */}
            <div className={`h-2 ${getGradientClass(index)}`}></div>

            <CardHeader className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{getPlanIcon(subscription.plan)}</div>
                <div className="text-right">
                  <Badge className={`text-xs ${getStatusColor(subscription.status)}`}>
                    {subscription.status}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-xl group-hover:text-purple-600 transition-colors text-gray-900 dark:text-white">
                {subscription.companyName}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {subscription.plan} Plan • {subscription.users} users
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Quick stats */}
              <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-200">
                    Next: {subscription.nextBilling}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs dark:text-gray-200">
                  ${subscription.amount}/month
                </Badge>
              </div>

              {/* Plan details */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    ${subscription.amount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Monthly</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {subscription.users}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Users</div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Plan Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {getFeatures(subscription).slice(0, 3).map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                      {feature}
                    </Badge>
                  ))}
                  {getFeatures(subscription).length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                      +{getFeatures(subscription).length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewSubscription(subscription)}
                  className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleManageSubscription(subscription)}
                  className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>

              {/* Company details button */}
              <Button
                size="sm"
                className={`w-full ${getGradientClass(index)} text-white hover:opacity-90 transition-all duration-300 group-hover:scale-105`}
                onClick={() => router.push(`/dashboard/admin/companies/${subscription.companyId}`)}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Company Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubscriptions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
            <p className="text-gray-500 mb-4">
              {subscriptions.length === 0 
                ? "No subscriptions have been created yet." 
                : "No subscriptions match your search criteria."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 