"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Bot, 
  MessageCircle, 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  ArrowLeft,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Lock,
  Smartphone,
  Database,
  Code,
  Palette,
  Headphones
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"

export default function FAQPage() {
  const router = useRouter()

  const faqCategories = [
    {
      title: "Getting Started",
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      questions: [
        {
          question: "How do I create my first chatbot?",
          answer: "Creating your first chatbot is simple! Sign up for a ChatHub account, choose a template or start from scratch, customize your bot's personality and responses, and deploy it to your website. Our step-by-step wizard guides you through the entire process."
        },
        {
          question: "What platforms can I integrate my chatbot with?",
          answer: "ChatHub supports integration with websites, Facebook Messenger, WhatsApp, Slack, Discord, and custom APIs. We also provide SDKs for mobile apps and can integrate with most CRM systems."
        },
        {
          question: "How long does it take to set up a chatbot?",
          answer: "Basic chatbot setup takes 15-30 minutes. For custom integrations or advanced features, setup typically takes 1-2 hours. Our team can help with complex implementations."
        },
        {
          question: "Do I need technical skills to use ChatHub?",
          answer: "No technical skills required! Our drag-and-drop interface makes it easy for anyone to create and manage chatbots. We also offer professional services for custom development."
        }
      ]
    },
    {
      title: "Features & Capabilities",
      icon: Bot,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      questions: [
        {
          question: "What AI models does ChatHub use?",
          answer: "ChatHub uses advanced language models including GPT-4, Claude, and our proprietary models. You can choose the best model for your use case or let our system automatically select the optimal one."
        },
        {
          question: "Can my chatbot learn from conversations?",
          answer: "Yes! ChatHub's AI continuously learns from conversations to improve responses. You can also train your bot with custom knowledge bases, FAQs, and product information."
        },
        {
          question: "How many languages does ChatHub support?",
          answer: "ChatHub supports 50+ languages including English, Spanish, French, German, Chinese, Japanese, Arabic, and many more. Your chatbot can automatically detect and respond in the user's preferred language."
        },
        {
          question: "Can I customize the chatbot's appearance?",
          answer: "Absolutely! You can customize colors, fonts, avatars, and layout to match your brand. We also offer custom CSS for advanced styling and white-label solutions."
        }
      ]
    },
    {
      title: "Pricing & Billing",
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      questions: [
        {
          question: "What pricing plans are available?",
          answer: "We offer Starter ($29/month), Professional ($79/month), and Enterprise ($199/month) plans. Each plan includes different features, conversation limits, and support levels."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No hidden fees! Our pricing is transparent. You only pay for your chosen plan. Additional costs may apply for custom development, premium integrations, or dedicated support."
        },
        {
          question: "Can I change my plan anytime?",
          answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 30-day money-back guarantee. If you're not satisfied with ChatHub, we'll refund your first month's payment, no questions asked."
        }
      ]
    },
    {
      title: "Security & Privacy",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      questions: [
        {
          question: "How secure is my chatbot data?",
          answer: "ChatHub uses enterprise-grade security including end-to-end encryption, SOC 2 compliance, and regular security audits. Your data is stored in secure, encrypted databases with multiple backup locations."
        },
        {
          question: "Is ChatHub GDPR compliant?",
          answer: "Yes, ChatHub is fully GDPR compliant. We provide tools for data export, deletion, and consent management. Our privacy policy details how we handle and protect your data."
        },
        {
          question: "Can I self-host ChatHub?",
          answer: "Yes, we offer self-hosted solutions for enterprise customers who need complete control over their data and infrastructure. Contact our sales team for details."
        },
        {
          question: "What data does ChatHub collect?",
          answer: "We collect conversation data to improve our AI models, usage analytics for service optimization, and account information for billing and support. We never sell your data to third parties."
        }
      ]
    },
    {
      title: "Support & Maintenance",
      icon: Headphones,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      questions: [
        {
          question: "What support options are available?",
          answer: "We offer email support for all plans, live chat for Professional and above, and dedicated support for Business and Enterprise plans. Response times range from 24 hours to 2 hours depending on your plan."
        },
        {
          question: "Do you provide training and onboarding?",
          answer: "Yes! We offer free onboarding sessions, video tutorials, documentation, and webinars. Enterprise customers receive dedicated training and implementation support."
        },
        {
          question: "How often do you update the platform?",
          answer: "We release updates weekly with new features, bug fixes, and improvements. Major updates are announced in advance, and we maintain backward compatibility."
        },
        {
          question: "Can you help with custom integrations?",
          answer: "Absolutely! Our professional services team can help with custom integrations, API development, and complex implementations. Contact us for a consultation."
        }
      ]
    },
    {
      title: "Performance & Analytics",
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      questions: [
        {
          question: "What analytics does ChatHub provide?",
          answer: "ChatHub provides comprehensive analytics including conversation volume, response times, user satisfaction, popular topics, conversion tracking, and custom metrics. All data is available in real-time dashboards."
        },
        {
          question: "How fast does ChatHub respond?",
          answer: "ChatHub typically responds in under 2 seconds. Our AI models are optimized for speed while maintaining quality. Response times may vary based on message complexity and server load."
        },
        {
          question: "Can I export my chatbot data?",
          answer: "Yes, you can export conversation logs, analytics data, and bot configurations. We support CSV, JSON, and API exports. Enterprise customers get advanced data export options."
        },
        {
          question: "How does ChatHub handle high traffic?",
          answer: "ChatHub automatically scales to handle traffic spikes. Our infrastructure can handle millions of conversations simultaneously with no performance degradation."
        }
      ]
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
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Help & Support
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about ChatHub's AI chatbot platform. 
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">10,000+</h3>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">1M+</h3>
                <p className="text-sm text-muted-foreground">Conversations</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">4.9/5</h3>
                <p className="text-sm text-muted-foreground">Customer Rating</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">&lt;2s</h3>
                <p className="text-sm text-muted-foreground">Response Time</p>
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
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Headphones className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Still Need Help?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Can't find the answer you're looking for? Our support team is here to help you get the most out of ChatHub.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
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