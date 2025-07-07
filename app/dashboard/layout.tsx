"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import dynamic from "next/dynamic"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SystemAnnouncement } from "@/components/ui/system-announcement"

// Dynamic imports for better performance
const AppSidebar = dynamic(() => import("@/components/layout/app-sidebar").then(mod => ({ default: mod.AppSidebar })), {
  ssr: false,
  loading: () => <div className="w-64 bg-card animate-pulse" />
})

const AppHeader = dynamic(() => import("@/components/layout/app-header").then(mod => ({ default: mod.AppHeader })), {
  ssr: false,
  loading: () => <div className="h-16 bg-card animate-pulse" />
})

const ImpersonationProvider = dynamic(() => import("@/components/providers/impersonation-provider").then(mod => ({ default: mod.ImpersonationProvider })), {
  ssr: false,
  loading: () => null
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, profile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found, redirecting to login")
      router.push("/login")
    }
    
    // Check if user is approved
    if (!loading && user && profile) {
      const approvalStatus = profile.approvalStatus || 'pending'
      const isAdmin = profile.isAdmin || false
      
      console.log("Dashboard layout check:", {
        userId: user.uid,
        email: user.email,
        approvalStatus,
        isAdmin,
        profile: profile
      })
      
      // Check if user has WebVault access (WebVault accounts should be auto-approved)
      const hasWebVaultAccess = profile.platforms?.webvault?.access
      const hasAnyApprovedPlatform = Object.keys(profile.platforms || {}).some(platform => {
        const platformData = profile.platforms[platform]
        return platformData?.access && platformData?.subscription?.status === 'active'
      })
      
      // Users with WebVault access or any approved platform should not see approval screen
      // Only redirect if not approved and not admin and doesn't have any approved platform access
      if (approvalStatus !== 'approved' && !isAdmin && !hasAnyApprovedPlatform) {
        console.log("User not approved and not admin and no approved platform access, redirecting to pending-approval")
        router.push("/pending-approval")
      } else {
        console.log("User approved or admin or has approved platform access, allowing dashboard access")
      }
    }
  }, [user, loading, profile, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark-bg-cosmic">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary glow-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Check if user has any approved platform access
  const hasAnyApprovedPlatform = Object.keys(profile?.platforms || {}).some(platform => {
    const platformData = profile?.platforms[platform]
    return platformData?.access && platformData?.subscription?.status === 'active'
  })
  
  // Don't render dashboard if user is not approved and not admin and doesn't have any approved platform access
  if (profile && profile.approvalStatus !== 'approved' && !profile.isAdmin && !hasAnyApprovedPlatform) {
    return null
  }

  return (
    <ImpersonationProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="ml-0">
          <AppHeader />
          <main className="flex-1 p-6 dark-bg-cosmic overflow-x-auto min-w-0 w-full">
            <SystemAnnouncement />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ImpersonationProvider>
  )
}
