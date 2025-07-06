# Notification Settings Guide

## Overview

The Notification Settings module provides comprehensive configuration for all notification channels in your ChatHub AI SaaS platform. It includes email configuration, SMS integration, push notifications, in-app notifications, and detailed preference management with full Firebase integration.

## Features

### 📧 **Email Configuration**
- **SMTP Host**: Configure SMTP server (Gmail, SendGrid, etc.)
- **SMTP Port**: Set port number (587, 465, 25)
- **SMTP Username**: Email account username
- **SMTP Password**: Secure password storage with show/hide toggle
- **TLS Encryption**: Enable secure connection
- **From Email**: Configure sender email address
- **From Name**: Set sender display name
- **Test Configuration**: Validate email settings with test emails

### 🔔 **Notification Types**
- **Email Notifications**: Send notifications via email
- **SMS Notifications**: Send notifications via SMS
- **Push Notifications**: Send push notifications to devices
- **In-App Notifications**: Show notifications within the app

### 👥 **User Notifications**
- **New User Registration**: Notify when new users register
- **Password Reset**: Notify on password reset requests
- **Security Alerts**: Notify on security-related events
- **Maintenance Updates**: Notify about maintenance schedules
- **System Updates**: Notify about system updates

### 👨‍💼 **Admin Notifications**
- **New User Registration**: Notify admins of new registrations
- **Security Breach**: Notify admins of security issues
- **System Errors**: Notify admins of system errors
- **High Usage Alerts**: Notify admins of high system usage

### 📱 **SMS Configuration**
- **SMS Provider**: Support for Twilio, AWS SNS, Nexmo, Custom
- **API Key**: Secure API key storage
- **API Secret**: Secure secret storage
- **From Number**: Configure sender phone number

### 🔔 **Push Notification Configuration**
- **Server Key**: Firebase/OneSignal server key
- **App ID**: Application identifier
- **Secure Storage**: Encrypted credential management

### ⚙️ **Notification Preferences**
- **Notification Sound**: Play sound for notifications
- **Notification Vibration**: Vibrate for notifications
- **Notification Badge**: Show badge count for notifications
- **Quiet Hours**: Enable quiet hours with custom time ranges

## API Endpoints

### Get Notification Settings
```
GET /api/settings/notifications
```

**Response:**
```json
{
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "smtpUsername": "melvin.a.p.cruz@gmail.com",
  "smtpPassword": "",
  "smtpSecure": true,
  "fromEmail": "noreply@chathub.ai",
  "fromName": "ChatHub AI",
  "emailNotifications": true,
  "smsNotifications": false,
  "pushNotifications": true,
  "inAppNotifications": true,
  "notifyNewUserRegistration": true,
  "notifyPasswordReset": true,
  "notifySecurityAlerts": true,
  "notifyMaintenanceUpdates": true,
  "notifySystemUpdates": false,
  "notifyAdminNewUser": true,
  "notifyAdminSecurityBreach": true,
  "notifyAdminSystemErrors": true,
  "notifyAdminHighUsage": true,
  "smsProvider": "twilio",
  "smsApiKey": "",
  "smsApiSecret": "",
  "smsFromNumber": "",
  "pushNotificationServerKey": "",
  "pushNotificationAppId": "",
  "notificationSound": true,
  "notificationVibration": true,
  "notificationBadge": true,
  "quietHoursEnabled": false,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "08:00"
}
```

### Update Notification Settings
```
POST /api/settings/notifications
```

**Request Body:**
```json
{
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "smtpUsername": "melvin.a.p.cruz@gmail.com",
  "smtpPassword": "your-password",
  "smtpSecure": true,
  "fromEmail": "noreply@chathub.ai",
  "fromName": "ChatHub AI",
  "emailNotifications": true,
  "smsNotifications": false,
  "pushNotifications": true,
  "inAppNotifications": true,
  "notifyNewUserRegistration": true,
  "notifyPasswordReset": true,
  "notifySecurityAlerts": true,
  "notifyMaintenanceUpdates": true,
  "notifySystemUpdates": false,
  "notifyAdminNewUser": true,
  "notifyAdminSecurityBreach": true,
  "notifyAdminSystemErrors": true,
  "notifyAdminHighUsage": true,
  "smsProvider": "twilio",
  "smsApiKey": "your-api-key",
  "smsApiSecret": "your-api-secret",
  "smsFromNumber": "+1234567890",
  "pushNotificationServerKey": "your-server-key",
  "pushNotificationAppId": "your-app-id",
  "notificationSound": true,
  "notificationVibration": true,
  "notificationBadge": true,
  "quietHoursEnabled": false,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "08:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification settings updated successfully"
}
```

