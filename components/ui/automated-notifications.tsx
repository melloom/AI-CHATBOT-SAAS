"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { notificationService } from "@/lib/notifications"
import { automatedNotificationService } from "@/lib/automated-notifications"
import { useToast } from "@/hooks/use-toast"
import { 
  CreditCard, 
  Bot, 
  Settings, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  Bell,
  Users,
  Shield
} from "lucide-react"

interface AutomatedNotification {
  id: string
  title: string
  description: string
  type: 'subscription' | 'system' | 'chatbot' | 'warning' | 'success'
  enabled: boolean
  trigger: string
  message: string
  actionUrl?: string
  actionText?: string
}

const automatedNotifications: AutomatedNotification[] = [
  {
    id: 'subscription-purchased',
    title: 'Subscription Purchased',
    description: 'Notify when a company purchases a subscription',
    type: 'subscription',
    enabled: true,
    trigger: 'subscription_purchased',
    message: 'Welcome to our premium plan! Your subscription has been activated successfully.',
    actionUrl: '/dashboard/billing',
    actionText: 'View Billing'
  },
  {
    id: 'subscription-renewed',
    title: 'Subscription Renewed',
    description: 'Notify when a subscription is renewed',
    type: 'subscription',
    enabled: true,
    trigger: 'subscription_renewed',
    message: 'Your subscription has been renewed successfully. Thank you for your continued support!',
    actionUrl: '/dashboard/billing',
    actionText: 'View Billing'
  },
  {
    id: 'subscription-expiring',
    title: 'Subscription Expiring',
    description: 'Notify when a subscription is about to expire',
    type: 'warning',
    enabled: true,
    trigger: 'subscription_expiring',
    message: 'Your subscription will expire in 3 days. Renew now to avoid service interruption.',
    actionUrl: '/dashboard/billing',
    actionText: 'Renew Now'
  },
  {
    id: 'subscription-cancelled',
    title: 'Subscription Cancelled',
    description: 'Notify when a subscription is cancelled',
    type: 'warning',
    enabled: true,
    trigger: 'subscription_cancelled',
    message: 'Your subscription has been cancelled. You can reactivate it anytime.',
    actionUrl: '/dashboard/billing',
    actionText: 'Reactivate'
  },
  {
    id: 'chatbot-deployed',
    title: 'Chatbot Deployed',
    description: 'Notify when a chatbot is successfully deployed',
    type: 'success',
    enabled: true,
    trigger: 'chatbot_deployed',
    message: 'Your chatbot has been successfully deployed and is now live!',
    actionUrl: '/dashboard/chatbots',
    actionText: 'View Chatbots'
  },
  {
    id: 'chatbot-error',
    title: 'Chatbot Error',
    description: 'Notify when there are chatbot deployment errors',
    type: 'warning',
    enabled: true,
    trigger: 'chatbot_error',
    message: 'There was an issue deploying your chatbot. Please check the settings.',
    actionUrl: '/dashboard/chatbots',
    actionText: 'Fix Issues'
  },
  {
    id: 'system-maintenance',
    title: 'System Maintenance',
    description: 'Notify about scheduled system maintenance',
    type: 'system',
    enabled: true,
    trigger: 'system_maintenance',
    message: 'Scheduled maintenance will occur tonight at 2 AM. Service may be temporarily unavailable.',
    actionUrl: '/dashboard/settings/system-maintenance',
    actionText: 'Learn More'
  },
  {
    id: 'new-features',
    title: 'New Features Available',
    description: 'Notify about new platform features',
    type: 'success',
    enabled: true,
    trigger: 'new_features',
    message: 'We\'ve added new features to your dashboard. Check them out!',
    actionUrl: '/dashboard',
    actionText: 'Explore'
  },
  {
    id: 'security-alert',
    title: 'Security Alert',
    description: 'Notify about security-related events',
    type: 'warning',
    enabled: true,
    trigger: 'security_alert',
    message: 'We detected unusual activity on your account. Please review your security settings.',
    actionUrl: '/dashboard/settings/system-maintenance',
    actionText: 'Review Security'
  },
  {
    id: 'welcome-new-user',
    title: 'Welcome New User',
    description: 'Welcome notification for new users',
    type: 'success',
    enabled: true,
    trigger: 'welcome_new_user',
    message: 'Welcome to ChatHub! We\'re excited to have you on board.',
    actionUrl: '/dashboard',
    actionText: 'Get Started'
  }
]

export function AutomatedNotifications() {
  const [notifications, setNotifications] = useState<AutomatedNotification[]>(automatedNotifications)

  const { toast } = useToast()

  // Initialize notifications with service state
  useEffect(() => {
    setNotifications(prev => 
      prev.map(notification => ({
        ...notification,
        enabled: automatedNotificationService.isNotificationEnabled(notification.id)
      }))
    )
  }, [])

  const toggleNotification = (id: string) => {
    const newEnabled = !automatedNotificationService.isNotificationEnabled(id)
    
    if (newEnabled) {
      automatedNotificationService.enableNotification(id)
    } else {
      automatedNotificationService.disableNotification(id)
    }

    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, enabled: newEnabled }
          : notification
      )
    )
  }



  const getIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <CreditCard className="h-4 w-4 text-orange-500" />
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />
      case 'chatbot':
        return <Bot className="h-4 w-4 text-purple-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'subscription':
        return 'default'
      case 'system':
        return 'outline'
      case 'chatbot':
        return 'default'
      case 'warning':
        return 'secondary'
      case 'success':
        return 'default'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automated Notifications</h2>
          <p className="text-muted-foreground">
            Configure automatic notifications for important events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <Badge variant="outline">Automated</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(notification.type)}
                  <div>
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                    <CardDescription>{notification.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(notification.type)}>
                    {notification.type}
                  </Badge>
                  <Switch
                    checked={notification.enabled}
                    onCheckedChange={() => toggleNotification(notification.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Message:</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
                
                {notification.actionUrl && (
                  <div>
                    <Label className="text-sm font-medium">Action:</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.actionText} → {notification.actionUrl}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Trigger: <code className="bg-muted px-1 rounded">{notification.trigger}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={notification.enabled ? "default" : "secondary"}>
                      {notification.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Automated Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how automated notifications work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable All Automated Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Toggle all automated notifications on/off
                </p>
              </div>
              <Switch
                checked={notifications.every(n => n.enabled)}
                onCheckedChange={(checked) => {
                  setNotifications(prev => 
                    prev.map(n => ({ ...n, enabled: checked }))
                  )
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Send to All Companies</Label>
                <p className="text-xs text-muted-foreground">
                  Automated notifications will be sent to all companies
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Include Action Buttons</Label>
                <p className="text-xs text-muted-foreground">
                  Add action buttons to automated notifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 