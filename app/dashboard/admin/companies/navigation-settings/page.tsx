"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { backupCompanyData, deleteCompanyData, downloadBackupAsJSON } from "@/lib/company-backup"
import { useRouter } from "next/navigation"
import { 
  Navigation, 
  Settings, 
  Building2,
  Search,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle,
  Save,
  Globe,
  Users,
  CreditCard,
  Shield,
  Power,
  MoreHorizontal,
  X,
  Check,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Trash2,
  Download,
  AlertCircle
} from "lucide-react"
import { CompanyAutocomplete } from "@/components/ui/company-autocomplete"

interface Company {
  id: string
  companyName: string
  email: string
  domain: string
  status: 'active' | 'inactive' | 'suspended'
  maintenanceMode?: boolean
  allowedPaths?: number
  blockedPaths?: number
  customRoutes?: number
  subscription?: string
  navigationSettings?: {
    navigationItems: Array<{
      id: string
      label: string
      path: string
      icon: string
      enabled: boolean
      order: number
    }>
    lastUpdated?: string
  }
}

export default function CompanyNavigationSettingsPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false)
  const [addingCompany, setAddingCompany] = useState(false)
  const [newCompany, setNewCompany] = useState({
    companyName: "",
    email: "",
    domain: "",
    subscription: "Free",
    status: "active",
    maintenanceMode: false,
    allowedPaths: 3,
    blockedPaths: 2,
    customRoutes: 1
  })
  
  // Quick Actions State
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showUsersDialog, setShowUsersDialog] = useState(false)
  const [showBillingDialog, setShowBillingDialog] = useState(false)
  const [showPathManagementDialog, setShowPathManagementDialog] = useState(false)
  const [showNavigationItemsDialog, setShowNavigationItemsDialog] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingPaths, setUpdatingPaths] = useState(false)
  const [updatingNavigationItems, setUpdatingNavigationItems] = useState(false)
  const [statusUpdate, setStatusUpdate] = useState({
    status: "active",
    reason: ""
  })
  
  // Delete Company State
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingCompany, setDeletingCompany] = useState(false)
  const [backupCreated, setBackupCreated] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [pathManagement, setPathManagement] = useState({
    allowedPaths: [] as string[],
    blockedPaths: [] as string[],
    customRoutes: [] as { path: string; redirect: string; enabled: boolean }[]
  })
  const [navigationItems, setNavigationItems] = useState([
    { id: '1', label: 'Dashboard', path: '/dashboard', icon: 'Home', enabled: true, order: 1 },
    { id: '2', label: 'Chatbots', path: '/dashboard/chatbots', icon: 'Bot', enabled: true, order: 2 },
    { id: '3', label: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart', enabled: true, order: 3 },
    { id: '4', label: 'Settings', path: '/dashboard/settings', icon: 'Settings', enabled: true, order: 4 },
    { id: '5', label: 'Team', path: '/dashboard/team', icon: 'Users', enabled: false, order: 5 },
    { id: '6', label: 'Billing', path: '/dashboard/billing', icon: 'CreditCard', enabled: true, order: 6 },
    { id: '7', label: 'Marketplace', path: '/dashboard/marketplace', icon: 'Store', enabled: true, order: 7 },
    { id: '8', label: 'Notifications', path: '/dashboard/notifications', icon: 'Bell', enabled: false, order: 8 }
  ])

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      console.log("Loading companies from Firebase...")
      const companiesRef = collection(db, "companies")
      const querySnapshot = await getDocs(companiesRef)
      
      const companiesData: Company[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const company = {
          id: doc.id,
          companyName: data.companyName || "Unknown Company",
          email: data.email || "No email",
          domain: data.domain || `${data.companyName?.toLowerCase().replace(/\s+/g, '')}.com`,
          status: data.status || "inactive",
          maintenanceMode: data.maintenanceMode || false,
          allowedPaths: data.allowedPaths || 3,
          blockedPaths: data.blockedPaths || 2,
          customRoutes: data.customRoutes || 1,
          subscription: data.subscription?.plan || "Free"
        }
        companiesData.push(company)
        console.log(`Loaded company: ${company.companyName} (${company.id})`)
      })
      
      console.log(`Total companies loaded: ${companiesData.length}`)
      setCompanies(companiesData)
    } catch (error) {
      console.error("Error loading companies:", error)
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.domain.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleMaintenanceToggle = async (company: Company, newValue: boolean) => {
    try {
      console.log(`Toggling maintenance mode for ${company.companyName} to ${newValue}`)
      
      const companyRef = doc(db, "companies", company.id)
      await updateDoc(companyRef, { maintenanceMode: newValue })
      
      // Update local state
      setCompanies(companies.map(c => 
        c.id === company.id ? { ...c, maintenanceMode: newValue } : c
      ))
      
      console.log(`Maintenance mode ${newValue ? 'enabled' : 'disabled'} for ${company.companyName}`)
    } catch (error) {
      console.error("Error updating maintenance mode:", error)
    }
  }

  const handleAddCompany = async () => {
    if (!newCompany.companyName || !newCompany.email) {
      console.error("Company name and email are required")
      return
    }

    setAddingCompany(true)
    try {
      console.log("Adding new company with navigation settings to Firebase...")
      
      const companyData = {
        companyName: newCompany.companyName,
        email: newCompany.email,
        domain: newCompany.domain || `${newCompany.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        subscription: {
          plan: newCompany.subscription,
          status: "active"
        },
        status: newCompany.status,
        maintenanceMode: newCompany.maintenanceMode,
        allowedPaths: newCompany.allowedPaths,
        blockedPaths: newCompany.blockedPaths,
        customRoutes: newCompany.customRoutes,
        chatbots: [],
        conversations: [],
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        // Default navigation settings
        navigationSettings: {
          customLogo: false,
          customColors: false,
          customDomain: false,
          navigationItems: [
            { id: '1', label: 'Dashboard', path: '/dashboard', icon: 'Home', enabled: true, order: 1 },
            { id: '2', label: 'Chatbots', path: '/dashboard/chatbots', icon: 'Bot', enabled: true, order: 2 },
            { id: '3', label: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart', enabled: true, order: 3 },
            { id: '4', label: 'Settings', path: '/dashboard/settings', icon: 'Settings', enabled: true, order: 4 },
            { id: '5', label: 'Team', path: '/dashboard/team', icon: 'Users', enabled: false, order: 5 },
            { id: '6', label: 'Billing', path: '/dashboard/billing', icon: 'CreditCard', enabled: true, order: 6 }
          ],
          theme: 'auto',
          primaryColor: '#6366f1',
          secondaryColor: '#8b5cf6',
          lastUpdated: new Date().toISOString()
        }
      }

      const docRef = await addDoc(collection(db, "companies"), companyData)
      console.log("Company added successfully with ID:", docRef.id)

      // Add the new company to the local state
      const addedCompany: Company = {
        id: docRef.id,
        companyName: newCompany.companyName,
        email: newCompany.email,
        domain: newCompany.domain || `${newCompany.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        subscription: newCompany.subscription,
        status: newCompany.status as 'active' | 'inactive' | 'suspended',
        maintenanceMode: newCompany.maintenanceMode,
        allowedPaths: newCompany.allowedPaths,
        blockedPaths: newCompany.blockedPaths,
        customRoutes: newCompany.customRoutes
      }

      setCompanies([...companies, addedCompany])
      
      // Reset form and close dialog
      setNewCompany({
        companyName: "",
        email: "",
        domain: "",
        subscription: "Free",
        status: "active",
        maintenanceMode: false,
        allowedPaths: 3,
        blockedPaths: 2,
        customRoutes: 1
      })
      setShowAddCompanyDialog(false)
      
      console.log("Company added successfully with navigation settings:", addedCompany)
      
    } catch (error) {
      console.error("Error adding company:", error)
    } finally {
      setAddingCompany(false)
    }
  }

  // Quick Actions Functions
  const handleStatusUpdate = async () => {
    if (!selectedCompany) return
    
    setUpdatingStatus(true)
    try {
      console.log(`Updating status for ${selectedCompany.companyName} to ${statusUpdate.status}`)
      
      const companyRef = doc(db, "companies", selectedCompany.id)
      await updateDoc(companyRef, { 
        status: statusUpdate.status,
        statusReason: statusUpdate.reason,
        lastUpdated: new Date().toISOString()
      })
      
      // Update local state
      setCompanies(companies.map(c => 
        c.id === selectedCompany.id 
          ? { ...c, status: statusUpdate.status as 'active' | 'inactive' | 'suspended' }
          : c
      ))
      
      console.log(`Status updated successfully for ${selectedCompany.companyName}`)
      setShowStatusDialog(false)
      setSelectedCompany(null)
      setStatusUpdate({ status: "active", reason: "" })
      
    } catch (error) {
      console.error("Error updating company status:", error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleQuickAction = (action: string, company: Company) => {
    setSelectedCompany(company)
    
    switch (action) {
      case 'status':
        setStatusUpdate({ status: company.status, reason: "" })
        setShowStatusDialog(true)
        break
      case 'maintenance':
        handleMaintenanceToggle(company, !company.maintenanceMode)
        break
      case 'paths':
        // Initialize path management with current company data
        setPathManagement({
          allowedPaths: ['/dashboard', '/dashboard/chatbots', '/dashboard/analytics', '/dashboard/settings'],
          blockedPaths: ['/admin', '/system'],
          customRoutes: [
            { path: '/help', redirect: '/dashboard/support', enabled: true },
            { path: '/docs', redirect: '/dashboard/documentation', enabled: false }
          ]
        })
        setShowPathManagementDialog(true)
        break
      case 'navigation':
        // Initialize navigation items with current company data
        setNavigationItems([
          { id: '1', label: 'Dashboard', path: '/dashboard', icon: 'Home', enabled: true, order: 1 },
          { id: '2', label: 'Chatbots', path: '/dashboard/chatbots', icon: 'Bot', enabled: true, order: 2 },
          { id: '3', label: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart', enabled: true, order: 3 },
          { id: '4', label: 'Settings', path: '/dashboard/settings', icon: 'Settings', enabled: true, order: 4 },
          { id: '5', label: 'Team', path: '/dashboard/team', icon: 'Users', enabled: false, order: 5 },
          { id: '6', label: 'Billing', path: '/dashboard/billing', icon: 'CreditCard', enabled: true, order: 6 },
          { id: '7', label: 'Marketplace', path: '/dashboard/marketplace', icon: 'Store', enabled: true, order: 7 },
          { id: '8', label: 'Notifications', path: '/dashboard/notifications', icon: 'Bell', enabled: false, order: 8 }
        ])
        setShowNavigationItemsDialog(true)
        break
      case 'users':
        setShowUsersDialog(true)
        break
      case 'billing':
        setShowBillingDialog(true)
        break
      default:
        break
    }
  }

  const handlePathUpdate = async () => {
    if (!selectedCompany) return
    
    setUpdatingPaths(true)
    try {
      console.log(`Updating path management for ${selectedCompany.companyName}`)
      
      const companyRef = doc(db, "companies", selectedCompany.id)
      await updateDoc(companyRef, { 
        pathManagement: {
          allowedPaths: pathManagement.allowedPaths,
          blockedPaths: pathManagement.blockedPaths,
          customRoutes: pathManagement.customRoutes,
          lastUpdated: new Date().toISOString()
        },
        allowedPaths: pathManagement.allowedPaths.length,
        blockedPaths: pathManagement.blockedPaths.length,
        customRoutes: pathManagement.customRoutes.length
      })
      
      // Update local state
      setCompanies(companies.map(c => 
        c.id === selectedCompany.id 
          ? { 
              ...c, 
              allowedPaths: pathManagement.allowedPaths.length,
              blockedPaths: pathManagement.blockedPaths.length,
              customRoutes: pathManagement.customRoutes.length
            }
          : c
      ))
      
      console.log(`Path management updated successfully for ${selectedCompany.companyName}`)
      setShowPathManagementDialog(false)
      setSelectedCompany(null)
      
    } catch (error) {
      console.error("Error updating path management:", error)
    } finally {
      setUpdatingPaths(false)
    }
  }

  const addPath = (type: 'allowed' | 'blocked', path: string) => {
    if (!path.trim()) return
    
    if (type === 'allowed') {
      setPathManagement(prev => ({
        ...prev,
        allowedPaths: [...prev.allowedPaths, path.trim()]
      }))
    } else {
      setPathManagement(prev => ({
        ...prev,
        blockedPaths: [...prev.blockedPaths, path.trim()]
      }))
    }
  }

  const removePath = (type: 'allowed' | 'blocked', index: number) => {
    if (type === 'allowed') {
      setPathManagement(prev => ({
        ...prev,
        allowedPaths: prev.allowedPaths.filter((_, i) => i !== index)
      }))
    } else {
      setPathManagement(prev => ({
        ...prev,
        blockedPaths: prev.blockedPaths.filter((_, i) => i !== index)
      }))
    }
  }

  const addCustomRoute = (path: string, redirect: string) => {
    if (!path.trim() || !redirect.trim()) return
    
    setPathManagement(prev => ({
      ...prev,
      customRoutes: [...prev.customRoutes, { path: path.trim(), redirect: redirect.trim(), enabled: true }]
    }))
  }

  const removeCustomRoute = (index: number) => {
    setPathManagement(prev => ({
      ...prev,
      customRoutes: prev.customRoutes.filter((_, i) => i !== index)
    }))
  }

  const toggleCustomRoute = (index: number) => {
    setPathManagement(prev => ({
      ...prev,
      customRoutes: prev.customRoutes.map((route, i) => 
        i === index ? { ...route, enabled: !route.enabled } : route
      )
    }))
  }

  const handleNavigationItemsUpdate = async () => {
    if (!selectedCompany) return
    
    setUpdatingNavigationItems(true)
    try {
      console.log(`Updating navigation items for ${selectedCompany.companyName}`)
      
      const companyRef = doc(db, "companies", selectedCompany.id)
      await updateDoc(companyRef, { 
        navigationSettings: {
          ...selectedCompany.navigationSettings,
          navigationItems: navigationItems,
          lastUpdated: new Date().toISOString()
        }
      })
      
      console.log(`Navigation items updated successfully for ${selectedCompany.companyName}`)
      setShowNavigationItemsDialog(false)
      setSelectedCompany(null)
      
    } catch (error) {
      console.error("Error updating navigation items:", error)
    } finally {
      setUpdatingNavigationItems(false)
    }
  }

  const toggleNavigationItem = (id: string) => {
    setNavigationItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    )
  }

  const moveNavigationItem = (id: string, direction: 'up' | 'down') => {
    setNavigationItems(prev => {
      const currentIndex = prev.findIndex(item => item.id === id)
      if (currentIndex === -1) return prev
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const newItems = [...prev]
      const [movedItem] = newItems.splice(currentIndex, 1)
      newItems.splice(newIndex, 0, movedItem)
      
      // Update order numbers
      return newItems.map((item, index) => ({ ...item, order: index + 1 }))
    })
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Home': Building2,
      'Bot': Settings,
      'BarChart': Settings,
      'Settings': Settings,
      'Users': Users,
      'CreditCard': CreditCard,
      'Store': Building2,
      'Bell': AlertTriangle
    }
    return iconMap[iconName] || Building2
  }

  // Delete Company Functions
  const handleDeleteCompany = async () => {
    if (!selectedCompany || deleteConfirmation !== selectedCompany.companyName) {
      return
    }

    setDeletingCompany(true)
    try {
      console.log(`Starting deletion process for ${selectedCompany.companyName}...`)
      
      // Step 1: Create backup
      if (!backupCreated) {
        console.log("Creating backup...")
        const backup = await backupCompanyData(selectedCompany.id)
        downloadBackupAsJSON(backup, selectedCompany.companyName)
        setBackupCreated(true)
        console.log("Backup created and downloaded")
      }
      
      // Step 2: Delete company data
      console.log("Deleting company data...")
      await deleteCompanyData(selectedCompany.id)
      
      // Step 3: Update local state
      setCompanies(companies.filter(c => c.id !== selectedCompany.id))
      
      console.log(`Successfully deleted ${selectedCompany.companyName}`)
      setShowDeleteDialog(false)
      setSelectedCompany(null)
      setBackupCreated(false)
      setDeleteConfirmation("")
      
    } catch (error) {
      console.error("Error deleting company:", error)
    } finally {
      setDeletingCompany(false)
    }
  }

  const handleDeleteAction = (company: Company) => {
    setSelectedCompany(company)
    setShowDeleteDialog(true)
    setBackupCreated(false)
    setDeleteConfirmation("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading companies...</p>
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
                <Navigation className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">Navigation Settings</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Manage company navigation paths, maintenance modes, and access controls
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Navigation system operational</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Building2 className="w-4 h-4" />
                  <span>{companies.length} companies configured</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Navigation className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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
            <Button onClick={() => setShowAddCompanyDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Company Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{company.companyName}</CardTitle>
                    <p className="text-sm text-gray-500">{company.domain}</p>
                  </div>
                </div>
                <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                  {company.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Maintenance Mode</span>
                <div className="flex items-center space-x-2">
                  {company.maintenanceMode ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  <Switch 
                    checked={company.maintenanceMode || false}
                    onCheckedChange={(checked) => handleMaintenanceToggle(company, checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Allowed Paths</span>
                  <Badge variant="outline">{company.allowedPaths || 0}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Blocked Paths</span>
                  <Badge variant="outline">{company.blockedPaths || 0}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Custom Routes</span>
                  <Badge variant="outline">{company.customRoutes || 0}</Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('status', company)}
                    className="text-xs h-8"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Status
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('maintenance', company)}
                    className={`text-xs h-8 ${company.maintenanceMode ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''}`}
                  >
                    <Power className="w-3 h-3 mr-1" />
                    {company.maintenanceMode ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('paths', company)}
                    className="text-xs h-8"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Paths
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('navigation', company)}
                    className="text-xs h-8"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Nav Items
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('users', company)}
                    className="text-xs h-8"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    Users
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('billing', company)}
                    className="text-xs h-8"
                  >
                    <CreditCard className="w-3 h-3 mr-1" />
                    Billing
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAction(company)}
                    className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/dashboard/admin/companies/${company.id}/navigation-settings`)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Settings
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 mb-4">
              {companies.length === 0 
                ? "No companies have been registered yet." 
                : "No companies match your search criteria."
              }
            </p>
            {companies.length === 0 && (
              <Button onClick={() => router.push('/dashboard/admin/companies')}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Company
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Company Settings Dialog */}
      <Dialog open={showAddCompanyDialog} onOpenChange={setShowAddCompanyDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Add Company Settings</span>
            </DialogTitle>
            <DialogDescription>
              Create a new company with complete navigation settings and access controls
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Company Information</span>
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <CompanyAutocomplete
                  value={newCompany.companyName}
                  onValueChange={(value) => setNewCompany({...newCompany, companyName: value})}
                  placeholder="Search for company..."
                  label="Company Name *"
                  required
                />
                
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email Address *</Label>
                  <Input
                    id="company-email"
                    type="email"
                    placeholder="company@example.com"
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-domain">Domain (Optional)</Label>
                <Input
                  id="company-domain"
                  placeholder="company.com"
                  value={newCompany.domain}
                  onChange={(e) => setNewCompany({...newCompany, domain: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to auto-generate from company name
                </p>
              </div>
            </div>

            {/* Subscription and Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Subscription & Status</span>
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subscription">Subscription Plan</Label>
                  <Select 
                    value={newCompany.subscription} 
                    onValueChange={(value) => setNewCompany({...newCompany, subscription: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Pro">Pro</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newCompany.status} 
                    onValueChange={(value) => setNewCompany({...newCompany, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Navigation Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Navigation className="w-4 h-4" />
                <span>Navigation Settings</span>
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable maintenance mode to restrict access
                  </p>
                </div>
                <Switch 
                  checked={newCompany.maintenanceMode}
                  onCheckedChange={(checked) => setNewCompany({...newCompany, maintenanceMode: checked})}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Allowed Paths</Label>
                  <Input
                    type="number"
                    min="0"
                    value={newCompany.allowedPaths}
                    onChange={(e) => setNewCompany({...newCompany, allowedPaths: parseInt(e.target.value) || 0})}
                  />
                  <p className="text-xs text-muted-foreground">Paths users can access</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Blocked Paths</Label>
                  <Input
                    type="number"
                    min="0"
                    value={newCompany.blockedPaths}
                    onChange={(e) => setNewCompany({...newCompany, blockedPaths: parseInt(e.target.value) || 0})}
                  />
                  <p className="text-xs text-muted-foreground">Restricted paths</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Custom Routes</Label>
                  <Input
                    type="number"
                    min="0"
                    value={newCompany.customRoutes}
                    onChange={(e) => setNewCompany({...newCompany, customRoutes: parseInt(e.target.value) || 0})}
                  />
                  <p className="text-xs text-muted-foreground">Custom routing rules</p>
                </div>
              </div>
            </div>

            {/* Default Settings Info */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Default Navigation Settings</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Dashboard, Chatbots, Analytics, Settings, and Billing enabled</li>
                <li>• Team navigation disabled by default</li>
                <li>• Auto theme with purple/indigo color scheme</li>
                <li>• Custom logo and domain features available</li>
                <li>• All settings can be modified after creation</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddCompanyDialog(false)}
              disabled={addingCompany}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddCompany}
              disabled={addingCompany || !newCompany.companyName || !newCompany.email}
            >
              {addingCompany ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Add Company
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Update Company Status</span>
            </DialogTitle>
            <DialogDescription>
              {selectedCompany && `Update status for ${selectedCompany.companyName}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={statusUpdate.status} 
                onValueChange={(value) => setStatusUpdate({...statusUpdate, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Reason (Optional)</Label>
              <Input
                placeholder="Enter reason for status change..."
                value={statusUpdate.reason}
                onChange={(e) => setStatusUpdate({...statusUpdate, reason: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowStatusDialog(false)}
              disabled={updatingStatus}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate}
              disabled={updatingStatus}
            >
              {updatingStatus ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Update Status
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Users Management Dialog */}
      <Dialog open={showUsersDialog} onOpenChange={setShowUsersDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Manage Users</span>
            </DialogTitle>
            <DialogDescription>
              {selectedCompany && `Manage users for ${selectedCompany.companyName}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Company Users</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Users</span>
                  <Badge variant="outline">12</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Active Users</span>
                  <Badge variant="outline">8</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Admin Users</span>
                  <Badge variant="outline">2</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                View All Users
              </Button>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Invite New User
              </Button>
              <Button variant="outline" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Manage Permissions
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowUsersDialog(false)}
            >
              Close
            </Button>
            <Button onClick={() => router.push('/dashboard/admin/users')}>
              <Users className="w-4 h-4 mr-2" />
              Go to Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Billing Management Dialog */}
      <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Billing Information</span>
            </DialogTitle>
            <DialogDescription>
              {selectedCompany && `Billing details for ${selectedCompany.companyName}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Current Plan</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Plan</span>
                  <Badge variant="outline">{selectedCompany?.subscription || 'Free'}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Status</span>
                  <Badge variant={selectedCompany?.status === 'active' ? 'default' : 'secondary'}>
                    {selectedCompany?.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Next Billing</span>
                  <span className="text-sm text-muted-foreground">Dec 15, 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Amount</span>
                  <span className="text-sm font-medium">$29.99/month</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                View Invoice History
              </Button>
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowBillingDialog(false)}
            >
              Close
            </Button>
            <Button onClick={() => router.push('/dashboard/admin/subscriptions')}>
              <CreditCard className="w-4 h-4 mr-2" />
              Go to Billing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Path Management Dialog */}
      <Dialog open={showPathManagementDialog} onOpenChange={setShowPathManagementDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Navigation className="w-5 h-5" />
              <span>Path Management</span>
            </DialogTitle>
            <DialogDescription>
              {selectedCompany && `Manage allowed paths, blocked paths, and custom routes for ${selectedCompany.companyName}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Allowed Paths */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Allowed Paths</span>
                </h3>
                <Badge variant="outline">{pathManagement.allowedPaths.length} paths</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter allowed path (e.g., /dashboard/analytics)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement
                        addPath('allowed', target.value)
                        target.value = ''
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="allowed path"]') as HTMLInputElement
                      if (input) {
                        addPath('allowed', input.value)
                        input.value = ''
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {pathManagement.allowedPaths.map((path, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-sm font-mono">{path}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePath('allowed', index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Blocked Paths */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span>Blocked Paths</span>
                </h3>
                <Badge variant="outline">{pathManagement.blockedPaths.length} paths</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter blocked path (e.g., /admin/system)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement
                        addPath('blocked', target.value)
                        target.value = ''
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="blocked path"]') as HTMLInputElement
                      if (input) {
                        addPath('blocked', input.value)
                        input.value = ''
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {pathManagement.blockedPaths.map((path, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="text-sm font-mono">{path}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePath('blocked', index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Routes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  <span>Custom Routes</span>
                </h3>
                <Badge variant="outline">{pathManagement.customRoutes.length} routes</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Source path (e.g., /help)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement
                        const redirectInput = target.parentElement?.nextElementSibling?.querySelector('input') as HTMLInputElement
                        if (redirectInput) {
                          addCustomRoute(target.value, redirectInput.value)
                          target.value = ''
                          redirectInput.value = ''
                        }
                      }
                    }}
                  />
                  <Input
                    placeholder="Redirect to (e.g., /dashboard/support)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement
                        const sourceInput = target.parentElement?.previousElementSibling?.querySelector('input') as HTMLInputElement
                        if (sourceInput) {
                          addCustomRoute(sourceInput.value, target.value)
                          sourceInput.value = ''
                          target.value = ''
                        }
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const sourceInput = document.querySelector('input[placeholder*="Source path"]') as HTMLInputElement
                      const redirectInput = document.querySelector('input[placeholder*="Redirect to"]') as HTMLInputElement
                      if (sourceInput && redirectInput) {
                        addCustomRoute(sourceInput.value, redirectInput.value)
                        sourceInput.value = ''
                        redirectInput.value = ''
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {pathManagement.customRoutes.map((route, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                      route.enabled ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={route.enabled}
                          onCheckedChange={() => toggleCustomRoute(index)}
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono">{route.path}</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-sm font-mono">{route.redirect}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomRoute(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Path Management Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{pathManagement.allowedPaths.length}</div>
                  <div className="text-xs text-muted-foreground">Allowed Paths</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{pathManagement.blockedPaths.length}</div>
                  <div className="text-xs text-muted-foreground">Blocked Paths</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{pathManagement.customRoutes.length}</div>
                  <div className="text-xs text-muted-foreground">Custom Routes</div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPathManagementDialog(false)}
              disabled={updatingPaths}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePathUpdate}
              disabled={updatingPaths}
            >
              {updatingPaths ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation Items Dialog */}
      <Dialog open={showNavigationItemsDialog} onOpenChange={setShowNavigationItemsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Navigation Items Configuration</span>
            </DialogTitle>
            <DialogDescription>
              {selectedCompany && `Configure which navigation items are visible and their order for ${selectedCompany.companyName}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Navigation Items List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Navigation Items</h3>
                <Badge variant="outline">
                  {navigationItems.filter(item => item.enabled).length} of {navigationItems.length} enabled
                </Badge>
              </div>
              
              <div className="space-y-3">
                {navigationItems.map((item, index) => {
                  const IconComponent = getIconComponent(item.icon)
                  return (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                        item.enabled 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200' 
                          : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.enabled}
                            onCheckedChange={() => toggleNavigationItem(item.id)}
                          />
                          <IconComponent className="w-4 h-4 text-gray-500" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.label}</span>
                            <Badge variant="outline" className="text-xs">
                              #{item.order}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">
                            {item.path}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveNavigationItem(item.id, 'up')}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveNavigationItem(item.id, 'down')}
                          disabled={index === navigationItems.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Navigation Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Navigation Preview</h3>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  {navigationItems
                    .filter(item => item.enabled)
                    .sort((a, b) => a.order - b.order)
                    .map((item) => {
                      const IconComponent = getIconComponent(item.icon)
                      return (
                        <div key={item.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/30">
                          <IconComponent className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{item.label}</span>
                          <Badge variant="outline" className="text-xs ml-auto">
                            #{item.order}
                          </Badge>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Navigation Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {navigationItems.filter(item => item.enabled).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Enabled Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {navigationItems.filter(item => !item.enabled).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Disabled Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {navigationItems.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Items</div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-medium mb-2 text-blue-700 dark:text-blue-300">How it works</h4>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                <li>• <strong>Toggle Switch:</strong> Enable/disable navigation items</li>
                <li>• <strong>Up/Down Arrows:</strong> Reorder navigation items</li>
                <li>• <strong>Preview:</strong> See how navigation will appear to users</li>
                <li>• <strong>Order Numbers:</strong> Show the current position in navigation</li>
                <li>• <strong>Real-time:</strong> Changes are saved to Firebase immediately</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNavigationItemsDialog(false)}
              disabled={updatingNavigationItems}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleNavigationItemsUpdate}
              disabled={updatingNavigationItems}
            >
              {updatingNavigationItems ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Navigation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Company Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>Delete Company</span>
            </DialogTitle>
            <DialogDescription>
              This action will permanently delete {selectedCompany?.companyName} and all associated data. 
              A backup will be created and downloaded before deletion.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Backup Status */}
            {backupCreated && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Backup created and downloaded
                  </span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  All company data has been backed up to your device
                </p>
              </div>
            )}

            {/* Warning */}
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-700 dark:text-red-300 mb-1">
                    This action cannot be undone
                  </p>
                  <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                    <li>• All users and their data will be deleted</li>
                    <li>• All chatbots and conversations will be removed</li>
                    <li>• All analytics and settings will be lost</li>
                    <li>• All subscriptions and billing data will be deleted</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-2">
              <Label htmlFor="delete-confirmation">
                Type the company name to confirm deletion
              </Label>
              <Input
                id="delete-confirmation"
                placeholder={selectedCompany?.companyName}
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="border-red-200 focus:border-red-500"
              />
              <p className="text-xs text-muted-foreground">
                Enter "{selectedCompany?.companyName}" to confirm
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={deletingCompany}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteCompany}
              disabled={deletingCompany || deleteConfirmation !== selectedCompany?.companyName}
            >
              {deletingCompany ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Company
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 