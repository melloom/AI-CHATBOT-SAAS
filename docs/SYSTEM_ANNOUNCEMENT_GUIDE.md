# System Announcement Feature Guide

## Overview

The System Announcement feature allows administrators to display system-wide announcements to all users in the platform. This feature provides a way to communicate important updates, maintenance notices, or general information to all users simultaneously.

## Features

### ✅ What's Implemented

1. **Admin Controls**
   - Enable/disable announcements
   - Set announcement message
   - Choose announcement type (info, success, warning, error)
   - Set optional expiry date
   - Save settings to database

2. **User Display**
   - Announcements appear at the top of all dashboard pages
   - Different styling based on announcement type
   - Dismissible announcements (per session)
   - Automatic expiry handling

3. **API Integration**
   - RESTful API for saving/loading settings
   - Firebase authentication integration
   - Admin-only access control
   - Automatic notification creation for all users

## How to Use

### For Administrators

1. **Access System Settings**
   - Navigate to `/dashboard/admin/settings`
   - Go to the "General" tab
   - Scroll down to the "System Announcement" section

2. **Configure Announcement**
   - Toggle "Enable Announcement" to turn on the feature
   - Enter your announcement message in the text area
   - Select the announcement type:
     - **Info**: General information (blue)
     - **Success**: Positive updates (green)
     - **Warning**: Important notices (yellow)
     - **Error**: Critical issues (red)
   - Optionally set an expiry date/time

3. **Save Settings**
   - Click "Save Settings" to apply the announcement
   - The announcement will immediately appear to all users

### For Users

1. **Viewing Announcements**
   - Announcements appear at the top of all dashboard pages
   - They are styled according to the announcement type
   - Users can dismiss announcements by clicking the X button

2. **Dismissal Behavior**
   - Dismissed announcements won't show again in the current session
   - Dismissal is stored in localStorage
   - New announcements will still appear even if previous ones were dismissed

## Technical Implementation

### Components

1. **SystemAnnouncement Component** (`components/ui/system-announcement.tsx`)
   - Fetches announcement data from API
   - Handles display logic and dismissal
   - Supports different announcement types

2. **SystemSettingsForm Component** (`components/settings/system-settings-form.tsx`)
   - Admin interface for managing announcements
   - Includes enable/disable toggle
   - Type selection and expiry date controls

3. **API Route** (`app/api/settings/route.ts`)
   - Handles saving and loading system settings
   - Includes authentication and admin checks
   - Creates notifications for all users when announcement is enabled

### Database Structure

The system settings are stored in Firestore:

```javascript
// Collection: systemSettings
// Document: main
{
  systemAnnouncement: "Your announcement message",
  announcementEnabled: true,
  announcementType: "info", // "info" | "success" | "warning" | "error"
  announcementExpiry: "2024-01-15T10:00:00Z", // optional
  // ... other system settings
}
```

### Integration Points

1. **Dashboard Layout** (`app/dashboard/layout.tsx`)
   - SystemAnnouncement component is included in the main layout
   - Appears on all dashboard pages

2. **Authentication**
   - Uses Firebase authentication
   - Admin-only access for settings
   - User token validation for API calls

## Security Considerations

1. **Access Control**
   - Only admins can modify system announcements
   - API routes validate admin status
   - User authentication required for all operations

2. **Data Validation**
   - Input validation on announcement content
   - Type checking for announcement types
   - Date validation for expiry settings

## Future Enhancements

### Planned Features

1. **Scheduled Announcements**
   - Set future start/end times
   - Recurring announcements
   - Timezone-aware scheduling

2. **Targeted Announcements**
   - Send to specific companies
   - User role-based announcements
   - Custom audience selection

3. **Rich Content**
   - HTML/markdown support
   - Image attachments
   - Action buttons in announcements

4. **Analytics**
   - Track announcement views
   - Dismissal rates
   - User engagement metrics

5. **Templates**
   - Pre-built announcement templates
   - Quick action buttons
   - Common announcement types

### Advanced Features

1. **Multi-language Support**
   - Localized announcement content
   - Language-specific targeting
   - Translation management

2. **A/B Testing**
   - Test different announcement content
   - Performance tracking
   - Optimization tools

3. **Integration with Other Systems**
   - Slack notifications
   - Email announcements
   - SMS notifications

## Troubleshooting

### Common Issues

1. **Announcement Not Appearing**
   - Check if announcement is enabled
   - Verify expiry date hasn't passed
   - Clear browser localStorage if testing dismissal

2. **Admin Can't Save Settings**
   - Ensure user has admin privileges
   - Check Firebase authentication
   - Verify API endpoint accessibility

3. **API Errors**
   - Check Firebase configuration
   - Verify environment variables
   - Review server logs for details

### Debug Mode

Enable debug mode in system settings to get detailed error messages and logging information.

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository. 