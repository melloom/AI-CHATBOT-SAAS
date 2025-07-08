"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Search, 
  Bot, 
  User, 
  MessageCircle, 
  ShoppingCart, 
  Headphones, 
  BookOpen, 
  Building2,
  Star,
  ArrowRight,
  Zap,
  Users,
  Calendar,
  FileText,
  Globe,
  Shield,
  TrendingUp,
  Heart,
  Coffee,
  GraduationCap,
  Briefcase,
  Home,
  Car,
  Plane,
  Utensils,
  Wifi,
  CreditCard,
  Camera,
  Music,
  Gamepad2,
  Palette,
  Play,
  Settings,
  Download,
  Eye,
  Clock,
  CheckCircle,
  Sparkles,
  Plus,
  Code,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

// Chatbot Templates
const chatbotTemplates = [
  {
    id: 1,
    name: "Customer Support Bot",
    description: "24/7 customer service with FAQ handling and ticket creation",
    category: "Support",
    icon: <Headphones className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-blue-500 to-purple-600",
    features: ["FAQ Management", "Ticket Creation", "Live Chat Handoff", "Multi-language Support"],
    setupTime: "5 min",
    rating: 4.9,
    reviews: 127,
    popular: true
  },
  {
    id: 2,
    name: "E-commerce Assistant",
    description: "Product recommendations, order tracking, and shopping assistance",
    category: "E-commerce",
    icon: <ShoppingCart className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-green-500 to-teal-600",
    features: ["Product Search", "Order Tracking", "Payment Support", "Inventory Check"],
    setupTime: "10 min",
    rating: 4.8,
    reviews: 89,
    popular: false
  },
  {
    id: 3,
    name: "Lead Generation Bot",
    description: "Capture leads, qualify prospects, and schedule demos automatically",
    category: "Sales",
    icon: <TrendingUp className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-orange-500 to-red-600",
    features: ["Lead Capture", "Qualification", "Demo Scheduling", "CRM Integration"],
    setupTime: "15 min",
    rating: 4.7,
    reviews: 156,
    popular: false
  },
  {
    id: 4,
    name: "Booking Assistant",
    description: "Appointment scheduling, calendar management, and booking confirmations",
    category: "Booking",
    icon: <Calendar className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
    features: ["Appointment Booking", "Calendar Sync", "Reminders", "Rescheduling"],
    setupTime: "8 min",
    rating: 4.9,
    reviews: 203,
    popular: true
  },
  {
    id: 5,
    name: "FAQ Bot",
    description: "Instant answers to common questions with knowledge base integration",
    category: "Support",
    icon: <BookOpen className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-indigo-500 to-blue-600",
    features: ["Knowledge Base", "Smart Search", "Article Suggestions", "Feedback Collection"],
    setupTime: "3 min",
    rating: 4.6,
    reviews: 78,
    popular: false
  },
  {
    id: 6,
    name: "HR Assistant",
    description: "Employee onboarding, policy questions, and HR support",
    category: "HR",
    icon: <Users className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
    features: ["Policy Questions", "Onboarding", "Benefits Info", "Time Off Requests"],
    setupTime: "12 min",
    rating: 4.8,
    reviews: 94,
    popular: false
  }
]

