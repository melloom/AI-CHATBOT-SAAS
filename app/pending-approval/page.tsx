"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Building2, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { signOut } from "@/lib/auth-client"
import Image from "next/image"
import Link from "next/link"

export default function PendingApprovalPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Listen for changes in user's approval status
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const userData = doc.data()
        const status = userData.approvalStatus || 'pending'
        const isAdmin = userData.isAdmin || false
        
        // Auto-approve admin users
        if (isAdmin && status === 'pending') {
          const updateUserApproval = async () => {
            const { updateDoc, doc } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase')
            await updateDoc(doc(db, "users", user.uid), {
              approvalStatus: 'approved',
              updatedAt: new Date().toISOString()
            })
          }
          updateUserApproval()
          setApprovalStatus('approved')
          router.push("/dashboard")
          return
        }
        
        setApprovalStatus(status)
        
        // If approved, show success message briefly then redirect
        if (status === 'approved') {
          setShowApprovalSuccess(true)
          // Show success message for 3 seconds then redirect
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking approval status...</p>
        </div>
      </div>
    )
  }

  // Show approval success message
  if (showApprovalSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center space-x-2">
              <Image 
                src="/LOGO.png" 
                alt="ChatHub Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8"
              />
              <span className="font-bold text-2xl dark:text-white">ChatHub</span>
            </Link>
          </div>
          
          <Card className="glass-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-green-600">
                Account Approved!
              </CardTitle>
              <CardDescription>
                Congratulations! Your account has been approved and you can now access all features.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Redirecting you to your dashboard in a few seconds...
              </p>
              <Button 
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Go to Dashboard Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <Image 
              src="/LOGO.png" 
              alt="ChatHub Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8"
            />
            <span className="font-bold text-2xl dark:text-white">ChatHub</span>
          </Link>
        </div>
        
        <Card className="glass-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {approvalStatus === 'pending' && (
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              )}
              {approvalStatus === 'approved' && (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              )}
              {approvalStatus === 'rejected' && (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {approvalStatus === 'pending' && 'Account Pending Approval'}
              {approvalStatus === 'approved' && 'Account Approved!'}
              {approvalStatus === 'rejected' && 'Account Rejected'}
            </CardTitle>
            <CardDescription>
              {approvalStatus === 'pending' && 'Your account is currently under review'}
              {approvalStatus === 'approved' && 'Your account has been approved'}
              {approvalStatus === 'rejected' && 'Your account has been rejected'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {approvalStatus === 'pending' && (
              <>
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{profile?.companyName || 'Your Company'}</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    Pending Approval
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Thank you for registering with ChatHub! Your account is currently under review by our admin team. 
                    This process typically takes 24-48 hours. You'll receive an email notification once your account is approved.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">What happens next?</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Admin reviews your company information</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>You'll receive an email notification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Access your dashboard once approved</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={handleRefresh}
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check Status
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="flex-1"
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            )}

            {approvalStatus === 'rejected' && (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Unfortunately, your account has been rejected. If you believe this was an error, 
                  please contact our support team.
                </p>
                <Button 
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 