"use client"

import { useState, useEffect } from "react"
import { Bot, LayoutDashboard, MessageSquare, Store, CreditCard, Users, Settings, LogOut, Crown, Shield, Navigation, Bell, Wrench, BarChart3, Building2, UserCheck, Cog, Activity, Globe, Brain, Plus, FileText, Folder, FolderOpen, HelpCircle, Rocket } from "lucide-react"
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

// Platform-specific menu items
const platformMenuItems = {
  chathub: [
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
      title: "Marketplace",
      url: "/dashboard/marketplace",
      icon: Store,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: Users,
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
    {
      title: "Help",
      url: "/dashboard/help",
      icon: HelpCircle,
    },
  ],
  webvault: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "WebVault Services",
      url: "/dashboard/web-building",
      icon: Rocket,
    },
    {
      title: "Request New Web App",
      url: "/dashboard/web-building/request",
      icon: Plus,
    },
    {
      title: "Manage Websites",
      url: "/dashboard/web-building/manage",
      icon: Folder,
    },
    {
      title: "Website Analytics",
      url: "/dashboard/web-building/analytics",
      icon: BarChart3,
    },
    {
      title: "Services",
      url: "/dashboard/web-building/services",
      icon: Wrench,
    },
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      title: "WebVault Settings",
      url: "/dashboard/web-building/settings",
      icon: Settings,
    },
    {
      title: "Help",
      url: "/dashboard/help",
      icon: HelpCircle,
    },
  ],
  'personal-ai': [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Personal AI",
      url: "/dashboard/personal-ai",
      icon: Brain,
    },
    {
      title: "My Assistants",
      url: "/dashboard/personal-ai",
      icon: Bot,
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
      title: "Billing",
      url: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      title: "Settings",
      url: "/dashboard/personal-ai/settings",
      icon: Settings,
    },
    {
      title: "Help",
      url: "/dashboard/help",
      icon: HelpCircle,
    },
  ]
}

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
  {
    title: "Help",
    url: "/dashboard/help",
    icon: HelpCircle,
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
  {
    title: "Help",
    url: "/dashboard/help",
    icon: HelpCircle,
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
        title: "Website Requests",
        url: "/dashboard/admin/website-requests",
        icon: Globe,
      },
      {
        title: "Service Requests",
        url: "/dashboard/admin/service-requests",
        icon: Wrench,
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
  {
    label: "Support",
    items: [
      {
        title: "Help",
        url: "/dashboard/help",
        icon: HelpCircle,
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
  
  // Platform switching state with localStorage persistence
  const [activePlatform, setActivePlatform] = useState<string>('chathub')

  // Determine available platforms for the user (only show active/approved platforms)
  const userPlatforms = profile?.platforms || {}
  const availablePlatforms = Object.keys(userPlatforms).filter(platform => {
    const platformData = userPlatforms[platform]
    return platformData?.access && platformData?.subscription?.status === 'active'
  })
  
  // Set initial active platform based on available platforms and localStorage
  useEffect(() => {
    if (availablePlatforms.length > 0) {
      // Try to get the last active platform from localStorage
      const lastActivePlatform = typeof window !== 'undefined' ? localStorage.getItem('activePlatform') : null
      
      // If we have a stored platform and it's still available, use it
      if (lastActivePlatform && availablePlatforms.includes(lastActivePlatform)) {
        setActivePlatform(lastActivePlatform)
        console.log(`Restored active platform from localStorage: ${lastActivePlatform}`)
      } else if (!availablePlatforms.includes(activePlatform)) {
        // If current active platform is not available, switch to first available
        const firstAvailable = availablePlatforms[0]
        setActivePlatform(firstAvailable)
        console.log(`Switched to first available platform: ${firstAvailable}`)
      }
    }
  }, [availablePlatforms, activePlatform])

  // Clear localStorage when user changes (different account)
  useEffect(() => {
    if (profile?.email) {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('lastUserEmail') : null
      if (storedUser && storedUser !== profile.email) {
        // Different user, clear platform preference
        if (typeof window !== 'undefined') {
          localStorage.removeItem('activePlatform')
          localStorage.setItem('lastUserEmail', profile.email)
          console.log('User changed, cleared platform preference')
        }
      } else if (!storedUser) {
        // First time, store current user
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastUserEmail', profile.email)
        }
      }
    }
  }, [profile?.email])

  // Persist active platform changes to localStorage
  const handlePlatformChange = (platform: string) => {
    setActivePlatform(platform)
    if (typeof window !== 'undefined') {
      localStorage.setItem('activePlatform', platform)
      console.log(`Platform changed and persisted: ${platform}`)
    }
  }

  // Determine menu items based on account type and platform access
  const getMenuItems = () => {
    if (profile?.accountType === 'personal') {
      return personalMenuItems
    }
    
    // For business accounts with multiple platforms, show platform-specific navigation
    const platformCount = availablePlatforms.length
    
    // Debug: Log platform access for troubleshooting
    console.log("Sidebar Debug:", {
      email: profile?.email,
      accountType: profile?.accountType,
      isAdmin: profile?.isAdmin,
      availablePlatforms,
      platformCount,
      activePlatform,
      userPlatforms: profile?.platforms || {}
    })
    
    // If user has multiple platforms, show platform-specific navigation based on active platform
    if (platformCount > 1) {
      console.log(`Multi-platform user, showing ${activePlatform} specific navigation`)
      return platformMenuItems[activePlatform as keyof typeof platformMenuItems] || businessMenuItems
    }
    
    // Single platform users get specific navigation
    if (availablePlatforms.includes('webvault')) {
      console.log("Showing WebVault specific navigation")
      return platformMenuItems.webvault
    }
    
    if (availablePlatforms.includes('chathub')) {
      console.log("Showing ChatHub specific navigation")
      return platformMenuItems.chathub
    }
    
    if (availablePlatforms.includes('personal-ai')) {
      console.log("Showing Personal AI specific navigation")
      return platformMenuItems['personal-ai']
    }
    
    // Default business menu items (fallback)
    console.log("Using default business menu items")
    return businessMenuItems
  }

  const menuItems = getMenuItems()

  const handleSignOut = async () => {
    try {
      // Clear platform preference from localStorage on sign out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('activePlatform')
        localStorage.removeItem('lastUserEmail')
        console.log('Cleared platform preferences from localStorage on sign out')
      }
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
  const getMultiPlatformCompanyName = () => {
    if (availablePlatforms.length > 1) {
      // Create special names for different platform combinations
      const sortedPlatforms = availablePlatforms.sort()
      
      if (sortedPlatforms.length === 2) {
        if (sortedPlatforms.includes('chathub') && sortedPlatforms.includes('personal-ai')) {
          return 'AI Chat Solutions'
        }
        if (sortedPlatforms.includes('chathub') && sortedPlatforms.includes('webvault')) {
          return 'Digital Solutions Hub'
        }
        if (sortedPlatforms.includes('personal-ai') && sortedPlatforms.includes('webvault')) {
          return 'AI Web Solutions'
        }
      }
      
      if (sortedPlatforms.length === 3) {
        if (sortedPlatforms.includes('chathub') && sortedPlatforms.includes('personal-ai') && sortedPlatforms.includes('webvault')) {
          return 'Complete Digital Suite'
        }
      }
      
      // Fallback: compose a label from all available platforms
      const platformLabels = availablePlatforms.map(p => {
        if (p === 'webvault') return 'WebVault'
        if (p === 'chathub') return 'ChatHub'
        if (p === 'personal-ai') return 'Personal AI'
        return p.charAt(0).toUpperCase() + p.slice(1)
      })
      return platformLabels.join(' + ') + ' Company'
    }
    // Fallback to companyName or default
    return profile?.companyName || 'Your Company'
  }

  const displayCompanyName = profile?.accountType === 'personal' 
    ? "Personal AI Account" 
    : availablePlatforms.length > 1
      ? getMultiPlatformCompanyName()
      : availablePlatforms.includes('webvault')
        ? "WebVault Company"
        : availablePlatforms.includes('chathub')
          ? "ChatHub Company"
          : availablePlatforms.includes('personal-ai')
            ? "Personal AI Company"
            : (impersonatedCompany?.companyName || profile?.companyName || "Your Company")

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
          <span className="font-bold text-lg">
            {profile?.accountType === 'personal'
              ? 'Personal AI'
              : availablePlatforms.length > 1
                ? getMultiPlatformCompanyName()
                : availablePlatforms.includes('webvault')
                  ? 'WebVault'
                  : availablePlatforms.includes('chathub')
                    ? 'ChatHub'
                    : availablePlatforms.includes('personal-ai')
                      ? 'Personal AI'
                      : 'ChatHub'}
          </span>
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
        {/* Platform Switcher for Multi-Platform Users */}
        {!isAdmin && availablePlatforms.length > 1 && (
          <SidebarGroup>
            <SidebarGroupLabel>Platforms</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex flex-col space-y-1">
                {availablePlatforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformChange(platform)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      activePlatform === platform
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {platform === 'chathub' && <Bot className="h-4 w-4" />}
                    {platform === 'webvault' && <Globe className="h-4 w-4" />}
                    {platform === 'personal-ai' && <Brain className="h-4 w-4" />}
                    <span className="capitalize">{platform.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

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
            <SidebarGroupLabel>
              {availablePlatforms.length > 1 
                ? `${activePlatform === 'webvault' ? 'WebVault' : activePlatform === 'chathub' ? 'ChatHub' : activePlatform === 'personal-ai' ? 'Personal AI' : activePlatform.replace('-', ' ').toUpperCase()} Navigation`
                : availablePlatforms.includes('webvault')
                  ? 'WebVault Navigation'
                  : availablePlatforms.includes('chathub')
                    ? 'ChatHub Navigation'
                    : availablePlatforms.includes('personal-ai')
                      ? 'Personal AI Navigation'
                      : 'Navigation'
              }
            </SidebarGroupLabel>
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
            <p className="text-sm font-medium">
              {profile?.accountType === 'personal' 
                ? "Personal AI Account" 
                : availablePlatforms.length > 1
                  ? getMultiPlatformCompanyName()
                  : availablePlatforms.includes('webvault')
                    ? "WebVault Company"
                    : availablePlatforms.includes('chathub')
                      ? "ChatHub Company"
                      : availablePlatforms.includes('personal-ai')
                        ? "Personal AI Company"
                        : (profile?.companyName || "Your Company")
              }
            </p>
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
