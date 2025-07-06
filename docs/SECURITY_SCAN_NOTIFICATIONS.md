# Security Scan Notifications

## Overview

The security scan system now automatically sends notifications to all admin users when security scans are completed. This ensures that administrators are immediately aware of scan results and can take appropriate action.

## Features

### Automatic Admin Notifications

When a security scan completes (either successfully or with failures), the system automatically:

1. **Identifies all admin users** in the system
2. **Sends notifications** to each admin user with scan results
3. **Provides actionable links** to view detailed scan reports
4. **Includes metadata** about the scan for context

### Notification Types

#### Successful Scans
- **Type**: `success` or `warning`
- **Priority**: `medium` (clean scan) or `high` (vulnerabilities found)
- **Content**: Scan completion status, vulnerability count, risk score
- **Action**: Link to security settings page

#### Failed Scans
- **Type**: `error`
- **Priority**: `urgent`
- **Content**: Error message and scan ID
- **Action**: Link to security settings page

## Implementation Details

### New Functions Added

#### `getAllAdminUsers()`
- Retrieves all users with `isAdmin: true`
- Returns array of admin user objects

#### `sendNotificationToAllAdmins(notificationData)`
- Sends notifications to all admin users
- Handles errors gracefully (doesn't fail scan if notification fails)
- Returns array of notification IDs

### Integration Points

#### Security Scan Completion
```typescript
// In performSecurityScan function
await sendNotificationToAllAdmins({
  title: `Security Scan ${scanResult}`,
  message: `Security scan ${scanId} has ${scanResult}. Found ${failedChecks} vulnerabilities out of ${totalChecks} checks. Risk score: ${riskScore.toFixed(1)}/100.`,
  type: severity,
  priority: priority,
  actionUrl: `/dashboard/admin/settings?tab=security`,
  actionText: 'View Details',
  metadata: {
    scanId,
    totalChecks,
    passedChecks,
    failedChecks,
    riskScore,
    duration
  }
})
```

#### Security Scan Failure
```typescript
// In error handling
await sendNotificationToAllAdmins({
  title: 'Security Scan Failed',
  message: `Security scan ${scanId} has failed. Error: ${errorMessage}`,
  type: 'error',
  priority: 'urgent',
  actionUrl: `/dashboard/admin/settings?tab=security`,
  actionText: 'View Details',
  metadata: {
    scanId,
    error: errorMessage
  }
})
```

## Notification Content

### Success Notification (No Vulnerabilities)
- **Title**: "Security Scan completed successfully"
- **Message**: "Security scan [scanId] has completed successfully. Found 0 vulnerabilities out of [total] checks. Risk score: [score]/100."
- **Type**: `success`
- **Priority**: `medium`

### Warning Notification (Vulnerabilities Found)
- **Title**: "Security Scan completed with issues"
- **Message**: "Security scan [scanId] has completed with issues. Found [count] vulnerabilities out of [total] checks. Risk score: [score]/100."
- **Type**: `warning`
- **Priority**: `high`

### Error Notification (Scan Failed)
- **Title**: "Security Scan Failed"
- **Message**: "Security scan [scanId] has failed. Error: [error message]"
- **Type**: `error`
- **Priority**: `urgent`

## Error Handling

- Notifications are sent asynchronously and don't block scan completion
- If notification sending fails, the error is logged but doesn't affect the scan result
- Graceful degradation ensures scan functionality remains intact

## Usage

### For Administrators

1. **Start a security scan** from the admin dashboard
2. **Receive automatic notifications** when scan completes
3. **Click "View Details"** in notification to see full report
4. **Review vulnerabilities** and take action as needed

### For Developers

The notification system is automatically integrated into the security scan workflow. No additional configuration is required.

## Configuration

### Environment Variables
No additional environment variables are required. The system uses existing Firebase configuration.

### Database Requirements
- Admin users must have `isAdmin: true` in their user document
- Notifications collection must be accessible to admin users

## Testing

To test the notification system:

1. Start a security scan as an admin user
2. Wait for scan completion
3. Check notification bell for new notifications
4. Verify notification content and action links work correctly

## Troubleshooting

### Common Issues

1. **No notifications received**
   - Verify user has admin privileges (`isAdmin: true`)
   - Check Firebase permissions for notifications collection
   - Review server logs for notification errors

2. **Notification errors**
   - Check Firebase Admin SDK configuration
   - Verify service account credentials
   - Review error logs for specific issues

### Debug Information

The system logs detailed information about notification sending:
- Number of admin users found
- Notification IDs created
- Any errors during notification sending

## Future Enhancements

Potential improvements to consider:

1. **Email notifications** in addition to in-app notifications
2. **Customizable notification preferences** for admins
3. **Scheduled scan notifications** for regular security audits
4. **Integration with external security tools** for enhanced reporting 