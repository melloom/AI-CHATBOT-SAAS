"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Shield,
  FileText,
  Cookie,
  Heart,
  ArrowUp,
  Code,
  CreditCard,
  Server,
  Bot,
  Calculator,
  Users,
  MessageCircle,
  FileText as FileTextIcon,
  Briefcase,
  Palette,
  Info,
  Clock,
  Building2,
  Smartphone
} from "lucide-react"
import { useState } from "react"
import { QuoteWidget } from "./quote-widget"

export function WebVaultFooter() {
  const [currentYear] = useState(new Date().getFullYear())
  const [activeDialog, setActiveDialog] = useState<string | null>(null)
  const [isQuoteWidgetOpen, setIsQuoteWidgetOpen] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEmailClick = () => {
    navigator.clipboard.writeText('melvin.a.p.cruz@gmail.com')
    // You can add a toast notification here
  }

  const handlePhoneClick = () => {
    window.open('tel:+16672009784')
  }

  const handlePortfolioClick = () => {
    window.open('https://melvinworks.netlify.app', '_blank')
  }

  const openDialog = (dialogName: string) => {
    setActiveDialog(dialogName)
  }

  const closeDialog = () => {
    setActiveDialog(null)
  }

  const serviceDialogs = {
    'custom-development': {
      title: "Custom Development",
      icon: Code,
      description: "Tailored web solutions built specifically for your business needs",
      features: [
        "Custom website design and development",
        "E-commerce solutions",
        "Web application development",
        "API integration and development",
        "Database design and implementation",
        "Responsive design for all devices"
      ],
      pricing: "Starting from $2,500",
      timeline: "4-8 weeks depending on complexity"
    },
    'business-services': {
      title: "Business & Legal Services",
      icon: Building2,
      description: "Complete business and legal services for company formation and compliance",
      features: [
        "Company formation and legal setup",
        "Business plan development",
        "Legal document templates",
        "Compliance and regulatory services",
        "Intellectual property protection",
        "Industry-specific legal services"
      ],
      pricing: "Starting from $300",
      timeline: "1-4 weeks depending on service"
    },
    'pricing-plans': {
      title: "Pricing Plans",
      icon: CreditCard,
      description: "Flexible pricing options to fit your budget and requirements",
      features: [
        "Basic Website Package - $2,500",
        "Professional Website Package - $5,000",
        "E-commerce Website Package - $8,000",
        "Custom Enterprise Solutions - $15,000+",
        "Monthly maintenance plans available",
        "Hosting and domain included"
      ],
      pricing: "Flexible pricing based on needs",
      timeline: "Project-based pricing"
    },
    'hosting-maintenance': {
      title: "Hosting & Maintenance",
      icon: Server,
      description: "Reliable hosting and ongoing maintenance to keep your website running smoothly",
      features: [
        "Secure cloud hosting",
        "24/7 uptime monitoring",
        "Regular security updates",
        "Performance optimization",
        "Backup and recovery",
        "Technical support included"
      ],
      pricing: "Starting from $50/month",
      timeline: "Ongoing service"
    },
    'chathub-integration': {
      title: "ChatHub Integration",
      icon: Bot,
      description: "Integrate intelligent AI chatbots into your website for better customer engagement",
      features: [
        "AI-powered customer support",
        "Multi-platform integration",
        "Custom chatbot training",
        "Analytics and reporting",
        "24/7 automated responses",
        "Human handoff capabilities"
      ],
      pricing: "Starting from $200/month",
      timeline: "2-4 weeks implementation"
    },
    'get-quote': {
      title: "Get Quote",
      icon: Calculator,
      description: "Get a detailed estimate for your project with our comprehensive quote system",
      features: [
        "Free consultation call",
        "Detailed project analysis",
        "Custom pricing breakdown",
        "Timeline estimation",
        "Feature recommendations",
        "No obligation quote"
      ],
      pricing: "Free consultation",
      timeline: "24-hour response time"
    }
  }

  const companyDialogs = {
    'about-us': {
      title: "About WebVault",
      icon: Users,
      description: "Professional web development services focused on creating exceptional digital experiences",
      features: [
        "Founded by experienced developers with 10+ years in web development",
        "Specialized in modern web technologies (React, Next.js, Node.js)",
        "Client-focused approach with personalized solutions",
        "Quality-driven development process with rigorous testing",
        "Ongoing support and maintenance for all projects",
        "Transparent communication throughout the entire process",
        "Mobile-first responsive design approach",
        "SEO-optimized websites for better visibility",
        "E-commerce and business solutions expertise",
        "24/7 technical support and monitoring"
      ],
      pricing: "N/A",
      timeline: "Established 2024"
    },
    'contact': {
      title: "Contact Information",
      icon: MessageCircle,
      description: "Get in touch with us for your web development needs",
      features: [
        "Email: melvin.a.p.cruz@gmail.com",
        "Phone: +1 (667) 200-9784",
        "Location: Maryland, USA",
        "Portfolio: melvinworks.bio",
        "Response time: Within 24 hours",
        "Free consultation available"
      ],
      pricing: "Free initial consultation",
      timeline: "24-hour response"
    },
    'careers': {
      title: "Join Our Team",
      icon: Briefcase,
      description: "Exciting opportunities to work on cutting-edge web development projects",
      features: [
        "Remote work opportunities",
        "Flexible working hours",
        "Professional development",
        "Competitive compensation",
        "Modern tech stack",
        "Collaborative environment"
      ],
      pricing: "Competitive salaries",
      timeline: "Ongoing recruitment"
    }
  }

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">WebVault</h3>
                <p className="text-sm text-gray-400">Professional Web Solutions</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              WebVault is a leading web development company specializing in creating exceptional digital experiences. We combine cutting-edge technology with innovative design to deliver websites that drive business growth and enhance user engagement.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>10+ Years Experience</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>100+ Projects</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/web-building/custom-development" className="hover:text-white transition-colors">
                  Custom Development
                </Link>
              </li>
              <li>
                <Link href="/web-building/pricing-plans" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/web-building/hosting-maintenance" className="hover:text-white transition-colors">
                  Hosting & Maintenance
                </Link>
              </li>
              <li>
                <Link href="/web-building/chathub-integration" className="hover:text-white transition-colors">
                  ChatHub Integration
                </Link>
              </li>
              <li>
                <Link href="/web-building/business-services" className="hover:text-white transition-colors">
                  Business Services
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => setIsQuoteWidgetOpen(true)}
                  className="hover:text-white transition-colors text-left w-full"
                >
                  Get Quote
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button 
                  onClick={() => openDialog('about-us')}
                  className="hover:text-white transition-colors text-left w-full"
                >
                  About Us
                </button>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/web-building/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="https://wiredliving.blog" target="_blank" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact?subject=career-opportunity" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="https://melvinworks.bio" target="_blank" className="hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors"
                onClick={handleEmailClick}
                title="Click to copy email"
              >
                <Mail className="w-4 h-4" />
                <span>melvin.a.p.cruz@gmail.com</span>
              </div>
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors"
                onClick={handlePhoneClick}
                title="Click to call"
              >
                <Phone className="w-4 h-4" />
                <span>+1 (667) 200-9784</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Maryland, USA</span>
              </div>
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors"
                onClick={handlePortfolioClick}
                title="Click to visit portfolio"
              >
                <ExternalLink className="w-4 h-4" />
                <span>melvinworks.bio</span>
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Expertise</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span>React & Next.js</span>
              </div>
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>UI/UX Design</span>
              </div>
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-green-400" />
                <span>Backend Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-pink-400" />
                <span>AI Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-orange-400" />
                <span>Mobile-First Design</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-400" />
                <span>Security & SEO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Ready to Start Your Project?</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Let's discuss your vision and create something amazing together. Get a free consultation and quote today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setIsQuoteWidgetOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              >
                Get Free Quote
              </Button>
              <Button 
                variant="outline" 
                onClick={() => openDialog('about-us')}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="text-gray-400 hover:text-white"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>© {currentYear} WebVault. All rights reserved.</span>
              <span>•</span>
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by Melvin Cruz</span>
              <span>•</span>
              <span>Maryland, USA</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Privacy Policy</span>
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Terms of Service</span>
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1">
                <Cookie className="w-4 h-4" />
                <span>Cookie Policy</span>
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Service Dialogs */}
      {Object.entries(serviceDialogs).map(([key, dialog]) => (
        <Dialog key={key} open={activeDialog === key} onOpenChange={closeDialog}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden">
            <div className="relative">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <dialog.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white">{dialog.title}</DialogTitle>
                    <p className="text-blue-100 mt-1">{dialog.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-3"></div>
                    Features & Services
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dialog.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                      Pricing
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{dialog.pricing}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-green-600" />
                      Timeline
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{dialog.timeline}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={closeDialog} className="border-gray-300 hover:bg-gray-50">
                    Close
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}

      {/* Company Dialogs */}
      {Object.entries(companyDialogs).map(([key, dialog]) => (
        <Dialog key={key} open={activeDialog === key} onOpenChange={closeDialog}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden">
            <div className="relative">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <dialog.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white">{dialog.title}</DialogTitle>
                    <p className="text-purple-100 mt-1">{dialog.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Mission & Vision */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-3"></div>
                    Our Mission
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
                    To empower businesses with cutting-edge web solutions that drive growth, enhance user experience, and establish a strong digital presence in today's competitive market.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Vision</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">To be the leading web development partner for businesses seeking innovative digital solutions.</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Values</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Innovation, Quality, Transparency, Client Success, and Continuous Learning.</p>
                    </div>
                  </div>
                </div>

                {/* Core Strengths */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mr-3"></div>
                    Core Strengths
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dialog.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services Overview */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mr-3"></div>
                    What We Offer
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Code className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Custom Development</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Tailored websites and web applications built to your specific requirements.</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Server className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Hosting & Maintenance</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Reliable hosting solutions with 24/7 monitoring and ongoing support.</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI Integration</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">ChatHub AI chatbots and intelligent automation solutions.</p>
                    </div>
                  </div>
                </div>
                
                {/* Development Process */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mr-3"></div>
                    Our Development Process
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Discovery</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">Understanding your needs and project requirements</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Planning</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">Creating detailed project roadmap and architecture</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Development</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">Building your solution with modern technologies</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">4</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Launch</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">Deployment and ongoing support & maintenance</p>
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-purple-600" />
                      Company Status
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{dialog.pricing}</p>
                  </div>
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-pink-600" />
                      Established
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{dialog.timeline}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={closeDialog} className="border-gray-300 hover:bg-gray-50">
                    Close
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}

      {/* Quote Widget */}
      {isQuoteWidgetOpen && (
        <QuoteWidget 
          isOpen={isQuoteWidgetOpen}
          onClose={() => setIsQuoteWidgetOpen(false)}
          onQuoteSubmit={(data) => {
            console.log('Quote submitted:', data)
            // You can add additional logic here like sending to email or analytics
          }}
        />
      )}
    </footer>
  )
} 