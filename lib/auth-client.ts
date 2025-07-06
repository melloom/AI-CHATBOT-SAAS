import { 
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithPopup,
  GoogleAuthProvider,
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
    
    // Create user profile in Firestore
    if (result.user) {
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        companyName: companyName || "",
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

      // Create company document with pending approval
      if (companyName) {
        const companyRef = await addDoc(collection(db, "companies"), {
          companyName: companyName,
          email: email,
          userId: result.user.uid,
          approvalStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })

        // Update user with company ID
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          companyName: companyName,
          companyId: companyRef.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          approvalStatus: 'pending',
        }, { merge: true })
      }
    }
    
    return result
  } catch (error) {
    console.error("Create user error:", error)
    throw error
  }
}

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    
    // Check if user profile exists, if not create it
    const userDoc = await getDoc(doc(db, "users", result.user.uid))
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        approvalStatus: 'pending',
      })
    }
    
    return result
  } catch (error) {
    console.error("Google sign in error:", error)
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

// Placeholder for Microsoft OAuth login
export const signInWithMicrosoft = async () => {
  try {
    const provider = new OAuthProvider('microsoft.com');
    // Optionally, you can add scopes:
    // provider.setCustomParameters({ prompt: 'consent' });
    // provider.addScope('mail.read');
    const result = await signInWithPopup(auth, provider);
    // Check if user profile exists, if not create it
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        approvalStatus: 'pending',
      });
    }
    return result;
  } catch (error) {
    console.error("Microsoft sign in error:", error);
    throw error;
  }
} 