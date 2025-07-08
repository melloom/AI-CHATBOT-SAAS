"use client"

import { Hero } from "@/components/landing/hero"
import { ServicesSection } from "@/components/landing/services-section"
import { Pricing } from "@/components/landing/pricing"
import { Testimonials } from "@/components/landing/testimonials"
import { Footer } from "@/components/landing/footer"
import { ChatHubNavigation } from "@/components/landing/chat-hub-navigation"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ChatHubLandingPage() {
  const router = useRouter()

  const handleChangeService = () => {
    localStorage.removeItem('userServicePreference');
    localStorage.removeItem('hasVisitedSelection');
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <ChatHubNavigation />
      
      {/* Change Service Button */}
      <div className="fixed top-20 right-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={handleChangeService}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 shadow-lg"
        >
          <Settings className="w-4 h-4 mr-2" />
          Change Service
        </Button>
      </div>
      
      <Hero />
      <ServicesSection />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  )
} 