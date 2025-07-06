# Platform Configuration

## Overview

The Platform Configuration module provides comprehensive settings for managing basic platform information, branding, and system preferences. It includes platform name, URL, timezone, language, and other essential configuration options with full Firebase integration.

## Features

### 🔧 **Platform Configuration**
- **Platform Name**: Set the display name for the platform
- **Platform URL**: Configure the main platform URL with validation
- **Default Timezone**: Set the default timezone for the platform
- **Default Language**: Configure the default language for the platform

### ⚙️ **System Preferences**
- **Date Format**: Configure date display format
- **Time Format**: Set 12-hour or 24-hour time format
- **Session Timeout**: Configure user session duration
- **File Upload Limits**: Set maximum file upload sizes

### 🎨 **Feature Toggles**
- **Maintenance Mode**: Temporarily disable platform access
- **Debug Mode**: Enable detailed logging and debugging
- **Analytics**: Enable usage analytics and tracking
- **User Registration**: Allow new user registrations
- **Email Notifications**: Send email notifications to users
- **Custom Branding**: Allow companies to customize branding

### 📊 **Limits and Quotas**
- **Max Users per Company**: Set maximum users per company
- **Max Chatbots per Company**: Configure chatbot limits per company

### 📧 **Contact Information**
- **Support Email**: Configure support contact email
- **Contact Email**: Set general contact email

### 📢 **System Announcements**
- **Announcement System**: Display system-wide announcements
- **Announcement Types**: Info, Success, Warning, Error
- **Expiry Dates**: Set announcement expiration dates

## API Endpoints

### Get Settings
```
GET /api/settings
```

**Response:**
```json
{
  "platformName": "ChatHub AI",
  "platformUrl": "https://chathub.ai",
  "timezone": "UTC",
  "language": "en",
  "dateFormat": "MM/DD/YYYY",
  "timeFormat": "12h",
  "maintenanceMode": false,
  "debugMode": false,
  "analyticsEnabled": true,
  "userRegistration": true,
  "emailNotifications": true,
  "maxFileUploadSize": "10MB",
  "sessionTimeout": "24h",
  "maxUsersPerCompany": 100,
  "maxChatbotsPerCompany": 10,
  "defaultTheme": "light",
  "customBranding": false,
  "companyLogo": "",
  "companyName": "",
  "supportEmail": "support@chathub.ai",
  "contactEmail": "contact@chathub.ai",
  "termsOfService": "",
  "privacyPolicy": "",
  "systemAnnouncement": "",
  "announcementEnabled": false,
  "announcementType": "info",
  "announcementExpiry": null
}
```

### Update Settings
```
POST /api/settings
```

**Request Body:**
```json
{
  "platformName": "ChatHub AI",
  "platformUrl": "https://chathub.ai",
  "timezone": "UTC",
  "language": "en",
  "dateFormat": "MM/DD/YYYY",
  "timeFormat": "12h",
  "maintenanceMode": false,
  "debugMode": false,
  "analyticsEnabled": true,
  "userRegistration": true,
  "emailNotifications": true,
  "maxFileUploadSize": "10MB",
  "sessionTimeout": "24h",
  "maxUsersPerCompany": 100,
  "maxChatbotsPerCompany": 10,
  "defaultTheme": "light",
  "customBranding": false,
  "companyLogo": "",
  "companyName": "",
  "supportEmail": "support@chathub.ai",
  "contactEmail": "contact@chathub.ai",
  "termsOfService": "",
  "privacyPolicy": "",
  "systemAnnouncement": "",
  "announcementEnabled": false,
  "announcementType": "info",
  "announcementExpiry": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "System settings updated successfully"
}
```

## Validation Rules

### Platform Name
- **Required**: Yes
- **Type**: String
- **Validation**: Must not be empty or only whitespace
- **Example**: "ChatHub AI"

