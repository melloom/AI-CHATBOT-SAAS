"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, Zap, Filter, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useChatbots } from "@/hooks/use-chatbots"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const templates = [
  {
    id: "ecommerce-support",
    name: "E-commerce Support Specialist",
    description:
      "Advanced order management, shipping tracking, and return processing with personalized recommendations",
    icon: "🛍️",
    setupTime: "3 min",
    rating: 4.9,
    reviews: 1247,
    features: [
      "Order tracking",
      "Return automation",
      "Product recommendations",
      "Inventory queries",
      "Payment support",
    ],
    tone: "Friendly & Helpful",
    workflowId: "ecommerce-workflow-001",
    category: "E-commerce",
    gradient: "gradient-bg-1",
    popular: true,
  },
  {
    id: "saas-onboarding",
    name: "SaaS Onboarding Guru",
    description: "Comprehensive user onboarding with feature tutorials, account setup, and success tracking",
    icon: "🚀",
    setupTime: "5 min",
    rating: 4.8,
    reviews: 892,
    features: ["Interactive tutorials", "Account setup", "Feature discovery", "Progress tracking", "Success metrics"],
    tone: "Professional & Encouraging",
    workflowId: "saas-onboarding-workflow-001",
    category: "SaaS",
    gradient: "gradient-bg-2",
    popular: false,
  },
  {
    id: "it-helpdesk",
    name: "IT Support Wizard",
    description: "Technical troubleshooting expert with automated diagnostics and escalation protocols",
    icon: "🔧",
    setupTime: "7 min",
    rating: 4.7,
    reviews: 634,
    features: ["Auto diagnostics", "Ticket creation", "Knowledge base", "Escalation rules", "Asset tracking"],
    tone: "Technical & Patient",
    workflowId: "it-helpdesk-workflow-001",
    category: "IT Support",
    gradient: "gradient-bg-3",
    popular: false,
  },
  {
    id: "lead-qualification",
    name: "Sales Qualification Pro",
    description: "Intelligent lead scoring with automated follow-ups and CRM integration",
    icon: "📊",
    setupTime: "4 min",
    rating: 4.9,
    reviews: 1089,
    features: ["Lead scoring", "CRM sync", "Meeting booking", "Follow-up automation", "Pipeline tracking"],
    tone: "Professional & Persuasive",
    workflowId: "lead-qualification-workflow-001",
    category: "Sales",
    gradient: "gradient-bg-4",
    popular: true,
  },
  {
    id: "hr-assistant",
    name: "HR Support Companion",
    description: "Employee assistance with policy guidance, benefits info, and leave management",
    icon: "👤",
    setupTime: "6 min",
    rating: 4.6,
    reviews: 456,
    features: ["Policy guidance", "Benefits calculator", "Leave requests", "Onboarding support", "FAQ automation"],
    tone: "Friendly & Confidential",
    workflowId: "hr-assistant-workflow-001",
    category: "Human Resources",
    gradient: "gradient-bg-5",
    popular: false,
  },
  {
    id: "booking-assistant",
    name: "Smart Booking Manager",
    description: "Intelligent appointment scheduling with calendar sync and automated reminders",
    icon: "📅",
    setupTime: "4 min",
    rating: 4.8,
    reviews: 723,
    features: ["Smart scheduling", "Calendar sync", "Automated reminders", "Rescheduling", "Availability optimization"],
    tone: "Efficient & Courteous",
    workflowId: "booking-assistant-workflow-001",
    category: "Scheduling",
    gradient: "gradient-bg-6",
    popular: false,
  },
]

const categories = ["All", "E-commerce", "SaaS", "IT Support", "Sales", "Human Resources", "Scheduling"]

export default function MarketplacePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { toast } = useToast()
  const { createChatbot } = useChatbots()

  const handleDeployTemplate = async (template: any) => {
    try {
      await createChatbot({
        name: template.name,
        description: template.description,
        tone: template.tone,
        workflowId: template.workflowId,
        active: true,
      })

      toast({
        title: "🎉 Template deployed successfully!",
        description: `${template.name} is now ready to assist your customers on ChatHub.`,
      })
    } catch (error) {
      toast({
        title: "Deployment failed",
        description: "Failed to deploy template. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Solutions Marketplace</h1>
          <p className="text-lg text-white/90 mb-4">Deploy industry-specific AI assistants in minutes, not hours</p>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-300" />
              <span>4.8 average rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>5,000+ deployments</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Average setup: 5 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search templates by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
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

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
          >
            {/* Gradient header */}
            <div className={`h-2 ${template.gradient}`}></div>

            <CardHeader className="relative">
              {template.popular && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs animate-pulse">
                  🔥 Popular
                </Badge>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{template.icon}</div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{template.rating}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-300">({template.reviews})</span>
                  </div>
                </div>
              </div>
              <CardTitle className="text-xl group-hover:text-purple-600 transition-colors text-gray-900 dark:text-white">{template.name}</CardTitle>
              <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{template.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Quick stats */}
              <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-200">{template.setupTime} setup</span>
                </div>
                <Badge variant="outline" className="text-xs dark:text-gray-200">
                  {template.category}
                </Badge>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Key Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                      {feature}
                    </Badge>
                  ))}
                  {template.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                      +{template.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Personality */}
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-300">Personality: </span>
                <span className="font-medium text-gray-700 dark:text-gray-200">{template.tone}</span>
              </div>

              {/* Deploy button */}
              <Button
                className={`w-full ${template.gradient} text-white hover:opacity-90 transition-all duration-300 group-hover:scale-105`}
                onClick={() => handleDeployTemplate(template)}
              >
                <Zap className="mr-2 h-4 w-4" />
                Deploy Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No templates found</h3>
          <p className="text-gray-500 dark:text-gray-300">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Custom solution CTA */}
      <Card className="relative overflow-hidden border-2 border-dashed border-purple-200 dark:border-purple-700">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"></div>
        <CardContent className="relative p-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="text-6xl">🎨</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Need something unique?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our AI experts can create a custom chatbot solution tailored specifically to your business needs and
                industry requirements.
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>✓ Custom training data</span>
                <span>✓ Brand voice matching</span>
                <span>✓ Advanced integrations</span>
                <span>✓ Dedicated support</span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Request Custom Solution
              </Button>
              <Button variant="outline" size="lg" className="bg-white dark:bg-gray-800 dark:text-gray-200">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
