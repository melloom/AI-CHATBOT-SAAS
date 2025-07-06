# Feature Toggles Documentation

## Overview

The Feature Toggles system allows administrators to enable or disable platform features dynamically without requiring code deployments. This provides granular control over platform functionality and allows for feature rollouts, maintenance, and performance optimization.

## Default Configuration

The system comes pre-configured with the following default values:

- **Maintenance Mode**: `false` (Disabled)
- **Debug Mode**: `false` (Disabled)
- **Analytics**: `true` (Enabled)
- **User Registration**: `true` (Enabled)
- **Email Notifications**: `true` (Enabled)
- **Custom Branding**: `false` (Disabled)

## Feature Toggles Details

### Maintenance Mode
Controls whether the platform is in maintenance mode, temporarily disabling access for all users.

**Default**: `false` (Disabled)

**Behavior**:
- When enabled: Shows maintenance page to all users
- When disabled: Normal platform access
- Admin users can still access the platform during maintenance

**Implementation**:
```typescript
// Check maintenance mode status
const isMaintenanceMode = systemSettings.maintenanceMode

if (isMaintenanceMode && !user.isAdmin) {
  return <MaintenancePage />
}
```

### Debug Mode
Enables detailed logging and debugging information throughout the platform.

**Default**: `false` (Disabled)

**Behavior**:
- When enabled: Shows debug information, detailed logs, error traces
- When disabled: Standard logging only
- Should only be enabled in development or troubleshooting

**Implementation**:
```typescript
// Debug mode logging
const logDebug = (message: string, data?: any) => {
  if (systemSettings.debugMode) {
    console.log(`[DEBUG] ${message}`, data)
  }
}
```

### Analytics
Controls whether usage analytics and tracking are enabled.

**Default**: `true` (Enabled)

**Behavior**:
- When enabled: Collects usage data, user behavior, performance metrics
- When disabled: No analytics data collection
- Affects privacy and performance

**Implementation**:
```typescript
// Analytics tracking
const trackEvent = (event: string, properties?: any) => {
  if (systemSettings.analyticsEnabled) {
    analytics.track(event, properties)
  }
}
```

### User Registration
Controls whether new users can register for the platform.

**Default**: `true` (Enabled)

**Behavior**:
- When enabled: New users can create accounts
- When disabled: Registration forms are hidden/disabled
- Existing users can still log in

**Implementation**:
```typescript
// Registration access check
const canRegister = () => {
  return systemSettings.userRegistration
}

// In registration component
if (!canRegister()) {
  return <RegistrationDisabled />
}
```

### Email Notifications
Controls whether email notifications are sent to users.

**Default**: `true` (Enabled)

**Behavior**:
- When enabled: Sends email notifications for events
- When disabled: No email notifications sent
- In-app notifications still work

**Implementation**:
```typescript
// Email notification check
const sendEmailNotification = async (user: User, notification: Notification) => {
  if (systemSettings.emailNotifications) {
    await emailService.send(user.email, notification)
  }
}
```

### Custom Branding
Controls whether companies can customize their branding.

**Default**: `false` (Disabled)

**Behavior**:
- When enabled: Companies can upload logos, customize colors
- When disabled: Standard platform branding only
- Affects UI customization options

**Implementation**:
```typescript
// Branding customization check
const canCustomizeBranding = () => {
  return systemSettings.customBranding
}

// In branding component
if (canCustomizeBranding()) {
  return <BrandingCustomization />
} else {
  return <StandardBranding />
}
```

## API Integration

### Fetching Toggles
```typescript
// GET /api/settings
const response = await fetch('/api/settings')
const settings = await response.json()

// Access feature toggles
const {
  maintenanceMode,
  debugMode,
  analyticsEnabled,
  userRegistration,
  emailNotifications,
  customBranding
} = settings
```

### Updating Toggles
```typescript
// POST /api/settings
const response = await fetch('/api/settings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    maintenanceMode: false,
    debugMode: true,
    analyticsEnabled: true,
    userRegistration: true,
    emailNotifications: true,
    customBranding: false
  })
})
```

## Firebase Storage

Feature toggles are stored in Firestore under the `systemSettings` collection:

```typescript
// Firestore structure
{
  maintenanceMode: false,
  debugMode: false,
  analyticsEnabled: true,
  userRegistration: true,
  emailNotifications: true,
  customBranding: false,
  updatedAt: "2024-01-01T00:00:00.000Z",
  updatedBy: "admin@example.com"
}
```

## Validation Rules

### Boolean Validation
All feature toggles must be boolean values:
- `true` - Feature enabled
- `false` - Feature disabled

### Required Fields
- All toggle fields are optional in API calls
- Missing fields retain their current values
- Invalid boolean values return 400 error

## Security Considerations

1. **Admin Access Only**: Only users with admin privileges can modify feature toggles
2. **Audit Trail**: All changes are logged with timestamp and user information
3. **Validation**: All toggles are validated as boolean values
4. **Default Fallbacks**: System provides sensible defaults if toggles are missing

## Testing

### Manual Testing
Use the Feature Toggles Test component to verify toggles:

