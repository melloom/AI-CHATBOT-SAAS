"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { 
  Globe,
  Bot,
  ArrowRight,
  CheckCircle,
  Code,
  Palette,
  Server,
  Zap,
  MessageCircle,
  Brain,
  Database,
  Shield
} from "lucide-react"
import { useRouter } from "next/navigation"
import "./selection-animations.css"

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleServiceSelection = (service: 'web-building' | 'chatbot') => {
    setIsLoading(true)
    
    // Store user preference
    localStorage.setItem('userServicePreference', service)
    localStorage.setItem('hasVisitedSelection', 'true')
    
    // Redirect based on selection
    if (service === 'web-building') {
      router.push('/web-building/home')
    } else {
      // For ChatHub, redirect to the dedicated ChatHub landing page
      router.push('/chathub')
    }
  }

  const webBuildingFeatures = [
    { icon: Code, text: "Custom Website Development", description: "Tailored to your brand and needs" },
    { icon: Palette, text: "Modern Design", description: "Beautiful, responsive layouts" },
    { icon: Server, text: "Hosting & Maintenance", description: "Reliable, secure infrastructure and ongoing support" },
    { icon: Zap, text: "Performance Optimization", description: "Fast loading, SEO-ready, and scalable" }
  ]

  const chatbotFeatures = [
    { icon: Brain, text: "AI-Powered Conversations", description: "Smart, natural interactions" },
    { icon: MessageCircle, text: "Multi-Platform Support", description: "Works on your website, mobile, and social channels" },
    { icon: Database, text: "Knowledge Base Integration", description: "Connects to your data and FAQs" },
    { icon: Shield, text: "Enterprise Security", description: "Secure, compliant, and reliable" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">BuildFlow</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose Your Service</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-2 animate-fade-slide-in bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent relative inline-block">
              Let's Build Something Amazing Together!
              <span className="block h-1 w-2/3 mx-auto mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-underline"></span>
            </h2>
            <div className="animate-fade-slide-in delay-100">
              <p className="text-lg md:text-xl text-purple-700 dark:text-purple-200 font-semibold mb-2">Pick a path and let's get started!</p>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Choose the perfect solution for your digital needs. From business chatbots to personal AI assistants, we have everything you need to succeed.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Web Building Service */}
            <Card className="relative overflow-hidden border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900">
                      <Globe className="w-9 h-9 text-white drop-shadow" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        WebVault
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Build, launch, and manage your website with ease. WebVault empowers you to create a professional online presence, host your site, and keep everything running smoothly—all in one place.
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Popular
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4 mb-6">
                  {webBuildingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <feature.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {feature.text}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <Button 
                    onClick={() => handleServiceSelection('web-building')}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Start Building Your Website
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chatbot Service */}
            <Card className="relative overflow-hidden border-2 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-blue-500 to-green-700 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900">
                      <Bot className="w-9 h-9 text-white drop-shadow" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        ChatHub
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Create, deploy, and manage intelligent AI chatbots for your business. ChatHub makes it easy to automate conversations, support customers, and grow your brand—no coding required.
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    AI-Powered
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4 mb-6">
                  {chatbotFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <feature.icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {feature.text}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <Button 
                    onClick={() => handleServiceSelection('chatbot')}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Explore ChatHub Features
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Services */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              More AI Solutions
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Looking for personal AI assistance? Check out our individual AI agent plans.
            </p>
            <Button 
              variant="outline" 
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20"
              onClick={() => router.push('/personal-ai-agents')}
            >
              Explore Personal AI Agents
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You can change your service preference anytime from the settings.
            </p>
          </div>
        </div>
      </main>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-8rem] left-[-8rem] w-[32rem] h-[32rem] bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-slow"></div>
        <div className="absolute top-0 right-[-6rem] w-[28rem] h-[28rem] bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-slow animation-delay-2000"></div>
        <div className="absolute bottom-[-8rem] left-1/2 w-[36rem] h-[36rem] bg-gradient-to-br from-green-300 via-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-slow animation-delay-4000"></div>
      </div>
    </div>
  )
}
