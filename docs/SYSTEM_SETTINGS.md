# System Settings Documentation

## Overview

The System Settings module provides comprehensive platform configuration capabilities for administrators. It includes settings for security, maintenance, database management, notifications, and platform-wide configurations.

## Features

### 🔧 General System Settings
- Platform configuration (name, URL, branding)
- System preferences (timezone, language, date formats)
- Feature toggles and access controls
- User limits and quotas
- Contact information and support details

### 🛡️ Security Settings
- Authentication configuration (2FA, social login)
- Password policies and requirements
- Access control and IP whitelisting
- Security headers configuration
- API security and rate limiting
- Data protection and encryption
- Compliance settings (GDPR, CCPA, HIPAA, SOX)

### 🔧 Maintenance Settings
- Maintenance mode controls
- Scheduled maintenance windows
- Access control during maintenance
- Notification settings for maintenance
- Maintenance page customization
- System maintenance tasks

### 🗄️ Database Settings
- Database connection configuration
- Backup settings and automation
- Performance optimization
- Security and encryption
- Maintenance and monitoring
- Connection pooling and caching

### 📧 Notification Settings
- Email configuration (SMTP, templates)
- SMS integration
- Push notifications
- In-app notifications
- User and admin notification preferences
- Quiet hours and preferences

### 🌐 Platform Settings
- Third-party integrations
- Payment configuration
- API settings and rate limiting
- Feature flags and toggles
- Customization options
- Legal and compliance settings

## Components

### Main Settings Page
**File:** `app/dashboard/admin/settings/page.tsx`

The main settings page provides:
- Tabbed interface for different setting categories
- Quick action cards for common tasks
- System status overview
- Status badges for different system components

### Settings Forms

#### 1. System Settings Form
**File:** `components/settings/system-settings-form.tsx`

Features:
- Platform configuration (name, URL, branding)
- System preferences (timezone, language, formats)
- Feature toggles (maintenance mode, debug mode, etc.)
- User limits and quotas
- Contact information
- System announcements

#### 2. Security Settings Form
**File:** `components/settings/security-settings-form.tsx`

Features:
- Authentication settings (2FA, social login, verification)
- Password policies (length, complexity, expiry)
- Access control (IP whitelisting, session limits)
- Security headers (CSP, HSTS, XSS protection)
- API security (rate limiting, authentication)
- Data protection (encryption, audit logs)
- Compliance settings (GDPR, CCPA, HIPAA, SOX)

#### 3. Maintenance Settings Form
**File:** `components/settings/maintenance-settings-form.tsx`

Features:
- Maintenance mode controls
- Scheduled maintenance windows
- Access control during maintenance
- Notification settings
- Maintenance page customization
- System maintenance tasks

#### 4. Database Settings Form
**File:** `components/settings/database-settings-form.tsx`

Features:
- Database connection configuration
- Backup settings and automation
- Performance optimization
- Security and encryption
- Maintenance and monitoring
- Connection pooling and caching

#### 5. Notification Settings Form
**File:** `components/settings/notification-settings-form.tsx`

Features:
- Email configuration (SMTP, templates)
- SMS integration
- Push notifications
- In-app notifications
- User and admin notification preferences
- Quiet hours and preferences

#### 6. Platform Settings Form
**File:** `components/settings/platform-settings-form.tsx`

Features:
- Third-party integrations
- Payment configuration
- API settings and rate limiting
- Feature flags and toggles
- Customization options
- Legal and compliance settings

### Maintenance Page Component
**File:** `components/maintenance/maintenance-page.tsx`

A comprehensive maintenance page component that can be used company-wide during system maintenance.

Features:
- Customizable title, subtitle, and message
- Progress bar with estimated completion time
- Contact information display
- Social media links
- Custom themes (dark/light/auto)
- Custom CSS and JavaScript injection
- Real-time clock display
- Refresh functionality

## Usage

### Accessing System Settings

1. Navigate to the admin dashboard
2. Click on "Settings" in the sidebar
3. Use the tabbed interface to access different setting categories

### Quick Actions

