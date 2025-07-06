"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function useEnhancedBack() {
  const router = useRouter()
  const [backHref, setBackHref] = useState("/")

  useEffect(() => {
    if (typeof document !== "undefined" && document.referrer.includes("/sitemap")) {
      setBackHref("/sitemap")
    }
  }, [])

  const handleBack = () => {
    if (backHref === "/sitemap") {
      router.push("/sitemap")
    } else {
      router.back()
    }
  }

  return { backHref, handleBack }
} 