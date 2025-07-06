"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Crown, User, Shield, CheckCircle, XCircle } from "lucide-react"

export default function CheckAdminPage() {
  const { user, loading, profile } = useAuth()
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    if (!loading && user && profile) {
      setDebugInfo({
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        profile: profile,
        isAdmin: profile.isAdmin || false,
        approvalStatus: profile.approvalStatus || 'pending',
        companyName: profile.companyName,
        companyId: profile.companyId
      })
    }
  }, [user, loading, profile])

  const makeAdmin = async () => {
    if (!user) return
    
    try {
      const { updateDoc, doc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      
      await updateDoc(doc(db, "users", user.uid), {
        isAdmin: true,
        approvalStatus: 'approved',
        updatedAt: new Date().toISOString()
      })
      
      // Reload the page to see changes
      window.location.reload()
    } catch (error) {
      console.error("Error making user admin:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Not Authenticated</h3>
        <p className="text-muted-foreground">Please sign in to access this page.</p>
        <Button onClick={() => router.push("/login")} className="mt-4">
          Sign In
        </Button>
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
                <h1 className="text-3xl md:text-4xl font-bold">Admin Status Check</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Check your admin status and debug authentication issues
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Status</CardTitle>
            {debugInfo?.isAdmin ? (
              <Crown className="h-4 w-4 text-green-600" />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {debugInfo?.isAdmin ? "Admin" : "User"}
            </div>
            <Badge variant={debugInfo?.isAdmin ? "default" : "secondary"}>
              {debugInfo?.isAdmin ? "Administrator" : "Regular User"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Status</CardTitle>
            {debugInfo?.approvalStatus === 'approved' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-yellow-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {debugInfo?.approvalStatus || 'pending'}
            </div>
            <Badge variant={debugInfo?.approvalStatus === 'approved' ? "default" : "secondary"}>
              {debugInfo?.approvalStatus === 'approved' ? "Approved" : "Pending Approval"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Verification</CardTitle>
            {debugInfo?.emailVerified ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-yellow-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {debugInfo?.emailVerified ? "Verified" : "Not Verified"}
            </div>
            <p className="text-xs text-muted-foreground">
              {debugInfo?.email}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>
            Make yourself an admin if you need admin access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!debugInfo?.isAdmin && (
            <Button onClick={makeAdmin} className="bg-purple-600 hover:bg-purple-700">
              <Crown className="w-4 h-4 mr-2" />
              Make Me Admin
            </Button>
          )}
          
          <Button 
            onClick={() => router.push("/dashboard")} 
            variant="outline"
          >
            Go to Dashboard
          </Button>
          
          <Button 
            onClick={() => router.push("/dashboard/admin")} 
            variant="outline"
          >
            Go to Admin Dashboard
          </Button>
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>
            Detailed information about your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
} 