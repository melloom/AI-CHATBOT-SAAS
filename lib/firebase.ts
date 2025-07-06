import { initializeApp, getApps } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc, orderBy, limit, connectFirestoreEmulator } from "firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCG4TaO69uN1nMGljSlVN0B4GDuozaVVhU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "chathub-3f128.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "chathub-3f128",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "chathub-3f128.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "168721489748",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:168721489748:web:4f056684784888480af2c1",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-JZ42R62B3Z"
}

// Initialize Firebase only if not already initialized
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase services with lazy loading
let authInstance: any = null
let dbInstance: any = null
let analyticsInstance: any = null

export const getAuthInstance = () => {
  if (!authInstance) {
    authInstance = getAuth(app)
  }
  return authInstance
}

export const getDbInstance = () => {
  if (!dbInstance) {
    dbInstance = getFirestore(app)
  }
  return dbInstance
}

export const getAnalyticsInstance = async () => {
  if (!analyticsInstance && typeof window !== 'undefined') {
    const analyticsSupported = await isSupported()
    if (analyticsSupported) {
      analyticsInstance = getAnalytics(app)
    }
  }
  return analyticsInstance
}

// Shorthand exports for backward compatibility
export const auth = getAuthInstance()
export const db = getDbInstance()

// Analytics will be initialized by AnalyticsProvider component

// Firebase service functions implementing security rules

// Helper function to check if current user is admin
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  const user = auth.currentUser
  if (!user) return false
  
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid))
    return userDoc.exists() && userDoc.data()?.isAdmin === true
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

// USERS - Users can read/write their own document, admins can read/write all
export const getUser = async (userId: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const isAdmin = await isCurrentUserAdmin()
  
  // Users can read their own document, admins can read all
  if (user.uid === userId || isAdmin) {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() }
    }
    throw new Error("User not found")
  }
  
  throw new Error("Access denied")
}

export const updateUser = async (userId: string, data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const isAdmin = await isCurrentUserAdmin()
  
  // Users can update their own document, admins can update all
  if (user.uid === userId || isAdmin) {
    await updateDoc(doc(db, "users", userId), {
      ...data,
      updatedAt: new Date().toISOString()
    })
  } else {
    throw new Error("Access denied")
  }
}

export const createUser = async (userId: string, data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const isAdmin = await isCurrentUserAdmin()
  
  // Users can create their own document, admins can create any
  if (user.uid === userId || isAdmin) {
    await setDoc(doc(db, "users", userId), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  } else {
    throw new Error("Access denied")
  }
}

// COMPANIES - Company owner can read/write their own company, admins can read/write all
export const getCompany = async (companyId: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const isAdmin = await isCurrentUserAdmin()
  
  // Get user's companyId
  const userDoc = await getDoc(doc(db, "users", user.uid))
  const userCompanyId = userDoc.exists() ? userDoc.data()?.companyId : null
  
  // Company owner can read their own company, admins can read all
  if (userCompanyId === companyId || isAdmin) {
    const companyDoc = await getDoc(doc(db, "companies", companyId))
    if (companyDoc.exists()) {
      return { id: companyDoc.id, ...companyDoc.data() }
    }
    throw new Error("Company not found")
  }
  
  throw new Error("Access denied")
}

export const updateCompany = async (companyId: string, data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const isAdmin = await isCurrentUserAdmin()
  
  // Get user's companyId
  const userDoc = await getDoc(doc(db, "users", user.uid))
  const userCompanyId = userDoc.exists() ? userDoc.data()?.companyId : null
  
  // Company owner can update their own company, admins can update all
  if (userCompanyId === companyId || isAdmin) {
    await updateDoc(doc(db, "companies", companyId), {
      ...data,
      updatedAt: new Date().toISOString()
    })
  } else {
    throw new Error("Access denied")
  }
}

export const createCompany = async (data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const isAdmin = await isCurrentUserAdmin()
  
  // Only admins can create companies
  if (isAdmin) {
    const companyRef = await addDoc(collection(db, "companies"), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvalStatus: 'pending'
    })
    return companyRef.id
  } else {
    throw new Error("Access denied - Only admins can create companies")
  }
}

