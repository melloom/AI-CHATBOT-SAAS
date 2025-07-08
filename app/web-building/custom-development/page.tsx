"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { useToast } from "@/hooks/use-toast"

export default function CustomDevelopmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    { name: "Shopify", icon: "🛒", description: "E-commerce platforms" },
    { name: "Vue.js & Nuxt", icon: "💚", description: "Progressive JavaScript framework" },
    { name: "TypeScript", icon: "🔷", description: "Type-safe JavaScript development" },
    { name: "Tailwind CSS", icon: "🎨", description: "Utility-first CSS framework" },
    { name: "PostgreSQL", icon: "🐘", description: "Advanced open-source database" },
    { name: "MongoDB", icon: "🍃", description: "NoSQL document database" },
    { name: "Firebase", icon: "🔥", description: "Google's app development platform" },
    { name: "Docker", icon: "🐳", description: "Containerized deployment" },
    { name: "AWS & Cloud", icon: "☁️", description: "Scalable cloud infrastructure" },
    { name: "GraphQL", icon: "🔷", description: "Modern API query language" },
    { name: "REST APIs", icon: "🔗", description: "Custom API development" },
    { name: "WebSockets", icon: "⚡", description: "Real-time communication" },
    { name: "PWA Development", icon: "📱", description: "Progressive web apps" },
    { name: "JAMstack", icon: "🍓", description: "Modern web architecture" },
    { name: "Headless CMS", icon: "📄", description: "Content-first approach" },
    { name: "Microservices", icon: "🔧", description: "Scalable service architecture" }
  ]

  // Detailed service information for popups
  const serviceDetails = {
    "Custom Website Development": {
      title: "Custom Website Development",
      description: "Tailored website solutions built specifically for your business needs",
      price: "Starting from $2,500",
      duration: "4-8 weeks",
      includes: [
        "Custom website design and development",
        "Responsive design for all devices",
        "Content management system",
        "SEO optimization",
        "Performance optimization",
        "Security implementation",
        "Testing and quality assurance",
        "Deployment and launch support"
      ],
      process: [
        "Requirements gathering and planning",
        "Design and wireframing",
        "Development and coding",
        "Testing and quality assurance",
        "Deployment and launch"
      ],
      whyThisPrice: "Custom website development typically costs $5,000-15,000. Our streamlined process and modern tools allow us to deliver quality websites starting at $2,500."
    },
    "E-commerce Development": {
      title: "E-commerce Development",
      description: "Complete online store solutions with payment processing",
      price: "Starting from $8,000",
      duration: "6-12 weeks",
      includes: [
        "Custom e-commerce platform development",
        "Payment gateway integration",
        "Product catalog management",
        "Shopping cart functionality",
        "Order processing system",
        "Inventory management",
        "Customer accounts and profiles",
        "Security and PCI compliance"
      ],
      process: [
        "E-commerce requirements analysis",
        "Platform architecture design",
        "Payment system integration",
        "Development and testing",
        "Launch and training"
      ],
      whyThisPrice: "E-commerce development typically costs $15,000-50,000. Our efficient development process delivers quality solutions starting at $8,000."
    },
    "Web Application Development": {
      title: "Web Application Development",
      description: "Custom web applications and business software",
      price: "Starting from $15,000",
      duration: "8-16 weeks",
      includes: [
        "Custom web application development",
        "Database design and implementation",
        "User authentication and authorization",
        "API development and integration",
        "Real-time features and updates",
        "Advanced security features",
        "Performance optimization",
        "Scalability planning"
      ],
      process: [
        "Application architecture planning",
        "Database and API design",
        "Core functionality development",
        "Advanced features implementation",
        "Testing and deployment"
      ],
      whyThisPrice: "Custom web applications typically cost $25,000-100,000. Our efficient development methodology delivers quality applications starting at $15,000."
    },
    "API Development": {
      title: "API Development",
      description: "Custom API development and third-party integrations",
      price: "Starting from $5,000",
      duration: "3-6 weeks",
      includes: [
        "Custom API design and development",
        "Third-party service integration",
        "Authentication and security",
        "Documentation and testing",
        "Performance optimization",
        "Rate limiting and monitoring",
        "Error handling and logging",
        "API versioning and maintenance"
      ],
      process: [
        "API requirements analysis",
        "Architecture and design",
        "Development and testing",
        "Documentation and deployment"
      ],
      whyThisPrice: "API development typically costs $8,000-25,000. Our streamlined approach delivers quality APIs starting at $5,000."
    }
  }

  const handleGetQuote = (service: any) => {
    setSelectedService(service)
    setIsDialogOpen(true)
  }

  const handleContactService = () => {
    // Close the dialog
    setIsDialogOpen(false)
    // Navigate to contact page with service pre-filled
    const serviceName = selectedService?.title || 'Custom Development Service'
    const servicePrice = selectedService?.price || ''
    const queryParams = new URLSearchParams({
      service: serviceName,
      price: servicePrice,
      source: 'custom-development'
    })
    
    toast({
      title: "Redirecting to contact form",
      description: `We're taking you to the contact form to discuss ${serviceName}.`,
    })
    
    router.push(`/contact?${queryParams.toString()}`)
  }

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
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => handleGetQuote(service)}
                  >
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
            
            <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {technologies.map((tech, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-4">
                    <div className="text-3xl mb-3">{tech.icon}</div>
                    <h3 className="font-semibold text-foreground mb-2 text-sm">{tech.name}</h3>
                    <p className="text-xs text-muted-foreground">{tech.description}</p>
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

      {/* Service Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedService && serviceDetails[selectedService.title as keyof typeof serviceDetails] 
                ? serviceDetails[selectedService.title as keyof typeof serviceDetails].title 
                : "Service Details"}
            </DialogTitle>
            {selectedService && serviceDetails[selectedService.title as keyof typeof serviceDetails] && (
              <div className="flex items-center space-x-4 mt-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <selectedService.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground">
                    {serviceDetails[selectedService.title as keyof typeof serviceDetails].description}
                  </p>
                </div>
              </div>
            )}
          </DialogHeader>
          
          {selectedService && serviceDetails[selectedService.title as keyof typeof serviceDetails] && (
            <div className="space-y-6">
              {/* Pricing Information */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Price</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {serviceDetails[selectedService.title as keyof typeof serviceDetails].price}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">Duration</span>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {serviceDetails[selectedService.title as keyof typeof serviceDetails].duration}
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">What's Included</span>
                  </div>
                  <div className="text-lg font-semibold text-purple-600">
                    {serviceDetails[selectedService.title as keyof typeof serviceDetails].includes.length} Items
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>What's Included</span>
                </h3>
                <div className="grid gap-2">
                  {serviceDetails[selectedService.title as keyof typeof serviceDetails].includes.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  <span>Our Process</span>
                </h3>
                <div className="space-y-2">
                  {serviceDetails[selectedService.title as keyof typeof serviceDetails].process.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why This Price */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  <span>Why This Price?</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {serviceDetails[selectedService.title as keyof typeof serviceDetails].whyThisPrice}
                </p>
              </div>

              {/* CTA */}
              <div className="flex justify-center">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg"
                  onClick={handleContactService}
                >
                  Contact Us About This Service
                </Button>
              </div>
              
              {/* Close Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsDialogOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
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