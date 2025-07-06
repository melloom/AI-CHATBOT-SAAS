"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Code, 
  Globe, 
  Smartphone, 
  Database, 
  Palette, 
  Zap, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Star,
  Clock,
  Users,
  Shield,
  TrendingUp,
  MessageCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"
import { customDevelopmentServices } from "@/lib/pricing-config"

export default function CustomDevelopmentPage() {
  const router = useRouter()

  const services = customDevelopmentServices.map(service => ({
    icon: service.name.includes("Website") ? Globe :
          service.name.includes("Mobile") ? Smartphone :
          service.name.includes("Application") ? Database : Palette,
    title: service.name,
    description: service.description,
    features: [
      "Responsive design for all devices",
      "SEO optimization",
      "Fast loading times",
      "Custom functionality",
      "Content management system",
      "Analytics integration"
    ],
    price: service.price,
    timeline: "4-8 weeks"
  }))

  const technologies = [
    { name: "React & Next.js", icon: "⚛️", description: "Modern, fast web applications" },
    { name: "Node.js & Express", icon: "🟢", description: "Scalable backend development" },
    { name: "Python & Django", icon: "🐍", description: "Robust web frameworks" },
    { name: "PHP & Laravel", icon: "🐘", description: "Enterprise-grade applications" },
    { name: "WordPress", icon: "📝", description: "Content management systems" },
    { name: "Shopify", icon: "🛒", description: "E-commerce platforms" }
  ]

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We analyze your requirements, research your industry, and create a detailed project plan.",
      icon: MessageCircle
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description: "We create wireframes, mockups, and interactive prototypes for your approval.",
      icon: Palette
    },
    {
      step: "03",
      title: "Development",
      description: "Our developers build your solution using modern technologies and best practices.",
      icon: Code
    },
    {
      step: "04",
      title: "Testing & Quality Assurance",
      description: "We thoroughly test your application across devices and browsers.",
      icon: CheckCircle
    },
    {
      step: "05",
      title: "Deployment & Launch",
      description: "We deploy your application and provide training for your team.",
      icon: Zap
    },
    {
      step: "06",
      title: "Support & Maintenance",
      description: "We provide ongoing support, updates, and maintenance services.",
      icon: Shield
    }
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
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Custom Development
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Custom Web Development Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into powerful digital solutions. Our expert developers create 
              custom websites, applications, and platforms tailored to your specific needs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid gap-8 md:grid-cols-2 mb-20">
            {services.map((service, index) => (
              <Card key={index} className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/20 dark:from-card dark:to-blue-900/10">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting Price</p>
                      <p className="font-semibold text-foreground">{service.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Timeline</p>
                      <p className="font-semibold text-foreground">{service.timeline}</p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Get Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Technologies Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Technologies We Use</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We leverage modern technologies and frameworks to build robust, scalable solutions.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {technologies.map((tech, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">{tech.icon}</div>
                    <h3 className="font-semibold text-foreground mb-2">{tech.name}</h3>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Development Process */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Development Process</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A proven methodology that ensures quality, transparency, and successful project delivery.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {process.map((step, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Start Your Project?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Let's discuss your requirements and create a custom solution that perfectly fits your business needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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