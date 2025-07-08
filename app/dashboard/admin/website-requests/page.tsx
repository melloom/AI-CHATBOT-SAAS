"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Globe, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Settings,
  Bot,
  CreditCard,
  Database,
  Smartphone,
  Lock,
  BarChart3,
  MessageSquare as Blog,
  Mail as Contact,
  Calendar as Appointment,
  Search as SEO,
  Share2,
  Languages,
  Plus,
  Edit,
  Trash2,
  Archive,
  RefreshCw,
  Download,
  Send,
  Reply,
  Star,
  TrendingUp,
  Users as Team,
  Building2,
  Crown,
  Wrench
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { collection, getDocs, query, where, orderBy, updateDoc, doc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { registerBackgroundRefresh, unregisterBackgroundRefresh } from "@/lib/background-refresh"

interface WebsiteRequest {
  id: string
  projectName: string
  description: string
  businessType: string
  targetAudience: string
  features: string[]
  timeline: string
  budget: string
  contactEmail: string
  phoneNumber: string
  additionalNotes: string
  projectType: string
  priority: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'in-progress' | 'completed'
  submittedAt: Timestamp
  reviewedAt?: Timestamp
  reviewedBy?: string
  adminNotes?: string
  estimatedCost?: number
  assignedTo?: string
  companyId?: string
  companyName?: string
  userId?: string
  userName?: string
  approvedAt?: Timestamp
  completedAt?: Timestamp
}

interface FeatureOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  estimatedCost: string
}

