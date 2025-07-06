"use client"

import React, { useState, useEffect } from "react"
import { Bell, Check, X, AlertCircle, Info, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/hooks/use-notifications"
import { NotificationType } from "@/lib/notifications"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface NotificationItem {
  id: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string
  actionUrl?: string
  actionText?: string
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
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

const getNotificationVariant = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200'
    case 'error':
      return 'bg-red-50 border-red-200'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200'
    case 'info':
      return 'bg-blue-50 border-blue-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
}

export function NotificationBell() {
  const { notifications, loading, unreadCount, refreshNotifications, markAllAsRead, clearAllNotifications, markAsRead } = useNotifications()
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Check if there are any notifications from the last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const recentNotifications = notifications.filter((n: any) => 
        new Date(n.createdAt) > fiveMinutesAgo && !n.isRead
      )
      setHasNewNotifications(recentNotifications.length > 0)
      
      // Show toast for new notifications
      if (unreadCount > previousUnreadCount && previousUnreadCount > 0) {
        const newNotifications = notifications.filter((n: any) => 
          new Date(n.createdAt) > new Date(Date.now() - 10 * 1000) && !n.isRead
        )
        if (newNotifications.length > 0) {
          const latestNotification = newNotifications[0]
          toast({
            title: latestNotification.title,
            description: latestNotification.message,
            duration: 5000,
          })
        }
      }
      setPreviousUnreadCount(unreadCount)
    }
  }, [notifications, unreadCount, previousUnreadCount, toast])

  const handleNotificationClick = async (notification: any) => {
    // Mark notification as read
    if (!notification.isRead) {
      await markAsRead(notification.id)
    }

    // Determine the correct route based on notification type
    let targetUrl = notification.actionUrl

    // Fix routing for specific notification types
    if (notification.type === 'security-alert' || notification.type === 'warning') {
      // Security scan notifications should go to system maintenance
      if (notification.message?.toLowerCase().includes('security') || 
          notification.message?.toLowerCase().includes('scan')) {
        targetUrl = '/dashboard/settings/system-maintenance'
      }
    }

    // Handle navigation
    if (targetUrl) {
      try {
        const res = await fetch(targetUrl, { method: 'HEAD' })
        if (!res.ok) {
          toast({
            title: 'Notification Invalid',
            description: 'This notification is no longer valid or has been deleted.',
            variant: 'destructive',
          })
          return
        }
        window.location.assign(targetUrl)
      } catch (e) {
        toast({
          title: 'Navigation Error',
          description: 'Unable to navigate to the notification target.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleNotificationNavigation = async (url: string | undefined) => {
    if (!url) return
    try {
      const res = await fetch(url, { method: 'HEAD' })
      if (!res.ok) {
        toast({
          title: 'Notification Invalid',
          description: 'This notification is no longer valid or has been deleted.',
          variant: 'destructive',
        })
        return
      }
      window.location.assign(url)
    } catch (e) {
      toast({
        title: 'Notification Invalid',
        description: 'This notification is no longer valid or has been deleted.',
        variant: 'destructive',
      })
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={cn("h-5 w-5", hasNewNotifications && "text-blue-500")} />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          {hasNewNotifications && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 overflow-x-hidden">
        <div className="flex items-center justify-between px-2 py-1 border-b mb-2">
          <span className="font-semibold text-sm">Notifications</span>
          <div className="flex items-center gap-1">
            <button
              className="text-xs px-2 py-1 rounded hover:bg-accent disabled:opacity-50"
              onClick={async () => {
                await markAllAsRead()
                toast({ title: 'All notifications marked as read.' })
              }}
              disabled={notifications.length === 0}
              aria-label="Mark all as read"
              type="button"
            >
              Mark all as read
            </button>
            <button
              className="text-xs px-2 py-1 rounded hover:bg-destructive/10 text-destructive disabled:opacity-50"
              onClick={async () => {
                await clearAllNotifications()
                toast({ title: 'All notifications cleared.' })
              }}
              disabled={notifications.length === 0}
              aria-label="Clear all notifications"
              type="button"
            >
              Clear all
            </button>
            <button
              className="ml-1 text-xs px-2 py-1 rounded hover:bg-accent"
              onClick={refreshNotifications}
              aria-label="Refresh notifications"
              type="button"
            >
              ⟳
            </button>
          </div>
        </div>
        <ScrollArea className="h-80">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="p-2">
              {notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 rounded-lg border mb-2 cursor-pointer transition-colors hover:bg-accent w-full overflow-x-hidden group",
                    getNotificationVariant(notification.type),
                    !notification.isRead && "bg-accent/50"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                  tabIndex={0}
                  role="button"
                  aria-label={notification.title}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-foreground break-words break-all whitespace-pre-line w-full">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 break-words break-all whitespace-pre-line w-full">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {notification.actionText && notification.actionUrl && (
                          <span
                            className="text-xs text-primary hover:underline hover:text-blue-700 active:text-blue-900 cursor-pointer font-medium ml-2"
                            onClick={e => {
                              e.stopPropagation();
                              handleNotificationClick(notification)
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={notification.actionText}
                          >
                            {notification.actionText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          )}
        </ScrollArea>
        {notifications && notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 