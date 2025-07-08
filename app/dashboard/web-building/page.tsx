"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Globe, 
  Code, 
  Smartphone, 
  Palette, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  CheckCircle,
  Star,
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  MessageSquare,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Lightbulb,
  Rocket,
  Target,
  Eye,
  Heart,
  ThumbsUp,
  ShoppingCart,
  Building2,
  Wrench,
  XCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { webDevelopmentPlans, webDevelopmentAddons } from "@/lib/pricing-config"
import { useWebVaultStats } from "@/hooks/use-webvault"

interface Service {
  id: string
  title: string
  description: string
  icon: any
  features: string[]
  price: string
  duration: string
  popular?: boolean
}

interface PortfolioItem {
  id: string
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  link?: string
  github?: string
}

interface Testimonial {
  id: string
  name: string
  company: string
  role: string
  content: string
  rating: number
  image: string
}

const services: Service[] = webDevelopmentPlans.map(plan => ({
  id: plan.name.toLowerCase().replace(/\s+/g, '-'),
  title: plan.name,
  description: plan.description,
  icon: plan.name.includes("Basic") ? Globe : 
        plan.name.includes("Professional") ? Star :
        plan.name.includes("E-commerce") ? ShoppingCart : 
        plan.name.includes("Enterprise") ? Code : Building2,
  features: plan.features,
  price: plan.price,
  duration: plan.timeline || "Varies",
  popular: plan.popular
}))

// Add additional services from addons
const additionalServices: Service[] = [
  {
    id: "mobile-app",
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications",
    icon: Smartphone,
    features: [
      "iOS & Android",
      "Cross-platform",
      "Push notifications",
      "Offline functionality",
      "App store submission",
      "Maintenance support"
    ],
    price: "$8,000+",
    duration: "8-16 weeks"
  },
  {
    id: "maintenance",
    title: "Website Maintenance",
    description: "Ongoing support and updates for your website",
    icon: Wrench,
    features: [
      "Regular updates",
      "Security monitoring",
      "Performance optimization",
      "Content updates",
      "Backup management",
      "24/7 support"
    ],
    price: "$50/month",
    duration: "Ongoing"
  }
]

// WebVault Services for the modal
const webvaultServices: Service[] = [
  {
    id: "web-development",
    title: "Web Development",
    description: "Custom websites and web applications",
    icon: Code,
    features: [
      "Responsive Design",
      "Modern Frameworks",
      "SEO Optimization",
      "Performance Focused"
    ],
    price: "$2,500",
    duration: "4-8 weeks"
  },
  {
    id: "ecommerce-solutions",
    title: "E-commerce Solutions",
    description: "Online stores and marketplaces",
    icon: ShoppingCart,
    features: [
      "Payment Integration",
      "Inventory Management",
      "Order Processing",
      "Analytics Dashboard"
    ],
    price: "$5,000",
    duration: "6-12 weeks"
  },
  {
    id: "mobile-apps",
    title: "Mobile Apps",
    description: "iOS and Android applications",
    icon: Smartphone,
    features: [
      "Cross-platform",
      "Native Performance",
      "Push Notifications",
      "App Store Ready"
    ],
    price: "$8,000",
    duration: "8-16 weeks"
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description: "User-centered design solutions",
    icon: Palette,
    features: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Design Systems"
    ],
    price: "$1,500",
    duration: "2-4 weeks"
  },
  {
    id: "maintenance",
    title: "Maintenance",
    description: "Ongoing support and updates",
    icon: Wrench,
    features: [
      "24/7 Monitoring",
      "Security Updates",
      "Performance Optimization",
      "Content Updates"
    ],
    price: "$50/month",
    duration: "Ongoing"
  },
  {
    id: "consulting",
    title: "Consulting",
    description: "Strategic technology guidance",
    icon: Lightbulb,
    features: [
      "Technology Strategy",
      "Architecture Review",
      "Performance Audit",
      "Security Assessment"
    ],
    price: "$150/hr",
    duration: "As needed"
  }
]

