# Notification System Documentation

## Overview

The notification system provides a comprehensive way to display and manage notifications throughout the application. It includes both toast notifications (temporary) and persistent notifications stored in the database.

## Features

### 🎯 Core Features
- **Toast Notifications**: Temporary notifications that appear and auto-dismiss
- **Persistent Notifications**: Stored in Firebase database with read/unread status
- **Notification Bell**: Shows unread count and dropdown with recent notifications
- **Notification Page**: Full page to view and manage all notifications
- **Multiple Types**: Success, Error, Warning, Info, Chatbot, Subscription, System
- **Action Buttons**: Navigate to relevant pages from notifications
- **Filtering**: Filter by type and read status
- **Real-time Updates**: Notifications update in real-time

### 🎨 Visual Features
- **Color-coded Types**: Each notification type has distinct colors and icons
- **Unread Indicators**: Visual indicators for unread notifications
- **Time Stamps**: Shows relative time (e.g., "2m ago", "1h ago")
- **Responsive Design**: Works on all screen sizes
- **Dark/Light Theme Support**: Adapts to current theme

## Components

### 1. Notification Service (`lib/notifications.ts`)
The core service that handles creating and displaying notifications.

```typescript
import { notificationService } from "@/lib/notifications"

// Create a success notification
await notificationService.success("Title", "Message", {
  actionUrl: "/dashboard/chatbots",
  actionText: "View Chatbots"
})

// Create an error notification
await notificationService.error("Error", "Something went wrong")

// Create a warning notification
await notificationService.warning("Warning", "Please check your settings")
```

### 2. Notification Bell (`components/ui/notification-bell.tsx`)
Shows unread count and dropdown with recent notifications.

```typescript
import { NotificationBell } from "@/components/ui/notification-bell"

// Use in header
<NotificationBell />
```

### 3. Notifications Hook (`hooks/use-notifications.tsx`)
Provides easy access to notification functionality.

```typescript
import { useNotifications } from "@/hooks/use-notifications"

const { 
  notifications, 
  loading, 
  unreadCount,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  markAsRead,
  deleteNotification
} = useNotifications()
```

### 4. Notifications Page (`app/dashboard/notifications/page.tsx`)
Full page to view and manage all notifications with filtering.




## Usage Examples

### Basic Toast Notification
```typescript
import { toast } from "@/hooks/use-toast"

toast({
  title: "Success!",
  description: "Your action was completed successfully.",
  variant: "default" // or "destructive"
})
```

### Using the Notification Service
```typescript
import { notificationService } from "@/lib/notifications"

// Success notification with action
await notificationService.success(
  "Chatbot Deployed", 
  "Your chatbot is now live and ready to use.",
  {
    actionUrl: "/dashboard/chatbots",
    actionText: "View Chatbots"
  }
)

// Error notification
await notificationService.error(
  "Connection Failed",
  "Unable to connect to the service. Please try again."
)

// Warning notification
await notificationService.warning(
  "Subscription Expiring",
  "Your subscription will expire in 3 days."
)
```

### Using the Hook
```typescript
import { useNotifications } from "@/hooks/use-notifications"

function MyComponent() {
  const { 
    showSuccess, 
    showError, 
    notifications, 
    unreadCount 
  } = useNotifications()

  const handleSuccess = () => {
    showSuccess("Success!", "Operation completed successfully")
  }

  const handleError = () => {
    showError("Error!", "Something went wrong")
  }

  return (
    <div>
      <p>Unread notifications: {unreadCount}</p>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  )
}
```

## Notification Types

### 1. Success
- **Color**: Green
- **Icon**: CheckCircle
- **Use Case**: Successful operations, completions
- **Priority**: Medium

### 2. Error
- **Color**: Red
- **Icon**: AlertCircle
- **Use Case**: Errors, failures, exceptions
- **Priority**: High

### 3. Warning
- **Color**: Yellow
- **Icon**: AlertTriangle
- **Use Case**: Warnings, expiring subscriptions, issues
- **Priority**: Medium

### 4. Info
- **Color**: Blue
- **Icon**: Info
- **Use Case**: General information, updates
- **Priority**: Low

