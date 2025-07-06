"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notificationService } from "@/lib/notifications"
import { NotificationType } from "@/lib/notifications"
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Bot,
  CreditCard,
  Settings,
  Send,
  Users,
  Building,
  Globe
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getApprovedCompanies } from "@/lib/firebase"
import { AutomatedNotifications } from "@/components/ui/automated-notifications"

interface Company {
  id: string
  companyName: string
  email: string
  userId: string
  approvalStatus?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export default function AdminNotificationsPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "info" as NotificationType,
    actionUrl: "",
    actionText: "",
    sendToAll: false
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true)
  
        const approvedCompanies = await getApprovedCompanies()
  
        setCompanies(approvedCompanies as Company[])
      } catch (error) {
        console.error("Error loading companies:", error)
        toast({
          title: "Error",
          description: `Failed to load companies: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadCompanies()
  }, [toast])

  const handleSendNotification = async () => {
    if (!notificationData.title || !notificationData.message) {
      toast({
        title: "Error",
        description: "Please fill in title and message",
        variant: "destructive"
      })
      return
    }

    if (!notificationData.sendToAll && selectedCompanies.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one company or choose 'Send to All'",
        variant: "destructive"
      })
      return
    }

    setSending(true)
    try {
      const targetCompanies = notificationData.sendToAll ? companies : companies.filter(c => selectedCompanies.includes(c.id))

      
      let successCount = 0
      let errorCount = 0
      
      for (const company of targetCompanies) {
        try {
  
          await notificationService.createNotificationForUser(company.userId, {
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type,
            actionUrl: notificationData.actionUrl || undefined,
            actionText: notificationData.actionText || undefined,
            metadata: {
              sentByAdmin: true,
              targetCompanyId: company.id,
              targetCompanyName: company.companyName
            }
          })
          successCount++
        } catch (companyError) {
          console.error('Error sending notification:', { companyName: company.companyName, error: companyError })
          errorCount++
        }
      }

      if (errorCount === 0) {
        toast({
          title: "Success",
          description: `Notification sent to ${successCount} company${successCount !== 1 ? 'ies' : ''}`,
        })
      } else if (successCount > 0) {
        toast({
          title: "Partial Success",
          description: `Sent to ${successCount} companies, failed for ${errorCount} companies`,
        })
      } else {
        toast({
          title: "Error",
          description: `Failed to send to any companies. Check console for details.`,
          variant: "destructive"
        })
      }

      // Reset form
      setNotificationData({
        title: "",
        message: "",
        type: "info",
        actionUrl: "",
        actionText: "",
        sendToAll: false
      })
      setSelectedCompanies([])
    } catch (error) {
      console.error("Error sending notification:", error)
      toast({
        title: "Error",
        description: `Failed to send notification: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      })
    } finally {
      setSending(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedCompanies.length === companies.length) {
      setSelectedCompanies([])
    } else {
      setSelectedCompanies(companies.map(c => c.id))
    }
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'chatbot':
        return <Bot className="h-4 w-4 text-purple-500" />
      case 'subscription':
        return <CreditCard className="h-4 w-4 text-orange-500" />
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const notificationTypes: { value: NotificationType; label: string; icon: React.ReactNode }[] = [
    { value: 'success', label: 'Success', icon: <CheckCircle className="h-4 w-4" /> },
    { value: 'error', label: 'Error', icon: <AlertCircle className="h-4 w-4" /> },
    { value: 'warning', label: 'Warning', icon: <AlertTriangle className="h-4 w-4" /> },
    { value: 'info', label: 'Info', icon: <Info className="h-4 w-4" /> },
    { value: 'chatbot', label: 'Chatbot', icon: <Bot className="h-4 w-4" /> },
    { value: 'subscription', label: 'Subscription', icon: <CreditCard className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Settings className="h-4 w-4" /> },
  ]

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading companies...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Notifications</h1>
        <p className="text-muted-foreground">
          Send notifications to all companies or specific companies
        </p>
      </div>

      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {companies.length === 0 ? "No approved companies found" : "Approved companies from database"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selected Companies</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{selectedCompanies.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Send to All</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {notificationData.sendToAll ? "Yes" : "No"}
              </div>
            </CardContent>
          </Card>
        </div>



        <Tabs defaultValue="compose" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compose">Compose Notification</TabsTrigger>
              <TabsTrigger value="companies">Select Companies</TabsTrigger>
              <TabsTrigger value="automated">Automated Notifications</TabsTrigger>
            </TabsList>

          </div>

                      <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compose Notification</CardTitle>
                <CardDescription>
                  Create a notification to send to selected companies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter notification title"
                      value={notificationData.title}
                      onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={notificationData.type}
                      onValueChange={(value: NotificationType) => setNotificationData({ ...notificationData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              {type.icon}
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter notification message"
                    rows={4}
                    value={notificationData.message}
                    onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actionUrl">Action URL (Optional)</Label>
                    <Input
                      id="actionUrl"
                      placeholder="https://example.com"
                      value={notificationData.actionUrl}
                      onChange={(e) => setNotificationData({ ...notificationData, actionUrl: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actionText">Action Text (Optional)</Label>
                    <Input
                      id="actionText"
                      placeholder="Click here"
                      value={notificationData.actionText}
                      onChange={(e) => setNotificationData({ ...notificationData, actionText: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendToAll"
                    checked={notificationData.sendToAll}
                    onCheckedChange={(checked) => {
                      setNotificationData({ ...notificationData, sendToAll: checked as boolean })
                      if (checked) {
                        setSelectedCompanies([])
                      }
                    }}
                  />
                  <Label htmlFor="sendToAll">Send to all companies</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleSendNotification}
                    disabled={sending || (!notificationData.sendToAll && selectedCompanies.length === 0)}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? "Sending..." : "Send Notification"}
                  </Button>
                  <Badge variant="outline">
                    {notificationData.sendToAll 
                      ? `Will send to ${companies.length} companies`
                      : `Will send to ${selectedCompanies.length} selected companies`
                    }
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Companies</CardTitle>
                <CardDescription>
                  Choose which companies to send the notification to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="selectAll"
                      checked={selectedCompanies.length === companies.length && companies.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="selectAll">Select all companies</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Checkbox
                          id={company.id}
                          checked={selectedCompanies.includes(company.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCompanies([...selectedCompanies, company.id])
                            } else {
                              setSelectedCompanies(selectedCompanies.filter(id => id !== company.id))
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={company.id} className="text-sm font-medium cursor-pointer">
                            {company.companyName}
                          </Label>
                          <p className="text-xs text-muted-foreground">{company.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automated" className="space-y-4">
            <AutomatedNotifications />
          </TabsContent>
        </Tabs>

        {/* Quick Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Templates</CardTitle>
            <CardDescription>
              Use these templates to quickly send common notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  title: "System Maintenance",
                  message: "Scheduled maintenance tonight at 2 AM. Service may be temporarily unavailable.",
                  type: "system" as NotificationType,
                  actionUrl: "/dashboard/settings",
                  actionText: "Learn More"
                },
                {
                  title: "New Features Available",
                  message: "We've added new features to your dashboard. Check them out!",
                  type: "info" as NotificationType,
                  actionUrl: "/dashboard",
                  actionText: "Explore"
                },
                {
                  title: "Subscription Reminder",
                  message: "Your subscription will expire soon. Renew now to avoid interruption.",
                  type: "warning" as NotificationType,
                  actionUrl: "/dashboard/billing",
                  actionText: "Renew Now"
                }
              ].map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-start gap-2 text-left min-h-[80px] w-full"
                  onClick={() => setNotificationData({
                    ...notificationData,
                    title: template.title,
                    message: template.message,
                    type: template.type,
                    actionUrl: template.actionUrl,
                    actionText: template.actionText
                  })}
                >
                  <div className="flex items-center gap-2 w-full min-w-0">
                    {getNotificationIcon(template.type)}
                    <span className="font-medium text-sm truncate flex-1">{template.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left line-clamp-2 leading-tight w-full break-words">{template.message}</p>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 