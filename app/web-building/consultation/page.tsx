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
  Calendar, 
  Clock, 
  Users, 
  MessageCircle, 
  ArrowLeft,
  ArrowRight,
  Star,
  Shield,
  Globe,
  Database,
  TrendingUp,
  Smartphone,
  Headphones,
  Palette,
  RefreshCw,
  FileText,
  Settings,
  CheckCircle,
  Zap,
  Phone,
  MapPin
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"

export default function ConsultationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    websiteUrl: "",
    projectType: "",
    budget: "",
    timeline: "",
    consultationType: "",
    preferredTime: "",
    timezone: "",
    projectDetails: "",
    goals: "",
    questions: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-fill form if coming from quote widget or pricing plans
  useEffect(() => {
    const quoteData = sessionStorage.getItem('quoteData')
    const pricingPlanData = sessionStorage.getItem('pricingPlanSelection')
    
    if (quoteData) {
      try {
        const data = JSON.parse(quoteData)
        setFormData(prev => ({
          ...prev,
          projectType: data.websiteType || "",
          budget: data.budget || "",
          timeline: data.timeline || "",
          projectDetails: `Quote Request: $${data.quote?.totalPrice?.toLocaleString() || 'TBD'} for ${data.websiteType || 'website'} project. Features: ${data.features?.join(', ') || 'TBD'}. Timeline: ${data.timeline || 'TBD'}.`
        }))
        sessionStorage.removeItem('quoteData')
      } catch (error) {
        console.error('Error parsing quote data:', error)
      }
    }
    
    if (pricingPlanData) {
      try {
        const data = JSON.parse(pricingPlanData)
        setFormData(prev => ({
          ...prev,
          projectType: data.planName || "",
          budget: data.price || "",
          projectDetails: `Pricing Plan Interest: ${data.planName} - ${data.price}\nDescription: ${data.description}\nFeatures: ${data.features.join(', ')}`
        }))
        sessionStorage.removeItem('pricingPlanSelection')
      } catch (error) {
        console.error('Error parsing pricing plan data:', error)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create form data
    const submitData = new FormData()
    submitData.append('service_type', 'consultation_request')
    submitData.append('source', 'consultation_page')
    submitData.append('name', formData.name)
    submitData.append('email', formData.email)
    submitData.append('company', formData.company)
    submitData.append('phone', formData.phone)
    submitData.append('website_url', formData.websiteUrl)
    submitData.append('project_type', formData.projectType)
    submitData.append('budget', formData.budget)
    submitData.append('timeline', formData.timeline)
    submitData.append('consultation_type', formData.consultationType)
    submitData.append('preferred_time', formData.preferredTime)
    submitData.append('timezone', formData.timezone)
    submitData.append('project_details', formData.projectDetails)
    submitData.append('goals', formData.goals)
    submitData.append('questions', formData.questions)
    
    // Add pricing plan data if available
    const pricingPlanData = sessionStorage.getItem('pricingPlanSelection')
    if (pricingPlanData) {
      try {
        const data = JSON.parse(pricingPlanData)
        submitData.append('selected_plan_name', data.planName)
        submitData.append('selected_plan_price', data.price)
        submitData.append('selected_plan_description', data.description)
        submitData.append('selected_plan_features', data.features.join(', '))
        sessionStorage.removeItem('pricingPlanSelection')
      } catch (error) {
        console.error('Error parsing pricing plan data:', error)
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
        alert('Thank you! Your consultation request has been submitted. We\'ll contact you within 24 hours to schedule your consultation.')
        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          websiteUrl: "",
          projectType: "",
          budget: "",
          timeline: "",
          consultationType: "",
          preferredTime: "",
          timezone: "",
          projectDetails: "",
          goals: "",
          questions: ""
        })
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

  const consultationTypes = [
    { id: 'initial', label: 'Initial Project Discussion', description: 'Discuss your project requirements and get expert advice' },
    { id: 'technical', label: 'Technical Review', description: 'Review existing website or technical requirements' },
    { id: 'strategy', label: 'Strategy Session', description: 'Plan your digital strategy and roadmap' },
    { id: 'quote', label: 'Quote Discussion', description: 'Discuss pricing and project scope' },
    { id: 'support', label: 'Support & Maintenance', description: 'Ongoing support and maintenance consultation' }
  ]

  const timeSlots = [
    { id: 'morning', label: 'Morning (9 AM - 12 PM)' },
    { id: 'afternoon', label: 'Afternoon (1 PM - 4 PM)' },
    { id: 'evening', label: 'Evening (5 PM - 8 PM)' },
    { id: 'flexible', label: 'Flexible - Any time works' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/5 to-purple-100/10 dark:from-background dark:via-blue-900/20 dark:to-purple-800/10">
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
            <Badge variant="secondary" className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Free Consultation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Book Your Free Consultation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get expert advice on your web development project. Our 30-minute consultation is completely free and includes a detailed project assessment.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <span>Consultation Request</span>
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll schedule your free consultation within 24 hours.
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

                    {/* Project Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="websiteUrl">Current Website (if any)</Label>
                        <Input
                          id="websiteUrl"
                          type="url"
                          placeholder="https://example.com"
                          value={formData.websiteUrl}
                          onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="projectType">Project Type</Label>
                        <Select value={formData.projectType} onValueChange={(value) => setFormData({...formData, projectType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ecommerce">E-commerce Website</SelectItem>
                            <SelectItem value="corporate">Corporate Website</SelectItem>
                            <SelectItem value="portfolio">Portfolio Website</SelectItem>
                            <SelectItem value="blog">Blog/News Website</SelectItem>
                            <SelectItem value="landing">Landing Page</SelectItem>
                            <SelectItem value="webapp">Web Application</SelectItem>
                            <SelectItem value="redesign">Website Redesign</SelectItem>
                            <SelectItem value="maintenance">Maintenance & Support</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
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
                            <SelectItem value="Under $1,000">Under $1,000</SelectItem>
                            <SelectItem value="$1,000 - $3,000">$1,000 - $3,000</SelectItem>
                            <SelectItem value="$3,000 - $8,000">$3,000 - $8,000</SelectItem>
                            <SelectItem value="$8,000 - $15,000">$8,000 - $15,000</SelectItem>
                            <SelectItem value="$15,000+">$15,000+</SelectItem>
                            <SelectItem value="Not sure">Not sure yet</SelectItem>
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
                            <SelectItem value="ASAP">ASAP</SelectItem>
                            <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                            <SelectItem value="1 month">1 month</SelectItem>
                            <SelectItem value="2-3 months">2-3 months</SelectItem>
                            <SelectItem value="3+ months">3+ months</SelectItem>
                            <SelectItem value="Flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Consultation Type */}
                    <div>
                      <Label className="text-base font-semibold">Consultation Type</Label>
                      <div className="grid gap-3 mt-3 md:grid-cols-2">
                        {consultationTypes.map((type) => (
                          <div key={type.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={type.id}
                              checked={formData.consultationType === type.id}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    consultationType: type.id
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={type.id} className="text-sm font-normal cursor-pointer">
                              <div className="font-medium">{type.label}</div>
                              <div className="text-muted-foreground text-xs">{type.description}</div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Time */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="preferredTime">Preferred Time</Label>
                        <Select value={formData.preferredTime} onValueChange={(value) => setFormData({...formData, preferredTime: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot.id} value={slot.id}>
                                {slot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={formData.timezone} onValueChange={(value) => setFormData({...formData, timezone: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                            <SelectItem value="CST">Central Time (CST)</SelectItem>
                            <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                            <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                            <SelectItem value="GMT">GMT/UTC</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div>
                      <Label htmlFor="projectDetails">Project Details</Label>
                      <Textarea
                        id="projectDetails"
                        placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                        value={formData.projectDetails}
                        onChange={(e) => setFormData({...formData, projectDetails: e.target.value})}
                        rows={4}
                      />
                    </div>

                    {/* Goals */}
                    <div>
                      <Label htmlFor="goals">What are your main goals?</Label>
                      <Textarea
                        id="goals"
                        placeholder="What do you want to achieve with this project? (e.g., increase sales, improve user experience, establish online presence)"
                        value={formData.goals}
                        onChange={(e) => setFormData({...formData, goals: e.target.value})}
                        rows={3}
                      />
                    </div>

                    {/* Questions */}
                    <div>
                      <Label htmlFor="questions">Questions for the consultation</Label>
                      <Textarea
                        id="questions"
                        placeholder="Any specific questions or concerns you'd like to discuss during the consultation?"
                        value={formData.questions}
                        onChange={(e) => setFormData({...formData, questions: e.target.value})}
                        rows={3}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Book Free Consultation
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* What to Expect */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
                <CardHeader>
                  <CardTitle className="text-lg">What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">30-minute free consultation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Expert project assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Detailed cost estimate</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Project timeline discussion</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">melvin.a.p.cruz@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="text-sm">+1 (667) 200-9784</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Maryland, USA</span>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">10+ years experience</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Fast turnaround times</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">5-star client reviews</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">100% satisfaction guarantee</span>
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