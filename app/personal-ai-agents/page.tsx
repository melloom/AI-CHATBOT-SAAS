"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  Brain, 
  MessageCircle, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Star,
  Clock,
  Users,
  TrendingUp,
  Mail,
  Calendar,
  FileText,
  Search,
  Mic,
  Settings,
  Globe,
  Smartphone,
  Database,
  Palette,
  Code,
  Headphones,
  Star as StarIcon,
  Check,
  Sparkles,
  Plus,
  X,
  ShoppingCart,
  User,
  UserPlus
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { personalAIAgentPlans, aiAgentServices } from "@/lib/pricing-config"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function PersonalAIAgentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAddons, setSelectedAddons] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showAddonSummary, setShowAddonSummary] = useState(false)

  // Load selected addons from localStorage on component mount
  useEffect(() => {
    const savedAddons = localStorage.getItem('personalAIAddons')
    const savedPlan = localStorage.getItem('selectedPersonalAIPlan')
    
    if (savedAddons) {
      setSelectedAddons(JSON.parse(savedAddons))
    }
    
    if (savedPlan) {
      setSelectedPlan(JSON.parse(savedPlan))
    }
  }, [])

  // Save addons to localStorage whenever they change
  useEffect(() => {
    if (selectedAddons.length > 0) {
      localStorage.setItem('personalAIAddons', JSON.stringify(selectedAddons))
    }
  }, [selectedAddons])

  // Save selected plan to localStorage
  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem('selectedPersonalAIPlan', JSON.stringify(selectedPlan))
    }
  }, [selectedPlan])

  const handleAddonToggle = (addon: any) => {
    setSelectedAddons(prev => {
      const isSelected = prev.find(item => item.name === addon.name)
      if (isSelected) {
        // Remove addon
        const filtered = prev.filter(item => item.name !== addon.name)
        toast({
          title: "Addon Removed",
          description: `${addon.name} has been removed from your selection.`,
          variant: "default"
        })
        return filtered
      } else {
        // Add addon
        const updated = [...prev, { ...addon, id: Date.now() }]
        toast({
          title: "Addon Added",
          description: `${addon.name} has been added to your selection.`,
          variant: "default"
        })
        return updated
      }
    })
  }

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan)
    toast({
      title: "Plan Selected",
      description: `${plan.name} plan has been selected.`,
      variant: "default"
    })
  }

  const handleContactWithSelection = () => {
    // Store all selections for contact form
    const contactData = {
      selectedPlan: selectedPlan,
      selectedAddons: selectedAddons,
      totalAddons: selectedAddons.length,
      totalAddonCost: selectedAddons.reduce((sum, addon) => {
        const price = parseFloat(addon.price.replace(/[^0-9.]/g, ''))
        return sum + price
      }, 0),
      selectionType: 'personal-ai-assistant',
      timestamp: new Date().toISOString()
    }

    localStorage.setItem('personalAIContactData', JSON.stringify(contactData))
    
    // Store individual items for contact form
    localStorage.setItem('selectedPersonalAIPlan', JSON.stringify(selectedPlan))
    localStorage.setItem('personalAIAddons', JSON.stringify(selectedAddons))
    localStorage.setItem('contactService', 'personal-ai-assistant')
    
    toast({
      title: "Selection Saved",
      description: "Your AI assistant selection has been attached to the contact form.",
      variant: "default"
    })

    // Redirect to contact page
    router.push('/contact?service=personal-ai-assistant')
  }

  const clearSelection = () => {
    setSelectedAddons([])
    setSelectedPlan(null)
    localStorage.removeItem('personalAIAddons')
    localStorage.removeItem('selectedPersonalAIPlan')
    localStorage.removeItem('personalAIContactData')
    toast({
      title: "Selection Cleared",
      description: "All selections have been cleared.",
      variant: "default"
    })
  }

  const getTotalCost = () => {
    const planCost = selectedPlan ? parseFloat(selectedPlan.price.replace(/[^0-9.]/g, '')) : 0
    const addonCost = selectedAddons.reduce((sum, addon) => {
      const price = parseFloat(addon.price.replace(/[^0-9.]/g, ''))
      return sum + price
    }, 0)
    return planCost + addonCost
  }

  const features = [
    {
      icon: Mail,
      title: "Email Management",
      description: "Automated sorting, drafting, and response management",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Intelligent calendar management and meeting coordination",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      icon: FileText,
      title: "Document Assistant",
      description: "Create, edit, and format documents with AI assistance",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      icon: Search,
      title: "Research & Analysis",
      description: "Deep research, fact-checking, and data analysis",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    },
    {
      icon: Mic,
      title: "Voice Commands",
      description: "Natural language processing and voice interaction",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20"
    },
    {
      icon: Settings,
      title: "Task Automation",
      description: "Automate repetitive tasks and workflows",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: "10x Productivity Boost",
      description: "Automate routine tasks and focus on what matters most",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Your AI assistant works around the clock",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      icon: Users,
      title: "Personalized Experience",
      description: "Learns your preferences and adapts to your style",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    }
  ]

  const useCases = [
    {
      title: "Busy Professionals",
      description: "Manage emails, schedule meetings, and handle administrative tasks",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Students & Researchers",
      description: "Research assistance, document creation, and study organization",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Entrepreneurs",
      description: "Business planning, market research, and task automation",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Content Creators",
      description: "Writing assistance, research, and content optimization",
      icon: Palette,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/5 to-purple-100/10 dark:from-background dark:via-blue-900/20 dark:to-purple-800/10">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/LOGO.png" 
                alt="ChatHub Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8"
                priority
              />
              <span className="font-bold text-2xl text-foreground">ChatHub</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/signup?redirect=personal-ai')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                onClick={() => router.push('/login?redirect=personal-ai')}
              >
                <User className="w-4 h-4 mr-2" />
                Login to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              Personal AI Agents
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Your Personal AI Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your daily productivity with intelligent AI agents designed for individuals. 
              From managing emails to scheduling meetings, your AI assistant handles the routine 
              so you can focus on what matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  // Scroll to the pricing plans section
                  const plansSection = document.getElementById('pricing-plans')
                  if (plansSection) {
                    plansSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                View Plans
              </Button>

              {(selectedPlan || selectedAddons.length > 0) && (
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <Badge className="bg-green-500 text-white">
                    <Check className="w-3 h-3 mr-1" />
                    {selectedPlan ? 'Plan Selected' : 'Addons Selected'}
                  </Badge>
                  <span className="text-sm text-purple-100">
                    ${getTotalCost()}/month
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Powerful AI Capabilities</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your personal AI assistant comes equipped with advanced capabilities to handle any task.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-blue-50/20 dark:from-card dark:to-blue-900/10">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose a Personal AI Agent?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience the future of personal productivity with AI that works for you.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <Card key={index} className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/20 dark:from-card dark:to-purple-900/10">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${benefit.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Perfect For</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Whether you're a busy professional, student, entrepreneur, or content creator, 
                our AI assistant adapts to your unique needs.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {useCases.map((useCase, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 ${useCase.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <useCase.icon className={`w-6 h-6 ${useCase.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div id="pricing-plans" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your AI Assistant Plan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From basic personal assistance to executive-level support, we have the perfect AI agent for your needs.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              {personalAIAgentPlans.map((plan, index) => {
                const isSelected = selectedPlan?.name === plan.name
                return (
                <Card key={index} className={`relative hover:shadow-lg transition-all duration-300 ${
                  plan.popular ? 'border-purple-500 shadow-lg scale-105 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                  } ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                        <StarIcon className="w-4 h-4 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                    {isSelected && (
                      <div className="absolute -top-4 right-4">
                        <Badge className="bg-green-500 text-white px-2 py-1">
                          <Check className="w-3 h-3 mr-1" />
                          Selected
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-4">{plan.price}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                        onClick={() => handlePlanSelect(plan)}
                      className={`w-full ${
                          isSelected
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' 
                          : 'bg-white text-purple-600 border-purple-600 hover:bg-purple-50'
                      }`}
                    >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Selected
                          </>
                        ) : (
                          <>
                            Select Plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                    </Button>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          </div>

          {/* Specialized Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Specialized AI Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Add specialized capabilities to your AI assistant with our modular services.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {aiAgentServices.map((service, index) => {
                const isSelected = selectedAddons.find(addon => addon.name === service.name)
                return (
                  <Card key={index} className={`hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-purple-50/20 dark:from-card dark:to-purple-900/10 ${
                    isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                  }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-foreground">{service.name}</CardTitle>
                      <Badge variant="secondary" className="text-sm">
                        {service.price}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button 
                        onClick={() => handleAddonToggle(service)}
                        variant={isSelected ? "default" : "outline"}
                        className={`w-full ${
                          isSelected 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : ''
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                      Add Service
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Selection Summary */}
          {(selectedPlan || selectedAddons.length > 0) && (
            <div className="mb-20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Your AI Assistant Selection</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Review your selected plan and addons before proceeding.
                </p>
              </div>
              
              <Card className="max-w-4xl mx-auto border-2 border-purple-200 dark:border-purple-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-foreground">Selection Summary</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearSelection}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selected Plan */}
                  {selectedPlan && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg text-foreground">Selected Plan</h3>
                        <Badge className="bg-purple-600 text-white">{selectedPlan.price}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{selectedPlan.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                    </div>
                  )}
                  
                  {/* Selected Addons */}
                  {selectedAddons.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-foreground">Selected Addons ({selectedAddons.length})</h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {selectedAddons.map((addon, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="font-medium text-foreground">{addon.name}</p>
                              <p className="text-sm text-muted-foreground">{addon.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{addon.price}</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddonToggle(addon)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Total Cost */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-foreground">Total Monthly Cost:</span>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        ${getTotalCost()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      size="lg" 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      onClick={handleContactWithSelection}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Contact Us with Selection
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => setShowAddonSummary(true)}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Testimonials Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">What Our Users Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover how personal AI assistants are transforming daily productivity for individuals worldwide.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-blue-50/20 dark:from-card dark:to-blue-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "My AI assistant has completely transformed how I manage my daily tasks. It handles my emails, schedules meetings, and even helps with research. I've gained back hours every week!"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      SM
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Sarah Mitchell</p>
                      <p className="text-sm text-muted-foreground">Marketing Director</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-purple-50/20 dark:from-card dark:to-purple-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "As a busy entrepreneur, I needed help managing multiple projects. My AI assistant keeps me organized, reminds me of deadlines, and even helps with content creation. It's like having a personal assistant available 24/7."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                      DJ
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">David Johnson</p>
                      <p className="text-sm text-muted-foreground">Startup Founder</p>
                    </div>
                  </div>
                  </CardContent>
                </Card>

              <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-green-50/20 dark:from-card dark:to-green-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "The research capabilities are incredible! My AI assistant helps me gather information, analyze data, and create comprehensive reports in minutes. It's like having a research team at my fingertips."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                      EL
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Emily Lopez</p>
                      <p className="text-sm text-muted-foreground">Research Analyst</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get answers to common questions about personal AI assistants.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4">
              <Card className="border-0 bg-gradient-to-br from-white to-blue-50/20 dark:from-card dark:to-blue-900/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">How does a personal AI assistant work?</h3>
                  <p className="text-muted-foreground">
                    Your personal AI assistant uses advanced natural language processing to understand your requests, 
                    automate tasks, and provide intelligent responses. It learns from your interactions to become 
                    more personalized over time.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-white to-purple-50/20 dark:from-card dark:to-purple-900/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">What tasks can my AI assistant help with?</h3>
                  <p className="text-muted-foreground">
                    Your AI assistant can handle email management, scheduling, research, document creation, 
                    data analysis, content generation, and much more. It's designed to adapt to your specific needs and workflow.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-white to-green-50/20 dark:from-card dark:to-green-900/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">Is my data secure and private?</h3>
                  <p className="text-muted-foreground">
                    Absolutely. We use enterprise-grade encryption and follow strict privacy protocols. 
                    Your personal data is never shared with third parties, and you have complete control over your information.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-white to-orange-50/20 dark:from-card dark:to-orange-900/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">How quickly can I get started?</h3>
                  <p className="text-muted-foreground">
                    You can set up your personal AI assistant in minutes. Simply choose your plan, 
                    select any additional services, and our team will have your AI assistant ready within 24 hours.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-white to-red-50/20 dark:from-card dark:to-red-900/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">Can I customize my AI assistant?</h3>
                  <p className="text-muted-foreground">
                    Yes! You can customize your AI assistant's personality, capabilities, and integrations. 
                    Add specialized services for your specific needs, from creative writing to technical analysis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl">
              <CardContent className="p-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Transform Your Productivity?
                </h2>
                <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
                  Join thousands of individuals who have already enhanced their daily workflow with AI assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-purple-50"
                    onClick={() => router.push('/contact?service=personal-ai-assistant')}
                  >
                    Get Started Today
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-purple-600"
                    onClick={() => router.push('/contact?service=demo')}
                  >
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Selection Indicator */}
      {(selectedPlan || selectedAddons.length > 0) && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="shadow-2xl border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedPlan ? 'Plan Selected' : 'Addons Selected'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedAddons.length} addon{selectedAddons.length !== 1 ? 's' : ''} • ${getTotalCost()}/month
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleContactWithSelection}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 