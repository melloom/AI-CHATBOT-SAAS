"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useImpersonation } from "@/components/providers/impersonation-provider"
import { NotificationBell } from "@/components/ui/notification-bell"
import { ReadOnlyIndicator } from "@/components/ui/read-only-indicator"

export function AppHeader() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const { 
    impersonatedCompany, 
    impersonationMode,
    isImpersonating,
    canEdit
  } = useImpersonation()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  // Determine which company name to display
  const displayCompanyName = profile?.accountType === 'personal' 
    ? "Personal AI Account" 
    : (impersonatedCompany?.companyName || profile?.companyName || user?.displayName)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4 glass-dark min-w-0">
      <SidebarTrigger className="-ml-1 flex-shrink-0" />

      <div className="flex-1 min-w-0" />

      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        <ThemeToggle />
        
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full glass-dark flex-shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
                <AvatarFallback className="text-xs">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 glass-card" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">{displayCompanyName}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                {isImpersonating && (
                  <div className="flex flex-col space-y-1 mt-1">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex ${
                      impersonationMode === 'edit' 
                        ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30' 
                        : 'bg-blue-500/20 text-blue-600 border border-blue-500/30'
                    }`}>
                      {impersonationMode === 'edit' ? 'Edit Mode' : 'View Mode'}
                    </div>
                    <span className="text-xs leading-none text-yellow-600 truncate">
                      Impersonating: {impersonatedCompany.companyName}
                    </span>
                  </div>
                )}
                {!canEdit && (
                  <div className="flex items-center space-x-2 mt-1">
                    <ReadOnlyIndicator isReadOnly={true} />
                  </div>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
