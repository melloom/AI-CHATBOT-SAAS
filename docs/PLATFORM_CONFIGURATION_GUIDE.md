# Platform Configuration Guide

## Overview

The Platform Configuration module provides comprehensive settings for managing all aspects of your ChatHub AI SaaS platform. It includes platform branding, email configuration, payment processing, security settings, third-party integrations, API management, and feature flags with full Firebase integration.

## Features

### 🔧 **Platform Configuration**
- **Platform Name**: Set the display name for your platform
- **Platform Domain**: Configure your main domain with validation
- **Logo URL**: Set your platform logo URL
- **Favicon URL**: Configure your platform favicon
- **Default Language**: Set the primary language for your platform
- **Default Timezone**: Configure the default timezone
- **Max File Upload Size**: Set maximum file upload limits
- **Allowed File Types**: Configure permitted file extensions

### 📧 **Email Configuration**
- **SMTP Provider**: Choose from SendGrid, Mailgun, AWS SES, or Custom SMTP
- **API Key**: Secure storage of SMTP credentials
- **From Email**: Configure sender email address
- **From Name**: Set sender display name
- **Test Configuration**: Validate email settings with test emails

### 💳 **Payment Configuration**
- **Payment Provider**: Support for Stripe, PayPal, Square, and Custom providers
- **Currency**: Multiple currency support (USD, EUR, GBP, CAD, AUD)
- **Stripe Integration**: Publishable and secret key management
- **PayPal Integration**: Client ID and secret management
- **Tax Rate**: Configurable tax percentage
- **Test Transactions**: Validate payment gateway configuration

### 🛡️ **Security Configuration**
- **reCAPTCHA**: Site key and secret key management
- **JWT Secret**: Secure JWT token signing
- **Session Secret**: Session encryption key
- **CORS Origins**: Configure allowed cross-origin requests
- **Secret Visibility**: Toggle to show/hide sensitive credentials

### 🔗 **Third-party Integrations**
- **Google Analytics**: Track user behavior and platform usage
- **Google Tag Manager**: Advanced analytics and marketing tags
- **Facebook Pixel**: Social media advertising tracking
- **Hotjar**: User behavior analytics and heatmaps
- **Intercom**: Customer support and messaging
- **Zendesk**: Help desk and customer service
- **Slack**: Webhook notifications and alerts

### ⚡ **API Configuration**
- **Rate Limiting**: Configure API request limits
- **Rate Limit Window**: Set time window for rate limiting
- **API Key Expiry**: Manage API key expiration periods
- **Webhook Timeout**: Configure webhook response timeouts
- **Webhook Retries**: Set maximum retry attempts for failed webhooks

### 🚀 **Feature Flags**
- **User Registration**: Enable/disable new user signups
- **Email Verification**: Require email verification for new users
- **Two-Factor Authentication**: Enable 2FA for enhanced security
- **Social Login**: Allow social media authentication
- **File Upload**: Enable file upload functionality
- **Real-time Chat**: Enable live messaging features
- **Analytics**: Enable usage tracking and analytics
- **Notifications**: Enable push and in-app notifications

## API Endpoints

### Get Platform Settings
```
GET /api/settings/platform
```

**Response:**
```json
{
  "platformName": "ChatHub AI",
  "platformDomain": "chathub.ai",
  "logoUrl": "https://example.com/logo.png",
  "faviconUrl": "https://example.com/favicon.ico",
  "defaultLanguage": "English",
  "defaultTimezone": "UTC",
  "maxFileUploadSize": "10 MB",
  "allowedFileTypes": "jpg,jpeg,png,gif,pdf,doc,docx,txt",
  "smtpProvider": "SendGrid",
  "smtpApiKey": "",
  "fromEmail": "noreply@chathub.ai",
  "fromName": "ChatHub AI",
  "paymentProvider": "Stripe",
  "currency": "USD ($)",
  "stripePublishableKey": "pk_test_...",
  "stripeSecretKey": "",
  "paypalClientId": "",
  "paypalSecret": "",
  "taxRate": 0,
  "recaptchaSiteKey": "6Lc...",
  "recaptchaSecretKey": "",
  "jwtSecret": "",
  "sessionSecret": "",
  "corsOrigins": "https://example.com,https://app.example.com",
  "googleAnalyticsId": "G-XXXXXXXXXX",
  "googleTagManagerId": "GTM-XXXXXXX",
  "facebookPixelId": "XXXXXXXXXX",
  "hotjarId": "XXXXXXXXXX",
  "intercomAppId": "XXXXXXXXXX",
  "zendeskDomain": "company.zendesk.com",
  "slackWebhookUrl": "https://hooks.slack.com/services/...",
  "apiRateLimit": 100,
  "rateLimitWindow": 900,
  "apiKeyExpiry": 365,
  "webhookTimeout": 30,
  "maxWebhookRetries": 3,
  "enableUserRegistration": true,
  "enableEmailVerification": true,
  "enableTwoFactorAuth": true,
  "enableSocialLogin": true,
  "enableFileUpload": true,
  "enableRealTimeChat": true,
  "enableAnalytics": true,
  "enableNotifications": true
}
```

