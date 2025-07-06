"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Phone
} from "lucide-react"
import { getPendingCompanyApprovals, updateCompanyApprovalStatus } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

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

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState<CompanyApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadApprovals()
  }, [])

  const loadApprovals = async () => {
    try {
      setLoading(true)
      const pendingApprovals = await getPendingCompanyApprovals()
      // Filter and transform the data to match our interface
      const validApprovals = pendingApprovals
        .filter((approval: any) => approval.companyName && approval.email)
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
      setApprovals(validApprovals)
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
                <Crown className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">Company Approval</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Review and approve new company registrations
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Platform operational</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{stats.totalPending} pending approvals</span>
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
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Approved</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <Check className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-green-900">{stats.totalApproved}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Check className="w-3 h-3 mr-1" />
              Successfully approved
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Rejected</CardTitle>
            <div className="p-2 bg-red-500 rounded-lg">
              <X className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-red-900">{stats.totalRejected}</div>
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
    </div>
  )
} 