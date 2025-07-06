# Limits and Quotas Documentation

## Overview

The Limits and Quotas system provides comprehensive control over platform resources, user limits, storage capacity, API usage, and company management. This system allows administrators to set granular limits for different aspects of the platform to ensure optimal performance and resource management.

## Default Configuration

The system comes pre-configured with the following default values:

### Company Limits
- **Max Users per Company**: 100
- **Max Chatbots per Company**: 10
- **Max Companies**: 1000
- **Max Teams per Company**: 10

### Storage Limits
- **Max Storage per Company**: 100 GB
- **Max File Size per Upload**: 50 MB
- **Max Files per Upload**: 10
- **Max Backup Retention**: 30 days

### API Limits
- **Max API Requests per Minute**: 1000
- **Max API Requests per Hour**: 10000
- **Max Concurrent Chats**: 100
- **Max Chat History**: 90 days

### Subscription Limits
- **Max Free Users**: 5
- **Max Free Chatbots**: 2
- **Max Pro Users**: 50
- **Max Pro Chatbots**: 20

### Company Selection Options
- **Default Company Plan**: Free
- **Company Approval Required**: No
- **Max Company Name Length**: 50 characters
- **Max Company Description Length**: 500 characters

## Detailed Settings

### Company Limits

#### Max Users per Company
Controls the maximum number of users that can be registered under a single company.

**Default**: 100 users

**Implementation**:
```typescript
// Check user limit when adding new user
const canAddUser = (companyId: string) => {
  const currentUsers = await getCompanyUserCount(companyId)
  const maxUsers = systemSettings.maxUsersPerCompany
  return currentUsers < maxUsers
}
```

#### Max Chatbots per Company
Controls the maximum number of chatbots that can be created by a company.

**Default**: 10 chatbots

**Implementation**:
```typescript
// Check chatbot limit when creating new chatbot
const canCreateChatbot = (companyId: string) => {
  const currentChatbots = await getCompanyChatbotCount(companyId)
  const maxChatbots = systemSettings.maxChatbotsPerCompany
  return currentChatbots < maxChatbots
}
```

#### Max Companies
Controls the maximum number of companies that can be registered on the platform.

**Default**: 1000 companies

**Implementation**:
```typescript
// Check company limit when registering new company
const canRegisterCompany = async () => {
  const currentCompanies = await getTotalCompanyCount()
  const maxCompanies = systemSettings.maxCompanies
  return currentCompanies < maxCompanies
}
```

#### Max Teams per Company
Controls the maximum number of teams that can be created within a company.

**Default**: 10 teams

**Implementation**:
```typescript
// Check team limit when creating new team
const canCreateTeam = (companyId: string) => {
  const currentTeams = await getCompanyTeamCount(companyId)
  const maxTeams = systemSettings.maxTeamsPerCompany
  return currentTeams < maxTeams
}
```

### Storage Limits

#### Max Storage per Company (GB)
Controls the maximum storage space allocated to each company.

**Default**: 100 GB

**Implementation**:
```typescript
// Check storage limit when uploading files
const canUploadFile = async (companyId: string, fileSize: number) => {
  const currentStorage = await getCompanyStorageUsed(companyId)
  const maxStorage = systemSettings.maxStoragePerCompany * 1024 * 1024 * 1024 // Convert GB to bytes
  return (currentStorage + fileSize) <= maxStorage
}
```

#### Max File Size per Upload (MB)
Controls the maximum size of individual files that can be uploaded.

**Default**: 50 MB

