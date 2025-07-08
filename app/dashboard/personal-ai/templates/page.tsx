"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Bot, 
  Brain, 
  MessageCircle, 
  Shield, 
  Zap, 
  CheckCircle, 
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
  Plus,
  Sparkles,
  Eye,
  Download
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const aiTemplates = [
  {
    id: 1,
    name: "Email Management Assistant",
    description: "Automated email sorting, drafting, and response management",
    category: "Productivity",
    icon: Mail,
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
    features: ["Email Sorting", "Auto Responses", "Draft Assistance", "Follow-up Reminders"],
    setupTime: "5 min",
    rating: 4.9,
    reviews: 127,
    popular: true,
    price: "Free"
  },
  {
    id: 2,
    name: "Calendar Optimization Bot",
    description: "Smart scheduling, conflict resolution, and time management",
    category: "Productivity",
    icon: Calendar,
    gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
    features: ["Smart Scheduling", "Conflict Resolution", "Time Tracking", "Meeting Prep"],
    setupTime: "8 min",
    rating: 4.8,
    reviews: 89,
    popular: false,
    price: "Free"
  },
  {
    id: 3,
    name: "Document Assistant",
    description: "Document creation, editing, and formatting assistance",
    category: "Content",
    icon: FileText,
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    features: ["Document Creation", "Editing Help", "Formatting", "Templates"],
    setupTime: "10 min",
    rating: 4.7,
    reviews: 156,
    popular: false,
    price: "Free"
  },
  {
    id: 4,
    name: "Research Assistant",
    description: "Deep research, fact-checking, and information synthesis",
    category: "Research",
    icon: Search,
    gradient: "bg-gradient-to-br from-orange-500 to-red-600",
    features: ["Data Analysis", "Fact Checking", "Report Generation", "Source Verification"],
    setupTime: "15 min",
    rating: 4.9,
    reviews: 203,
    popular: true,
    price: "Free"
  },
  {
    id: 5,
    name: "Voice Assistant",
    description: "Voice commands, transcription, and hands-free operation",
    category: "Accessibility",
    icon: Mic,
    gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
    features: ["Voice Commands", "Transcription", "Hands-free", "Multi-language"],
    setupTime: "12 min",
    rating: 4.6,
    reviews: 78,
    popular: false,
    price: "Free"
  },
  {
    id: 6,
    name: "Creative Assistant",
    description: "Content creation, brainstorming, and creative project support",
    category: "Creative",
    icon: Palette,
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    features: ["Content Creation", "Brainstorming", "Design Ideas", "Creative Writing"],
    setupTime: "18 min",
    rating: 4.8,
    reviews: 134,
    popular: false,
    price: "Free"
  },
  {
    id: 7,
    name: "Learning Coach",
    description: "Educational support, study planning, and knowledge acquisition",
    category: "Education",
    icon: Brain,
    gradient: "bg-gradient-to-br from-teal-500 to-green-600",
    features: ["Study Planning", "Knowledge Testing", "Progress Tracking", "Learning Paths"],
    setupTime: "12 min",
    rating: 4.7,
    reviews: 156,
    popular: false,
    price: "Free"
  },
  {
    id: 8,
    name: "Task Automation Bot",
    description: "Automate repetitive tasks and workflows",
    category: "Automation",
    icon: Zap,
    gradient: "bg-gradient-to-br from-yellow-500 to-orange-600",
    features: ["Task Automation", "Workflow Management", "Integration", "Scheduling"],
    setupTime: "20 min",
    rating: 4.9,
    reviews: 189,
    popular: true,
    price: "Free"
  }
]

const categories = ["All", "Productivity", "Content", "Research", "Accessibility", "Creative", "Education", "Automation"]

export default function PersonalAITemplates() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const handleCreateAI = (template: any) => {
    // Store template selection for the creation process
    localStorage.setItem('selectedAITemplate', JSON.stringify(template))
    
    toast({
      title: "Template Selected",
      description: `${template.name} has been selected for your new AI assistant.`,
      variant: "default"
    })
    
    // Redirect to AI creation page
    router.push('/dashboard/personal-ai/create')
  }

  const handlePreview = (template: any) => {
    // Store template for preview
    localStorage.setItem('previewTemplate', JSON.stringify(template))
    router.push(`/dashboard/personal-ai/templates/${template.id}`)
  }

  const filteredTemplates = aiTemplates.filter((template) => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Templates</h1>
          <p className="text-muted-foreground">Browse and select AI templates to create your personal assistants</p>
        </div>
        <Button onClick={() => router.push('/personal-ai-agents')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Custom AI
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search AI templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className={`h-3 ${template.gradient} rounded-t-lg`}></div>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${template.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <template.icon className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {template.popular && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {template.price}
                  </Badge>
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
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={() => handleCreateAI(template)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create AI
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handlePreview(template)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
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

      {/* Featured Templates */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Featured Templates</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {aiTemplates.filter(t => t.popular).slice(0, 2).map((template) => (
            <Card key={template.id} className="relative overflow-hidden border-2 border-purple-200 dark:border-purple-700">
              <div className={`absolute inset-0 ${template.gradient} opacity-10`}></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${template.gradient} rounded-lg flex items-center justify-center text-white`}>
                      <template.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4 mr-1" />
                      {template.setupTime} setup
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      {template.rating} rating
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    onClick={() => handleCreateAI(template)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 