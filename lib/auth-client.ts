import { 
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithPopup,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  signOut as firebaseSignOut,
  User,
  OAuthProvider
} from "firebase/auth"
import { doc, setDoc, getDoc, addDoc, collection, getDocs, updateDoc } from "firebase/firestore"
import { auth, db } from "./firebase"
import { AutomatedNotificationService } from "./automated-notifications"

// Helper function to get current user's ID token for API calls
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('No authenticated user found')
      return null
    }
    
    const token = await user.getIdToken()
    return token
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}

// Helper function to create authenticated fetch headers
export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// Client-side authentication functions
export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const result = await firebaseSignIn(auth, email, password)
    return result
  } catch (error) {
    console.error("Sign in error:", error)
    throw error
  }
}

export const createUserWithEmailAndPassword = async (email: string, password: string, companyName?: string, accountType: 'business' | 'personal' = 'business', platform?: string) => {
  try {
    const result = await firebaseCreateUser(auth, email, password)
    
    if (result.user) {
      if (accountType === 'business') {
        // Create business account with company approval
        const defaultCompanyName = companyName || `Company for ${email.split('@')[0]}`
        
        const companyRef = await addDoc(collection(db, "companies"), {
          companyName: defaultCompanyName,
          email: email,
          userId: result.user.uid,
          approvalStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'pending',
          subscription: {
            plan: 'Free',
            status: 'pending'
          }
        })

        // Create user document with company ID and platform access
        const userData: any = {
          email: result.user.email,
          companyName: defaultCompanyName,
          companyId: companyRef.id,
          accountType: 'business',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          approvalStatus: 'pending',
          emailVerified: false,
          phoneVerified: false,
          twoFactorEnabled: false,
          twoFactorVerified: false,
          loginAttempts: 0,
          lastLoginAt: null,
          platforms: {}
        }

        // Add platform access based on registration source
        if (platform) {
          userData.platforms[platform] = {
            access: true,
            registeredAt: new Date().toISOString(),
            subscription: {
              plan: 'Free',
              status: 'pending'
            }
          }
        }

        await setDoc(doc(db, "users", result.user.uid), userData)

        console.log("Business user and company created successfully:", {
          userId: result.user.uid,
          companyId: companyRef.id,
          companyName: defaultCompanyName
        })

        // Trigger notification for new pending approval
        try {
          const notificationService = AutomatedNotificationService.getInstance()
          const adminUsersQuery = await getDocs(collection(db, "users"))
          const adminUsers = adminUsersQuery.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter((user: any) => user.isAdmin === true)
          
          for (const adminUser of adminUsers) {
            await notificationService.triggerNewPendingApproval(
              adminUser.id,
              defaultCompanyName,
              email
            )
          }
        } catch (error) {
          console.error("Failed to send pending approval notification:", error)
        }
      } else {
        // Create personal AI account (no approval needed)
        const userData: any = {
          email: result.user.email,
          accountType: 'personal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          approvalStatus: 'approved', // Personal accounts are auto-approved
          emailVerified: false,
          phoneVerified: false,
          twoFactorEnabled: false,
          twoFactorVerified: false,
          loginAttempts: 0,
          lastLoginAt: null,
          personalAI: {
            assistants: [],
            preferences: {},
            subscription: {
              plan: 'Free',
              status: 'active'
            }
          },
          platforms: {}
        }

        // Add platform access based on registration source
        if (platform) {
          userData.platforms[platform] = {
            access: true,
            registeredAt: new Date().toISOString(),
            subscription: {
              plan: 'Free',
              status: 'active'
            }
          }
        }

        await setDoc(doc(db, "users", result.user.uid), userData)

        console.log("Personal AI user created successfully:", {
          userId: result.user.uid,
          accountType: 'personal'
        })
      }
    }
    
    return result
  } catch (error) {
    console.error("Create user error:", error)
    throw error
  }
}



export const sendPasswordResetEmail = async (email: string) => {
  try {
    await firebaseSendPasswordReset(auth, email)
  } catch (error) {
    console.error("Password reset error:", error)
    throw error
  }
}

