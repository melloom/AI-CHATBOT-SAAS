# Firebase Security Rules Implementation

This document explains how the Firebase security rules have been implemented in the frontend application.

## Security Rules Overview

The following Firestore security rules have been implemented:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // USERS
    match /users/{userId} {
      // Users can read/write their own document
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admins can read/write all user documents
      allow read, write: if isAdmin();
    }
    
    // COMPANIES
    match /companies/{companyId} {
      // Company owner can read/write their own company
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.companyId == companyId;
      // Admins can read/write all companies
      allow read, write: if isAdmin();
      // Anyone can read approved companies
      allow read: if resource.data.approvalStatus == 'approved';
    }
    
    // NOTIFICATIONS - Admin users can read/write their own notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || isAdmin());
    }
    
    // Users can read and write their own chatbots
    match /chatbots/{chatbotId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can read and write their own conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can read and write their own subscriptions
    match /subscriptions/{subscriptionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == subscriptionId;
    }
    
    // SYSTEM SETTINGS - Allow authenticated users to read, but only admins can write
    match /systemSettings/{document} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
  }
}
```

## Frontend Implementation

### 1. Firebase Service Functions (`lib/firebase.ts`)

All Firebase operations are now handled through secure service functions that implement the security rules:

#### User Management
- `getUser(userId)` - Users can read their own document, admins can read all
- `updateUser(userId, data)` - Users can update their own document, admins can update all
- `createUser(userId, data)` - Users can create their own document, admins can create any

#### Company Management
- `getCompany(companyId)` - Company owners can read their own company, admins can read all
- `updateCompany(companyId, data)` - Company owners can update their own company, admins can update all
- `createCompany(data)` - Only admins can create companies
- `getApprovedCompanies()` - Anyone can read approved companies

#### Chatbot Management
- `getUserChatbots()` - Users can only read their own chatbots
- `createChatbot(data)` - Creates chatbot with current user's ID
- `updateChatbot(chatbotId, data)` - Users can only update their own chatbots
- `deleteChatbot(chatbotId)` - Users can only delete their own chatbots

#### Conversation Management
- `getUserConversations()` - Users can only read their own conversations
- `createConversation(data)` - Creates conversation with current user's ID
- `updateConversation(conversationId, data)` - Users can only update their own conversations

#### Subscription Management
- `getUserSubscription()` - Users can only read their own subscription
- `createOrUpdateSubscription(data)` - Users can only update their own subscription

#### Notification Management
- `getUserNotifications()` - Users can only read their own notifications
- `createNotification(data)` - Creates notification with current user's ID

#### System Settings
- `getSystemSettings()` - Any authenticated user can read
- `updateSystemSettings(data)` - Only admins can update

### 2. Updated Hooks

All hooks now use the secure Firebase service functions:

#### `useChatbots`
- Uses `getUserChatbots()`, `createChatbot()`, `updateChatbot()`, `deleteChatbot()`
- Maintains impersonation functionality for admins
- Falls back to real data for impersonated companies

#### `useSubscription`
- Uses `getUserSubscription()`, `createOrUpdateSubscription()`
- Maintains impersonation functionality for admins
- Falls back to real data for impersonated companies

#### `useTeam`
- Currently uses real data (team management implemented in Firebase)
- Maintains impersonation functionality for admins
- When impersonating, uses real data from Firebase

#### `useNotifications` (New)
- Uses `getUserNotifications()`, `createNotification()`
- Provides secure notification management

### 3. Admin Impersonation

The impersonation feature respects security rules:
- When impersonating, uses real data from Firebase
- Prevents admins from accidentally modifying other companies' data
- Clear visual indicators when impersonating

## Security Features

### 1. User Isolation
- Users can only access their own data (chatbots, conversations, subscriptions)
- Each document includes `userId` field for proper isolation
- Admin functions check permissions before operations

### 2. Company-Based Access
- Users are associated with companies via `companyId` field
- Company owners can only access their own company data
- Admins can access all company data

### 3. Admin Privileges
- `isCurrentUserAdmin()` function checks admin status
- Admins can read/write all user documents
- Admins can read/write all company documents
- Only admins can create companies and update system settings

### 4. Company Approval System
- Companies have `approvalStatus` field
- Only approved companies are publicly readable
- Admins can manage company approval status

### 5. Error Handling
- All Firebase operations include proper error handling
- Access denied errors are caught and handled gracefully
- Fallback data provided when operations fail

## Data Structure

### User Document
```javascript
{
  id: "user_uid",
  email: "user@company.com",
  companyName: "Company Name",
  companyId: "company_id",
  isAdmin: false,
  role: "user",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### Company Document
```javascript
{
  id: "company_id",
  name: "Company Name",
  approvalStatus: "approved", // "pending", "approved", "rejected"
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### Chatbot Document
```javascript
{
  id: "chatbot_id",
  userId: "user_uid", // Links to user who owns this chatbot
  name: "Chatbot Name",
  description: "Description",
  active: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### Subscription Document
```javascript
{
  id: "user_uid", // Same as user ID
  plan: "Pro Plan",
  status: "active",
  price: "$79/month",
  nextBillingDate: "2024-02-01T00:00:00.000Z",
  lastFour: "4242",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Usage Examples

### Creating a Chatbot
```javascript
import { createChatbot } from "@/lib/firebase"

const chatbotData = {
  name: "Support Bot",
  description: "Handles customer support",
  active: true
}

try {
  const chatbotId = await createChatbot(chatbotData)
  console.log("Chatbot created:", chatbotId)
} catch (error) {
  console.error("Access denied or error:", error)
}
```

### Getting User's Chatbots
```javascript
import { getUserChatbots } from "@/lib/firebase"

try {
  const chatbots = await getUserChatbots()
  console.log("User's chatbots:", chatbots)
} catch (error) {
  console.error("Error loading chatbots:", error)
}
```

### Admin Checking
```javascript
import { isCurrentUserAdmin } from "@/lib/firebase"

const isAdmin = await isCurrentUserAdmin()
if (isAdmin) {
  // Perform admin operations
}
```

## Best Practices

1. **Always use service functions** - Don't directly access Firestore
2. **Handle errors gracefully** - All operations can fail due to security rules
3. **Check permissions** - Use `isCurrentUserAdmin()` for admin operations
4. **Respect user isolation** - Never assume access to other users' data
5. **Use impersonation carefully** - Only for testing and support

## Future Enhancements

1. **Team Management** - Implement real team management with Firebase
2. **Real-time Updates** - Add real-time listeners for data changes
3. **Audit Logging** - Track all data access and modifications
4. **Advanced Permissions** - Implement role-based access control
5. **Data Validation** - Add client-side validation before Firebase operations 