// AI Agent Templates
const aiAgentTemplates = [
  {
    id: 1,
    name: "Executive Assistant",
    description: "High-level support for executives and business leaders",
    category: "Professional",
    icon: <Briefcase className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-slate-500 to-gray-600",
    features: ["Meeting Management", "Strategic Planning", "Stakeholder Communication", "Crisis Management"],
    setupTime: "20 min",
    rating: 4.9,
    reviews: 45,
    popular: true
  },
  {
    id: 2,
    name: "Personal Productivity Coach",
    description: "Daily task management, goal tracking, and productivity optimization",
    category: "Personal",
    icon: <Zap className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-yellow-500 to-orange-600",
    features: ["Task Management", "Goal Tracking", "Time Analysis", "Habit Building"],
    setupTime: "10 min",
    rating: 4.7,
    reviews: 112,
    popular: false
  },
  {
    id: 3,
    name: "Email Manager",
    description: "Automated email sorting, drafting, and response management",
    category: "Communication",
    icon: <MessageCircle className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
    features: ["Email Sorting", "Auto Responses", "Draft Assistance", "Follow-up Reminders"],
    setupTime: "15 min",
    rating: 4.8,
    reviews: 89,
    popular: false
  },
  {
    id: 4,
    name: "Research Assistant",
    description: "Deep research, fact-checking, and information synthesis",
    category: "Research",
    icon: <Search className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
    features: ["Data Analysis", "Fact Checking", "Report Generation", "Source Verification"],
    setupTime: "25 min",
    rating: 4.9,
    reviews: 67,
    popular: true
  },
  {
    id: 5,
    name: "Creative Assistant",
    description: "Content creation, brainstorming, and creative project support",
    category: "Creative",
    icon: <Palette className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    features: ["Content Creation", "Brainstorming", "Design Ideas", "Creative Writing"],
    setupTime: "18 min",
    rating: 4.6,
    reviews: 134,
    popular: false
  },
  {
    id: 6,
    name: "Learning Coach",
    description: "Educational support, study planning, and knowledge acquisition",
    category: "Education",
    icon: <GraduationCap className="w-8 h-8" />,
    gradient: "bg-gradient-to-br from-teal-500 to-green-600",
    features: ["Study Planning", "Knowledge Testing", "Progress Tracking", "Learning Paths"],
    setupTime: "12 min",
    rating: 4.7,
    reviews: 156,
    popular: false
  }
]

const categories = ["All", "Support", "E-commerce", "Sales", "Booking", "HR", "Professional", "Personal", "Communication", "Research", "Creative", "Education"]

