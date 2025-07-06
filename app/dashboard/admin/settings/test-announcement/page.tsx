"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { SystemAnnouncement } from "@/components/ui/system-announcement"
import { AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react"

export default function TestAnnouncementPage() {
  const { toast } = useToast()
  const { profile } = useAuth()
  const [testAnnouncement, setTestAnnouncement] = useState({
    message: "This is a test announcement to verify the system is working correctly.",
    type: "info" as "info" | "success" | "warning" | "error",
    enabled: true
  })

  const [loading, setLoading] = useState(false)

  const handleTestAnnouncement = async () => {
    if (!profile?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can test announcements.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { auth } = await import('@/lib/firebase')
      const token = await auth.currentUser?.getIdToken()
      
      if (!token) {
        throw new Error('No authentication token available')
      }

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platformName: "ChatHub AI",
          systemAnnouncement: testAnnouncement.message,
          announcementEnabled: testAnnouncement.enabled,
          announcementType: testAnnouncement.type,
          announcementExpiry: null
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save test announcement')
      }

      toast({
        title: "Test Announcement Sent",
        description: "The test announcement has been saved and should appear to all users.",
      })

      // Refresh the page to show the announcement
      setTimeout(() => {
        window.location.reload()
      }, 1000)

    } catch (error) {
      console.error('Error testing announcement:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send test announcement.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  if (!profile?.isAdmin) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
          <h3 className="text-lg font-semibold">Access Denied</h3>
          <p className="text-muted-foreground">
            Only administrators can access this test page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Test System Announcement</h1>
          <p className="text-muted-foreground">
            Test the system announcement feature to ensure it works correctly.
          </p>
        </div>
      </div>

      {/* Current Announcement Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current Announcement Preview</CardTitle>
          <CardDescription>
            This is how the announcement will appear to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SystemAnnouncement />
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Announcement Settings</CardTitle>
          <CardDescription>
            Configure and send a test announcement to verify the system works
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Test Announcement</Label>
              <p className="text-sm text-muted-foreground">Show the test announcement to all users</p>
            </div>
            <Switch
              checked={testAnnouncement.enabled}
              onCheckedChange={(checked) => setTestAnnouncement({ ...testAnnouncement, enabled: checked })}
            />
          </div>
          
          {testAnnouncement.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="testMessage">Test Message</Label>
                <Textarea
                  id="testMessage"
                  value={testAnnouncement.message}
                  onChange={(e) => setTestAnnouncement({ ...testAnnouncement, message: e.target.value })}
                  placeholder="Enter test announcement message..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="testType">Announcement Type</Label>
                <Select 
                  value={testAnnouncement.type} 
                  onValueChange={(value: "info" | "success" | "warning" | "error") => 
                    setTestAnnouncement({ ...testAnnouncement, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon('info')}
                        <span>Info</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="success">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon('success')}
                        <span>Success</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="warning">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon('warning')}
                        <span>Warning</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="error">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon('error')}
                        <span>Error</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          <Button 
            onClick={handleTestAnnouncement} 
            disabled={loading || !testAnnouncement.enabled || !testAnnouncement.message.trim()}
            className="w-full"
          >
            {loading ? "Sending..." : "Send Test Announcement"}
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. Configure your test announcement above</p>
          <p>2. Click "Send Test Announcement" to save it</p>
          <p>3. The announcement will appear at the top of this page</p>
          <p>4. Navigate to other dashboard pages to see it everywhere</p>
          <p>5. Try dismissing the announcement to test the dismiss functionality</p>
          <p>6. Check that different announcement types have different colors</p>
        </CardContent>
      </Card>
    </div>
  )
} 