"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Globe, 
  Code, 
  CreditCard, 
  Clock, 
  Shield, 
  Users, 
  MessageCircle, 
  HelpCircle, 
  ArrowLeft,
  CheckCircle,
  Star,
  TrendingUp,
  Lock,
  Smartphone,
  Database,
  Palette,
  Headphones,
  Zap,
  Server,
  Bot
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"

export default function WebVaultFAQPage() {
  const router = useRouter()

  const faqCategories = [
    {
      title: "Getting Started",
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      questions: [
        {
          question: "How quickly can you start my project?",
          answer: "We typically begin projects within 1-2 weeks of contract signing. For urgent projects, we offer expedited timelines - contact us for availability. We can start planning and design work immediately while finalizing contracts."
        },
        {
          question: "What information do you need to get started?",
          answer: "We'll need your business requirements, target audience, design preferences, content, and any existing branding materials. We provide a comprehensive questionnaire to gather all necessary information efficiently."
        },
        {
          question: "Do you offer free consultations?",
          answer: "Yes! We offer a free 30-minute consultation to discuss your project requirements, timeline, and budget. This helps us provide an accurate quote and project plan tailored to your needs."
        },
        {
          question: "What if I don't have a clear vision for my website?",
          answer: "No problem! We specialize in helping businesses define their online presence. We'll work with you to understand your goals, research your competitors, and create a strategic plan for your website."
        }
      ]
    },
    {
      title: "Services & Pricing",
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      questions: [
        {
          question: "What payment terms do you offer?",
          answer: "We require 50% upfront for new projects, with the remaining balance due upon completion. For ongoing services, we offer monthly billing with net-30 terms. We also accept payment plans for larger projects."
        },
        {
          question: "What's included in your pricing?",
          answer: "Our pricing includes design, development, testing, deployment, basic SEO setup, and 30 days of post-launch support. Hosting, domain registration, and ongoing maintenance are available as add-ons."
        },
        {
          question: "Do you offer maintenance packages?",
          answer: "Yes! We offer comprehensive maintenance packages including updates, security monitoring, backups, performance optimization, and 24/7 support. Packages start at $50/month."
        },
        {
          question: "Can you work within my budget?",
          answer: "Absolutely! We offer flexible solutions to fit various budgets. We can prioritize features, use different technologies, or phase the project to work within your budget constraints."
        }
      ]
    },
    {
      title: "Development Process",
      icon: Code,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      questions: [
        {
          question: "What's your development process?",
          answer: "Our process includes discovery, planning, design, development, testing, and launch. We maintain regular communication throughout, providing progress updates and seeking your feedback at each stage."
        },
        {
          question: "How long does a typical project take?",
          answer: "Simple websites take 2-4 weeks, complex projects 6-12 weeks, and e-commerce sites 8-16 weeks. Timeline depends on complexity, features, and your feedback cycle."
        },
        {
          question: "Can I see progress during development?",
          answer: "Yes! We provide access to a staging environment where you can see your website as it's being built. We also share regular updates and screenshots of the development progress."
        },
        {
          question: "What technologies do you use?",
          answer: "We use modern technologies including React, Next.js, WordPress, Shopify, and custom solutions. We choose the best technology stack based on your specific needs and requirements."
        }
      ]
    },
    {
      title: "Integration & Compatibility",
      icon: Database,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      questions: [
        {
          question: "Can you integrate with my existing systems?",
          answer: "Absolutely! We specialize in integrating new solutions with existing CRM, ERP, payment systems, and other business tools. We'll assess your current setup during our consultation."
        },
        {
          question: "Do you work with third-party APIs?",
          answer: "Yes, we integrate with popular APIs including payment gateways, email marketing tools, social media platforms, and custom APIs. We can also build custom integrations for your specific needs."
        },
        {
          question: "Will my website work on mobile devices?",
          answer: "Absolutely! All our websites are fully responsive and optimized for mobile devices. We test across various screen sizes and devices to ensure perfect functionality."
        },
        {
          question: "What browsers do you support?",
          answer: "We support all modern browsers including Chrome, Firefox, Safari, and Edge. We test across different versions to ensure compatibility and optimal performance."
        }
      ]
    },
    {
      title: "ChatHub Integration",
      icon: Bot,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      questions: [
        {
          question: "Can you integrate ChatHub into my website?",
          answer: "Yes! We specialize in ChatHub integration. We can add AI chatbots to your website, customize their appearance and behavior, and integrate them with your existing systems."
        },
        {
          question: "How much does ChatHub integration cost?",
          answer: "ChatHub integration starts at $200/month. This includes setup, customization, training, and ongoing support. We also offer custom development for advanced chatbot features."
        },
        {
          question: "Can the chatbot handle my specific business needs?",
          answer: "Absolutely! We can train ChatHub on your business processes, products, and FAQs. The AI learns from your data to provide accurate, helpful responses to your customers."
        },
        {
          question: "How quickly can ChatHub be implemented?",
          answer: "Basic ChatHub integration takes 2-4 weeks. Custom training and advanced features may take longer. We can often get a basic chatbot live within a week for urgent needs."
        }
      ]
    },
    {
      title: "Hosting & Security",
      icon: Server,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      questions: [
        {
          question: "Do you provide hosting services?",
          answer: "Yes! We offer reliable cloud hosting with 99.9% uptime guarantee, daily backups, SSL certificates, and 24/7 monitoring. Hosting starts at $20/month."
        },
        {
          question: "How secure will my website be?",
          answer: "We implement enterprise-grade security including SSL certificates, regular security updates, malware scanning, and DDoS protection. We also provide security monitoring and incident response."
        },
        {
          question: "Do you provide backups?",
          answer: "Yes! We provide daily automated backups with 30-day retention. We can also set up custom backup schedules and off-site storage for additional security."
        },
        {
          question: "What happens if my website goes down?",
          answer: "We provide 24/7 monitoring and support. If your website experiences issues, we'll be notified immediately and work to resolve the problem quickly. We also provide status updates and estimated resolution times."
        }
      ]
    },
    {
      title: "Support & Maintenance",
      icon: Headphones,
      color: "text-teal-600",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
      questions: [
        {
          question: "Do you provide ongoing support?",
          answer: "Yes! We offer comprehensive maintenance packages including updates, security monitoring, backups, and 24/7 support. Contact us for detailed maintenance plans."
        },
        {
          question: "How quickly do you respond to support requests?",
          answer: "We respond to urgent issues within 2 hours, and all other requests within 24 hours. Premium support customers get priority response times and dedicated support channels."
        },
        {
          question: "Can you help with content updates?",
          answer: "Yes! We can help with content updates, image changes, and minor modifications. We also provide training on how to manage your website content yourself."
        },
        {
          question: "Do you offer training for my team?",
          answer: "Absolutely! We provide comprehensive training on how to use and maintain your website. This includes content management, basic troubleshooting, and best practices for your specific platform."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/5 to-blue-100/10 dark:from-background dark:via-green-900/20 dark:to-blue-800/10">
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
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              Help & Support
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our web development services. 
              Can't find what you're looking for? Contact our team.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">100+</h3>
                <p className="text-sm text-muted-foreground">Websites Built</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">50+</h3>
                <p className="text-sm text-muted-foreground">Happy Clients</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">4.9/5</h3>
                <p className="text-sm text-muted-foreground">Client Rating</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">2-8</h3>
                <p className="text-sm text-muted-foreground">Weeks Delivery</p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-6">
                <div className="flex items-center space-x-3 mb-8">
                  <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                </div>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((item, questionIndex) => (
                    <AccordionItem 
                      key={questionIndex} 
                      value={`${categoryIndex}-${questionIndex}`}
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                        <div className="flex items-center space-x-3">
                          <HelpCircle className="w-5 h-5 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{item.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="mt-20">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Headphones className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Still Need Help?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Can't find the answer you're looking for? Our team is here to help you with your web development needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/web-building/quote">Get Quote</Link>
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