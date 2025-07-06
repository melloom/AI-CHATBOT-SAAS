import { useState, useEffect, useCallback } from 'react'
import { useToast } from './use-toast'
import { getAuth } from 'firebase/auth'

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

interface UserFilters {
  status?: string
  role?: string
  search?: string
  limit?: number
}

interface BulkOperationResult {
  userId: string
  success: boolean
  action?: string
  error?: string
}

interface BulkOperationSummary {
  total: number
  successful: number
  failed: number
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Helper to get the current user's ID token
  const getIdToken = async () => {
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      return await user.getIdToken()
    }
    return null
  }

  // Fetch all users
  const fetchUsers = useCallback(async (filters: UserFilters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        listAll: 'true',
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.role && filters.role !== 'all' && { role: filters.role }),
        ...(filters.limit && { limit: filters.limit.toString() })
      })
      const token = await getIdToken()
      const response = await fetch(`/api/users?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', response.status, errorData)
        throw new Error(errorData.error || `Failed to fetch users (${response.status})`)
      }
      const data = await response.json()
      const usersWithCompany = data.users?.map((user: any) => ({
        ...user,
        companyId: user.companyId || null,
        companyName: user.companyName || 'No Company',
        role: user.role || 'user',
        isActive: user.isActive !== false, // Default to true if not specified
        approvalStatus: user.approvalStatus || 'pending',
        subscription: user.subscription || null,
        metadata: user.metadata || {}
      })) || []
      setUsers(usersWithCompany)
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Fetch single user
  const fetchUser = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = await getIdToken()
      const response = await fetch(`/api/users?userId=${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch user')
      }
      const user = await response.json()
      return user
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Create user
  const createUser = useCallback(async (userData: Partial<User>) => {
    setLoading(true)
    setError(null)
    try {
      const token = await getIdToken()
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          userId: userData.id,
          data: userData
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create user')
      }
      const result = await response.json()
      toast({
        title: "Success",
        description: "User created successfully",
      })
      // Refresh users list
      await fetchUsers()
      return result
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchUsers, toast])

  // Update user
  const updateUser = useCallback(async (userId: string, userData: Partial<User>) => {
    setLoading(true)
    setError(null)
    try {
      const token = await getIdToken()
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          userId,
          data: userData
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user')
      }
      const result = await response.json()
      toast({
        title: "Success",
        description: "User updated successfully",
      })
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...userData } : user
      ))
      return result
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Delete user
  const deleteUser = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = await getIdToken()
      const response = await fetch(`/api/users?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }
      const result = await response.json()
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      setUsers(prev => prev.filter(user => user.id !== userId))
      return result
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Bulk operations
  const bulkOperation = useCallback(async (
    action: 'activate' | 'deactivate' | 'approve' | 'reject' | 'update',
    userIds: string[],
    data?: any
  ): Promise<{ results: BulkOperationResult[], summary: BulkOperationSummary } | null> => {
    setLoading(true)
    setError(null)
    try {
      const token = await getIdToken()
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          action,
          userIds,
          data
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to perform bulk operation')
      }
      const result = await response.json()
      toast({
        title: "Success",
        description: `Bulk operation completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
      })
      await fetchUsers()
      return result
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchUsers, toast])

  // Filter users locally
  const getFilteredUsers = useCallback((filters: UserFilters) => {
    let filtered = users

    // Search filter - search across multiple fields
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim()
      filtered = filtered.filter(user => {
        const searchableFields = [
          user.email,
          user.displayName,
          user.companyName,
          user.metadata?.department,
          user.metadata?.location,
          user.role,
          user.approvalStatus
        ].filter(Boolean).map(field => field?.toLowerCase())
        
        return searchableFields.some(field => field?.includes(searchTerm))
      })
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(user => user.approvalStatus === filters.status)
    }

    // Role filter
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role)
    }

    console.log('Filtering users:', {
      totalUsers: users.length,
      searchTerm: filters.search,
      statusFilter: filters.status,
      roleFilter: filters.role,
      filteredCount: filtered.length
    })

    return filtered
  }, [users])

  // Get user statistics
  const getUserStats = useCallback(() => {
    const total = users.length
    const active = users.filter(u => u.isActive).length
    const admins = users.filter(u => u.isAdmin).length
    const approved = users.filter(u => u.approvalStatus === 'approved').length
    const pending = users.filter(u => u.approvalStatus === 'pending').length
    const rejected = users.filter(u => u.approvalStatus === 'rejected').length

    return {
      total,
      active,
      admins,
      approved,
      pending,
      rejected
    }
  }, [users])

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    bulkOperation,
    getFilteredUsers,
    getUserStats
  }
} 