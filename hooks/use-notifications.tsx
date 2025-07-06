"use client"

import { useState, useEffect } from "react"
import { getUserNotifications, createNotification, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, clearAllNotifications } from "@/lib/firebase"
import { notificationService } from "@/lib/notifications"
import { onSnapshot, query, collection, where, orderBy, limit } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { registerBackgroundRefresh, unregisterBackgroundRefresh } from "@/lib/background-refresh"

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      setLoading(false)
      return
    }

    // Set up real-time listener for notifications
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(20)
    )

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const userNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setNotifications(userNotifications)
      updateUnreadCount(userNotifications)
      setLoading(false)
    }, (error) => {
      console.error("Error listening to notifications:", error)
      setLoading(false)
    })

    // Set up background refresh every 30 seconds
    registerBackgroundRefresh('notifications', refreshNotifications, 30000)

    return () => {
      unsubscribe()
      unregisterBackgroundRefresh('notifications')
    }
  }, [])

  const updateUnreadCount = (notifications: any[]) => {
    const unread = notifications.filter((n) => !n.isRead).length
    setUnreadCount(unread)
  }

  const createNewNotification = async (data: any) => {
    try {
      const notificationId = await createNotification(data)
      // Reload notifications to get the updated list
      const userNotifications = await getUserNotifications()
      setNotifications(userNotifications)
      updateUnreadCount(userNotifications)
      return notificationId
    } catch (error) {
      console.error("Error creating notification:", error)
      throw error
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      // Update local state
      const updatedNotifications = notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
      setNotifications(updatedNotifications)
      updateUnreadCount(updatedNotifications)
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const updatedCount = await markAllNotificationsAsRead()
      console.log(`Marked ${updatedCount} notifications as read`)
      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      throw error
    }
  }

  const deleteNotificationById = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId)
      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error("Error deleting notification:", error)
      throw error
    }
  }

  const clearAllNotificationsHandler = async () => {
    try {
      const deletedCount = await clearAllNotifications()
      console.log(`Deleted ${deletedCount} notifications`)
      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error("Error clearing all notifications:", error)
      throw error
    }
  }

  // Convenience methods using the notification service
  const showSuccess = (title: string, message: string, options?: any) => {
    return notificationService.success(title, message, options)
  }

  const showError = (title: string, message: string, options?: any) => {
    return notificationService.error(title, message, options)
  }

  const showWarning = (title: string, message: string, options?: any) => {
    return notificationService.warning(title, message, options)
  }

  const showInfo = (title: string, message: string, options?: any) => {
    return notificationService.info(title, message, options)
  }

  const showChatbotNotification = (title: string, message: string, options?: any) => {
    return notificationService.chatbot(title, message, options)
  }

  const showSubscriptionNotification = (title: string, message: string, options?: any) => {
    return notificationService.subscription(title, message, options)
  }

  const showSystemNotification = (title: string, message: string, options?: any) => {
    return notificationService.system(title, message, options)
  }

  const refreshNotifications = async () => {
    try {
      setLoading(true)
      const userNotifications = await getUserNotifications()
      setNotifications(userNotifications)
      updateUnreadCount(userNotifications)
    } catch (error) {
      console.error("Error refreshing notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    notifications,
    loading,
    unreadCount,
    createNotification: createNewNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotificationById,
    clearAllNotifications: clearAllNotificationsHandler,
    refreshNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showChatbotNotification,
    showSubscriptionNotification,
    showSystemNotification,
  }
} 