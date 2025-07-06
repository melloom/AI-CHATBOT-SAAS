# System Preferences Documentation

## Overview

The System Preferences feature allows administrators to configure system behavior and performance settings that affect the entire platform. These settings control date/time formatting, session management, file upload limits, and other system-wide behaviors.

## Default Configuration

The system comes pre-configured with the following default values:

- **Date Format**: MM/DD/YYYY
- **Time Format**: 12-hour
- **Session Timeout**: 24 hours
- **Max File Upload Size**: 10 MB

## Settings Details

### Date Format
Controls how dates are displayed throughout the platform.

**Available Options:**
- `MM/DD/YYYY` (Default) - Month/Day/Year format
- `DD/MM/YYYY` - Day/Month/Year format
- `YYYY-MM-DD` - ISO format
- `MM-DD-YYYY` - Month-Day-Year format

**Usage:**
```typescript
// Example usage in components
const formatDate = (date: Date) => {
  const format = systemSettings.dateFormat
  switch (format) {
    case 'MM/DD/YYYY':
      return date.toLocaleDateString('en-US')
    case 'DD/MM/YYYY':
      return date.toLocaleDateString('en-GB')
    case 'YYYY-MM-DD':
      return date.toISOString().split('T')[0]
    default:
      return date.toLocaleDateString('en-US')
  }
}
```

### Time Format
Controls how times are displayed throughout the platform.

**Available Options:**
- `12h` (Default) - 12-hour format with AM/PM
- `24h` - 24-hour format

**Usage:**
```typescript
// Example usage in components
const formatTime = (date: Date) => {
  const format = systemSettings.timeFormat
  if (format === '12h') {
    return date.toLocaleTimeString('en-US', { 
      hour12: true 
    })
  } else {
    return date.toLocaleTimeString('en-US', { 
      hour12: false 
    })
  }
}
```

### Session Timeout
Controls how long user sessions remain active before requiring re-authentication.

**Available Options:**
- `1h` - 1 hour
- `4h` - 4 hours
- `8h` - 8 hours
- `24h` (Default) - 24 hours
- `7d` - 7 days

**Implementation:**
```typescript
// Session timeout validation
const validateSession = (lastActivity: Date) => {
  const timeout = systemSettings.sessionTimeout
  const now = new Date()
  const diff = now.getTime() - lastActivity.getTime()
  
  const timeoutMs = {
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '8h': 8 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000
  }[timeout] || 24 * 60 * 60 * 1000
  
  return diff < timeoutMs
}
```

### Max File Upload Size
Controls the maximum file size that can be uploaded to the platform.

**Available Options:**
- `1MB` - 1 megabyte
- `5MB` - 5 megabytes
- `10MB` (Default) - 10 megabytes
- `25MB` - 25 megabytes
- `50MB` - 50 megabytes

**Implementation:**
```typescript
// File upload validation
const validateFileUpload = (file: File) => {
  const maxSize = systemSettings.maxFileUploadSize
  const maxBytes = parseInt(maxSize) * 1024 * 1024 // Convert MB to bytes
  
  if (file.size > maxBytes) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize}`)
  }
  
  return true
}
```

## API Integration

### Fetching Settings
```typescript
// GET /api/settings
const response = await fetch('/api/settings')
const settings = await response.json()

