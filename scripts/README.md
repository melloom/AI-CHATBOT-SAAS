# User Management Scripts

This directory contains scripts to manage and fix user-company relationships in the SaaS application.

## Scripts

### 1. `fix-orphaned-users.js`
**Purpose:** Basic script to create companies for users who don't have them.

**Usage:**
```bash
npm run fix:orphaned-users
```

**What it does:**
- Finds all users without companies
- Creates companies for orphaned users
- Updates user documents with company IDs
- Sets approval status to 'pending'

### 2. `auto-fix-users.js`
**Purpose:** Comprehensive script for automated user fixing with detailed reporting.

**Usage:**
```bash
npm run auto:fix-users
```

**What it does:**
- Finds orphaned users (no companies)
- Finds pending users without companies
- Creates companies for users that need them
- Provides detailed statistics and error reporting
- Can be run as a cron job or scheduled task

## Features

### Error Handling
- Graceful error handling for individual users
- Continues processing even if some users fail
- Detailed error reporting

### Logging
- Comprehensive console logging with emojis
- Progress tracking for each user
- Summary statistics at the end

### Safety Features
- Checks for existing companies before creating new ones
- Validates user data before processing
- Prevents duplicate company creation

## Cron Job Setup

To run the auto-fix script automatically, you can set up a cron job:

```bash
# Edit crontab
crontab -e

# Add this line to run every hour
0 * * * * cd /path/to/your/project && npm run auto:fix-users >> /var/log/user-fix.log 2>&1

# Or run every 15 minutes
*/15 * * * * cd /path/to/your/project && npm run auto:fix-users >> /var/log/user-fix.log 2>&1
```

## Environment Variables

Make sure these environment variables are set:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Output Examples

### Successful Run
```
🚀 Auto-fix users script started at 2024-01-15T10:30:00.000Z
📊 Found 25 total users
🏢 Found 20 total companies
⚠️  Found 5 orphaned users
⏳ Found 3 pending users without companies
🔧 Total users needing fix: 5
🔄 Processing user: user1@example.com (abc123)
✅ Created company for user1@example.com (Company ID: def456)
...
📈 Summary:
✅ Successfully created companies for 5 users
❌ Failed to create companies for 0 users
📊 Total users processed: 5
⏱️  Script duration: 2500ms
🎉 Success! Users now have companies and can be approved.
```

### No Users Need Fixing
```
🚀 Auto-fix users script started at 2024-01-15T10:30:00.000Z
📊 Found 25 total users
🏢 Found 25 total companies
⚠️  Found 0 orphaned users
⏳ Found 0 pending users without companies
🔧 Total users needing fix: 0
✅ No users need fixing! All users have proper company associations.
```

## Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check environment variables
   - Verify Firebase project configuration

2. **Permission Errors**
   - Ensure Firebase security rules allow read/write
   - Check service account permissions

3. **Script Hangs**
   - Check network connectivity
   - Verify Firebase project is accessible

### Debug Mode

To run with more verbose logging, you can modify the scripts to include additional console.log statements or use a debug flag.

## Integration with Admin Panel

These scripts work alongside the admin debug panel at `/dashboard/admin/debug-approvals` which provides a web interface for similar functionality.

## Security Notes

- Scripts should be run in a secure environment
- Consider using Firebase Admin SDK for production
- Log files should be secured and rotated
- Monitor script execution for unusual patterns 