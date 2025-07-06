import { 
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithPopup,
  OAuthProvider,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  signOut as firebaseSignOut,
  User
} from "firebase/auth"
import { doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore"
import { auth, db } from "./firebase"
import { authMiddleware } from "./auth-middleware"

// Authentication functions
export const signInWithEmailAndPassword = async (email: string, password: string, ipAddress?: string, userAgent?: string) => {
  try {
    // Check login attempts before attempting sign in
    if (ipAddress) {
      const loginCheck = await authMiddleware.checkLoginAttempts(email, ipAddress)
      if (!loginCheck.allowed) {
        throw new Error(`Account temporarily locked. Try again after ${loginCheck.lockoutUntil?.toLocaleString()}`)
      }
    }

    const result = await firebaseSignIn(auth, email, password)
    
    // Record successful login attempt
    if (ipAddress && userAgent) {
      await authMiddleware.recordLoginAttempt({
        userId: result.user.uid,
        email: email,
        ipAddress: ipAddress,
        timestamp: new Date(),
        success: true,
        userAgent: userAgent
      })
    }

    // Validate authentication with security settings
    const validation = await authMiddleware.validateAuthentication(
      result.user, 
      ipAddress || 'unknown', 
      userAgent || 'unknown'
    )

    if (!validation.valid) {
      // Sign out if validation fails
      await firebaseSignOut(auth)
      throw new Error(validation.errors.join(', '))
    }

    return result
  } catch (error) {
    // Record failed login attempt
    if (ipAddress && userAgent) {
      await authMiddleware.recordLoginAttempt({
        userId: '',
        email: email,
        ipAddress: ipAddress,
        timestamp: new Date(),
        success: false,
        userAgent: userAgent
      })
    }
    
    console.error("Sign in error:", error)
    throw error
  }
}

export const createUserWithEmailAndPassword = async (email: string, password: string, companyName?: string, ipAddress?: string) => {
  try {
    // Validate domain restrictions
    const domainValid = await authMiddleware.validateDomain(email)
    if (!domainValid) {
      throw new Error('Email domain not allowed')
    }

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
        lastLoginAt: null,
        ipAddress: ipAddress || null
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

export const signInWithMicrosoft = async () => {
  try {
    const provider = new OAuthProvider('microsoft.com')
    const result = await signInWithPopup(auth, provider)
    
    // Check if user profile exists, if not create it with company
    const userDoc = await getDoc(doc(db, "users", result.user.uid))
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
    
    return result
  } catch (error) {
    console.error("Microsoft sign in error:", error)
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
