"use client"

import { useState, useEffect, useCallback } from "react"

interface NavigationTab {
  id: string
  name: string
  icon: string
  path: string
  description: string
  status: 'active' | 'hidden' | 'disabled'
  order: number
  accessLevel: 'all' | 'admin' | 'premium'
  customIcon?: string
  badge?: string
  badgeColor?: string
}

interface CompanyNavigationSettings {
  companyId: string
  companyName: string
  theme: 'light' | 'dark' | 'auto'
  sidebarCollapsed: boolean
  showIcons: boolean
  showLabels: boolean
  customTabs: NavigationTab[]
  defaultTabs: NavigationTab[]
  maintenanceMode: boolean
  maintenanceMessage: string
  allowedPaths: string[]
  blockedPaths: string[]
  customRoutes: {
    id: string
    path: string
    name: string
    description: string
    status: 'active' | 'maintenance' | 'disabled'
    accessLevel: 'public' | 'private' | 'admin'
  }[]
  securitySettings: {
    ipWhitelist: boolean
    twoFactorRequired: boolean
    sessionTimeout: boolean
    sessionTimeoutMinutes: number
  }
  performanceSettings: {
    lazyLoading: boolean
    preloadCritical: boolean
    cacheNavigation: boolean
  }
  appearanceSettings: {
    primaryColor: string
    secondaryColor: string
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    fontSize: 'sm' | 'base' | 'lg' | 'xl'
    spacing: 'compact' | 'comfortable' | 'spacious'
  }
  analytics: {
    navigationClicks: number
    successRate: number
    averageLoadTime: number
    mostUsedTabs: string[]
  }
}

interface UseCompanyNavigationReturn {
  settings: CompanyNavigationSettings | null
  loading: boolean
  error: string | null
  updateSettings: (newSettings: Partial<CompanyNavigationSettings>) => Promise<void>
  addCustomTab: (tab: Omit<NavigationTab, 'id'>) => Promise<void>
  removeCustomTab: (tabId: string) => Promise<void>
  updateTabOrder: (tabId: string, newOrder: number) => Promise<void>
  toggleTabStatus: (tabId: string) => Promise<void>
  updateTabAccess: (tabId: string, accessLevel: NavigationTab['accessLevel']) => Promise<void>
  toggleMaintenanceMode: () => Promise<void>
  updateMaintenanceMessage: (message: string) => Promise<void>
  addAllowedPath: (path: string) => Promise<void>
  removeAllowedPath: (path: string) => Promise<void>
  addBlockedPath: (path: string) => Promise<void>
  removeBlockedPath: (path: string) => Promise<void>
  updateSecuritySettings: (settings: CompanyNavigationSettings['securitySettings']) => Promise<void>
  updatePerformanceSettings: (settings: CompanyNavigationSettings['performanceSettings']) => Promise<void>
  updateAppearanceSettings: (settings: CompanyNavigationSettings['appearanceSettings']) => Promise<void>
  refreshSettings: () => Promise<void>
  resetToDefaults: () => Promise<void>
}