### Test Notification Email
```
POST /api/settings/test-notification-email
```

**Request Body:**
```json
{
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "smtpUsername": "melvin.a.p.cruz@gmail.com",
  "smtpPassword": "your-password",
  "smtpSecure": true,
  "fromEmail": "noreply@chathub.ai",
  "fromName": "ChatHub AI"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification email configuration test successful",
  "details": {
    "success": true,
    "message": "Test notification email sent successfully via smtp.gmail.com:587",
    "smtpHost": "smtp.gmail.com",
    "smtpPort": 587,
    "smtpUsername": "melvin.a.p.cruz@gmail.com",
    "smtpSecure": true,
    "fromEmail": "noreply@chathub.ai",
    "fromName": "ChatHub AI",
    "testEmailSent": true,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Validation Rules

### Email Configuration
- **SMTP Host**: Required, must be valid SMTP server
- **SMTP Port**: Required, must be between 1 and 65535
- **SMTP Username**: Required, non-empty string
- **SMTP Password**: Optional, but required for most providers
- **From Email**: Required, must be valid email format
- **From Name**: Required, non-empty string

### Notification Types
- **Email Notifications**: Boolean, enables email channel
- **SMS Notifications**: Boolean, enables SMS channel
- **Push Notifications**: Boolean, enables push notifications
- **In-App Notifications**: Boolean, enables in-app notifications

### User Notifications
- **New User Registration**: Boolean, notify on new registrations
- **Password Reset**: Boolean, notify on password resets
- **Security Alerts**: Boolean, notify on security events
- **Maintenance Updates**: Boolean, notify on maintenance
- **System Updates**: Boolean, notify on system updates

### Admin Notifications
- **New User Registration**: Boolean, notify admins of new users
- **Security Breach**: Boolean, notify admins of security issues
- **System Errors**: Boolean, notify admins of system errors
- **High Usage Alerts**: Boolean, notify admins of high usage

### SMS Configuration
- **SMS Provider**: Required if SMS enabled, must be from allowed list
- **API Key**: Required for most SMS providers
- **API Secret**: Required for most SMS providers
- **From Number**: Required for SMS, must be valid phone number

### Push Notification Configuration
- **Server Key**: Required for push notifications
- **App ID**: Required for push notifications

### Notification Preferences
- **Notification Sound**: Boolean, enable sound
- **Notification Vibration**: Boolean, enable vibration
- **Notification Badge**: Boolean, enable badge count
- **Quiet Hours**: Boolean, enable quiet hours
- **Quiet Hours Start**: Required if quiet hours enabled, HH:MM format
- **Quiet Hours End**: Required if quiet hours enabled, HH:MM format

## Components

### NotificationSettingsForm
Located at `components/settings/notification-settings-form.tsx`

Features:
- Complete notification configuration form
- Real-time validation with visual feedback
- Secure credential management with show/hide toggle
- Email configuration testing
- Admin-only access control
- Toast notifications for success/error states
- Auto-loading of existing settings
- Conditional rendering for SMS and push notification sections

### Notification Settings API
Located at `app/api/settings/notifications/route.ts`

Features:
- Comprehensive validation with Zod schemas
- Admin-only access control
- Audit logging for all changes
- Default settings fallback
- Error handling and detailed error messages

### Notification Email Test API
Located at `app/api/settings/test-notification-email/route.ts`

Features:
- SMTP configuration validation
- Email configuration testing
- Audit logging for test results
- Detailed error reporting

## Security Features

### Authentication & Authorization
- All settings operations require admin authentication
- JWT token validation
- Admin role verification
- Request validation with comprehensive rules

### Data Protection
- Secure credential storage with encryption
- Password field masking with show/hide toggle
- Input sanitization and validation
- Audit logging for all changes

### Error Handling
- Comprehensive error messages
- Validation error details
- User-friendly error notifications
- Secure error responses

## Best Practices

### Email Configuration
- Use reputable SMTP providers (Gmail, SendGrid, Mailgun)
- Always test email configuration before going live
- Use a professional from email address
- Keep SMTP credentials secure and rotate them regularly
- Enable TLS encryption for security

### SMS Configuration
- Use reliable SMS providers (Twilio, AWS SNS)
- Test SMS delivery before production
- Keep API keys secure
- Monitor SMS costs and usage

### Push Notifications
- Use Firebase or OneSignal for reliable delivery
- Test push notifications on multiple devices
- Keep server keys secure
- Monitor delivery rates

### Notification Preferences
- Set appropriate quiet hours for user experience
- Enable sound and vibration based on user preferences
- Use badge counts sparingly
- Test notification behavior on different devices

### Security Considerations
- Never expose credentials in client-side code
- Use environment variables for sensitive data
- Regularly rotate API keys and passwords
- Monitor for suspicious notification activity
- Implement rate limiting for notification sending

## Testing

### Manual Testing
1. Navigate to Admin Settings → Notifications tab
2. Configure email settings with valid SMTP credentials
3. Test email configuration
4. Configure SMS settings if needed
5. Configure push notification settings
6. Set notification preferences
7. Save settings and verify changes
8. Test validation by entering invalid data

### Integration Testing
- Test email configuration with real SMTP credentials
- Test SMS configuration with test phone numbers
- Test push notifications with test devices
- Verify notification delivery across all channels
- Test quiet hours functionality

### Security Testing
- Verify admin-only access control
- Test credential masking and security
- Validate input sanitization
- Check audit logging functionality
- Test rate limiting for notification sending

## Troubleshooting

### Common Issues

1. **Email Test Failures**
   - Verify SMTP credentials are correct
   - Check if SMTP provider requires app passwords
   - Ensure TLS is enabled for secure connections
   - Check firewall settings for SMTP ports

2. **SMS Delivery Issues**
   - Verify SMS provider credentials
   - Check phone number format (include country code)
   - Ensure SMS provider account has sufficient credits
   - Verify SMS provider supports your region

3. **Push Notification Failures**
   - Verify server key and app ID are correct
   - Check if device tokens are valid
   - Ensure push notification service is configured properly
   - Test with multiple devices

4. **Notification Preferences Not Working**
   - Check if quiet hours are configured correctly
   - Verify notification permissions on devices
   - Test sound and vibration settings
   - Check browser notification permissions

5. **Settings Not Saving**
   - Check admin permissions
   - Verify authentication token
   - Check browser console for errors
   - Validate input data format

### Error Messages

```json
{
  "error": "SMTP host is required",
  "status": 400
}
```

```json
{
  "error": "SMTP password is required and must be at least 6 characters long",
  "status": 400
}
```

```json
{
  "error": "From email must be a valid email address",
  "status": 400
}
```

```json
{
  "error": "Unauthorized - Admin access required",
  "status": 401
}
```

## Monitoring

### Audit Logs
All notification settings changes are logged with:
- User ID and email
- Timestamp of change
- IP address
- Detailed change information
- Test results for email configuration

### Performance Monitoring
- Email delivery rates
- SMS delivery success rates
- Push notification delivery rates
- Notification response times
- Error rates and types

### Security Monitoring
- Failed authentication attempts
- Invalid configuration attempts
- Suspicious notification activity
- Unusual access patterns
- Credential exposure attempts

## Future Enhancements

### Planned Features
- Advanced email template management
- Multi-language notification support
- Scheduled notification sending
- Notification analytics and reporting
- Advanced quiet hours with time zones
- Notification channel preferences per user
- Advanced SMS provider integration
- Webhook notification support

### Integration Roadmap
- Additional SMS providers
- More email service providers
- Advanced push notification platforms
- Social media notification integration
- Slack/Discord notification integration
- Advanced notification analytics
- Machine learning for notification optimization
- A/B testing for notification content 