### 5. Chatbot
- **Color**: Purple
- **Icon**: Bot
- **Use Case**: Chatbot-related notifications
- **Priority**: Medium

### 6. Subscription
- **Color**: Orange
- **Icon**: CreditCard
- **Use Case**: Billing, subscription changes
- **Priority**: High

### 7. System
- **Color**: Gray
- **Icon**: Settings
- **Use Case**: System maintenance, updates
- **Priority**: Urgent

## Database Schema

Notifications are stored in Firebase with the following structure:

```typescript
interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  priority?: NotificationPriority
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
  isRead: boolean
  createdAt: string
  expiresAt?: string
}
```

## Integration Points

### 1. App Header
The notification bell is integrated into the app header to provide quick access to notifications.

### 2. Sidebar Navigation
A "Notifications" menu item is added to the sidebar for easy access to the notifications page.

### 3. Toast System
Notifications automatically show as toast notifications when created.

### 4. Firebase Integration
Notifications are stored in Firebase and can be accessed across the application.

## Best Practices

### 1. Use Appropriate Types
- Use `success` for completed actions
- Use `error` for actual errors
- Use `warning` for potential issues
- Use `info` for general updates

### 2. Provide Action URLs
When possible, include action URLs to help users navigate to relevant pages.

### 3. Keep Messages Concise
Notifications should be brief but informative.

### 4. Use Priority Appropriately
- `urgent`: System-critical issues
- `high`: Important user-facing issues
- `medium`: Normal operations
- `low`: Informational updates

### 5. Handle Errors Gracefully
Always wrap notification creation in try-catch blocks.

## Future Enhancements

### Planned Features
- [ ] Push notifications
- [ ] Email notifications
- [ ] Notification preferences
- [ ] Bulk actions (mark all as read, delete all)
- [ ] Notification templates
- [ ] Scheduled notifications
- [ ] Notification analytics

### Technical Improvements
- [ ] Real-time updates with Firebase listeners
- [ ] Notification sound effects
- [ ] Desktop notifications
- [ ] Notification grouping
- [ ] Advanced filtering options

## Troubleshooting

### Common Issues

1. **Notifications not showing**
   - Check if the Toaster component is included in the layout
   - Verify Firebase connection
   - Check console for errors

2. **Toast not appearing**
   - Ensure the toast function is imported correctly
   - Check if the notification service is working
   - Verify the toast configuration

3. **Unread count not updating**
   - Check the useNotifications hook implementation
   - Verify the notification data structure
   - Check for state update issues

### Debug Tips

1. Use the notification demo to test different types
2. Check the browser console for errors
3. Verify Firebase rules allow notification operations
4. Test with different user accounts

## API Reference

### NotificationService Methods

```typescript
// Create notifications
await notificationService.success(title, message, options?)
await notificationService.error(title, message, options?)
await notificationService.warning(title, message, options?)
await notificationService.info(title, message, options?)
await notificationService.chatbot(title, message, options?)
await notificationService.subscription(title, message, options?)
await notificationService.system(title, message, options?)

// Create custom notification
await notificationService.createNotification({
  title: string,
  message: string,
  type: NotificationType,
  priority?: NotificationPriority,
  actionUrl?: string,
  actionText?: string,
  metadata?: Record<string, any>,
  expiresAt?: Date
})
```

### useNotifications Hook

```typescript
const {
  notifications,        // Array of all notifications
  loading,            // Loading state
  unreadCount,        // Number of unread notifications
  createNotification,  // Create new notification
  markAsRead,         // Mark notification as read
  markAllAsRead,      // Mark all notifications as read
  deleteNotification,  // Delete notification
  clearAllNotifications, // Clear all notifications
  showSuccess,        // Show success notification
  showError,          // Show error notification
  showWarning,        // Show warning notification
  showInfo,           // Show info notification
  showChatbotNotification, // Show chatbot notification
  showSubscriptionNotification, // Show subscription notification
  showSystemNotification, // Show system notification
} = useNotifications()
```

This notification system provides a robust, user-friendly way to communicate with users throughout the application while maintaining a clean and organized codebase. 