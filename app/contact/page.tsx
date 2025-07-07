"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Globe, Shield, Zap, Users, Building2, CheckCircle, AlertCircle, ArrowLeft, ShoppingCart, Headphones, TrendingUp, Calendar, FileText, Briefcase, CreditCard, Database, Bot } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"
import { budgetRanges } from "@/lib/pricing-config"

// Client component for contact page with form functionality

export default function ContactPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    websiteType: '',
    designStyle: '',
    features: [] as string[],
    budget: '',
    timeline: '',
    techStack: '',
    subject: '',
    message: '',
    service: 'general',
    experience: '',
    skills: '',
    collaborationType: '',
    integration: '',
    integrationType: '',
    integrationDescription: '',
    aiType: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null)
  const [personalAISelection, setPersonalAISelection] = useState<any>(null)
  const [isDemoRequest, setIsDemoRequest] = useState(false)

  // Handle URL parameters for pre-filling form
  useEffect(() => {
    const subject = searchParams.get('subject')
    const integration = searchParams.get('integration')
    
    if (subject === 'career-opportunity') {
      setFormData(prev => ({
        ...prev,
        subject: 'Collaboration Opportunity',
        service: 'consulting'
      }))
    }
    
    // Check for integration request from integrations page
    if (integration === 'true') {
      const storedIntegration = localStorage.getItem('selectedIntegration')
      const integrationType = localStorage.getItem('integrationType')
      
      console.log('Integration parameter found:', integration)
      console.log('Stored integration from localStorage:', storedIntegration)
      console.log('Integration type from localStorage:', integrationType)
      
      if (storedIntegration) {
        const integrationData = JSON.parse(storedIntegration)
        console.log('Parsed integration data:', integrationData)
        
        // Map icon name back to component
        const iconMap: { [key: string]: any } = {
          'MessageCircle': MessageCircle,
          'Users': Users,
          'Phone': Phone,
          'ShoppingCart': ShoppingCart,
          'Headphones': Headphones,
          'Building2': Building2,
          'TrendingUp': TrendingUp,
          'Calendar': Calendar,
          'FileText': FileText,
          'Mail': Mail,
          'Briefcase': Briefcase,
          'CreditCard': CreditCard,
          'Database': Database
        }
        
        const integrationWithIcon = {
          ...integrationData,
          icon: iconMap[integrationData.iconName] || MessageCircle
        }
        
        console.log('Integration with icon:', integrationWithIcon)
        
        setSelectedIntegration(integrationWithIcon)
        setFormData(prev => ({
          ...prev,
          integration: integrationData.name,
          integrationType: integrationType || '',
          integrationDescription: integrationData.description,
          service: 'chatbot-integration',
          subject: `Integration Request: ${integrationData.name}`
        }))
        
        console.log('Form data updated with integration')
        
        // Clear the stored integration data
        localStorage.removeItem('selectedIntegration')
        localStorage.removeItem('integrationType')
        localStorage.removeItem('integrationRequest')
      } else {
        console.log('No stored integration found in localStorage')
      }
    } else {
      console.log('No integration parameter found in URL')
    }

    // Check for business services requests
    const service = searchParams.get('service')
    const price = searchParams.get('price')
    const type = searchParams.get('type')
    const source = searchParams.get('source')
    
    if (source === 'business-services' && service) {
      setFormData(prev => ({
        ...prev,
        service: 'business-services',
        subject: `Business Service Request: ${service}`,
        message: `I'm interested in the following business service:

Service: ${service}
Price: ${price || 'Contact for pricing'}

I would like to discuss this service in detail and understand how it can benefit my business. Please contact me to discuss the next steps, implementation details, and any additional requirements.

Please provide more information about the process, timeline, and what I can expect.`
      }))
    } else if (source === 'custom-development' && service) {
      setFormData(prev => ({
        ...prev,
        service: 'web-development',
        subject: `Custom Development Request: ${service}`,
        message: `I'm interested in the following custom development service:

Service: ${service}
Price: ${price || 'Contact for pricing'}

I would like to discuss this project in detail and understand the development process. Please contact me to discuss the requirements, timeline, and next steps.

Please provide more information about the development process, technologies that will be used, and what I can expect.`
      }))
    } else if (service === 'personal-ai-assistant') {
      const storedPlan = localStorage.getItem('selectedPersonalAIPlan')
      const storedAddons = localStorage.getItem('personalAIAddons')
      const contactData = localStorage.getItem('personalAIContactData')
      
      console.log('Personal AI Assistant service detected')
      console.log('Stored plan:', storedPlan)
      console.log('Stored addons:', storedAddons)
      console.log('Contact data:', contactData)
      
      if (contactData) {
        const selectionData = JSON.parse(contactData)
        setPersonalAISelection(selectionData)
        
        // Pre-fill form with selection data
        setFormData(prev => ({
          ...prev,
          service: 'personal-ai-assistant',
          subject: `Personal AI Assistant Request - ${selectionData.selectedPlan?.name || 'Custom Plan'}`,
          message: `I'm interested in setting up a Personal AI Assistant with the following configuration:

Selected Plan: ${selectionData.selectedPlan?.name || 'Not selected'}
Plan Price: ${selectionData.selectedPlan?.price || 'N/A'}

Selected Addons (${selectionData.totalAddons}):
${selectionData.selectedAddons?.map((addon: any) => `- ${addon.name}: ${addon.price}`).join('\n') || 'None selected'}

Total Monthly Cost: $${selectionData.totalAddonCost + (selectionData.selectedPlan ? parseFloat(selectionData.selectedPlan.price.replace(/[^0-9.]/g, '')) : 0)}

Please contact me to discuss implementation details and get started.`
        }))
        
        console.log('Form data updated with personal AI selection')
      } else {
        console.log('No personal AI selection data found')
      }
    } else if (service === 'demo') {
      setIsDemoRequest(true)
      setFormData(prev => ({
        ...prev,
        service: 'demo',
        subject: 'Demo Request - Personal AI Assistant',
        message: 'I would like to schedule a demo to see how the Personal AI Assistant works and discuss my specific needs.'
      }))
    }
  }, [searchParams])

  // Check if this is a career inquiry
  const isCareerInquiry = searchParams.get('subject') === 'career-opportunity'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        websiteType: '',
        designStyle: '',
        features: [],
        budget: '',
        timeline: '',
        techStack: '',
        subject: '',
        message: '',
        service: 'general',
        experience: '',
        skills: '',
        collaborationType: '',
        integration: '',
        integrationType: '',
        integrationDescription: '',
        aiType: ''
      })
      setSelectedIntegration(null)
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }, 2000)
  }

  const services = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'chatbot-integration', label: 'Chatbot Integration' },
    { value: 'personal-ai-assistant', label: 'Personal AI Assistant' },
    { value: 'business-services', label: 'Business & Legal Services' },
    { value: 'demo', label: 'Demo Request' },
    { value: 'hosting', label: 'Hosting Services' },
    { value: 'maintenance', label: 'Website Maintenance' },
    { value: 'consulting', label: 'Consulting' }
  ]

  const websiteTypes = [
    { value: 'business-website', label: 'Business Website' },
    { value: 'ecommerce-store', label: 'E-commerce Store' },
    { value: 'portfolio-site', label: 'Portfolio Site' },
    { value: 'blog-news', label: 'Blog/News Site' },
    { value: 'landing-page', label: 'Landing Page' },
    { value: 'saas-application', label: 'SaaS Application' },
    { value: 'restaurant-food', label: 'Restaurant/Food' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'healthcare-medical', label: 'Healthcare/Medical' },
    { value: 'educational', label: 'Educational' },
    { value: 'non-profit', label: 'Non-Profit' },
    { value: 'other', label: 'Other' }
  ]

  const designStyles = [
    { value: 'modern-minimalist', label: 'Modern & Minimalist' },
    { value: 'classic-professional', label: 'Classic & Professional' },
    { value: 'bold-creative', label: 'Bold & Creative' },
    { value: 'warm-friendly', label: 'Warm & Friendly' },
    { value: 'luxury-premium', label: 'Luxury & Premium' },
    { value: 'playful-fun', label: 'Playful & Fun' },
    { value: 'tech-futuristic', label: 'Tech & Futuristic' },
    { value: 'not-sure', label: 'Not sure - need guidance' }
  ]

  const techStacks = [
    { value: 'wordpress', label: 'WordPress - Easy to update content yourself' },
    { value: 'react-nextjs', label: 'Custom built - Modern and super fast' },
    { value: 'shopify', label: 'Shopify - Perfect for online stores' },
    { value: 'webflow', label: 'Webflow - Great for beautiful designs' },
    { value: 'php-laravel', label: 'Custom built - Full control over everything' },
    { value: 'not-sure', label: 'Not sure - help me choose the best option' }
  ]

  const aiTypes = [
    { value: 'personal-assistant', label: 'Personal AI Assistant' },
    { value: 'customer-support', label: 'Customer Support Bot' },
    { value: 'sales-assistant', label: 'Sales & Lead Generation' },
    { value: 'content-creation', label: 'Content Creation AI' },
    { value: 'data-analysis', label: 'Data Analysis & Research' },
    { value: 'automation', label: 'Task Automation' },
    { value: 'custom', label: 'Custom AI Solution' },
    { value: 'not-sure', label: 'Not sure - need guidance' }
  ]

  const features = [
    {
      icon: Globe,
      title: "Global Support",
      description: "24/7 support across all time zones"
    },
    {
      icon: Shield,
      title: "Secure Communication",
      description: "Enterprise-grade security for all communications"
    },
    {
      icon: Zap,
      title: "Fast Response",
      description: "Average response time under 2 hours"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Certified professionals ready to help"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/5 to-purple-100/10 dark:from-background dark:via-purple-900/20 dark:to-purple-800/10">
      {/* Logo Header */}
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
            
            {/* Back Button */}
            <EnhancedBackButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              {isCareerInquiry ? 'Collaboration Opportunities' : isDemoRequest ? 'Demo Request' : 'Get In Touch'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {isCareerInquiry ? 'Let\'s Collaborate!' : isDemoRequest ? 'Schedule Your AI Demo' : "Let's Build Something Amazing Together"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {isCareerInquiry 
                ? "I'm a solo developer open to exciting collaboration opportunities. Whether you want to join my projects or have me join yours, let's discuss how we can work together to create amazing things."
                : isDemoRequest
                ? "Experience the power of AI firsthand with a personalized demo. See how our AI solutions can transform your workflow and boost productivity."
                : "Ready to transform your business with cutting-edge web development and AI chatbot solutions? Our expert team is here to turn your vision into reality."
              }
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/30 dark:from-card dark:to-purple-900/10">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {isCareerInquiry ? 'Let\'s Discuss Collaboration' : isDemoRequest ? 'Request Your Demo' : 'Start Your Project'}
                  </CardTitle>
                  <CardDescription>
                    {isCareerInquiry 
                      ? "Share your background and what you're looking for, and I'll get back to you within 24 hours to discuss potential collaboration opportunities."
                      : isDemoRequest
                      ? "Tell us about your needs and we'll schedule a personalized demo to show you how AI can transform your workflow."
                      : "Tell us about your project and we'll get back to you within 24 hours with a detailed proposal."
                    }
                  </CardDescription>
                  
                  {/* Integration Display */}
                  {selectedIntegration && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${selectedIntegration.gradient} rounded-lg flex items-center justify-center text-white`}>
                          <selectedIntegration.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                            Integration Request: {selectedIntegration.name}
                          </h3>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            {selectedIntegration.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {selectedIntegration.category}
                            </Badge>
                            <Badge className="bg-green-500 text-white text-xs">
                              {selectedIntegration.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 dark:text-green-200">Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-800 dark:text-red-200">Something went wrong. Please try again or contact us directly.</span>
                    </div>
                  )}

                  {/* Personal AI Selection Display */}
                  {personalAISelection && (
                    <Card className="mb-6 border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <Bot className="w-5 h-5 text-purple-600" />
                          <CardTitle className="text-lg">Personal AI Assistant Selection</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {personalAISelection.selectedPlan && (
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-foreground">Selected Plan</h4>
                              <Badge className="bg-purple-600 text-white">{personalAISelection.selectedPlan.price}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{personalAISelection.selectedPlan.name}</p>
                            <p className="text-xs text-muted-foreground">{personalAISelection.selectedPlan.description}</p>
                          </div>
                        )}
                        
                        {personalAISelection.selectedAddons && personalAISelection.selectedAddons.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-foreground">Selected Addons ({personalAISelection.totalAddons})</h4>
                            <div className="grid gap-2 md:grid-cols-2">
                              {personalAISelection.selectedAddons.map((addon: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{addon.name}</p>
                                    <p className="text-xs text-muted-foreground">{addon.description}</p>
                                  </div>
                                  <Badge variant="secondary" className="text-xs">{addon.price}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="border-t pt-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">Total Monthly Cost:</span>
                            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                              ${personalAISelection.totalAddonCost + (personalAISelection.selectedPlan ? parseFloat(personalAISelection.selectedPlan.price.replace(/[^0-9.]/g, '')) : 0)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {isCareerInquiry ? (
                      // Collaboration Form
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input 
                              id="firstName" 
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="John" 
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input 
                              id="lastName" 
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Doe" 
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input 
                              id="email" 
                              name="email"
                              type="email" 
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com" 
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Current Role/Company</Label>
                            <Input 
                              id="company" 
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              placeholder="Your current role or company" 
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="experience">Years of Experience</Label>
                            <select 
                              id="experience" 
                              name="experience"
                              value={formData.experience || ''}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select experience level</option>
                              <option value="0-1 years">0-1 years (Junior)</option>
                              <option value="2-3 years">2-3 years (Mid-level)</option>
                              <option value="4-6 years">4-6 years (Senior)</option>
                              <option value="7+ years">7+ years (Expert)</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="skills">Primary Skills</Label>
                            <select 
                              id="skills" 
                              name="skills"
                              value={formData.skills || ''}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select your main skills</option>
                              <option value="Frontend Development">Frontend Development (React, Vue, Angular)</option>
                              <option value="Backend Development">Backend Development (Node.js, Python, PHP)</option>
                              <option value="Full Stack Development">Full Stack Development</option>
                              <option value="UI/UX Design">UI/UX Design</option>
                              <option value="DevOps">DevOps & Infrastructure</option>
                              <option value="Mobile Development">Mobile Development</option>
                              <option value="AI/ML">AI/ML Development</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="collaborationType">What type of collaboration are you looking for?</Label>
                          <select 
                            id="collaborationType" 
                            name="collaborationType"
                            value={formData.collaborationType || ''}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                          >
                            <option value="">Select collaboration type</option>
                            <option value="Join your projects">Join your projects</option>
                            <option value="You join my projects">You join my projects</option>
                            <option value="Partnership">Partnership on new projects</option>
                            <option value="Freelance work">Freelance work</option>
                            <option value="Mentorship">Mentorship/Knowledge sharing</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="subject">Subject *</Label>
                          <Input 
                            id="subject" 
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Brief description of your interest" 
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="message">Tell me about yourself and what you're looking for *</Label>
                          <Textarea 
                            id="message" 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Share your background, experience, what you're passionate about, and how you'd like to collaborate. What projects interest you? What skills do you bring to the table?"
                            rows={6}
                            required
                          />
                        </div>
                      </>
                    ) : isDemoRequest ? (
                      // Demo Request Form
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input 
                              id="firstName" 
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="John" 
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input 
                              id="lastName" 
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Doe" 
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input 
                              id="email" 
                              name="email"
                              type="email" 
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com" 
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Company</Label>
                            <Input 
                              id="company" 
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              placeholder="Your Company" 
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="aiType">What type of AI are you interested in? *</Label>
                          <select 
                            id="aiType" 
                            name="aiType"
                            value={formData.aiType || ''}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            required
                          >
                            <option value="">Select AI type</option>
                            {aiTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="subject">Subject *</Label>
                          <Input 
                            id="subject" 
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Demo Request" 
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="message">Tell us about your needs and what you'd like to see in the demo *</Label>
                          <Textarea 
                            id="message" 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Describe your current challenges, what you're looking to achieve with AI, and any specific features or capabilities you'd like to see demonstrated."
                            rows={6}
                            required
                          />
                        </div>
                      </>
                    ) : (
                      // Regular Project Form
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input 
                              id="firstName" 
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="John" 
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input 
                              id="lastName" 
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Doe" 
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input 
                              id="email" 
                              name="email"
                              type="email" 
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com" 
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Company</Label>
                            <Input 
                              id="company" 
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              placeholder="Your Company" 
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="service">Service Type *</Label>
                            <select 
                              id="service" 
                              name="service"
                              value={formData.service}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                              required
                            >
                              {services.map(service => (
                                <option key={service.value} value={service.value}>
                                  {service.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="websiteType">Website Type</Label>
                            <select 
                              id="websiteType" 
                              name="websiteType"
                              value={formData.websiteType}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select website type</option>
                              {websiteTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="designStyle">Design Style Preference</Label>
                            <select 
                              id="designStyle" 
                              name="designStyle"
                              value={formData.designStyle}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select design style</option>
                              {designStyles.map(style => (
                                <option key={style.value} value={style.value}>
                                  {style.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="techStack">Website Platform Preference</Label>
                            <select 
                              id="techStack" 
                              name="techStack"
                              value={formData.techStack}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">How would you like to manage your website?</option>
                              {techStacks.map(tech => (
                                <option key={tech.value} value={tech.value}>
                                  {tech.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label>Key Features Needed</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            {[
                              'Contact Forms', 'Blog/News', 'E-commerce', 'User Accounts',
                              'Payment Processing', 'Booking System', 'Gallery/Portfolio', 'Testimonials',
                              'Newsletter Signup', 'Social Media Integration', 'Search Function', 'Multi-language',
                              'Admin Dashboard', 'Analytics', 'Chat Support', 'Mobile App'
                            ].map(feature => (
                              <label key={feature} className="flex items-center space-x-2 text-sm text-foreground">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                                  onChange={(e) => {
                                    const newFeatures = e.target.checked 
                                      ? [...formData.features, feature]
                                      : formData.features.filter(f => f !== feature)
                                    setFormData(prev => ({ ...prev, features: newFeatures }))
                                  }}
                                  checked={formData.features.includes(feature)}
                                />
                                <span>{feature}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <Label htmlFor="budget">Budget Range</Label>
                            <select 
                              id="budget" 
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select budget</option>
                              {budgetRanges.map((range, index) => (
                                <option key={index} value={range}>{range}</option>
                              ))}
                              <option value="Need to discuss">Need to discuss</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="timeline">Timeline</Label>
                            <select 
                              id="timeline" 
                              name="timeline"
                              value={formData.timeline}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select timeline</option>
                              <option value="ASAP (1-2 weeks)">ASAP (1-2 weeks)</option>
                              <option value="1-2 months">1-2 months</option>
                              <option value="2-3 months">2-3 months</option>
                              <option value="3-6 months">3-6 months</option>
                              <option value="No rush">No rush</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="subject">Subject *</Label>
                            <Input 
                              id="subject" 
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              placeholder="How can we help?" 
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="message">Project Details *</Label>
                          <Textarea 
                            id="message" 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell us more about your project, goals, target audience, competitors, or any specific requirements..."
                            rows={6}
                            required
                          />
                        </div>
                      </>
                                         )}

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <select 
                          id="budget" 
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                        >
                          <option value="">Select budget</option>
                          {budgetRanges.map((range, index) => (
                            <option key={index} value={range}>{range}</option>
                          ))}
                          <option value="Need to discuss">Need to discuss</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="timeline">Timeline</Label>
                        <select 
                          id="timeline" 
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                        >
                          <option value="">Select timeline</option>
                          <option value="ASAP (1-2 weeks)">ASAP (1-2 weeks)</option>
                          <option value="1-2 months">1-2 months</option>
                          <option value="2-3 months">2-3 months</option>
                          <option value="3-6 months">3-6 months</option>
                          <option value="No rush">No rush</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input 
                          id="subject" 
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="How can we help?" 
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Project Details *</Label>
                      <Textarea 
                        id="message" 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your project, goals, target audience, competitors, or any specific requirements..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/20 dark:from-card dark:to-purple-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <span>Get in touch</span>
                  </CardTitle>
                  <CardDescription>
                    We'd love to hear from you. Here's how you can reach us.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-muted-foreground">melvin.a.p.cruz@gmail.com</p>
                      <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <p className="text-muted-foreground">+1 (667) 200-9784</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Location</h3>
                      <p className="text-muted-foreground">Maryland, USA</p>
                      <p className="text-sm text-muted-foreground">Remote work available</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Business Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday: 9AM - 6PM EST</p>
                      <p className="text-sm text-muted-foreground">Weekend support for Enterprise</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/20 dark:from-card dark:to-purple-900/10">
                <CardHeader>
                  <CardTitle>Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/20 dark:from-card dark:to-purple-900/10">
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-foreground">ChatHub Platform</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">Explore our AI chatbot solutions</p>
                  </Link>
                  
                  <Link href="/web-building" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-foreground">Web Development</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">Professional website services</p>
                  </Link>
                  
                  <Link href="/dashboard" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-foreground">Dashboard</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">Access your account</p>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
} 