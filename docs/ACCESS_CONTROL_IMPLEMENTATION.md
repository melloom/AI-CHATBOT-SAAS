# Access Control Implementation Guide

## Overview

This document describes the comprehensive access control implementation for the ChatHub AI platform, including IP whitelisting, domain restrictions, admin access controls, and session management.

## Access Control Features Implemented

### 1. Admin Only Access

#### Status: ✅ Fully Implemented
- **Description**: Restrict platform to admin users only
- **Configuration**: `adminOnlyAccess` in security settings
- **API Endpoint**: `/api/auth/validate`
- **Implementation**: Checks `user.isAdmin` status on all requests
- **Validation**: Real-time admin status verification

#### Usage Example:
```javascript
// Check admin access
const response = await fetch('/api/auth/validate', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

if (response.ok) {
  const data = await response.json()
  if (data.user.isAdmin) {
    console.log('User has admin access')
  } else {
    console.log('User does not have admin access')
  }
}
```

### 2. Max Concurrent Sessions

#### Status: ✅ Fully Implemented
- **Description**: Limit concurrent sessions per user (1-10)
- **Configuration**: `maxConcurrentSessions` in security settings
- **Default Value**: 3 sessions
- **API Endpoint**: `/api/auth/session`
- **Implementation**: Tracks active sessions and removes oldest when limit exceeded

#### Features:
- Automatic session tracking
- Oldest session removal when limit reached
- Session activity monitoring
- Real-time session validation

#### Usage Example:
```javascript
// Create new session
const response = await fetch('/api/auth/session', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

if (response.status === 429) {
  console.log('Concurrent session limit reached')
} else if (response.ok) {
  console.log('New session created successfully')
}
```

### 3. IP Whitelist

#### Status: ✅ Fully Implemented
- **Description**: Restrict access to specific IP addresses or CIDR ranges
- **Configuration**: `ipWhitelist` in security settings
- **Format**: Comma-separated IP addresses or CIDR ranges
- **Example**: `192.168.1.1, 10.0.0.0/8`
- **API Endpoint**: `/api/auth/ip-validation`
- **Implementation**: Validates IP against whitelist on each request

#### Supported Formats:
- Single IP: `192.168.1.1`
- CIDR Range: `10.0.0.0/8`
- Multiple IPs: `192.168.1.1, 10.0.0.0/8, 172.16.0.0/12`

#### Usage Example:
```javascript
// Check IP validation
const response = await fetch('/api/auth/ip-validation')
if (response.ok) {
  const data = await response.json()
  console.log(`IP: ${data.ip}, Allowed: ${data.allowed}`)
}
```

### 4. Allowed Email Domains

#### Status: ✅ Fully Implemented
- **Description**: Restrict registration to specific email domains
- **Configuration**: `allowedDomains` in security settings
- **Format**: Comma-separated email domains
- **Example**: `company.com, partner.com`
- **Implementation**: Validates email domain during registration

#### Features:
- Domain validation during user registration
- Real-time domain checking
- Support for multiple domains
- Clear error messages for invalid domains

#### Usage Example:
```javascript
// During user registration
const email = 'user@company.com'
const allowedDomains = 'company.com, partner.com'

const domains = allowedDomains.split(',').map(d => d.trim())
const emailDomain = email.split('@')[1]

if (domains.includes(emailDomain)) {
  console.log('Email domain is allowed')
} else {
  console.log('Email domain is not allowed')
}
```

### 5. VPN Detection (Enhanced)

#### Status: ✅ Implemented
- **Description**: Require VPN connection for access
- **Configuration**: `requireVPN` in security settings
- **Implementation**: VPN detection and validation
- **Features**: Automatic VPN detection, connection validation

### 6. Geographic Restrictions (Enhanced)

#### Status: ✅ Implemented
- **Description**: Restrict access by country/region
- **Configuration**: `geographicRestrictions` in security settings
- **Implementation**: Geographic location validation
- **Features**: Country-based access control, region restrictions

## API Endpoints

### Access Control Endpoints

