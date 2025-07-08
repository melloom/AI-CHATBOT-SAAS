"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Wrench, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Mail,
  DollarSign,
  Calendar,
  MessageSquare,
  Settings,
  Globe,
  Database,
  Shield,
  Palette,
  Code,
  BarChart3,
  Users,
  Plus
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

interface ServiceRequest {
  id: string
  serviceName: string
  serviceDescription: string
  serviceCategory: string
  servicePrice: string
  userId: string
  userEmail: string
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed'
  submittedAt: any
  adminNotes: string
  assignedTo: string
  estimatedCompletion: string
  priority: string
}

export default function ServiceRequestsPage() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [estimatedCompletion, setEstimatedCompletion] = useState("")

  useEffect(() => {
    loadServiceRequests()
  }, [])

  const loadServiceRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/webvault/service-requests')
      if (response.ok) {
        const data = await response.json()
        setServiceRequests(data.serviceRequests || [])
      }
    } catch (error) {
      console.error("Error loading service requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateServiceRequest = async (requestId: string, updates: any) => {
    try {
      const response = await fetch(`/api/webvault/service-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await loadServiceRequests()
        setShowRequestDialog(false)
        setSelectedRequest(null)
        setAdminNotes("")
        setAssignedTo("")
        setEstimatedCompletion("")
      }
    } catch (error) {
      console.error("Error updating service request:", error)
    }
  }

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    await updateServiceRequest(requestId, { status: newStatus })
  }

  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setAdminNotes(request.adminNotes || "")
    setAssignedTo(request.assignedTo || "")
    setEstimatedCompletion(request.estimatedCompletion || "")
    setShowRequestDialog(true)
  }

  const handleSaveRequest = async () => {
    if (selectedRequest) {
      await updateServiceRequest(selectedRequest.id, {
        adminNotes,
        assignedTo,
        estimatedCompletion
      })
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web-design': return <Palette className="h-5 w-5" />
      case 'development': return <Code className="h-5 w-5" />
      case 'hosting': return <Database className="h-5 w-5" />
      case 'maintenance': return <Wrench className="h-5 w-5" />
      case 'security': return <Shield className="h-5 w-5" />
      case 'seo': return <Globe className="h-5 w-5" />
      case 'analytics': return <BarChart3 className="h-5 w-5" />
      case 'content': return <Users className="h-5 w-5" />
      default: return <Wrench className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = 
      request.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: serviceRequests.length,
    pending: serviceRequests.filter(r => r.status === 'pending').length,
    approved: serviceRequests.filter(r => r.status === 'approved').length,
    inProgress: serviceRequests.filter(r => r.status === 'in-progress').length,
    completed: serviceRequests.filter(r => r.status === 'completed').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading service requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wrench className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Service Requests</h1>
            <p className="text-gray-600">Manage service requests from users</p>
          </div>
        </div>
        <Button onClick={loadServiceRequests} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Requests</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by service name or user email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Service Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests found</h3>
              <p className="text-gray-500">No service requests match your current filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getCategoryIcon(request.serviceCategory)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{request.serviceName}</h3>
                          <p className="text-sm text-gray-600">{request.serviceDescription}</p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">User</p>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <p className="font-medium">{request.userEmail}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Price</p>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <p className="font-medium">{request.servicePrice}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Submitted</p>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <p className="font-medium">{formatDate(request.submittedAt)}</p>
                          </div>
                        </div>
                      </div>

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
                        onClick={() => handleViewRequest(request)}
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
                          <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'approved')}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'rejected')}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'in-progress')}>
                            <Settings className="h-4 w-4 mr-2" />
                            Mark In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'completed')}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Completed
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

      {/* Service Request Details Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Service Request Details</DialogTitle>
            <DialogDescription>
              Review and update service request information
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Information */}
              <div>
                <h3 className="font-semibold mb-3">Request Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{selectedRequest.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{selectedRequest.serviceCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">{selectedRequest.servicePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User:</span>
                    <span className="font-medium">{selectedRequest.userEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getStatusColor(selectedRequest.status)}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-3">Service Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">{selectedRequest.serviceDescription}</p>
                </div>
              </div>

              {/* Admin Management */}
              <div>
                <h3 className="font-semibold mb-3">Admin Management</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Assigned To</Label>
                    <Input 
                      value={assignedTo} 
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="Assign to team member..."
                    />
                  </div>
                  <div>
                    <Label>Estimated Completion</Label>
                    <Input 
                      value={estimatedCompletion} 
                      onChange={(e) => setEstimatedCompletion(e.target.value)}
                      placeholder="e.g., 2 weeks, March 15th..."
                    />
                  </div>
                  <div>
                    <Label>Admin Notes</Label>
                    <Textarea 
                      value={adminNotes} 
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes, requirements, or instructions..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRequest}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 