"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Globe, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ShoppingCart, 
  Users, 
  FileText, 
  Calendar,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Star,
  Target,
  DollarSign,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Palette,
  Shield,
  BarChart3,
  MessageSquare,
  CreditCard,
  Globe2,
  Smartphone as Mobile,
  Database,
  Settings,
  Eye,
  Search,
  Share2,
  Languages,
  Lock,
  TrendingUp,
  Heart,
  Award,
  Lightbulb,
  Rocket
} from "lucide-react"

interface FormData {
  projectName: string
  description: string
  businessType: string
  targetAudience: string
  features: string[]
  timeline: string
  budget: string
  contactEmail: string
  phoneNumber: string
  additionalNotes: string
  projectType: string
  priority: string
}

interface FeatureOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  estimatedCost: string
}

interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  features: string[]
  estimatedBudget: string
  timeline: string
}

export default function RequestNewWebApp() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    description: "",
    businessType: "",
    targetAudience: "",
    features: [],
    timeline: "",
    budget: "",
    contactEmail: "",
    phoneNumber: "",
    additionalNotes: "",
    projectType: "",
    priority: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const businessTypes = [
    "E-commerce",
    "Business Services",
    "Restaurant & Food",
    "Healthcare",
    "Education",
    "Real Estate",
    "Entertainment",
    "Non-Profit",
    "Technology",
    "Other"
  ]

  const projectTemplates: ProjectTemplate[] = [
    {
      id: "ecommerce",
      name: "E-commerce Store",
      description: "Complete online store with payment processing",
      icon: <ShoppingCart className="h-6 w-6 text-blue-600" />,
      features: ["E-commerce Integration", "Payment Processing", "User Authentication", "Admin Panel"],
      estimatedBudget: "$5,000 - $15,000",
      timeline: "4-8 weeks"
    },
    {
      id: "business",
      name: "Business Website",
      description: "Professional business website with lead generation",
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      features: ["Responsive Design", "Contact Forms", "SEO Optimization", "Analytics Dashboard"],
      estimatedBudget: "$2,000 - $8,000",
      timeline: "2-4 weeks"
    },
    {
      id: "appointment",
      name: "Appointment Booking",
      description: "Booking system for services and consultations",
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      features: ["Appointment Booking", "User Authentication", "Admin Panel", "Payment Processing"],
      estimatedBudget: "$3,000 - $10,000",
      timeline: "3-6 weeks"
    },
    {
      id: "custom",
      name: "Custom Solution",
      description: "Bespoke web application tailored to your needs",
      icon: <Sparkles className="h-6 w-6 text-blue-600" />,
      features: ["Custom Features", "API Integration", "Advanced Analytics", "Mobile App"],
      estimatedBudget: "$10,000+",
      timeline: "2-6 months"
    }
  ]

  const featureOptions: FeatureOption[] = [
    // Core Features
    {
      id: "responsive-design",
      name: "Responsive Design",
      description: "Works perfectly on all devices",
      icon: <Monitor className="h-5 w-5 text-blue-600" />,
      category: "Core",
      estimatedCost: "$500"
    },
    {
      id: "user-auth",
      name: "User Authentication",
      description: "Secure login and user management",
      icon: <Lock className="h-5 w-5 text-blue-600" />,
      category: "Core",
      estimatedCost: "$800"
    },
    {
      id: "admin-panel",
      name: "Admin Panel",
      description: "Easy content and user management",
      icon: <Settings className="h-5 w-5 text-blue-600" />,
      category: "Core",
      estimatedCost: "$1,200"
    },
    // E-commerce
    {
      id: "ecommerce",
      name: "E-commerce Integration",
      description: "Complete online store functionality",
      icon: <ShoppingCart className="h-5 w-5 text-blue-600" />,
      category: "E-commerce",
      estimatedCost: "$2,500"
    },
    {
      id: "payment-processing",
      name: "Payment Processing",
      description: "Secure payment gateway integration",
      icon: <CreditCard className="h-5 w-5 text-blue-600" />,
      category: "E-commerce",
      estimatedCost: "$1,500"
    },
    // Content & Communication
    {
      id: "cms",
      name: "Content Management",
      description: "Easy content updates and management",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      category: "Content",
      estimatedCost: "$1,000"
    },
    {
      id: "blog",
      name: "Blog/News Section",
      description: "Publish articles and updates",
      icon: <MessageSquare className="h-5 w-5 text-blue-600" />,
      category: "Content",
      estimatedCost: "$800"
    },
    {
      id: "contact-forms",
      name: "Contact Forms",
      description: "Lead generation and customer contact",
      icon: <Mail className="h-5 w-5 text-blue-600" />,
      category: "Communication",
      estimatedCost: "$300"
    },
    {
      id: "appointment-booking",
      name: "Appointment Booking",
      description: "Schedule appointments and consultations",
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
      category: "Communication",
      estimatedCost: "$1,500"
    },
    // Analytics & SEO
    {
      id: "analytics",
      name: "Analytics Dashboard",
      description: "Track performance and user behavior",
      icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
      category: "Analytics",
      estimatedCost: "$600"
    },
    {
      id: "seo",
      name: "SEO Optimization",
      description: "Improve search engine visibility",
      icon: <Search className="h-5 w-5 text-blue-600" />,
      category: "Analytics",
      estimatedCost: "$400"
    },
    // Advanced Features
    {
      id: "social-media",
      name: "Social Media Integration",
      description: "Connect with social platforms",
      icon: <Share2 className="h-5 w-5 text-blue-600" />,
      category: "Advanced",
      estimatedCost: "$500"
    },
    {
      id: "multi-language",
      name: "Multi-language Support",
      description: "Support for multiple languages",
      icon: <Languages className="h-5 w-5 text-blue-600" />,
      category: "Advanced",
      estimatedCost: "$1,200"
    },
    {
      id: "api-integration",
      name: "API Integration",
      description: "Connect with external services",
      icon: <Database className="h-5 w-5 text-blue-600" />,
      category: "Advanced",
      estimatedCost: "$1,500"
    },
    {
      id: "mobile-app",
      name: "Mobile App",
      description: "Native mobile application",
      icon: <Mobile className="h-5 w-5 text-blue-600" />,
      category: "Advanced",
      estimatedCost: "$5,000"
    }
  ]

  const timelineOptions = [
    { value: "1-2 weeks", label: "1-2 weeks", description: "Quick turnaround" },
    { value: "2-4 weeks", label: "2-4 weeks", description: "Standard timeline" },
    { value: "1-2 months", label: "1-2 months", description: "Complex features" },
    { value: "2-3 months", label: "2-3 months", description: "Large project" },
    { value: "3-6 months", label: "3-6 months", description: "Enterprise solution" },
    { value: "6+ months", label: "6+ months", description: "Custom development" }
  ]

  const budgetOptions = [
    { value: "Under $1,000", label: "Under $1,000", description: "Basic website" },
    { value: "$1,000 - $3,000", label: "$1,000 - $3,000", description: "Standard features" },
    { value: "$3,000 - $5,000", label: "$3,000 - $5,000", description: "Advanced features" },
    { value: "$5,000 - $10,000", label: "$5,000 - $10,000", description: "E-commerce ready" },
    { value: "$10,000 - $20,000", label: "$10,000 - $20,000", description: "Custom solution" },
    { value: "$20,000+", label: "$20,000+", description: "Enterprise level" }
  ]

  const priorityOptions = [
    { value: "low", label: "Low Priority", description: "Flexible timeline" },
    { value: "medium", label: "Medium Priority", description: "Standard timeline" },
    { value: "high", label: "High Priority", description: "Urgent delivery" },
    { value: "urgent", label: "Urgent", description: "Rush delivery" }
  ]

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }))
  }

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setFormData(prev => ({
      ...prev,
      projectType: template.id,
      features: template.features.map(f => featureOptions.find(fo => fo.name === f)?.id || f),
      timeline: template.timeline,
      budget: template.estimatedBudget
    }))
  }

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.projectName.trim()) errors.projectName = "Project name is required"
        if (!formData.businessType) errors.businessType = "Business type is required"
        if (!formData.description.trim()) errors.description = "Project description is required"
        break
      case 2:
        if (formData.features.length === 0) errors.features = "Please select at least one feature"
        break
      case 3:
        if (!formData.timeline) errors.timeline = "Timeline is required"
        if (!formData.budget) errors.budget = "Budget range is required"
        break
      case 4:
        if (!formData.contactEmail.trim()) errors.contactEmail = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
          errors.contactEmail = "Please enter a valid email"
        }
        break
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/website-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit request')
      }

      const result = await response.json()
      console.log('Request submitted successfully:', result)
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting request:', error)
      setIsSubmitting(false)
      // You could add error handling here (show error message to user)
    }
  }

  const getSelectedFeatures = () => {
    return featureOptions.filter(f => formData.features.includes(f.id))
  }

  const getEstimatedTotal = () => {
    const selectedFeatures = getSelectedFeatures()
    return selectedFeatures.reduce((total, feature) => {
      const cost = parseInt(feature.estimatedCost.replace(/[$,]/g, ''))
      return total + cost
    }, 0)
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-green-800 dark:text-green-200">Request Submitted Successfully!</CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                Thank you for your web app request. Our team will review your requirements and contact you within 24-48 hours. Once approved, your project will appear in your Manage Websites page.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 dark:text-white">What happens next?</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>We'll review your requirements within 24 hours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Our team will schedule a consultation call</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>You'll receive a detailed proposal and timeline</span>
                    </div>
                  </div>
                </div>
                <Button onClick={() => setIsSubmitted(false)} className="w-full">
                  Submit Another Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Request New Web App</h1>
              <p className="text-gray-600 dark:text-gray-300">Tell us about your project and we'll create a custom solution for you</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Project Info</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Features</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Timeline & Budget</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Contact</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Review</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Project Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Project Templates */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Choose a Project Template (Optional)</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Start with a template to get quick estimates and suggested features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectTemplates.map(template => (
                      <div
                        key={template.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md bg-white dark:bg-gray-800 ${
                          formData.projectType === template.id
                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            {template.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{template.estimatedBudget}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Timeline:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{template.timeline}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Includes:</div>
                          <div className="flex flex-wrap gap-1">
                            {template.features.slice(0, 3).map(feature => (
                              <Badge key={feature} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                {feature}
                              </Badge>
                            ))}
                            {template.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                +{template.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Basic Project Information */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Project Information</span>
              </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                Basic details about your web application project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                      <Label htmlFor="projectName" className="text-gray-700 dark:text-gray-300">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Enter your project name"
                        className={formErrors.projectName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                  />
                      {formErrors.projectName && (
                        <p className="text-sm text-red-500">{formErrors.projectName}</p>
                      )}
                </div>
                <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-gray-700 dark:text-gray-300">Business Type *</Label>
                      <Select 
                        value={formData.businessType} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}
                      >
                        <SelectTrigger className={formErrors.businessType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                      {formErrors.businessType && (
                        <p className="text-sm text-red-500">{formErrors.businessType}</p>
                      )}
                </div>
              </div>
              <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Project Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project, goals, and requirements..."
                  rows={4}
                      className={formErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                />
                    {formErrors.description && (
                      <p className="text-sm text-red-500">{formErrors.description}</p>
                    )}
              </div>
              <div className="space-y-2">
                    <Label htmlFor="targetAudience" className="text-gray-700 dark:text-gray-300">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="Who is your target audience?"
                      className="border-gray-300 dark:border-gray-600"
                />
              </div>
            </CardContent>
          </Card>
            </div>
          )}

          {/* Step 2: Features Selection */}
          {currentStep === 2 && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Features & Requirements</span>
              </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                Select the features you need for your web application
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                  {['Core', 'E-commerce', 'Content', 'Communication', 'Analytics', 'Advanced'].map(category => {
                    const categoryFeatures = featureOptions.filter(f => f.category === category)
                    return (
                      <div key={category}>
                        <h3 className="font-semibold mb-3 text-lg text-gray-900 dark:text-white">{category} Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {categoryFeatures.map(feature => (
                            <div
                              key={feature.id}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md bg-white dark:bg-gray-800 ${
                                formData.features.includes(feature.id)
                                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                              }`}
                              onClick={() => handleFeatureToggle(feature.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mt-1">
                                  {feature.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">{feature.name}</h4>
                                    <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                      {feature.estimatedCost}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                                </div>
                              </div>
                  </div>
                ))}
                        </div>
                      </div>
                    )
                  })}
                  
                  {formErrors.features && (
                    <p className="text-sm text-red-500">{formErrors.features}</p>
                  )}
              </div>
            </CardContent>
          </Card>
          )}

          {/* Step 3: Timeline & Budget */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Timeline & Budget</span>
              </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                Help us understand your timeline and budget constraints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                      <Label htmlFor="timeline" className="text-gray-700 dark:text-gray-300">Preferred Timeline</Label>
                      <Select 
                        value={formData.timeline} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
                      >
                        <SelectTrigger className={formErrors.timeline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {timelineOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                              </div>
                            </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                      {formErrors.timeline && (
                        <p className="text-sm text-red-500">{formErrors.timeline}</p>
                      )}
                </div>
                <div className="space-y-2">
                      <Label htmlFor="budget" className="text-gray-700 dark:text-gray-300">Budget Range</Label>
                      <Select 
                        value={formData.budget} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                      >
                        <SelectTrigger className={formErrors.budget ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.budget && (
                        <p className="text-sm text-red-500">{formErrors.budget}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">Project Priority</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                            </div>
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Calculator */}
              {formData.features.length > 0 && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                      <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span>Estimated Budget Breakdown</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Based on your selected features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getSelectedFeatures().map(feature => (
                        <div key={feature.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                              {feature.icon}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{feature.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</div>
                            </div>
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">{feature.estimatedCost}</div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-4 border-t-2 border-blue-200 dark:border-blue-700">
                        <div className="font-bold text-lg text-gray-900 dark:text-white">Estimated Total</div>
                        <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                          ${getEstimatedTotal().toLocaleString()}
                        </div>
                </div>
              </div>
            </CardContent>
          </Card>
              )}
            </div>
          )}

          {/* Step 4: Contact Information */}
          {currentStep === 4 && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Contact Information</span>
              </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                How can we reach you to discuss your project?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-gray-700 dark:text-gray-300">Email Address *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="your@email.com"
                      className={formErrors.contactEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                  />
                    {formErrors.contactEmail && (
                      <p className="text-sm text-red-500">{formErrors.contactEmail}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                      className="border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="additionalNotes" className="text-gray-700 dark:text-gray-300">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  placeholder="Any additional information, special requirements, or questions..."
                  rows={3}
                    className="border-gray-300 dark:border-gray-600"
                />
              </div>
            </CardContent>
          </Card>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Review Your Request</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Please review all information before submitting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Project Information */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Project Information</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Project Name:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.projectName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Business Type:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.businessType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Target Audience:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.targetAudience || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Selected Features */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Selected Features ({formData.features.length})</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {getSelectedFeatures().map(feature => (
                            <div key={feature.id} className="flex items-center space-x-2">
                              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                                {feature.icon}
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Timeline & Budget */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Timeline & Budget</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Timeline:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.timeline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Budget Range:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.priority || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Contact Information</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Email:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.contactEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.phoneNumber || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {formData.additionalNotes && (
                      <div>
                        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Additional Notes</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{formData.additionalNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-4">
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
                  className="flex items-center space-x-2 min-w-[200px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                      <Clock className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request
                      <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 