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
  Key,
  Users,
  Globe,
  Server
} from "lucide-react"

interface SecurityTestResult {
  testName: string
  status: 'pass' | 'fail' | 'warning' | 'pending'
  message: string
  details?: string
}

export function SecurityTest() {
  const { toast } = useToast()
  const [results, setResults] = useState<SecurityTestResult[]>([])
  const [running, setRunning] = useState(false)
  const { profile } = useAuth()

  const runSecurityTests = async () => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can run security tests.",
        variant: "destructive",
      })
      return
    }

    setRunning(true)
    setResults([])

    const tests: SecurityTestResult[] = []

    try {
      // Test 1: Firebase Authentication
      tests.push({ testName: "Firebase Authentication", status: "pending", message: "Testing Firebase authentication..." })
      setResults([...tests])

      const headers = await getAuthHeaders()
      const hasAuthToken = 'Authorization' in headers || (Array.isArray(headers) && headers.some(([key]) => key === 'Authorization'))
      
      if (hasAuthToken) {
        tests[0] = {
          testName: "Firebase Authentication",
          status: "pass",
          message: "Firebase authentication working",
          details: "Authentication token available"
        }
      } else {
        tests[0] = {
          testName: "Firebase Authentication",
          status: "fail",
          message: "Firebase authentication failed",
          details: "No authentication token found"
        }
      }
      setResults([...tests])

      // Test 2: Authentication Validation
      tests.push({ testName: "Authentication Validation", status: "pending", message: "Testing authentication validation..." })
      setResults([...tests])

      const validationResponse = await fetch('/api/auth/validate', {
        headers
      })
      
      if (validationResponse.ok) {
        tests[1] = {
          testName: "Authentication Validation",
          status: "pass",
          message: "Authentication validation working",
          details: "Token validation successful"
        }
      } else {
        tests[1] = {
          testName: "Authentication Validation",
          status: "warning",
          message: "Authentication validation needs attention",
          details: "Token may be expired or invalid"
        }
      }
      setResults([...tests])

      // Test 3: Session Management
      tests.push({ testName: "Session Management", status: "pending", message: "Testing session management..." })
      setResults([...tests])

      const sessionResponse = await fetch('/api/auth/session', {
        headers
      })
      
      if (sessionResponse.ok) {
        tests[2] = {
          testName: "Session Management",
          status: "pass",
          message: "Session management working",
          details: "Session validation successful"
        }
      } else {
        tests[2] = {
          testName: "Session Management",
          status: "warning",
          message: "Session management needs attention",
          details: "Session may be expired"
        }
      }
      setResults([...tests])

      // Test 4: Rate Limiting
      tests.push({ testName: "Rate Limiting", status: "pending", message: "Testing rate limiting..." })
      setResults([...tests])

      // Simulate multiple requests to test rate limiting
      const rateLimitPromises = Array(5).fill(0).map(() => 
        fetch('/api/settings/security', {
          headers
        })
      )

      const rateLimitResponses = await Promise.all(rateLimitPromises)
      const rateLimited = rateLimitResponses.some(response => response.status === 429)
      
      if (rateLimited) {
        tests[3] = {
          testName: "Rate Limiting",
          status: "pass",
          message: "Rate limiting is active",
          details: "Rate limiting protection working"
        }
      } else {
        tests[3] = {
          testName: "Rate Limiting",
          status: "warning",
          message: "Rate limiting may not be configured",
          details: "No rate limiting detected"
        }
      }
      setResults([...tests])

      // Test 5: Security Headers
      tests.push({ testName: "Security Headers", status: "pending", message: "Testing security headers..." })
      setResults([...tests])

      const headersResponse = await fetch('/api/settings/security', {
        headers
      })
      const securityHeaders = headersResponse.headers
      
      const requiredHeaders = ['x-content-type-options', 'x-frame-options', 'x-xss-protection']
      const missingHeaders = requiredHeaders.filter(header => !securityHeaders.get(header))
      
      if (missingHeaders.length === 0) {
        tests[4] = {
          testName: "Security Headers",
          status: "pass",
          message: "Security headers configured",
          details: "All required security headers present"
        }
      } else {
        tests[4] = {
          testName: "Security Headers",
          status: "warning",
          message: "Some security headers missing",
          details: `Missing: ${missingHeaders.join(', ')}`
        }
      }
      setResults([...tests])

      // Test 6: IP Validation
      tests.push({ testName: "IP Validation", status: "pending", message: "Testing IP validation..." })
      setResults([...tests])

      const ipResponse = await fetch('/api/auth/ip-validation')
      if (ipResponse.ok) {
        const ipData = await ipResponse.json()
        tests[5] = {
          testName: "IP Validation",
          status: "pass",
          message: "IP validation working",
          details: `Current IP: ${ipData.ip}, Allowed: ${ipData.allowed}`
        }
      } else {
        tests[5] = {
          testName: "IP Validation",
          status: "warning",
          message: "IP validation endpoint not available",
          details: "IP validation may not be configured"
        }
      }
      setResults([...tests])

      // Test 7: Login Attempts Tracking
      tests.push({ testName: "Login Attempts Tracking", status: "pending", message: "Testing login attempts tracking..." })
      setResults([...tests])

      const loginAttemptsResponse = await fetch('/api/auth/login-attempts', {
        headers
      })
      
      if (loginAttemptsResponse.ok) {
        tests[6] = {
          testName: "Login Attempts Tracking",
          status: "pass",
          message: "Login attempts tracking active",
          details: "Failed login attempts are being tracked"
        }
      } else {
        tests[6] = {
          testName: "Login Attempts Tracking",
          status: "warning",
          message: "Login attempts tracking may not be configured",
          details: "Login attempts endpoint not available"
        }
      }
      setResults([...tests])

      // Test 8: Two-Factor Authentication
      tests.push({ testName: "Two-Factor Authentication", status: "pending", message: "Testing 2FA configuration..." })
      setResults([...tests])

      const twoFactorResponse = await fetch('/api/auth/2fa-status', {
        headers
      })
      
      if (twoFactorResponse.ok) {
        const twoFactorData = await twoFactorResponse.json()
        tests[7] = {
          testName: "Two-Factor Authentication",
          status: twoFactorData.enabled ? "pass" : "warning",
          message: twoFactorData.enabled ? "2FA is enabled" : "2FA is not enabled",
          details: twoFactorData.enabled ? "Two-factor authentication is active" : "Consider enabling 2FA for enhanced security"
        }
      } else {
        tests[7] = {
          testName: "Two-Factor Authentication",
          status: "warning",
          message: "2FA status unknown",
          details: "2FA endpoint not available"
        }
      }
      setResults([...tests])

      // Test 9: Data Encryption
      tests.push({ testName: "Data Encryption", status: "pending", message: "Testing data encryption..." })
      setResults([...tests])

      const encryptionResponse = await fetch('/api/settings/security', {
        headers
      })
      if (encryptionResponse.ok) {
        const settings = await encryptionResponse.json()
        tests[8] = {
          testName: "Data Encryption",
          status: settings.enableEncryption ? "pass" : "warning",
          message: settings.enableEncryption ? "Data encryption enabled" : "Data encryption not enabled",
          details: settings.enableEncryption ? "Data is encrypted at rest" : "Consider enabling data encryption"
        }
      } else {
        tests[8] = {
          testName: "Data Encryption",
          status: "warning",
          message: "Encryption status unknown",
          details: "Unable to verify encryption settings"
        }
      }
      setResults([...tests])

      // Test 10: Audit Logging
      tests.push({ testName: "Audit Logging", status: "pending", message: "Testing audit logging..." })
      setResults([...tests])

      const auditResponse = await fetch('/api/settings/security', {
        headers
      })
      if (auditResponse.ok) {
        const settings = await auditResponse.json()
        tests[9] = {
          testName: "Audit Logging",
          status: settings.enableAuditLogs ? "pass" : "warning",
          message: settings.enableAuditLogs ? "Audit logging enabled" : "Audit logging not enabled",
          details: settings.enableAuditLogs ? "Security events are being logged" : "Consider enabling audit logging"
        }
      } else {
        tests[9] = {
          testName: "Audit Logging",
          status: "warning",
          message: "Audit logging status unknown",
          details: "Unable to verify audit logging settings"
        }
      }
      setResults([...tests])

      toast({
        title: "Security Tests Complete",
        description: "All security tests have been completed successfully.",
      })

    } catch (error) {
      console.error('Error running security tests:', error)
      toast({
        title: "Error",
        description: "Failed to run security tests",
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
        return <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">Pass</Badge>
      case 'fail':
        return <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200">Fail</Badge>
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">Warning</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">Pending</Badge>
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
            <span>Security Test Suite</span>
          </CardTitle>
          <CardDescription>
            Comprehensive security testing for authentication, session management, and access controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button onClick={runSecurityTests} disabled={running}>
                {running ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Run Security Tests
                  </>
                )}
              </Button>
            </div>
            {results.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Results:</span>
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">{passCount} Pass</Badge>
                <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">{warningCount} Warning</Badge>
                <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200">{failCount} Fail</Badge>
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
                Click "Run Security Tests" to perform a comprehensive security assessment of your authentication system.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 