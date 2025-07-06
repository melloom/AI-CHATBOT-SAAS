'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, XCircle, Users, Building, Database, Cloud, Zap, CreditCard, Settings } from 'lucide-react'

interface LimitsQuotas {
  // Company Limits
  maxUsersPerCompany: number
  maxChatbotsPerCompany: number
  maxCompanies: number
  maxTeamsPerCompany: number
  
  // Storage Limits
  maxStoragePerCompany: number
  maxFileSizePerUpload: number
  maxFilesPerUpload: number
  maxBackupRetention: number
  
  // API Limits
  maxApiRequestsPerMinute: number
  maxApiRequestsPerHour: number
  maxConcurrentChats: number
  maxChatHistoryDays: number
  
  // Subscription Limits
  maxFreeUsers: number
  maxFreeChatbots: number
  maxProUsers: number
  maxProChatbots: number
  
  // Company Selection Options
  defaultCompanyPlan: string
  companyApprovalRequired: boolean
  maxCompanyNameLength: number
  maxCompanyDescriptionLength: number
}

export function LimitsQuotasTest() {
  const [limits, setLimits] = useState<LimitsQuotas | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const { toast } = useToast()

  const expectedDefaults = {
    // Company Limits
    maxUsersPerCompany: 100,
    maxChatbotsPerCompany: 10,
    maxCompanies: 1000,
    maxTeamsPerCompany: 10,
    
    // Storage Limits
    maxStoragePerCompany: 100,
    maxFileSizePerUpload: 50,
    maxFilesPerUpload: 10,
    maxBackupRetention: 30,
    
    // API Limits
    maxApiRequestsPerMinute: 1000,
    maxApiRequestsPerHour: 10000,
    maxConcurrentChats: 100,
    maxChatHistoryDays: 90,
    
    // Subscription Limits
    maxFreeUsers: 5,
    maxFreeChatbots: 2,
    maxProUsers: 50,
    maxProChatbots: 20,
    
    // Company Selection Options
    defaultCompanyPlan: "free",
    companyApprovalRequired: false,
    maxCompanyNameLength: 50,
    maxCompanyDescriptionLength: 500
  }

  useEffect(() => {
    loadLimits()
  }, [])

  const loadLimits = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setLimits({
          // Company Limits
          maxUsersPerCompany: data.maxUsersPerCompany || 100,
          maxChatbotsPerCompany: data.maxChatbotsPerCompany || 10,
          maxCompanies: data.maxCompanies || 1000,
          maxTeamsPerCompany: data.maxTeamsPerCompany || 10,
          
          // Storage Limits
          maxStoragePerCompany: data.maxStoragePerCompany || 100,
          maxFileSizePerUpload: data.maxFileSizePerUpload || 50,
          maxFilesPerUpload: data.maxFilesPerUpload || 10,
          maxBackupRetention: data.maxBackupRetention || 30,
          
          // API Limits
          maxApiRequestsPerMinute: data.maxApiRequestsPerMinute || 1000,
          maxApiRequestsPerHour: data.maxApiRequestsPerHour || 10000,
          maxConcurrentChats: data.maxConcurrentChats || 100,
          maxChatHistoryDays: data.maxChatHistoryDays || 90,
          
          // Subscription Limits
          maxFreeUsers: data.maxFreeUsers || 5,
          maxFreeChatbots: data.maxFreeChatbots || 2,
          maxProUsers: data.maxProUsers || 50,
          maxProChatbots: data.maxProChatbots || 20,
          
          // Company Selection Options
          defaultCompanyPlan: data.defaultCompanyPlan || "free",
          companyApprovalRequired: data.companyApprovalRequired || false,
          maxCompanyNameLength: data.maxCompanyNameLength || 50,
          maxCompanyDescriptionLength: data.maxCompanyDescriptionLength || 500
        })
      } else {
        throw new Error('Failed to load limits and quotas')
      }
    } catch (error) {
      console.error('Error loading limits and quotas:', error)
      toast({
        title: "Error",
        description: "Failed to load limits and quotas",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const testLimits = async () => {
    setTesting(true)
    
    // Test each category
    const categories = [
      {
        name: 'Company Limits',
        tests: [
          { name: 'Max Users per Company', value: limits?.maxUsersPerCompany, expected: expectedDefaults.maxUsersPerCompany },
          { name: 'Max Chatbots per Company', value: limits?.maxChatbotsPerCompany, expected: expectedDefaults.maxChatbotsPerCompany },
          { name: 'Max Companies', value: limits?.maxCompanies, expected: expectedDefaults.maxCompanies },
          { name: 'Max Teams per Company', value: limits?.maxTeamsPerCompany, expected: expectedDefaults.maxTeamsPerCompany }
        ]
      },
      {
        name: 'Storage Limits',
        tests: [
          { name: 'Max Storage per Company (GB)', value: limits?.maxStoragePerCompany, expected: expectedDefaults.maxStoragePerCompany },
          { name: 'Max File Size per Upload (MB)', value: limits?.maxFileSizePerUpload, expected: expectedDefaults.maxFileSizePerUpload },
          { name: 'Max Files per Upload', value: limits?.maxFilesPerUpload, expected: expectedDefaults.maxFilesPerUpload },
          { name: 'Max Backup Retention (Days)', value: limits?.maxBackupRetention, expected: expectedDefaults.maxBackupRetention }
        ]
      },
      {
        name: 'API Limits',
        tests: [
          { name: 'Max API Requests per Minute', value: limits?.maxApiRequestsPerMinute, expected: expectedDefaults.maxApiRequestsPerMinute },
          { name: 'Max API Requests per Hour', value: limits?.maxApiRequestsPerHour, expected: expectedDefaults.maxApiRequestsPerHour },
          { name: 'Max Concurrent Chats', value: limits?.maxConcurrentChats, expected: expectedDefaults.maxConcurrentChats },
          { name: 'Max Chat History (Days)', value: limits?.maxChatHistoryDays, expected: expectedDefaults.maxChatHistoryDays }
        ]
      },
      {
        name: 'Subscription Limits',
        tests: [
          { name: 'Max Free Users', value: limits?.maxFreeUsers, expected: expectedDefaults.maxFreeUsers },
          { name: 'Max Free Chatbots', value: limits?.maxFreeChatbots, expected: expectedDefaults.maxFreeChatbots },
          { name: 'Max Pro Users', value: limits?.maxProUsers, expected: expectedDefaults.maxProUsers },
          { name: 'Max Pro Chatbots', value: limits?.maxProChatbots, expected: expectedDefaults.maxProChatbots }
        ]
      },
      {
        name: 'Company Selection Options',
        tests: [
          { name: 'Default Company Plan', value: limits?.defaultCompanyPlan, expected: expectedDefaults.defaultCompanyPlan },
          { name: 'Company Approval Required', value: limits?.companyApprovalRequired, expected: expectedDefaults.companyApprovalRequired },
          { name: 'Max Company Name Length', value: limits?.maxCompanyNameLength, expected: expectedDefaults.maxCompanyNameLength },
          { name: 'Max Company Description Length', value: limits?.maxCompanyDescriptionLength, expected: expectedDefaults.maxCompanyDescriptionLength }
        ]
      }
    ]

    let allPassed = true
    const results = []

    for (const category of categories) {
      for (const test of category.tests) {
        const passed = test.value === test.expected
        if (!passed) allPassed = false
        
        results.push({
          category: category.name,
          name: test.name,
          current: test.value,
          expected: test.expected,
          passed
        })
      }
    }

    // Show results
    if (allPassed) {
      toast({
        title: "✅ All Tests Passed",
        description: "All limits and quotas are correctly configured",
      })
    } else {
      toast({
        title: "❌ Some Tests Failed",
        description: "Some limits and quotas need attention",
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
        body: JSON.stringify(expectedDefaults)
      })

      if (response.ok) {
        await loadLimits()
        toast({
          title: "✅ Reset Successful",
          description: "Limits and quotas reset to defaults",
        })
      } else {
        throw new Error('Failed to reset limits')
      }
    } catch (error) {
      console.error('Error resetting limits:', error)
      toast({
        title: "Error",
        description: "Failed to reset limits and quotas",
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
            <span>Limits and Quotas Test</span>
          </CardTitle>
          <CardDescription>Testing platform limits and quotas</CardDescription>
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
          <span>Limits and Quotas Test</span>
        </CardTitle>
        <CardDescription>Testing platform limits and quotas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Company Limits */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Company Limits</span>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Users per Company</span>
                <Badge variant={limits?.maxUsersPerCompany === expectedDefaults.maxUsersPerCompany ? "default" : "secondary"}>
                  {limits?.maxUsersPerCompany || 'Not set'}
                </Badge>
              </div>
              {limits?.maxUsersPerCompany === expectedDefaults.maxUsersPerCompany ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Chatbots per Company</span>
                <Badge variant={limits?.maxChatbotsPerCompany === expectedDefaults.maxChatbotsPerCompany ? "default" : "secondary"}>
                  {limits?.maxChatbotsPerCompany || 'Not set'}
                </Badge>
              </div>
              {limits?.maxChatbotsPerCompany === expectedDefaults.maxChatbotsPerCompany ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Companies</span>
                <Badge variant={limits?.maxCompanies === expectedDefaults.maxCompanies ? "default" : "secondary"}>
                  {limits?.maxCompanies || 'Not set'}
                </Badge>
              </div>
              {limits?.maxCompanies === expectedDefaults.maxCompanies ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Teams per Company</span>
                <Badge variant={limits?.maxTeamsPerCompany === expectedDefaults.maxTeamsPerCompany ? "default" : "secondary"}>
                  {limits?.maxTeamsPerCompany || 'Not set'}
                </Badge>
              </div>
              {limits?.maxTeamsPerCompany === expectedDefaults.maxTeamsPerCompany ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* Storage Limits */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Cloud className="h-4 w-4" />
            <span>Storage Limits</span>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Storage per Company (GB)</span>
                <Badge variant={limits?.maxStoragePerCompany === expectedDefaults.maxStoragePerCompany ? "default" : "secondary"}>
                  {limits?.maxStoragePerCompany || 'Not set'}
                </Badge>
              </div>
              {limits?.maxStoragePerCompany === expectedDefaults.maxStoragePerCompany ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max File Size per Upload (MB)</span>
                <Badge variant={limits?.maxFileSizePerUpload === expectedDefaults.maxFileSizePerUpload ? "default" : "secondary"}>
                  {limits?.maxFileSizePerUpload || 'Not set'}
                </Badge>
              </div>
              {limits?.maxFileSizePerUpload === expectedDefaults.maxFileSizePerUpload ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Files per Upload</span>
                <Badge variant={limits?.maxFilesPerUpload === expectedDefaults.maxFilesPerUpload ? "default" : "secondary"}>
                  {limits?.maxFilesPerUpload || 'Not set'}
                </Badge>
              </div>
              {limits?.maxFilesPerUpload === expectedDefaults.maxFilesPerUpload ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Backup Retention (Days)</span>
                <Badge variant={limits?.maxBackupRetention === expectedDefaults.maxBackupRetention ? "default" : "secondary"}>
                  {limits?.maxBackupRetention || 'Not set'}
                </Badge>
              </div>
              {limits?.maxBackupRetention === expectedDefaults.maxBackupRetention ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* API Limits */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>API Limits</span>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max API Requests per Minute</span>
                <Badge variant={limits?.maxApiRequestsPerMinute === expectedDefaults.maxApiRequestsPerMinute ? "default" : "secondary"}>
                  {limits?.maxApiRequestsPerMinute || 'Not set'}
                </Badge>
              </div>
              {limits?.maxApiRequestsPerMinute === expectedDefaults.maxApiRequestsPerMinute ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max API Requests per Hour</span>
                <Badge variant={limits?.maxApiRequestsPerHour === expectedDefaults.maxApiRequestsPerHour ? "default" : "secondary"}>
                  {limits?.maxApiRequestsPerHour || 'Not set'}
                </Badge>
              </div>
              {limits?.maxApiRequestsPerHour === expectedDefaults.maxApiRequestsPerHour ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Concurrent Chats</span>
                <Badge variant={limits?.maxConcurrentChats === expectedDefaults.maxConcurrentChats ? "default" : "secondary"}>
                  {limits?.maxConcurrentChats || 'Not set'}
                </Badge>
              </div>
              {limits?.maxConcurrentChats === expectedDefaults.maxConcurrentChats ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Chat History (Days)</span>
                <Badge variant={limits?.maxChatHistoryDays === expectedDefaults.maxChatHistoryDays ? "default" : "secondary"}>
                  {limits?.maxChatHistoryDays || 'Not set'}
                </Badge>
              </div>
              {limits?.maxChatHistoryDays === expectedDefaults.maxChatHistoryDays ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* Subscription Limits */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Subscription Limits</span>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Free Users</span>
                <Badge variant={limits?.maxFreeUsers === expectedDefaults.maxFreeUsers ? "default" : "secondary"}>
                  {limits?.maxFreeUsers || 'Not set'}
                </Badge>
              </div>
              {limits?.maxFreeUsers === expectedDefaults.maxFreeUsers ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Free Chatbots</span>
                <Badge variant={limits?.maxFreeChatbots === expectedDefaults.maxFreeChatbots ? "default" : "secondary"}>
                  {limits?.maxFreeChatbots || 'Not set'}
                </Badge>
              </div>
              {limits?.maxFreeChatbots === expectedDefaults.maxFreeChatbots ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Pro Users</span>
                <Badge variant={limits?.maxProUsers === expectedDefaults.maxProUsers ? "default" : "secondary"}>
                  {limits?.maxProUsers || 'Not set'}
                </Badge>
              </div>
              {limits?.maxProUsers === expectedDefaults.maxProUsers ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Pro Chatbots</span>
                <Badge variant={limits?.maxProChatbots === expectedDefaults.maxProChatbots ? "default" : "secondary"}>
                  {limits?.maxProChatbots || 'Not set'}
                </Badge>
              </div>
              {limits?.maxProChatbots === expectedDefaults.maxProChatbots ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* Company Selection Options */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Company Selection Options</span>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Default Company Plan</span>
                <Badge variant={limits?.defaultCompanyPlan === expectedDefaults.defaultCompanyPlan ? "default" : "secondary"}>
                  {limits?.defaultCompanyPlan || 'Not set'}
                </Badge>
              </div>
              {limits?.defaultCompanyPlan === expectedDefaults.defaultCompanyPlan ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Company Approval Required</span>
                <Badge variant={limits?.companyApprovalRequired === expectedDefaults.companyApprovalRequired ? "default" : "secondary"}>
                  {limits?.companyApprovalRequired ? 'Yes' : 'No'}
                </Badge>
              </div>
              {limits?.companyApprovalRequired === expectedDefaults.companyApprovalRequired ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Company Name Length</span>
                <Badge variant={limits?.maxCompanyNameLength === expectedDefaults.maxCompanyNameLength ? "default" : "secondary"}>
                  {limits?.maxCompanyNameLength || 'Not set'}
                </Badge>
              </div>
              {limits?.maxCompanyNameLength === expectedDefaults.maxCompanyNameLength ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Company Description Length</span>
                <Badge variant={limits?.maxCompanyDescriptionLength === expectedDefaults.maxCompanyDescriptionLength ? "default" : "secondary"}>
                  {limits?.maxCompanyDescriptionLength || 'Not set'}
                </Badge>
              </div>
              {limits?.maxCompanyDescriptionLength === expectedDefaults.maxCompanyDescriptionLength ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button 
            onClick={testLimits} 
            disabled={testing}
            variant="outline"
          >
            {testing ? 'Testing...' : 'Test Limits'}
          </Button>
          <Button 
            onClick={resetToDefaults} 
            disabled={testing}
            variant="outline"
          >
            {testing ? 'Resetting...' : 'Reset to Defaults'}
          </Button>
          <Button 
            onClick={loadLimits} 
            disabled={testing}
            variant="outline"
          >
            Refresh
          </Button>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Limits and Quotas Summary</h4>
          <div className="grid gap-2 text-sm">
            <div>🏢 Company Limits: Users, Chatbots, Companies, Teams</div>
            <div>💾 Storage Limits: Storage, File Size, Files, Backups</div>
            <div>⚡ API Limits: Requests, Chats, History</div>
            <div>💳 Subscription Limits: Free/Pro Users & Chatbots</div>
            <div>👥 Company Selection: Plans, Approval, Name/Description Lengths</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 