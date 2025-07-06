"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Globe, 
  Code, 
  Palette, 
  Zap, 
  Shield, 
  Smartphone,
  ArrowRight,
  Star,
  MessageCircle,
  Server,
  CreditCard,
  Settings,
  ArrowLeft,
  Check,
  Bot,
  ShoppingCart,
  Sparkles,
  Rocket,
  Target,
  TrendingUp,
  Plus,
  Users,
  Building2,
  BarChart3,
  Activity,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Lightbulb,
  Briefcase,
  Play,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { WebBuildingNavigation } from "../components/navigation"
import { ServicesSection } from "../components/services-section"
import { PricingSection } from "../components/pricing-section"
import { HostingSection } from "../components/hosting-section"
import { ChatbotSection } from "../components/chatbot-section"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QuoteWidget } from "../components/quote-widget"
import { WebVaultFooter } from "../components/footer"

export default function WebBuildingHomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState("overview")
  const [stats, setStats] = useState({ websites: 0, clients: 0, years: 0, support: 0 })
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [showQuoteWidget, setShowQuoteWidget] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    websiteType: "",
    designStyle: "",
    features: [] as string[],
    budget: "",
    timeline: "",
    techStack: "",
    message: "",
    serviceType: ""
  })

  const handleFormSubmit = (e: React.FormEvent, serviceType: string, source: string) => {
    e.preventDefault()
    
    // Create form data
    const formData = new FormData()
    formData.append('service_type', serviceType)
    formData.append('source', source)
    formData.append('name', contactForm.name)
    formData.append('email', contactForm.email)
    formData.append('company', contactForm.company)
    formData.append('website_type', contactForm.websiteType)
    formData.append('design_style', contactForm.designStyle)
    formData.append('features', contactForm.features.join(', '))
    formData.append('budget', contactForm.budget)
    formData.append('timeline', contactForm.timeline)
    formData.append('tech_stack', contactForm.techStack)
    formData.append('message', contactForm.message)
    formData.append('selected_service', contactForm.serviceType)
    
    // Submit to Formspree
    fetch('https://formspree.io/f/mgvylnze', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        alert('Thank you! Your consultation request has been submitted. We\'ll get back to you within 24 hours.')
        // Reset form
        setContactForm({
          name: "",
          email: "",
          company: "",
          websiteType: "",
          designStyle: "",
          features: [],
          budget: "",
          timeline: "",
          techStack: "",
          message: "",
          serviceType: ""
        })
      } else {
        alert('There was an error submitting your request. Please try again.')
      }
    })
    .catch(error => {
      console.error('Error:', error)
      alert('There was an error submitting your request. Please try again.')
    })
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    
    // If switching to contact section, scroll to top smoothly
    if (section === 'contact') {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }, 100) // Small delay to ensure section is rendered
    }
  }

  useEffect(() => {
    // Check for section parameter in URL
    const section = searchParams.get('section')
    if (section && ['overview', 'services', 'pricing', 'hosting', 'chatbot', 'contact'].includes(section)) {
      setActiveSection(section)
    }

    // Animate stats
    const timer = setTimeout(() => {
      setStats({ websites: 50, clients: 25, years: 3, support: 24 })
    }, 500)

    return () => clearTimeout(timer)
  }, [searchParams])

  const handleChangePreference = () => {
    // Clear the preference and redirect to selection
    localStorage.removeItem('userServicePreference')
    localStorage.removeItem('hasVisitedSelection')
    router.push('/selection')
  }

  const sections = [
    { id: "overview", label: "Overview", icon: Globe },
    { id: "services", label: "Services", icon: Settings },
    { id: "pricing", label: "Pricing", icon: CreditCard },
    { id: "hosting", label: "Hosting", icon: Server },
    { id: "chatbot", label: "ChatHub Integration", icon: Bot },
    { id: "contact", label: "Contact", icon: MessageCircle },
  ]

  const quickActions = [
    {
      title: "Book Consultation",
      description: "Schedule a free 30-minute consultation to discuss your project",
      icon: Calendar,
      gradient: "from-blue-500 to-purple-500",
      badge: "Popular",
    },
    {
      title: "Get Quote",
      description: "Get a detailed estimate for your project requirements",
      icon: CreditCard,
      gradient: "from-green-500 to-blue-500",
      badge: "New",
    },
    {
      title: "Technical Review",
      description: "Get expert advice on your existing website or project",
      icon: Lightbulb,
      gradient: "from-purple-500 to-pink-500",
      badge: "Recommended",
    },
    {
      title: "Support & Maintenance",
      description: "Ongoing support and maintenance for your website",
      icon: Settings,
      gradient: "from-orange-500 to-red-500",
      badge: null,
    },
  ]

  const recentProjects = [
    {
      icon: ShoppingCart,
      title: "E-commerce Platform",
      description: "Full-stack online store with payment integration",
      time: "2 weeks ago",
      color: "text-green-600",
      bgColor: "bg-green-100",
      status: "Completed"
    },
    {
      icon: Building2,
      title: "Corporate Website",
      description: "Modern responsive design with CMS",
      time: "1 month ago",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      status: "Live"
    },
    {
      icon: Bot,
      title: "AI ChatHub Integration",
      description: "Customer support automation system",
      time: "3 weeks ago",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      status: "In Progress"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Real-time data visualization platform",
      time: "2 months ago",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      status: "Completed"
    },
  ]

  const features = [
    {
      icon: Code,
      title: "Custom Development",
      description: "Tailored solutions built from scratch to meet your specific needs",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Palette,
      title: "Modern Design",
      description: "Beautiful, responsive designs that work on all devices",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Fast Performance",
      description: "Optimized for speed and user experience",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and 99.9% uptime guarantee",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Responsive design that looks great on all devices",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Server,
      title: "Cloud Hosting",
      description: "Scalable hosting solutions with global CDN",
      gradient: "from-red-500 to-pink-500"
    }
  ]

  const services = [
    {
      title: "E-commerce Websites",
      description: "Full-featured online stores with payment processing",
      icon: ShoppingCart,
      features: ["Payment Integration", "Inventory Management", "Order Tracking", "Customer Accounts"]
    },
    {
      title: "Corporate Websites",
      description: "Professional websites for businesses and organizations",
      icon: Building2,
      features: ["Content Management", "SEO Optimization", "Analytics Integration", "Contact Forms"]
    },
    {
      title: "Portfolio Sites",
      description: "Showcase your work with stunning portfolio websites",
      icon: Briefcase,
      features: ["Gallery Management", "Project Showcase", "Contact Integration", "Social Media"]
    },
    {
      title: "Blog & News Sites",
      description: "Content-driven websites with powerful publishing tools",
      icon: MessageCircle,
      features: ["Content Editor", "Categories & Tags", "Comment System", "Newsletter Integration"]
    }
  ]

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Hero Section with Video Background */}
            <section className="relative h-screen w-full overflow-hidden">
              {/* Video Background */}
              <div className="absolute inset-0 w-full h-full">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  onLoadedData={() => setIsVideoLoaded(true)}
                  style={{ transform: 'scaleX(-1)' }} // Flip horizontally
                >
                  <source src="/kybalion33_httpss.mj.runqlhchXcK2sM_--ar_143256_--video_1_6f5a5075-b732-45d1-959a-c54323c96849_0.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm"></div>
              </div>

              {/* Hero Content */}
              <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                  <div className="flex items-center justify-center mb-6">
                    <Badge variant="secondary" className="mr-3">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Professional Web Development
                    </Badge>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-relaxed">
                    Transform Your Vision Into
                    <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent pb-2">
                      Digital Reality
                    </span>
                  </h1>
                  
                  <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
                    We create stunning, high-performance websites that drive results. 
                    From concept to launch, we handle everything.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                      onClick={() => {
                        handleSectionChange('contact');
                        setContactForm({
                          ...contactForm,
                          serviceType: 'free_consultation'
                        });
                      }}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Free Consultation
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
                      onClick={() => setShowQuoteWidget(true)}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Get Quote
                    </Button>
                  </div>
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <ArrowRight className="w-6 h-6 text-white rotate-90" />
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white dark:bg-slate-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {stats.websites}+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">Websites Built</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {stats.clients}+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {stats.years}+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                      {stats.support}/7
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">Support Hours</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="py-16 bg-gray-50 dark:bg-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Get Started Today
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Choose the best option for your project
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickActions.map((action, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-slate-700 dark:border-slate-600">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.gradient} flex items-center justify-center`}>
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          {action.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="dark:text-white">{action.title}</CardTitle>
                        <CardDescription className="dark:text-gray-300">{action.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {action.title === "Get Quote" ? (
                          <Button 
                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                            onClick={() => setShowQuoteWidget(true)}
                          >
                            Get Quote
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        ) : (
                          <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() => {
                              handleSectionChange('contact');
                              setContactForm({
                                ...contactForm,
                                serviceType: action.title.toLowerCase().replace(' ', '_')
                              });
                            }}
                          >
                            Get Started
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-slate-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Why Choose Our Web Development Services?
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    We combine cutting-edge technology with creative design to deliver 
                    websites that not only look great but also perform exceptionally.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-slate-700 dark:border-slate-600">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-xl dark:text-white">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Projects */}
            <section className="py-16 bg-gray-50 dark:bg-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Projects
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    See what we've been working on
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentProjects.map((project, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-slate-700 dark:border-slate-600">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg ${project.bgColor} dark:bg-slate-600 flex items-center justify-center`}>
                            <project.icon className={`w-6 h-6 ${project.color} dark:text-white`} />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg dark:text-white">{project.title}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>{project.time}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )
      case "services":
        return <ServicesSection setActiveSection={handleSectionChange} />
      case "pricing":
        return <PricingSection setActiveSection={handleSectionChange} />
      case "hosting":
        return <HostingSection setActiveSection={handleSectionChange} />
      case "chatbot":
        return <ChatbotSection setActiveSection={handleSectionChange} />
      case "contact":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Ready to start your project? Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card className="dark:bg-slate-700 dark:border-slate-600">
                <CardHeader>
                  <CardTitle className="dark:text-white">Project Consultation</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Tell us about your project requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleFormSubmit(e, "consultation", "contact_form")} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="dark:text-gray-300">Name *</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          required
                          className="dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="dark:text-gray-300">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          required
                          className="dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company" className="dark:text-gray-300">Company</Label>
                      <Input
                        id="company"
                        value={contactForm.company}
                        onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                        className="dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="websiteType" className="dark:text-gray-300">Website Type</Label>
                        <Select value={contactForm.websiteType} onValueChange={(value) => setContactForm({...contactForm, websiteType: value})}>
                          <SelectTrigger className="dark:bg-slate-800 dark:border-slate-600 dark:text-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-slate-800 dark:border-slate-600">
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="portfolio">Portfolio</SelectItem>
                            <SelectItem value="blog">Blog/News</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="budget" className="dark:text-gray-300">Budget Range</Label>
                        <Select value={contactForm.budget} onValueChange={(value) => setContactForm({...contactForm, budget: value})}>
                          <SelectTrigger className="dark:bg-slate-800 dark:border-slate-600 dark:text-white">
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                                                  <SelectContent className="dark:bg-slate-800 dark:border-slate-600">
                          <SelectItem value="100-1k">$100 - $1,000</SelectItem>
                          <SelectItem value="1k-3k">$1,000 - $3,000</SelectItem>
                          <SelectItem value="3k-8k">$3,000 - $8,000</SelectItem>
                          <SelectItem value="8k-15k">$8,000 - $15,000</SelectItem>
                          <SelectItem value="15k+">$15,000+</SelectItem>
                        </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="dark:text-gray-300">Project Details</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                        rows={4}
                        className="dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Send Message
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card className="dark:bg-slate-700 dark:border-slate-600">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div 
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText('melvin.a.p.cruz@gmail.com');
                        // You can add a toast notification here
                      }}
                      title="Click to copy email"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium dark:text-white">Email</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">melvin.a.p.cruz@gmail.com</div>
                      </div>
                      <div className="text-xs text-gray-400">Click to copy</div>
                    </div>
                    <div 
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                      onClick={() => {
                        window.open('tel:+16672009784');
                      }}
                      title="Click to call"
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium dark:text-white">Phone</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">+1 (667) 200-9784</div>
                      </div>
                      <div className="text-xs text-gray-400">Click to call</div>
                    </div>
                    <div 
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText('Maryland');
                        // You can add a toast notification here
                      }}
                      title="Click to copy location"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium dark:text-white">Location</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Maryland</div>
                      </div>
                      <div className="text-xs text-gray-400">Click to copy</div>
                    </div>
                    <div 
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                      onClick={() => {
                        window.open('https://melvinworks.netlify.app', '_blank');
                      }}
                      title="Click to visit portfolio"
                    >
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium dark:text-white">Portfolio</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">melvinworks.bio</div>
                      </div>
                      <div className="text-xs text-gray-400">Click to visit</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:bg-slate-700 dark:border-slate-600">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Within 24 hours</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      We typically respond to all inquiries within 24 hours during business days.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <WebBuildingNavigation activeSection={activeSection} setActiveSection={handleSectionChange} />
      
      {/* Change Preference Button */}
      <div className="fixed top-20 right-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={handleChangePreference}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 shadow-lg"
        >
          <Settings className="w-4 h-4 mr-2" />
          Change Service
        </Button>
      </div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSection()}
      </main>

      {/* Floating Quote Widget */}
      {showQuoteWidget && (
        <QuoteWidget 
          isOpen={showQuoteWidget}
          onClose={() => setShowQuoteWidget(false)}
          onQuoteSubmit={(data) => {
            console.log('Quote submitted:', data)
            // Don't close the widget - let it stay open to show the quote
            // setShowQuoteWidget(false) - REMOVED THIS LINE
            
            // Handle different actions
            if (data.action === 'get_quote') {
              // Handle quote submission
              console.log('Getting detailed quote:', data)
              // You can add form submission logic here
            } else if (data.action === 'book_consultation') {
                          // Handle consultation booking
            console.log('Booking consultation:', data)
            // Scroll to contact section
            handleSectionChange('contact')
            // Pre-fill form with quote data
            setContactForm({
              ...contactForm,
              serviceType: 'quote_consultation',
              message: `Quote Request: ${data.quote.totalPrice.toLocaleString()} for ${data.websiteType || 'website'} project. Features: ${data.features.join(', ')}. Timeline: ${data.timeline}.`
            })
            }
          }}
        />
      )}

      {/* Footer */}
      <WebVaultFooter />
    </div>
  )
} 