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
  Server, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Star,
  Users,
  Zap,
  MessageCircle,
  Globe,
  Database,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Building2,
  CreditCard,
  Calendar,
  FileText,
  Settings
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"
import { hostingPlans, maintenanceServices } from "@/lib/pricing-config"

export default function HostingFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    websiteUrl: "",
    currentHosting: "",
    hostingPlan: "",
    maintenanceService: "",
    additionalServices: [] as string[],
    budget: "",
    timeline: "",
    requirements: "",
    message: ""
  })

  const [selectedHostingPlan, setSelectedHostingPlan] = useState<any>(null)
  const [selectedMaintenanceService, setSelectedMaintenanceService] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-fill form if coming from hosting page
  useEffect(() => {
    const hostingSelection = sessionStorage.getItem('hostingSelection')
    const maintenanceSelection = sessionStorage.getItem('maintenanceSelection')
    
    if (hostingSelection) {
      try {
        const data = JSON.parse(hostingSelection)
        setSelectedHostingPlan(data.selectedHostingPlan)
        setFormData(prev => ({
          ...prev,
          hostingPlan: data.selectedHostingPlan.name
        }))
        sessionStorage.removeItem('hostingSelection')
      } catch (error) {
        console.error('Error parsing hosting selection:', error)
      }
    }

    if (maintenanceSelection) {
      try {
        const data = JSON.parse(maintenanceSelection)
        setSelectedMaintenanceService(data.selectedMaintenanceService)
        setFormData(prev => ({
          ...prev,
          maintenanceService: data.selectedMaintenanceService.name
        }))
        sessionStorage.removeItem('maintenanceSelection')
      } catch (error) {
        console.error('Error parsing maintenance selection:', error)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create form data
    const submitData = new FormData()
    submitData.append('service_type', 'hosting_maintenance_request')
    submitData.append('source', 'hosting_form')
    submitData.append('name', formData.name)
    submitData.append('email', formData.email)
    submitData.append('company', formData.company)
    submitData.append('phone', formData.phone)
    submitData.append('website_url', formData.websiteUrl)
    submitData.append('current_hosting', formData.currentHosting)
    submitData.append('hosting_plan', formData.hostingPlan)
    submitData.append('maintenance_service', formData.maintenanceService)
    submitData.append('additional_services', formData.additionalServices.join(', '))
    submitData.append('budget', formData.budget)
    submitData.append('timeline', formData.timeline)
    submitData.append('requirements', formData.requirements)
    submitData.append('message', formData.message)

    // Add selected plan details
    if (selectedHostingPlan) {
      submitData.append('selected_hosting_plan_name', selectedHostingPlan.name)
      submitData.append('selected_hosting_plan_price', selectedHostingPlan.price)
      submitData.append('selected_hosting_plan_description', selectedHostingPlan.description)
    }

    if (selectedMaintenanceService) {
      submitData.append('selected_maintenance_service_name', selectedMaintenanceService.name)
      submitData.append('selected_maintenance_service_price', selectedMaintenanceService.price)
      submitData.append('selected_maintenance_service_description', selectedMaintenanceService.description)
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
        alert('Thank you! Your hosting and maintenance request has been submitted. We\'ll get back to you within 24 hours.')
        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          websiteUrl: "",
          currentHosting: "",
          hostingPlan: "",
          maintenanceService: "",
          additionalServices: [],
          budget: "",
          timeline: "",
          requirements: "",
          message: ""
        })
        setSelectedHostingPlan(null)
        setSelectedMaintenanceService(null)
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

  const additionalServices = [
    { id: 'ssl_certificate', label: 'SSL Certificate Setup', price: '$50' },
    { id: 'domain_transfer', label: 'Domain Transfer', price: '$25' },
    { id: 'email_setup', label: 'Email Setup', price: '$30' },
    { id: 'backup_restore', label: 'Backup & Restore', price: '$75' },
    { id: 'performance_optimization', label: 'Performance Optimization', price: '$100' },
    { id: 'security_audit', label: 'Security Audit', price: '$150' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/5 to-blue-100/10 dark:from-background dark:via-purple-900/20 dark:to-blue-800/10">
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
            <Badge variant="secondary" className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              Hosting & Maintenance
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Hosting & Maintenance Request
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tell us about your hosting and maintenance needs. We'll provide a customized solution.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <Server className="w-6 h-6 text-purple-600" />
                    <span>Request Form</span>
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you with a customized hosting and maintenance solution.
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
                        <Label htmlFor="websiteUrl">Current Website URL</Label>
                        <Input
                          id="websiteUrl"
                          type="url"
                          placeholder="https://example.com"
                          value={formData.websiteUrl}
                          onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentHosting">Current Hosting Provider</Label>
                        <Input
                          id="currentHosting"
                          placeholder="e.g., GoDaddy, Bluehost, etc."
                          value={formData.currentHosting}
                          onChange={(e) => setFormData({...formData, currentHosting: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="hostingPlan">Preferred Hosting Plan</Label>
                        <Select value={formData.hostingPlan} onValueChange={(value) => setFormData({...formData, hostingPlan: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hosting plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {hostingPlans.map((plan, index) => (
                              <SelectItem key={index} value={plan.name}>
                                {plan.name} - {plan.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="maintenanceService">Maintenance Service</Label>
                        <Select value={formData.maintenanceService} onValueChange={(value) => setFormData({...formData, maintenanceService: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select maintenance service" />
                          </SelectTrigger>
                          <SelectContent>
                            {maintenanceServices.map((service, index) => (
                              <SelectItem key={index} value={service.name}>
                                {service.name} - {service.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Additional Services */}
                    <div>
                      <Label className="text-base font-semibold">Additional Services</Label>
                      <div className="grid gap-3 mt-3 md:grid-cols-2">
                        {additionalServices.map((service) => (
                          <div key={service.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={service.id}
                              checked={formData.additionalServices.includes(service.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    additionalServices: [...formData.additionalServices, service.id]
                                  })
                                } else {
                                  setFormData({
                                    ...formData,
                                    additionalServices: formData.additionalServices.filter(id => id !== service.id)
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={service.id} className="text-sm font-normal cursor-pointer">
                              {service.label} <span className="text-muted-foreground">({service.price})</span>
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
                            <SelectItem value="$50-100/month">$50-100/month</SelectItem>
                            <SelectItem value="$100-200/month">$100-200/month</SelectItem>
                            <SelectItem value="$200-500/month">$200-500/month</SelectItem>
                            <SelectItem value="$500+/month">$500+/month</SelectItem>
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
                        placeholder="Tell us about any specific requirements, concerns, or questions..."
                        value={formData.requirements}
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                        rows={4}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Services */}
              {(selectedHostingPlan || selectedMaintenanceService) && (
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Selected Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedHostingPlan && (
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Server className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-sm">{selectedHostingPlan.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{selectedHostingPlan.description}</p>
                        <p className="text-sm font-bold text-purple-600">{selectedHostingPlan.price}</p>
                      </div>
                    )}
                    {selectedMaintenanceService && (
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-sm">{selectedMaintenanceService.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{selectedMaintenanceService.description}</p>
                        <p className="text-sm font-bold text-blue-600">{selectedMaintenanceService.price}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              <Card className="border-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <CardHeader>
                  <CardTitle className="text-lg">Why Choose Our Hosting?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm">99.9% Uptime Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Database className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Daily Backups</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Fast Performance</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
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