export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error("Sign out error:", error)
    throw error
  }
}

// Function to add platform access to existing user
export const addPlatformAccess = async (platform: string) => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("No user logged in")
    }

    const userRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error("User profile not found")
    }

    const userData = userDoc.data()
    const platforms = userData.platforms || {}
    
    // Add platform access
    platforms[platform] = {
      access: true,
      registeredAt: new Date().toISOString(),
      subscription: {
        plan: 'Free',
        status: 'active'
      }
    }

    // Update user document
    await updateDoc(userRef, {
      platforms,
      updatedAt: new Date().toISOString()
    })

    console.log(`Platform access added for ${platform}:`, user.uid)
    return true
  } catch (error) {
    console.error("Error adding platform access:", error)
    throw error
  }
}

export const signInWithMicrosoft = async (accountType: 'business' | 'personal' = 'business', platform?: string) => {
  try {
    const provider = new OAuthProvider('microsoft.com');
    const result = await signInWithPopup(auth, provider);
    
    // Check if user profile exists, if not create it
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      if (accountType === 'business') {
        // Create business account with company approval
        const defaultCompanyName = `Company for ${result.user.email?.split('@')[0] || 'User'}`
        
        const companyRef = await addDoc(collection(db, "companies"), {
          companyName: defaultCompanyName,
          email: result.user.email,
          userId: result.user.uid,
          approvalStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'pending',
          subscription: {
            plan: 'Free',
            status: 'pending'
          }
        })

        // Create user document with company ID and platform access
        const userData: any = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          companyName: defaultCompanyName,
          companyId: companyRef.id,
          accountType: 'business',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          approvalStatus: 'pending',
          emailVerified: result.user.emailVerified,
          phoneVerified: false,
          twoFactorEnabled: false,
          twoFactorVerified: false,
          loginAttempts: 0,
          lastLoginAt: null,
          platforms: {}
        }

        // Add platform access based on registration source
        if (platform) {
          userData.platforms[platform] = {
            access: true,
            registeredAt: new Date().toISOString(),
            subscription: {
              plan: 'Free',
              status: 'pending'
            }
          }
        }

        await setDoc(doc(db, "users", result.user.uid), userData)

        console.log("Microsoft business user and company created successfully:", {
          userId: result.user.uid,
          companyId: companyRef.id,
          companyName: defaultCompanyName
        })

        // Trigger notification for new pending approval
        try {
          const notificationService = AutomatedNotificationService.getInstance()
          const adminUsersQuery = await getDocs(collection(db, "users"))
          const adminUsers = adminUsersQuery.docs
            .map((doc: any) => ({ id: doc.id, ...doc.data() }))
            .filter((user: any) => user.isAdmin === true)
          
          for (const adminUser of adminUsers) {
            await notificationService.triggerNewPendingApproval(
              adminUser.id,
              defaultCompanyName,
              result.user.email || ''
            )
          }
        } catch (error) {
          console.error("Failed to send pending approval notification:", error)
        }
      } else {
        // Create personal AI account (no approval needed)
        const userData: any = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          accountType: 'personal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          approvalStatus: 'approved', // Personal accounts are auto-approved
          emailVerified: result.user.emailVerified,
          phoneVerified: false,
          twoFactorEnabled: false,
          twoFactorVerified: false,
          loginAttempts: 0,
          lastLoginAt: null,
          personalAI: {
            assistants: [],
            preferences: {},
            subscription: {
              plan: 'Free',
              status: 'active'
            }
          },
          platforms: {}
        }

        // Add platform access based on registration source
        if (platform) {
          userData.platforms[platform] = {
            access: true,
            registeredAt: new Date().toISOString(),
            subscription: {
              plan: 'Free',
              status: 'active'
            }
          }
        }

        await setDoc(doc(db, "users", result.user.uid), userData)

        console.log("Microsoft personal AI user created successfully:", {
          userId: result.user.uid,
          accountType: 'personal'
        })
      }
    }
    
    return result;
  } catch (error) {
    console.error("Microsoft sign in error:", error);
    throw error;
  }
} 