# Test Accounts Guide

This guide helps you create and test accounts for different platform combinations.

## Test Account Scenarios

### 1. Personal AI Only Account
- **Email**: `personal-ai-test@example.com`
- **Password**: `test123456`
- **Platforms**: Personal AI only
- **Expected Behavior**: 
  - Can access Personal AI dashboard
  - Should see Personal AI specific navigation
  - No access to WebVault or ChatHub

### 2. WebVault Only Account
- **Email**: `webvault-test@example.com`
- **Password**: `test123456`
- **Platforms**: WebVault only
- **Expected Behavior**:
  - Can access WebVault dashboard
  - Should see WebVault specific navigation
  - No access to Personal AI or ChatHub

### 3. ChatHub Only Account
- **Email**: `chathub-test@example.com`
- **Password**: `test123456`
- **Platforms**: ChatHub only
- **Expected Behavior**:
  - Can access ChatHub dashboard
  - Should see ChatHub specific navigation
  - No access to Personal AI or WebVault

### 4. Personal AI + WebVault Account
- **Email**: `personal-webvault@example.com`
- **Password**: `test123456`
- **Platforms**: Personal AI + WebVault
- **Expected Behavior**:
  - Can access both Personal AI and WebVault
  - Should see unified dashboard with both platforms
  - No access to ChatHub

### 5. Personal AI + ChatHub Account
- **Email**: `personal-chathub@example.com`
- **Password**: `test123456`
- **Platforms**: Personal AI + ChatHub
- **Expected Behavior**:
  - Can access both Personal AI and ChatHub
  - Should see unified dashboard with both platforms
  - No access to WebVault

### 6. WebVault + ChatHub Account
- **Email**: `webvault-chathub@example.com`
- **Password**: `test123456`
- **Platforms**: WebVault + ChatHub
- **Expected Behavior**:
  - Can access both WebVault and ChatHub
  - Should see unified dashboard with both platforms
  - No access to Personal AI
  - **Auto-approved** because WebVault access grants approval for additional platforms
  - Should see platform switcher in sidebar
  - No approval waiting screen

### 7. All Platforms Account
- **Email**: `all-platforms@example.com`
- **Password**: `test123456`
- **Platforms**: Personal AI + WebVault + ChatHub
- **Expected Behavior**:
  - Can access all three platforms
  - Should see complete unified dashboard
  - Full access to all features

## Manual Test Account Creation

### Step 1: Create Personal AI Account
1. Go to `/personal-ai-agents`
2. Click "Login to Dashboard"
3. Click "Register"
4. Select "Personal AI" account type
5. Fill in: `personal-ai-test@example.com` / `test123456`
6. Complete registration

### Step 2: Create WebVault Account
1. Go to `/web-building/home`
2. Click "Register" in header
3. Select "Business" account type
4. Fill in: `webvault-test@example.com` / `test123456`
5. Complete registration

### Step 3: Create ChatHub Account
1. Go to `/` (main page)
2. Click "Get Started" or "Sign Up"
3. Select "Business" account type
4. Fill in: `chathub-test@example.com` / `test123456`
5. Complete registration

### Step 4: Test Multi-Platform Registration
1. Use existing account: `personal-ai-test@example.com`
2. Try to register for WebVault
3. Should get message: "You already have access to webvault. Please log in instead."
4. Login with existing credentials
5. Should see both Personal AI and WebVault in dashboard

## Approval System Logic

### Auto-Approval Rules
1. **Personal AI accounts**: Always auto-approved
2. **WebVault accounts**: Always auto-approved
3. **Users with existing WebVault access**: Auto-approved for additional platforms
4. **ChatHub-only accounts**: Require manual approval

### Platform Access Rules
- Only platforms with `status: 'active'` are shown in navigation
- Pending platforms are hidden until approved
- Users with any approved platform can access dashboard

## Testing Checklist

### ✅ Registration Flow
- [ ] New users can register for each platform separately
- [ ] Existing users get redirected to login when trying to register for same platform
- [ ] Platform access is properly tracked in user profile
- [ ] Account types (Personal AI vs Business) are correctly set

### ✅ Login Flow
- [ ] Users can login with same credentials across platforms
- [ ] Dashboard shows correct platform access
- [ ] Navigation shows appropriate menu items based on platform access
- [ ] Users can access all platforms they're registered for

### ✅ Platform Access
- [ ] Personal AI accounts are auto-approved
- [ ] Business accounts require approval
- [ ] Platform-specific features are accessible
- [ ] Users can't access platforms they're not registered for

### ✅ Dashboard Navigation
- [ ] Personal AI accounts see Personal AI specific navigation
- [ ] WebVault accounts see WebVault specific navigation
- [ ] Multi-platform accounts see unified navigation
- [ ] All platforms account sees complete navigation

## Troubleshooting

### Common Issues

1. **"Email already in use" error**
   - This is expected when trying to register existing email
   - Should redirect to login instead

2. **Platform not showing in dashboard**
   - Check user profile in Firebase
   - Verify platform access is properly set
   - Check approval status for business accounts

3. **Navigation not updating**
   - Clear browser cache
   - Check if user profile is loading correctly
   - Verify platform access in user data

### Firebase Console Checks

1. **Users Collection**
   - Check if user documents have `platforms` object
   - Verify platform access flags are set correctly
   - Check account type and approval status

2. **Companies Collection**
   - Business accounts should have company documents
   - Check approval status for business accounts

3. **Authentication**
   - Verify users exist in Firebase Auth
   - Check email verification status

## Script Usage

To create test accounts automatically:

1. Update Firebase config in `scripts/create-test-accounts.js`
2. Run: `node scripts/create-test-accounts.js`
3. Follow the output to verify account creation
4. Test login with created accounts

## Expected Test Results

| Account | Personal AI | WebVault | ChatHub | Dashboard Type |
|---------|-------------|----------|---------|----------------|
| personal-ai-test | ✅ | ❌ | ❌ | Personal AI |
| webvault-test | ❌ | ✅ | ❌ | WebVault |
| chathub-test | ❌ | ❌ | ✅ | ChatHub |
| personal-webvault | ✅ | ✅ | ❌ | Unified (2 platforms) |
| personal-chathub | ✅ | ❌ | ✅ | Unified (2 platforms) |
| webvault-chathub | ❌ | ✅ | ✅ | Unified (2 platforms) |
| all-platforms | ✅ | ✅ | ✅ | Unified (all platforms) | 