// Access system preferences
const {
  dateFormat,
  timeFormat,
  sessionTimeout,
  maxFileUploadSize
} = settings
```

### Updating Settings
```typescript
// POST /api/settings
const response = await fetch('/api/settings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    sessionTimeout: '24h',
    maxFileUploadSize: '10MB'
  })
})
```

## Firebase Storage

System preferences are stored in Firestore under the `systemSettings` collection:

```typescript
// Firestore structure
{
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  sessionTimeout: "24h",
  maxFileUploadSize: "10MB",
  updatedAt: "2024-01-01T00:00:00.000Z",
  updatedBy: "admin@example.com"
}
```

## Validation Rules

### Date Format Validation
- Must be one of: `MM/DD/YYYY`, `DD/MM/YYYY`, `YYYY-MM-DD`, `MM-DD-YYYY`

### Time Format Validation
- Must be one of: `12h`, `24h`

### Session Timeout Validation
- Must be one of: `1h`, `4h`, `8h`, `24h`, `7d`

### Max File Upload Size Validation
- Must be one of: `1MB`, `5MB`, `10MB`, `25MB`, `50MB`

## Security Considerations

1. **Admin Access Only**: Only users with admin privileges can modify system preferences
2. **Audit Trail**: All changes are logged with timestamp and user information
3. **Validation**: All settings are validated before being saved
4. **Default Fallbacks**: System provides sensible defaults if settings are missing

## Testing

### Manual Testing
Use the System Preferences Test component to verify settings:

```typescript
// Test component usage
<SystemPreferencesTest />
```

### Automated Testing
```typescript
// Example test cases
describe('System Preferences', () => {
  test('should load default values', async () => {
    const response = await fetch('/api/settings')
    const settings = await response.json()
    
    expect(settings.dateFormat).toBe('MM/DD/YYYY')
    expect(settings.timeFormat).toBe('12h')
    expect(settings.sessionTimeout).toBe('24h')
    expect(settings.maxFileUploadSize).toBe('10MB')
  })
  
  test('should validate date format', async () => {
    const response = await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ dateFormat: 'INVALID' })
    })
    
    expect(response.status).toBe(400)
  })
})
```

## Error Handling

### Common Errors
1. **Invalid Format**: When an unsupported value is provided
2. **Unauthorized Access**: When non-admin users try to modify settings
3. **Database Errors**: When Firestore operations fail
4. **Validation Errors**: When required fields are missing

### Error Responses
```typescript
// Example error response
{
  error: 'Invalid date format selected',
  status: 400
}
```

## Performance Impact

### Caching
- Settings are cached in memory for quick access
- Cache is invalidated when settings are updated
- Default values are used as fallback

### Optimization
- Settings are loaded once per session
- Changes are batched to reduce database calls
- Validation happens on the server side

## Migration Guide

### From Previous Versions
If upgrading from a previous version without these settings:

1. **Backup existing settings**: Export current configuration
2. **Update database**: Add new preference fields with defaults
3. **Test functionality**: Verify all settings work correctly
4. **Update documentation**: Inform users of new capabilities

### Default Values Migration
```typescript
// Migration script example
const migrateSettings = async () => {
  const db = getAdminDb()
  const settingsDoc = await db.collection('systemSettings').doc('main').get()
  
  if (!settingsDoc.exists) {
    await db.collection('systemSettings').doc('main').set({
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      sessionTimeout: "24h",
      maxFileUploadSize: "10MB",
      createdAt: new Date().toISOString()
    })
  }
}
```

## Troubleshooting

### Common Issues

1. **Settings Not Loading**
   - Check Firebase connection
   - Verify admin authentication
   - Check browser console for errors

2. **Settings Not Saving**
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
console.log('System Settings:', settings)
console.log('Validation Errors:', errors)
```

## Future Enhancements

### Planned Features
1. **Custom Date Formats**: Allow custom date format patterns
2. **Regional Settings**: Support for different regional preferences
3. **User Overrides**: Allow users to override system defaults
4. **Advanced Timeouts**: More granular session timeout options
5. **File Type Restrictions**: Add file type validation alongside size limits

### API Extensions
```typescript
// Future API endpoints
GET /api/settings/preferences/user-overrides
POST /api/settings/preferences/regional
GET /api/settings/preferences/validation-rules
```

## Support

For issues or questions regarding System Preferences:

1. **Documentation**: Check this guide first
2. **Testing**: Use the test component to verify functionality
3. **Logs**: Review server logs for detailed error information
4. **Support**: Contact system administrator for assistance

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Compatibility**: Firebase Admin SDK, Next.js 15+ 