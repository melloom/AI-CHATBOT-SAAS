"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Scale, 
  Shield, 
  FileText, 
  Users, 
  Globe, 
  TrendingUp,
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  Zap,
  Database,
  Smartphone,
  Headphones,
  Palette,
  Briefcase,
  Gavel,
  Calculator,
  Target,
  AlertTriangle,
  Globe2,
  Heart
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"
import { companyServices, industryServices, consultingServices } from "@/lib/pricing-config"

export default function BusinessServicesPage() {
  const router = useRouter()

  const legalServices = companyServices.map(service => ({
    ...service,
    icon: service.name.includes("Formation") ? Building2 :
          service.name.includes("Plan") ? FileText :
          service.name.includes("Templates") ? FileText :
          service.name.includes("Compliance") ? Shield :
          service.name.includes("Intellectual") ? Target :
          service.name.includes("Tax") ? Calculator :
          service.name.includes("HR") ? Users :
          service.name.includes("Data") ? Database :
          service.name.includes("Contract") ? Gavel :
          service.name.includes("Governance") ? Briefcase : Scale
  }))

  const industrySpecific = industryServices.map(service => ({
    ...service,
    icon: service.name.includes("Healthcare") ? Shield :
          service.name.includes("Financial") ? Calculator :
          service.name.includes("E-commerce") ? Globe :
          service.name.includes("SaaS") ? Database :
          service.name.includes("Real Estate") ? Building2 :
          service.name.includes("Restaurant") ? Users :
          service.name.includes("Technology") ? Zap :
          service.name.includes("Non-Profit") ? Heart : Briefcase
  }))

  const consulting = consultingServices.map(service => ({
    ...service,
    icon: service.name.includes("Strategy") ? Target :
          service.name.includes("Financial") ? Calculator :
          service.name.includes("Risk") ? AlertTriangle :
          service.name.includes("Mergers") ? TrendingUp :
          service.name.includes("International") ? Globe2 :
          service.name.includes("Crisis") ? AlertTriangle : Briefcase
  }))

  const benefits = [
    {
      icon: Shield,
      title: "Legal Protection",
      description: "Comprehensive legal frameworks to protect your business and assets."
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Experienced professionals with deep industry knowledge."
    },
    {
      icon: TrendingUp,
      title: "Growth Support",
      description: "Strategic consulting to help your business scale and succeed."
    },
    {
      icon: Globe,
      title: "Compliance Ready",
      description: "Industry-specific compliance to meet regulatory requirements."
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Complete legal documentation and policy frameworks."
    },
    {
      icon: Clock,
      title: "Ongoing Support",
      description: "Continuous legal support and compliance monitoring."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/5 to-green-100/10 dark:from-background dark:via-blue-900/20 dark:to-green-800/10">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/web-building" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
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
            <Badge variant="secondary" className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Business Services
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Complete Business & Legal Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From company formation to compliance, we provide comprehensive business and legal services 
              to help your company grow and succeed. Expert guidance for every stage of your business journey.
            </p>
          </div>

          {/* Legal & Compliance Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Legal & Compliance Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive legal services to protect your business and ensure compliance with all regulations.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {legalServices.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-blue-600" />
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
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Industry-Specific Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Industry-Specific Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Specialized compliance and legal services tailored to your specific industry requirements.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {industrySpecific.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-green-600" />
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
                      <span className="text-xl font-bold text-foreground">{service.price}</span>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Consulting Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Consulting & Advisory Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Strategic consulting to help your business grow, manage risk, and achieve your goals.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {consulting.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-purple-600" />
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
                      <span className="text-xl font-bold text-foreground">{service.price}</span>
                      <Button variant="outline" size="sm">
                        Book Consultation
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
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Our Business Services?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive business and legal support to protect and grow your company.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Protect Your Business?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Let's discuss your business needs and find the right legal and consulting solutions 
                  to help your company succeed and grow.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    <Link href="/contact">Get Free Consultation</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/web-building/quote">Request Quote</Link>
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