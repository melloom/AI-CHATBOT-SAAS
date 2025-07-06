"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  MessageCircle, 
  Zap, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Star,
  Users,
  Shield,
  Globe,
  Database,
  TrendingUp,
  Smartphone,
  Headphones,
  Palette
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"

export default function ChatHubIntegrationPage() {
  const router = useRouter()

  const integrationPlans = [
    {
      name: "Basic Integration",
      price: "$200/month",
      description: "Perfect for small businesses",
      features: [
        "AI-powered chatbot setup",
        "Basic training on your business",
        "Website integration",
        "Email support",
        "Basic analytics",
        "Up to 1,000 conversations/month",
        "Standard response templates",
        "Business hours support",
        "Monthly reports",
        "Basic customization"
      ],
      popular: false,
      icon: Bot
    },
    {
      name: "Professional Integration",
      price: "$500/month",
      description: "Ideal for growing businesses",
      features: [
        "Everything in Basic, plus:",
        "Advanced AI training",
        "Multi-platform integration",
        "Custom chatbot personality",
        "Advanced analytics dashboard",
        "Up to 10,000 conversations/month",
        "Priority support",
        "Custom integrations",
        "Performance optimization",
        "Quarterly strategy sessions"
      ],
      popular: true,
      icon: Star
    },
    {
      name: "Enterprise Integration",
      price: "$1,000/month",
      description: "For large organizations",
      features: [
        "Everything in Professional, plus:",
        "Custom AI model training",
        "Unlimited conversations",
        "Advanced security features",
        "Dedicated support team",
        "Custom development hours",
        "API access",
        "White-label solutions",
        "Strategic consulting",
        "24/7 support"
      ],
      popular: false,
      icon: TrendingUp
    }
  ]

  const platforms = [
    {
      name: "Website Integration",
      icon: Globe,
      description: "Seamless integration with your website",
      features: ["Floating chat widget", "Custom styling", "Mobile responsive", "Analytics tracking"]
    },
    {
      name: "Facebook Messenger",
      icon: MessageCircle,
      description: "Connect with customers on Facebook",
      features: ["Auto-replies", "Rich media support", "Conversation management", "Analytics"]
    },
    {
      name: "WhatsApp Business",
      icon: Smartphone,
      description: "Professional WhatsApp integration",
      features: ["Business API", "Message templates", "Contact management", "Automated responses"]
    },
    {
      name: "Slack Integration",
      icon: Users,
      description: "Internal team communication",
      features: ["Channel integration", "Command responses", "File sharing", "Team collaboration"]
    },
    {
      name: "Custom API",
      icon: Database,
      description: "Custom integrations for your needs",
      features: ["REST API access", "Webhook support", "Custom endpoints", "Data synchronization"]
    },
    {
      name: "Mobile Apps",
      icon: Smartphone,
      description: "Native mobile app integration",
      features: ["iOS SDK", "Android SDK", "Push notifications", "Offline support"]
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: "24/7 Customer Support",
      description: "Provide instant responses to customer inquiries around the clock."
    },
    {
      icon: Users,
      title: "Increased Engagement",
      description: "Interactive conversations that keep customers engaged and satisfied."
    },
    {
      icon: TrendingUp,
      title: "Lead Generation",
      description: "Capture leads and qualify prospects through intelligent conversations."
    },
    {
      icon: Shield,
      title: "Consistent Service",
      description: "Ensure every customer receives the same high-quality service experience."
    },
    {
      icon: Database,
      title: "Valuable Insights",
      description: "Gain insights into customer behavior and preferences through analytics."
    },
    {
      icon: Palette,
      title: "Brand Consistency",
      description: "Maintain your brand voice and personality across all interactions."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-50/5 to-purange-100/10 dark:from-background dark:via-orange-900/20 dark:to-orange-800/10">
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
            <Badge variant="secondary" className="mb-4 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
              ChatHub Integration
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              AI Chatbot Integration Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your customer support with intelligent AI chatbots. We integrate ChatHub 
              into your existing platforms for seamless customer experiences.
            </p>
          </div>

          {/* Integration Plans */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Integration Plans</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect ChatHub integration plan for your business. All plans include 
                setup, training, and ongoing support.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {integrationPlans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative shadow-lg border-0 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 border-2 border-orange-200 dark:border-orange-700' 
                      : 'bg-gradient-to-br from-white to-gray-50/20 dark:from-card dark:to-gray-900/10'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-700 hover:to-blue-700">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Platform Integrations */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Platform Integrations</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We integrate ChatHub with all major platforms and can create custom solutions for your specific needs.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {platforms.map((platform, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <platform.icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {platform.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {platform.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Benefits of ChatHub Integration</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover how AI chatbots can transform your customer support and business operations.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Implementation Process */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Implementation Process</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our streamlined process ensures quick and effective ChatHub integration.
                  </p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="font-bold text-orange-600">1</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Discovery</h4>
                    <p className="text-sm text-muted-foreground">We analyze your business needs and customer interactions.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="font-bold text-orange-600">2</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Training</h4>
                    <p className="text-sm text-muted-foreground">We train the AI on your business processes and FAQs.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="font-bold text-orange-600">3</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Integration</h4>
                    <p className="text-sm text-muted-foreground">We integrate ChatHub with your platforms and systems.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="font-bold text-orange-600">4</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Launch</h4>
                    <p className="text-sm text-muted-foreground">We launch your chatbot and provide ongoing support.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Transform Your Customer Support?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Let's discuss how ChatHub integration can improve your customer experience and business efficiency.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-700 hover:to-blue-700">
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