### Update Platform Settings
```
POST /api/settings/platform
```

**Request Body:**
```json
{
  "platformName": "ChatHub AI",
  "platformDomain": "chathub.ai",
  "logoUrl": "https://example.com/logo.png",
  "faviconUrl": "https://example.com/favicon.ico",
  "defaultLanguage": "English",
  "defaultTimezone": "UTC",
  "maxFileUploadSize": "10 MB",
  "allowedFileTypes": "jpg,jpeg,png,gif,pdf,doc,docx,txt",
  "smtpProvider": "SendGrid",
  "smtpApiKey": "your-api-key",
  "fromEmail": "noreply@chathub.ai",
  "fromName": "ChatHub AI",
  "paymentProvider": "Stripe",
  "currency": "USD ($)",
  "stripePublishableKey": "pk_test_...",
  "stripeSecretKey": "sk_test_...",
  "paypalClientId": "your-client-id",
  "paypalSecret": "your-secret",
  "taxRate": 0,
  "recaptchaSiteKey": "6Lc...",
  "recaptchaSecretKey": "6Lc...",
  "jwtSecret": "your-jwt-secret",
  "sessionSecret": "your-session-secret",
  "corsOrigins": "https://example.com,https://app.example.com",
  "googleAnalyticsId": "G-XXXXXXXXXX",
  "googleTagManagerId": "GTM-XXXXXXX",
  "facebookPixelId": "XXXXXXXXXX",
  "hotjarId": "XXXXXXXXXX",
  "intercomAppId": "XXXXXXXXXX",
  "zendeskDomain": "company.zendesk.com",
  "slackWebhookUrl": "https://hooks.slack.com/services/...",
  "apiRateLimit": 100,
  "rateLimitWindow": 900,
  "apiKeyExpiry": 365,
  "webhookTimeout": 30,
  "maxWebhookRetries": 3,
  "enableUserRegistration": true,
  "enableEmailVerification": true,
  "enableTwoFactorAuth": true,
  "enableSocialLogin": true,
  "enableFileUpload": true,
  "enableRealTimeChat": true,
  "enableAnalytics": true,
  "enableNotifications": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Platform settings updated successfully"
}
```

### Test Email Configuration
```
POST /api/settings/test-email
```

