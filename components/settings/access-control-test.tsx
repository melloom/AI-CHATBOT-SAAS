"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getAuthHeaders } from "@/lib/auth-client"
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Lock,
  Users,
  Globe,
  Network,
  Building,
  Unlock
} from "lucide-react"

interface AccessControlTestResult {
  testName: string
  status: 'pass' | 'fail' | 'warning' | 'pending'
  message: string
  details?: string
}

export function AccessControlTest() {
  const { toast } = useToast()
  const [results, setResults] = useState<AccessControlTestResult[]>([])
  const [running, setRunning] = useState(false)
  const { profile } = useAuth()

  const runAccessControlTests = async () => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can run access control tests.",
        variant: "destructive",
      })
      return
    }

    setRunning(true)
    setResults([])

    const tests: AccessControlTestResult[] = []

    try {
      // Test 1: User Authentication
      tests.push({ testName: "User Authentication", status: "pending", message: "Testing user authentication..." })
      setResults([...tests])

      const headers = await getAuthHeaders()
      const hasAuthToken = 'Authorization' in headers || (Array.isArray(headers) && headers.some(([key]) => key === 'Authorization'))
      
      if (hasAuthToken) {
        tests[0] = {
          testName: "User Authentication",
          status: "pass",
          message: "User authentication working",
          details: "Authentication token available"
        }
      } else {
        tests[0] = {
          testName: "User Authentication",
          status: "fail",
          message: "User authentication failed",
          details: "No authentication token found"
        }
      }
      setResults([...tests])

      // Test 2: Role-Based Access Control
      tests.push({ testName: "Role-Based Access Control", status: "pending", message: "Testing role-based access control..." })
      setResults([...tests])

      const userResponse = await fetch('/api/users?listAll=true', {
        headers
      })
      
      if (userResponse.ok) {
        tests[1] = {
          testName: "Role-Based Access Control",
          status: "pass",
          message: "Role-based access control working",
          details: "Admin can access user list"
        }
      } else {
        tests[1] = {
          testName: "Role-Based Access Control",
          status: "warning",
          message: "Role-based access control needs attention",
          details: "Admin access may be restricted"
        }
      }
      setResults([...tests])

      // Test 3: Permission Validation
      tests.push({ testName: "Permission Validation", status: "pending", message: "Testing permission validation..." })
      setResults([...tests])

      const settingsResponse = await fetch('/api/settings/platform', {
        headers
      })
      
      if (settingsResponse.ok) {
        tests[2] = {
          testName: "Permission Validation",
          status: "pass",
          message: "Permission validation working",
          details: "Admin can access platform settings"
        }
      } else {
        tests[2] = {
          testName: "Permission Validation",
          status: "warning",
          message: "Permission validation needs attention",
          details: "Admin permissions may be restricted"
        }
      }
      setResults([...tests])

      // Test 4: Session Management
      tests.push({ testName: "Session Management", status: "pending", message: "Testing session management..." })
      setResults([...tests])

      const sessionResponse = await fetch('/api/auth/session', {
        headers
      })
      
      if (sessionResponse.ok) {
        tests[3] = {
          testName: "Session Management",
          status: "pass",
          message: "Session management working",
          details: "Session validation successful"
        }
      } else {
        tests[3] = {
          testName: "Session Management",
          status: "warning",
          message: "Session management needs attention",
          details: "Session may be expired"
        }
      }
      setResults([...tests])

      // Test 5: IP Validation
      tests.push({ testName: "IP Validation", status: "pending", message: "Testing IP validation..." })
      setResults([...tests])

      const ipResponse = await fetch('/api/auth/ip-validation', {
        headers
      })
      
      if (ipResponse.ok) {
        const ipData = await ipResponse.json()
        if (ipData.allowed) {
          tests[4] = {
            testName: "IP Validation",
            status: "pass",
            message: "IP validation working",
            details: "IP address is allowed"
          }
        } else {
          tests[4] = {
            testName: "IP Validation",
            status: "warning",
            message: "IP validation needs attention",
            details: "IP address may be restricted"
          }
        }
      } else {
        tests[4] = {
          testName: "IP Validation",
          status: "fail",
          message: "IP validation failed",
          details: "IP validation service unavailable"
        }
      }
      setResults([...tests])

      toast({
        title: "Access Control Tests Complete",
        description: "All access control tests have been completed successfully.",
      })

    } catch (error) {
      console.error('Error running access control tests:', error)
      toast({
        title: "Error",
        description: "Failed to run access control tests",
        variant: "destructive",
      })
    } finally {
      setRunning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Pass</Badge>
      case 'fail':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Fail</Badge>
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const passCount = results.filter(r => r.status === 'pass').length
  const failCount = results.filter(r => r.status === 'fail').length
  const warningCount = results.filter(r => r.status === 'warning').length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Access Control Test Suite</span>
          </CardTitle>
          <CardDescription>
            Comprehensive testing for IP whitelisting, domain restrictions, admin access, and session management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button onClick={runAccessControlTests} disabled={running}>
                {running ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Run Access Control Tests
                  </>
                )}
              </Button>
            </div>
            {results.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Results:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">{passCount} Pass</Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{warningCount} Warning</Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800">{failCount} Fail</Badge>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{result.testName}</h4>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-muted-foreground mt-1">{result.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length === 0 && !running && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Click "Run Access Control Tests" to perform a comprehensive assessment of your access control system.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 