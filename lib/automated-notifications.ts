import { notificationService } from "./notifications"

export interface AutomatedNotificationTrigger {
  id: string
  title: string
  message: string
  type: 'subscription' | 'system' | 'chatbot' | 'warning' | 'success'
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
}

export class AutomatedNotificationService {
  private static instance: AutomatedNotificationService
  private enabledNotifications: Set<string> = new Set()

  private constructor() {
    // Initialize with default enabled notifications
    this.enabledNotifications.add('subscription-purchased')
    this.enabledNotifications.add('subscription-renewed')
    this.enabledNotifications.add('subscription-expiring')
    this.enabledNotifications.add('subscription-cancelled')
    this.enabledNotifications.add('chatbot-deployed')
    this.enabledNotifications.add('chatbot-error')
    this.enabledNotifications.add('welcome-new-user')
    this.enabledNotifications.add('new-pending-approval')
    this.enabledNotifications.add('company-approved')
    this.enabledNotifications.add('company-rejected')
    this.enabledNotifications.add('new-user-registration')
    this.enabledNotifications.add('system-alert')
  }

  static getInstance(): AutomatedNotificationService {
    if (!AutomatedNotificationService.instance) {
      AutomatedNotificationService.instance = new AutomatedNotificationService()
    }
    return AutomatedNotificationService.instance
  }

  // Enable/disable specific notification types
  enableNotification(notificationId: string): void {
    this.enabledNotifications.add(notificationId)
  }

  disableNotification(notificationId: string): void {
    this.enabledNotifications.delete(notificationId)
  }

  isNotificationEnabled(notificationId: string): boolean {
    return this.enabledNotifications.has(notificationId)
  }

  // Trigger automated notifications
  async triggerSubscriptionPurchased(userId: string, planName: string, amount: number): Promise<void> {
    if (!this.isNotificationEnabled('subscription-purchased')) return

    try {
      await notificationService.createNotificationForUser(userId, {
        title: 'Subscription Activated',
        message: `Welcome to our ${planName} plan! Your subscription has been activated successfully.`,
        type: 'subscription',
        actionUrl: '/dashboard/billing',
        actionText: 'View Billing',
        metadata: {
          automated: true,
          trigger: 'subscription_purchased',
          planName,
          amount
        }
      })
      console.log(`Automated notification sent: subscription-purchased to user ${userId}`)
    } catch (error) {
      console.error('Failed to send subscription purchased notification:', error)
    }
  }

  async triggerSubscriptionRenewed(userId: string, planName: string): Promise<void> {
    if (!this.isNotificationEnabled('subscription-renewed')) return

    try {
      await notificationService.createNotificationForUser(userId, {
        title: 'Subscription Renewed',
        message: `Your ${planName} subscription has been renewed successfully. Thank you for your continued support!`,
        type: 'subscription',
        actionUrl: '/dashboard/billing',
        actionText: 'View Billing',
        metadata: {
          automated: true,
          trigger: 'subscription_renewed',
          planName
        }
      })
      console.log(`Automated notification sent: subscription-renewed to user ${userId}`)
    } catch (error) {
      console.error('Failed to send subscription renewed notification:', error)
    }
  }

  async triggerSubscriptionExpiring(userId: string, planName: string, daysUntilExpiry: number): Promise<void> {
    if (!this.isNotificationEnabled('subscription-expiring')) return

    try {
      await notificationService.createNotificationForUser(userId, {
        title: 'Subscription Expiring Soon',
        message: `Your ${planName} subscription will expire in ${daysUntilExpiry} days. Renew now to avoid service interruption.`,
        type: 'warning',
        actionUrl: '/dashboard/billing',
        actionText: 'Renew Now',
        metadata: {
          automated: true,
          trigger: 'subscription_expiring',
          planName,
          daysUntilExpiry
        }
      })
      console.log(`Automated notification sent: subscription-expiring to user ${userId}`)
    } catch (error) {
      console.error('Failed to send subscription expiring notification:', error)
    }
  }

  async triggerSubscriptionCancelled(userId: string, planName: string): Promise<void> {
    if (!this.isNotificationEnabled('subscription-cancelled')) return

    try {
      await notificationService.createNotificationForUser(userId, {
        title: 'Subscription Cancelled',
        message: `Your ${planName} subscription has been cancelled. You can reactivate it anytime from your billing settings.`,
        type: 'warning',
        actionUrl: '/dashboard/billing',
        actionText: 'Reactivate',
        metadata: {
          automated: true,
          trigger: 'subscription_cancelled',
          planName
        }
      })
      console.log(`Automated notification sent: subscription-cancelled to user ${userId}`)
    } catch (error) {
      console.error('Failed to send subscription cancelled notification:', error)
    }
  }