**Request Body:**
```json
{
  "smtpProvider": "SendGrid",
  "smtpApiKey": "your-api-key",
  "fromEmail": "noreply@chathub.ai",
  "fromName": "ChatHub AI"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email configuration test successful",
  "details": {
    "success": true,
    "message": "Test email sent successfully via SendGrid",
    "provider": "SendGrid",
    "fromEmail": "noreply@chathub.ai",
    "fromName": "ChatHub AI",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Test Payment Configuration
```
POST /api/settings/test-payment
```

**Request Body:**
```json
{
  "paymentProvider": "Stripe",
  "currency": "USD ($)",
  "stripePublishableKey": "pk_test_...",
  "stripeSecretKey": "sk_test_...",
  "taxRate": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment configuration test successful",
  "details": {
    "success": true,
    "message": "Test payment processed successfully via Stripe",
    "provider": "Stripe",
    "currency": "USD ($)",
    "testAmount": 1.00,
    "taxRate": 0,
    "taxAmount": 0,
    "totalAmount": 1.00,
    "transactionId": "test_1704067200000_abc123def",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Validation Rules

### Platform Configuration
- **Platform Name**: Required, non-empty string
- **Platform Domain**: Required, valid domain format
- **Logo URL**: Optional, must be valid URL if provided
- **Favicon URL**: Optional, must be valid URL if provided
- **Default Language**: Required, must be from allowed list
- **Default Timezone**: Required, must be from allowed list
- **Max File Upload Size**: Required, must be from allowed options
- **Allowed File Types**: Required, comma-separated list

### Email Configuration
- **SMTP Provider**: Required, must be from allowed providers
- **API Key**: Optional, but required for most providers
- **From Email**: Required, must be valid email format
- **From Name**: Required, non-empty string

### Payment Configuration
- **Payment Provider**: Required, must be from allowed providers
- **Currency**: Required, must be from allowed currencies
- **Stripe Keys**: Required for Stripe provider
- **PayPal Credentials**: Required for PayPal provider
- **Tax Rate**: Required, must be between 0 and 100

### Security Configuration
- **reCAPTCHA Keys**: Optional, but recommended for security
- **JWT Secret**: Optional, but required for authentication
- **Session Secret**: Optional, but required for sessions
- **CORS Origins**: Optional, comma-separated list of URLs

### API Configuration
- **API Rate Limit**: Required, minimum 1 request
- **Rate Limit Window**: Required, minimum 60 seconds
- **API Key Expiry**: Required, minimum 1 day
- **Webhook Timeout**: Required, minimum 5 seconds
- **Max Webhook Retries**: Required, minimum 0

## Components

### PlatformSettingsForm
Located at `components/settings/platform-settings-form.tsx`

Features:
- Complete platform configuration form
- Real-time validation with visual feedback
- Secure credential management with show/hide toggle
- Integration testing for email and payment
- Admin-only access control
- Toast notifications for success/error states
- Auto-loading of existing settings

### Platform Configuration API
Located at `app/api/settings/platform/route.ts`

Features:
- Comprehensive validation with Zod schemas
- Admin-only access control
- Audit logging for all changes
- Default settings fallback
- Error handling and detailed error messages

### Email Test API
Located at `app/api/settings/test-email/route.ts`

Features:
- SMTP provider validation
- Email configuration testing
- Audit logging for test results
- Detailed error reporting

### Payment Test API
Located at `app/api/settings/test-payment/route.ts`

Features:
- Payment provider validation
- Transaction simulation
- Tax calculation testing
- Audit logging for test results

## Security Features

### Authentication & Authorization
- All settings operations require admin authentication
- JWT token validation
- Admin role verification
- Request validation with comprehensive rules

### Data Protection
- Secure credential storage
- Password field masking with show/hide toggle
- Input sanitization and validation
- Audit logging for all changes

### Error Handling
- Comprehensive error messages
- Validation error details
- User-friendly error notifications
- Secure error responses

## Best Practices

### Platform Configuration
- Set a meaningful platform name that reflects your brand
- Use a valid domain name for your platform domain
- Choose appropriate file upload limits based on your infrastructure
- Configure allowed file types based on your security requirements

### Email Configuration
- Use a reputable SMTP provider (SendGrid, Mailgun, AWS SES)
- Always test email configuration before going live
- Use a professional from email address
- Keep API keys secure and rotate them regularly

### Payment Configuration
- Use test keys during development
- Validate payment configuration before accepting real payments
- Configure appropriate tax rates for your jurisdiction
- Test with small amounts before going live

### Security Configuration
- Enable reCAPTCHA for form protection
- Use strong, unique secrets for JWT and sessions
- Configure CORS origins carefully
- Regularly rotate security keys

### Third-party Integrations
- Only enable integrations you actually use
- Test integrations thoroughly
- Monitor integration performance
- Keep API keys secure

### API Configuration
- Set reasonable rate limits based on your infrastructure
- Configure appropriate timeouts
- Monitor API usage and adjust limits as needed
- Use webhook retries for reliability

### Feature Flags
- Use feature flags for gradual rollouts
- Test features thoroughly before enabling
- Monitor feature usage and performance
- Have rollback plans for critical features

## Testing

### Manual Testing
1. Navigate to Admin Settings → Platform Configuration
2. Modify platform configuration fields
3. Test email configuration with valid credentials
4. Test payment configuration with test keys
5. Save settings and verify changes
6. Test validation by entering invalid data

### Integration Testing
- Test email configuration with real SMTP credentials
- Test payment configuration with test payment gateways
- Verify third-party integrations work correctly
- Test feature flags in different combinations

### Security Testing
- Verify admin-only access control
- Test credential masking and security
- Validate input sanitization
- Check audit logging functionality

## Troubleshooting

### Common Issues

1. **Settings Not Saving**
   - Check admin permissions
   - Verify authentication token
   - Check browser console for errors
   - Validate input data format

2. **Email Test Failures**
   - Verify SMTP provider credentials
   - Check API key format and permissions
   - Ensure from email is valid
   - Test with different SMTP providers

3. **Payment Test Failures**
   - Verify payment provider credentials
   - Check key format (Stripe keys start with pk_/sk_)
   - Ensure test mode is enabled
   - Validate currency settings

4. **Validation Errors**
   - Review error messages for specific issues
   - Check required field values
   - Verify format requirements (URLs, emails, etc.)
   - Ensure values are within allowed ranges

5. **Integration Issues**
   - Verify API keys and credentials
   - Check network connectivity
   - Validate URL formats
   - Test with different providers

### Error Messages

```json
{
  "error": "Platform name is required",
  "status": 400
}
```

```json
{
  "error": "Invalid SMTP provider selected",
  "status": 400
}
```

```json
{
  "error": "Stripe publishable key and secret key are required",
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
All platform configuration changes are logged with:
- User ID and email
- Timestamp of change
- IP address
- Detailed change information
- Test results for integrations

### Performance Monitoring
- API response times
- Database query performance
- Integration test results
- Error rates and types

### Security Monitoring
- Failed authentication attempts
- Invalid configuration attempts
- Suspicious IP addresses
- Unusual access patterns

## Future Enhancements

### Planned Features
- Advanced email template management
- Multi-currency payment processing
- Advanced security features (IP whitelisting, etc.)
- Automated configuration backups
- Configuration versioning and rollback
- Advanced analytics integration
- Custom webhook management
- Advanced feature flag management

### Integration Roadmap
- Additional payment providers
- More email service providers
- Advanced analytics platforms
- Customer support integrations
- Marketing automation tools
- Developer tools and APIs 