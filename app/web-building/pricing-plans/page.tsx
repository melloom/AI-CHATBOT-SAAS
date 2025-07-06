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
  Smartphone
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"

export default function PricingPlansPage() {
  const router = useRouter()

  const plans = [
    {
      name: "Basic Website Package",
      price: "$2,500",
      description: "Perfect for small businesses and startups",
      features: [
        "Custom website design",
        "Responsive design (mobile-friendly)",
        "Up to 5 pages",
        "Contact form",
        "Basic SEO optimization",
        "Google Analytics integration",
        "Social media integration",
        "Content management system",
        "1 month of support",
        "Domain & hosting setup"
      ],
      timeline: "2-4 weeks",
      popular: false,
      icon: Globe
    },
    {
      name: "Professional Website Package",
      price: "$5,000",
      description: "Ideal for growing businesses",
      features: [
        "Everything in Basic, plus:",
        "Up to 10 pages",
        "Advanced SEO optimization",
        "Blog functionality",
        "Newsletter integration",
        "Advanced contact forms",
        "Social media feeds",
        "Google My Business setup",
        "Performance optimization",
        "3 months of support",
        "Training session included"
      ],
      timeline: "4-6 weeks",
      popular: true,
      icon: Star
    },
    {
      name: "E-commerce Website Package",
      price: "$8,000",
      description: "Complete online store solution",
      features: [
        "Everything in Professional, plus:",
        "Product catalog management",
        "Shopping cart functionality",
        "Payment gateway integration",
        "Inventory management",
        "Order processing system",
        "Customer accounts",
        "Product reviews & ratings",
        "Shipping calculator",
        "Tax calculation",
        "6 months of support"
      ],
      timeline: "6-8 weeks",
      popular: false,
      icon: CreditCard
    },
    {
      name: "Custom Enterprise Solutions",
      price: "$15,000+",
      description: "Tailored solutions for large organizations",
      features: [
        "Custom functionality development",
        "Advanced user management",
        "API integrations",
        "Custom database design",
        "Advanced security features",
        "Performance optimization",
        "Scalability planning",
        "Custom reporting",
        "Multi-language support",
        "12 months of support",
        "Dedicated project manager"
      ],
      timeline: "8-16 weeks",
      popular: false,
      icon: Database
    }
  ]

  const addons = [
    {
      name: "Mobile App Development",
      price: "$8,000+",
      description: "Native iOS and Android applications",
      icon: Smartphone
    },
    {
      name: "ChatHub Integration",
      price: "$200/month",
      description: "AI chatbot for customer support",
      icon: MessageCircle
    },
    {
      name: "Advanced SEO Package",
      price: "$1,500",
      description: "Comprehensive search engine optimization",
      icon: Zap
    },
    {
      name: "Monthly Maintenance",
      price: "$50/month",
      description: "Updates, security, and support",
      icon: Shield
    },
    {
      name: "Custom Design",
      price: "$1,000",
      description: "Unique visual design and branding",
      icon: Palette
    },
    {
      name: "Performance Optimization",
      price: "$800",
      description: "Speed and performance improvements",
      icon: Zap
    }
  ]

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
                  
                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
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
                      <Button variant="outline" size="sm">
                        Add Service
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-green-600">1</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">50% Upfront</p>
                          <p className="text-sm text-muted-foreground">Required to start your project</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">2</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">50% Upon Completion</p>
                          <p className="text-sm text-muted-foreground">Due when project is delivered</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">3</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Monthly Services</p>
                          <p className="text-sm text-muted-foreground">Billed monthly with net-30 terms</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">What's Included</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-muted-foreground">Free consultation call</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-muted-foreground">Detailed project proposal</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-muted-foreground">Regular progress updates</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-muted-foreground">Training and documentation</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-muted-foreground">Post-launch support</span>
                      </div>
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
                  <Button asChild className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Link href="/web-building/quote">Get Free Quote</Link>
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
    </div>
  )
} 