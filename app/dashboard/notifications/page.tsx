"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications } from "@/hooks/use-notifications"
import { NotificationType } from "@/lib/notifications"
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Bell,
  Check,
  Trash2,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"


const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />
    default:
      return <Bell className="h-5 w-5 text-gray-500" />
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

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

export default function NotificationsPage() {
  const { notifications, loading } = useNotifications()
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all')

  const filteredNotifications = notifications?.filter((notification: any) => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'unread' && !notification.isRead) ||
      (selectedFilter === 'read' && notification.isRead)
    
    const matchesType = selectedType === 'all' || notification.type === selectedType
    
    return matchesFilter && matchesType
  }) || []

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0
  const readCount = notifications?.filter((n: any) => n.isRead).length || 0

  const handleNotificationClick = (notification: any) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  const markAsRead = (notificationId: string) => {
    // TODO: Implement mark as read functionality
    console.log('Mark as read:', notificationId)
  }

  const deleteNotification = (notificationId: string) => {
    // TODO: Implement delete notification functionality
    console.log('Delete notification:', notificationId)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with your latest activities and system messages
        </p>
      </div>



      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Read</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{readCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <div className="flex gap-1">
                  {(['all', 'unread', 'read'] as const).map((filter) => (
                    <Button
                      key={filter}
                      variant={selectedFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter(filter)}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Type:</span>
                <div className="flex gap-1">
                  {(['all', 'success', 'error', 'warning', 'info', 'chatbot', 'subscription', 'system'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            </CardTitle>
            <CardDescription>
              {selectedFilter !== 'all' && `Filtered by ${selectedFilter}`}
              {selectedType !== 'all' && ` and ${selectedType} type`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification: any) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 rounded-lg border transition-colors hover:bg-accent/50",
                      getNotificationVariant(notification.type),
                      !notification.isRead && "bg-accent/50 border-primary/20"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-foreground">
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <Badge variant="secondary" className="text-xs">
                                  New
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {notification.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              {notification.actionText && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-xs p-0 h-auto"
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  {notification.actionText}
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 