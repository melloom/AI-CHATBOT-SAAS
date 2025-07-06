import { toast } from "@/hooks/use-toast"
import { createNotification, createNotificationForUser } from "./firebase"

export type NotificationType = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'chatbot' 
  | 'subscription' 
  | 'system'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface NotificationData {
  title: string
  message: string
  type: NotificationType
  priority?: NotificationPriority
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
  expiresAt?: Date
  isRead?: boolean
}

export interface NotificationToast {
  id: string
  title: string
  description: string
  variant?: 'default' | 'destructive'
  action?: {
    label: string
    onClick: () => void
  }
}

class NotificationService {
  private static instance: NotificationService

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async createNotification(data: NotificationData): Promise<string> {
    try {
      const notificationId = await createNotification({
        ...data,
        isRead: false,
        createdAt: new Date().toISOString()
      })

      // Show toast notification
      this.showToast({
        id: notificationId,
        title: data.title,
        description: data.message,
        variant: this.getToastVariant(data.type),
        action: data.actionText && data.actionUrl ? {
          label: data.actionText,
          onClick: () => {
            if (data.actionUrl) {
              window.location.href = data.actionUrl
            }
          }
        } : undefined
      })

      return notificationId
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  private getToastVariant(type: NotificationType): 'default' | 'destructive' {
    switch (type) {
      case 'error':
        return 'destructive'
      case 'warning':
        return 'destructive'
      default:
        return 'default'
    }
  }

  private showToast(toastData: NotificationToast) {
    toast({
      title: toastData.title,
      description: toastData.description,
      variant: toastData.variant,
    })
  }

  // Convenience methods for different notification types
  async success(title: string, message: string, options?: Partial<NotificationData>) {
    return this.createNotification({
      title,
      message,
      type: 'success',
      priority: 'medium',
      ...options
    })
  }

  async error(title: string, message: string, options?: Partial<NotificationData>) {
    return this.createNotification({
      title,
      message,
      type: 'error',
      priority: 'high',
      ...options
    })
  }

  async warning(title: string, message: string, options?: Partial<NotificationData>) {
    return this.createNotification({
      title,
      message,
      type: 'warning',
      priority: 'medium',
      ...options
    })
  }

  async info(title: string, message: string, options?: Partial<NotificationData>) {
    return this.createNotification({
      title,
      message,
      type: 'info',
      priority: 'low',
      ...options
    })
  }

  async chatbot(title: string, message: string, options?: Partial<NotificationData>) {
    return this.createNotification({
      title,
      message,
      type: 'chatbot',
      priority: 'medium',
      ...options
    })
  }

  async subscription(title: string, message: string, options?: Partial<NotificationData>) {
    return this.createNotification({
      title,
      message,
      type: 'subscription',
      priority: 'high',
      ...options
    })
  }

  async system(title: string, message: string, options?: Partial<NotificationData>) {
    return this.createNotification({
      title,
      message,
      type: 'system',
      priority: 'urgent',
      ...options
    })
  }

  async createNotificationForUser(userId: string, data: NotificationData): Promise<string> {
    try {
      const notificationId = await createNotificationForUser(userId, {
        ...data,
        isRead: false,
        createdAt: new Date().toISOString()
      })

      return notificationId
    } catch (error) {
      console.error('Error creating notification for user:', error)
      throw error
    }
  }
}

export const notificationService = NotificationService.getInstance() 