export default function WebsiteRequestsPage() {
  const [requests, setRequests] = useState<WebsiteRequest[]>([])
  const [serviceRequests, setServiceRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<WebsiteRequest | null>(null)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<string>("")
  const [adminNotes, setAdminNotes] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [activeTab, setActiveTab] = useState<'website' | 'service'>('website')

  const featureOptions: FeatureOption[] = [
    { id: "responsive-design", name: "Responsive Design", description: "Works perfectly on all devices", icon: <Settings className="h-4 w-4" />, category: "Core", estimatedCost: "$500" },
    { id: "user-auth", name: "User Authentication", description: "Secure login and user management", icon: <Lock className="h-4 w-4" />, category: "Core", estimatedCost: "$800" },
    { id: "admin-panel", name: "Admin Panel", description: "Easy content and user management", icon: <Settings className="h-4 w-4" />, category: "Core", estimatedCost: "$1,200" },
    { id: "ecommerce", name: "E-commerce Integration", description: "Complete online store functionality", icon: <Globe className="h-4 w-4" />, category: "E-commerce", estimatedCost: "$2,500" },
    { id: "payment-processing", name: "Payment Processing", description: "Secure payment gateway integration", icon: <CreditCard className="h-4 w-4" />, category: "E-commerce", estimatedCost: "$1,500" },
    { id: "cms", name: "Content Management", description: "Easy content updates and management", icon: <FileText className="h-4 w-4" />, category: "Content", estimatedCost: "$1,000" },
    { id: "blog", name: "Blog/News Section", description: "Publish articles and updates", icon: <Blog className="h-4 w-4" />, category: "Content", estimatedCost: "$800" },
    { id: "contact-forms", name: "Contact Forms", description: "Lead generation and customer contact", icon: <Contact className="h-4 w-4" />, category: "Communication", estimatedCost: "$300" },
    { id: "appointment-booking", name: "Appointment Booking", description: "Schedule appointments and consultations", icon: <Appointment className="h-4 w-4" />, category: "Communication", estimatedCost: "$1,500" },
    { id: "analytics", name: "Analytics Dashboard", description: "Track performance and user behavior", icon: <BarChart3 className="h-4 w-4" />, category: "Analytics", estimatedCost: "$600" },
    { id: "seo", name: "SEO Optimization", description: "Improve search engine visibility", icon: <SEO className="h-4 w-4" />, category: "Analytics", estimatedCost: "$400" },
    { id: "social-media", name: "Social Media Integration", description: "Connect with social platforms", icon: <Share2 className="h-4 w-4" />, category: "Advanced", estimatedCost: "$500" },
    { id: "multi-language", name: "Multi-language Support", description: "Support for multiple languages", icon: <Languages className="h-4 w-4" />, category: "Advanced", estimatedCost: "$1,200" },
    { id: "api-integration", name: "API Integration", description: "Connect with external services", icon: <Database className="h-4 w-4" />, category: "Advanced", estimatedCost: "$1,500" },
    { id: "mobile-app", name: "Mobile App", description: "Native mobile application", icon: <Smartphone className="h-4 w-4" />, category: "Advanced", estimatedCost: "$5,000" }
  ]

  useEffect(() => {
    loadRequests()
    
    // Set up background refresh every 30 seconds
    registerBackgroundRefresh('website-requests', loadRequests, 30000)
    
    return () => {
      unregisterBackgroundRefresh('website-requests')
    }
  }, [])

  const loadRequests = async () => {
    try {
      // Load website requests
      const requestsRef = collection(db, "websiteRequests")
      const q = query(requestsRef, orderBy("submittedAt", "desc"))
      const querySnapshot = await getDocs(q)
      
      const requestsData: WebsiteRequest[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        requestsData.push({
          id: doc.id,
          projectName: data.projectName || "Unknown Project",
          description: data.description || "",
          businessType: data.businessType || "",
          targetAudience: data.targetAudience || "",
          features: data.features || [],
          timeline: data.timeline || "",
          budget: data.budget || "",
          contactEmail: data.contactEmail || "",
          phoneNumber: data.phoneNumber || "",
          additionalNotes: data.additionalNotes || "",
          projectType: data.projectType || "",
          priority: data.priority || "",
          status: data.status || "pending",
          submittedAt: data.submittedAt || Timestamp.now(),
          reviewedAt: data.reviewedAt,
          reviewedBy: data.reviewedBy,
          adminNotes: data.adminNotes,
          estimatedCost: data.estimatedCost,
          assignedTo: data.assignedTo,
          companyId: data.companyId,
          companyName: data.companyName,
          userId: data.userId,
          userName: data.userName
        })
      })
      
      setRequests(requestsData)

      // Load service requests
      const serviceRequestsRef = collection(db, "serviceRequests")
      const serviceQ = query(serviceRequestsRef, orderBy("submittedAt", "desc"))
      const serviceQuerySnapshot = await getDocs(serviceQ)
      
      const serviceRequestsData: any[] = []
      serviceQuerySnapshot.forEach((doc) => {
        const data = doc.data()
        serviceRequestsData.push({
          id: doc.id,
          serviceName: data.serviceName || "Unknown Service",
          serviceDescription: data.serviceDescription || "",
          serviceCategory: data.serviceCategory || "",
          servicePrice: data.servicePrice || "",
          userId: data.userId || "",
          userEmail: data.userEmail || "",
          status: data.status || "pending",
          submittedAt: data.submittedAt || Timestamp.now(),
          adminNotes: data.adminNotes || "",
          assignedTo: data.assignedTo || "",
          estimatedCompletion: data.estimatedCompletion || "",
          priority: data.priority || "normal"
        })
      })
      
      setServiceRequests(serviceRequestsData)
    } catch (error) {
      console.error("Error loading requests:", error)
      setRequests([])
      setServiceRequests([])
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = activeTab === 'website' 
    ? requests.filter(request => {
        const matchesSearch = 
          request.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.businessType.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || request.status === statusFilter
        const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
        
        return matchesSearch && matchesStatus && matchesPriority
      })
    : serviceRequests.filter(request => {
        const matchesSearch = 
          request.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || request.status === statusFilter
        
        return matchesSearch && matchesStatus
      })

  const stats = {
    total: activeTab === 'website' ? requests.length : serviceRequests.length,
    pending: activeTab === 'website' 
      ? requests.filter(r => r.status === 'pending').length
      : serviceRequests.filter(r => r.status === 'pending').length,
    reviewing: activeTab === 'website' 
      ? requests.filter(r => r.status === 'reviewing').length
      : 0,
    approved: activeTab === 'website' 
      ? requests.filter(r => r.status === 'approved').length
      : serviceRequests.filter(r => r.status === 'approved').length,
    rejected: activeTab === 'website' 
      ? requests.filter(r => r.status === 'rejected').length
      : serviceRequests.filter(r => r.status === 'rejected').length,
    inProgress: activeTab === 'website' 
      ? requests.filter(r => r.status === 'in-progress').length
      : serviceRequests.filter(r => r.status === 'in-progress').length,
    completed: activeTab === 'website' 
      ? requests.filter(r => r.status === 'completed').length
      : serviceRequests.filter(r => r.status === 'completed').length,
    urgent: activeTab === 'website' 
      ? requests.filter(r => r.priority === 'urgent').length
      : 0,
    high: activeTab === 'website' 
      ? requests.filter(r => r.priority === 'high').length
      : 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewing': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'in-progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSelectedFeatures = (request: WebsiteRequest) => {
    return featureOptions.filter(f => request.features.includes(f.id))
  }

  const getEstimatedTotal = (request: WebsiteRequest) => {
    const selectedFeatures = getSelectedFeatures(request)
    return selectedFeatures.reduce((total, feature) => {
      const cost = parseInt(feature.estimatedCost.replace(/[$,]/g, ''))
      return total + cost
    }, 0)
  }

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return

    try {
      const requestRef = doc(db, "websiteRequests", selectedRequest.id)
      const updateData: any = {
        status: updateStatus,
        adminNotes: adminNotes,
        assignedTo: assignedTo,
        reviewedAt: Timestamp.now(),
        reviewedBy: "Admin" // TODO: Get actual admin user
      }

      // If status is being changed to approved, add approvedAt timestamp
      if (updateStatus === 'approved') {
        updateData.approvedAt = Timestamp.now()
      }

      // If status is being changed to completed, add completedAt timestamp
      if (updateStatus === 'completed') {
        updateData.completedAt = Timestamp.now()
      }

      await updateDoc(requestRef, updateData)

      // Update local state
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              status: updateStatus as any, 
              adminNotes, 
              assignedTo, 
              reviewedAt: Timestamp.now(),
              approvedAt: updateStatus === 'approved' ? Timestamp.now() : req.approvedAt,
              completedAt: updateStatus === 'completed' ? Timestamp.now() : req.completedAt
            }
          : req
      ))

      setShowUpdateDialog(false)
      setSelectedRequest(null)
      setUpdateStatus("")
      setAdminNotes("")
      setAssignedTo("")
    } catch (error) {
      console.error("Error updating request:", error)
    }
  }

  const formatDate = (timestamp: Timestamp) => {
    return new Date(timestamp.toDate()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading website requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Globe className="h-8 w-8 text-blue-200" />
                <h1 className="text-3xl md:text-4xl font-bold">Website Requests</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Manage and review website development requests from users
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>System operational</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{stats.total} total requests</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Globe className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('website')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'website'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Website Requests ({requests.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('service')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'service'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Wrench className="h-4 w-4" />
                <span>Service Requests ({serviceRequests.length})</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Requests</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Globe className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-yellow-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pending Review</CardTitle>
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-yellow-900">{stats.pending}</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <AlertCircle className="w-3 h-3 mr-1" />
              {stats.urgent} urgent
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Approved</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-green-900">{stats.approved}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats.inProgress} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Completed</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <Crown className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-purple-900">{stats.completed}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <CheckCircle className="w-3 h-3 mr-1" />
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder={activeTab === 'website' 
                  ? "Search by project name, email, or business type..."
                  : "Search by service name, email, or category..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {activeTab === 'website' && (
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Actions</Label>
              <Button onClick={loadRequests} variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{activeTab === 'website' ? 'Website' : 'Service'} Requests ({filteredRequests.length})</span>
            <Badge variant="outline">{stats.total} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              {activeTab === 'website' ? (
                <>
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No website requests found</h3>
                  <p className="text-gray-500">No website requests match your current filters.</p>
                </>
              ) : (
                <>
                  <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests found</h3>
                  <p className="text-gray-500">No service requests match your current filters.</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'website' ? (
                // Website requests
                filteredRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{request.projectName}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        {request.priority && (
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority} priority
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Business Type</p>
                          <p className="font-medium">{request.businessType}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Timeline</p>
                          <p className="font-medium">{request.timeline}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-medium">{request.budget}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Estimated Cost</p>
                          <p className="font-medium">${getEstimatedTotal(request).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{request.contactEmail}</span>
                        </div>
                        {request.phoneNumber && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{request.phoneNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted {formatDate(request.submittedAt)}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Selected Features ({request.features.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {getSelectedFeatures(request).slice(0, 5).map(feature => (
                            <Badge key={feature.id} variant="secondary" className="text-xs">
                              {feature.name}
                            </Badge>
                          ))}
                          {request.features.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{request.features.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {request.description && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">Description</p>
                          <p className="text-sm">{request.description.substring(0, 150)}...</p>
                        </div>
                      )}

                      {request.adminNotes && (
                        <div className="mb-3 p-2 bg-blue-50 rounded">
                          <p className="text-sm text-blue-600 mb-1">Admin Notes</p>
                          <p className="text-sm">{request.adminNotes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowRequestDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedRequest(request)
                            setUpdateStatus(request.status)
                            setAdminNotes(request.adminNotes || "")
                            setAssignedTo(request.assignedTo || "")
                            setShowUpdateDialog(true)
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Reply className="h-4 w-4 mr-2" />
                            Reply to User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
              ) : (
                // Service requests
                filteredRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{request.serviceName}</h3>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">Category</p>
                            <p className="font-medium">{request.serviceCategory}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="font-medium">{request.servicePrice}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">User</p>
                            <p className="font-medium">{request.userEmail}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{request.userEmail}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Submitted {formatDate(request.submittedAt)}</span>
                          </div>
                        </div>

                        {request.serviceDescription && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-1">Description</p>
                            <p className="text-sm">{request.serviceDescription.substring(0, 150)}...</p>
                          </div>
                        )}

                        {request.adminNotes && (
                          <div className="mb-3 p-2 bg-blue-50 rounded">
                            <p className="text-sm text-blue-600 mb-1">Admin Notes</p>
                            <p className="text-sm">{request.adminNotes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowRequestDialog(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedRequest(request)
                              setUpdateStatus(request.status)
                              setAdminNotes(request.adminNotes || "")
                              setAssignedTo(request.assignedTo || "")
                              setShowUpdateDialog(true)
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Reply className="h-4 w-4 mr-2" />
                              Reply to User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Request Details</span>
            </DialogTitle>
            <DialogDescription>
              Complete information about this website request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Project Information */}
              <div>
                <h3 className="font-semibold mb-3">Project Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Name:</span>
                    <span className="font-medium">{selectedRequest.projectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Type:</span>
                    <span className="font-medium">{selectedRequest.businessType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target Audience:</span>
                    <span className="font-medium">{selectedRequest.targetAudience || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Type:</span>
                    <span className="font-medium">{selectedRequest.projectType || 'Custom'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-3">Project Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">{selectedRequest.description}</p>
                </div>
              </div>

              {/* Selected Features */}
              <div>
                <h3 className="font-semibold mb-3">Selected Features ({selectedRequest.features.length})</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getSelectedFeatures(selectedRequest).map(feature => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <div className="p-1 bg-blue-100 rounded">
                          {feature.icon}
                        </div>
                        <span className="text-sm">{feature.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {feature.estimatedCost}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-blue-200 mt-4">
                    <div className="font-bold text-lg">Estimated Total</div>
                    <div className="font-bold text-lg text-blue-600">
                      ${getEstimatedTotal(selectedRequest).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline & Budget */}
              <div>
                <h3 className="font-semibold mb-3">Timeline & Budget</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timeline:</span>
                    <span className="font-medium">{selectedRequest.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget Range:</span>
                    <span className="font-medium">{selectedRequest.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className="font-medium">{selectedRequest.priority || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedRequest.contactEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedRequest.phoneNumber || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedRequest.additionalNotes && (
                <div>
                  <h3 className="font-semibold mb-3">Additional Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedRequest.additionalNotes}</p>
                  </div>
                </div>
              )}

              {/* Admin Information */}
              <div>
                <h3 className="font-semibold mb-3">Admin Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getStatusColor(selectedRequest.status)}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                  {selectedRequest.reviewedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reviewed:</span>
                      <span className="font-medium">{formatDate(selectedRequest.reviewedAt)}</span>
                    </div>
                  )}
                  {selectedRequest.reviewedBy && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reviewed By:</span>
                      <span className="font-medium">{selectedRequest.reviewedBy}</span>
                    </div>
                  )}
                  {selectedRequest.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned To:</span>
                      <span className="font-medium">{selectedRequest.assignedTo}</span>
                    </div>
                  )}
                  {selectedRequest.adminNotes && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admin Notes:</span>
                      <span className="font-medium">{selectedRequest.adminNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Update the status and add notes for this website request
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={updateStatus} onValueChange={setUpdateStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Input
                placeholder="Enter assignee name"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Admin Notes</Label>
              <Textarea
                placeholder="Add notes about this request..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>
              Update Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 