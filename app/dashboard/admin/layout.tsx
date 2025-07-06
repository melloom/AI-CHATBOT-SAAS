"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ReadOnlyAlert } from "@/components/ui/read-only-indicator"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && profile) {
      if (!profile.isAdmin) {
        router.push("/dashboard")
      }
    } else if (user === null) {
      router.push("/login")
    }
  }, [user, profile, router])

  if (!profile?.isAdmin) {
    return null
  }

  return (
    <>
      {profile?.isReadOnly && <ReadOnlyAlert />}
      {children}
    </>
  )
} 