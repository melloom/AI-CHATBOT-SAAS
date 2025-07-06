"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
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
  MessageCircle
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
    websiteType: "",
    features: [] as string[],
    timeline: ""
  })
  
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [quoteGenerated, setQuoteGenerated] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  
  // Performance optimizations
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const widgetDimensionsRef = useRef({ width: 400, height: 600 })
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
    
    // Base prices by website type (more realistic pricing)
    switch (formData.websiteType) {
      case 'ecommerce':
        basePrice = 2500 // E-commerce sites with product catalog, cart, checkout
        break
      case 'corporate':
        basePrice = 1800 // Professional business websites
        break
      case 'portfolio':
        basePrice = 1200 // Personal/creative portfolios
        break
      case 'blog':
        basePrice = 900 // Content management with blog functionality
        break
      case 'landing':
        basePrice = 600 // Single page marketing sites
        break
      case 'saas':
        basePrice = 3500 // Complex web applications
        break
      case 'restaurant':
        basePrice = 1400 // Menu, ordering, reservations
        break
      case 'real_estate':
        basePrice = 1600 // Property listings, search, contact forms
        break
      case 'healthcare':
        basePrice = 2000 // HIPAA compliance, patient portals
        break
      case 'education':
        basePrice = 1500 // Course management, student portals
        break
      case 'nonprofit':
        basePrice = 1200 // Donation systems, volunteer management
        break
      case 'personal':
        basePrice = 800 // Simple personal websites
        break
      default:
        basePrice = 1500
    }
    
    // Feature pricing (more realistic)
    formData.features.forEach(feature => {
      switch (feature) {
        case 'payment_integration':
          featurePrice += 600 // Stripe/PayPal integration
          break
        case 'cms':
          featurePrice += 400 // Content management system
          break
        case 'seo':
          featurePrice += 250 // SEO optimization
          break
        case 'analytics':
          featurePrice += 150 // Google Analytics setup
          break
        case 'mobile_app':
          featurePrice += 1500 // Native mobile app development
          break
        case 'chatbot':
          featurePrice += 400 // AI ChatHub integration
          break
        case 'multilingual':
          featurePrice += 300 // Multi-language support
          break
        case 'booking_system':
          featurePrice += 500 // Appointment booking system
          break
        case 'user_auth':
          featurePrice += 300 // User registration/login
          break
        case 'api_integration':
          featurePrice += 450 // Third-party API integration
          break
        case 'live_chat':
          featurePrice += 250 // Live chat widget
          break
        case 'video_hosting':
          featurePrice += 350 // Video streaming/hosting
          break
        case 'forum':
          featurePrice += 400 // Community forum
          break
        case 'advanced_search':
          featurePrice += 250 // Advanced search functionality
          break
        case 'performance':
          featurePrice += 300 // Performance optimization
          break
        case 'security':
          featurePrice += 400 // Security features, SSL, etc.
          break
      }
    })
    
    // Timeline adjustment
    let timelineMultiplier = 1
    if (formData.timeline === 'urgent') {
      timelineMultiplier = 1.25 // 25% rush fee
    } else if (formData.timeline === 'standard') {
      timelineMultiplier = 1
    } else if (formData.timeline === 'flexible') {
      timelineMultiplier = 0.85 // 15% discount for flexible timeline
    }
    
    const totalPrice = (basePrice + featurePrice) * timelineMultiplier
    
    return {
      basePrice,
      featurePrice,
      totalPrice: Math.round(totalPrice),
      timelineMultiplier
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const quote = calculateQuote()
    
    // Set quote as generated instead of closing widget
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

    // Throttle updates to 60fps
    if (animationFrameRef.current) {
      return
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const newX = e.clientX - dragOffsetRef.current.x
      const newY = e.clientY - dragOffsetRef.current.y
      
      // Keep widget within viewport bounds
      const maxX = window.innerWidth - widgetDimensionsRef.current.width
      const maxY = window.innerHeight - widgetDimensionsRef.current.height
      
      const clampedX = Math.max(0, Math.min(newX, maxX))
      const clampedY = Math.max(0, Math.min(newY, maxY))
      
      // Only update if position actually changed
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
    // Allow dragging from the header area or any element with data-drag-handle
    const target = e.target as HTMLElement
    const isDraggable = target.closest('[data-drag-handle]') || 
                       target.closest('.drag-handle') ||
                       target.classList.contains('drag-handle')
    
    if (isDraggable) {
      e.preventDefault()
      e.stopPropagation()
      
      // Cache widget dimensions once at start of drag
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

  // Cleanup on unmount
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
    setFormData({
      name: "",
      email: "",
      websiteType: "",
      features: [],
      timeline: ""
    })
  }

  if (!isOpen) return null

  return (
    <div
      ref={widgetRef}
      className={`fixed z-50 ${isDragging ? 'cursor-grabbing select-none' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? '300px' : '400px',
        // Disable transitions during drag for better performance
        transition: isDragging ? 'none' : 'all 0.3s ease'
      }}
    >
      <Card className={`shadow-2xl border-2 border-blue-200 dark:border-blue-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm ${isMinimized ? 'h-16' : 'h-auto'}`}>
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg cursor-grab drag-handle hover:from-blue-700 hover:to-purple-700 transition-colors"
          data-drag-handle
          onMouseDown={handleMouseDown}
          title="Drag to move widget"
        >
          <div className="flex items-center space-x-2">
            <GripVertical className="w-4 h-4" />
            <Calculator className="w-5 h-5" />
            <span className="font-semibold">Quote Calculator</span>
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
            {!quoteGenerated ? (
              // Form view
              <>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="website-type" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Website Type *</Label>
                <Select value={formData.websiteType} onValueChange={(value) => setFormData({...formData, websiteType: value})}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                    <SelectItem value="blog">Blog/News</SelectItem>
                    <SelectItem value="saas">SaaS Platform</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="nonprofit">Nonprofit</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                    <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Features</Label>
                    <div className="border rounded-md p-3 bg-white dark:bg-gray-800 max-h-60 overflow-y-auto">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Essential</div>
                  {[
                    { id: 'cms', label: 'CMS', price: 500 },
                    { id: 'seo', label: 'SEO', price: 300 },
                    { id: 'analytics', label: 'Analytics', price: 200 },
                    { id: 'security', label: 'Security', price: 500 }
                  ].map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2 py-1">
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
                            className="h-3 w-3"
                          />
                          <Label htmlFor={feature.id} className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                            {feature.label} <span className="text-green-600">+${feature.price}</span>
                          </Label>
                        </div>
                      ))}
                      
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 mt-3">E-commerce</div>
                      {[
                        { id: 'payment_integration', label: 'Payments', price: 800 },
                        { id: 'booking_system', label: 'Booking', price: 700 },
                        { id: 'user_auth', label: 'User Auth', price: 400 },
                        { id: 'advanced_search', label: 'Search', price: 300 }
                      ].map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2 py-1">
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
                            className="h-3 w-3"
                          />
                          <Label htmlFor={feature.id} className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                            {feature.label} <span className="text-green-600">+${feature.price}</span>
                          </Label>
                        </div>
                      ))}
                      
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 mt-3">Advanced</div>
                      {[
                        { id: 'chatbot', label: 'ChatHub', price: 600 },
                        { id: 'live_chat', label: 'Live Chat', price: 350 },
                        { id: 'multilingual', label: 'Multi-lang', price: 400 },
                        { id: 'api_integration', label: 'API', price: 600 }
                      ].map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2 py-1">
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
                            className="h-3 w-3"
                          />
                          <Label htmlFor={feature.id} className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                            {feature.label} <span className="text-green-600">+${feature.price}</span>
                          </Label>
                        </div>
                      ))}
                      
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 mt-3">Premium</div>
                      {[
                        { id: 'mobile_app', label: 'Mobile App', price: 2000 },
                        { id: 'video_hosting', label: 'Video', price: 450 },
                        { id: 'forum', label: 'Forum', price: 500 },
                        { id: 'performance', label: 'Performance', price: 400 }
                      ].map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2 py-1">
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
                            className="h-3 w-3"
                      />
                          <Label htmlFor={feature.id} className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                            {feature.label} <span className="text-green-600">+${feature.price}</span>
                      </Label>
                    </div>
                  ))}
                </div>
                    {formData.features.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {formData.features.length} feature{formData.features.length !== 1 ? 's' : ''} selected
                      </div>
                    )}
              </div>

              <div>
                <Label htmlFor="timeline" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => setFormData({...formData, timeline: value})}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible (10% discount)</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="urgent">Urgent (30% premium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                  <Button 
                    type="submit" 
                    disabled={!isFormValid()}
                    className={`w-full text-sm ${
                      isFormValid() 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                Get Detailed Quote
              </Button>
            </form>

                {/* Quote Preview - Only show when form is valid AND quote has been generated */}
                {isFormValid() && quoteGenerated && (
            <div className="border-t pt-4">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Estimated Quote</h3>
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
                  {quote.featurePrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Features:</span>
                      <span className="font-medium">+${quote.featurePrice.toLocaleString()}</span>
                    </div>
                  )}
                  {quote.timelineMultiplier !== 1 && (
                    <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              {quote.timelineMultiplier > 1 ? 'Urgent Premium:' : 'Flexible Discount:'}
                            </span>
                            <span className={`font-medium ${quote.timelineMultiplier > 1 ? 'text-red-600' : 'text-green-600'}`}>
                              {quote.timelineMultiplier > 1 ? '+' : '-'}{Math.abs((quote.timelineMultiplier - 1) * 100).toFixed(0)}%
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
                        <span>Timeline: {formData.timeline === 'urgent' ? '2-3 weeks' : formData.timeline === 'flexible' ? '6-8 weeks' : '4-6 weeks'}</span>
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
                    <h3 className="font-semibold text-gray-900 dark:text-white">Your Quote</h3>
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
                    {quote.featurePrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Features:</span>
                        <span className="font-medium">+${quote.featurePrice.toLocaleString()}</span>
                      </div>
                    )}
                    {quote.timelineMultiplier !== 1 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          {quote.timelineMultiplier > 1 ? 'Urgent Premium:' : 'Flexible Discount:'}
                        </span>
                        <span className={`font-medium ${quote.timelineMultiplier > 1 ? 'text-red-600' : 'text-green-600'}`}>
                          {quote.timelineMultiplier > 1 ? '+' : '-'}{Math.abs((quote.timelineMultiplier - 1) * 100).toFixed(0)}%
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
                    <span>Timeline: {formData.timeline === 'urgent' ? '2-3 weeks' : formData.timeline === 'flexible' ? '6-8 weeks' : '4-6 weeks'}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleResetQuote}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Re-quote
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
                    Book Consultation
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    onClick={handleResetQuote}
                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                  >
                    Create New Quote
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        ) : (
          // Minimized state - shows quote and action buttons
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
                    Quote Ready
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
                    {formData.websiteType} • {formData.features.length} features
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