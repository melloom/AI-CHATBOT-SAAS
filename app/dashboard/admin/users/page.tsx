"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUsers } from "@/hooks/use-users"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { collection, getDoc, doc, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ReadOnlyIndicator } from "@/components/ui/read-only-indicator"
import { 
  Crown, 
  Users, 
  UserPlus, 
  Shield, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Download,
  Upload,
  RefreshCw,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  User,
  CreditCard,
  Activity,
  LogIn
} from "lucide-react"

interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  isAdmin?: boolean
  isActive?: boolean
  companyId?: string
  companyName?: string
  role?: string
  createdAt?: string
  lastLoginAt?: string
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  subscription?: {
    plan?: string
    status?: string
    expiresAt?: string
  }
  metadata?: {
    phone?: string
    department?: string
    location?: string
  }
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingUser, setDeletingUser] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [createUserForm, setCreateUserForm] = useState({
    email: '',
    displayName: '',
    role: 'user',
    isActive: true,
    companyName: ''
  })

  const { profile } = useAuth()
  const isReadOnly = profile?.isReadOnly

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])
  
  const { 
    users, 
    loading, 
    fetchUsers, 
    createUser, 
    updateUser, 
    deleteUser, 
    bulkOperation,
    getFilteredUsers,
    getUserStats
  } = useUsers()
  
  const { toast } = useToast()

  // Load users on component mount
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Get filtered users based on current filters
  const filteredUsers = getFilteredUsers({
    search: debouncedSearchTerm,
    status: statusFilter,
    role: roleFilter
  })

  // Group users by company
  const usersByCompany = filteredUsers.reduce((acc, user) => {
    const companyId = user.companyId || 'no-company'
    const companyName = user.companyName || 'No Company'
    
    if (!acc[companyId]) {
      acc[companyId] = {
        id: companyId,
        name: companyName,
        users: []
      }
    }
    
    acc[companyId].users.push(user)
    return acc
  }, {} as Record<string, { id: string; name: string; users: User[] }>)

  // Debug logging
  console.log('User Management State:', {
    totalUsers: users.length,
    searchTerm,
    debouncedSearchTerm,
    statusFilter,
    roleFilter,
    filteredUsersCount: filteredUsers.length,
    companiesCount: Object.keys(usersByCompany).length,
    selectedUsersCount: selectedUsers.length
  })

  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set())

  const handleUserAction = async (action: string, userId: string, data?: any) => {
    try {
      switch (action) {
        case 'delete':
          await deleteUser(userId)
          break
        case 'activate':
          await updateUser(userId, { isActive: true })
          break
        case 'deactivate':
          await updateUser(userId, { isActive: false })
          break
        case 'approve':
          await updateUser(userId, { approvalStatus: 'approved' })
          break
        case 'reject':
          await updateUser(userId, { approvalStatus: 'rejected' })
          break
        default:
          console.log('User action completed:', { action, userId, data })
      }
    } catch (error) {
              console.error('User action failed:', { action, userId, error })
    }
  }

  const handleDeleteUser = async (user: User) => {
    setUserToDelete(user)
    setShowDeleteDialog(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    setDeletingUser(true)
    try {
      console.log(`Deleting user: ${userToDelete.email} (${userToDelete.id})`)

      // Create backup before deletion
      const userDoc = await getDoc(doc(db, "users", userToDelete.id))
      if (userDoc.exists()) {
        const backupData = {
          ...userDoc.data(),
          deletedAt: new Date().toISOString(),
          deletedBy: "admin"
        }
        
        // Store backup in a separate collection
        await addDoc(collection(db, "deleted_users"), backupData)
        console.log("User backup created before deletion")
      }

      // Delete the user
      await deleteUser(userToDelete.id)
      console.log("User deleted successfully")

      // Close dialog and reset state
      setShowDeleteDialog(false)
      setUserToDelete(null)
      
      toast({
        title: "User Deleted",
        description: `${userToDelete.displayName || userToDelete.email} has been deleted successfully.`,
        variant: "default"
      })
      
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeletingUser(false)
    }
  }

  const handleBulkAction = async (action: string, userIds: string[]) => {
    if (userIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select users to perform bulk operations",
        variant: "destructive"
      })
      return
    }

    try {
      await bulkOperation(action as any, userIds)
      setSelectedUsers([])
    } catch (error) {
              console.error('Bulk user action failed:', { action, error })
    }
  }

  const handleExportUsers = () => {
    try {
      const exportData = filteredUsers.map(user => ({
        id: user.id,
        email: user.email,
        displayName: user.displayName || '',
        companyName: user.companyName || '',
        role: user.role || 'user',
        isActive: user.isActive,
        approvalStatus: user.approvalStatus || 'pending',
        department: user.metadata?.department || '',
        location: user.metadata?.location || '',
        phone: user.metadata?.phone || '',
        createdAt: user.createdAt || '',
        lastLoginAt: user.lastLoginAt || ''
      }))

      const csvContent = [
        ['ID', 'Email', 'Display Name', 'Company', 'Role', 'Active', 'Status', 'Department', 'Location', 'Phone', 'Created', 'Last Login'],
        ...exportData.map(user => [
          user.id,
          user.email,
          user.displayName,
          user.companyName,
          user.role,
          user.isActive ? 'Yes' : 'No',
          user.approvalStatus,
          user.department,
          user.location,
          user.phone,
          user.createdAt,
          user.lastLoginAt
        ])
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export Successful",
        description: `Exported ${exportData.length} users to CSV`,
      })
    } catch (error) {
      console.error('Export failed:', error)
      toast({
        title: "Export Failed",
        description: "Failed to export users",
        variant: "destructive"
      })
    }
  }

  const handleImportUsers = async (csvContent: string) => {
    try {
      const lines = csvContent.split('\n')
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      const dataLines = lines.slice(1).filter(line => line.trim())
      
      const usersToImport = dataLines.map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim())
        const user: any = {}
        
        headers.forEach((header, index) => {
          user[header.toLowerCase().replace(/\s+/g, '')] = values[index] || ''
        })
        
        return {
          email: user.email,
          displayName: user.displayname || user['displayname'],
          role: user.role || 'user',
          companyName: user.company || user.companyname,
          isActive: true,
          approvalStatus: 'pending',
          createdAt: new Date().toISOString()
        }
      }).filter(user => user.email)

      if (usersToImport.length === 0) {
        toast({
          title: "Import Failed",
          description: "No valid users found in CSV",
          variant: "destructive"
        })
        return
      }

      // Import users via API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users: usersToImport })
      })

      if (!response.ok) {
        throw new Error('Failed to import users')
      }

      const result = await response.json()
      
      toast({
        title: "Import Successful",
        description: `Imported ${usersToImport.length} users`,
      })

      setIsImportDialogOpen(false)
      fetchUsers() // Refresh the user list
    } catch (error) {
      console.error('Import failed:', error)
      toast({
        title: "Import Failed",
        description: "Failed to import users",
        variant: "destructive"
      })
    }
  }

  const handleCreateUser = async () => {
    if (!createUserForm.email) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      })
      return
    }

    try {
      const userId = createUserForm.email.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now()
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          data: {
            ...createUserForm,
            isAdmin: createUserForm.role === 'admin',
            approvalStatus: 'pending',
            createdAt: new Date().toISOString()
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      toast({
        title: "Success",
        description: "User created successfully",
      })

      // Reset form
      setCreateUserForm({
        email: '',
        displayName: '',
        role: 'user',
        isActive: true,
        companyName: ''
      })
      
      setIsCreateDialogOpen(false)
      fetchUsers() // Refresh the user list
    } catch (error) {
      console.error('Create user failed:', error)
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-500">Approved</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default" className="bg-purple-500">Admin</Badge>
      case "user":
        return <Badge variant="outline">User</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getSubscriptionBadge = (subscription?: any) => {
    if (!subscription) return <Badge variant="outline">No Plan</Badge>
    
    switch (subscription.status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">{subscription.plan}</Badge>
      case "inactive":
        return <Badge variant="secondary">{subscription.plan}</Badge>
      default:
        return <Badge variant="outline">{subscription.plan}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">User Management</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Manage user accounts, permissions, and access across the platform
              </p>
              <div className="flex items-center gap-4 text-sm">
                {(() => {
                  const stats = getUserStats()
                  return (
                    <>
                      <span>Total Users: {stats.total}</span>
                      <span>Active: {stats.active}</span>
                      <span>Admins: {stats.admins}</span>
                      <span>Companies: {Object.keys(usersByCompany).length}</span>
                      <span>Approved: {stats.approved}</span>
                      <span>Pending: {stats.pending}</span>
                    </>
                  )
                })()}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users, companies, departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-8 w-full sm:w-64"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm("")}
              >
                <XCircle className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (selectedUsers.length === filteredUsers.length) {
                setSelectedUsers([])
              } else {
                setSelectedUsers(filteredUsers.map(user => user.id))
              }
            }}
          >
            {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <ReadOnlyIndicator isReadOnly={isReadOnly} />
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 mr-4">
              <span className="text-sm text-muted-foreground">{selectedUsers.length} selected</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('activate', selectedUsers)}
                disabled={isReadOnly}
                title={isReadOnly ? "Read-only mode: Cannot modify users" : ""}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Activate
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('deactivate', selectedUsers)}
                disabled={isReadOnly}
                title={isReadOnly ? "Read-only mode: Cannot modify users" : ""}
              >
                <UserX className="h-4 w-4 mr-2" />
                Deactivate
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('approve', selectedUsers)}
                disabled={isReadOnly}
                title={isReadOnly ? "Read-only mode: Cannot modify users" : ""}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedUsers([])}
              >
                Clear
              </Button>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportUsers}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsImportDialogOpen(true)}
            disabled={isReadOnly}
            title={isReadOnly ? "Read-only mode: Cannot import users" : ""}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={isReadOnly} title={isReadOnly ? "Read-only mode: Cannot create users" : ""}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the platform
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="user@example.com"
                    value={createUserForm.email}
                    onChange={(e) => setCreateUserForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    placeholder="John Doe"
                    value={createUserForm.displayName}
                    onChange={(e) => setCreateUserForm(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company</Label>
                  <Input 
                    id="companyName" 
                    placeholder="Company Name"
                    value={createUserForm.companyName}
                    onChange={(e) => setCreateUserForm(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={createUserForm.role} 
                    onValueChange={(value) => setCreateUserForm(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isActive" 
                    checked={createUserForm.isActive}
                    onCheckedChange={(checked) => setCreateUserForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active Account</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateUser}
                    disabled={isReadOnly}
                    title={isReadOnly ? "Read-only mode: Cannot create users" : ""}
                  >
                    Create User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* User List */}
        <Card>
          <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </div>
            {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all') && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Search: "{searchTerm}"
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Status: {statusFilter}
                  </Badge>
                )}
                {roleFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Role: {roleFilter}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setRoleFilter("all")
                  }}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
          </CardHeader>
          <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {Object.values(usersByCompany).map((company) => (
                <div key={company.id} className="border border-border rounded-lg overflow-hidden bg-card">
                  {/* Company Header */}
                  <div 
                    className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => {
                      const newExpanded = new Set(expandedCompanies)
                      if (newExpanded.has(company.id)) {
                        newExpanded.delete(company.id)
                      } else {
                        newExpanded.add(company.id)
                      }
                      setExpandedCompanies(newExpanded)
                    }}
                  >
                                                        <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={company.users.every(user => selectedUsers.includes(user.id))}
                      onCheckedChange={(checked) => {
                        const companyUserIds = company.users.map(user => user.id)
                        if (checked) {
                          // Add all company users to selection
                          const newSelected = [...selectedUsers, ...companyUserIds.filter(id => !selectedUsers.includes(id))]
                          setSelectedUsers(newSelected)
                        } else {
                          // Remove all company users from selection
                          setSelectedUsers(selectedUsers.filter(id => !companyUserIds.includes(id)))
                        }
                      }}
                    />
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold text-foreground">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">{company.users.length} users</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{company.users.length} users</Badge>
                    {expandedCompanies.has(company.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  </div>

                  {/* Company Users */}
                  {expandedCompanies.has(company.id) && (
                    <div className="border-t border-border">
                      {company.users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/50 border-b border-border last:border-b-0 transition-colors">
                          <div className="flex items-center space-x-4">
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUsers([...selectedUsers, user.id])
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                                }
                              }}
                            />
                            <Avatar>
                              <AvatarImage src={user.photoURL} />
                              <AvatarFallback>
                                {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate text-foreground">{user.displayName || user.email}</h3>
                        {user.isAdmin && <Crown className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {getRoleBadge(user.role || 'user')}
                                {getStatusBadge(user.approvalStatus || 'pending')}
                                {getSubscriptionBadge(user.subscription)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setIsEditDialogOpen(true)
                              }}
                              disabled={isReadOnly}
                              title={isReadOnly ? "Read-only mode: Cannot edit users" : ""}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              disabled={isReadOnly}
                              title={isReadOnly ? "Read-only mode: Cannot delete users" : ""}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {Object.values(usersByCompany).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching your criteria
                </div>
              )}
            </div>
          )}
          </CardContent>
        </Card>

      {/* User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">User Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-8">
              {/* User Header */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 p-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
                <div className="relative flex items-center space-x-6">
                  <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
                    <AvatarImage src={selectedUser.photoURL} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {selectedUser.displayName?.charAt(0) || selectedUser.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-foreground">
                        {selectedUser.displayName || 'No Name'}
                      </h3>
                      {selectedUser.isAdmin && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                          <Crown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Admin</span>
                        </div>
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground mb-3">{selectedUser.email}</p>
                    <div className="flex items-center gap-3">
                      {getRoleBadge(selectedUser.role || 'user')}
                      {getStatusBadge(selectedUser.approvalStatus || 'pending')}
                      {getSubscriptionBadge(selectedUser.subscription)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                  <TabsTrigger value="details" className="data-[state=active]:bg-background">
                    <User className="h-4 w-4 mr-2" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="subscription" className="data-[state=active]:bg-background">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Subscription
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="data-[state=active]:bg-background">
                    <Activity className="h-4 w-4 mr-2" />
                    Activity
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          Company Information
            </CardTitle>
          </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                          <p className="text-sm font-medium">{selectedUser.companyName || 'No Company'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                          <p className="text-sm font-medium">{selectedUser.metadata?.department || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                          <p className="text-sm font-medium">{selectedUser.metadata?.location || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Phone className="h-5 w-5" />
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                          <p className="text-sm font-medium">{selectedUser.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                          <p className="text-sm font-medium">{selectedUser.metadata?.phone || 'Not provided'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="subscription" className="space-y-6 mt-6">
                  {selectedUser.subscription ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Subscription Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Plan</Label>
                            <p className="text-lg font-semibold capitalize">{selectedUser.subscription.plan}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                selectedUser.subscription.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                              }`}></div>
                              <p className="text-lg font-semibold capitalize">{selectedUser.subscription.status}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Expires</Label>
                            <p className="text-lg font-semibold">
                              {selectedUser.subscription.expiresAt ? 
                                new Date(selectedUser.subscription.expiresAt).toLocaleDateString() : 
                                'No expiration'
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No subscription information available</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <UserPlus className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Account Created</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedUser.createdAt ? 
                                new Date(selectedUser.createdAt).toLocaleString() : 
                                'Unknown'
                              }
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <LogIn className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Last Login</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedUser.lastLoginAt ? 
                                new Date(selectedUser.lastLoginAt).toLocaleString() : 
                                'Never'
                              }
                            </p>
                          </div>
                        </div>
            </div>
          </CardContent>
        </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" defaultValue={selectedUser.email} />
              </div>
              <div>
                <Label htmlFor="edit-displayName">Display Name</Label>
                <Input id="edit-displayName" defaultValue={selectedUser.displayName || ''} />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-isActive" defaultChecked={selectedUser.isActive} />
                <Label htmlFor="edit-isActive">Active Account</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsEditDialogOpen(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Import Users Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Users</DialogTitle>
            <DialogDescription>
              Import users from a CSV file. The file should have columns: Email, Display Name, Role, Company
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">CSV File</Label>
              <Input 
                id="csv-file" 
                type="file" 
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      const csv = event.target?.result as string
                      handleImportUsers(csv)
                    }
                    reader.readAsText(file)
                  }
                }}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>CSV should have headers: Email, Display Name, Role, Company</p>
              <p>Role should be either "user" or "admin"</p>
            </div>
      </div>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Delete User</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {userToDelete && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={userToDelete.photoURL} />
                    <AvatarFallback className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                      {userToDelete.displayName?.charAt(0) || userToDelete.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200">{userToDelete.displayName || 'No Name'}</h4>
                    <p className="text-sm text-red-600 dark:text-red-300">{userToDelete.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRoleBadge(userToDelete.role || 'user')}
                      {getStatusBadge(userToDelete.approvalStatus || 'pending')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">This will permanently delete:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>User account and profile</li>
                  <li>All user data and preferences</li>
                  <li>User's access to the platform</li>
                  <li>Associated company membership</li>
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
                setUserToDelete(null)
              }}
              disabled={deletingUser}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeleteUser}
              disabled={deletingUser}
            >
              {deletingUser ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 