export default function TemplatesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("chatbots")
  const [dynamicResults, setDynamicResults] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [showDeployDialog, setShowDeployDialog] = useState(false)
  const [showLearnMore, setShowLearnMore] = useState(false)

  const handleDeployTemplate = (template: any, type: string) => {
    // Check if template has AI configuration for deployment
    if (template.aiConfig && template.aiConfig.deploymentReady) {
      // Store AI configuration for deployment
      localStorage.setItem('aiDeploymentConfig', JSON.stringify({
        template: template,
        aiConfig: template.aiConfig,
        type: type,
        deploymentTime: new Date().toISOString()
      }))
      
      toast({
        title: "AI Assistant Ready for Deployment",
        description: `${template.name} has been configured and is ready to deploy. Redirecting to deployment...`,
        variant: "default"
      })
      
      // Redirect to deployment page or chatbot creation
      setTimeout(() => {
        router.push('/dashboard/chatbots?deploy=true')
      }, 2000)
    } else {
      // For templates without AI config, show contact dialog
      setSelectedTemplate({ ...template, type })
      setShowDeployDialog(true)
    }
  }

  const handleContactForTemplate = (template?: any) => {
    const templateToUse = template || selectedTemplate
    if (templateToUse) {
      // Store the template data for the contact form
      localStorage.setItem('selectedTemplate', JSON.stringify(templateToUse))
      localStorage.setItem('templateType', templateToUse.type || 'chatbot')
      
      // Store AI configuration if available
      if (templateToUse.aiConfig) {
        localStorage.setItem('aiConfig', JSON.stringify(templateToUse.aiConfig))
      }
      
      // Store template details for contact form
      localStorage.setItem('templateName', templateToUse.name)
      localStorage.setItem('templateDescription', templateToUse.description)
      localStorage.setItem('templateCategory', templateToUse.category)
      
      toast({
        title: "Template Attached",
        description: `${templateToUse.name} has been attached to your contact form.`,
        variant: "default"
      })
      
      router.push('/contact?template=true')
    }
  }

  const handleLearnMore = () => {
    setShowLearnMore(true)
  }

  const handleRequestCustom = () => {
    router.push('/contact?service=custom-template')
  }

  // Function to build and deploy AI assistant
  const buildAndDeployAI = async (template: any) => {
    try {
      // Show building status
      toast({
        title: "Building AI Assistant",
        description: "Configuring AI model and preparing deployment...",
        variant: "default"
      })

      // Simulate AI building process
      const buildSteps = [
        "Initializing AI model...",
        "Loading training data...",
        "Configuring system prompts...",
        "Setting up capabilities...",
        "Preparing deployment..."
      ]

      for (let i = 0; i < buildSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800))
        console.log(`Build step ${i + 1}: ${buildSteps[i]}`)
      }

      // Store the built AI configuration
      const aiAssistant = {
        id: `ai-${Date.now()}`,
        name: template.name,
        description: template.description,
        category: template.category,
        aiConfig: template.aiConfig,
        status: "active",
        createdAt: new Date().toISOString(),
        deploymentUrl: `/api/chatbots/${template.id}`,
        apiKey: `ai_${Math.random().toString(36).substr(2, 9)}`,
        capabilities: template.aiConfig.capabilities,
        model: template.aiConfig.model,
        systemPrompt: template.aiConfig.systemPrompt
      }

      // Store in localStorage for deployment
      localStorage.setItem('deployedAI', JSON.stringify(aiAssistant))
      
      toast({
        title: "AI Assistant Deployed Successfully!",
        description: `${template.name} is now live and ready to use.`,
        variant: "default"
      })

      // Redirect to the deployed AI
      setTimeout(() => {
        router.push('/dashboard/chatbots')
      }, 1500)

    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "There was an error deploying your AI assistant. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Content filtering function
  const filterContent = (text: string): string => {
    const inappropriateWords = [
      'curse', 'curseword', 'inappropriate', 'offensive', 'vulgar', 'profanity',
      'swear', 'swearing', 'badword', 'badwords', 'inappropriate', 'offensive'
    ]
    
    let filteredText = text.toLowerCase()
    
    // Remove inappropriate words
    inappropriateWords.forEach(word => {
      filteredText = filteredText.replace(new RegExp(word, 'gi'), '')
    })
    
    // Clean up extra spaces
    filteredText = filteredText.replace(/\s+/g, ' ').trim()
    
    // Capitalize first letter
    return filteredText.charAt(0).toUpperCase() + filteredText.slice(1)
  }

  // Clean and validate search query
  const cleanQuery = (query: string): string => {
    // Remove special characters and numbers
    let cleaned = query.replace(/[^a-zA-Z\s]/g, '')
    
    // Remove common inappropriate words
    const inappropriateWords = [
      'curse', 'curseword', 'inappropriate', 'offensive', 'vulgar', 'profanity',
      'swear', 'swearing', 'badword', 'badwords', 'inappropriate', 'offensive',
      'stupid', 'dumb', 'idiot', 'fool', 'moron'
    ]
    
    inappropriateWords.forEach(word => {
      cleaned = cleaned.replace(new RegExp(word, 'gi'), '')
    })
    
    // Clean up extra spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim()
    
    // If query is too short or empty after cleaning, use a default
    if (cleaned.length < 2) {
      return 'Assistant'
    }
    
    return cleaned
  }

  // Dynamic template generation based on search
  const generateDynamicTemplates = (query: string) => {
    if (!query.trim()) return []
    
    const cleanQueryText = cleanQuery(query)
    const queryLower = cleanQueryText.toLowerCase()
    const templates = []
    
    // AI Assistant templates
    if (queryLower.includes('ai') || queryLower.includes('assistant') || queryLower.includes('help')) {
      templates.push({
        id: `ai-${Date.now()}`,
        name: `AI ${cleanQueryText} Assistant`,
        description: `Professional AI assistant specialized in ${cleanQueryText}. Provides intelligent responses, automates tasks, and enhances productivity.`,
        category: "AI Assistant",
        icon: Bot,
        gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
        features: ["Intelligent Responses", "Task Automation", "Learning Capabilities", "Integration Ready"],
        setupTime: "5 min",
        rating: 4.9,
        reviews: Math.floor(Math.random() * 200) + 50,
        popular: true,
        dynamic: true,
        // Buildable AI configuration
        aiConfig: {
          model: "gpt-4",
          temperature: 0.7,
          maxTokens: 2000,
          systemPrompt: `You are a professional AI assistant specialized in ${cleanQueryText}. You help users with tasks, provide intelligent responses, and automate workflows. Always be helpful, accurate, and professional.`,
          capabilities: ["text-generation", "task-automation", "learning", "integration"],
          trainingData: `${cleanQueryText}-specific knowledge base`,
          deploymentReady: true
        }
      })
    }
    
    // Business templates
    if (queryLower.includes('business') || queryLower.includes('company') || queryLower.includes('corporate')) {
      templates.push({
        id: `business-${Date.now()}`,
        name: `${cleanQueryText} Business Solution`,
        description: `Professional business automation for ${cleanQueryText}. Streamlines operations, improves efficiency, and drives growth.`,
        category: "Business",
        icon: Building2,
        gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
        features: ["Process Automation", "Analytics Dashboard", "Team Collaboration", "Performance Tracking"],
        setupTime: "10 min",
        rating: 4.8,
        reviews: Math.floor(Math.random() * 150) + 75,
        popular: false,
        dynamic: true,
        // Buildable AI configuration
        aiConfig: {
          model: "gpt-4",
          temperature: 0.6,
          maxTokens: 2500,
          systemPrompt: `You are a business automation AI specialized in ${cleanQueryText}. You help streamline operations, analyze data, and optimize business processes. Provide actionable insights and automate workflows.`,
          capabilities: ["business-automation", "data-analysis", "process-optimization", "team-collaboration"],
          trainingData: "Business operations and management knowledge base",
          deploymentReady: true
        }
      })
    }
    
    // Customer service templates
    if (queryLower.includes('customer') || queryLower.includes('support') || queryLower.includes('help')) {
      templates.push({
        id: `support-${Date.now()}`,
        name: `${cleanQueryText} Support Bot`,
        description: `Professional customer support solution for ${cleanQueryText}. Provides instant help, escalates issues, and tracks satisfaction.`,
        category: "Support",
        icon: Headphones,
        gradient: "bg-gradient-to-br from-green-500 to-teal-600",
        features: ["24/7 Availability", "Issue Resolution", "Customer Satisfaction", "Analytics"],
        setupTime: "8 min",
        rating: 4.9,
        reviews: Math.floor(Math.random() * 300) + 100,
        popular: true,
        dynamic: true,
        // Buildable AI configuration
        aiConfig: {
          model: "gpt-4",
          temperature: 0.5,
          maxTokens: 1500,
          systemPrompt: `You are a customer support AI specialized in ${cleanQueryText}. You provide helpful, accurate support 24/7. Always be empathetic, solve problems efficiently, and escalate when needed.`,
          capabilities: ["customer-support", "issue-resolution", "escalation", "satisfaction-tracking"],
          trainingData: "Customer service and support knowledge base",
          deploymentReady: true
        }
      })
    }
    
    // Sales templates
    if (queryLower.includes('sales') || queryLower.includes('lead') || queryLower.includes('revenue')) {
      templates.push({
        id: `sales-${Date.now()}`,
        name: `${cleanQueryText} Sales Assistant`,
        description: `Professional sales automation for ${cleanQueryText}. Qualifies leads, schedules demos, and tracks conversions.`,
        category: "Sales",
        icon: TrendingUp,
        gradient: "bg-gradient-to-br from-orange-500 to-red-600",
        features: ["Lead Qualification", "Demo Scheduling", "Pipeline Management", "Revenue Tracking"],
        setupTime: "12 min",
        rating: 4.7,
        reviews: Math.floor(Math.random() * 200) + 50,
        popular: false,
        dynamic: true,
        // Buildable AI configuration
        aiConfig: {
          model: "gpt-4",
          temperature: 0.6,
          maxTokens: 2000,
          systemPrompt: `You are a sales AI specialized in ${cleanQueryText}. You qualify leads, schedule demos, and help close deals. Be persuasive, professional, and results-driven.`,
          capabilities: ["lead-qualification", "demo-scheduling", "pipeline-management", "revenue-tracking"],
          trainingData: "Sales and lead generation knowledge base",
          deploymentReady: true
        }
      })
    }
    
    // Creative templates
    if (queryLower.includes('creative') || queryLower.includes('design') || queryLower.includes('art')) {
      templates.push({
        id: `creative-${Date.now()}`,
        name: `${cleanQueryText} Creative Assistant`,
        description: `Professional creative AI assistant for ${cleanQueryText}. Generates ideas, provides inspiration, and helps with content creation.`,
        category: "Creative",
        icon: Palette,
        gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
        features: ["Idea Generation", "Content Creation", "Design Inspiration", "Creative Writing"],
        setupTime: "6 min",
        rating: 4.6,
        reviews: Math.floor(Math.random() * 150) + 25,
        popular: false,
        dynamic: true
      })
    }
    
    // Education templates
    if (queryLower.includes('education') || queryLower.includes('learning') || queryLower.includes('student')) {
      templates.push({
        id: `education-${Date.now()}`,
        name: `${cleanQueryText} Learning Assistant`,
        description: `Professional educational AI assistant for ${cleanQueryText}. Provides personalized learning, tutoring, and knowledge assessment.`,
        category: "Education",
        icon: GraduationCap,
        gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
        features: ["Personalized Learning", "Interactive Tutoring", "Progress Tracking", "Knowledge Assessment"],
        setupTime: "15 min",
        rating: 4.8,
        reviews: Math.floor(Math.random() * 250) + 75,
        popular: true,
        dynamic: true
      })
    }
    
    // Healthcare templates
    if (queryLower.includes('health') || queryLower.includes('medical') || queryLower.includes('doctor')) {
      templates.push({
        id: `health-${Date.now()}`,
        name: `${cleanQueryText} Health Assistant`,
        description: `Professional healthcare AI assistant for ${cleanQueryText}. Provides medical information, appointment scheduling, and health monitoring.`,
        category: "Healthcare",
        icon: Heart,
        gradient: "bg-gradient-to-br from-red-500 to-pink-600",
        features: ["Medical Information", "Appointment Scheduling", "Health Monitoring", "Emergency Alerts"],
        setupTime: "20 min",
        rating: 4.9,
        reviews: Math.floor(Math.random() * 180) + 60,
        popular: true,
        dynamic: true
      })
    }
    
    // Technology templates
    if (queryLower.includes('tech') || queryLower.includes('software') || queryLower.includes('development')) {
      templates.push({
        id: `tech-${Date.now()}`,
        name: `${cleanQueryText} Tech Assistant`,
        description: `Professional technology AI assistant for ${cleanQueryText}. Provides technical support, code assistance, and development guidance.`,
        category: "Technology",
        icon: Code,
        gradient: "bg-gradient-to-br from-gray-500 to-black",
        features: ["Technical Support", "Code Assistance", "Development Guidance", "Debugging Help"],
        setupTime: "10 min",
        rating: 4.7,
        reviews: Math.floor(Math.random() * 300) + 100,
        popular: false,
        dynamic: true
      })
    }
    
    // Generic template for any query
    if (templates.length === 0) {
      templates.push({
        id: `generic-${Date.now()}`,
        name: `${cleanQueryText} Assistant`,
        description: `Professional AI assistant specialized in ${cleanQueryText}. Tailored to your specific needs and requirements.`,
        category: "Custom",
        icon: Bot,
        gradient: "bg-gradient-to-br from-blue-500 to-purple-600",
        features: ["Custom Training", "Specialized Knowledge", "Flexible Integration", "Scalable Solution"],
        setupTime: "15 min",
        rating: 4.8,
        reviews: Math.floor(Math.random() * 200) + 50,
        popular: false,
        dynamic: true
      })
    }
    
    return templates
  }

  // Handle search with dynamic generation
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (query.trim().length > 2) {
      setIsGenerating(true)
      setTimeout(() => {
        const dynamicTemplates = generateDynamicTemplates(query)
        setDynamicResults(dynamicTemplates)
        setIsGenerating(false)
      }, 500)
    } else {
      setDynamicResults([])
    }
  }

  const filteredChatbotTemplates = chatbotTemplates.filter((template) => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredAIAgentTemplates = aiAgentTemplates.filter((template) => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image 
                src="/LOGO.png" 
                alt="ChatHub Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8"
                priority
              />
              <span className="font-bold text-2xl text-foreground">ChatHub</span>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                AI Templates Gallery
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Professionally crafted templates to accelerate your AI implementation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                <Sparkles className="w-5 h-5 mr-2" />
                Explore Templates
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold">
                <Settings className="w-5 h-5 mr-2" />
                Create Custom
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Templates
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Perfect Template
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From customer support to personal productivity, discover templates crafted by AI experts
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="chatbots" className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span>Chatbot Templates</span>
              </TabsTrigger>
              <TabsTrigger value="ai-agents" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>AI Agent Templates</span>
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search for AI templates (e.g., customer service, sales, creative, education)..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value
                    // Real-time content filtering
                    const filteredValue = filterContent(value)
                    handleSearch(filteredValue)
                  }}
                  onKeyPress={(e) => {
                    // Prevent inappropriate content
                    const inappropriateWords = [
                      'curse', 'curseword', 'inappropriate', 'offensive', 'vulgar', 'profanity',
                      'swear', 'swearing', 'badword', 'badwords', 'stupid', 'dumb', 'idiot'
                    ]
                    const inputValue = e.currentTarget.value.toLowerCase()
                    if (inappropriateWords.some(word => inputValue.includes(word))) {
                      e.preventDefault()
                      toast({
                        title: "Content Filtered",
                        description: "Please use appropriate language for your search.",
                        variant: "destructive"
                      })
                    }
                  }}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setDynamicResults([])
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="chatbots" className="space-y-8">
              {/* Dynamic Results */}
              {isGenerating && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating AI templates for "{searchQuery}"...</span>
                  </div>
                </div>
              )}
              
              {/* Dynamic Templates */}
              {dynamicResults.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      AI-Generated Templates for "{searchQuery}"
                    </h3>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {dynamicResults.length} found
                    </Badge>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {dynamicResults.map((template) => (
                      <Card key={template.id} className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                        <div className={`h-3 ${template.gradient} rounded-t-lg`}></div>
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-14 h-14 ${template.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                              <template.icon className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI Generated
                              </Badge>
                              {template.aiConfig && (
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Buildable AI
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(template.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {template.rating} ({template.reviews})
                            </span>
                          </div>
                          <CardTitle className="text-xl group-hover:text-purple-600 transition-colors font-bold">
                            {template.name}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{template.setupTime} setup</span>
                            </div>
                            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                              {template.category}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {template.features.slice(0, 3).map((feature: string, index: number) => (
                              <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                {feature}
                              </div>
                            ))}
                            {template.features.length > 3 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <Plus className="w-3 h-3 mr-1" />
                                {template.features.length - 3} more features
                              </div>
                            )}
                          </div>
                          
                          {/* AI Configuration Details */}
                          {template.aiConfig && (
                            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">AI Configuration</span>
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                                  Ready to Deploy
                                </Badge>
                              </div>
                              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                <div className="flex justify-between">
                                  <span>Model:</span>
                                  <span className="font-mono">{template.aiConfig.model}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Capabilities:</span>
                                  <span className="text-purple-600 dark:text-purple-400">{template.aiConfig.capabilities.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Training Data:</span>
                                  <span className="text-purple-600 dark:text-purple-400">Available</span>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button 
                              className={`flex-1 ${template.gradient} text-white hover:opacity-90 transition-all duration-300 group-hover:scale-105 font-semibold`}
                              onClick={() => handleContactForTemplate(template)}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Contact Me
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Original Templates */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredChatbotTemplates.map((template) => (
                  <Card key={template.id} className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
                    <div className={`h-3 ${template.gradient} rounded-t-lg`}></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 ${template.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                          {template.icon}
                        </div>
                        {template.popular && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(template.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {template.rating} ({template.reviews})
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-purple-600 transition-colors font-bold">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{template.setupTime} setup</span>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {template.category}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </div>
                        ))}
                        {template.features.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Plus className="w-3 h-3 mr-1" />
                            {template.features.length - 3} more features
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className={`flex-1 ${template.gradient} text-white hover:opacity-90 transition-all duration-300 group-hover:scale-105 font-semibold`}
                          onClick={() => handleContactForTemplate(template)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Me
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ai-agents" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredAIAgentTemplates.map((template) => (
                  <Card key={template.id} className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
                    <div className={`h-3 ${template.gradient} rounded-t-lg`}></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 ${template.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                          {template.icon}
                        </div>
                        {template.popular && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(template.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {template.rating} ({template.reviews})
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-purple-600 transition-colors font-bold">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{template.setupTime} setup</span>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {template.category}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </div>
                        ))}
                        {template.features.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Plus className="w-3 h-3 mr-1" />
                            {template.features.length - 3} more features
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className={`flex-1 ${template.gradient} text-white hover:opacity-90 transition-all duration-300 group-hover:scale-105 font-semibold`}
                          onClick={() => handleContactForTemplate(template)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Me
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Empty State */}
          {filteredChatbotTemplates.length === 0 && filteredAIAgentTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No templates found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Try adjusting your search or category filter
              </p>
              <Button onClick={() => {setSearchQuery(""); setSelectedCategory("All")}}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Need a Custom Template?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Can't find what you're looking for? Our team can create a custom template tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={handleRequestCustom}
            >
              Request Custom Template
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => router.push('/contact')}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Deployment Dialog */}
      <Dialog open={showDeployDialog} onOpenChange={setShowDeployDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className={`w-10 h-10 ${selectedTemplate?.gradient} rounded-lg flex items-center justify-center text-white mr-3`}>
                {selectedTemplate?.icon}
              </div>
              {selectedTemplate?.name} Template
            </DialogTitle>
            <DialogDescription>
              Choose how you'd like to proceed with this template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3">
              <Button 
                onClick={handleContactForTemplate}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact for Implementation
                <span className="text-xs ml-2 opacity-80">(Recommended)</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLearnMore}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                Learn More
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRequestCustom}
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Request Custom Template
              </Button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Contact us to implement this template or create a custom solution for your needs.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Learn More Dialog */}
      <Dialog open={showLearnMore} onOpenChange={setShowLearnMore}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className={`w-10 h-10 ${selectedTemplate?.gradient} rounded-lg flex items-center justify-center text-white mr-3`}>
                {selectedTemplate?.icon}
              </div>
              {selectedTemplate?.name} Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="font-bold text-lg mb-1">{selectedTemplate?.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{selectedTemplate?.description}</div>
              <div className="mb-2">
                <Badge>{selectedTemplate?.category}</Badge>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Features:</span>
                <ul className="list-disc ml-6 mt-1">
                  {selectedTemplate?.features?.map((feature: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700 dark:text-gray-200">{feature}</li>
                  ))}
                </ul>
              </div>
              {selectedTemplate?.aiConfig && (
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="font-semibold text-purple-700 dark:text-purple-300 mb-2">AI Configuration</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div><span className="font-semibold">Model:</span> {selectedTemplate.aiConfig.model}</div>
                    <div><span className="font-semibold">Capabilities:</span> {selectedTemplate.aiConfig.capabilities?.join(', ')}</div>
                    <div><span className="font-semibold">System Prompt:</span> <span className="italic">{selectedTemplate.aiConfig.systemPrompt}</span></div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowLearnMore(false)} variant="outline">Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 