  async triggerChatbotDeployed(userId: string, chatbotName: string): Promise<void> {
    if (!this.isNotificationEnabled('chatbot-deployed')) return

    try {
      await notificationService.createNotificationForUser(userId, {
        title: 'Chatbot Deployed Successfully',
        message: `Your chatbot "${chatbotName}" has been successfully deployed and is now live!`,
        type: 'success',
        actionUrl: '/dashboard/chatbots',
        actionText: 'View Chatbots',
        metadata: {
          automated: true,
          trigger: 'chatbot_deployed',
          chatbotName
        }
      })
      console.log(`Automated notification sent: chatbot-deployed to user ${userId}`)
    } catch (error) {
      console.error('Failed to send chatbot deployed notification:', error)
    }
  }

  async triggerChatbotError(userId: string, chatbotName: string, errorMessage: string): Promise<void> {
    if (!this.isNotificationEnabled('chatbot-error')) return

    try {
      await notificationService.createNotificationForUser(userId, {
        title: 'Chatbot Deployment Error',
        message: `There was an issue deploying your chatbot "${chatbotName}". Please check the settings and try again.`,
        type: 'warning',
        actionUrl: '/dashboard/chatbots',
        actionText: 'Fix Issues',
        metadata: {
          automated: true,
          trigger: 'chatbot_error',
          chatbotName,
          errorMessage
        }
      })
      console.log(`Automated notification sent: chatbot-error to user ${userId}`)
    } catch (error) {
      console.error('Failed to send chatbot error notification:', error)
    }
  }

  async triggerWelcomeNewUser(userId: string, companyName: string): Promise<void> {
    if (!this.isNotificationEnabled('welcome-new-user')) return

    try {
      await notificationService.createNotificationForUser(userId, {
        title: 'Welcome to ChatHub!',
        message: `Welcome ${companyName}! We're excited to have you on board. Get started by creating your first chatbot.`,
        type: 'success',
        actionUrl: '/dashboard/chatbots',
        actionText: 'Create Chatbot',
        metadata: {
          automated: true,
          trigger: 'welcome_new_user',
          companyName
        }
      })
      console.log(`Automated notification sent: welcome-new-user to user ${userId}`)
    } catch (error) {
      console.error('Failed to send welcome notification:', error)
    }
  }

  async triggerNewPendingApproval(adminUserId: string, companyName: string, companyEmail: string): Promise<void> {
    if (!this.isNotificationEnabled('new-pending-approval')) return

    try {
      await notificationService.createNotificationForUser(adminUserId, {
        title: 'New Company Approval Request',
        message: `${companyName} (${companyEmail}) has submitted an approval request and is waiting for review.`,
        type: 'info',
        actionUrl: '/dashboard/admin/approvals',
        actionText: 'Review Now',
        metadata: {
          automated: true,
          trigger: 'new_pending_approval',
          companyName,
          companyEmail
        }
      })
      console.log(`Automated notification sent: new-pending-approval to admin ${adminUserId}`)
    } catch (error) {
      console.error('Failed to send new pending approval notification:', error)
    }
  }

  async triggerCompanyApproved(companyUserId: string, companyName: string): Promise<void> {
    if (!this.isNotificationEnabled('company-approved')) return

    try {
      await notificationService.createNotificationForUser(companyUserId, {
        title: 'Company Approved!',
        message: `Congratulations! Your company "${companyName}" has been approved. You can now access all features.`,
        type: 'success',
        actionUrl: '/dashboard',
        actionText: 'Go to Dashboard',
        metadata: {
          automated: true,
          trigger: 'company_approved',
          companyName
        }
      })
      console.log(`Automated notification sent: company-approved to user ${companyUserId}`)
    } catch (error) {
      console.error('Failed to send company approved notification:', error)
    }
  }

  async triggerCompanyRejected(companyUserId: string, companyName: string, reason?: string): Promise<void> {
    if (!this.isNotificationEnabled('company-rejected')) return

    try {
      await notificationService.createNotificationForUser(companyUserId, {
        title: 'Company Application Status',
        message: `Your company "${companyName}" application has been reviewed. ${reason ? `Reason: ${reason}` : 'Please contact support for more information.'}`,
        type: 'warning',
        actionUrl: '/contact',
        actionText: 'Contact Support',
        metadata: {
          automated: true,
          trigger: 'company_rejected',
          companyName,
          reason
        }
      })
      console.log(`Automated notification sent: company-rejected to user ${companyUserId}`)
    } catch (error) {
      console.error('Failed to send company rejected notification:', error)
    }
  }

