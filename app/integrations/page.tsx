"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Mail,
  Phone,
  MapPin,
  Database,
  Cloud,
  Lock,
  Settings,
  Code,
  Link,
  CheckCircle,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Play,
  Bookmark,
  Share2,
  Send,
  Plus,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Chatbot Integrations
const chatbotIntegrations = [
  {
    id: 1,
    name: "Slack",
    description: "Connect your chatbot to Slack for team communication",
    category: "Communication",
    icon: MessageCircle,
    gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
    features: ["Real-time messaging", "Channel integration", "Team notifications", "File sharing"],
    status: "Available",
    popular: true,
    rating: 4.8,
    users: "50K+"
  },
  {
    id: 2,
    name: "Discord",
    description: "Integrate with Discord servers for community management",
    category: "Communication",
    icon: Users,
    gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
    features: ["Server management", "Role-based access", "Voice channels", "Moderation tools"],
    status: "Available",
    popular: false,
    rating: 4.6,
    users: "25K+"
  },
  {
    id: 3,
    name: "WhatsApp Business",
    description: "Connect to WhatsApp Business API for customer engagement",
    category: "Messaging",
    icon: Phone,
    gradient: "bg-gradient-to-br from-green-500 to-teal-600",
    features: ["Business messaging", "Media sharing", "Contact management", "Analytics"],
    status: "Available",
    popular: true,
    rating: 4.9,
    users: "100K+"
  },
  {
    id: 4,
    name: "Telegram",
    description: "Integrate with Telegram for automated messaging",
    category: "Messaging",
    icon: MessageCircle,
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
    features: ["Bot API", "Channel management", "Group chats", "File sharing"],
    status: "Available",
    popular: false,
    rating: 4.5,
    users: "30K+"
  },
  {
    id: 5,
    name: "Shopify",
    description: "Connect to Shopify for e-commerce automation",
    category: "E-commerce",
    icon: ShoppingCart,
    gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
    features: ["Order management", "Product catalog", "Inventory sync", "Customer data"],
    status: "Available",
    popular: true,
    rating: 4.7,
    users: "75K+"
  },
  {
    id: 6,
    name: "WooCommerce",
    description: "Integrate with WooCommerce for WordPress stores",
    category: "E-commerce",
    icon: ShoppingCart,
    gradient: "bg-gradient-to-br from-orange-500 to-red-600",
    features: ["WordPress integration", "Order tracking", "Product sync", "Payment processing"],
    status: "Available",
    popular: false,
    rating: 4.4,
    users: "40K+"
  },
  {
    id: 7,
    name: "Zendesk",
    description: "Connect to Zendesk for customer support automation",
    category: "Support",
    icon: Headphones,
    gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
    features: ["Ticket management", "Knowledge base", "Customer data", "Workflow automation"],
    status: "Available",
    popular: true,
    rating: 4.8,
    users: "60K+"
  },
  {
    id: 8,
    name: "Intercom",
    description: "Integrate with Intercom for customer messaging",
    category: "Support",
    icon: MessageCircle,
    gradient: "bg-gradient-to-br from-purple-500 to-violet-600",
    features: ["Live chat", "Customer profiles", "Conversation history", "Team collaboration"],
    status: "Available",
    popular: false,
    rating: 4.6,
    users: "35K+"
  },
  {
    id: 9,
    name: "HubSpot",
    description: "Connect to HubSpot for CRM and marketing automation",
    category: "CRM",
    icon: Building2,
    gradient: "bg-gradient-to-br from-orange-500 to-pink-600",
    features: ["Lead management", "Email marketing", "Contact sync", "Analytics"],
    status: "Available",
    popular: true,
    rating: 4.9,
    users: "80K+"
  },
  {
    id: 10,
    name: "Salesforce",
    description: "Integrate with Salesforce for enterprise CRM",
    category: "CRM",
    icon: TrendingUp,
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
    features: ["Lead tracking", "Opportunity management", "Account sync", "Reporting"],
    status: "Available",
    popular: false,
    rating: 4.7,
    users: "45K+"
  },
  {
    id: 11,
    name: "Google Calendar",
    description: "Connect to Google Calendar for scheduling automation",
    category: "Productivity",
    icon: Calendar,
    gradient: "bg-gradient-to-br from-blue-500 to-green-600",
    features: ["Appointment booking", "Calendar sync", "Meeting scheduling", "Reminders"],
    status: "Available",
    popular: true,
    rating: 4.8,
    users: "90K+"
  },
  {
    id: 12,
    name: "Notion",
    description: "Integrate with Notion for knowledge management",
    category: "Productivity",
    icon: FileText,
    gradient: "bg-gradient-to-br from-gray-500 to-black",
    features: ["Database sync", "Page creation", "Knowledge base", "Team collaboration"],
    status: "Available",
    popular: false,
    rating: 4.5,
    users: "20K+"
  }
]

