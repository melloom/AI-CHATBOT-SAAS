'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, XCircle, AlertTriangle, Settings, Palette, Users, Bell, Database, Shield, Zap } from 'lucide-react'

interface FeatureToggles {
  maintenanceMode: boolean
  debugMode: boolean
  analyticsEnabled: boolean
  userRegistration: boolean
  emailNotifications: boolean
  customBranding: boolean
}

export function FeatureTogglesTest() {
  const [toggles, setToggles] = useState<FeatureToggles | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const expectedDefaults = {
    maintenanceMode: false,
    debugMode: false,
    analyticsEnabled: true,
    userRegistration: true,
    emailNotifications: true,
    customBranding: false
  }

  useEffect(() => {
    loadToggles()
  }, [])

  const loadToggles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setToggles({
          maintenanceMode: data.maintenanceMode || false,
          debugMode: data.debugMode || false,
          analyticsEnabled: data.analyticsEnabled !== false, // Default to true
          userRegistration: data.userRegistration !== false, // Default to true
          emailNotifications: data.emailNotifications !== false, // Default to true
          customBranding: data.customBranding || false
        })
      } else {
        throw new Error('Failed to load feature toggles')
      }
    } catch (error) {
      console.error('Error loading feature toggles:', error)
      toast({
        title: "Error",
        description: "Failed to load feature toggles",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const testToggles = async () => {
    setTesting(true)
    
    // Simulate testing each toggle
    const tests = [
      { name: 'Maintenance Mode', value: toggles?.maintenanceMode, expected: expectedDefaults.maintenanceMode },
      { name: 'Debug Mode', value: toggles?.debugMode, expected: expectedDefaults.debugMode },
      { name: 'Analytics', value: toggles?.analyticsEnabled, expected: expectedDefaults.analyticsEnabled },
      { name: 'User Registration', value: toggles?.userRegistration, expected: expectedDefaults.userRegistration },
      { name: 'Email Notifications', value: toggles?.emailNotifications, expected: expectedDefaults.emailNotifications },
      { name: 'Custom Branding', value: toggles?.customBranding, expected: expectedDefaults.customBranding }
    ]

    let allPassed = true
    const results = []

    for (const test of tests) {
      const passed = test.value === test.expected
      if (!passed) allPassed = false
      
      results.push({
        name: test.name,
        current: test.value,
        expected: test.expected,
        passed
      })
    }

    // Show results
    if (allPassed) {
      toast({
        title: "✅ All Tests Passed",
        description: "All feature toggles are correctly configured",
      })
    } else {
      toast({
        title: "❌ Some Tests Failed",
        description: "Some feature toggles need attention",
        variant: "destructive"
      })
    }

    setTesting(false)
  }

  const resetToDefaults = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maintenanceMode: expectedDefaults.maintenanceMode,
          debugMode: expectedDefaults.debugMode,
          analyticsEnabled: expectedDefaults.analyticsEnabled,
          userRegistration: expectedDefaults.userRegistration,
          emailNotifications: expectedDefaults.emailNotifications,
          customBranding: expectedDefaults.customBranding
        })
      })

      if (response.ok) {
        await loadToggles()
        toast({
          title: "✅ Reset Successful",
          description: "Feature toggles reset to defaults",
        })
      } else {
        throw new Error('Failed to reset toggles')
      }
    } catch (error) {
      console.error('Error resetting toggles:', error)
      toast({
        title: "Error",
        description: "Failed to reset feature toggles",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleChange = async (field: keyof FeatureToggles, value: boolean) => {
    if (!toggles) return

    try {
      setSaving(true)
      const updatedToggles = { ...toggles, [field]: value }
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [field]: value
        })
      })

      if (response.ok) {
        setToggles(updatedToggles)
        toast({
          title: "✅ Updated",
          description: `${field} has been ${value ? 'enabled' : 'disabled'}`,
        })
      } else {
        throw new Error('Failed to update toggle')
      }
    } catch (error) {
      console.error('Error updating toggle:', error)
      toast({
        title: "Error",
        description: `Failed to update ${field}`,
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Feature Toggles Test</span>
          </CardTitle>
          <CardDescription>Testing platform feature toggles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Feature Toggles Test</span>
        </CardTitle>
        <CardDescription>Testing platform feature toggles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Maintenance Mode</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={toggles?.maintenanceMode === expectedDefaults.maintenanceMode ? "default" : "secondary"}>
                  {toggles?.maintenanceMode ? 'Enabled' : 'Disabled'}
                </Badge>
                {toggles?.maintenanceMode === expectedDefaults.maintenanceMode ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <Switch
                checked={toggles?.maintenanceMode || false}
                onCheckedChange={(checked) => handleToggleChange('maintenanceMode', checked)}
                disabled={saving}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Expected: {expectedDefaults.maintenanceMode ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="font-medium">Debug Mode</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={toggles?.debugMode === expectedDefaults.debugMode ? "default" : "secondary"}>
                  {toggles?.debugMode ? 'Enabled' : 'Disabled'}
                </Badge>
                {toggles?.debugMode === expectedDefaults.debugMode ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <Switch
                checked={toggles?.debugMode || false}
                onCheckedChange={(checked) => handleToggleChange('debugMode', checked)}
                disabled={saving}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Expected: {expectedDefaults.debugMode ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="font-medium">Analytics</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={toggles?.analyticsEnabled === expectedDefaults.analyticsEnabled ? "default" : "secondary"}>
                  {toggles?.analyticsEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                {toggles?.analyticsEnabled === expectedDefaults.analyticsEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <Switch
                checked={toggles?.analyticsEnabled || false}
                onCheckedChange={(checked) => handleToggleChange('analyticsEnabled', checked)}
                disabled={saving}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Expected: {expectedDefaults.analyticsEnabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">User Registration</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={toggles?.userRegistration === expectedDefaults.userRegistration ? "default" : "secondary"}>
                  {toggles?.userRegistration ? 'Enabled' : 'Disabled'}
                </Badge>
                {toggles?.userRegistration === expectedDefaults.userRegistration ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <Switch
                checked={toggles?.userRegistration || false}
                onCheckedChange={(checked) => handleToggleChange('userRegistration', checked)}
                disabled={saving}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Expected: {expectedDefaults.userRegistration ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="font-medium">Email Notifications</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={toggles?.emailNotifications === expectedDefaults.emailNotifications ? "default" : "secondary"}>
                  {toggles?.emailNotifications ? 'Enabled' : 'Disabled'}
                </Badge>
                {toggles?.emailNotifications === expectedDefaults.emailNotifications ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <Switch
                checked={toggles?.emailNotifications || false}
                onCheckedChange={(checked) => handleToggleChange('emailNotifications', checked)}
                disabled={saving}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Expected: {expectedDefaults.emailNotifications ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="font-medium">Custom Branding</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={toggles?.customBranding === expectedDefaults.customBranding ? "default" : "secondary"}>
                  {toggles?.customBranding ? 'Enabled' : 'Disabled'}
                </Badge>
                {toggles?.customBranding === expectedDefaults.customBranding ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <Switch
                checked={toggles?.customBranding || false}
                onCheckedChange={(checked) => handleToggleChange('customBranding', checked)}
                disabled={saving}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Expected: {expectedDefaults.customBranding ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button 
            onClick={testToggles} 
            disabled={testing || saving}
            variant="outline"
          >
            {testing ? 'Testing...' : 'Test Toggles'}
          </Button>
          <Button 
            onClick={resetToDefaults} 
            disabled={testing || saving}
            variant="outline"
          >
            {saving ? 'Resetting...' : 'Reset to Defaults'}
          </Button>
          <Button 
            onClick={loadToggles} 
            disabled={testing || saving}
            variant="outline"
          >
            Refresh
          </Button>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Feature Toggles Summary</h4>
          <ul className="space-y-1 text-sm">
            <li>🔧 Maintenance Mode: Temporarily disable platform access</li>
            <li>🐛 Debug Mode: Enable detailed logging and debugging</li>
            <li>📊 Analytics: Enable usage analytics and tracking</li>
            <li>👥 User Registration: Allow new user registrations</li>
            <li>📧 Email Notifications: Send email notifications to users</li>
            <li>🎨 Custom Branding: Allow companies to customize branding</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 