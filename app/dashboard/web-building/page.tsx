"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Wrench
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { webDevelopmentPlans, webDevelopmentAddons } from "@/lib/pricing-config"

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

const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Portfolio Coming Soon",
    description: "Our portfolio is currently being updated with our latest projects. We're working on showcasing our best work to demonstrate our expertise in modern web development.",
    image: "/placeholder.jpg",
    category: "In Development",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    link: "#",
    github: "#"
  }
]

const testimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    company: "TechCorp Solutions",
    role: "CEO",
    content: "Melvin delivered an amazing website that exceeded our expectations. The design is modern, the functionality is perfect, and the results speak for themselves.",
    rating: 5,
    image: "/placeholder-user.jpg"
  },
  {
    id: "2",
    name: "Mike Chen",
    company: "E-commerce Plus",
    role: "Founder",
    content: "Working with Melvin was a game-changer for our business. Our new e-commerce site has increased sales by 300% in just 3 months.",
    rating: 5,
    image: "/placeholder-user.jpg"
  },
  {
    id: "3",
    name: "Lisa Rodriguez",
    company: "StartupXYZ",
    role: "Marketing Director",
    content: "Melvin's attention to detail and technical expertise is unmatched. Our landing page converts visitors like never before.",
    rating: 5,
    image: "/placeholder-user.jpg"
  }
]

const stats = [
  { label: "Projects Completed", value: "50+", icon: CheckCircle },
  { label: "Happy Clients", value: "30+", icon: Heart },
  { label: "Years Experience", value: "5+", icon: Award },
  { label: "Success Rate", value: "100%", icon: ThumbsUp }
]

export default function WebBuildingPage() {
  const [activeTab, setActiveTab] = useState("services")
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
        {stats.map((stat) => (
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
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
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
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{testimonial.content}</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
            </div>
            
            <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <MessageSquare className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Let's Build Something Amazing Together
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Ready to transform your online presence? Tell us about your project and we'll create a custom solution that exceeds your expectations.
                </p>
                <div className="flex justify-center mt-6 space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free consultation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>24h response</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No commitment</span>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                    <div className="flex items-center mb-8">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                        <MessageSquare className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">Project Details</h2>
                        <p className="text-gray-600 text-lg">Tell us about your vision</p>
                      </div>
                    </div>

                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                          <Input
                            value={contactForm.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                          <Input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="john@company.com"
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                          <Input
                            type="tel"
                            value={contactForm.phone || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                          <Input
                            value={contactForm.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            placeholder="Your Company Inc."
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Website Type *</label>
                        <select
                          value={contactForm.projectType}
                          onChange={(e) => handleInputChange("projectType", e.target.value)}
                          className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
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
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Design Style Preference</label>
                          <select
                            value={contactForm.designStyle || ""}
                            onChange={(e) => handleInputChange("designStyle", e.target.value)}
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
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
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Website Platform Preference</label>
                          <select
                            value={contactForm.techStack || ""}
                            onChange={(e) => handleInputChange("techStack", e.target.value)}
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Key Features Needed</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            "Contact Forms", "Blog/News", "E-commerce", "User Accounts",
                            "Payment Processing", "Booking System", "Live Chat", "Newsletter",
                            "Social Media Integration", "SEO Optimization", "Analytics", "Mobile App",
                            "Multi-language", "Content Management", "Search Function", "Gallery",
                            "Testimonials", "FAQ Section", "Portfolio", "Events Calendar"
                          ].map((feature) => (
                            <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Range *</label>
                          <select
                            value={contactForm.budget}
                            onChange={(e) => handleInputChange("budget", e.target.value)}
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
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
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Timeline *</label>
                          <select
                            value={contactForm.timeline}
                            onChange={(e) => handleInputChange("timeline", e.target.value)}
                            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Project Description *</label>
                        <Textarea
                          value={contactForm.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Tell us about your project goals, target audience, and any specific requirements..."
                          rows={6}
                          className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white/50 backdrop-blur-sm"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
                        <span className="text-sm text-gray-600">
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
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Email</p>
                          <p className="text-gray-600">melvin@webdeveloper.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Phone</p>
                          <p className="text-gray-600">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Response Time</p>
                          <p className="text-gray-600">Within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Why Choose Us */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Free consultation & quote</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">100% satisfaction guarantee</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Ongoing support & maintenance</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Mobile-first responsive design</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">SEO optimization included</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Connect With Us</h3>
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
    </div>
  )
} 