// AI Agent Integrations
const aiAgentIntegrations = [
  {
    id: 1,
    name: "Gmail",
    description: "Connect your AI agent to Gmail for email management",
    category: "Communication",
    icon: Mail,
    gradient: "bg-gradient-to-br from-red-500 to-pink-600",
    features: ["Email automation", "Smart replies", "Calendar integration", "Contact sync"],
    status: "Available",
    popular: true,
    rating: 4.9,
    users: "120K+"
  },
  {
    id: 2,
    name: "Outlook",
    description: "Integrate with Outlook for enterprise email management",
    category: "Communication",
    icon: Mail,
    gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
    features: ["Enterprise email", "Calendar sync", "Meeting scheduling", "Task management"],
    status: "Available",
    popular: false,
    rating: 4.6,
    users: "55K+"
  },
  {
    id: 3,
    name: "Trello",
    description: "Connect to Trello for project management automation",
    category: "Productivity",
    icon: Briefcase,
    gradient: "bg-gradient-to-br from-blue-500 to-teal-600",
    features: ["Task automation", "Board management", "Team collaboration", "Progress tracking"],
    status: "Available",
    popular: true,
    rating: 4.7,
    users: "65K+"
  },
  {
    id: 4,
    name: "Asana",
    description: "Integrate with Asana for team project management",
    category: "Productivity",
    icon: Briefcase,
    gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
    features: ["Project tracking", "Task assignment", "Timeline management", "Team communication"],
    status: "Available",
    popular: false,
    rating: 4.5,
    users: "40K+"
  },
  {
    id: 5,
    name: "Stripe",
    description: "Connect to Stripe for payment processing automation",
    category: "Finance",
    icon: CreditCard,
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
    features: ["Payment processing", "Invoice automation", "Subscription management", "Financial reporting"],
    status: "Available",
    popular: true,
    rating: 4.8,
    users: "85K+"
  },
  {
    id: 6,
    name: "QuickBooks",
    description: "Integrate with QuickBooks for accounting automation",
    category: "Finance",
    icon: Database,
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    features: ["Accounting sync", "Invoice generation", "Expense tracking", "Financial reports"],
    status: "Available",
    popular: false,
    rating: 4.6,
    users: "50K+"
  }
]

const categories = ["All", "Communication", "Messaging", "E-commerce", "Support", "CRM", "Productivity", "Finance"]