```typescript
// Test component usage
<FeatureTogglesTest />
```

### Automated Testing
```typescript
// Example test cases
describe('Feature Toggles', () => {
  test('should load default values', async () => {
    const response = await fetch('/api/settings')
    const settings = await response.json()
    
    expect(settings.maintenanceMode).toBe(false)
    expect(settings.debugMode).toBe(false)
    expect(settings.analyticsEnabled).toBe(true)
    expect(settings.userRegistration).toBe(true)
    expect(settings.emailNotifications).toBe(true)
    expect(settings.customBranding).toBe(false)
  })
  
  test('should validate boolean values', async () => {
    const response = await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ maintenanceMode: 'invalid' })
    })
    
    expect(response.status).toBe(400)
  })
})
```

## Error Handling

### Common Errors
1. **Invalid Boolean**: When non-boolean values are provided
2. **Unauthorized Access**: When non-admin users try to modify toggles
3. **Database Errors**: When Firestore operations fail
4. **Validation Errors**: When required fields are missing

### Error Responses
```typescript
// Example error response
{
  error: 'maintenanceMode must be a boolean value',
  status: 400
}
```

## Performance Impact

### Caching
- Toggles are cached in memory for quick access
- Cache is invalidated when toggles are updated
- Default values are used as fallback

### Optimization
- Toggles are loaded once per session
- Changes are batched to reduce database calls
- Validation happens on the server side

## Use Cases

### Maintenance Mode
```typescript
// Emergency maintenance
await updateSettings({ maintenanceMode: true })

// Scheduled maintenance
setTimeout(async () => {
  await updateSettings({ maintenanceMode: true })
}, maintenanceStartTime)
```

### Feature Rollouts
```typescript
// Gradual feature rollout
await updateSettings({ customBranding: true })

// A/B testing
await updateSettings({ analyticsEnabled: true })
```

### Performance Optimization
```typescript
// Disable heavy features during high load
await updateSettings({ 
  analyticsEnabled: false,
  debugMode: false 
})
```

### Security Measures
```typescript
// Disable registration during security incident
await updateSettings({ userRegistration: false })
```

## Migration Guide

### From Previous Versions
If upgrading from a previous version without feature toggles:

1. **Backup existing settings**: Export current configuration
2. **Update database**: Add new toggle fields with defaults
3. **Test functionality**: Verify all toggles work correctly
4. **Update documentation**: Inform users of new capabilities

### Default Values Migration
```typescript
// Migration script example
const migrateToggles = async () => {
  const db = getAdminDb()
  const settingsDoc = await db.collection('systemSettings').doc('main').get()
  
  if (!settingsDoc.exists) {
    await db.collection('systemSettings').doc('main').set({
      maintenanceMode: false,
      debugMode: false,
      analyticsEnabled: true,
      userRegistration: true,
      emailNotifications: true,
      customBranding: false,
      createdAt: new Date().toISOString()
    })
  }
}
```

## Troubleshooting

### Common Issues

1. **Toggles Not Loading**
   - Check Firebase connection
   - Verify admin authentication
   - Check browser console for errors

2. **Toggles Not Saving**
   - Verify admin permissions
   - Check validation rules
   - Review server logs

3. **Incorrect Defaults**
   - Clear browser cache
   - Check Firebase data
   - Verify API responses

### Debug Mode
Enable debug mode to see detailed logs:

```typescript
// Enable debug logging
console.log('Feature Toggles:', toggles)
console.log('Validation Errors:', errors)
```

## Future Enhancements

### Planned Features
1. **Conditional Toggles**: Enable/disable based on user roles
2. **Scheduled Toggles**: Automatically enable/disable at specific times
3. **User-Specific Toggles**: Override system toggles for specific users
4. **Toggle History**: Track changes and rollback capabilities
5. **Toggle Groups**: Group related toggles together

### API Extensions
```typescript
// Future API endpoints
GET /api/settings/toggles/history
POST /api/settings/toggles/schedule
GET /api/settings/toggles/user-overrides
POST /api/settings/toggles/rollback
```

## Best Practices

### Toggle Management
1. **Document Changes**: Always document why toggles are changed
2. **Test Thoroughly**: Test toggles in staging before production
3. **Monitor Impact**: Track how toggle changes affect users
4. **Plan Rollbacks**: Have a plan to quickly revert changes

### Security
1. **Limit Access**: Only grant toggle access to trusted admins
2. **Audit Changes**: Log all toggle modifications
3. **Validate Inputs**: Always validate toggle values
4. **Test Security**: Ensure toggles don't bypass security measures

### Performance
1. **Cache Toggles**: Cache toggle values for quick access
2. **Batch Updates**: Group multiple toggle changes together
3. **Monitor Load**: Watch for performance impact of toggle changes
4. **Optimize Queries**: Minimize database calls for toggle checks

## Support

For issues or questions regarding Feature Toggles:

1. **Documentation**: Check this guide first
2. **Testing**: Use the test component to verify functionality
3. **Logs**: Review server logs for detailed error information
4. **Support**: Contact system administrator for assistance

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Compatibility**: Firebase Admin SDK, Next.js 15+ 