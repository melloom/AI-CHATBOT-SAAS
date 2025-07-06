"use client"

import { useState, useEffect, useCallback } from "react"

interface NavigationPath {
  id: string
  path: string
  name: string
  description: string
  status: 'active' | 'maintenance' | 'disabled'
  accessLevel: 'public' | 'private' | 'admin' | 'maintenance'
  maintenanceMessage?: string
  maintenanceSchedule?: {
    startTime: string
    endTime: string
    timezone: string
    daysOfWeek: string[]
  }
  lastUpdated: string
  companyId: string
}

interface CompanyNavigationSettings {
  id: string
  companyId: string
  companyName: string
  domain: string
  status: 'active' | 'suspended' | 'maintenance'
  maintenanceMode: boolean
  maintenanceMessage: string
  allowedPaths: string[]
  blockedPaths: string[]
  customRoutes: NavigationPath[]
  maintenanceSchedule?: {
    startTime: string
    endTime: string
    timezone: string
    daysOfWeek: string[]
  }
  securitySettings: {
    ipWhitelist: boolean
    twoFactorRequired: boolean
    sessionTimeout: boolean
    sessionTimeoutMinutes: number
  }
  monitoringSettings: {
    pathMonitoring: boolean
    errorLogging: boolean
    performanceTracking: boolean
  }
  lastUpdated: string
}

interface UseNavigationSettingsReturn {
  settings: CompanyNavigationSettings[]
  loading: boolean
  error: string | null
  selectedCompany: CompanyNavigationSettings | null
  setSelectedCompany: (company: CompanyNavigationSettings | null) => void
  updateSettings: (companyId: string, settings: Partial<CompanyNavigationSettings>) => Promise<void>
  addCustomRoute: (companyId: string, route: Omit<NavigationPath, 'id' | 'lastUpdated'>) => Promise<void>
  removeCustomRoute: (companyId: string, routeId: string) => Promise<void>
  toggleMaintenanceMode: (companyId: string) => Promise<void>
  updateMaintenanceSchedule: (companyId: string, schedule: CompanyNavigationSettings['maintenanceSchedule']) => Promise<void>
  updateSecuritySettings: (companyId: string, settings: CompanyNavigationSettings['securitySettings']) => Promise<void>
  updateMonitoringSettings: (companyId: string, settings: CompanyNavigationSettings['monitoringSettings']) => Promise<void>
  addAllowedPath: (companyId: string, path: string) => Promise<void>
  removeAllowedPath: (companyId: string, path: string) => Promise<void>
  addBlockedPath: (companyId: string, path: string) => Promise<void>
  removeBlockedPath: (companyId: string, path: string) => Promise<void>
  refreshSettings: () => Promise<void>
}

