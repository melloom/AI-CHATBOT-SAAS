"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  Users, 
  Shield, 
  Zap, 
  Globe,
  Code,
  MessageCircle,
  Star,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  MapPin,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EnhancedBackLink } from "@/components/ui/enhanced-back-button"

export default function AboutPage() {
  const router = useRouter()

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Intelligence",
      description: "Advanced artificial intelligence that understands context and provides human-like responses",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      icon: Users,
      title: "Customer-Focused",
      description: "Designed to enhance customer experience and drive satisfaction scores",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance and end-to-end encryption",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-2 second response times with 99.9% uptime guarantee",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    }
  ]

  const stats = [
    { number: "10,000+", label: "Active Users", icon: Users },
    { number: "1M+", label: "Conversations", icon: MessageCircle },
    { number: "4.9/5", label: "Customer Rating", icon: Star },
    { number: "50+", label: "Languages", icon: Globe }
  ]

  const services = [
    {
      title: "ChatHub Platform",
      description: "AI-powered chatbot platform for customer support and engagement",
      features: [
        "Multi-platform integration",
        "Advanced AI training",
        "Analytics and reporting",
        "Custom chatbot personalities",
        "24/7 automated support",
        "Human handoff capabilities"
      ],
      icon: Bot,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "WebVault Services",
      description: "Professional web development and digital solutions",
      features: [
        "Custom website development",
        "E-commerce solutions",
        "Mobile app development",
        "Hosting and maintenance",
        "Performance optimization",
        "SEO and marketing"
      ],
      icon: Code,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    }
  ]

  const team = [
    {
      name: "Melvin Cruz",
      role: "Founder & Lead Developer",
      description: "Full-stack developer with expertise in AI, web development, and customer experience design.",
      image: "/placeholder-user.jpg"
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
            
            <EnhancedBackLink />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About ChatHub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Empowering businesses with intelligent chatbot solutions that transform customer engagement and drive growth.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{stat.number}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose ChatHub?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We combine cutting-edge AI technology with intuitive design to deliver exceptional customer experiences.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We offer comprehensive solutions for modern businesses looking to enhance their digital presence.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center`}>
                        <service.icon className={`w-6 h-6 ${service.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    From a simple idea to a comprehensive platform serving thousands of businesses worldwide.
                  </p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">The Beginning</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      ChatHub was founded with a simple mission: to make AI-powered customer support accessible to businesses of all sizes. 
                      We believe that every company deserves the tools to provide exceptional customer service, regardless of their budget or technical expertise.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Our platform combines cutting-edge artificial intelligence with intuitive design, allowing businesses to create, deploy, 
                      and manage intelligent chatbots that truly understand their customers' needs.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">Today's Impact</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Today, thousands of businesses trust ChatHub to handle millions of customer interactions, providing 24/7 support 
                      and driving significant improvements in customer satisfaction and operational efficiency.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      We've expanded our services to include WebVault, offering comprehensive web development solutions that complement 
                      our AI chatbot platform, creating a complete digital transformation ecosystem.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The passionate individuals behind ChatHub and WebVault, dedicated to transforming business communication.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
              {team.map((member, index) => (
                <Card key={index} className="max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                        <Image 
                          src={member.image} 
                          alt={member.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{member.role}</p>
                        <p className="text-muted-foreground leading-relaxed">{member.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Ready to transform your business with AI-powered solutions? Let's discuss how we can help you achieve your goals.
                </p>
                
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                  <div className="flex items-center justify-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-muted-foreground">melvin.a.p.cruz@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="text-muted-foreground">+1 (667) 200-9784</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <span className="text-muted-foreground">Maryland, USA</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/contact">Contact Us</Link>
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