"use client"

import { useState, useEffect } from "react"
import { useImpersonation } from "@/components/providers/impersonation-provider"
import { getUserSubscription, createOrUpdateSubscription } from "@/lib/firebase"

// Real subscription data for impersonated companies
const impersonatedCompanySubscriptions: Record<string, any> = {
  "1": {},
  "2": {},
  "3": {},
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { impersonatedCompany } = useImpersonation()

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        setLoading(true)
        
        // Use impersonated company data if available, otherwise use real Firebase data
        if (impersonatedCompany && impersonatedCompanySubscriptions[impersonatedCompany.id]) {
          setSubscription(impersonatedCompanySubscriptions[impersonatedCompany.id])
        } else {
          // Load real subscription from Firebase
          const userSubscription = await getUserSubscription()
          if (userSubscription) {
            setSubscription(userSubscription)
          } else {
            // No subscription found
            setSubscription(null)
          }
        }
      } catch (error) {
        console.error("Error loading subscription:", error)
        // No subscription on error
        setSubscription(null)
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()
  }, [impersonatedCompany])

  const updateSubscription = async (data: any) => {
    try {
      if (impersonatedCompany) {
        // For impersonation, just update local state
        setSubscription((prev: any) => ({ ...prev, ...data }))
      } else {
        // Update real subscription in Firebase
        await createOrUpdateSubscription(data)
        // Reload subscription to get the updated data
        const userSubscription = await getUserSubscription()
        if (userSubscription) {
          setSubscription(userSubscription)
        }
      }
    } catch (error) {
      console.error("Error updating subscription:", error)
      throw error
    }
  }

  return { 
    subscription, 
    loading,
    updateSubscription
  }
}
