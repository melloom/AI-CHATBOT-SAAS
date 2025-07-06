"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collection, getDocs, addDoc, doc, deleteDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
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
  Crown,
  Plus,
  Navigation,
  Mail,
  Globe,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { CompanyAutocomplete } from "@/components/ui/company-autocomplete"

interface Company {
  id: string
  companyName: string
  email: string
  subscription: string
  chatbots: number
  conversations: number
  lastActive: string
  status: 'active' | 'inactive' | 'suspended'
}

export default function CompaniesManagementPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false)
  const [addingCompany, setAddingCompany] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingCompany, setDeletingCompany] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null)
  const [newCompany, setNewCompany] = useState({
    companyName: "",
    email: "",
    domain: "",
    subscription: "Free",
    status: "active"
  })

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
          subscription: data.subscription?.plan || "Free",
          chatbots: data.chatbots?.length || 0,
          conversations: data.conversations?.length || 0,
          lastActive: data.lastActive || "Never",
          status: data.status || "inactive"
        }
        companiesData.push(company)
        console.log(`Loaded company: ${company.companyName} (${company.id})`)
      })
      
      console.log(`Total companies loaded: ${companiesData.length}`)
      setCompanies(companiesData)
    } catch (error) {
      console.error("Error loading companies:", error)
      // Show empty state instead of mock data
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewCompany = (company: Company) => {
    console.log(`Navigating to company details: ${company.companyName} (${company.id})`)
    router.push(`/dashboard/admin/companies/${company.id}`)
  }

  const handleCompanySettings = (company: Company) => {
    console.log(`Navigating to company navigation settings: ${company.companyName} (${company.id})`)
    router.push(`/dashboard/admin/companies/${company.id}/navigation-settings`)
  }

  const handleCompanyNavigation = (company: Company) => {
    console.log(`Navigating to company navigation settings: ${company.companyName} (${company.id})`)
    router.push(`/dashboard/admin/companies/${company.id}/navigation-settings`)
  }

  const handleAddCompany = async () => {
    if (!newCompany.companyName || !newCompany.email) {
      console.error("Company name and email are required")
      return
    }

    setAddingCompany(true)
    try {
      console.log("Adding new company to Firebase...")
      
      const companyData = {
        companyName: newCompany.companyName,
        email: newCompany.email,
        domain: newCompany.domain || `${newCompany.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        subscription: {
          plan: newCompany.subscription,
          status: "active"
        },
        status: newCompany.status,
        chatbots: [],
        conversations: [],
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        maintenanceMode: false,
        allowedPaths: 3,
        blockedPaths: 2,
        customRoutes: 1
      }

      const docRef = await addDoc(collection(db, "companies"), companyData)
      console.log("Company added successfully with ID:", docRef.id)

      // Add the new company to the local state
      const addedCompany: Company = {
        id: docRef.id,
        companyName: newCompany.companyName,
        email: newCompany.email,
        subscription: newCompany.subscription,
        chatbots: 0,
        conversations: 0,
        lastActive: "Just now",
        status: newCompany.status as 'active' | 'inactive' | 'suspended'
      }

      setCompanies([...companies, addedCompany])
      
      // Reset form and close dialog
      setNewCompany({
        companyName: "",
        email: "",
        domain: "",
        subscription: "Free",
        status: "active"
      })
      setShowAddCompanyDialog(false)
      
      console.log("Company added successfully:", addedCompany)
      
    } catch (error) {
      console.error("Error adding company:", error)
    } finally {
      setAddingCompany(false)
    }
  }

  const handleDeleteCompany = async (company: Company) => {
    setCompanyToDelete(company)
    setShowDeleteDialog(true)
  }

  const confirmDeleteCompany = async () => {
    if (!companyToDelete) return

    setDeletingCompany(true)
    try {
      console.log(`Deleting company: ${companyToDelete.companyName} (${companyToDelete.id})`)

      // Create backup before deletion
      const companyDoc = await getDoc(doc(db, "companies", companyToDelete.id))
      if (companyDoc.exists()) {
        const backupData = {
          ...companyDoc.data(),
          deletedAt: new Date().toISOString(),
          deletedBy: "admin"
        }
        
        // Store backup in a separate collection
        await addDoc(collection(db, "deleted_companies"), backupData)
        console.log("Company backup created before deletion")
      }

      // Delete the company
      await deleteDoc(doc(db, "companies", companyToDelete.id))
      console.log("Company deleted successfully")

      // Remove from local state
      setCompanies(companies.filter(c => c.id !== companyToDelete.id))
      
      // Close dialog and reset state
      setShowDeleteDialog(false)
      setCompanyToDelete(null)
      
      console.log("Company deleted and removed from UI")
      
    } catch (error) {
      console.error("Error deleting company:", error)
    } finally {
      setDeletingCompany(false)
    }
  }

  const stats = {
    totalCompanies: companies.length,
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
                <Crown className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">Company Management</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Manage all ChatHub companies and their subscriptions
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
              <CardTitle>All Companies</CardTitle>
              <CardDescription>
                Manage company accounts, subscriptions, and settings
              </CardDescription>
            </div>
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
              <Button onClick={() => setShowAddCompanyDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-500 mb-4">
                {companies.length === 0 
                  ? "No companies have been registered yet." 
                  : "No companies match your search criteria."
                }
              </p>
              {companies.length === 0 && (
                <Button onClick={() => setShowAddCompanyDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Company
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between p-4 border rounded-lg"
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
                      onClick={() => handleViewCompany(company)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-transparent hover:border-gray-300"
                      onClick={() => handleCompanySettings(company)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-transparent hover:border-gray-300"
                      onClick={() => handleCompanyNavigation(company)}
                    >
                      <Navigation className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="hover:bg-red-600 hover:text-white"
                      onClick={() => handleDeleteCompany(company)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Company Dialog */}
      <Dialog open={showAddCompanyDialog} onOpenChange={setShowAddCompanyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Add New Company</span>
            </DialogTitle>
            <DialogDescription>
              Create a new company account with basic information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
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
            
            <div className="grid grid-cols-2 gap-4">
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
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Company Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Delete Company</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this company? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {companyToDelete && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-8 h-8 text-red-500 dark:text-red-400" />
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200">{companyToDelete.companyName}</h4>
                    <p className="text-sm text-red-600 dark:text-red-300">{companyToDelete.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{companyToDelete.subscription}</Badge>
                      <Badge variant={companyToDelete.status === 'active' ? 'default' : 'secondary'}>
                        {companyToDelete.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">This will permanently delete:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Company profile and settings</li>
                  <li>All associated chatbots</li>
                  <li>Company data and configurations</li>
                </ul>
                <p className="mt-2 text-blue-600 dark:text-blue-400">
                  <strong>Note:</strong> A backup will be created before deletion for recovery purposes.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteDialog(false)
                setCompanyToDelete(null)
              }}
              disabled={deletingCompany}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeleteCompany}
              disabled={deletingCompany}
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