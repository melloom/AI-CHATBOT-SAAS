"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Globe, 
  ArrowLeft,
  ArrowRight,
  Home,
  Bot,
  Users,
  Settings,
  FileText,
  Shield,
  Cookie,
  HelpCircle,
  MessageCircle,
  CreditCard,
  Server,
  Code,
  Palette,
  MapPin
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"

export default function SitemapPage() {
  const router = useRouter()

  const mainSections = [
    {
      title: "Main Pages",
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      pages: [
        { name: "Home", url: "/", description: "Main landing page" },
        { name: "About", url: "/about", description: "About ChatHub and our mission" },
        { name: "Personal AI Agents", url: "/personal-ai-agents", description: "Personal AI assistants for daily tasks" },
        { name: "Contact", url: "/contact", description: "Get in touch with us" },
        { name: "FAQ", url: "/faq", description: "Frequently asked questions" },
        { name: "Blog", url: "/blog", description: "Our blog and insights" },
        { name: "Selection", url: "/", description: "Choose your plan or service" },
        { name: "Privacy Policy", url: "/privacy", description: "How we protect your data" },
        { name: "Terms of Service", url: "/terms", description: "Terms and conditions of use" },
        { name: "Cookie Policy", url: "/cookies", description: "How we use cookies" }
      ]
    },
    {
      title: "WebVault Services",
      icon: Code,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      pages: [
        { name: "Web Development", url: "/web-building", description: "Professional web development services" },
        { name: "WebVault Home", url: "/web-building/home", description: "WebVault services homepage" },
        { name: "Custom Development", url: "/web-building/custom-development", description: "Custom website and app development" },
        { name: "Pricing Plans", url: "/web-building/pricing-plans", description: "Transparent pricing for web services" },
        { name: "Hosting & Maintenance", url: "/web-building/hosting-maintenance", description: "Reliable hosting and maintenance" },
        { name: "ChatHub Integration", url: "/web-building/chathub-integration", description: "AI chatbot integration services" },
        { name: "Business Services", url: "/web-building/business-services", description: "Legal and business services" },
        { name: "Get Quote", url: "/web-building/quote", description: "Get a free quote for your project" },
        { name: "WebVault FAQ", url: "/web-building/faq", description: "Frequently asked questions about web services" }
      ]
    },
    {
      title: "Legal & Privacy",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      pages: [
        { name: "Privacy Policy", url: "/privacy", description: "How we protect your data" },
        { name: "Terms of Service", url: "/terms", description: "Terms and conditions of use" },
        { name: "Cookie Policy", url: "/cookies", description: "How we use cookies" }
      ]
    }
  ]

  const externalLinks = [
    {
      name: "Portfolio",
      url: "https://melvinworks.bio",
      description: "View our portfolio of work",
      icon: Palette
    },
    {
      name: "Blog",
      url: "https://wiredliving.blog",
      description: "Read our latest insights and articles",
      icon: FileText
    },
    {
      name: "Contact",
      url: "mailto:melvin.a.p.cruz@gmail.com",
      description: "Email us directly",
      icon: MessageCircle
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/5 to-purple-100/10 dark:from-background dark:via-blue-900/20 dark:to-purple-800/10">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/LOGO.png" 
                alt="ChatHub Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8"
                priority
              />
              <span className="font-bold text-2xl text-foreground">ChatHub</span>
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
              Site Navigation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Sitemap
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Navigate through all public pages and sections of our platform. Find what you're looking for quickly and easily.
            </p>
          </div>

          {/* Location Info */}
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Based in Maryland, USA</h3>
                    <p className="text-muted-foreground">Serving clients worldwide with professional web development and AI chatbot solutions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Sections */}
          <div className="space-y-12">
            {mainSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-6">
                <div className="flex items-center space-x-3 mb-8">
                  <div className={`w-12 h-12 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                    <section.icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {section.pages.map((page, pageIndex) => (
                    <Card key={pageIndex} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-foreground">{page.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{page.description}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          className="w-full"
                        >
                          <Link href={page.url}>
                            Visit Page
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {/* External Links */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">External Links</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                {externalLinks.map((link, linkIndex) => (
                  <Card key={linkIndex} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <link.icon className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-foreground">{link.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="w-full"
                      >
                        <Link href={link.url} target="_blank">
                          Visit Link
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="mt-20">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Need Help Finding Something?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Can't find what you're looking for? Contact us and we'll help you navigate to the right page.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/faq">View FAQ</Link>
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