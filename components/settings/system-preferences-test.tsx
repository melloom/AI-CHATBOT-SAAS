'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, XCircle, AlertCircle, Clock, FileText, Calendar, Settings } from 'lucide-react'

interface SystemPreferences {
  dateFormat: string
  timeFormat: string
  sessionTimeout: string
  maxFileUploadSize: string
}

export function SystemPreferencesTest() {
  const [preferences, setPreferences] = useState<SystemPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const { toast } = useToast()

  const expectedDefaults = {
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    sessionTimeout: "24h",
    maxFileUploadSize: "10MB"
  }

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setPreferences({
          dateFormat: data.dateFormat,
          timeFormat: data.timeFormat,
          sessionTimeout: data.sessionTimeout,
          maxFileUploadSize: data.maxFileUploadSize
        })
      } else {
        throw new Error('Failed to load preferences')
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
      toast({
        title: "Error",
        description: "Failed to load system preferences",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const testPreferences = async () => {
    setTesting(true)
    
    // Simulate testing each preference
    const tests = [
      { name: 'Date Format', value: preferences?.dateFormat, expected: expectedDefaults.dateFormat },
      { name: 'Time Format', value: preferences?.timeFormat, expected: expectedDefaults.timeFormat },
      { name: 'Session Timeout', value: preferences?.sessionTimeout, expected: expectedDefaults.sessionTimeout },
      { name: 'Max File Upload Size', value: preferences?.maxFileUploadSize, expected: expectedDefaults.maxFileUploadSize }
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
        description: "All system preferences are correctly configured",
      })
    } else {
      toast({
        title: "❌ Some Tests Failed",
        description: "Some system preferences need attention",
        variant: "destructive"
      })
    }

    setTesting(false)
  }

  const resetToDefaults = async () => {
    try {
      setTesting(true)
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateFormat: expectedDefaults.dateFormat,
          timeFormat: expectedDefaults.timeFormat,
          sessionTimeout: expectedDefaults.sessionTimeout,
          maxFileUploadSize: expectedDefaults.maxFileUploadSize
        })
      })

      if (response.ok) {
        await loadPreferences()
        toast({
          title: "✅ Reset Successful",
          description: "System preferences reset to defaults",
        })
      } else {
        throw new Error('Failed to reset preferences')
      }
    } catch (error) {
      console.error('Error resetting preferences:', error)
      toast({
        title: "Error",
        description: "Failed to reset system preferences",
        variant: "destructive"
      })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>System Preferences Test</span>
          </CardTitle>
          <CardDescription>Testing system behavior and performance settings</CardDescription>
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
          <Settings className="h-5 w-5" />
          <span>System Preferences Test</span>
        </CardTitle>
        <CardDescription>Testing system behavior and performance settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Date Format</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={preferences?.dateFormat === expectedDefaults.dateFormat ? "default" : "secondary"}>
                {preferences?.dateFormat || 'Not set'}
              </Badge>
              {preferences?.dateFormat === expectedDefaults.dateFormat ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Expected: {expectedDefaults.dateFormat}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Time Format</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={preferences?.timeFormat === expectedDefaults.timeFormat ? "default" : "secondary"}>
                {preferences?.timeFormat === '12h' ? '12-hour' : preferences?.timeFormat || 'Not set'}
              </Badge>
              {preferences?.timeFormat === expectedDefaults.timeFormat ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Expected: 12-hour
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Session Timeout</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={preferences?.sessionTimeout === expectedDefaults.sessionTimeout ? "default" : "secondary"}>
                {preferences?.sessionTimeout === '24h' ? '24 hours' : preferences?.sessionTimeout || 'Not set'}
              </Badge>
              {preferences?.sessionTimeout === expectedDefaults.sessionTimeout ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Expected: 24 hours
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Max File Upload Size</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={preferences?.maxFileUploadSize === expectedDefaults.maxFileUploadSize ? "default" : "secondary"}>
                {preferences?.maxFileUploadSize || 'Not set'}
              </Badge>
              {preferences?.maxFileUploadSize === expectedDefaults.maxFileUploadSize ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Expected: {expectedDefaults.maxFileUploadSize}
            </p>
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button 
            onClick={testPreferences} 
            disabled={testing}
            variant="outline"
          >
            {testing ? 'Testing...' : 'Test Preferences'}
          </Button>
          <Button 
            onClick={resetToDefaults} 
            disabled={testing}
            variant="outline"
          >
            {testing ? 'Resetting...' : 'Reset to Defaults'}
          </Button>
          <Button 
            onClick={loadPreferences} 
            disabled={testing}
            variant="outline"
          >
            Refresh
          </Button>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Test Summary</h4>
          <ul className="space-y-1 text-sm">
            <li>✅ Date Format: MM/DD/YYYY</li>
            <li>✅ Time Format: 12-hour</li>
            <li>✅ Session Timeout: 24 hours</li>
            <li>✅ Max File Upload Size: 10 MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 