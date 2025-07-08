"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { 
  Globe,
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Code,
  Palette,
  Server,
  Zap,
  MessageCircle,
  Brain,
  Database,
  Shield,
  Users,
  TrendingUp,
  Settings,
  Clock
} from "lucide-react"
import { useRouter } from "next/navigation"
import "./selection-animations.css"

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const handleServiceSelection = (service: 'web-building' | 'chatbot' | 'personal-ai') => {
    setSelectedService(service)
    setIsLoading(true)
    
    // Store user preference
    localStorage.setItem('userServicePreference', service)
    localStorage.setItem('hasVisitedSelection', 'true')
    
    // Redirect based on selection
    if (service === 'web-building') {
      router.push('/web-building/home')
    } else if (service === 'chatbot') {
      router.push('/chathub')
    } else if (service === 'personal-ai') {
      router.push('/dashboard/personal-ai')
    }
  }

  const services = [
    {
      id: 'web-building',
      title: 'Web Building Services',
      subtitle: 'Custom Website Development & Design',
      description: 'Professional websites, e-commerce stores, and custom web applications built with modern technologies.',
      icon: Globe,
      gradient: 'from-blue-600 to-purple-600',
      badge: 'Popular',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      features: [
        { icon: Code, text: "Custom Website Development", description: "Tailored to your brand and needs" },
        { icon: Palette, text: "Modern Design", description: "Beautiful, responsive layouts" },
        { icon: Server, text: "Hosting & Maintenance", description: "Reliable, secure infrastructure" },
        { icon: Zap, text: "Performance Optimization", description: "Fast loading, SEO-ready" }
      ],
      price: 'Starting from $2,500',
      cta: 'Start Building Your Website'
    },
    {
      id: 'chatbot',
      title: 'AI Chatbot Platform',
      subtitle: 'ChatHub - Intelligent AI Solutions',
      description: 'Create powerful AI chatbots for customer support, lead generation, and business automation.',
      icon: Bot,
      gradient: 'from-green-600 to-blue-600',
      badge: 'AI-Powered',
      badgeColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      features: [
        { icon: Brain, text: "AI-Powered Conversations", description: "Smart, natural interactions" },
        { icon: MessageCircle, text: "Multi-Platform Support", description: "Works on website, mobile, social" },
        { icon: Database, text: "Knowledge Base Integration", description: "Connects to your data and FAQs" },
        { icon: Shield, text: "Enterprise Security", description: "Secure, compliant, and reliable" }
      ],
      price: 'Free to Start',
      cta: 'Explore ChatHub Features'
    },
    {
      id: 'personal-ai',
      title: 'Personal AI Assistant',
      subtitle: 'Your Digital Companion',
      description: 'Your own personal AI assistant that helps with tasks, research, content creation, and productivity.',
      icon: Sparkles,
      gradient: 'from-purple-600 to-pink-600',
      badge: 'New',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      features: [
        { icon: Zap, text: "Task Automation", description: "Automate repetitive tasks" },
        { icon: Brain, text: "Content Creation", description: "Generate articles, emails, and more" },
        { icon: TrendingUp, text: "Research Assistant", description: "Find and analyze information" },
        { icon: Users, text: "Personal Organization", description: "Manage your schedule and tasks" }
      ],
      price: 'Starting from $29/month',
      cta: 'Get Your AI Assistant'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">ChatHub</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose Your Service</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => router.push('/login')}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Login
              </Button>
              <ThemeToggle />
            </div>
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
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Choose the perfect solution for your digital needs. From business chatbots to personal AI assistants, we have everything you need to succeed.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service) => (
              <Card 
                key={service.id}
                className={`relative overflow-hidden border-2 hover:border-${service.id === 'web-building' ? 'blue' : service.id === 'chatbot' ? 'green' : 'purple'}-300 dark:hover:border-${service.id === 'web-building' ? 'blue' : service.id === 'chatbot' ? 'green' : 'purple'}-600 transition-all duration-300 hover:shadow-xl group cursor-pointer ${
                  selectedService === service.id ? 'ring-4 ring-purple-500' : ''
                }`}
                onClick={() => handleServiceSelection(service.id as any)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900`}>
                        <service.icon className="w-9 h-9 text-white drop-shadow" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          {service.subtitle}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className={service.badgeColor}>
                      {service.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 bg-${service.id === 'web-building' ? 'blue' : service.id === 'chatbot' ? 'green' : 'purple'}-100 dark:bg-${service.id === 'web-building' ? 'blue' : service.id === 'chatbot' ? 'green' : 'purple'}-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <feature.icon className={`w-4 h-4 text-${service.id === 'web-building' ? 'blue' : service.id === 'chatbot' ? 'green' : 'purple'}-600 dark:text-${service.id === 'web-building' ? 'blue' : service.id === 'chatbot' ? 'green' : 'purple'}-400`} />
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
                    <div className="text-center mb-4">
                      <Badge variant="outline" className="text-sm">
                        {service.price}
                      </Badge>
                    </div>
                    
                    <Button 
                      onClick={() => handleServiceSelection(service.id as any)}
                      disabled={isLoading}
                      className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white`}
                    >
                      {isLoading && selectedService === service.id ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Loading...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {service.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-16">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose ChatHub?
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Expert Team</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">10+ years of experience</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Fast Delivery</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quick turnaround times</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Quality Guarantee</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">100% satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
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