export function useNavigationSettings(): UseNavigationSettingsReturn {
  const [settings, setSettings] = useState<CompanyNavigationSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<CompanyNavigationSettings | null>(null)

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load real navigation settings from Firebase
      // TODO: Implement real navigation settings with Firebase
      const realSettings: CompanyNavigationSettings[] = []
      
      setSettings(realSettings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load navigation settings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const updateSettings = useCallback(async (companyId: string, newSettings: Partial<CompanyNavigationSettings>) => {
    try {
      setSettings(prev => prev.map(setting => 
        setting.companyId === companyId 
          ? { ...setting, ...newSettings, lastUpdated: new Date().toISOString() }
          : setting
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    }
  }, [])

  const addCustomRoute = useCallback(async (companyId: string, route: Omit<NavigationPath, 'id' | 'lastUpdated'>) => {
    try {
      const newRoute: NavigationPath = {
        ...route,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString()
      }
      
      setSettings(prev => prev.map(setting => 
        setting.companyId === companyId 
          ? { 
              ...setting, 
              customRoutes: [...setting.customRoutes, newRoute],
              lastUpdated: new Date().toISOString()
            }
          : setting
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add custom route')
    }
  }, [])

  const removeCustomRoute = useCallback(async (companyId: string, routeId: string) => {
    try {
      setSettings(prev => prev.map(setting => 
        setting.companyId === companyId 
          ? { 
              ...setting, 
              customRoutes: setting.customRoutes.filter(route => route.id !== routeId),
              lastUpdated: new Date().toISOString()
            }
          : setting
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove custom route')
    }
  }, [])

  const toggleMaintenanceMode = useCallback(async (companyId: string) => {
    try {
      setSettings(prev => prev.map(setting => 
        setting.companyId === companyId 
          ? { 
              ...setting, 
              maintenanceMode: !setting.maintenanceMode,
              lastUpdated: new Date().toISOString()
            }
          : setting
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle maintenance mode')
    }
  }, [])

  const updateMaintenanceSchedule = useCallback(async (companyId: string, schedule: CompanyNavigationSettings['maintenanceSchedule']) => {
    try {
      setSettings(prev => prev.map(setting => 
        setting.companyId === companyId 
          ? { 
              ...setting, 
              maintenanceSchedule: schedule,
              lastUpdated: new Date().toISOString()
            }
          : setting
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update maintenance schedule')
    }
  }, [])

  const updateSecuritySettings = useCallback(async (companyId: string, securitySettings: CompanyNavigationSettings['securitySettings']) => {
    try {
      setSettings(prev => prev.map(setting => 
        setting.companyId === companyId 
          ? { 
              ...setting, 
              securitySettings,
              lastUpdated: new Date().toISOString()
            }
          : setting
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update security settings')
    }
  }, [])

  const updateMonitoringSettings = useCallback(async (companyId: string, monitoringSettings: CompanyNavigationSettings['monitoringSettings']) => {
    try {
      setSettings(prev => prev.map(setting => 
        setting.companyId === companyId 
          ? { 
              ...setting, 
              monitoringSettings,
              lastUpdated: new Date().toISOString()
            }
          : setting
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update monitoring settings')
    }
  }, [])

  const addAllowedPath = useCallback(async (companyId: string, path: string) => {
    try {
      setSettings(prev => prev.map(setting => 
        setting.companyId === companyId 
          ? { 
              ...setting, 
              allowedPaths: [...setting.allowedPaths, path],
              lastUpdated: new Date().toISOString()
            }
          : setting
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add allowed path')
    }
  }, [])

  const removeAllowedPath = useCallback(async (companyId: string, path: string) => {
    try {
      setSettings(prev => prev.map(setting => 
        setting.companyId === companyId 
          ? { 
              ...setting, 
              allowedPaths: setting.allowedPaths.filter(p => p !== path),
              lastUpdated: new Date().toISOString()
            }
          : setting
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove allowed path')
    }
  }, [])

  const addBlockedPath = useCallback(async (companyId: string, path: string) => {
    try {
      setSettings(prev => prev.map(setting => 
        setting.companyId === companyId 
          ? { 
              ...setting, 
              blockedPaths: [...setting.blockedPaths, path],
              lastUpdated: new Date().toISOString()
            }
          : setting
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add blocked path')
    }
  }, [])

  const removeBlockedPath = useCallback(async (companyId: string, path: string) => {
    try {
      setSettings(prev => prev.map(setting => 
        setting.companyId === companyId 
          ? { 
              ...setting, 
              blockedPaths: setting.blockedPaths.filter(p => p !== path),
              lastUpdated: new Date().toISOString()
            }
          : setting
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove blocked path')
    }
  }, [])

  const refreshSettings = useCallback(async () => {
    await loadSettings()
  }, [loadSettings])

  return {
    settings,
    loading,
    error,
    selectedCompany,
    setSelectedCompany,
    updateSettings,
    addCustomRoute,
    removeCustomRoute,
    toggleMaintenanceMode,
    updateMaintenanceSchedule,
    updateSecuritySettings,
    updateMonitoringSettings,
    addAllowedPath,
    removeAllowedPath,
    addBlockedPath,
    removeBlockedPath,
    refreshSettings
  }
} 