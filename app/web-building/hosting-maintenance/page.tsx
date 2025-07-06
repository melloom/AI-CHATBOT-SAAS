"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  RefreshCw
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"
import { hostingPlans as hostingPlansConfig, maintenanceServices as maintenanceServicesConfig } from "@/lib/pricing-config"

export default function HostingMaintenancePage() {
  const router = useRouter()

  const hostingPlans = hostingPlansConfig.map(plan => ({
    ...plan,
    icon: plan.name.includes("Basic") ? Server :
          plan.name.includes("Professional") ? Star : Zap
  }))

  const maintenanceServices = maintenanceServicesConfig.map(service => ({
    ...service,
    icon: service.name.includes("Basic") ? RefreshCw :
          service.name.includes("Professional") ? Shield : TrendingUp
  }))

  const benefits = [
    {
      icon: Shield,
      title: "Security First",
      description: "Enterprise-grade security with regular updates, malware scanning, and DDoS protection."
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Round-the-clock monitoring ensures your website stays online and performs optimally."
    },
    {
      icon: Database,
      title: "Daily Backups",
      description: "Automatic daily backups with 30-day retention and one-click restore functionality."
    },
    {
      icon: Zap,
      title: "Fast Performance",
      description: "Optimized servers, CDN integration, and caching for lightning-fast load times."
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated support team with average response times under 2 hours."
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Content delivery network ensures fast loading times worldwide."
    }
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
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              Hosting & Maintenance
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Reliable Hosting & Maintenance
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Keep your website secure, fast, and always online with our comprehensive 
              hosting and maintenance services.
            </p>
          </div>

          {/* Hosting Plans */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Hosting Plans</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect hosting plan for your website. All plans include SSL certificates, 
                daily backups, and 99.9% uptime guarantee.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {hostingPlans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative shadow-lg border-0 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-700' 
                      : 'bg-gradient-to-br from-white to-gray-50/20 dark:from-card dark:to-gray-900/10'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
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
                    
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Choose Plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Maintenance Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Maintenance Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Keep your website running smoothly with our comprehensive maintenance packages.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {maintenanceServices.map((service, index) => (
                <Card key={index} className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/20 dark:from-card dark:to-purple-900/10">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <service.icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Price</p>
                        <p className="font-semibold text-foreground">{service.price}</p>
                      </div>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Get Started
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Our Hosting?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide enterprise-grade hosting with unmatched reliability and support.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Let's discuss your hosting and maintenance needs. We'll help you choose the perfect plan.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
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