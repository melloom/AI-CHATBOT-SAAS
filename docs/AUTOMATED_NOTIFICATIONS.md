# Automated Notifications System

## Overview

The automated notifications system provides a comprehensive solution for sending automatic notifications to users based on various events in the application. It includes both manual admin controls and automated triggers for important business events.

## Features

### 1. Manual Admin Notifications
- **Compose Notifications**: Create and send custom notifications to specific companies or all companies
- **Company Selection**: Choose which companies to send notifications to
- **Quick Templates**: Pre-built templates for common notifications
- **Send to All Toggle**: Easy toggle between "Send to All" and "Send to Specific Companies"

### 2. Automated Notifications
- **Subscription Events**: Purchase, renewal, expiration, cancellation
- **Chatbot Events**: Deployment success, deployment errors
- **System Events**: Maintenance, new features, security alerts
- **Welcome Events**: New user onboarding

### 3. Admin Controls
- **Enable/Disable**: Toggle individual notification types on/off
- **Test Functionality**: Test notifications before deployment
- **Demo Environment**: Interactive demo page for testing scenarios

## Components

### Core Service
- `lib/automated-notifications.ts` - Main service for handling automated notifications
- `lib/notifications.ts` - Base notification service

### UI Components
- `components/ui/automated-notifications.tsx` - Admin interface for automated notifications
- `components/ui/notification-bell.tsx` - User notification bell component
- `app/dashboard/admin/notifications/page.tsx` - Main admin notifications page


## Usage

### For Admins

1. **Access Admin Notifications**:
   - Navigate to `/dashboard/admin/notifications`
   - Use the three tabs: Compose, Select Companies, Automated Notifications

2. **Send Manual Notifications**:
   - Fill in title, message, and type
   - Choose "Send to All" or select specific companies
   - Use the "Change to Yes/No" button for quick toggle
   - Click "Send Notification"

3. **Configure Automated Notifications**:
   - Go to the "Automated Notifications" tab
   - Toggle individual notification types on/off
   - Test notifications using the "Test" button
   - Configure global settings

4. **Demo and Testing**:
   - Click the "Demo" button to access the demo page
   - Test different scenarios with custom parameters
   - Verify notification delivery

### For Developers

1. **Trigger Automated Notifications**:
```typescript
import { automatedNotificationService } from "@/lib/automated-notifications"

// Subscription purchased
await automatedNotificationService.triggerSubscriptionPurchased(
  userId, 
  planName, 
  amount
)

// Chatbot deployed
await automatedNotificationService.triggerChatbotDeployed(
  userId, 
  chatbotName
)

// Welcome new user
await automatedNotificationService.triggerWelcomeNewUser(
  userId, 
  companyName
)
```

2. **Enable/Disable Notifications**:
```typescript
// Enable a notification type
automatedNotificationService.enableNotification('subscription-purchased')

// Disable a notification type
automatedNotificationService.disableNotification('subscription-cancelled')

// Check if enabled
const isEnabled = automatedNotificationService.isNotificationEnabled('chatbot-deployed')
```

3. **Send to All Users**:
```typescript
await automatedNotificationService.sendToAllUsers({
  id: 'custom-notification',
  title: 'Important Update',
  message: 'We have an important update for you.',
  type: 'info',
  actionUrl: '/dashboard',
  actionText: 'Learn More'
})
```

## Notification Types

### Manual Notifications
- `success` - Green, checkmark icon
- `error` - Red, alert icon
- `warning` - Yellow, triangle icon
- `info` - Blue, info icon
- `chatbot` - Purple, bot icon
- `subscription` - Orange, credit card icon
- `system` - Gray, settings icon

### Automated Notifications
- `subscription-purchased` - When user buys a subscription
- `subscription-renewed` - When subscription is renewed
- `subscription-expiring` - When subscription is about to expire
- `subscription-cancelled` - When subscription is cancelled
- `chatbot-deployed` - When chatbot is successfully deployed
- `chatbot-error` - When chatbot deployment fails
- `welcome-new-user` - When new user joins
- `system-maintenance` - Scheduled maintenance notifications
- `new-features` - New feature announcements
- `security-alert` - Security-related alerts

## Configuration

### Default Settings
- Most automated notifications are enabled by default
- Notifications include action buttons when appropriate
- All notifications are sent to all companies by default

### Customization
- Admins can enable/disable individual notification types
- Message content can be customized per notification type
- Action URLs and text can be modified
- Global settings control overall behavior

## Database Integration

The system integrates with Firebase Firestore:
- Notifications are stored in the `notifications` collection
- User-specific notifications are linked via `userId`
- Metadata includes trigger information and automation flags
- Real-time updates via Firebase listeners

## Security

- Only admins can send notifications to all users
- User-specific notifications are properly scoped
- Test notifications are clearly marked in metadata
- Error handling prevents notification spam

## Monitoring

- Console logging for all automated notifications
- Toast notifications for admin actions
- Error handling with user-friendly messages
- Debug information in development mode

## Future Enhancements

- Scheduled notifications
- Notification templates with variables
- A/B testing for notification content
- Analytics and engagement tracking
- Email integration for critical notifications
- Push notifications for mobile apps 