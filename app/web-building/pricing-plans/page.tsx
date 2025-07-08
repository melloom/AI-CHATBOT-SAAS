"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Globe, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Star,
  Clock,
  Users,
  Shield,
  Zap,
  MessageCircle,
  Palette,
  Database,
  Smartphone,
  Building2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"
import { webDevelopmentPlans, webDevelopmentAddons, paymentTerms, whatsIncluded, companyServices } from "@/lib/pricing-config"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function PricingPlansPage() {
  const router = useRouter()

  const [selectedAddons, setSelectedAddons] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)

  const plans = webDevelopmentPlans.map(plan => ({
    ...plan,
    icon: plan.name.includes("Basic") ? Globe : 
          plan.name.includes("Professional") ? Star :
          plan.name.includes("E-commerce") ? CreditCard : Database
  }))

  const addons = webDevelopmentAddons.map(addon => ({
    ...addon,
    icon: addon.name.includes("Mobile") ? Smartphone :
          addon.name.includes("ChatHub") ? MessageCircle :
          addon.name.includes("SEO") ? Zap :
          addon.name.includes("Maintenance") ? Shield :
          addon.name.includes("Design") ? Palette : Zap
  }))

  const handleAddAddon = (addon: any) => {
    if (!selectedAddons.some(a => a.name === addon.name)) {
      setSelectedAddons([...selectedAddons, addon])
    }
  }

  const handleRemoveAddon = (addon: any) => {
    setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name))
  }

  const handleGetStarted = (plan: any) => {
    const formData = {
      selectedPlan: plan,
      selectedAddons: selectedAddons,
      totalPrice: calculateTotalPrice(plan, selectedAddons),
      serviceType: 'web_development_quote'
    }
    
    // Store the data in sessionStorage for the contact form to access
    sessionStorage.setItem('pricingSelection', JSON.stringify(formData))
    
    // Navigate to contact form
    router.push('/web-building/home?section=contact')
  }

  const calculateTotalPrice = (plan: any, addons: any[]) => {
    const planPrice = parseInt(plan.price.replace(/[$,]/g, ''))
    const addonPrices = addons.map(addon => {
      const price = addon.price.replace(/[$,]/g, '')
      return price.includes('+') ? parseInt(price.replace('+', '')) : parseInt(price)
    })
    const totalAddonPrice = addonPrices.reduce((sum, price) => sum + price, 0)
    return planPrice + totalAddonPrice
  }

  const handleLearnMore = (service: any) => {
    setSelectedService(service)
    setIsServiceDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/5 to-blue-100/10 dark:from-background dark:via-green-900/20 dark:to-blue-800/10">
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
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              Pricing Plans
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Transparent Pricing Plans
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan for your business. All plans include hosting, domain setup, 
              and ongoing support. No hidden fees, no surprises.
            </p>
          </div>

          {/* Pricing Plans */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-20">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative shadow-lg border-0 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-700' 
                    : 'bg-gradient-to-br from-white to-gray-50/20 dark:from-card dark:to-gray-900/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground"> one-time</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{plan.timeline}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    onClick={() => handleGetStarted(plan)}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add-ons Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Additional Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Enhance your website with these additional services. Add them to any plan.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {addons.map((addon, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <addon.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{addon.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {addon.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">{addon.price}</span>
                      <Button 
                        variant={selectedAddons.some(a => a.name === addon.name) ? "default" : "outline"}
                        size="sm"
                        onClick={() => selectedAddons.some(a => a.name === addon.name) 
                          ? handleRemoveAddon(addon) 
                          : handleAddAddon(addon)
                        }
                      >
                        {selectedAddons.some(a => a.name === addon.name) ? "Remove" : "Add Service"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {selectedAddons.length > 0 && (
              <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-200">Selected Add-ons</h3>
                <ul className="space-y-2">
                  {selectedAddons.map((addon, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="font-medium">{addon.name}</span>
                      <span className="text-foreground font-bold mr-4">{addon.price}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveAddon(addon)}>
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Business Services Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Business & Legal Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete business and legal services to protect and grow your company.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {companyServices.slice(0, 6).map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">{service.price}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLearnMore(service)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Link href="/web-building/business-services">View All Business Services</Link>
              </Button>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-0">
              <CardContent className="p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Payment Terms</h3>
                    <div className="space-y-4">
                      {paymentTerms.map((term, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${
                            index === 0 ? 'bg-green-100 dark:bg-green-900/30' :
                            index === 1 ? 'bg-blue-100 dark:bg-blue-900/30' :
                            'bg-purple-100 dark:bg-purple-900/30'
                          } rounded-full flex items-center justify-center`}>
                            <span className={`text-sm font-bold ${
                              index === 0 ? 'text-green-600' :
                              index === 1 ? 'text-blue-600' :
                              'text-purple-600'
                            }`}>{term.step}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{term.title}</p>
                            <p className="text-sm text-muted-foreground">{term.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">What's Included</h3>
                    <div className="space-y-3">
                      {whatsIncluded.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Not sure which plan is right for you? Let's discuss your needs and find the perfect solution.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    onClick={() => router.push('/web-building/quote')}
                  >
                    Get Free Quote
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Service Details Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <span>{selectedService?.name}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Service Overview</h3>
                <p className="text-muted-foreground">{selectedService.description}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{selectedService.price}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Business Service
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                <div className="space-y-2">
                  {selectedService.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  )) || (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-muted-foreground">Professional consultation and guidance</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  onClick={() => {
                    setIsServiceDialogOpen(false)
                    // Navigate to contact form with service info
                    const formData = {
                      selectedService: selectedService,
                      serviceType: 'business_service_consultation'
                    }
                    sessionStorage.setItem('serviceSelection', JSON.stringify(formData))
                    router.push('/web-building/home?section=contact')
                  }}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsServiceDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 