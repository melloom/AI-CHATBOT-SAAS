"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { getUser } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  profile: any
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  profile: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        try {
          // Fetch user profile using the Firebase service function
          const userProfile = await getUser(user.uid) as any
          
          // Auto-approve admin users
          if (userProfile && userProfile.isAdmin && (!userProfile.approvalStatus || userProfile.approvalStatus === 'pending')) {
            // Update the user's approval status to approved
            const { updateDoc, doc } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase')
            await updateDoc(doc(db, "users", user.uid), {
              approvalStatus: 'approved',
              updatedAt: new Date().toISOString()
            })
            userProfile.approvalStatus = 'approved'
            console.log("Auto-approved admin user:", user.uid)
          }
          
          // Log the user's approval status for debugging
          console.log("User profile loaded:", {
            uid: user.uid,
            email: userProfile?.email,
            approvalStatus: userProfile?.approvalStatus,
            isAdmin: userProfile?.isAdmin,
            companyName: userProfile?.companyName
          })
          
          setProfile(userProfile)
        } catch (error) {
          console.error("Error fetching user profile:", error)
          // Use fallback profile if Firestore is not available or user doesn't exist
          setProfile({
            companyName: user.displayName || "Demo Company",
            domain: "",
            industry: "technology",
            isAdmin: false,
            role: "user",
            approvalStatus: 'pending',
          })
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [mounted])

  return <AuthContext.Provider value={{ user, loading, profile }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