### Platform URL
- **Required**: No (but recommended)
- **Type**: String
- **Validation**: Must be a valid URL with protocol (http:// or https://)
- **Example**: "https://chathub.ai"

### Timezone
- **Required**: No
- **Type**: String
- **Validation**: Must be one of the valid timezone options
- **Valid Options**:
  - UTC
  - America/New_York (Eastern Time)
  - America/Chicago (Central Time)
  - America/Denver (Mountain Time)
  - America/Los_Angeles (Pacific Time)
  - Europe/London (London)
  - Europe/Paris (Paris)
  - Asia/Tokyo (Tokyo)

### Language
- **Required**: No
- **Type**: String
- **Validation**: Must be one of the valid language codes
- **Valid Options**:
  - en (English)
  - es (Spanish)
  - fr (French)
  - de (German)
  - it (Italian)
  - pt (Portuguese)
  - ja (Japanese)
  - ko (Korean)

### Date Format
- **Required**: No
- **Type**: String
- **Valid Options**:
  - MM/DD/YYYY
  - DD/MM/YYYY
  - YYYY-MM-DD
  - MM-DD-YYYY

### Time Format
- **Required**: No
- **Type**: String
- **Valid Options**:
  - 12h (12-hour format)
  - 24h (24-hour format)

### Session Timeout
- **Required**: No
- **Type**: String
- **Valid Options**:
  - 1h (1 hour)
  - 4h (4 hours)
  - 8h (8 hours)
  - 24h (24 hours)
  - 7d (7 days)

### Max File Upload Size
- **Required**: No
- **Type**: String
- **Valid Options**:
  - 1MB
  - 5MB
  - 10MB
  - 25MB
  - 50MB

### Max Users per Company
- **Required**: No
- **Type**: Number
- **Validation**: Must be a positive number
- **Default**: 100

### Max Chatbots per Company
- **Required**: No
- **Type**: Number
- **Validation**: Must be a positive number
- **Default**: 10

## Firebase Integration

### Collection Structure
Settings are stored in the `systemSettings` collection with document ID `main`:

```json
{
  "platformName": "ChatHub AI",
  "platformUrl": "https://chathub.ai",
  "timezone": "UTC",
  "language": "en",
  "dateFormat": "MM/DD/YYYY",
  "timeFormat": "12h",
  "maintenanceMode": false,
  "debugMode": false,
  "analyticsEnabled": true,
  "userRegistration": true,
  "emailNotifications": true,
  "maxFileUploadSize": "10MB",
  "sessionTimeout": "24h",
  "maxUsersPerCompany": 100,
  "maxChatbotsPerCompany": 10,
  "defaultTheme": "light",
  "customBranding": false,
  "companyLogo": "",
  "companyName": "",
  "supportEmail": "support@chathub.ai",
  "contactEmail": "contact@chathub.ai",
  "termsOfService": "",
  "privacyPolicy": "",
  "systemAnnouncement": "",
  "announcementEnabled": false,
  "announcementType": "info",
  "announcementExpiry": null,
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "updatedBy": "admin@example.com"
}
```

## Components

### SystemSettingsForm
Located at `components/settings/system-settings-form.tsx`

Features:
- Complete platform configuration form
- Real-time validation
- Visual feedback for current values
- Save and reset functionality
- Admin-only access control
- Toast notifications for success/error states

### PlatformConfigTest
Located at `components/settings/platform-config-test.tsx`

Features:
- Test platform configuration settings
- Validate all configuration fields
- Visual test results with status indicators
- Real-time configuration loading
- Comprehensive error reporting

## Security Features

### Authentication & Authorization
- All settings operations require admin authentication
- JWT token validation
- Admin role verification
- Request validation with comprehensive rules

### Data Validation
- Input sanitization
- URL format validation
- Timezone and language validation
- Numeric field validation
- Required field validation

### Error Handling
- Comprehensive error messages
- Validation error details
- User-friendly error notifications
- Secure error logging

## Usage Examples

### Loading Settings
```javascript
const response = await fetch('/api/settings')
if (response.ok) {
  const settings = await response.json()
  console.log('Platform Name:', settings.platformName)
  console.log('Platform URL:', settings.platformUrl)
  console.log('Timezone:', settings.timezone)
  console.log('Language:', settings.language)
}
```

### Updating Settings
```javascript
const response = await fetch('/api/settings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    platformName: 'ChatHub AI',
    platformUrl: 'https://chathub.ai',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    maintenanceMode: false,
    debugMode: false,
    analyticsEnabled: true,
    userRegistration: true,
    emailNotifications: true,
    maxFileUploadSize: '10MB',
    sessionTimeout: '24h',
    maxUsersPerCompany: 100,
    maxChatbotsPerCompany: 10
  })
})

if (response.ok) {
  const result = await response.json()
  console.log('Settings updated:', result.message)
}
```

### Testing Configuration
```javascript
// The PlatformConfigTest component provides a comprehensive test interface
// that validates all platform configuration settings and provides detailed feedback
```

## Error Handling

### Common Error Scenarios
1. **Authentication Errors**: Invalid or expired tokens
2. **Authorization Errors**: Non-admin users attempting operations
3. **Validation Errors**: Invalid input data
4. **Database Errors**: Connection or query failures

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details",
  "status": 400
}
```

### Validation Error Examples
```json
{
  "error": "Platform name is required",
  "status": 400
}
```

```json
{
  "error": "Platform URL must be a valid URL with protocol (e.g., https://example.com)",
  "status": 400
}
```

```json
{
  "error": "Invalid timezone selected",
  "status": 400
}
```

## Best Practices

### Platform Configuration
- Set a meaningful platform name
- Use a valid HTTPS URL for the platform URL
- Choose an appropriate timezone for your user base
- Select the primary language for your platform

### System Preferences
- Configure date and time formats based on your target audience
- Set reasonable session timeout values
- Configure appropriate file upload limits
- Enable analytics for platform insights

### Feature Management
- Use maintenance mode during system updates
- Enable debug mode only when needed
- Configure user registration based on your business model
- Set up email notifications for important events

### Limits and Quotas
- Set reasonable limits based on your infrastructure
- Monitor usage patterns and adjust limits accordingly
- Consider different limits for different user tiers

## Testing

### Manual Testing
1. Navigate to Admin Settings → General tab
2. Modify platform configuration fields
3. Save settings and verify changes
4. Test validation by entering invalid data
5. Use the Test tab to run configuration validation

### Automated Testing
The PlatformConfigTest component provides:
- Real-time configuration validation
- Visual test results
- Detailed error reporting
- Configuration status monitoring

## Troubleshooting

### Common Issues

1. **Settings Not Saving**
   - Check admin permissions
   - Verify authentication token
   - Check browser console for errors
   - Validate input data format

2. **Validation Errors**
   - Ensure URL format is correct (include protocol)
   - Verify timezone and language values
   - Check required field values
   - Review error messages for details

3. **Configuration Not Loading**
   - Check network connectivity
   - Verify API endpoint accessibility
   - Check Firebase connection
   - Review server logs

### Debug Mode
Enable debug mode in system settings to get detailed error messages and logging information.

## Future Enhancements

### Planned Features
- Multi-language support with translations
- Advanced timezone handling
- Custom branding options
- Advanced analytics configuration
- Integration with external services
- Automated configuration validation
- Configuration templates

### Integration Opportunities
- CDN integration for assets
- Email service configuration
- Payment gateway settings
- Third-party service integrations
- Advanced security configurations
- Performance optimization settings

## Support

For technical support or questions about platform configuration, please refer to the system documentation or contact the development team. 