export function useCompanyNavigation(): UseCompanyNavigationReturn {
  const [settings, setSettings] = useState<CompanyNavigationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load real company navigation settings from Firebase
      // TODO: Implement real company navigation settings with Firebase
      const defaultSettings: CompanyNavigationSettings = {
        companyId: "",
        companyName: "",
        theme: "auto",
        sidebarCollapsed: false,
        showIcons: true,
        showLabels: true,
        defaultTabs: [
          {
            id: "dashboard",
            name: "Dashboard",
            icon: "LayoutDashboard",
            path: "/dashboard",
            description: "Main dashboard overview",
            status: "active" as const,
            order: 1,
            accessLevel: "all"
          },
          {
            id: "chatbots",
            name: "Chatbots",
            icon: "Bot",
            path: "/dashboard/chatbots",
            description: "Manage your chatbots",
            status: "active" as const,
            order: 2,
            accessLevel: "all"
          },
          {
            id: "marketplace",
            name: "Marketplace",
            icon: "Store",
            path: "/dashboard/marketplace",
            description: "Browse chatbot templates",
            status: "active" as const,
            order: 3,
            accessLevel: "all"
          },
          {
            id: "billing",
            name: "Billing",
            icon: "CreditCard",
            path: "/dashboard/billing",
            description: "Manage subscriptions and billing",
            status: "active" as const,
            order: 4,
            accessLevel: "all"
          },
          {
            id: "team",
            name: "Team",
            icon: "Users",
            path: "/dashboard/team",
            description: "Manage team members",
            status: "active" as const,
            order: 5,
            accessLevel: "admin"
          },
          {
            id: "settings",
            name: "Settings",
            icon: "Settings",
            path: "/dashboard/settings",
            description: "Configure your account",
            status: "active" as const,
            order: 6,
            accessLevel: "admin"
          }
        ],
        customTabs: [],
        maintenanceMode: false,
        maintenanceMessage: "We're performing scheduled maintenance. Please check back soon.",
        allowedPaths: ["/dashboard", "/chatbots", "/billing", "/team", "/settings"],
        blockedPaths: ["/admin", "/debug", "/internal"],
        customRoutes: [],
        securitySettings: {
          ipWhitelist: false,
          twoFactorRequired: true,
          sessionTimeout: true,
          sessionTimeoutMinutes: 30
        },
        performanceSettings: {
          lazyLoading: true,
          preloadCritical: true,
          cacheNavigation: true
        },
        appearanceSettings: {
          primaryColor: "#8b5cf6",
          secondaryColor: "#ec4899",
          borderRadius: "md",
          fontSize: "base",
          spacing: "comfortable"
        },
        analytics: {
          navigationClicks: 0,
          successRate: 0,
          averageLoadTime: 0,
          mostUsedTabs: []
        }
      }

      setSettings(defaultSettings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load navigation settings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const updateSettings = useCallback(async (newSettings: Partial<CompanyNavigationSettings>) => {
    try {
      setSettings(prev => prev ? { ...prev, ...newSettings } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    }
  }, [])

  const addCustomTab = useCallback(async (tab: Omit<NavigationTab, 'id'>) => {
    try {
      const newTab: NavigationTab = {
        ...tab,
        id: Date.now().toString()
      }
      
      setSettings(prev => prev ? {
        ...prev,
        customTabs: [...prev.customTabs, newTab]
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add custom tab')
    }
  }, [])

  const removeCustomTab = useCallback(async (tabId: string) => {
    try {
      setSettings(prev => prev ? {
        ...prev,
        customTabs: prev.customTabs.filter(tab => tab.id !== tabId)
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove custom tab')
    }
  }, [])

  const updateTabOrder = useCallback(async (tabId: string, newOrder: number) => {
    try {
      setSettings(prev => {
        if (!prev) return null
        
        const allTabs = [...prev.defaultTabs, ...prev.customTabs]
        const updatedTabs = allTabs.map(tab => 
          tab.id === tabId ? { ...tab, order: newOrder } : tab
        ).sort((a, b) => a.order - b.order)
        
        const defaultTabs = updatedTabs.filter(tab => 
          prev.defaultTabs.some(dt => dt.id === tab.id)
        )
        const customTabs = updatedTabs.filter(tab => 
          prev.customTabs.some(ct => ct.id === tab.id)
        )
        
        return {
          ...prev,
          defaultTabs,
          customTabs
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tab order')
    }
  }, [])

  const toggleTabStatus = useCallback(async (tabId: string) => {
    try {
      setSettings(prev => {
        if (!prev) return null
        
        const updateTab = (tabs: NavigationTab[]) => 
          tabs.map(tab => 
            tab.id === tabId 
              ? { ...tab, status: tab.status === 'active' ? 'hidden' as const : 'active' as const }
              : tab
          )
        
        return {
          ...prev,
          defaultTabs: updateTab(prev.defaultTabs),
          customTabs: updateTab(prev.customTabs)
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle tab status')
    }
  }, [])

  const updateTabAccess = useCallback(async (tabId: string, accessLevel: NavigationTab['accessLevel']) => {
    try {
      setSettings(prev => {
        if (!prev) return null
        
        const updateTab = (tabs: NavigationTab[]) => 
          tabs.map(tab => 
            tab.id === tabId ? { ...tab, accessLevel } : tab
          )
        
        return {
          ...prev,
          defaultTabs: updateTab(prev.defaultTabs),
          customTabs: updateTab(prev.customTabs)
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tab access')
    }
  }, [])

  const toggleMaintenanceMode = useCallback(async () => {
    try {
      setSettings(prev => prev ? {
        ...prev,
        maintenanceMode: !prev.maintenanceMode
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle maintenance mode')
    }
  }, [])

  const updateMaintenanceMessage = useCallback(async (message: string) => {
    try {
      setSettings(prev => prev ? {
        ...prev,
        maintenanceMessage: message
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update maintenance message')
    }
  }, [])

  const addAllowedPath = useCallback(async (path: string) => {
    try {
      setSettings(prev => prev ? {
        ...prev,
        allowedPaths: [...prev.allowedPaths, path]
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add allowed path')
    }
  }, [])

  const removeAllowedPath = useCallback(async (path: string) => {
    try {
      setSettings(prev => prev ? {
        ...prev,
        allowedPaths: prev.allowedPaths.filter(p => p !== path)
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove allowed path')
    }
  }, [])

  const addBlockedPath = useCallback(async (path: string) => {
    try {
      setSettings(prev => prev ? {
        ...prev,
        blockedPaths: [...prev.blockedPaths, path]
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add blocked path')
    }
  }, [])

  const removeBlockedPath = useCallback(async (path: string) => {
    try {
      setSettings(prev => prev ? {
        ...prev,
        blockedPaths: prev.blockedPaths.filter(p => p !== path)
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove blocked path')
    }
  }, [])

  const updateSecuritySettings = useCallback(async (securitySettings: CompanyNavigationSettings['securitySettings']) => {
    try {
      setSettings(prev => prev ? {
        ...prev,
        securitySettings
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update security settings')
    }
  }, [])

  const updatePerformanceSettings = useCallback(async (performanceSettings: CompanyNavigationSettings['performanceSettings']) => {
    try {
      setSettings(prev => prev ? {
        ...prev,
        performanceSettings
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update performance settings')
    }
  }, [])

  const updateAppearanceSettings = useCallback(async (appearanceSettings: CompanyNavigationSettings['appearanceSettings']) => {
    try {
      setSettings(prev => prev ? {
        ...prev,
        appearanceSettings
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appearance settings')
    }
  }, [])

  const refreshSettings = useCallback(async () => {
    await loadSettings()
  }, [loadSettings])

  const resetToDefaults = useCallback(async () => {
    try {
      await loadSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset to defaults')
    }
  }, [loadSettings])

  return {
    settings,
    loading,
    error,
    updateSettings,
    addCustomTab,
    removeCustomTab,
    updateTabOrder,
    toggleTabStatus,
    updateTabAccess,
    toggleMaintenanceMode,
    updateMaintenanceMessage,
    addAllowedPath,
    removeAllowedPath,
    addBlockedPath,
    removeBlockedPath,
    updateSecuritySettings,
    updatePerformanceSettings,
    updateAppearanceSettings,
    refreshSettings,
    resetToDefaults
  }
} 