**Implementation**:
```typescript
// Check file size limit
const validateFileSize = (file: File) => {
  const maxSize = systemSettings.maxFileSizePerUpload * 1024 * 1024 // Convert MB to bytes
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${systemSettings.maxFileSizePerUpload}MB`)
  }
  return true
}
```

#### Max Files per Upload
Controls the maximum number of files that can be uploaded in a single operation.

**Default**: 10 files

**Implementation**:
```typescript
// Check file count limit
const validateFileCount = (files: FileList) => {
  const maxFiles = systemSettings.maxFilesPerUpload
  if (files.length > maxFiles) {
    throw new Error(`Maximum ${maxFiles} files allowed per upload`)
  }
  return true
}
```

#### Max Backup Retention (Days)
Controls how long backup files are retained before automatic deletion.

**Default**: 30 days

**Implementation**:
```typescript
// Clean up old backups
const cleanupBackups = async () => {
  const retentionDays = systemSettings.maxBackupRetention
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays)
  
  await deleteBackupsOlderThan(cutoffDate)
}
```

### API Limits

#### Max API Requests per Minute
Controls the rate limiting for API requests per minute per company.

**Default**: 1000 requests/minute

**Implementation**:
```typescript
// Rate limiting middleware
const checkRateLimit = async (companyId: string) => {
  const requestsThisMinute = await getApiRequestsThisMinute(companyId)
  const maxRequests = systemSettings.maxApiRequestsPerMinute
  
  if (requestsThisMinute >= maxRequests) {
    throw new Error('Rate limit exceeded. Please try again later.')
  }
  
  return true
}
```

#### Max API Requests per Hour
Controls the rate limiting for API requests per hour per company.

**Default**: 10000 requests/hour

**Implementation**:
```typescript
// Hourly rate limiting
const checkHourlyRateLimit = async (companyId: string) => {
  const requestsThisHour = await getApiRequestsThisHour(companyId)
  const maxRequests = systemSettings.maxApiRequestsPerHour
  
  if (requestsThisHour >= maxRequests) {
    throw new Error('Hourly rate limit exceeded. Please try again later.')
  }
  
  return true
}
```

#### Max Concurrent Chats
Controls the maximum number of concurrent chat sessions allowed.

**Default**: 100 concurrent chats

**Implementation**:
```typescript
// Check concurrent chat limit
const canStartChat = async (companyId: string) => {
  const activeChats = await getActiveChatCount(companyId)
  const maxChats = systemSettings.maxConcurrentChats
  
  if (activeChats >= maxChats) {
    throw new Error('Maximum concurrent chats reached. Please wait for a chat to end.')
  }
  
  return true
}
```

#### Max Chat History (Days)
Controls how long chat history is retained before automatic deletion.

**Default**: 90 days

**Implementation**:
```typescript
// Clean up old chat history
const cleanupChatHistory = async () => {
  const retentionDays = systemSettings.maxChatHistoryDays
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays)
  
  await deleteChatHistoryOlderThan(cutoffDate)
}
```

### Subscription Limits

#### Max Free Users
Controls the maximum number of users allowed for free tier companies.

**Default**: 5 users

**Implementation**:
```typescript
// Check free tier user limit
const canAddFreeUser = (companyId: string) => {
  const currentUsers = await getCompanyUserCount(companyId)
  const maxFreeUsers = systemSettings.maxFreeUsers
  const companyPlan = await getCompanyPlan(companyId)
  
  if (companyPlan === 'free' && currentUsers >= maxFreeUsers) {
    throw new Error('Free tier user limit reached. Upgrade to add more users.')
  }
  
  return true
}
```

#### Max Free Chatbots
Controls the maximum number of chatbots allowed for free tier companies.

**Default**: 2 chatbots

**Implementation**:
```typescript
// Check free tier chatbot limit
const canCreateFreeChatbot = (companyId: string) => {
  const currentChatbots = await getCompanyChatbotCount(companyId)
  const maxFreeChatbots = systemSettings.maxFreeChatbots
  const companyPlan = await getCompanyPlan(companyId)
  
  if (companyPlan === 'free' && currentChatbots >= maxFreeChatbots) {
    throw new Error('Free tier chatbot limit reached. Upgrade to create more chatbots.')
  }
  
  return true
}
```

#### Max Pro Users
Controls the maximum number of users allowed for pro tier companies.

**Default**: 50 users

**Implementation**:
```typescript
// Check pro tier user limit
const canAddProUser = (companyId: string) => {
  const currentUsers = await getCompanyUserCount(companyId)
  const maxProUsers = systemSettings.maxProUsers
  const companyPlan = await getCompanyPlan(companyId)
  
  if (companyPlan === 'pro' && currentUsers >= maxProUsers) {
    throw new Error('Pro tier user limit reached. Contact support for enterprise options.')
  }
  
  return true
}
```

#### Max Pro Chatbots
Controls the maximum number of chatbots allowed for pro tier companies.

**Default**: 20 chatbots

**Implementation**:
```typescript
// Check pro tier chatbot limit
const canCreateProChatbot = (companyId: string) => {
  const currentChatbots = await getCompanyChatbotCount(companyId)
  const maxProChatbots = systemSettings.maxProChatbots
  const companyPlan = await getCompanyPlan(companyId)
  
  if (companyPlan === 'pro' && currentChatbots >= maxProChatbots) {
    throw new Error('Pro tier chatbot limit reached. Contact support for enterprise options.')
  }
  
  return true
}
```

### Company Selection Options

#### Default Company Plan
Controls the default subscription plan assigned to new companies.

**Default**: "free"

**Options**:
- `free` - Free tier with basic features
- `pro` - Professional tier with advanced features
- `enterprise` - Enterprise tier with full features
- `custom` - Custom tier with specific limits

**Implementation**:
```typescript
// Set default plan for new companies
const createNewCompany = async (companyData: CompanyData) => {
  const defaultPlan = systemSettings.defaultCompanyPlan
  
  const company = {
    ...companyData,
    plan: defaultPlan,
    createdAt: new Date().toISOString()
  }
  
  return await createCompany(company)
}
```

#### Company Approval Required
Controls whether new company registrations require admin approval.

**Default**: `false` (No approval required)

**Implementation**:
```typescript
// Check approval requirement
const processCompanyRegistration = async (companyData: CompanyData) => {
  const approvalRequired = systemSettings.companyApprovalRequired
  
  if (approvalRequired) {
    // Create pending company
    await createPendingCompany(companyData)
    return { status: 'pending', message: 'Company registration pending approval' }
  } else {
    // Create active company
    await createActiveCompany(companyData)
    return { status: 'active', message: 'Company registration successful' }
  }
}
```

#### Max Company Name Length
Controls the maximum number of characters allowed for company names.

**Default**: 50 characters

**Implementation**:
```typescript
// Validate company name length
const validateCompanyName = (name: string) => {
  const maxLength = systemSettings.maxCompanyNameLength
  
  if (name.length > maxLength) {
    throw new Error(`Company name must be ${maxLength} characters or less`)
  }
  
  return true
}
```

#### Max Company Description Length
Controls the maximum number of characters allowed for company descriptions.

**Default**: 500 characters

**Implementation**:
```typescript
// Validate company description length
const validateCompanyDescription = (description: string) => {
  const maxLength = systemSettings.maxCompanyDescriptionLength
  
  if (description.length > maxLength) {
    throw new Error(`Company description must be ${maxLength} characters or less`)
  }
  
  return true
}
```

## API Integration

### Fetching Limits
```typescript
// GET /api/settings
const response = await fetch('/api/settings')
const settings = await response.json()

