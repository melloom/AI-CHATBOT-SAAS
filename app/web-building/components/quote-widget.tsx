"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  CreditCard,
  Calculator,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Clock,
  Zap,
  X,
  GripVertical,
  Minimize2,
  Maximize2,
  MessageCircle,
  Star,
  TrendingUp,
  Shield,
  Globe,
  Smartphone,
  Palette,
  Database,
  Users,
  ShoppingCart,
  Building2,
  FileText,
  Heart,
  Target,
  AlertTriangle,
  Info,
  Sparkles,
  Award,
  Rocket
} from "lucide-react"

interface QuoteWidgetProps {
  onQuoteSubmit?: (data: any) => void
  onClose?: () => void
  isOpen?: boolean
}

export function QuoteWidget({ onQuoteSubmit, onClose, isOpen = true }: QuoteWidgetProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    websiteType: "",
    features: [] as string[],
    timeline: "",
    budget: "",
    description: "",
    pages: 5
  })
  
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [quoteGenerated, setQuoteGenerated] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  
  // Performance optimizations
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const widgetDimensionsRef = useRef({ width: 450, height: 700 })
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastMousePositionRef = useRef({ x: 0, y: 0 })

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.email.trim() !== '' && 
           formData.websiteType !== '' && 
           formData.timeline !== ''
  }

  const calculateQuote = () => {
    let basePrice = 0
    let featurePrice = 0
    let pagePrice = 0
    let complexityMultiplier = 1
    let urgencyMultiplier = 1
    let qualityMultiplier = 1
    
    // Base prices by website type (updated to match centralized pricing)
    switch (formData.websiteType) {
      case 'ecommerce':
        basePrice = 8000 // E-commerce sites with product catalog, cart, checkout
        complexityMultiplier = 1.4 // High complexity due to payment processing, inventory, etc.
        break
      case 'corporate':
        basePrice = 5000 // Professional business websites
        complexityMultiplier = 1.2 // Medium complexity
        break
      case 'portfolio':
        basePrice = 2500 // Personal/creative portfolios
        complexityMultiplier = 1.0 // Low complexity
        break
      case 'blog':
        basePrice = 3500 // Content management with blog functionality
        complexityMultiplier = 1.1 // Low-medium complexity
        break
      case 'landing':
        basePrice = 1500 // Single page marketing sites
        complexityMultiplier = 0.9 // Very low complexity
        break
      case 'saas':
        basePrice = 15000 // Complex web applications
        complexityMultiplier = 2.0 // Very high complexity
        break
      case 'restaurant':
        basePrice = 4000 // Menu, ordering, reservations
        complexityMultiplier = 1.3 // Medium-high complexity
        break
      case 'real_estate':
        basePrice = 4500 // Property listings, search, contact forms
        complexityMultiplier = 1.3 // Medium-high complexity
        break
      case 'healthcare':
        basePrice = 6000 // HIPAA compliance, patient portals
        complexityMultiplier = 1.6 // High complexity due to compliance
        break
      case 'education':
        basePrice = 5000 // Course management, student portals
        complexityMultiplier = 1.4 // High complexity
        break
      case 'nonprofit':
        basePrice = 3000 // Donation systems, volunteer management
        complexityMultiplier = 1.2 // Medium complexity
        break
      case 'personal':
        basePrice = 2000 // Simple personal websites
        complexityMultiplier = 0.9 // Very low complexity
        break
      default:
        basePrice = 2500
        complexityMultiplier = 1.0
    }
    
    // Dynamic page pricing based on complexity and type
    const basePages = 5
    const extraPages = Math.max(0, formData.pages - basePages)
    
    // Page pricing varies by complexity
    let pageCost = 200
    if (formData.websiteType === 'ecommerce') pageCost = 300 // More complex pages
    if (formData.websiteType === 'saas') pageCost = 500 // Very complex pages
    if (formData.websiteType === 'landing') pageCost = 100 // Simple pages
    if (formData.websiteType === 'personal') pageCost = 150 // Simple pages
    
    pagePrice = extraPages * pageCost
    
    // Feature pricing with intelligent combinations and dependencies
    const featureGroups = {
      essential: ['cms', 'seo', 'analytics', 'security'],
      ecommerce: ['payment_integration', 'booking_system', 'user_auth', 'advanced_search'],
      advanced: ['chatbot', 'live_chat', 'multilingual', 'api_integration'],
      premium: ['mobile_app', 'video_hosting', 'forum', 'performance']
    }
    
    // Track selected features for intelligent pricing
    const selectedFeatures = new Set(formData.features)
    let featureCount = 0
    let ecommerceFeatures = 0
    let advancedFeatures = 0
    
    formData.features.forEach(feature => {
      let featureCost = 0
      
      switch (feature) {
        case 'payment_integration':
          featureCost = 800
          ecommerceFeatures++
          break
        case 'cms':
          featureCost = 500
          break
        case 'seo':
          featureCost = 1500
          // SEO gets more expensive for larger sites
          if (formData.pages > 10) featureCost += 500
          break
        case 'analytics':
          featureCost = 200
          break
        case 'mobile_app':
          featureCost = 8000
          advancedFeatures++
          // Mobile app gets more expensive for complex sites
          if (formData.websiteType === 'saas') featureCost += 2000
          if (formData.websiteType === 'ecommerce') featureCost += 1500
          break
        case 'chatbot':
          featureCost = 200 // Monthly subscription
          advancedFeatures++
          break
        case 'multilingual':
          featureCost = 1000
          advancedFeatures++
          // More expensive for more languages (assume 3+ languages)
          if (formData.description?.toLowerCase().includes('multiple languages')) {
            featureCost += 500
          }
          break
        case 'booking_system':
          featureCost = 800
          ecommerceFeatures++
          break
        case 'user_auth':
          featureCost = 500
          ecommerceFeatures++
          break
        case 'api_integration':
          featureCost = 1000
          advancedFeatures++
          // More expensive for multiple APIs
          if (formData.description?.toLowerCase().includes('api') && 
              formData.description?.toLowerCase().includes('integration')) {
            featureCost += 300
          }
          break
        case 'live_chat':
          featureCost = 300
          advancedFeatures++
          break
        case 'video_hosting':
          featureCost = 600
          advancedFeatures++
          break
        case 'forum':
          featureCost = 800
          advancedFeatures++
          break
        case 'advanced_search':
          featureCost = 400
          ecommerceFeatures++
          break
        case 'performance':
          featureCost = 800
          // Performance optimization is more expensive for complex sites
          if (formData.websiteType === 'saas' || formData.websiteType === 'ecommerce') {
            featureCost += 200
          }
          break
        case 'security':
          featureCost = 600
          // Security is more expensive for healthcare and financial sites
          if (formData.websiteType === 'healthcare') featureCost += 400
          if (formData.websiteType === 'saas') featureCost += 300
          break
        case 'custom_design':
          featureCost = 1000
          break
        case 'maintenance':
          featureCost = 50 // Monthly
          break
      }
      
      featurePrice += featureCost
      featureCount++
    })
    
    // Intelligent feature discounts and multipliers
    if (featureCount >= 5) {
      // Bulk feature discount
      featurePrice *= 0.95 // 5% discount for 5+ features
    }
    
    if (ecommerceFeatures >= 3) {
      // E-commerce feature bundle discount
      featurePrice *= 0.90 // 10% discount for comprehensive e-commerce setup
    }
    
    if (advancedFeatures >= 3) {
      // Advanced feature complexity multiplier
      complexityMultiplier += 0.2
    }
    
    // Timeline adjustment with more nuanced pricing
    if (formData.timeline === 'urgent') {
      urgencyMultiplier = 1.3 // 30% rush fee
      // Additional complexity for rushed projects
      complexityMultiplier += 0.1
    } else if (formData.timeline === 'standard') {
      urgencyMultiplier = 1.0
    } else if (formData.timeline === 'flexible') {
      urgencyMultiplier = 0.9 // 10% discount for flexible timeline
      // Slight complexity reduction for flexible timeline
      complexityMultiplier *= 0.95
    }
    
    // Quality multiplier based on project description and requirements
    if (formData.description) {
      const description = formData.description.toLowerCase()
      
      // Premium quality indicators
      if (description.includes('premium') || description.includes('high-end') || 
          description.includes('luxury') || description.includes('enterprise')) {
        qualityMultiplier = 1.2
      }
      
      // Complex requirements
      if (description.includes('custom') || description.includes('unique') || 
          description.includes('complex') || description.includes('advanced')) {
        complexityMultiplier += 0.2
      }
      
      // Simple requirements
      if (description.includes('simple') || description.includes('basic') || 
          description.includes('minimal')) {
        complexityMultiplier *= 0.9
      }
    }
    
    // Calculate total with all multipliers
    const subtotal = (basePrice + featurePrice + pagePrice)
    const totalPrice = subtotal * complexityMultiplier * urgencyMultiplier * qualityMultiplier
    
    // Additional services and considerations
    let additionalServices = []
    
    if (formData.websiteType === 'ecommerce') {
      additionalServices.push('Payment Gateway Setup')
      additionalServices.push('SSL Certificate')
      additionalServices.push('Inventory Management')
    }
    
    if (formData.websiteType === 'healthcare') {
      additionalServices.push('HIPAA Compliance')
      additionalServices.push('Security Audit')
    }
    
    if (formData.websiteType === 'saas') {
      additionalServices.push('User Management System')
      additionalServices.push('Subscription Management')
      additionalServices.push('Advanced Security')
    }
    
    if (selectedFeatures.has('mobile_app')) {
      additionalServices.push('App Store Submission')
      additionalServices.push('Cross-platform Development')
    }
    
    if (selectedFeatures.has('multilingual')) {
      additionalServices.push('Translation Services')
      additionalServices.push('Localization Setup')
    }
    
    return {
      basePrice: Math.round(basePrice),
      featurePrice: Math.round(featurePrice),
      pagePrice: Math.round(pagePrice),
      totalPrice: Math.round(totalPrice),
      complexityMultiplier: Math.round(complexityMultiplier * 100) / 100,
      urgencyMultiplier: Math.round(urgencyMultiplier * 100) / 100,
      qualityMultiplier: Math.round(qualityMultiplier * 100) / 100,
      additionalServices,
      estimatedTimeline: calculateTimeline(),
      riskFactors: calculateRiskFactors()
    }
  }

  const calculateTimeline = () => {
    let baseWeeks = 4
    
    // Base timeline by website type
    switch (formData.websiteType) {
      case 'landing':
        baseWeeks = 2
        break
      case 'personal':
        baseWeeks = 3
        break
      case 'portfolio':
        baseWeeks = 3
        break
      case 'blog':
        baseWeeks = 4
        break
      case 'corporate':
        baseWeeks = 5
        break
      case 'restaurant':
        baseWeeks = 5
        break
      case 'real_estate':
        baseWeeks = 6
        break
      case 'nonprofit':
        baseWeeks = 5
        break
      case 'education':
        baseWeeks = 6
        break
      case 'ecommerce':
        baseWeeks = 8
        break
      case 'healthcare':
        baseWeeks = 8
        break
      case 'saas':
        baseWeeks = 12
        break
    }
    
    // Adjust for pages
    const pageAdjustment = Math.max(0, formData.pages - 5) * 0.5
    baseWeeks += pageAdjustment
    
    // Adjust for features
    const featureAdjustment = formData.features.length * 0.3
    baseWeeks += featureAdjustment
    
    // Adjust for timeline preference
    if (formData.timeline === 'urgent') {
      baseWeeks *= 0.7 // 30% faster
    } else if (formData.timeline === 'flexible') {
      baseWeeks *= 1.2 // 20% slower
    }
    
    return Math.round(baseWeeks)
  }

  const calculateRiskFactors = () => {
    const risks = []
    
    // Complexity risks
    if (formData.websiteType === 'saas') {
      risks.push('High complexity - requires extensive testing')
    }
    
    if (formData.websiteType === 'healthcare') {
      risks.push('Compliance requirements - additional review time')
    }
    
    if (formData.features.includes('mobile_app')) {
      risks.push('Mobile app development - longer timeline')
    }
    
    if (formData.features.includes('multilingual')) {
      risks.push('Translation dependencies - content delays possible')
    }
    
    if (formData.timeline === 'urgent') {
      risks.push('Rush timeline - potential for scope creep')
    }
    
    if (formData.pages > 10) {
      risks.push('Large site - content creation may delay launch')
    }
    
    if (formData.features.length > 5) {
      risks.push('Many features - integration complexity')
    }
    
    return risks
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const quote = calculateQuote()
    
    setQuoteGenerated(true)
    
    if (onQuoteSubmit) {
      onQuoteSubmit({
        ...formData,
        quote
      })
    }
  }

  // Optimized mouse move handler with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    if (animationFrameRef.current) {
      return
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const newX = e.clientX - dragOffsetRef.current.x
      const newY = e.clientY - dragOffsetRef.current.y
      
      const maxX = window.innerWidth - widgetDimensionsRef.current.width
      const maxY = window.innerHeight - widgetDimensionsRef.current.height
      
      const clampedX = Math.max(0, Math.min(newX, maxX))
      const clampedY = Math.max(0, Math.min(newY, maxY))
      
      if (Math.abs(clampedX - lastMousePositionRef.current.x) > 1 || 
          Math.abs(clampedY - lastMousePositionRef.current.y) > 1) {
        
        lastMousePositionRef.current = { x: clampedX, y: clampedY }
        setPosition({ x: clampedX, y: clampedY })
      }
      
      animationFrameRef.current = undefined
    })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = undefined
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const isDraggable = target.closest('[data-drag-handle]') || 
                       target.closest('.drag-handle') ||
                       target.classList.contains('drag-handle')
    
    if (isDraggable) {
      e.preventDefault()
      e.stopPropagation()
      
      if (widgetRef.current) {
        const rect = widgetRef.current.getBoundingClientRect()
        widgetDimensionsRef.current = {
          width: rect.width,
          height: rect.height
        }
        dragOffsetRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
      }
      
      setIsDragging(true)
      lastMousePositionRef.current = { x: position.x, y: position.y }
    }
  }, [position.x, position.y])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseup', handleMouseUp, { passive: true })
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const quote = calculateQuote()

  const handleResetQuote = () => {
    setQuoteGenerated(false)
    setCurrentStep(1)
    setFormData({
      name: "",
      email: "",
      company: "",
      websiteType: "",
      features: [],
      timeline: "",
      budget: "",
      description: "",
      pages: 5
    })
  }

  const websiteTypes = [
    { value: 'ecommerce', label: 'E-commerce Store', icon: ShoppingCart, price: 8000 },
    { value: 'corporate', label: 'Corporate Website', icon: Building2, price: 5000 },
    { value: 'portfolio', label: 'Portfolio/Personal', icon: Palette, price: 2500 },
    { value: 'blog', label: 'Blog/Content Site', icon: FileText, price: 3500 },
    { value: 'landing', label: 'Landing Page', icon: Target, price: 1500 },
    { value: 'saas', label: 'SaaS Application', icon: Database, price: 15000 },
    { value: 'restaurant', label: 'Restaurant/Food', icon: Heart, price: 4000 },
    { value: 'real_estate', label: 'Real Estate', icon: Building2, price: 4500 },
    { value: 'healthcare', label: 'Healthcare/Medical', icon: Shield, price: 6000 },
    { value: 'education', label: 'Education/Training', icon: Users, price: 5000 },
    { value: 'nonprofit', label: 'Non-profit', icon: Heart, price: 3000 },
    { value: 'personal', label: 'Personal Website', icon: Globe, price: 2000 }
  ]

  const featureCategories = [
    {
      title: "Essential Features",
      icon: Star,
      features: [
        { id: 'cms', label: 'Content Management System', price: 500, description: 'Easy content updates' },
        { id: 'seo', label: 'Advanced SEO Optimization', price: 1500, description: 'Search engine optimization' },
        { id: 'analytics', label: 'Analytics Integration', price: 200, description: 'Google Analytics setup' },
        { id: 'security', label: 'Security Features', price: 600, description: 'SSL, backups, protection' }
      ]
    },
    {
      title: "E-commerce & Business",
      icon: ShoppingCart,
      features: [
        { id: 'payment_integration', label: 'Payment Integration', price: 800, description: 'Stripe, PayPal, etc.' },
        { id: 'booking_system', label: 'Booking System', price: 800, description: 'Appointment scheduling' },
        { id: 'user_auth', label: 'User Authentication', price: 500, description: 'User accounts & login' },
        { id: 'advanced_search', label: 'Advanced Search', price: 400, description: 'Smart search functionality' }
      ]
    },
    {
      title: "Advanced Features",
      icon: Zap,
      features: [
        { id: 'chatbot', label: 'AI ChatHub Integration', price: 200, description: 'Monthly subscription' },
        { id: 'live_chat', label: 'Live Chat Widget', price: 300, description: 'Real-time customer support' },
        { id: 'multilingual', label: 'Multi-language Support', price: 1000, description: 'Multiple languages' },
        { id: 'api_integration', label: 'API Integration', price: 1000, description: 'Third-party services' }
      ]
    },
    {
      title: "Premium Features",
      icon: Sparkles,
      features: [
        { id: 'mobile_app', label: 'Mobile App Development', price: 8000, description: 'Native iOS & Android' },
        { id: 'video_hosting', label: 'Video Hosting', price: 600, description: 'Video streaming platform' },
        { id: 'forum', label: 'Community Forum', price: 800, description: 'User community platform' },
        { id: 'performance', label: 'Performance Optimization', price: 800, description: 'Speed optimization' }
      ]
    }
  ]

  if (!isOpen) return null

  return (
    <div
      ref={widgetRef}
      className={`fixed z-50 ${isDragging ? 'cursor-grabbing select-none' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? '350px' : '450px',
        transition: isDragging ? 'none' : 'all 0.3s ease'
      }}
    >
      <Card className={`shadow-2xl border-2 border-blue-200 dark:border-blue-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm ${isMinimized ? 'h-20' : 'h-auto'}`}>
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-t-lg cursor-grab drag-handle hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-colors"
          data-drag-handle
          onMouseDown={handleMouseDown}
          title="Drag to move widget"
        >
          <div className="flex items-center space-x-2">
            <GripVertical className="w-4 h-4" />
            <Calculator className="w-5 h-5" />
            <span className="font-semibold">Smart Quote Calculator</span>
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {!isMinimized ? (
          <CardContent className="p-6 space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Step {currentStep} of 3</span>
                <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
              </div>
              <Progress value={(currentStep / 3) * 100} className="h-2" />
            </div>

            {!quoteGenerated ? (
              // Form view
              <>
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tell us about your project</p>
                    </div>
                    
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="h-8 text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="h-8 text-sm"
                    placeholder="Your email"
                  />
                </div>
              </div>

              <div>
                      <Label htmlFor="company" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="h-8 text-sm"
                        placeholder="Your company"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Project Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="text-sm"
                        placeholder="Briefly describe your project goals..."
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={() => setCurrentStep(2)}
                      disabled={!formData.name || !formData.email}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Website Type & Scope</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Select your website type and features</p>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Website Type *</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {websiteTypes.map((type) => (
                          <div
                            key={type.value}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              formData.websiteType === type.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setFormData({...formData, websiteType: type.value})}
                          >
                            <div className="flex items-center space-x-2">
                              <type.icon className="w-4 h-4 text-blue-600" />
                              <div className="flex-1">
                                <div className="text-xs font-medium text-gray-900 dark:text-white">{type.label}</div>
                                <div className="text-xs text-gray-500">From ${type.price.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Number of Pages</Label>
                      <Select value={formData.pages.toString()} onValueChange={(value) => setFormData({...formData, pages: parseInt(value)})}>
                  <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                          <SelectItem value="1">1 page</SelectItem>
                          <SelectItem value="3">3 pages</SelectItem>
                          <SelectItem value="5">5 pages (Standard)</SelectItem>
                          <SelectItem value="8">8 pages</SelectItem>
                          <SelectItem value="10">10 pages</SelectItem>
                          <SelectItem value="15">15+ pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(3)}
                        disabled={!formData.websiteType}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                        </div>
                        </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Features & Timeline</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Customize your project</p>
                        </div>

                    <div>
                      <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Additional Features</Label>
                      <div className="max-h-60 overflow-y-auto space-y-3">
                        {featureCategories.map((category, categoryIndex) => (
                          <div key={categoryIndex} className="space-y-2">
                            <div className="flex items-center space-x-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                              <category.icon className="w-3 h-3" />
                              <span>{category.title}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {category.features.map((feature) => (
                                <div key={feature.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Checkbox
                        id={feature.id}
                        checked={formData.features.includes(feature.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              features: [...formData.features, feature.id]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              features: formData.features.filter(f => f !== feature.id)
                            })
                          }
                        }}
                                    className="h-4 w-4"
                      />
                          <Label htmlFor={feature.id} className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                                    <div className="flex justify-between items-center">
                                      <span>{feature.label}</span>
                                      <span className="text-green-600 font-medium">+${feature.price}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">{feature.description}</div>
                      </Label>
                    </div>
                  ))}
                </div>
                      </div>
                        ))}
                      </div>
              </div>

              <div>
                <Label htmlFor="timeline" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => setFormData({...formData, timeline: value})}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible (10% discount)</SelectItem>
                          <SelectItem value="standard">Standard (4-6 weeks)</SelectItem>
                    <SelectItem value="urgent">Urgent (30% premium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                    <div className="flex space-x-2">
                  <Button 
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                    disabled={!isFormValid()}
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      >
                        <Calculator className="w-4 h-4 mr-2" />
                        Generate Quote
              </Button>
                    </div>
                  </div>
                )}

                {/* Live Quote Preview */}
                {isFormValid() && (
            <div className="border-t pt-4">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Live Estimate</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${quote.totalPrice.toLocaleString()}
                        </Badge>
              </div>
              
                      <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Base Price:</span>
                    <span className="font-medium">${quote.basePrice.toLocaleString()}</span>
                  </div>
                        {quote.pagePrice > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Additional Pages:</span>
                            <span className="font-medium">+${quote.pagePrice.toLocaleString()}</span>
                          </div>
                        )}
                  {quote.featurePrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Features:</span>
                      <span className="font-medium">+${quote.featurePrice.toLocaleString()}</span>
                    </div>
                  )}
                        {quote.urgencyMultiplier !== 1 && (
                    <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              {quote.urgencyMultiplier > 1 ? 'Urgent Premium:' : 'Flexible Discount:'}
                            </span>
                            <span className={`font-medium ${quote.urgencyMultiplier > 1 ? 'text-red-600' : 'text-green-600'}`}>
                              {quote.urgencyMultiplier > 1 ? '+' : '-'}{Math.abs((quote.urgencyMultiplier - 1) * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                    <span>Timeline: {quote.estimatedTimeline} weeks</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Quote generated view
              <div className="space-y-4">
                {/* Success message */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Quote generated successfully!
                    </span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Your Detailed Quote</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <DollarSign className="w-3 h-3 mr-1" />
                      ${quote.totalPrice.toLocaleString()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Base Price:</span>
                      <span className="font-medium">${quote.basePrice.toLocaleString()}</span>
                    </div>
                    {quote.pagePrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Additional Pages:</span>
                        <span className="font-medium">+${quote.pagePrice.toLocaleString()}</span>
                      </div>
                    )}
                    {quote.featurePrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Features:</span>
                        <span className="font-medium">+${quote.featurePrice.toLocaleString()}</span>
                      </div>
                    )}
                    {quote.urgencyMultiplier !== 1 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          {quote.urgencyMultiplier > 1 ? 'Urgent Premium:' : 'Flexible Discount:'}
                        </span>
                        <span className={`font-medium ${quote.urgencyMultiplier > 1 ? 'text-red-600' : 'text-green-600'}`}>
                          {quote.urgencyMultiplier > 1 ? '+' : '-'}{Math.abs((quote.urgencyMultiplier - 1) * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900 dark:text-white">Total:</span>
                        <span className="text-green-600 dark:text-green-400">${quote.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Timeline: {quote.estimatedTimeline} weeks</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => {
                      if (onQuoteSubmit) {
                        onQuoteSubmit({
                          ...formData,
                          quote,
                          action: 'get_detailed_quote'
                        })
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Get Detailed Proposal
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (onQuoteSubmit) {
                        onQuoteSubmit({
                          ...formData,
                          quote,
                          action: 'book_consultation'
                        })
                      }
                    }}
                    className="w-full text-sm border-gray-300 dark:border-gray-600"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Book Free Consultation
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    onClick={handleResetQuote}
                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Create New Quote
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        ) : (
          // Minimized state
          <CardContent className="p-4">
            {isFormValid() ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                      ${quote.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs h-8"
                  >
                    <CreditCard className="w-3 h-3 mr-1" />
                    Get Quote
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (onQuoteSubmit) {
                        onQuoteSubmit({
                          ...formData,
                          quote,
                          action: 'book_consultation'
                        })
                      }
                    }}
                    className="w-full text-xs h-8 border-gray-300 dark:border-gray-600"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Book Consultation
                  </Button>
                </div>
                
                {formData.websiteType && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    {websiteTypes.find(t => t.value === formData.websiteType)?.label} • {formData.features.length} features
                </div>
              )}
              </>
            ) : (
              <div className="text-center py-4">
                <Calculator className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fill in the form to see your quote
                </p>
            </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
} 