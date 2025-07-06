"use client"

import { useState, useEffect } from "react"
import { useImpersonation } from "@/components/providers/impersonation-provider"
import { getUserChatbots, createChatbot as createFirebaseChatbot, updateChatbot as updateFirebaseChatbot, deleteChatbot as deleteFirebaseChatbot } from "@/lib/firebase"

export function useChatbots() {
  const [chatbots, setChatbots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { impersonatedCompany } = useImpersonation()

  useEffect(() => {
    const loadChatbots = async () => {
      try {
        setLoading(true)
        
        // Load real chatbots from Firebase
        const userChatbots = await getUserChatbots()
        setChatbots(userChatbots)
      } catch (error) {
        console.error("Error loading chatbots:", error)
        // Fallback to empty array on error
        setChatbots([])
      } finally {
        setLoading(false)
      }
    }

    loadChatbots()
  }, [impersonatedCompany])

  const createChatbot = async (data: any) => {
    try {
      // Create real chatbot in Firebase
      const chatbotId = await createFirebaseChatbot(data)
      // Reload chatbots to get the updated list
      const userChatbots = await getUserChatbots()
      setChatbots(userChatbots)
      return chatbotId
    } catch (error) {
      console.error("Error creating chatbot:", error)
      throw error
    }
  }

  const updateChatbot = async (id: string, data: any) => {
    try {
      // Update real chatbot in Firebase
      await updateFirebaseChatbot(id, data)
      // Reload chatbots to get the updated list
      const userChatbots = await getUserChatbots()
      setChatbots(userChatbots)
    } catch (error) {
      console.error("Error updating chatbot:", error)
      throw error
    }
  }

  const deleteChatbot = async (id: string) => {
    try {
      // Delete real chatbot from Firebase
      await deleteFirebaseChatbot(id)
      // Reload chatbots to get the updated list
      const userChatbots = await getUserChatbots()
      setChatbots(userChatbots)
    } catch (error) {
      console.error("Error deleting chatbot:", error)
      throw error
    }
  }

  const refreshChatbots = async () => {
    try {
      const userChatbots = await getUserChatbots()
      setChatbots(userChatbots)
    } catch (error) {
      console.error("Error refreshing chatbots:", error)
    }
  }

  return {
    chatbots,
    loading,
    createChatbot,
    updateChatbot,
    deleteChatbot,
    refreshChatbots,
  }
}