The settings page provides quick action cards for common tasks:
- **Backup Database**: Create a full system backup
- **Security Scan**: Run security vulnerability scan
- **Clear Cache**: Clear system cache and temp files
- **System Health**: Check system health status

### Maintenance Mode

To enable maintenance mode:

1. Go to the "Maintenance" tab
2. Configure maintenance settings
3. Set maintenance message and appearance
4. Configure access controls
5. Set up notifications
6. Click "Enable Maintenance"

### Maintenance Page Customization

The maintenance page can be customized with:

```tsx
<MaintenancePage
  title="Scheduled Maintenance"
  subtitle="We're working to improve your experience"
  message="We're performing scheduled maintenance to enhance our platform."
  estimatedTime="2 hours"
  progress={45}
  theme="dark"
  showProgress={true}
  showEstimatedTime={true}
  showContactInfo={true}
  showSocialLinks={true}
  contactEmail="support@company.com"
  contactPhone="+1 (555) 123-4567"
  socialLinks={{
    twitter: "https://twitter.com/company",
    facebook: "https://facebook.com/company",
    linkedin: "https://linkedin.com/company"
  }}
  customCSS=".custom-class { color: red; }"
  customJS="console.log('Custom JS loaded');"
/>
```

## Configuration

### Environment Variables

Add these environment variables to your `.env.local`:

```env
# Database
DATABASE_URL=your_database_url
DATABASE_TYPE=firestore

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=noreply@company.com

# Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Payment
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Third-party Services
GOOGLE_ANALYTICS_ID=your_ga_id
GOOGLE_TAG_MANAGER_ID=your_gtm_id
FACEBOOK_PIXEL_ID=your_pixel_id
```

### API Routes

The system settings use the following API routes:

- `GET /api/settings` - Get current settings
- `POST /api/settings` - Update settings
- `POST /api/settings/test-email` - Test email configuration
- `POST /api/settings/test-payment` - Test payment configuration
- `POST /api/settings/backup` - Create database backup
- `POST /api/settings/maintenance` - Toggle maintenance mode

## Security Considerations

### Access Control
- All settings pages require admin authentication
- IP whitelisting for maintenance mode
- Session timeout configuration
- Two-factor authentication for sensitive operations

### Data Protection
- Settings are encrypted at rest
- API keys and secrets are properly secured
- Audit logging for all setting changes
- Backup encryption for sensitive data

### Compliance
- GDPR compliance settings
- CCPA compliance options
- HIPAA compliance for healthcare data
- SOX compliance for financial data

## Performance Optimization

### Caching
- Settings are cached in memory
- Database connection pooling
- Query result caching
- Static asset optimization

### Monitoring
- Performance monitoring enabled
- Slow query logging
- Connection monitoring
- Disk space monitoring

## Troubleshooting

### Common Issues

1. **Settings not saving**
   - Check admin permissions
   - Verify API endpoint accessibility
   - Check browser console for errors

2. **Email not working**
   - Verify SMTP credentials
   - Check firewall settings
   - Test with different email providers

3. **Maintenance mode not working**
   - Check IP whitelist settings
   - Verify bypass codes
   - Check admin access settings

4. **Database connection issues**
   - Verify database credentials
   - Check network connectivity
   - Review connection pool settings

### Debug Mode

Enable debug mode in system settings to get detailed error messages and logging information.

## Future Enhancements

### Planned Features
- Advanced analytics dashboard
- Automated backup scheduling
- Multi-region deployment support
- Advanced security scanning
- Custom webhook configurations
- Advanced notification templates
- Real-time system monitoring
- Automated maintenance scheduling

### Integration Opportunities
- Slack notifications
- Microsoft Teams integration
- PagerDuty integration
- Jira integration
- GitHub integration
- AWS CloudWatch integration
- Google Cloud Monitoring
- Azure Application Insights

## Support

For technical support or questions about the system settings:

- **Email**: support@chathub.ai
- **Documentation**: [Link to documentation]
- **GitHub Issues**: [Link to repository]
- **Community Forum**: [Link to forum]

## Contributing

To contribute to the system settings module:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This system settings module is part of the ChatHub AI platform and is licensed under the MIT License. 