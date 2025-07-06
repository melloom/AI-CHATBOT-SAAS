"use client"

import { Bot, LayoutDashboard, MessageSquare, Store, CreditCard, Users, Settings, LogOut, Crown, Shield, Navigation, Bell, Wrench, BarChart3, Building2, UserCheck, Cog, Activity, Globe, Brain, Plus, FileText } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { signOut } from "@/lib/auth-client"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useImpersonation } from "@/components/providers/impersonation-provider"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ReadOnlyIndicator } from "@/components/ui/read-only-indicator"

// Business account menu items
const businessMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "ChatHub",
    url: "/dashboard/chatbots",
    icon: Bot,
  },
  {
    title: "Personal AI",
    url: "/dashboard/personal-ai",
    icon: Brain,
  },
  {
    title: "Marketplace",
    url: "/dashboard/marketplace",
    icon: Store,
  },
  {
    title: "WebVault",
    url: "/dashboard/web-building",
    icon: Globe,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Billing",
    url: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Team",
    url: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

// Personal AI account menu items
const personalMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard/personal-ai",
    icon: LayoutDashboard,
  },
  {
    title: "My AI Assistants",
    url: "/dashboard/personal-ai",
    icon: Brain,
  },
  {
    title: "Create Assistant",
    url: "/dashboard/personal-ai/create",
    icon: Plus,
  },
  {
    title: "Templates",
    url: "/dashboard/personal-ai/templates",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/dashboard/personal-ai/settings",
    icon: Settings,
  },
  {
    title: "Billing",
    url: "/dashboard/billing",
    icon: CreditCard,
  },
]

// Reorganized admin menu items into logical groups
const adminMenuGroups = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Admin Dashboard",
        url: "/dashboard/admin",
        icon: Shield,
      },
    ]
  },
  {
    label: "Company Management",
    items: [
      {
        title: "Company Approval",
        url: "/dashboard/admin/approvals",
        icon: UserCheck,
      },
      {
        title: "Company Management",
        url: "/dashboard/admin/companies",
        icon: Building2,
      },
      {
        title: "Navigation Settings",
        url: "/dashboard/admin/companies/navigation-settings",
        icon: Navigation,
      },
    ]
  },
  {
    label: "Platform Management",
    items: [
      {
        title: "ChatHub Management",
        url: "/dashboard/admin/chatbots",
        icon: Bot,
      },
      {
        title: "User Management",
        url: "/dashboard/admin/users",
        icon: Users,
      },
      {
        title: "Subscription Management",
        url: "/dashboard/admin/subscriptions",
        icon: CreditCard,
      },
    ]
  },
  {
    label: "Analytics & Monitoring",
    items: [
      {
        title: "Analytics & Monitoring",
        url: "/dashboard/admin/analytics-monitoring",
        icon: BarChart3,
      },
      {
        title: "Platform Analytics",
        url: "/dashboard/admin/platform-analytics",
        icon: BarChart3,
      },
      {
        title: "Admin Notifications",
        url: "/dashboard/admin/admin-notifications",
        icon: Bell,
      },
    ]
  },
  {
    label: "System Administration",
    items: [
      {
        title: "System Settings",
        url: "/dashboard/admin/settings",
        icon: Settings,
      },
      {
        title: "System Maintenance",
        url: "/dashboard/admin/system-maintenance",
        icon: Wrench,
      },
    ]
  },
]

// Add web building to admin menu items when impersonating
const adminMenuItemsWithWebBuilding = [
  ...adminMenuGroups.flatMap(group => group.items),
  {
    title: "WebVault",
    url: "/dashboard/web-building",
    icon: Globe,
  }
]

// Legacy adminMenuItems for backward compatibility
const adminMenuItems = adminMenuGroups.flatMap(group => group.items)

export function AppSidebar() {
  const { profile } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { 
    impersonatedCompany, 
    setImpersonatedCompany, 
    impersonationMode,
    isImpersonating,
    canEdit
  } = useImpersonation()

  // Determine menu items based on account type and platform access
  const getMenuItems = () => {
    if (profile?.accountType === 'personal') {
      return personalMenuItems
    }
    
    // For business accounts, show menu items based on platform access
    const userPlatforms = profile?.platforms || {}
    const hasWebVault = userPlatforms.webvault?.access
    const hasChatHub = userPlatforms.chathub?.access
    const hasPersonalAI = userPlatforms['personal-ai']?.access
    
    // If user has specific platform access, show relevant items
    if (hasWebVault && !hasChatHub && !hasPersonalAI) {
      return [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "WebVault",
          url: "/dashboard/web-building",
          icon: Globe,
        },
        {
          title: "Billing",
          url: "/dashboard/billing",
          icon: CreditCard,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
        },
      ]
    }
    
    // Default business menu items
    return businessMenuItems
  }

  const menuItems = getMenuItems()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (impersonatedCompany) {
      e.preventDefault()
      setImpersonatedCompany(null)
      router.push("/dashboard")
    }
  }

  // Determine if admin is impersonating a company
  const isAdmin = profile?.isAdmin
  const isImpersonatingCompany = isAdmin && impersonatedCompany

  // Determine which company name to display
  const displayCompanyName = impersonatedCompany?.companyName || profile?.companyName || "Your Company"

  return (
    <Sidebar className="glass-dark">
      <SidebarHeader className="border-b px-6 py-4 glass-card">
        <div className="flex items-center space-x-2">
          <Image 
            src="/LOGO.png" 
            alt="ChatHub Logo" 
            width={24} 
            height={24} 
            className="h-6 w-6"
            priority
          />
          <span className="font-bold text-lg">ChatHub</span>
        </div>
        <p className="text-sm text-muted-foreground">{displayCompanyName}</p>
        {isImpersonating && (
          <div className="flex items-center space-x-2 mt-1">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              impersonationMode === 'edit' 
                ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30' 
                : 'bg-blue-500/20 text-blue-600 border border-blue-500/30'
            }`}>
              {impersonationMode === 'edit' ? 'Edit Mode' : 'View Mode'}
            </div>
            <span className="text-xs text-yellow-600">
              Impersonating: {impersonatedCompany.companyName}
            </span>
          </div>
        )}
        {!canEdit && (
          <div className="flex items-center space-x-2 mt-1">
            <ReadOnlyIndicator isReadOnly={true} />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {isAdmin && (
          <>
            {adminMenuGroups.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname === item.url} 
                          className="glass-dark hover:glass-card"
                          onClick={item.title === "Dashboard" ? handleDashboardClick : undefined}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </>
        )}
        {isAdmin && isImpersonatingCompany && (
          <SidebarGroup>
            <SidebarGroupLabel>Company Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} className="glass-dark hover:glass-card">
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {!isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} className="glass-dark hover:glass-card">
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <p className="text-sm font-medium">{profile?.companyName || "Your Company"}</p>
            <p className="text-xs text-muted-foreground">{profile?.email || "user@company.com"}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="glass-dark">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
