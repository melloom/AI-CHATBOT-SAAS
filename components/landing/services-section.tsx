import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Check,
  Briefcase,
  Globe,
  ShoppingCart,
  Bot,
  Settings,
  Server,
  BarChart3,
  Calendar,
  MessageCircle,
  Zap,
  Shield
} from "lucide-react"

export function ServicesSection() {
  return (
    <section id="services" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Chatbot Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive AI chatbot solutions to transform your customer support and business operations
          </p>
        </div>

        {/* Main Consultation Service */}
        <Card className="mb-8 border-primary max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl dark:text-white">AI Chatbot Consultation</CardTitle>
                <CardDescription className="text-lg dark:text-gray-300">
                  Expert guidance to help you implement the perfect AI chatbot solution for your business
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 dark:text-white">What's Included:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="dark:text-gray-300">30-minute strategy session</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="dark:text-gray-300">AI model recommendations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="dark:text-gray-300">Use case analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="dark:text-gray-300">Integration planning</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="dark:text-gray-300">ROI projections</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="dark:text-gray-300">Implementation roadmap</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 dark:text-white">Perfect For:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span className="dark:text-gray-300">Businesses new to AI chatbots</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span className="dark:text-gray-300">Customer support optimization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span className="dark:text-gray-300">Lead generation enhancement</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span className="dark:text-gray-300">24/7 customer service</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Free Consultation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-slate-700 dark:border-slate-600">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="dark:text-white">Customer Support Chatbots</CardTitle>
              <CardDescription className="dark:text-gray-300">
                AI-powered support agents that handle customer inquiries 24/7
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Instant Responses</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">FAQ Handling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Ticket Creation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Human Handoff</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-slate-700 dark:border-slate-600">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="dark:text-white">Lead Generation Bots</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Intelligent chatbots that capture and qualify leads automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Lead Qualification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Appointment Booking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Product Recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">CRM Integration</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-slate-700 dark:border-slate-600">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="dark:text-white">Custom Training</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Train your chatbot with your specific business knowledge and data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Knowledge Base Integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Document Training</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Brand Voice Matching</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Continuous Learning</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-slate-700 dark:border-slate-600">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="dark:text-white">Security & Compliance</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Enterprise-grade security and compliance for sensitive data handling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Data Encryption</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">GDPR Compliance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">SOC 2 Type II</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Access Controls</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-slate-700 dark:border-slate-600">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="dark:text-white">Hosting & Infrastructure</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Reliable hosting with high availability and performance monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">99.9% Uptime</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Auto Scaling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Global CDN</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">24/7 Monitoring</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-slate-700 dark:border-slate-600">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="dark:text-white">Analytics & Insights</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Comprehensive analytics to optimize your chatbot performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Conversation Analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">Performance Metrics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">User Behavior Tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="dark:text-gray-300">ROI Reporting</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 