  async triggerNewUserRegistration(adminUserId: string, userEmail: string, companyName: string): Promise<void> {
    if (!this.isNotificationEnabled('new-user-registration')) return

    try {
      await notificationService.createNotificationForUser(adminUserId, {
        title: 'New User Registration',
        message: `A new user (${userEmail}) has registered for company "${companyName}".`,
        type: 'info',
        actionUrl: '/dashboard/admin/users',
        actionText: 'View Users',
        metadata: {
          automated: true,
          trigger: 'new_user_registration',
          userEmail,
          companyName
        }
      })
      console.log(`Automated notification sent: new-user-registration to admin ${adminUserId}`)
    } catch (error) {
      console.error('Failed to send new user registration notification:', error)
    }
  }

  async triggerSystemAlert(adminUserId: string, alertType: string, message: string): Promise<void> {
    if (!this.isNotificationEnabled('system-alert')) return

    try {
      await notificationService.createNotificationForUser(adminUserId, {
        title: `System Alert: ${alertType}`,
        message: message,
        type: 'warning',
        actionUrl: '/dashboard/admin/settings',
        actionText: 'View Settings',
        metadata: {
          automated: true,
          trigger: 'system_alert',
          alertType
        }
      })
      console.log(`Automated notification sent: system-alert to admin ${adminUserId}`)
    } catch (error) {
      console.error('Failed to send system alert notification:', error)
    }
  }

  async triggerSystemMaintenance(userId: string, maintenanceTime: string, duration: string): Promise<void> {
    if (!this.isNotificationEnabled('system-maintenance')) return

    try {
      await notificationService.createNotificationForUser(userId, {
        title: 'Scheduled System Maintenance',
        message: `Scheduled maintenance will occur ${maintenanceTime} for ${duration}. Service may be temporarily unavailable.`,
        type: 'system',
        actionUrl: '/dashboard/settings',
        actionText: 'Learn More',
        metadata: {
          automated: true,
          trigger: 'system_maintenance',
          maintenanceTime,
          duration
        }
      })
      console.log(`Automated notification sent: system-maintenance to user ${userId}`)
    } catch (error) {
      console.error('Failed to send system maintenance notification:', error)
    }
  }

  async triggerNewFeatures(userId: string, features: string[]): Promise<void> {
    if (!this.isNotificationEnabled('new-features')) return

    try {
      await notificationService.createNotificationForUser(userId, {
        title: 'New Features Available',
        message: `We've added new features to your dashboard: ${features.join(', ')}. Check them out!`,
        type: 'success',
        actionUrl: '/dashboard',
        actionText: 'Explore',
        metadata: {
          automated: true,
          trigger: 'new_features',
          features
        }
      })
      console.log(`Automated notification sent: new-features to user ${userId}`)
    } catch (error) {
      console.error('Failed to send new features notification:', error)
    }
  }

  async triggerSecurityAlert(userId: string, alertType: string): Promise<void> {
    if (!this.isNotificationEnabled('security-alert')) return

    try {
      await notificationService.createNotificationForUser(userId, {
        title: 'Security Alert',
        message: `We detected ${alertType} on your account. Please review your security settings immediately.`,
        type: 'warning',
        actionUrl: '/dashboard/settings',
        actionText: 'Review Security',
        metadata: {
          automated: true,
          trigger: 'security_alert',
          alertType
        }
      })
      console.log(`Automated notification sent: security-alert to user ${userId}`)
    } catch (error) {
      console.error('Failed to send security alert notification:', error)
    }
  }

  // Send to all users (admin function)
  async sendToAllUsers(notification: AutomatedNotificationTrigger): Promise<void> {
    try {
      await notificationService.createNotification({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        actionUrl: notification.actionUrl,
        actionText: notification.actionText,
        metadata: {
          ...notification.metadata,
          automated: true,
          sentToAll: true
        }
      })
      console.log('Automated notification sent to all users')
    } catch (error) {
      console.error('Failed to send notification to all users:', error)
      throw error
    }
  }

  // Get all enabled notification types
  getEnabledNotifications(): string[] {
    return Array.from(this.enabledNotifications)
  }

  // Get all available notification types
  getAllNotificationTypes(): string[] {
    return [
      'subscription-purchased',
      'subscription-renewed',
      'subscription-expiring',
      'subscription-cancelled',
      'chatbot-deployed',
      'chatbot-error',
      'welcome-new-user',
      'system-maintenance',
      'new-features',
      'security-alert'
    ]
  }
}

// Export singleton instance
export const automatedNotificationService = AutomatedNotificationService.getInstance() 