// Access limits and quotas
const {
  maxUsersPerCompany,
  maxChatbotsPerCompany,
  maxCompanies,
  maxTeamsPerCompany,
  maxStoragePerCompany,
  maxFileSizePerUpload,
  maxFilesPerUpload,
  maxBackupRetention,
  maxApiRequestsPerMinute,
  maxApiRequestsPerHour,
  maxConcurrentChats,
  maxChatHistoryDays,
  maxFreeUsers,
  maxFreeChatbots,
  maxProUsers,
  maxProChatbots,
  defaultCompanyPlan,
  companyApprovalRequired,
  maxCompanyNameLength,
  maxCompanyDescriptionLength
} = settings
```

### Updating Limits
```typescript
// POST /api/settings
const response = await fetch('/api/settings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    maxUsersPerCompany: 200,
    maxChatbotsPerCompany: 20,
    maxCompanies: 2000,
    maxTeamsPerCompany: 20,
    maxStoragePerCompany: 200,
    maxFileSizePerUpload: 100,
    maxFilesPerUpload: 20,
    maxBackupRetention: 60,
    maxApiRequestsPerMinute: 2000,
    maxApiRequestsPerHour: 20000,
    maxConcurrentChats: 200,
    maxChatHistoryDays: 180,
    maxFreeUsers: 10,
    maxFreeChatbots: 5,
    maxProUsers: 100,
    maxProChatbots: 50,
    defaultCompanyPlan: "pro",
    companyApprovalRequired: true,
    maxCompanyNameLength: 100,
    maxCompanyDescriptionLength: 1000
  })
})
```

## Firebase Storage

Limits and quotas are stored in Firestore under the `systemSettings` collection:

```typescript
// Firestore structure
{
  // Company Limits
  maxUsersPerCompany: 100,
  maxChatbotsPerCompany: 10,
  maxCompanies: 1000,
  maxTeamsPerCompany: 10,
  
  // Storage Limits
  maxStoragePerCompany: 100,
  maxFileSizePerUpload: 50,
  maxFilesPerUpload: 10,
  maxBackupRetention: 30,
  
  // API Limits
  maxApiRequestsPerMinute: 1000,
  maxApiRequestsPerHour: 10000,
  maxConcurrentChats: 100,
  maxChatHistoryDays: 90,
  
  // Subscription Limits
  maxFreeUsers: 5,
  maxFreeChatbots: 2,
  maxProUsers: 50,
  maxProChatbots: 20,
  
  // Company Selection Options
  defaultCompanyPlan: "free",
  companyApprovalRequired: false,
  maxCompanyNameLength: 50,
  maxCompanyDescriptionLength: 500,
  
  updatedAt: "2024-01-01T00:00:00.000Z",
  updatedBy: "admin@example.com"
}
```

## Validation Rules

### Numeric Validation
All limit fields must be positive numbers:
- Minimum value: 1
- Maximum value: No upper limit (system dependent)

### Plan Validation
Default company plan must be one of:
- `free`
- `pro`
- `enterprise`
- `custom`

### Boolean Validation
Company approval required must be boolean:
- `true` - Approval required
- `false` - No approval required

## Security Considerations

1. **Admin Access Only**: Only users with admin privileges can modify limits and quotas
2. **Audit Trail**: All changes are logged with timestamp and user information
3. **Validation**: All limits are validated as positive numbers
4. **Default Fallbacks**: System provides sensible defaults if limits are missing

## Testing

### Manual Testing
Use the Limits and Quotas Test component to verify settings:

```typescript
// Test component usage
<LimitsQuotasTest />
```

### Automated Testing
```typescript
// Example test cases
describe('Limits and Quotas', () => {
  test('should load default values', async () => {
    const response = await fetch('/api/settings')
    const settings = await response.json()
    
    expect(settings.maxUsersPerCompany).toBe(100)
    expect(settings.maxChatbotsPerCompany).toBe(10)
    expect(settings.maxCompanies).toBe(1000)
    expect(settings.maxTeamsPerCompany).toBe(10)
    expect(settings.maxStoragePerCompany).toBe(100)
    expect(settings.maxFileSizePerUpload).toBe(50)
    expect(settings.maxFilesPerUpload).toBe(10)
    expect(settings.maxBackupRetention).toBe(30)
    expect(settings.maxApiRequestsPerMinute).toBe(1000)
    expect(settings.maxApiRequestsPerHour).toBe(10000)
    expect(settings.maxConcurrentChats).toBe(100)
    expect(settings.maxChatHistoryDays).toBe(90)
    expect(settings.maxFreeUsers).toBe(5)
    expect(settings.maxFreeChatbots).toBe(2)
    expect(settings.maxProUsers).toBe(50)
    expect(settings.maxProChatbots).toBe(20)
    expect(settings.defaultCompanyPlan).toBe('free')
    expect(settings.companyApprovalRequired).toBe(false)
    expect(settings.maxCompanyNameLength).toBe(50)
    expect(settings.maxCompanyDescriptionLength).toBe(500)
  })
  
  test('should validate numeric values', async () => {
    const response = await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ maxUsersPerCompany: -1 })
    })
    
    expect(response.status).toBe(400)
  })
})
```

## Error Handling

### Common Errors
1. **Invalid Number**: When negative or non-numeric values are provided
2. **Unauthorized Access**: When non-admin users try to modify limits
3. **Database Errors**: When Firestore operations fail
4. **Validation Errors**: When required fields are missing

### Error Responses
```typescript
// Example error response
{
  error: 'Max users per company must be a positive number',
  status: 400
}
```

## Performance Impact

### Caching
- Limits are cached in memory for quick access
- Cache is invalidated when limits are updated
- Default values are used as fallback

### Optimization
- Limits are loaded once per session
- Changes are batched to reduce database calls
- Validation happens on the server side

## Use Cases

### Resource Management
```typescript
// Set conservative limits for new platform
await updateSettings({
  maxUsersPerCompany: 50,
  maxChatbotsPerCompany: 5,
  maxStoragePerCompany: 50,
  maxApiRequestsPerMinute: 500
})
```

### Enterprise Scaling
```typescript
// Increase limits for enterprise customers
await updateSettings({
  maxUsersPerCompany: 1000,
  maxChatbotsPerCompany: 100,
  maxStoragePerCompany: 1000,
  maxApiRequestsPerMinute: 10000
})
```

### Performance Optimization
```typescript
// Reduce limits during high load
await updateSettings({
  maxConcurrentChats: 50,
  maxApiRequestsPerMinute: 500,
  maxFileSizePerUpload: 25
})
```

### Security Measures
```typescript
// Enable approval for new companies
await updateSettings({
  companyApprovalRequired: true,
  maxCompanies: 100
})
```

## Migration Guide

### From Previous Versions
If upgrading from a previous version without comprehensive limits:

1. **Backup existing settings**: Export current configuration
2. **Update database**: Add new limit fields with defaults
3. **Test functionality**: Verify all limits work correctly
4. **Update documentation**: Inform users of new capabilities

### Default Values Migration
```typescript
// Migration script example
const migrateLimits = async () => {
  const db = getAdminDb()
  const settingsDoc = await db.collection('systemSettings').doc('main').get()
  
  if (!settingsDoc.exists) {
    await db.collection('systemSettings').doc('main').set({
      // Company Limits
      maxUsersPerCompany: 100,
      maxChatbotsPerCompany: 10,
      maxCompanies: 1000,
      maxTeamsPerCompany: 10,
      
      // Storage Limits
      maxStoragePerCompany: 100,
      maxFileSizePerUpload: 50,
      maxFilesPerUpload: 10,
      maxBackupRetention: 30,
      
      // API Limits
      maxApiRequestsPerMinute: 1000,
      maxApiRequestsPerHour: 10000,
      maxConcurrentChats: 100,
      maxChatHistoryDays: 90,
      
      // Subscription Limits
      maxFreeUsers: 5,
      maxFreeChatbots: 2,
      maxProUsers: 50,
      maxProChatbots: 20,
      
      // Company Selection Options
      defaultCompanyPlan: "free",
      companyApprovalRequired: false,
      maxCompanyNameLength: 50,
      maxCompanyDescriptionLength: 500,
      
      createdAt: new Date().toISOString()
    })
  }
}
```

## Troubleshooting

### Common Issues

1. **Limits Not Loading**
   - Check Firebase connection
   - Verify admin authentication
   - Check browser console for errors

2. **Limits Not Saving**
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
console.log('Limits and Quotas:', limits)
console.log('Validation Errors:', errors)
```