const portfolioItems: PortfolioItem[] = []

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    company: "TechStart Inc.",
    role: "CEO & Founder",
    content: "WebVault transformed our business with their exceptional web development services. The team delivered our e-commerce platform ahead of schedule and exceeded all our expectations. The attention to detail and ongoing support has been outstanding.",
    rating: 5,
    image: "/placeholder-user.jpg"
  },
  {
    id: "2",
    name: "Michael Chen",
    company: "Digital Solutions",
    role: "Marketing Director",
    content: "Working with WebVault was a game-changer for our company. They built us a modern, fast, and user-friendly website that perfectly represents our brand. The mobile responsiveness and SEO optimization have significantly improved our online presence.",
    rating: 5,
    image: "/placeholder-user.jpg"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    company: "Creative Agency",
    role: "Creative Director",
    content: "WebVault's UI/UX design services are exceptional. They understood our vision perfectly and created a stunning, intuitive interface that our clients love. The design system they implemented has made our workflow so much more efficient.",
    rating: 5,
    image: "/placeholder-user.jpg"
  },
  {
    id: "4",
    name: "David Thompson",
    company: "StartupXYZ",
    role: "CTO",
    content: "The mobile app development service from WebVault exceeded our expectations. They delivered a cross-platform app that works flawlessly on both iOS and Android. The performance optimization and user experience are top-notch.",
    rating: 5,
    image: "/placeholder-user.jpg"
  },
  {
    id: "5",
    name: "Lisa Wang",
    company: "E-commerce Pro",
    role: "Operations Manager",
    content: "WebVault's maintenance service has been invaluable for our online store. Their 24/7 monitoring, regular updates, and quick response times ensure our website is always running smoothly. Highly recommended!",
    rating: 5,
    image: "/placeholder-user.jpg"
  },
  {
    id: "6",
    name: "James Wilson",
    company: "Consulting Firm",
    role: "Managing Partner",
    content: "The consulting services from WebVault helped us make informed decisions about our digital strategy. Their expertise in modern web technologies and best practices guided us to the right solutions for our business needs.",
    rating: 5,
    image: "/placeholder-user.jpg"
  }
]

// Stats will be fetched from API using useWebVaultStats hook

