# Test Admin Account Guide

## Overview

A test admin account has been created with read-only permissions that allows testers to view all admin features without being able to make any changes.

## Test Account Credentials

- **Email**: `tester@chathub.com`
- **Password**: `Test123!`
- **Role**: Read-Only Admin
- **User ID**: `OVc9r9gegDfqIRGBUGxBcvUHKmn1`

## What the Test Account Can Do

### ✅ View Access (Full Admin View)
- View all users and their details
- View all companies and their information
- View all chatbots and configurations
- View all analytics and reports
- View all system settings
- View all subscriptions and billing information
- View all notifications and logs
- Export data (CSV exports)
- Navigate through all admin pages
- **Impersonate companies in view-only mode**

### ❌ Restricted Actions (Cannot Perform)
- Create new users
- Edit existing users
- Delete users
- Import users
- Bulk user operations (activate, deactivate, approve)
- Create new chatbots
- Edit existing chatbots
- Delete chatbots
- Modify system settings
- Change security configurations
- Update notification settings
- Modify platform settings
- Perform system maintenance operations
- **Switch to edit mode during impersonation**

## Visual Indicators

When logged in as the test account, you will see:

1. **Read-Only Alert Banner**: A prominent orange banner at the top of admin pages indicating read-only mode
2. **Disabled Buttons**: All action buttons (Create, Edit, Delete, Import, etc.) will be disabled with tooltips explaining why
3. **Read-Only Badge**: A small "Read-Only Mode" badge next to action buttons
4. **Impersonation Mode**: Can impersonate companies but only in view mode (edit mode is disabled)

## Error Messages

If a test account tries to perform a write operation, they will receive clear error messages like:
- "Unauthorized - Read-only access only. Cannot create users."
- "Unauthorized - Read-only access only. Cannot modify settings."

## Security Features

### API-Level Protection
- All POST, PUT, DELETE, and PATCH API endpoints check for read-only permissions
- Write operations are blocked at the server level, not just UI level
- Clear error responses when write operations are attempted

### Database-Level Protection
- The user document has `isReadOnly: true` flag
- Permissions array only includes view permissions
- Write permissions array is explicitly empty

## Testing Scenarios

### For Testers
1. **Login**: Use the test credentials to access the admin dashboard
2. **Navigation**: Verify you can access all admin pages and view data
3. **UI Testing**: Confirm buttons are disabled and tooltips appear
4. **Error Handling**: Try to perform actions and verify error messages
5. **Data Export**: Test that export functionality still works
6. **Impersonation**: Test impersonating companies in view-only mode

### For Developers
1. **API Testing**: Verify all write endpoints return 403 errors for read-only users
2. **Permission Testing**: Test the `canWrite()` function with different user types
3. **UI Testing**: Verify all write buttons are properly disabled
4. **Error Message Testing**: Confirm clear, user-friendly error messages

## Creating Additional Test Accounts

To create more test accounts, modify the `scripts/create-test-admin.js` file and run:

```bash
node scripts/create-test-admin.js
```

## Technical Implementation

### Key Files Modified
- `lib/firebase-admin.ts` - Added `canWrite()` function
- `app/api/users/route.ts` - Added write permission checks
- `app/api/chatbots/route.ts` - Added write permission checks
- `app/api/settings/security/route.ts` - Added write permission checks
- `components/ui/read-only-indicator.tsx` - Created UI indicators
- `app/dashboard/admin/layout.tsx` - Added read-only alert
- `app/dashboard/admin/users/page.tsx` - Disabled buttons for read-only users

### Permission System
- `isAdmin: true` - Grants admin access
- `isReadOnly: true` - Restricts to read-only operations
- `permissions: ['view_*']` - Only view permissions
- `writePermissions: []` - No write permissions

## Troubleshooting

### If the test account can't login:
1. Check if the user was created successfully in Firebase
2. Verify the email and password are correct
3. Check if the user document exists in Firestore

### If the test account can perform write operations:
1. Verify the `isReadOnly: true` flag is set in the user document
2. Check that API routes are properly checking the `canWrite()` function
3. Ensure the frontend is properly disabling buttons

### If buttons are not disabled:
1. Check that the `useAuth()` hook is returning the correct profile data
2. Verify the `isReadOnly` flag is being passed to components
3. Ensure the `ReadOnlyIndicator` component is being used correctly 