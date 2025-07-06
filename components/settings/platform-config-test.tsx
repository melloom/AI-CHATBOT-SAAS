"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { 
  Globe, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Loader2
} from "lucide-react"

interface PlatformConfig {
  platformName: string
  platformUrl: string
  timezone: string
  language: string
}

export function PlatformConfigTest() {
  const [config, setConfig] = useState<PlatformConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>({})
  const { toast } = useToast()

  const loadConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setConfig({
          platformName: data.platformName || 'Not Set',
          platformUrl: data.platformUrl || 'Not Set',
          timezone: data.timezone || 'Not Set',
          language: data.language || 'Not Set'
        })
      } else {
        throw new Error('Failed to load configuration')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load platform configuration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const testConfiguration = async () => {
    setLoading(true)
    const results: any = {}

    try {
      if (!config) {
        throw new Error('No configuration loaded')
      }

      // Test 1: Check if platform name is set
      results.platformName = {
        status: config.platformName && config.platformName !== 'Not Set' ? 'success' : 'error',
        message: config.platformName && config.platformName !== 'Not Set' 
          ? `Platform name is set to: ${config.platformName}` 
          : 'Platform name is not configured'
      }

      // Test 2: Check if platform URL is valid
      if (config.platformUrl && config.platformUrl !== 'Not Set') {
        try {
          new URL(config.platformUrl)
          results.platformUrl = {
            status: 'success',
            message: `Platform URL is valid: ${config.platformUrl}`
          }
        } catch (error) {
          results.platformUrl = {
            status: 'error',
            message: `Invalid platform URL: ${config.platformUrl}`
          }
        }
      } else {
        results.platformUrl = {
          status: 'error',
          message: 'Platform URL is not configured'
        }
      }

      // Test 3: Check if timezone is valid
      const validTimezones = [
        'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 
        'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'
      ]
      results.timezone = {
        status: config.timezone && validTimezones.includes(config.timezone) ? 'success' : 'error',
        message: config.timezone && validTimezones.includes(config.timezone)
          ? `Timezone is set to: ${config.timezone}`
          : `Invalid timezone: ${config.timezone || 'Not Set'}`
      }

      // Test 4: Check if language is valid
      const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko']
      results.language = {
        status: config.language && validLanguages.includes(config.language) ? 'success' : 'error',
        message: config.language && validLanguages.includes(config.language)
          ? `Language is set to: ${config.language === 'en' ? 'English' : config.language.toUpperCase()}`
          : `Invalid language: ${config.language || 'Not Set'}`
      }

      // Test 5: Check if all required fields are set
      const allFieldsSet = config.platformName && config.platformUrl && config.timezone && config.language &&
        config.platformName !== 'Not Set' && config.platformUrl !== 'Not Set' && 
        config.timezone !== 'Not Set' && config.language !== 'Not Set'

      results.overall = {
        status: allFieldsSet ? 'success' : 'warning',
        message: allFieldsSet 
          ? 'All platform configuration fields are properly set'
          : 'Some platform configuration fields are missing or invalid'
      }

      setTestResults(results)

      if (allFieldsSet) {
        toast({
          title: "Configuration Test Passed",
          description: "All platform configuration settings are properly configured",
        })
      } else {
        toast({
          title: "Configuration Test Warning",
          description: "Some platform configuration settings need attention",
          variant: "destructive",
        })
      }

    } catch (error) {
      toast({
        title: "Test Error",
        description: "Failed to test platform configuration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Pass</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Fail</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Platform Configuration Test</span>
          </CardTitle>
          <CardDescription>
            Test and verify that platform configuration settings are working properly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Current Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Platform configuration values loaded from database
              </p>
            </div>
            <Button onClick={loadConfig} disabled={loading} variant="outline">
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>

          {config && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Platform Name</Label>
                <p className="text-sm text-muted-foreground">{config.platformName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Platform URL</Label>
                <p className="text-sm text-muted-foreground">{config.platformUrl}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Timezone</Label>
                <p className="text-sm text-muted-foreground">{config.timezone}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Language</Label>
                <p className="text-sm text-muted-foreground">
                  {config.language === 'en' ? 'English' : config.language.toUpperCase()}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button onClick={testConfiguration} disabled={loading || !config}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {loading ? "Testing..." : "Test Configuration"}
            </Button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Test Results</h3>
              <div className="space-y-3">
                {Object.entries(testResults).map(([key, result]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="font-medium capitalize">{key}</p>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Simple Label component for the test
const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
) 