export default function IntegrationsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("chatbots")
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    company: "",
    integration: "",
    description: "",
    useCase: ""
  })

  const handleContactForIntegration = (integration: any, type: string) => {
    // Store integration selection for contact form (without the icon component)
    const integrationForStorage = {
      ...integration,
      iconName: integration.icon.name // Store the icon name instead of the component
    }
    localStorage.setItem('selectedIntegration', JSON.stringify(integrationForStorage))
    localStorage.setItem('integrationType', type)
    localStorage.setItem('integrationRequest', 'true')
    
    console.log('Stored integration:', integrationForStorage)
    console.log('Integration type:', type)
    console.log('localStorage set:', localStorage.getItem('selectedIntegration'))
    
    // Add a small delay to ensure localStorage is set before redirect
    setTimeout(() => {
      // Redirect to contact page with integration pre-selected
      console.log('Redirecting to contact page...')
      router.push('/contact?integration=true')
    }, 100)
  }

  const handleRequestIntegration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestForm,
          subject: `Integration Request: ${requestForm.integration}`,
          type: 'integration_request'
        }),
      })

      if (response.ok) {
        // Reset form
        setRequestForm({
          name: "",
          email: "",
          company: "",
          integration: "",
          description: "",
          useCase: ""
        })
        setShowRequestDialog(false)
        // You can add a success toast here
        alert('Integration request submitted successfully! We\'ll get back to you soon.')
      } else {
        throw new Error('Failed to submit request')
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredChatbotIntegrations = chatbotIntegrations.filter((integration) => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || integration.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredAIAgentIntegrations = aiAgentIntegrations.filter((integration) => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || integration.category === selectedCategory
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
        {/* Animated background */}
        <div className="absolute inset-0 animated-gradient opacity-10"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full opacity-20 float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full opacity-20 float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full opacity-20 float" style={{ animationDelay: "4s" }}></div>
        
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-8 border border-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              🚀 500+ Integrations Available
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Powerful Integrations
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Explore available integrations for ChatHub. Contact us to set up any integration you need.
              <strong className="text-white"> Custom integrations available.</strong>
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-blue-100">500+ Integrations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-100">2.3s Setup Time</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-blue-100">99.9% Uptime</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                <Zap className="w-4 h-4 mr-2" />
                Browse Integrations
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => setShowRequestDialog(true)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Request Integration
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-full text-sm font-medium text-purple-800 dark:text-purple-200 mb-6 border border-purple-200/50 dark:border-purple-700/50">
              <Sparkles className="w-4 h-4 mr-2" />
              Seamless Integration
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Connect Your Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Browse available integrations for ChatHub. Contact us to implement any integration you need.
              <strong className="text-purple-600 dark:text-purple-400"> Custom solutions available.</strong>
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <TabsTrigger value="chatbots" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <Bot className="w-4 h-4" />
                <span>Chatbot Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="ai-agents" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
                <User className="w-4 h-4" />
                <span>AI Agent Integrations</span>
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search integrations by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
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
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredChatbotIntegrations.map((integration) => (
                  <Card key={integration.id} className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200 dark:hover:border-purple-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm overflow-hidden">
                    <div className={`h-1 ${integration.gradient}`}></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${integration.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                          <integration.icon className="w-8 h-8" />
                        </div>
                        <div className="flex items-center space-x-2">
                          {integration.popular && (
                            <Badge className="bg-orange-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{integration.rating}</span>
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                        {integration.name}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {integration.description}
                      </CardDescription>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {integration.category}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {integration.users} users
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {integration.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                        {integration.features.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{integration.features.length - 3} more features
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {integration.status}
                        </Badge>
                        <Button 
                          size="sm"
                          className={`${integration.gradient} text-white hover:opacity-90 transition-all duration-300 group-hover:scale-105`}
                          onClick={() => handleContactForIntegration(integration, 'chatbot')}
                        >
                          Contact Me
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ai-agents" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredAIAgentIntegrations.map((integration) => (
                  <Card key={integration.id} className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm overflow-hidden">
                    <div className={`h-1 ${integration.gradient}`}></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${integration.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                          <integration.icon className="w-8 h-8" />
                        </div>
                        <div className="flex items-center space-x-2">
                          {integration.popular && (
                            <Badge className="bg-orange-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{integration.rating}</span>
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {integration.name}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {integration.description}
                      </CardDescription>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {integration.category}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {integration.users} users
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {integration.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                        {integration.features.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{integration.features.length - 3} more features
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {integration.status}
                        </Badge>
                        <Button 
                          size="sm"
                          className={`${integration.gradient} text-white hover:opacity-90 transition-all duration-300 group-hover:scale-105`}
                          onClick={() => handleContactForIntegration(integration, 'ai-agent')}
                        >
                          Contact Me
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Empty State */}
          {filteredChatbotIntegrations.length === 0 && filteredAIAgentIntegrations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No integrations found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Integration?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Don't see what you're looking for? We can build custom integrations for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-purple-50"
              onClick={() => setShowRequestDialog(true)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Request Custom Integration
            </Button>
          </div>
        </div>
      </section>

      {/* Integration Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mr-3">
                <ExternalLink className="w-5 h-5" />
              </div>
              Request New Integration
            </DialogTitle>
            <DialogDescription className="text-base">
              Tell us about the integration you need. We'll review your request and get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleRequestIntegration} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={requestForm.name}
                  onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                  placeholder="John Doe"
                  required
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={requestForm.email}
                  onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                  placeholder="john@company.com"
                  required
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  value={requestForm.company}
                  onChange={(e) => setRequestForm({...requestForm, company: e.target.value})}
                  placeholder="Your Company"
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="integration">Integration Name *</Label>
                <Input
                  id="integration"
                  value={requestForm.integration}
                  onChange={(e) => setRequestForm({...requestForm, integration: e.target.value})}
                  placeholder="e.g., Salesforce, Zapier, etc."
                  required
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Integration Description *</Label>
              <Textarea
                id="description"
                value={requestForm.description}
                onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                placeholder="Describe what this integration should do and what platform/service it should connect to..."
                required
                rows={3}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="useCase">Use Case & Benefits</Label>
              <Textarea
                id="useCase"
                value={requestForm.useCase}
                onChange={(e) => setRequestForm({...requestForm, useCase: e.target.value})}
                placeholder="How will this integration help your business? What specific problems will it solve?"
                rows={3}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm resize-none"
              />
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  We'll respond within 24 hours
                </div>
                <div className="flex items-center mt-1">
                  <Shield className="w-4 h-4 mr-2 text-blue-500" />
                  Your information is secure
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRequestDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 