import { 
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithPopup,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  signOut as firebaseSignOut,
  User,
  OAuthProvider
} from "firebase/auth"
import { doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore"
import { auth, db } from "./firebase"

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

export const createUserWithEmailAndPassword = async (email: string, password: string, companyName?: string) => {
  try {
    const result = await firebaseCreateUser(auth, email, password)
    
    // Create user profile and company in Firestore
    if (result.user) {
      // Always create a company document for approval
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

      // Create user document with company ID
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        companyName: defaultCompanyName,
        companyId: companyRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        approvalStatus: 'pending',
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,
        twoFactorVerified: false,
        loginAttempts: 0,
        lastLoginAt: null
      })

      console.log("User and company created successfully:", {
        userId: result.user.uid,
        companyId: companyRef.id,
        companyName: defaultCompanyName
      })
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

export const signInWithMicrosoft = async () => {
  try {
    const provider = new OAuthProvider('microsoft.com');
    // Optionally, you can add scopes:
    // provider.setCustomParameters({ prompt: 'consent' });
    // provider.addScope('mail.read');
    const result = await signInWithPopup(auth, provider);
    
    // Check if user profile exists, if not create it with company
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      // Create company for new Microsoft user
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

      // Create user document with company ID
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        companyName: defaultCompanyName,
        companyId: companyRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        approvalStatus: 'pending',
        emailVerified: result.user.emailVerified,
        phoneVerified: false,
        twoFactorEnabled: false,
        twoFactorVerified: false,
        loginAttempts: 0,
        lastLoginAt: null
      })

      console.log("Microsoft user and company created successfully:", {
        userId: result.user.uid,
        companyId: companyRef.id,
        companyName: defaultCompanyName
      })
    }
    
    return result;
  } catch (error) {
    console.error("Microsoft sign in error:", error);
    throw error;
  }
} 