export default function WebBuildingPage() {
  const [activeTab, setActiveTab] = useState("services")
  const [showServiceRequestModal, setShowServiceRequestModal] = useState(false)
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [serviceRequestForm, setServiceRequestForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    serviceType: "",
    projectDescription: "",
    budget: "",
    timeline: "",
    additionalRequirements: ""
  })
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: "",
    phone: "",
    designStyle: "",
    techStack: ""
  })
  const { toast } = useToast()
  const { stats, loading: statsLoading, error: statsError } = useWebVaultStats()

  // Create stats array from API data
  const dashboardStats = stats ? [
    { label: "Projects Completed", value: stats.projectsCompleted.toString(), icon: CheckCircle },
    { label: "Happy Clients", value: stats.happyClients.toString(), icon: Heart },
    { label: "Years Experience", value: stats.yearsExperience.toString(), icon: Award },
    { label: "Success Rate", value: `${stats.successRate}%`, icon: ThumbsUp }
  ] : []

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // TODO: Implement contact form submission
    console.log("Contact form submitted:", contactForm)
    
    toast({
      title: "Message Sent!",
      description: "Thank you for your inquiry. I'll get back to you within 24 hours.",
    })
    
    // Reset form
    setContactForm({
      name: "",
      email: "",
      company: "",
      projectType: "",
      budget: "",
      timeline: "",
      description: "",
      phone: "",
      designStyle: "",
      techStack: ""
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceRequest = (service: Service) => {
    setSelectedService(service)
    setServiceRequestForm(prev => ({
      ...prev,
      serviceType: service.title
    }))
    setShowServiceRequestModal(true)
  }

  const handleLearnMore = (service: Service) => {
    setSelectedService(service)
    setShowLearnMoreModal(true)
  }

  const handleServiceRequestInputChange = (field: string, value: string) => {
    setServiceRequestForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/website-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: `${selectedService?.title} - ${serviceRequestForm.name}`,
          description: serviceRequestForm.projectDescription,
          businessType: serviceRequestForm.serviceType,
          targetAudience: "Web Development",
          features: [selectedService?.title || "Web Development"],
          timeline: serviceRequestForm.timeline,
          budget: serviceRequestForm.budget,
          contactEmail: serviceRequestForm.email,
          phoneNumber: serviceRequestForm.phone,
          additionalNotes: serviceRequestForm.additionalRequirements,
          projectType: serviceRequestForm.serviceType,
          priority: "medium",
          status: "pending"
        })
      })

      if (response.ok) {
        toast({
          title: "Service Request Submitted!",
          description: "Your request has been sent successfully. We'll get back to you within 24 hours.",
        })
        
        // Reset form
        setServiceRequestForm({
          name: "",
          email: "",
          company: "",
          phone: "",
          serviceType: "",
          projectDescription: "",
          budget: "",
          timeline: "",
          additionalRequirements: ""
        })
        setShowServiceRequestModal(false)
        setSelectedService(null)
      } else {
        throw new Error('Failed to submit request')
      }
    } catch (error) {
      console.error('Error submitting service request:', error)
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Globe className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">WebVault Services</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Professional web development services to bring your ideas to life
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>100% Satisfaction Guaranteed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Fast Turnaround Times</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Code className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {statsLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
              <CardContent className="relative flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-blue-200 rounded animate-pulse"></div>
                  <div className="h-8 w-16 bg-blue-200 rounded animate-pulse"></div>
                </div>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <div className="h-4 w-4 bg-white rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : statsError ? (
          // Error state
          <div className="col-span-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">Failed to load stats: {statsError}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Real stats
          dashboardStats.map((stat) => (
            <Card key={stat.label} className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
              <CardContent className="relative flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                <div>
                  <p className="text-sm font-medium text-blue-800">{stat.label}</p>
                  <p className="text-2xl font-bold text-blue-900">{stat.value}</p>
                </div>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="webvault-services">WebVault Services</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...services, ...additionalServices].map((service) => (
              <Card key={service.id} className={`relative overflow-hidden ${service.popular ? 'ring-2 ring-purple-500' : ''}`}>
                {service.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <service.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Price:</span>
                      <span className="text-lg font-bold text-purple-600">{service.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Duration:</span>
                      <span className="text-sm text-gray-600">{service.duration}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Features:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full" variant={service.popular ? "default" : "outline"}>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webvault-services" className="space-y-6">
          {/* WebVault Services Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              WebVault Professional Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional web development services to bring your ideas to life. 
              From concept to deployment, we handle every aspect of your digital presence.
            </p>
          </div>

          {/* Service Categories */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {webvaultServices.map((service) => (
              <Card key={service.id} className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <CardHeader className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <service.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Starting from</span>
                      <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleLearnMore(service)}
                      >
                        Learn More
                        <Eye className="ml-2 h-4 w-4" />
                      </Button>
                      <Button 
                        className="w-full" 
                        onClick={() => handleServiceRequest(service)}
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Process Section */}
          <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-2xl p-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Development Process</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We follow a proven methodology to ensure your project is delivered on time, within budget, and exceeds expectations.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Discovery</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Understanding your goals, requirements, and target audience
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Planning</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Creating detailed project roadmap and technical specifications
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Development</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Building your solution with modern technologies and best practices
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Launch</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Deploying and maintaining your solution for long-term success
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h3>
              <p className="text-xl mb-6 opacity-90">
                Let's discuss your vision and create something amazing together
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Get Free Quote
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Phone className="mr-2 h-5 w-5" />
                  Schedule Call
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          {/* Main Coming Soon Section */}
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              {/* Large Icon */}
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Clock className="w-12 h-12 text-white" />
              </div>
              
              {/* Title */}
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Portfolio Coming Soon
              </h2>
              
              {/* Description */}
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                We're currently updating our portfolio with our latest projects and case studies. 
                Our team is working hard to showcase our best work and demonstrate our expertise 
                in modern web development.
              </p>
              
              {/* Status Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 px-6 py-3 rounded-full font-medium mb-8">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>In Development</span>
              </div>
              
              {/* Technologies Preview */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Technologies We Work With
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "PostgreSQL", "Docker"].map((tech) => (
                    <Badge key={tech} variant="outline" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Contact CTA */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to Start Your Project?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Don't wait for our portfolio to be ready. Let's discuss your project and see how we can help bring your vision to life.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" asChild>
                  <Link href="/contact">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Get in Touch
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Expertise Section */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Expertise</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We specialize in modern web development with a focus on performance, user experience, and scalable solutions.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Modern Frameworks</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">React, Next.js, Vue.js</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">UI/UX Design</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Responsive, Accessible</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Fast, Optimized</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Security</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Best Practices</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about their experience with WebVault.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">Client Satisfaction</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">5.0</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="relative hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 text-blue-200">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">({testimonial.rating}.0)</span>
                  </div>
                  
                  {/* Content */}
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{testimonial.role}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Join Our Happy Clients?</h3>
              <p className="text-lg mb-6 opacity-90">
                Let's create something amazing together and add your success story to our testimonials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Start Your Project
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Phone className="mr-2 h-5 w-5" />
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
            </div>
            
            <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <MessageSquare className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Let's Build Something Amazing Together
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Ready to transform your online presence? Tell us about your project and we'll create a custom solution that exceeds your expectations.
                </p>
                <div className="flex justify-center mt-6 space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free consultation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>24h response</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No commitment</span>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
                    <div className="flex items-center mb-8">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                        <MessageSquare className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Project Details</h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">Tell us about your vision</p>
                      </div>
                    </div>

                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                          <Input
                            value={contactForm.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                          <Input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="john@company.com"
                            className="w-full px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                          <Input
                            type="tel"
                            value={contactForm.phone || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                          <Input
                            value={contactForm.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            placeholder="Your Company Inc."
                            className="w-full px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Website Type *</label>
                        <select
                          value={contactForm.projectType}
                          onChange={(e) => handleInputChange("projectType", e.target.value)}
                          className="w-full px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                          required
                        >
                          <option value="">Select website type</option>
                          <option value="business">Business Website</option>
                          <option value="ecommerce">E-commerce Store</option>
                          <option value="portfolio">Portfolio/Personal</option>
                          <option value="blog">Blog/Content Site</option>
                          <option value="landing">Landing Page</option>
                          <option value="saas">SaaS Application</option>
                          <option value="nonprofit">Non-profit Organization</option>
                          <option value="restaurant">Restaurant/Food Service</option>
                          <option value="realestate">Real Estate</option>
                          <option value="healthcare">Healthcare/Medical</option>
                          <option value="education">Education/Training</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Design Style Preference</label>
                          <select
                            value={contactForm.designStyle || ""}
                            onChange={(e) => handleInputChange("designStyle", e.target.value)}
                            className="w-full px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                          >
                            <option value="">Select design style</option>
                            <option value="modern">Modern & Clean</option>
                            <option value="minimalist">Minimalist</option>
                            <option value="bold">Bold & Colorful</option>
                            <option value="elegant">Elegant & Sophisticated</option>
                            <option value="playful">Playful & Creative</option>
                            <option value="corporate">Corporate & Professional</option>
                            <option value="vintage">Vintage/Retro</option>
                            <option value="tech">Tech/Sci-fi</option>
                            <option value="nature">Nature/Organic</option>
                            <option value="luxury">Luxury/Premium</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Website Platform Preference</label>
                          <select
                            value={contactForm.techStack || ""}
                            onChange={(e) => handleInputChange("techStack", e.target.value)}
                            className="w-full px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                          >
                            <option value="">Select platform</option>
                            <option value="wordpress">WordPress (Easy to manage)</option>
                            <option value="shopify">Shopify (E-commerce focused)</option>
                            <option value="wix">Wix (Drag & drop builder)</option>
                            <option value="squarespace">Squarespace (Design-focused)</option>
                            <option value="webflow">Webflow (Advanced design)</option>
                            <option value="custom">Custom Development</option>
                            <option value="react">React/Next.js (Modern web app)</option>
                            <option value="other">Other/Not sure</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Features Needed</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            "Contact Forms", "Blog/News", "E-commerce", "User Accounts",
                            "Payment Processing", "Booking System", "Live Chat", "Newsletter",
                            "Social Media Integration", "SEO Optimization", "Analytics", "Mobile App",
                            "Multi-language", "Content Management", "Search Function", "Gallery",
                            "Testimonials", "FAQ Section", "Portfolio", "Events Calendar"
                          ].map((feature) => (
                            <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                              <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Budget Range *</label>
                          <select
                            value={contactForm.budget}
                            onChange={(e) => handleInputChange("budget", e.target.value)}
                            className="w-full px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                            required
                          >
                            <option value="">Select budget range</option>
                            <option value="under-1000">Under $1,000</option>
                            <option value="1000-3000">$1,000 - $3,000</option>
                            <option value="3000-5000">$3,000 - $5,000</option>
                            <option value="5000-10000">$5,000 - $10,000</option>
                            <option value="10000-25000">$10,000 - $25,000</option>
                            <option value="25000-50000">$25,000 - $50,000</option>
                            <option value="over-50000">Over $50,000</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Timeline *</label>
                          <select
                            value={contactForm.timeline}
                            onChange={(e) => handleInputChange("timeline", e.target.value)}
                            className="w-full px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                            required
                          >
                            <option value="">Select timeline</option>
                            <option value="asap">ASAP (1-2 weeks)</option>
                            <option value="1month">1 month</option>
                            <option value="2months">2 months</option>
                            <option value="3months">3 months</option>
                            <option value="6months">6 months</option>
                            <option value="flexible">Flexible</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Project Description *</label>
                        <Textarea
                          value={contactForm.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Tell us about your project goals, target audience, and any specific requirements..."
                          rows={6}
                          className="w-full px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700" required />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and 
                          <a href="/privacy" className="text-blue-600 hover:underline"> Privacy Policy</a>
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-5 px-8 rounded-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl text-lg"
                      >
                        <Send className="mr-2 h-5 w-5 inline" />
                        Send Project Request
                      </button>
                    </form>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                          <p className="text-gray-600 dark:text-gray-300">melvin@webdeveloper.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
                          <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Response Time</p>
                          <p className="text-gray-600 dark:text-gray-300">Within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Why Choose Us */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Us?</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700 dark:text-gray-300">Free consultation & quote</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700 dark:text-gray-300">100% satisfaction guarantee</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700 dark:text-gray-300">Ongoing support & maintenance</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700 dark:text-gray-300">Mobile-first responsive design</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700 dark:text-gray-300">SEO optimization included</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Connect With Us</h3>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl">
                        <Github className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl">
                        <Linkedin className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl">
                        <Twitter className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl">
                        <Instagram className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Service Request Modal */}
      <Dialog open={showServiceRequestModal} onOpenChange={setShowServiceRequestModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-blue-600" />
              <span>Request {selectedService?.title}</span>
            </DialogTitle>
            <DialogDescription>
              Tell us about your project and we'll get back to you within 24 hours with a custom quote.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleServiceRequestSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={serviceRequestForm.name}
                  onChange={(e) => handleServiceRequestInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={serviceRequestForm.email}
                  onChange={(e) => handleServiceRequestInputChange("email", e.target.value)}
                  placeholder="john@company.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={serviceRequestForm.company}
                  onChange={(e) => handleServiceRequestInputChange("company", e.target.value)}
                  placeholder="Your Company Inc."
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={serviceRequestForm.phone}
                  onChange={(e) => handleServiceRequestInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="serviceType">Service Type *</Label>
              <Input
                id="serviceType"
                value={serviceRequestForm.serviceType}
                onChange={(e) => handleServiceRequestInputChange("serviceType", e.target.value)}
                placeholder="Selected service"
                required
                readOnly
              />
            </div>

            <div>
              <Label htmlFor="projectDescription">Project Description *</Label>
              <Textarea
                id="projectDescription"
                value={serviceRequestForm.projectDescription}
                onChange={(e) => handleServiceRequestInputChange("projectDescription", e.target.value)}
                placeholder="Describe your project goals, requirements, and any specific features you need..."
                rows={4}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget Range *</Label>
                <Select value={serviceRequestForm.budget} onValueChange={(value) => handleServiceRequestInputChange("budget", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1000">Under $1,000</SelectItem>
                    <SelectItem value="1000-3000">$1,000 - $3,000</SelectItem>
                    <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
                    <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                    <SelectItem value="over-50000">Over $50,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeline">Timeline *</Label>
                <Select value={serviceRequestForm.timeline} onValueChange={(value) => handleServiceRequestInputChange("timeline", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP (1-2 weeks)</SelectItem>
                    <SelectItem value="1month">1 month</SelectItem>
                    <SelectItem value="2months">2 months</SelectItem>
                    <SelectItem value="3months">3 months</SelectItem>
                    <SelectItem value="6months">6 months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="additionalRequirements">Additional Requirements</Label>
              <Textarea
                id="additionalRequirements"
                value={serviceRequestForm.additionalRequirements}
                onChange={(e) => handleServiceRequestInputChange("additionalRequirements", e.target.value)}
                placeholder="Any additional requirements, preferences, or questions..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowServiceRequestModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Learn More Modal */}
      <Dialog open={showLearnMoreModal} onOpenChange={setShowLearnMoreModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {selectedService && <selectedService.icon className="h-6 w-6 text-blue-600" />}
              </div>
              <span className="text-2xl font-bold">{selectedService?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-lg">
              {selectedService?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {/* Service Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Rocket className="h-5 w-5 text-blue-600" />
                <span>Service Overview</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's Included</h4>
                  <ul className="space-y-2">
                    {selectedService?.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Service Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedService?.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Starting Price:</span>
                      <span className="font-bold text-blue-600">{selectedService?.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-medium">Professional & On-time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span>Our Process</span>
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Discovery</h4>
                  <p className="text-xs text-gray-600">Understanding your needs and requirements</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Planning</h4>
                  <p className="text-xs text-gray-600">Creating detailed project roadmap</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Development</h4>
                  <p className="text-xs text-gray-600">Building your solution</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Launch</h4>
                  <p className="text-xs text-gray-600">Deploying and maintaining</p>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <span>Why Choose WebVault</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">100% Satisfaction Guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Fast Turnaround Times</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Professional Quality</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Ongoing Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Modern Technologies</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Transparent Communication</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies & Tools */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Code className="h-5 w-5 text-purple-600" />
                <span>Technologies & Tools</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "PostgreSQL", "Docker"].map((tech) => (
                  <Badge key={tech} variant="outline" className="text-center py-2">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-4">
                Let's discuss your project and create something amazing together
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="secondary" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => {
                    setShowLearnMoreModal(false)
                    handleServiceRequest(selectedService!)
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Request Quote
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={() => setShowLearnMoreModal(false)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 