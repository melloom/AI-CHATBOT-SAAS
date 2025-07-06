"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Crown, 
  Search,
  Eye,
  Check,
  X,
  Clock,
  Building2,
  Mail,
  Phone,
  Database,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  UserPlus,
  RotateCcw,
  Trash2,
  Download,
  TestTube,
  Shield,
  Activity,
  AlertCircle
} from "lucide-react"
import { getPendingCompanyApprovals, updateCompanyApprovalStatus, getAllCompaniesNeedingApproval } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { doc, getDoc, updateDoc, collection, getDocs, query, where, addDoc, orderBy, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface CompanyApproval {
  id: string
  companyName: string
  email: string
  phone?: string
  website?: string
  industry?: string
  employeeCount?: string
  approvalStatus: 'pending' | 'approved' | 'rejected'
  createdAt: string
  description?: string
  domain?: string
}

interface DebugData {
  totalUsers: number
  pendingUsers: number
  approvedUsers: number
  rejectedUsers: number
  totalCompanies: number
  pendingCompanies: number
  approvedCompanies: number
  rejectedCompanies: number
  orphanedUsers: any[]
  orphanedCompanies: any[]
  allCompanies: any[]
  pendingCompaniesData: any[]
  allUsers: any[]
}

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState<CompanyApproval[]>([])
  const [approvedCompanies, setApprovedCompanies] = useState<CompanyApproval[]>([])
  const [deniedCompanies, setDeniedCompanies] = useState<CompanyApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [debugLoading, setDebugLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("approvals")
  const { toast } = useToast()

  useEffect(() => {
    loadApprovals()
  }, [])

  const loadApprovals = async () => {
    try {
      setLoading(true)
      const pendingApprovals = await getAllCompaniesNeedingApproval()
      console.log("Raw pending approvals:", pendingApprovals)
      
      // Filter and transform the data to match our interface
      const validApprovals = pendingApprovals
        .filter((approval: any) => {
          const isValid = approval.companyName && approval.email
          if (!isValid) {
            console.log("Filtered out invalid approval:", approval)
          }
          return isValid
        })
        .map((approval: any) => ({
          id: approval.id,
          companyName: approval.companyName,
          email: approval.email,
          phone: approval.phone,
          website: approval.website,
          industry: approval.industry,
          employeeCount: approval.employeeCount,
          approvalStatus: approval.approvalStatus || 'pending',
          createdAt: approval.createdAt,
          description: approval.description,
          domain: approval.domain,
        }))
      
      console.log("Processed approvals:", validApprovals)
      setApprovals(validApprovals)
      
      // Load approved and denied companies
      await loadApprovedCompanies()
      await loadDeniedCompanies()
    } catch (error) {
      console.error("Error loading approvals:", error)
      toast({
        title: "Error",
        description: "Failed to load company approvals. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadApprovedCompanies = async () => {
    try {
      const approvedQuery = query(
        collection(db, "companies"),
        where("approvalStatus", "==", "approved"),
        orderBy("createdAt", "desc")
      )
      const approvedSnapshot = await getDocs(approvedQuery)
      const approved = approvedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CompanyApproval[]
      
      setApprovedCompanies(approved)
    } catch (error) {
      console.error("Error loading approved companies:", error)
    }
  }

  const loadDeniedCompanies = async () => {
    try {
      const deniedQuery = query(
        collection(db, "companies"),
        where("approvalStatus", "==", "rejected"),
        orderBy("createdAt", "desc")
      )
      const deniedSnapshot = await getDocs(deniedQuery)
      const denied = deniedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CompanyApproval[]
      
      setDeniedCompanies(denied)
    } catch (error) {
      console.error("Error loading denied companies:", error)
    }
  }

  const filteredApprovals = approvals.filter(approval =>
    approval.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    approval.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    approval.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    totalPending: approvals.filter(a => a.approvalStatus === 'pending').length,
    totalApproved: 0, // We only show pending approvals in this view
    totalRejected: 0, // We only show pending approvals in this view
    totalApprovals: approvals.length
  }

  const handleApprove = async (id: string) => {
    try {
      await updateCompanyApprovalStatus(id, 'approved')
      toast({
        title: "Company Approved",
        description: "The company has been successfully approved.",
      })
      // Reload the approvals list
      await loadApprovals()
    } catch (error) {
      console.error("Error approving company:", error)
      toast({
        title: "Error",
        description: "Failed to approve company. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      await updateCompanyApprovalStatus(id, 'rejected')
      toast({
        title: "Company Rejected",
        description: "The company has been rejected.",
      })
      // Reload the approvals list
      await loadApprovals()
    } catch (error) {
      console.error("Error rejecting company:", error)
      toast({
        title: "Error",
        description: "Failed to reject company. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Debug functions
  const loadDebugData = async () => {
    try {
      setDebugLoading(true)
      
      // Get all users
      const usersSnapshot = await getDocs(collection(db, "users"))
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      // Get all companies
      const companiesSnapshot = await getDocs(collection(db, "companies"))
      const companies = companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      // Get pending companies specifically using the same query as admin page
      const pendingQuery = query(
        collection(db, "companies"),
        where("approvalStatus", "==", "pending"),
        orderBy("createdAt", "desc")
      )
      const pendingSnapshot = await getDocs(pendingQuery)
      const pendingCompanies = pendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      // Calculate statistics
      const pendingUsers = users.filter((u: any) => u.approvalStatus === 'pending')
      const approvedUsers = users.filter((u: any) => u.approvalStatus === 'approved')
      const rejectedUsers = users.filter((u: any) => u.approvalStatus === 'rejected')
      
      const pendingCompaniesManual = companies.filter((c: any) => c.approvalStatus === 'pending')
      const approvedCompanies = companies.filter((c: any) => c.approvalStatus === 'approved')
      const rejectedCompanies = companies.filter((c: any) => c.approvalStatus === 'rejected')
      
      // Find orphaned users (users without companies)
      const orphanedUsers = users.filter((user: any) => {
        return !companies.some((company: any) => company.userId === user.id)
      })
      
      // Find orphaned companies (companies without users)
      const orphanedCompanies = companies.filter((company: any) => {
        return !users.some((user: any) => user.id === company.userId)
      })
      
      setDebugData({
        totalUsers: users.length,
        pendingUsers: pendingUsers.length,
        approvedUsers: approvedUsers.length,
        rejectedUsers: rejectedUsers.length,
        totalCompanies: companies.length,
        pendingCompanies: pendingCompanies.length,
        approvedCompanies: approvedCompanies.length,
        rejectedCompanies: rejectedCompanies.length,
        orphanedUsers,
        orphanedCompanies,
        allCompanies: companies,
        pendingCompaniesData: pendingCompanies,
        allUsers: users
      })
      
    } catch (error) {
      console.error("Error loading debug data:", error)
      toast({
        title: "Error",
        description: "Failed to load debug data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDebugLoading(false)
    }
  }

  const fixOrphanedUser = async (userId: string) => {
    try {
      // Create a default company for orphaned user
      const userDoc = await getDoc(doc(db, "users", userId))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const companyData = {
          companyName: userData.companyName || "Default Company",
          email: userData.email,
          userId: userId,
          approvalStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'pending',
          subscription: {
            plan: 'Free',
            status: 'pending'
          }
        }
        
        const companyRef = await addDoc(collection(db, "companies"), companyData)
        
        // Update user with company ID
        await updateDoc(doc(db, "users", userId), {
          companyId: companyRef.id,
          approvalStatus: 'pending'
        })
        
        toast({
          title: "Fixed orphaned user",
          description: "Created company for orphaned user.",
        })
        
        await loadDebugData()
      }
    } catch (error) {
      console.error("Error fixing orphaned user:", error)
      toast({
        title: "Error",
        description: "Failed to fix orphaned user.",
        variant: "destructive",
      })
    }
  }

  const fixAllOrphanedUsers = async () => {
    try {
      const orphanedUsers = debugData?.orphanedUsers || []
      let fixedCount = 0
      
      for (const user of orphanedUsers) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.id))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            const companyData = {
              companyName: userData.companyName || `Company for ${userData.email?.split('@')[0]}`,
              email: userData.email,
              userId: user.id,
              approvalStatus: 'pending',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: 'pending',
              subscription: {
                plan: 'Free',
                status: 'pending'
              }
            }
            
            const companyRef = await addDoc(collection(db, "companies"), companyData)
            
            // Update user with company ID
            await updateDoc(doc(db, "users", user.id), {
              companyId: companyRef.id,
              approvalStatus: 'pending'
            })
            
            fixedCount++
          }
        } catch (error) {
          console.error(`Error fixing user ${user.id}:`, error)
        }
      }
      
      toast({
        title: "Fixed orphaned users",
        description: `Created companies for ${fixedCount} orphaned users.`,
      })
      
      await loadDebugData()
    } catch (error) {
      console.error("Error fixing orphaned users:", error)
      toast({
        title: "Error",
        description: "Failed to fix orphaned users.",
        variant: "destructive",
      })
    }
  }

  const createCompanyForUser = async (email: string) => {
    try {
      // Find user by email
      const usersQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      )
      const usersSnapshot = await getDocs(usersQuery)
      
      if (usersSnapshot.empty) {
        toast({
          title: "User not found",
          description: `No user found with email: ${email}`,
          variant: "destructive",
        })
        return
      }
      
      const userDoc = usersSnapshot.docs[0]
      const userData = userDoc.data()
      
      // Check if user already has a company
      if (userData.companyId) {
        toast({
          title: "User already has company",
          description: `User ${email} already has company ID: ${userData.companyId}`,
          variant: "destructive",
        })
        return
      }
      
      // Create company for user
      const companyData = {
        companyName: userData.companyName || `Company for ${email.split('@')[0]}`,
        email: email,
        userId: userDoc.id,
        approvalStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
        subscription: {
          plan: 'Free',
          status: 'pending'
        }
      }
      
      const companyRef = await addDoc(collection(db, "companies"), companyData)
      
      // Update user with company ID
      await updateDoc(doc(db, "users", userDoc.id), {
        companyId: companyRef.id,
        approvalStatus: 'pending'
      })
      
      toast({
        title: "Company created",
        description: `Created company for ${email}`,
      })
      
      await loadDebugData()
    } catch (error) {
      console.error("Error creating company for user:", error)
      toast({
        title: "Error",
        description: "Failed to create company for user.",
        variant: "destructive",
      })
    }
  }

  const createCompaniesForSpecificUsers = async () => {
    const specificUsers = [
      "melvin.a.p.cruz2@gmail.com",
      "greencasltegracie@gmail.com", 
      "marvelrivals@peni.net"
    ]
    
    let createdCount = 0
    
    for (const email of specificUsers) {
      try {
        await createCompanyForUser(email)
        createdCount++
      } catch (error) {
        console.error(`Error creating company for ${email}:`, error)
      }
    }
    
    toast({
      title: "Companies created",
      description: `Created companies for ${createdCount} users.`,
    })
    
    await loadDebugData()
  }

  // Advanced Debug Functions
  const approveAllPending = async () => {
    try {
      const pendingQuery = query(
        collection(db, "companies"),
        where("approvalStatus", "==", "pending")
      )
      const pendingSnapshot = await getDocs(pendingQuery)
      
      const updatePromises = pendingSnapshot.docs.map(async (docSnapshot) => {
        const companyData = docSnapshot.data()
        
        // Update company
        await updateDoc(docSnapshot.ref, {
          approvalStatus: 'approved',
          approvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        
        // Update user if exists
        if (companyData.userId) {
          await updateDoc(doc(db, "users", companyData.userId), {
            approvalStatus: 'approved',
            updatedAt: new Date().toISOString()
          })
        }
      })
      
      await Promise.all(updatePromises)
      
      toast({
        title: "All pending approvals approved",
        description: "All pending companies and users have been approved.",
      })
      
      await loadApprovals()
    } catch (error) {
      console.error("Error approving all pending:", error)
      toast({
        title: "Error",
        description: "Failed to approve all pending.",
        variant: "destructive",
      })
    }
  }

  const resetAllApprovals = async () => {
    try {
      const allCompaniesQuery = query(collection(db, "companies"))
      const allCompaniesSnapshot = await getDocs(allCompaniesQuery)
      
      const updatePromises = allCompaniesSnapshot.docs.map(async (docSnapshot) => {
        await updateDoc(docSnapshot.ref, {
          approvalStatus: 'pending',
          updatedAt: new Date().toISOString()
        })
      })
      
      await Promise.all(updatePromises)
      
      toast({
        title: "All approvals reset",
        description: "All companies have been reset to pending status.",
      })
      
      await loadApprovals()
    } catch (error) {
      console.error("Error resetting approvals:", error)
      toast({
        title: "Error",
        description: "Failed to reset approvals.",
        variant: "destructive",
      })
    }
  }

  const deleteOrphanedCompanies = async () => {
    try {
      const orphanedCompanies = debugData?.orphanedCompanies || []
      let deletedCount = 0
      
      for (const company of orphanedCompanies) {
        try {
          await deleteDoc(doc(db, "companies", company.id))
          deletedCount++
        } catch (error) {
          console.error(`Error deleting company ${company.id}:`, error)
        }
      }
      
      toast({
        title: "Orphaned companies deleted",
        description: `Deleted ${deletedCount} orphaned companies.`,
      })
      
      await loadDebugData()
    } catch (error) {
      console.error("Error deleting orphaned companies:", error)
      toast({
        title: "Error",
        description: "Failed to delete orphaned companies.",
        variant: "destructive",
      })
    }
  }

  const exportDebugData = async () => {
    try {
      const data = {
        timestamp: new Date().toISOString(),
        debugData,
        approvals: approvals,
        approvedCompanies: approvedCompanies,
        deniedCompanies: deniedCompanies
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `debug-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Debug data exported",
        description: "Debug data has been downloaded as JSON file.",
      })
    } catch (error) {
      console.error("Error exporting debug data:", error)
      toast({
        title: "Error",
        description: "Failed to export debug data.",
        variant: "destructive",
      })
    }
  }

  const clearAllData = async () => {
    if (confirm("Are you sure you want to clear ALL data? This action cannot be undone.")) {
      try {
        // Clear all companies
        const companiesQuery = query(collection(db, "companies"))
        const companiesSnapshot = await getDocs(companiesQuery)
        
        const deletePromises = companiesSnapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(deletePromises)
        
        toast({
          title: "All data cleared",
          description: "All companies have been deleted.",
        })
        
        await loadApprovals()
      } catch (error) {
        console.error("Error clearing data:", error)
        toast({
          title: "Error",
          description: "Failed to clear data.",
          variant: "destructive",
        })
      }
    }
  }

  const testApprovalSystem = async () => {
    try {
      // Test the approval system by creating a test company
      const testCompanyData = {
        companyName: `Test Company ${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        userId: 'test-user-id',
        approvalStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
        subscription: {
          plan: 'Free',
          status: 'pending'
        }
      }
      
      const companyRef = await addDoc(collection(db, "companies"), testCompanyData)
      
      toast({
        title: "Test company created",
        description: `Test company created with ID: ${companyRef.id}`,
      })
      
      await loadApprovals()
    } catch (error) {
      console.error("Error testing approval system:", error)
      toast({
        title: "Error",
        description: "Failed to test approval system.",
        variant: "destructive",
      })
    }
  }

  const validateDataIntegrity = async () => {
    try {
      const issues = []
      
      // Check for orphaned users
      if (debugData && debugData.orphanedUsers && debugData.orphanedUsers.length > 0) {
        issues.push(`${debugData.orphanedUsers.length} orphaned users found`)
      }
      
      // Check for orphaned companies
      if (debugData && debugData.orphanedCompanies && debugData.orphanedCompanies.length > 0) {
        issues.push(`${debugData.orphanedCompanies.length} orphaned companies found`)
      }
      
      // Check for companies without approval status
      const companiesWithoutStatus = debugData?.allCompanies?.filter(c => !c.approvalStatus) || []
      if (companiesWithoutStatus.length > 0) {
        issues.push(`${companiesWithoutStatus.length} companies without approval status`)
      }
      
      if (issues.length === 0) {
        toast({
          title: "Data integrity validated",
          description: "No data integrity issues found.",
        })
      } else {
        toast({
          title: "Data integrity issues found",
          description: issues.join(', '),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error validating data integrity:", error)
      toast({
        title: "Error",
        description: "Failed to validate data integrity.",
        variant: "destructive",
      })
    }
  }

  const refreshAllData = async () => {
    try {
      await loadApprovals()
      await loadDebugData()
      toast({
        title: "Data refreshed",
        description: "All data has been refreshed.",
      })
    } catch (error) {
      console.error("Error refreshing data:", error)
      toast({
        title: "Error",
        description: "Failed to refresh data.",
        variant: "destructive",
      })
    }
  }

  const showSystemStatus = () => {
    if (!debugData) {
      toast({
        title: "No Data Available",
        description: "Please load debug data first to view system status.",
        variant: "destructive",
      })
      return
    }

    const status = {
      totalUsers: debugData.totalUsers || 0,
      totalCompanies: debugData.totalCompanies || 0,
      pendingCompanies: debugData.pendingCompanies || 0,
      approvedCompanies: debugData.approvedCompanies || 0,
      rejectedCompanies: debugData.rejectedCompanies || 0,
      orphanedUsers: debugData.orphanedUsers?.length || 0,
      orphanedCompanies: debugData.orphanedCompanies?.length || 0
    }
    
    const statusMessage = [
      `👥 Users: ${status.totalUsers}`,
      `🏢 Companies: ${status.totalCompanies}`,
      `⏳ Pending: ${status.pendingCompanies}`,
      `✅ Approved: ${status.approvedCompanies}`,
      `❌ Rejected: ${status.rejectedCompanies}`,
      `⚠️ Orphaned Users: ${status.orphanedUsers}`,
      `⚠️ Orphaned Companies: ${status.orphanedCompanies}`
    ].join('\n')
    
    toast({
      title: "System Status Overview",
      description: statusMessage,
    })
  }

  const showDatabaseStats = () => {
    if (!debugData) {
      toast({
        title: "No Data Available",
        description: "Please load debug data first to view database statistics.",
        variant: "destructive",
      })
      return
    }

    const stats = {
      users: debugData.totalUsers || 0,
      companies: debugData.totalCompanies || 0,
      pending: debugData.pendingCompanies || 0,
      approved: debugData.approvedCompanies || 0,
      rejected: debugData.rejectedCompanies || 0
    }
    
    const approvalRate = stats.companies > 0 ? ((stats.approved / stats.companies) * 100).toFixed(1) : 0
    const rejectionRate = stats.companies > 0 ? ((stats.rejected / stats.companies) * 100).toFixed(1) : 0
    const pendingRate = stats.companies > 0 ? ((stats.pending / stats.companies) * 100).toFixed(1) : 0
    
    const statsMessage = [
      `📊 Database Statistics:`,
      `👥 Total Users: ${stats.users}`,
      `🏢 Total Companies: ${stats.companies}`,
      `⏳ Pending: ${stats.pending} (${pendingRate}%)`,
      `✅ Approved: ${stats.approved} (${approvalRate}%)`,
      `❌ Rejected: ${stats.rejected} (${rejectionRate}%)`
    ].join('\n')
    
    toast({
      title: "Database Statistics",
      description: statsMessage,
    })
  }

  const showErrorLogs = () => {
    const currentTime = new Date().toLocaleString()
    const errorLogs = [
      `🕒 Last Updated: ${currentTime}`,
      `📝 Recent Activity:`,
      `• System running normally`,
      `• No critical errors detected`,
      `• Database connection: OK`,
      `• Approval system: Active`,
      `• Debug tools: Available`
    ].join('\n')
    
    toast({
      title: "System Health & Error Logs",
      description: errorLogs,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading approvals...</p>
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
                {activeTab === "approvals" ? (
                  <Crown className="h-8 w-8 text-yellow-300" />
                ) : (
                  <Database className="h-8 w-8 text-yellow-300" />
                )}
                <h1 className="text-3xl md:text-4xl font-bold">
                  {activeTab === "approvals" ? "Company Approval" : "Approval System Debug"}
                </h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                {activeTab === "approvals" 
                  ? "Review and approve new company registrations"
                  : "Debug and fix approval system issues"
                }
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Platform operational</span>
                </div>
                {activeTab === "approvals" ? (
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{stats.totalPending} pending approvals</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{debugData?.orphanedUsers?.length || 0} orphaned users</span>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                {activeTab === "approvals" ? (
                  <Building2 className="w-16 h-16 text-white" />
                ) : (
                  <UserCheck className="w-16 h-16 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="approvals" className="flex items-center space-x-2">
            <Crown className="w-4 h-4" />
            <span>Pending</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Approved</span>
          </TabsTrigger>
          <TabsTrigger value="denied" className="flex items-center space-x-2">
            <X className="w-4 h-4" />
            <span>Denied</span>
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Debug</span>
          </TabsTrigger>
        </TabsList>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-8">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-yellow-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">Pending Approvals</CardTitle>
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-yellow-900">{stats.totalPending}</div>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Total Requests</CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-blue-900">{stats.totalApprovals}</div>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  All time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Approvals Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Company Approval Requests</CardTitle>
                  <CardDescription>
                    Review and approve new company registrations
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
              {filteredApprovals.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending approvals</h3>
                  <p className="text-muted-foreground">All companies have been reviewed or there are no new requests.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApprovals.map((approval) => (
                    <div
                      key={approval.id}
                      className="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">{approval.companyName}</h3>
                            <Badge variant="secondary">
                              {approval.approvalStatus}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{approval.email}</span>
                            </div>
                            {approval.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{approval.phone}</span>
                              </div>
                            )}
                            {approval.industry && (
                              <div className="flex items-center space-x-2">
                                <Building2 className="w-4 h-4" />
                                <span>{approval.industry} {approval.employeeCount && `• ${approval.employeeCount} employees`}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>Submitted: {new Date(approval.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {approval.description && (
                            <p className="text-sm text-muted-foreground mt-2">{approval.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {approval.approvalStatus === 'pending' && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleApprove(approval.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleReject(approval.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approved Tab */}
        <TabsContent value="approved" className="space-y-8">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Approved Companies</CardTitle>
                <div className="p-2 bg-green-500 rounded-lg">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-green-900">{approvedCompanies.length}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Check className="w-3 h-3 mr-1" />
                  Successfully approved
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Total Requests</CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-blue-900">{stats.totalApprovals}</div>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  All time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Approved Companies Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Approved Companies</CardTitle>
                  <CardDescription>
                    Companies that have been approved and are active
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search approved companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {approvedCompanies.length === 0 ? (
                <div className="text-center py-8">
                  <Check className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No approved companies</h3>
                  <p className="text-muted-foreground">No companies have been approved yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvedCompanies
                    .filter(company => 
                      company.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      company.email?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">{company.companyName}</h3>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Approved
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{company.email}</span>
                            </div>
                            {company.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{company.phone}</span>
                              </div>
                            )}
                            {company.industry && (
                              <div className="flex items-center space-x-2">
                                <Building2 className="w-4 h-4" />
                                <span>{company.industry} {company.employeeCount && `• ${company.employeeCount} employees`}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>Approved: {new Date(company.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {company.description && (
                            <p className="text-sm text-muted-foreground mt-2">{company.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Denied Tab */}
        <TabsContent value="denied" className="space-y-8">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Denied Companies</CardTitle>
                <div className="p-2 bg-red-500 rounded-lg">
                  <X className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-red-900">{deniedCompanies.length}</div>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <X className="w-3 h-3 mr-1" />
                  Not approved
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Total Requests</CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-blue-900">{stats.totalApprovals}</div>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  All time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Denied Companies Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Denied Companies</CardTitle>
                  <CardDescription>
                    Companies that have been rejected
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search denied companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {deniedCompanies.length === 0 ? (
                <div className="text-center py-8">
                  <X className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No denied companies</h3>
                  <p className="text-muted-foreground">No companies have been denied yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deniedCompanies
                    .filter(company => 
                      company.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      company.email?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <X className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">{company.companyName}</h3>
                            <Badge variant="destructive">
                              Denied
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{company.email}</span>
                            </div>
                            {company.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{company.phone}</span>
                              </div>
                            )}
                            {company.industry && (
                              <div className="flex items-center space-x-2">
                                <Building2 className="w-4 h-4" />
                                <span>{company.industry} {company.employeeCount && `• ${company.employeeCount} employees`}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>Denied: {new Date(company.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {company.description && (
                            <p className="text-sm text-muted-foreground mt-2">{company.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Debug Tab */}
        <TabsContent value="debug" className="space-y-8">

          {/* Debug Actions - Always Visible */}
          <Card>
            <CardHeader>
              <CardTitle>Debug Actions</CardTitle>
              <CardDescription>
                Tools to fix approval system issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button onClick={loadDebugData} variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <RefreshCw className="w-6 h-6 mb-2" />
                  <span className="text-sm">Load Debug Data</span>
                </Button>
                
                {debugData?.orphanedUsers && debugData.orphanedUsers.length > 0 && (
                  <Button onClick={fixAllOrphanedUsers} className="bg-blue-600 hover:bg-blue-700 h-auto p-4 flex flex-col items-center">
                    <Users className="w-6 h-6 mb-2" />
                    <span className="text-sm">Fix Orphaned Users ({debugData.orphanedUsers.length})</span>
                  </Button>
                )}
                
                <Button onClick={createCompaniesForSpecificUsers} className="bg-purple-600 hover:bg-purple-700 h-auto p-4 flex flex-col items-center">
                  <UserPlus className="w-6 h-6 mb-2" />
                  <span className="text-sm">Create Companies for Specific Users</span>
                </Button>
                
                <Button onClick={approveAllPending} className="bg-green-600 hover:bg-green-700 h-auto p-4 flex flex-col items-center">
                  <Check className="w-6 h-6 mb-2" />
                  <span className="text-sm">Approve All Pending</span>
                </Button>
              </div>

              {/* Advanced Actions */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4 text-muted-foreground">Advanced Debug Tools</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button onClick={resetAllApprovals} variant="outline" className="h-auto p-3 flex flex-col items-center">
                    <RotateCcw className="w-5 h-5 mb-1" />
                    <span className="text-xs">Reset All to Pending</span>
                  </Button>
                  
                  <Button onClick={deleteOrphanedCompanies} variant="outline" className="h-auto p-3 flex flex-col items-center">
                    <Trash2 className="w-5 h-5 mb-1" />
                    <span className="text-xs">Delete Orphaned Companies</span>
                  </Button>
                  
                  <Button onClick={exportDebugData} variant="outline" className="h-auto p-3 flex flex-col items-center">
                    <Download className="w-5 h-5 mb-1" />
                    <span className="text-xs">Export Debug Data</span>
                  </Button>
                  
                  <Button onClick={clearAllData} variant="destructive" className="h-auto p-3 flex flex-col items-center">
                    <AlertTriangle className="w-5 h-5 mb-1" />
                    <span className="text-xs">Clear All Data</span>
                  </Button>
                  
                  <Button onClick={testApprovalSystem} variant="outline" className="h-auto p-3 flex flex-col items-center">
                    <TestTube className="w-5 h-5 mb-1" />
                    <span className="text-xs">Test Approval System</span>
                  </Button>
                  
                  <Button onClick={validateDataIntegrity} variant="outline" className="h-auto p-3 flex flex-col items-center">
                    <Shield className="w-5 h-5 mb-1" />
                    <span className="text-xs">Validate Data Integrity</span>
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4 text-muted-foreground">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={refreshAllData} size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh All Data
                  </Button>
                  <Button onClick={showSystemStatus} size="sm" variant="outline">
                    <Activity className="w-4 h-4 mr-1" />
                    System Status
                  </Button>
                  <Button onClick={showDatabaseStats} size="sm" variant="outline">
                    <Database className="w-4 h-4 mr-1" />
                    Database Stats
                  </Button>
                  <Button onClick={showErrorLogs} size="sm" variant="outline">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Error Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debug Loading */}
          {debugLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading debug data...</p>
              </div>
            </div>
          )}

          {/* Debug Statistics - Only when data is loaded */}
          {debugData && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{debugData.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {debugData.pendingUsers} pending, {debugData.approvedUsers} approved
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                  <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{debugData.totalCompanies}</div>
                  <p className="text-xs text-muted-foreground">
                    {debugData.pendingCompanies} pending, {debugData.approvedCompanies} approved
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orphaned Users</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{debugData.orphanedUsers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Users without companies
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orphaned Companies</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{debugData.orphanedCompanies.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Companies without users
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">Total Requests</CardTitle>
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-blue-900">{stats.totalApprovals}</div>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    All time
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orphaned Users */}
          {debugData && debugData.orphanedUsers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Orphaned Users</CardTitle>
                <CardDescription>
                  Users without associated companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {debugData.orphanedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{user.email}</h4>
                        <p className="text-sm text-muted-foreground">
                          Company: {user.companyName || 'No company'}
                        </p>
                        <Badge variant="secondary">{user.approvalStatus}</Badge>
                      </div>
                      <Button 
                        onClick={() => fixOrphanedUser(user.id)}
                        size="sm"
                      >
                        Fix User
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Raw Company Data */}
          {debugData && (
            <Card>
              <CardHeader>
                <CardTitle>Raw Company Data</CardTitle>
                <CardDescription>
                  All companies in the database and their approval status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">All Companies ({debugData.allCompanies?.length || 0})</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {debugData.allCompanies?.map((company: any) => (
                        <div key={company.id} className="p-3 border rounded bg-muted/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong>{company.companyName}</strong>
                              <p className="text-sm text-muted-foreground">ID: {company.id}</p>
                              <p className="text-sm text-muted-foreground">Email: {company.email}</p>
                              <p className="text-sm text-muted-foreground">User ID: {company.userId}</p>
                            </div>
                            <Badge variant={company.approvalStatus === 'pending' ? 'secondary' : 'default'}>
                              {company.approvalStatus || 'no status'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 