// Get approved companies (anyone can read approved companies)
export const getApprovedCompanies = async () => {
  const companiesQuery = query(
    collection(db, "companies"),
    where("approvalStatus", "==", "approved")
  )
  
  const querySnapshot = await getDocs(companiesQuery)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

// Get pending company approvals (admins only)
export const getPendingCompanyApprovals = async () => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) throw new Error("Access denied - Admin only")
  
  const companiesQuery = query(
    collection(db, "companies"),
    where("approvalStatus", "==", "pending"),
    orderBy("createdAt", "desc")
  )
  
  const querySnapshot = await getDocs(companiesQuery)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

// Update company approval status (admins only)
export const updateCompanyApprovalStatus = async (companyId: string, status: 'approved' | 'rejected') => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) throw new Error("Access denied - Admin only")
  
  // Update company status
  await updateDoc(doc(db, "companies", companyId), {
    approvalStatus: status,
    approvedBy: user.uid,
    approvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  // Get the company to find the associated user
  const companyDoc = await getDoc(doc(db, "companies", companyId))
  if (companyDoc.exists()) {
    const companyData = companyDoc.data()
    const userId = companyData.userId
    
    if (userId) {
      // Update the user's approval status
      await updateDoc(doc(db, "users", userId), {
        approvalStatus: status,
        updatedAt: new Date().toISOString()
      })
    }
  }
}

// CHATBOTS - Users can read/write their own chatbots
export const getUserChatbots = async () => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const chatbotsQuery = query(
    collection(db, "chatbots"),
    where("userId", "==", user.uid)
  )
  
  const querySnapshot = await getDocs(chatbotsQuery)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const createChatbot = async (data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const chatbotRef = await addDoc(collection(db, "chatbots"), {
    ...data,
    userId: user.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  
  return chatbotRef.id
}

export const updateChatbot = async (chatbotId: string, data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  // Verify the chatbot belongs to the current user
  const chatbotDoc = await getDoc(doc(db, "chatbots", chatbotId))
  if (!chatbotDoc.exists() || chatbotDoc.data()?.userId !== user.uid) {
    throw new Error("Access denied")
  }
  
  await updateDoc(doc(db, "chatbots", chatbotId), {
    ...data,
    updatedAt: new Date().toISOString()
  })
}

export const deleteChatbot = async (chatbotId: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  // Verify the chatbot belongs to the current user
  const chatbotDoc = await getDoc(doc(db, "chatbots", chatbotId))
  if (!chatbotDoc.exists() || chatbotDoc.data()?.userId !== user.uid) {
    throw new Error("Access denied")
  }
  
  await deleteDoc(doc(db, "chatbots", chatbotId))
}

// CONVERSATIONS - Users can read/write their own conversations
export const getUserConversations = async () => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const conversationsQuery = query(
    collection(db, "conversations"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc"),
    limit(50)
  )
  
  const querySnapshot = await getDocs(conversationsQuery)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const createConversation = async (data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const conversationRef = await addDoc(collection(db, "conversations"), {
    ...data,
    userId: user.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  
  return conversationRef.id
}

export const updateConversation = async (conversationId: string, data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  // Verify the conversation belongs to the current user
  const conversationDoc = await getDoc(doc(db, "conversations", conversationId))
  if (!conversationDoc.exists() || conversationDoc.data()?.userId !== user.uid) {
    throw new Error("Access denied")
  }
  
  await updateDoc(doc(db, "conversations", conversationId), {
    ...data,
    updatedAt: new Date().toISOString()
  })
}

// SUBSCRIPTIONS - Users can read/write their own subscriptions
export const getUserSubscription = async () => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const subscriptionDoc = await getDoc(doc(db, "subscriptions", user.uid))
  if (subscriptionDoc.exists()) {
    return { id: subscriptionDoc.id, ...subscriptionDoc.data() }
  }
  return null
}

export const createOrUpdateSubscription = async (data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  await setDoc(doc(db, "subscriptions", user.uid), {
    ...data,
    updatedAt: new Date().toISOString()
  })
}

// NOTIFICATIONS - Admin users can read/write their own notifications
export const getUserNotifications = async () => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const notificationsQuery = query(
    collection(db, "notifications"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc"),
    limit(20)
  )
  
  const querySnapshot = await getDocs(notificationsQuery)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const createNotification = async (data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const notificationRef = await addDoc(collection(db, "notifications"), {
    ...data,
    userId: user.uid,
    createdAt: new Date().toISOString()
  })
  
  return notificationRef.id
}

// Create notification for a specific user (admin only)
export const createNotificationForUser = async (userId: string, data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  // Check if current user is admin
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    throw new Error("Access denied - Only admins can create notifications for other users")
  }
  
  const notificationRef = await addDoc(collection(db, "notifications"), {
    ...data,
    userId: userId,
    createdAt: new Date().toISOString()
  })
  
  return notificationRef.id
}

// Mark a single notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  // Verify the notification belongs to the current user
  const notificationDoc = await getDoc(doc(db, "notifications", notificationId))
  if (!notificationDoc.exists() || notificationDoc.data()?.userId !== user.uid) {
    throw new Error("Access denied")
  }
  
  await updateDoc(doc(db, "notifications", notificationId), {
    isRead: true,
    updatedAt: new Date().toISOString()
  })
}

// Delete a single notification
export const deleteNotification = async (notificationId: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  // Verify the notification belongs to the current user
  const notificationDoc = await getDoc(doc(db, "notifications", notificationId))
  if (!notificationDoc.exists() || notificationDoc.data()?.userId !== user.uid) {
    throw new Error("Access denied")
  }
  
  await deleteDoc(doc(db, "notifications", notificationId))
}

// Mark all notifications as read for the current user
export const markAllNotificationsAsRead = async () => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const notificationsQuery = query(
    collection(db, "notifications"),
    where("userId", "==", user.uid),
    where("isRead", "==", false)
  )
  
  const querySnapshot = await getDocs(notificationsQuery)
  
  // Update all unread notifications to mark them as read
  const updatePromises = querySnapshot.docs.map(doc => 
    updateDoc(doc.ref, { isRead: true })
  )
  
  await Promise.all(updatePromises)
  
  return querySnapshot.docs.length
}

// Clear all notifications for the current user
export const clearAllNotifications = async () => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const notificationsQuery = query(
    collection(db, "notifications"),
    where("userId", "==", user.uid)
  )
  
  const querySnapshot = await getDocs(notificationsQuery)
  
  // Delete all notifications for the user
  const deletePromises = querySnapshot.docs.map(doc => 
    deleteDoc(doc.ref)
  )
  
  await Promise.all(deletePromises)
  
  return querySnapshot.docs.length
}

// SYSTEM SETTINGS - Allow authenticated users to read, but only admins can write
export const getSystemSettings = async () => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const settingsDoc = await getDoc(doc(db, "systemSettings", "main"))
  if (settingsDoc.exists()) {
    return { id: settingsDoc.id, ...settingsDoc.data() }
  }
  return null
}

export const updateSystemSettings = async (data: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")
  
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    throw new Error("Access denied - Only admins can update system settings")
  }
  
  await updateDoc(doc(db, "systemSettings", "main"), {
    ...data,
    updatedAt: new Date().toISOString()
  })
}

// Get user approval status
export const getUserApprovalStatus = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData.approvalStatus || 'pending'
    }
    return 'pending'
  } catch (error) {
    console.error("Error getting user approval status:", error)
    return 'pending'
  }
}
