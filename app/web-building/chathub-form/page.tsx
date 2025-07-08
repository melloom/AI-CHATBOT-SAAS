"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Bot, 
  MessageCircle, 
  Zap, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Star,
  Users,
  Shield,
  Globe,
  Database,
  TrendingUp,
  Smartphone,
  Headphones,
  Palette,
  RefreshCw,
  Calendar,
  FileText,
  Settings,
  Clock,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"
import { chathubIntegrationPlans } from "@/lib/pricing-config"

export default function ChatHubFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [bookingMethod, setBookingMethod] = useState<'form' | 'calendly'>('form')
  const [calendlyLoaded, setCalendlyLoaded] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    websiteUrl: "",
    currentPlatform: "",
    integrationPlan: "",
    platforms: [] as string[],
    conversationVolume: "",
    languages: [] as string[],
    customFeatures: [] as string[],
    budget: "",
    timeline: "",
    requirements: "",
    message: ""
  })

  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load Calendly script
  useEffect(() => {
    if (bookingMethod === 'calendly' && !calendlyLoaded) {
      // Load Calendly CSS
      const link = document.createElement('link')
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      link.rel = 'stylesheet'
      document.head.appendChild(link)

      // Load Calendly JS
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.onload = () => setCalendlyLoaded(true)
      document.head.appendChild(script)

      return () => {
        // Cleanup
        document.head.removeChild(link)
        document.head.removeChild(script)
      }
    }
  }, [bookingMethod, calendlyLoaded])

  const handleCalendlyClick = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/melvin-a-p-cruz/consultation'
      })
    }
  }

  // Pre-fill form if coming from ChatHub page
  useEffect(() => {
    const chathubSelection = sessionStorage.getItem('chathubSelection')
    
    if (chathubSelection) {
      try {
        const data = JSON.parse(chathubSelection)
        setSelectedPlan(data)
        setFormData(prev => ({
          ...prev,
          integrationPlan: data.planName || data.serviceName || 'ChatHub Integration'
        }))
        sessionStorage.removeItem('chathubSelection')
      } catch (error) {
        console.error('Error parsing ChatHub selection:', error)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create form data
    const submitData = new FormData()
    submitData.append('service_type', 'chathub_integration_request')
    submitData.append('source', 'chathub_form')
    submitData.append('name', formData.name)
    submitData.append('email', formData.email)
    submitData.append('company', formData.company)
    submitData.append('phone', formData.phone)
    submitData.append('website_url', formData.websiteUrl)
    submitData.append('current_platform', formData.currentPlatform)
    submitData.append('integration_plan', formData.integrationPlan)
    submitData.append('platforms', formData.platforms.join(', '))
    submitData.append('conversation_volume', formData.conversationVolume)
    submitData.append('languages', formData.languages.join(', '))
    submitData.append('custom_features', formData.customFeatures.join(', '))
    submitData.append('budget', formData.budget)
    submitData.append('timeline', formData.timeline)
    submitData.append('requirements', formData.requirements)
    submitData.append('message', formData.message)

    // Add selected plan details
    if (selectedPlan) {
      submitData.append('selected_plan_name', selectedPlan.planName || selectedPlan.serviceName || selectedPlan.name)
      submitData.append('selected_plan_price', selectedPlan.price)
      submitData.append('selected_plan_description', selectedPlan.description)
      if (selectedPlan.features) {
        submitData.append('selected_plan_features', selectedPlan.features.join(', '))
      }
    }

    // Submit to Formspree
    try {
      const response = await fetch('https://formspree.io/f/mgvylnze', {
        method: 'POST',
        body: submitData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        alert('Thank you! Your ChatHub integration request has been submitted. We\'ll get back to you within 24 hours.')
        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          websiteUrl: "",
          currentPlatform: "",
          integrationPlan: "",
          platforms: [],
          conversationVolume: "",
          languages: [],
          customFeatures: [],
          budget: "",
          timeline: "",
          requirements: "",
          message: ""
        })
        setSelectedPlan(null)
      } else {
        alert('There was an error submitting your request. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error submitting your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const platforms = [
    { id: 'website', label: 'Website Integration', price: 'Included' },
    { id: 'facebook', label: 'Facebook Messenger', price: '$50/month' },
    { id: 'whatsapp', label: 'WhatsApp Business', price: '$75/month' },
    { id: 'slack', label: 'Slack Integration', price: '$100/month' },
    { id: 'telegram', label: 'Telegram Bot', price: '$50/month' },
    { id: 'custom_api', label: 'Custom API', price: '$200/month' }
  ]

  const languages = [
    { id: 'english', label: 'English' },
    { id: 'spanish', label: 'Spanish' },
    { id: 'french', label: 'French' },
    { id: 'german', label: 'German' },
    { id: 'chinese', label: 'Chinese' },
    { id: 'japanese', label: 'Japanese' },
    { id: 'arabic', label: 'Arabic' },
    { id: 'other', label: 'Other' }
  ]

  const customFeatures = [
    { id: 'voice_recognition', label: 'Voice Recognition', price: '$150/month' },
    { id: 'sentiment_analysis', label: 'Sentiment Analysis', price: '$100/month' },
    { id: 'lead_scoring', label: 'Lead Scoring', price: '$200/month' },
    { id: 'appointment_scheduling', label: 'Appointment Scheduling', price: '$75/month' },
    { id: 'payment_integration', label: 'Payment Integration', price: '$125/month' },
    { id: 'custom_training', label: 'Custom AI Training', price: '$500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-50/5 to-blue-100/10 dark:from-background dark:via-orange-900/20 dark:to-blue-800/10">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/web-building" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl text-foreground">WebVault</span>
            </Link>
            
            <EnhancedBackButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
              ChatHub Integration
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              ChatHub Integration Request
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tell us about your chatbot integration needs. We'll create a customized ChatHub solution.
            </p>
          </div>

          {/* Booking Method Toggle */}
          <div className="mb-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Choose Your Booking Method</h3>
                  <p className="text-muted-foreground">Select how you'd like to schedule your ChatHub integration consultation</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Button
                    variant={bookingMethod === 'form' ? 'default' : 'outline'}
                    className={`h-auto p-6 flex flex-col items-center space-y-3 ${
                      bookingMethod === 'form' 
                        ? 'bg-gradient-to-r from-orange-600 to-blue-600 text-white' 
                        : 'hover:bg-orange-50 dark:hover:bg-orange-900/20'
                    }`}
                    onClick={() => setBookingMethod('form')}
                  >
                    <FileText className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-semibold">Fill Out Form</div>
                      <div className="text-xs opacity-90">We'll contact you within 24 hours</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant={bookingMethod === 'calendly' ? 'default' : 'outline'}
                    className={`h-auto p-6 flex flex-col items-center space-y-3 ${
                      bookingMethod === 'calendly' 
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white' 
                        : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                    onClick={() => setBookingMethod('calendly')}
                  >
                    <Calendar className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-semibold">Direct Scheduling</div>
                      <div className="text-xs opacity-90">Book instantly with Calendly</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              {bookingMethod === 'form' ? (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <Bot className="w-6 h-6 text-orange-600" />
                    <span>Integration Request</span>
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you with a customized ChatHub integration solution.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Website Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="websiteUrl">Website URL</Label>
                        <Input
                          id="websiteUrl"
                          type="url"
                          placeholder="https://example.com"
                          value={formData.websiteUrl}
                          onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentPlatform">Current Platform</Label>
                        <Input
                          id="currentPlatform"
                          placeholder="e.g., WordPress, Shopify, Custom"
                          value={formData.currentPlatform}
                          onChange={(e) => setFormData({...formData, currentPlatform: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Integration Plan */}
                    <div>
                      <Label htmlFor="integrationPlan">Preferred Integration Plan</Label>
                      <Select value={formData.integrationPlan} onValueChange={(value) => setFormData({...formData, integrationPlan: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select integration plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {chathubIntegrationPlans.map((plan, index) => (
                            <SelectItem key={index} value={plan.name}>
                              {plan.name} - {plan.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Platforms */}
                    <div>
                      <Label className="text-base font-semibold">Integration Platforms</Label>
                      <div className="grid gap-3 mt-3 md:grid-cols-2">
                        {platforms.map((platform) => (
                          <div key={platform.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={platform.id}
                              checked={formData.platforms.includes(platform.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    platforms: [...formData.platforms, platform.id]
                                  })
                                } else {
                                  setFormData({
                                    ...formData,
                                    platforms: formData.platforms.filter(id => id !== platform.id)
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={platform.id} className="text-sm font-normal cursor-pointer">
                              {platform.label} <span className="text-muted-foreground">({platform.price})</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Conversation Volume */}
                    <div>
                      <Label htmlFor="conversationVolume">Expected Monthly Conversations</Label>
                      <Select value={formData.conversationVolume} onValueChange={(value) => setFormData({...formData, conversationVolume: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select conversation volume" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under 1,000">Under 1,000</SelectItem>
                          <SelectItem value="1,000 - 5,000">1,000 - 5,000</SelectItem>
                          <SelectItem value="5,000 - 10,000">5,000 - 10,000</SelectItem>
                          <SelectItem value="10,000 - 50,000">10,000 - 50,000</SelectItem>
                          <SelectItem value="50,000+">50,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Languages */}
                    <div>
                      <Label className="text-base font-semibold">Languages Required</Label>
                      <div className="grid gap-3 mt-3 md:grid-cols-3">
                        {languages.map((language) => (
                          <div key={language.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={language.id}
                              checked={formData.languages.includes(language.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    languages: [...formData.languages, language.id]
                                  })
                                } else {
                                  setFormData({
                                    ...formData,
                                    languages: formData.languages.filter(id => id !== language.id)
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={language.id} className="text-sm font-normal cursor-pointer">
                              {language.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Custom Features */}
                    <div>
                      <Label className="text-base font-semibold">Custom Features</Label>
                      <div className="grid gap-3 mt-3 md:grid-cols-2">
                        {customFeatures.map((feature) => (
                          <div key={feature.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={feature.id}
                              checked={formData.customFeatures.includes(feature.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    customFeatures: [...formData.customFeatures, feature.id]
                                  })
                                } else {
                                  setFormData({
                                    ...formData,
                                    customFeatures: formData.customFeatures.filter(id => id !== feature.id)
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={feature.id} className="text-sm font-normal cursor-pointer">
                              {feature.label} <span className="text-muted-foreground">({feature.price})</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Budget and Timeline */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="$200-500/month">$200-500/month</SelectItem>
                            <SelectItem value="$500-1000/month">$500-1000/month</SelectItem>
                            <SelectItem value="$1000-2000/month">$1000-2000/month</SelectItem>
                            <SelectItem value="$2000+/month">$2000+/month</SelectItem>
                            <SelectItem value="Custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="timeline">Timeline</Label>
                        <Select value={formData.timeline} onValueChange={(value) => setFormData({...formData, timeline: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Immediate">Immediate</SelectItem>
                            <SelectItem value="Within 1 week">Within 1 week</SelectItem>
                            <SelectItem value="Within 1 month">Within 1 month</SelectItem>
                            <SelectItem value="Flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <Label htmlFor="requirements">Specific Requirements</Label>
                      <Textarea
                        id="requirements"
                        placeholder="Tell us about any specific requirements, use cases, or questions..."
                        value={formData.requirements}
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                        rows={4}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-700 hover:to-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Request
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              /* Calendly Direct Booking */
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-green-600" />
                    <span>Direct Scheduling</span>
                  </CardTitle>
                  <CardDescription>
                    Book your ChatHub integration consultation instantly using our Calendly integration. Choose your preferred time and get confirmed immediately.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-semibold">Instant Booking Available</span>
                      </div>
                      <p className="text-muted-foreground">
                        Click the button below to open our scheduling calendar. You can choose your preferred time slot and get instant confirmation.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <Button 
                        onClick={handleCalendlyClick}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg"
                        disabled={!calendlyLoaded}
                      >
                        {calendlyLoaded ? (
                          <>
                            <Calendar className="w-6 h-6 mr-3" />
                            Schedule Consultation Now
                            <ExternalLink className="w-5 h-5 ml-2" />
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                            Loading Calendar...
                          </>
                        )}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground">
                        Opens in a popup window. Make sure popups are enabled for this site.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold text-green-900 dark:text-green-100">What's Included:</h4>
                      <div className="grid gap-2 text-sm text-green-800 dark:text-green-200">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>30-minute free consultation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Instant confirmation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Calendar integration</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Reminder notifications</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Plan */}
              {selectedPlan && (
                <Card className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Selected Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="w-4 h-4 text-orange-600" />
                        <span className="font-semibold text-sm">{selectedPlan.planName || selectedPlan.serviceName || selectedPlan.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{selectedPlan.description}</p>
                      <p className="text-sm font-bold text-orange-600">{selectedPlan.price}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              <Card className="border-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <CardHeader>
                  <CardTitle className="text-lg">Why Choose ChatHub?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="text-sm">24/7 Customer Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Increased Engagement</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Lead Generation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Consistent Service</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="border-0 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Live chat available</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Free consultation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">24/7 support</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 