## Future Enhancements

### Planned Features
1. **Dynamic Limits**: Adjust limits based on usage patterns
2. **Tier-Based Limits**: Different limits for different subscription tiers
3. **Usage Analytics**: Track limit usage and provide insights
4. **Auto-Scaling**: Automatically adjust limits based on demand
5. **Custom Limits**: Allow custom limits for specific companies

### API Extensions
```typescript
// Future API endpoints
GET /api/settings/limits/usage
POST /api/settings/limits/auto-scale
GET /api/settings/limits/company-specific
POST /api/settings/limits/tier-based
```

## Best Practices

### Limit Management
1. **Monitor Usage**: Track how limits are being used
2. **Gradual Changes**: Make limit changes gradually
3. **Document Changes**: Always document why limits are changed
4. **Test Impact**: Test limit changes in staging first

### Security
1. **Limit Access**: Only grant limit modification to trusted admins
2. **Audit Changes**: Log all limit modifications
3. **Validate Inputs**: Always validate limit values
4. **Test Security**: Ensure limits don't bypass security measures

### Performance
1. **Cache Limits**: Cache limit values for quick access
2. **Batch Updates**: Group multiple limit changes together
3. **Monitor Load**: Watch for performance impact of limit changes
4. **Optimize Queries**: Minimize database calls for limit checks

## Support

For issues or questions regarding Limits and Quotas:

1. **Documentation**: Check this guide first
2. **Testing**: Use the test component to verify functionality
3. **Logs**: Review server logs for detailed error information
4. **Support**: Contact system administrator for assistance

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Compatibility**: Firebase Admin SDK, Next.js 15+ 