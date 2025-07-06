"use client"

import { useState } from "react"
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

const services: Service[] = [
  {
    id: "landing-page",
    title: "Landing Page",
    description: "High-converting landing pages that drive results",
    icon: Globe,
    features: [
      "Responsive design",
      "SEO optimized",
      "Contact forms",
      "Analytics integration",
      "Fast loading",
      "Mobile-first approach"
    ],
    price: "$500 - $1,500",
    duration: "1-2 weeks"
  },
  {
    id: "ecommerce",
    title: "E-commerce Website",
    description: "Complete online stores with payment processing",
    icon: ShoppingCart,
    features: [
      "Product catalog",
      "Shopping cart",
      "Payment integration",
      "Order management",
      "Inventory tracking",
      "Customer accounts"
    ],
    price: "$2,000 - $5,000",
    duration: "3-6 weeks",
    popular: true
  },
  {
    id: "business-website",
    title: "Business Website",
    description: "Professional websites for businesses of all sizes",
    icon: Building2,
    features: [
      "Multiple pages",
      "Blog section",
      "Contact forms",
      "SEO optimization",
      "Content management",
      "Social media integration"
    ],
    price: "$1,500 - $3,500",
    duration: "2-4 weeks"
  },
  {
    id: "web-app",
    title: "Web Application",
    description: "Custom web applications with advanced functionality",
    icon: Code,
    features: [
      "Custom functionality",
      "User authentication",
      "Database integration",
      "API development",
      "Real-time features",
      "Scalable architecture"
    ],
    price: "$5,000 - $15,000",
    duration: "6-12 weeks"
  },
  {
    id: "mobile-app",
    title: "Mobile App",
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
    price: "$3,000 - $10,000",
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
    price: "$100 - $500/month",
    duration: "Ongoing"
  }
]

const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "TechCorp Solutions",
    description: "Modern business website with blog and contact forms",
    image: "/placeholder.jpg",
    category: "Business Website",
    technologies: ["React", "Next.js", "Tailwind CSS", "Vercel"],
    link: "https://techcorp.com",
    github: "https://github.com/techcorp"
  },
  {
    id: "2",
    title: "E-commerce Plus",
    description: "Full-featured online store with payment processing",
    image: "/placeholder.jpg",
    category: "E-commerce",
    technologies: ["React", "Stripe", "MongoDB", "AWS"],
    link: "https://ecommerceplus.com"
  },
  {
    id: "3",
    title: "StartupXYZ",
    description: "Landing page for startup with lead generation",
    image: "/placeholder.jpg",
    category: "Landing Page",
    technologies: ["Vue.js", "Netlify", "Mailchimp", "Google Analytics"],
    link: "https://startupxyz.com"
  },
  {
    id: "4",
    title: "HealthCare App",
    description: "Mobile app for healthcare providers",
    image: "/placeholder.jpg",
    category: "Mobile App",
    technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
    github: "https://github.com/healthcare-app"
  },
  {
    id: "5",
    title: "TaskMaster Pro",
    description: "Web application for project management",
    image: "/placeholder.jpg",
    category: "Web App",
    technologies: ["Angular", "Express.js", "PostgreSQL", "Docker"],
    link: "https://taskmasterpro.com"
  },
  {
    id: "6",
    title: "Restaurant Booking",
    description: "Online reservation system for restaurants",
    image: "/placeholder.jpg",
    category: "Web App",
    technologies: ["React", "Node.js", "MySQL", "Stripe"],
    link: "https://restaurant-booking.com"
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
            {services.map((service) => (
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    {item.link && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {item.github && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={item.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
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