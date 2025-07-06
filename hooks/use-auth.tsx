"use client"

import { useContext } from "react"
import { AuthContext } from "@/components/providers/auth-provider"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { auth } from "@/lib/firebase"

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  const updateProfile = async (data: any) => {
    if (!auth.currentUser) {
      throw new Error("No user logged in")
    }

    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        ...data,
        updatedAt: new Date().toISOString(),
      })
      
      // Note: Profile state will be updated on next auth state change
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  return {
    ...context,
    updateProfile,
  }
}
