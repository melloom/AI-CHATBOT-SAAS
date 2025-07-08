"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Users,
  Building2,
  Crown,
  ExternalLink,
  Play,
  Pause,
  Wrench,
  Zap,
  Target,
  Rocket
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { collection, getDocs, query, where, orderBy, Timestamp, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface WebsiteProject {
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
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'in-progress' | 'completed' | 'live'
  submittedAt: Timestamp
  approvedAt?: Timestamp
  completedAt?: Timestamp
  adminNotes?: string
  estimatedCost?: number
  assignedTo?: string
  projectUrl?: string
  developmentProgress?: number
  lastUpdate?: Timestamp
  nextMilestone?: string
  paymentStatus?: 'pending' | 'partial' | 'completed'
}

interface FeatureOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  estimatedCost: string
}

export default function ManageWebsitesPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<WebsiteProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<WebsiteProject | null>(null)
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [showWebsiteManagementDialog, setShowWebsiteManagementDialog] = useState(false)
  const [selectedLiveWebsite, setSelectedLiveWebsite] = useState<WebsiteProject | null>(null)
  const [activeTab, setActiveTab] = useState<'requests' | 'websites'>('requests')
  const [manualEmail, setManualEmail] = useState("")
  const [useManualEmail, setUseManualEmail] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showChangesDialog, setShowChangesDialog] = useState(false)
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [selectedActionProject, setSelectedActionProject] = useState<WebsiteProject | null>(null)

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
    if (user) {
      loadUserProjects()
    }
  }, [user])

  const loadUserProjects = async () => {
    try {
      setLoading(true)
      
      // Get ALL user's website requests (including pending ones)
      const requestsRef = collection(db, "websiteRequests")
      
      let querySnapshot
      
      // Determine which email to use for searching
      let searchEmail = user?.email
      if (useManualEmail && manualEmail.trim()) {
        searchEmail = manualEmail.trim()
        console.log("Using manual email for search:", searchEmail)
      }
      
      if (user?.uid && !useManualEmail) {
        // User is authenticated - try to fetch by userId first, then by email
        try {
          const q = query(
            requestsRef, 
            where("userId", "==", user.uid),
            orderBy("submittedAt", "desc")
          )
          querySnapshot = await getDocs(q)
          console.log("Fetched by userId:", querySnapshot.size, "requests")
        } catch (error) {
          // If no results by userId, try by email
          console.log("No requests found by userId, trying by email...")
          const q = query(
            requestsRef, 
            where("userEmail", "==", searchEmail),
            orderBy("submittedAt", "desc")
          )
          querySnapshot = await getDocs(q)
          console.log("Fetched by email:", querySnapshot.size, "requests")
          
          // If still no results, try by stored email
          if (querySnapshot.size === 0) {
            const storedEmail = localStorage.getItem('lastSubmittedEmail') || sessionStorage.getItem('lastSubmittedEmail')
            if (storedEmail && storedEmail !== searchEmail) {
              console.log("No requests found by user email, trying by stored email:", storedEmail)
              const q2 = query(
                requestsRef, 
                where("userEmail", "==", storedEmail),
                orderBy("submittedAt", "desc")
              )
              querySnapshot = await getDocs(q2)
              console.log("Fetched by stored email:", querySnapshot.size, "requests")
            }
          }
        }
      } else {
        // User not authenticated or using manual email - fetch by specific email
        if (searchEmail) {
          console.log("Fetching requests by email:", searchEmail)
          const q = query(
            requestsRef, 
            where("userEmail", "==", searchEmail),
            orderBy("submittedAt", "desc")
          )
          querySnapshot = await getDocs(q)
          console.log("Fetched by email:", querySnapshot.size, "requests")
        } else {
          // Fallback: fetch all requests and filter by email
          console.log("No email specified, fetching all requests...")
          const q = query(
            requestsRef,
            orderBy("submittedAt", "desc")
          )
          querySnapshot = await getDocs(q)
          console.log("Fetched all requests:", querySnapshot.size, "total requests")
        }
      }
      
      const projectsData: WebsiteProject[] = []
      const storedEmail = localStorage.getItem('lastSubmittedEmail') || sessionStorage.getItem('lastSubmittedEmail')
      console.log("Stored email:", storedEmail)
      console.log("User email:", user?.email)
      console.log("Search email:", searchEmail)
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log("Request data:", {
          id: doc.id,
          userEmail: data.userEmail,
          contactEmail: data.contactEmail,
          projectName: data.projectName
        })
        
        // If user is not authenticated or using manual email, only show requests that match the search email
        if (!user?.uid || useManualEmail) {
          const emailToMatch = searchEmail || storedEmail
          if (data.userEmail !== emailToMatch && data.contactEmail !== emailToMatch) {
            console.log("Skipping request - email doesn't match")
            return // Skip this request if email doesn't match
          }
        }
        
        console.log("Adding request to projects:", data.projectName)
        projectsData.push({
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
          approvedAt: data.approvedAt,
          completedAt: data.completedAt,
          adminNotes: data.adminNotes,
          estimatedCost: data.estimatedCost,
          assignedTo: data.assignedTo,
          projectUrl: data.projectUrl,
          developmentProgress: data.developmentProgress || 0,
          lastUpdate: data.lastUpdate,
          nextMilestone: data.nextMilestone,
          paymentStatus: data.paymentStatus || 'pending'
        })
      })
      
      console.log("Final projects data:", projectsData.length, "projects")
      setProjects(projectsData)
    } catch (error) {
      console.error("Error loading user projects:", error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  // Filter projects based on active tab
  const getFilteredProjects = () => {
    if (activeTab === 'requests') {
      // Show pending and reviewing requests
      return projects.filter(project => 
        ['pending', 'reviewing'].includes(project.status)
      )
    } else {
      // Show approved, in-progress, completed, and live websites
      return projects.filter(project => 
        ['approved', 'in-progress', 'completed', 'live'].includes(project.status)
      )
    }
  }

  const filteredProjects = getFilteredProjects().filter(project => {
    const matchesSearch = 
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.businessType.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    reviewing: projects.filter(p => p.status === 'reviewing').length,
    approved: projects.filter(p => p.status === 'approved').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    live: projects.filter(p => p.status === 'live').length,
    pendingPayment: projects.filter(p => p.paymentStatus === 'pending').length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'live': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSelectedFeatures = (project: WebsiteProject) => {
    return featureOptions.filter(f => project.features.includes(f.id))
  }

  const getEstimatedTotal = (project: WebsiteProject) => {
    const selectedFeatures = getSelectedFeatures(project)
    return selectedFeatures.reduce((total, feature) => {
      const cost = parseInt(feature.estimatedCost.replace(/[$,]/g, ''))
      return total + cost
    }, 0)
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const handleContactTeam = (project: WebsiteProject) => {
    setSelectedActionProject(project)
    setShowContactDialog(true)
  }

  const handleDownloadFiles = async (project: WebsiteProject) => {
    try {
      // Create a simple text file with project details
      const projectData = {
        projectName: project.projectName,
        description: project.description,
        businessType: project.businessType,
        targetAudience: project.targetAudience,
        features: project.features,
        timeline: project.timeline,
        budget: project.budget,
        status: project.status,
        submittedAt: project.submittedAt.toDate().toISOString(),
        estimatedCost: getEstimatedTotal(project)
      }
      
      const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.projectName.replace(/\s+/g, '_')}_project_details.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading files:', error)
    }
  }

  const handleRequestChanges = (project: WebsiteProject) => {
    setSelectedActionProject(project)
    setShowChangesDialog(true)
  }

  const handleArchiveProject = async (project: WebsiteProject) => {
    try {
      // Update the project status to archived
      const projectRef = doc(db, "websiteRequests", project.id)
      await updateDoc(projectRef, {
        status: 'archived',
        archivedAt: new Date()
      })
      
      // Refresh the projects list
      await loadUserProjects()
      setShowArchiveDialog(false)
      setSelectedActionProject(null)
    } catch (error) {
      console.error('Error archiving project:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your projects...</p>
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
                <h1 className="text-3xl md:text-4xl font-bold">Manage Websites</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Track and manage your website development projects
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>System operational</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>{stats.total} projects</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Rocket className="w-16 h-16 text-white" />
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
            <CardTitle className="text-sm font-medium text-blue-800">Total Projects</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Globe className="h-4 w-4 text-white" />
                  </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats.approved} approved
            </p>
              </CardContent>
            </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">In Progress</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <Wrench className="h-4 w-4 text-white" />
          </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-green-900">{stats.inProgress}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Zap className="w-3 h-3 mr-1" />
              Active development
            </p>
              </CardContent>
            </Card>
            
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Completed</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <CheckCircle className="h-4 w-4 text-white" />
                  </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-purple-900">{stats.completed}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <Crown className="w-3 h-3 mr-1" />
              Successfully delivered
            </p>
              </CardContent>
            </Card>
            
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">Live Websites</CardTitle>
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Globe className="h-4 w-4 text-white" />
                  </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-emerald-900">{stats.live}</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <Zap className="w-3 h-3 mr-1" />
              Active online
            </p>
              </CardContent>
            </Card>
            
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Pending Payment</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <CreditCard className="h-4 w-4 text-white" />
                  </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-orange-900">{stats.pendingPayment}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <AlertCircle className="w-3 h-3 mr-1" />
              Requires attention
            </p>
              </CardContent>
            </Card>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>My Requests ({stats.pending + stats.reviewing})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('websites')}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'websites'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>My Websites ({stats.approved + stats.inProgress + stats.completed + stats.live})</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Email Search Section */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-3">
                <Mail className="h-4 w-4 text-blue-600" />
                <Label className="text-sm font-medium text-blue-800 dark:text-blue-200">Find Requests by Email</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Email Address</Label>
                  <Input
                    placeholder="Enter the email used in your request..."
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Search Options</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useManualEmail"
                      checked={useManualEmail}
                      onChange={(e) => setUseManualEmail(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="useManualEmail" className="text-xs">Use manual email</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Actions</Label>
                  <Button 
                    onClick={loadUserProjects} 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Use this to find requests submitted with a different email address
              </p>
            </div>
            
            {/* Regular Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                  <Input
                  placeholder="Search by project name or business type..."
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
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <Button onClick={loadUserProjects} variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {activeTab === 'requests' ? 'Your Requests' : 'Your Websites'} ({filteredProjects.length})
            </span>
            <Button onClick={() => router.push('/dashboard/web-building/request')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === 'requests' ? 'Submit New Request' : 'Request New Website'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              {activeTab === 'requests' ? (
                <>
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                  <p className="text-gray-500 mb-4">You don't have any pending website requests yet.</p>
                  <Button onClick={() => router.push('/dashboard/web-building/request')} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Your First Request
                  </Button>
                </>
              ) : (
                <>
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No websites found</h3>
                  <p className="text-gray-500 mb-4">You don't have any approved website projects yet.</p>
                  <Button onClick={() => router.push('/dashboard/web-building/request')} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Request Your First Website
                  </Button>
                </>
              )}
            </div>
          ) : (
      <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{project.projectName}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status === 'live' ? (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                              <span>Live</span>
                            </div>
                          ) : (
                            project.status
                          )}
                        </Badge>
                        {project.status === 'live' && (
                          <Badge className="bg-emerald-100 text-emerald-800">
                            <Globe className="h-3 w-3 mr-1" />
                            Online
                          </Badge>
                        )}
                        {project.paymentStatus && (
                          <Badge className={getPaymentStatusColor(project.paymentStatus)}>
                            {project.paymentStatus} payment
                          </Badge>
                        )}
                  </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Business Type</p>
                          <p className="font-medium">{project.businessType}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Timeline</p>
                          <p className="font-medium">{project.timeline}</p>
                    </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-medium">{project.budget}</p>
                    </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Estimated Cost</p>
                          <p className="font-medium">${getEstimatedTotal(project).toLocaleString()}</p>
                  </div>
                </div>
                
                      {/* Progress Bar for In Progress Projects */}
                      {project.status === 'in-progress' && project.developmentProgress !== undefined && (
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Development Progress</span>
                            <span className="text-sm font-medium">{project.developmentProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getProgressColor(project.developmentProgress)}`}
                              style={{ width: `${project.developmentProgress}%` }}
                            ></div>
                          </div>
                          {project.nextMilestone && (
                            <p className="text-xs text-gray-500 mt-1">Next: {project.nextMilestone}</p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted {formatDate(project.submittedAt)}</span>
                        </div>
                        {project.approvedAt && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>Approved {formatDate(project.approvedAt)}</span>
                          </div>
                        )}
                        {project.assignedTo && (
                      <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Assigned to {project.assignedTo}</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Selected Features ({project.features.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {getSelectedFeatures(project).slice(0, 5).map(feature => (
                            <Badge key={feature.id} variant="secondary" className="text-xs">
                              {feature.name}
                            </Badge>
                          ))}
                          {project.features.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.features.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {project.adminNotes && (
                        <div className="mb-3 p-2 bg-blue-50 rounded">
                          <p className="text-sm text-blue-600 mb-1">Team Notes</p>
                          <p className="text-sm">{project.adminNotes}</p>
                    </div>
                      )}
                  </div>
                  
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProject(project)
                          setShowProjectDialog(true)
                        }}
                      >
                      <Eye className="h-4 w-4" />
                    </Button>
                      
                      {project.status === 'live' && project.projectUrl && (
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => window.open(project.projectUrl, '_blank')}
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Visit Site
                        </Button>
                      )}
                      
                      {project.status !== 'live' && project.projectUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(project.projectUrl, '_blank')}
                        >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                      )}
                      
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {project.status === 'live' && (
                            <>
                              <DropdownMenuItem onClick={() => {
                                setSelectedLiveWebsite(project)
                                setShowWebsiteManagementDialog(true)
                              }}>
                                <Globe className="h-4 w-4 mr-2" />
                                Manage Website
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                        <DropdownMenuItem onClick={() => handleContactTeam(project)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Team
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadFiles(project)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Files
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRequestChanges(project)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Request Changes
                        </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleArchiveProject(project)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
            </CardContent>
          </Card>

      {/* Project Details Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Project Details</span>
            </DialogTitle>
            <DialogDescription>
              Complete information about your website project
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6">
              {/* Project Information */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Project Information</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Project Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedProject.projectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Business Type:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedProject.businessType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Target Audience:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedProject.targetAudience || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Project Type:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedProject.projectType || 'Custom'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Project Description</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedProject.description}</p>
                </div>
              </div>

              {/* Selected Features */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Selected Features ({selectedProject.features.length})</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getSelectedFeatures(selectedProject).map(feature => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                          {feature.icon}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {feature.estimatedCost}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-blue-200 dark:border-blue-700 mt-4">
                    <div className="font-bold text-lg text-gray-900 dark:text-white">Estimated Total</div>
                    <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      ${getEstimatedTotal(selectedProject).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline & Budget */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Timeline & Budget</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Timeline:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedProject.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Budget Range:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedProject.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedProject.priority || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Project Status */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Project Status</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <Badge className={getStatusColor(selectedProject.status)}>
                      {selectedProject.status}
                    </Badge>
                  </div>
                  {selectedProject.approvedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Approved:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatDate(selectedProject.approvedAt)}</span>
                    </div>
                  )}
                  {selectedProject.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Assigned To:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedProject.assignedTo}</span>
                    </div>
                  )}
                  {selectedProject.projectUrl && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Project URL:</span>
                      <a 
                        href={selectedProject.projectUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Project
                      </a>
                    </div>
                  )}
                  {selectedProject.paymentStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                      <Badge className={getPaymentStatusColor(selectedProject.paymentStatus)}>
                        {selectedProject.paymentStatus}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Development Progress */}
              {selectedProject.status === 'in-progress' && selectedProject.developmentProgress !== undefined && (
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Development Progress</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedProject.developmentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                      <div 
                        className={`h-3 rounded-full ${getProgressColor(selectedProject.developmentProgress)}`}
                        style={{ width: `${selectedProject.developmentProgress}%` }}
                      ></div>
                    </div>
                    {selectedProject.nextMilestone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Next Milestone: {selectedProject.nextMilestone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Team Notes */}
              {selectedProject.adminNotes && (
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Team Notes</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedProject.adminNotes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Website Management Dialog for Live Sites */}
      <Dialog open={showWebsiteManagementDialog} onOpenChange={setShowWebsiteManagementDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-emerald-600" />
              <span>Website Management</span>
            </DialogTitle>
            <DialogDescription>
              Manage your live website settings, content, and analytics
            </DialogDescription>
          </DialogHeader>
          
          {selectedLiveWebsite && (
            <div className="space-y-6">
              {/* Website Overview */}
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-emerald-800">Website Overview</h3>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
                    Live
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-emerald-600 mb-1">Website Name</p>
                    <p className="font-medium">{selectedLiveWebsite.projectName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600 mb-1">URL</p>
                    <a 
                      href={selectedLiveWebsite.projectUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-600 hover:underline"
                    >
                      {selectedLiveWebsite.projectUrl}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Settings className="h-6 w-6 mb-2" />
                    <span className="text-sm">Settings</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span className="text-sm">Analytics</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Edit className="h-6 w-6 mb-2" />
                    <span className="text-sm">Edit Content</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Database className="h-6 w-6 mb-2" />
                    <span className="text-sm">Backup</span>
                  </Button>
                </div>
              </div>

              {/* Website Statistics */}
              <div>
                <h3 className="font-semibold mb-3">Website Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Visitors</p>
                          <p className="text-lg font-semibold">1,234</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Page Views</p>
                          <p className="text-lg font-semibold">5,678</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Conversions</p>
                          <p className="text-lg font-semibold">23</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Content updated</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Backup completed</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New visitor milestone</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support & Maintenance */}
              <div>
                <h3 className="font-semibold mb-3">Support & Maintenance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Technical Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">Get help with technical issues</p>
                      <Button size="sm" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Support
                      </Button>
                    </CardContent>
                  </Card>
          <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">Schedule maintenance or updates</p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
              </Button>
            </CardContent>
          </Card>
                </div>
              </div>
            </div>
        )}
        </DialogContent>
      </Dialog>

      {/* Contact Team Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>Contact Team</span>
            </DialogTitle>
            <DialogDescription>
              Get in touch with our development team about your project
            </DialogDescription>
          </DialogHeader>
          
          {selectedActionProject && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Project: {selectedActionProject.projectName}</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">Status: {selectedActionProject.status}</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input 
                    id="contact-subject" 
                    placeholder="Brief description of your inquiry"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea 
                    id="contact-message" 
                    placeholder="Describe your question or concern..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Your Email</Label>
                  <Input 
                    id="contact-email" 
                    type="email"
                    defaultValue={selectedActionProject.contactEmail}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Here you would typically send the message to your team
              console.log('Contact team message sent')
              setShowContactDialog(false)
            }}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={showChangesDialog} onOpenChange={setShowChangesDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-orange-600" />
              <span>Request Changes</span>
            </DialogTitle>
            <DialogDescription>
              Request modifications to your project requirements or specifications
            </DialogDescription>
          </DialogHeader>
          
          {selectedActionProject && (
            <div className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Project: {selectedActionProject.projectName}</h4>
                <p className="text-sm text-orange-600 dark:text-orange-300">Current Status: {selectedActionProject.status}</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="changes-type">Type of Change</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select change type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="requirements">Requirements Update</SelectItem>
                      <SelectItem value="features">Feature Addition/Removal</SelectItem>
                      <SelectItem value="design">Design Changes</SelectItem>
                      <SelectItem value="timeline">Timeline Adjustment</SelectItem>
                      <SelectItem value="budget">Budget Modification</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="changes-description">Change Description</Label>
                  <Textarea 
                    id="changes-description" 
                    placeholder="Describe the changes you'd like to make..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="changes-priority">Priority</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait</SelectItem>
                      <SelectItem value="medium">Medium - Important</SelectItem>
                      <SelectItem value="high">High - Urgent</SelectItem>
                      <SelectItem value="critical">Critical - Blocking progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="changes-email">Your Email</Label>
                  <Input 
                    id="changes-email" 
                    type="email"
                    defaultValue={selectedActionProject.contactEmail}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangesDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Here you would typically submit the change request
              console.log('Change request submitted')
              setShowChangesDialog(false)
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Project Confirmation Dialog */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Archive className="h-5 w-5 text-red-600" />
              <span>Archive Project</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this project? This action can be undone later.
            </DialogDescription>
          </DialogHeader>
          
          {selectedActionProject && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Project: {selectedActionProject.projectName}</h4>
                <p className="text-sm text-red-600 dark:text-red-300">Status: {selectedActionProject.status}</p>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Archiving will:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Move the project to archived status</li>
                  <li>Hide it from the main project list</li>
                  <li>Preserve all project data</li>
                  <li>Allow restoration if needed</li>
                </ul>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedActionProject) {
                  handleArchiveProject(selectedActionProject)
                }
              }}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 