#### 1. IP Validation
- **GET** `/api/auth/ip-validation`
- **Purpose**: Validate IP address against whitelist
- **Response**:
```json
{
  "ip": "192.168.1.1",
  "allowed": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 2. Authentication Validation
- **GET** `/api/auth/validate`
- **Purpose**: Validate authentication and admin status
- **Response**:
```json
{
  "valid": true,
  "user": {
    "uid": "user123",
    "email": "user@company.com",
    "isAdmin": true,
    "emailVerified": true,
    "phoneVerified": false,
    "twoFactorEnabled": true,
    "approvalStatus": "approved"
  },
  "security": {
    "ipAllowed": true,
    "emailVerified": true,
    "phoneVerified": false,
    "twoFactorEnabled": true
  }
}
```

#### 3. Session Management
- **GET** `/api/auth/session` - Get session information
- **POST** `/api/auth/session` - Create new session
- **Response**:
```json
{
  "valid": true,
  "session": {
    "sessionId": "session123",
    "userId": "user123",
    "email": "user@company.com",
    "isAdmin": true,
    "lastActivity": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4. Security Settings
- **GET** `/api/settings/security` - Get security settings
- **POST** `/api/settings/security` - Update security settings

## Database Schema

### Security Settings Collection
```javascript
{
  // Access Control
  adminOnlyAccess: boolean,
  ipWhitelist: string,
  allowedDomains: string,
  maxConcurrentSessions: number,
  requireVPN: boolean,
  geographicRestrictions: boolean,
  
  // Other settings...
  updatedAt: string,
  updatedBy: string
}
```

### User Sessions Collection
```javascript
{
  userId: string,
  sessionId: string,
  ipAddress: string,
  userAgent: string,
  createdAt: Date,
  lastActivity: Date,
  expiresAt: Date
}
```

### Login Attempts Collection
```javascript
{
  userId: string,
  email: string,
  ipAddress: string,
  timestamp: Date,
  success: boolean,
  userAgent: string
}
```

## Implementation Details

### 1. IP Whitelist Validation

#### Algorithm:
```javascript
function isValidIPOrCIDR(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}(\/\d{1,3})?$/
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

function isIPInRange(ip: string, cidr: string): boolean {
  if (!cidr.includes('/')) {
    return ip === cidr
  }

  const [network, bits] = cidr.split('/')
  const networkParts = network.split('.').map(Number)
  const ipParts = ip.split('.').map(Number)
  
  const mask = parseInt(bits)
  const networkNum = (networkParts[0] << 24) + (networkParts[1] << 16) + (networkParts[2] << 8) + networkParts[3]
  const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3]
  
  const maskNum = mask === 32 ? -1 : ~((1 << (32 - mask)) - 1)
  
  return (networkNum & maskNum) === (ipNum & maskNum)
}
```

### 2. Session Management

#### Session Creation:
```javascript
async function createUserSession(userId: string, sessionId: string, ipAddress: string, userAgent: string) {
  const settings = await getSecuritySettings()
  const now = new Date()
  const sessionTimeoutMs = parseDuration(settings.sessionTimeout)
  const expiresAt = new Date(now.getTime() + sessionTimeoutMs)

  await db.collection('userSessions').doc(sessionId).set({
    userId,
    sessionId,
    ipAddress,
    userAgent,
    createdAt: now,
    lastActivity: now,
    expiresAt
  })
}
```

#### Concurrent Session Management:
```javascript
async function checkConcurrentSessions(userId: string, sessionId: string) {
  const settings = await getSecuritySettings()
  const now = new Date()

  const activeSessions = await db.collection('userSessions')
    .where('userId', '==', userId)
    .where('expiresAt', '>', now)
    .get()

  const sessionCount = activeSessions.docs.length

  if (sessionCount >= settings.maxConcurrentSessions) {
    const oldestSession = activeSessions.docs.reduce((oldest, current) => {
      const oldestData = oldest.data()
      const currentData = current.data()
      return oldestData.lastActivity < currentData.lastActivity ? oldest : current
    })

    await db.collection('userSessions').doc(oldestSession.id).delete()
  }

  return true
}
```

### 3. Domain Validation

#### Domain Checking:
```javascript
async function validateDomain(email: string): Promise<boolean> {
  const settings = await getSecuritySettings()
  if (!settings.allowedDomains || settings.allowedDomains.trim() === '') {
    return true // No domain restrictions
  }

  const emailDomain = email.split('@')[1]
  const allowedDomains = settings.allowedDomains.split(',').map(domain => domain.trim())
  
  return allowedDomains.some(domain => emailDomain === domain)
}
```

## Testing

### Access Control Test Suite

The `AccessControlTest` component provides comprehensive testing for all access control features:

1. **IP Whitelist Validation** - Tests IP address validation against whitelist
2. **Domain Restrictions** - Tests email domain validation
3. **Admin Access Control** - Tests admin privilege verification
4. **Session Management** - Tests session creation and validation
5. **Concurrent Sessions** - Tests concurrent session limits
6. **VPN Detection** - Tests VPN connection detection
7. **Geographic Restrictions** - Tests location-based access control
8. **Access Logging** - Tests audit logging functionality

### Running Tests

```javascript
// The AccessControlTest component automatically runs tests when triggered
// Results are displayed with pass/fail/warning status for each test
```

## Security Best Practices

### 1. IP Whitelisting
- Use specific IP addresses for critical systems
- Implement CIDR ranges for office networks
- Regularly review and update whitelist
- Monitor access attempts from non-whitelisted IPs

### 2. Domain Restrictions
- Restrict registration to company domains only
- Implement domain verification
- Monitor registration attempts from unauthorized domains
- Regular domain list maintenance

### 3. Session Management
- Implement automatic session timeout
- Limit concurrent sessions per user
- Monitor session anomalies
- Implement session invalidation on logout

### 4. Admin Access Control
- Implement role-based access control
- Regular admin privilege reviews
- Monitor admin actions
- Implement admin activity logging

### 5. VPN Requirements
- Require VPN for sensitive operations
- Implement VPN detection
- Monitor VPN connection status
- Provide clear VPN requirements

### 6. Geographic Restrictions
- Implement country-based access control
- Monitor access from restricted regions
- Regular geographic policy reviews
- Clear communication of restrictions

## Monitoring and Alerts

### Access Control Events
- Failed IP validation attempts
- Domain restriction violations
- Admin access attempts
- Session limit violations
- VPN connection failures
- Geographic restriction violations

### Audit Logging
- All access control events are logged
- User actions are tracked
- System changes are recorded
- Compliance reporting

### Alerts
- Real-time access control alerts
- Email notifications for violations
- Dashboard for access monitoring
- Automated response to threats

## Troubleshooting

### Common Issues

1. **IP Whitelist Issues**
   - Check IP address format
   - Verify CIDR notation
   - Check network configuration
   - Monitor access logs

2. **Domain Restriction Issues**
   - Verify domain format
   - Check domain list configuration
   - Monitor registration attempts
   - Review domain policies

3. **Session Management Issues**
   - Check session timeout settings
   - Verify concurrent session limits
   - Monitor session storage
   - Review session policies

4. **Admin Access Issues**
   - Verify admin privileges
   - Check role assignments
   - Monitor admin actions
   - Review access policies

### Debug Mode
Enable debug mode for detailed logging:
```javascript
// Set debug mode in security settings
{
  debugMode: true,
  enableAuditLogs: true
}
```

## Configuration Examples

### Basic Access Control
```javascript
{
  adminOnlyAccess: false,
  ipWhitelist: "",
  allowedDomains: "company.com, partner.com",
  maxConcurrentSessions: 3,
  requireVPN: false,
  geographicRestrictions: false
}
```

### Strict Access Control
```javascript
{
  adminOnlyAccess: true,
  ipWhitelist: "192.168.1.1, 10.0.0.0/8",
  allowedDomains: "company.com",
  maxConcurrentSessions: 1,
  requireVPN: true,
  geographicRestrictions: true
}
```

### Enterprise Access Control
```javascript
{
  adminOnlyAccess: false,
  ipWhitelist: "192.168.1.0/24, 10.0.0.0/8, 172.16.0.0/12",
  allowedDomains: "company.com, subsidiary.com, partner.com",
  maxConcurrentSessions: 5,
  requireVPN: true,
  geographicRestrictions: true
}
```

## Conclusion

This access control implementation provides comprehensive protection for the ChatHub AI platform, including:

- ✅ IP whitelisting with CIDR support
- ✅ Domain restrictions for user registration
- ✅ Admin-only access controls
- ✅ Concurrent session management
- ✅ VPN detection and requirements
- ✅ Geographic restrictions
- ✅ Comprehensive testing and monitoring
- ✅ Audit logging and compliance

All features are fully functional and integrated with the existing security system. The implementation follows security best practices and provides the foundation for enterprise-grade access control. 