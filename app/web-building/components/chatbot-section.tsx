import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Check,
  Bot,
  MessageCircle,
  Globe,
  Zap,
  Shield,
  BarChart3,
  Users,
  Star
} from "lucide-react"
import Link from "next/link"

interface ChatbotSectionProps {
  setActiveSection: (section: string) => void
}

export function ChatbotSection({ setActiveSection }: ChatbotSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">ChatHub AI Chatbot Integration</h2>
        <p className="text-gray-600 mb-8">Integrate powerful AI chatbots into your website with our comprehensive ChatHub platform. Choose the plan that fits your business needs.</p>
        
        {/* ChatHub Platform Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Starter</CardTitle>
              <div className="text-3xl font-bold text-blue-600">$49<span className="text-lg font-normal text-gray-600">/month</span></div>
              <CardDescription>Perfect for small businesses getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Up to 3 chatbots</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>1,000 conversations/month</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Standard templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Mobile responsive</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => {
                  const planData = {
                    planName: "ChatHub Starter",
                    price: "$49/month",
                    description: "Perfect for small businesses getting started",
                    features: ["Up to 3 chatbots", "1,000 conversations/month", "Basic analytics", "Email support", "Standard templates", "Mobile responsive"],
                    icon: "Bot"
                  }
                  sessionStorage.setItem('chathubSelection', JSON.stringify(planData))
                  window.location.href = '/web-building/chathub-form'
                }}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Pro</CardTitle>
              <div className="text-3xl font-bold text-green-600">$149<span className="text-lg font-normal text-gray-600">/month</span></div>
              <CardDescription>Best for growing businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Up to 10 chatbots</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>10,000 conversations/month</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>API access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Multi-language support</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => {
                  const planData = {
                    planName: "ChatHub Pro",
                    price: "$149/month",
                    description: "Best for growing businesses",
                    features: ["Up to 10 chatbots", "10,000 conversations/month", "Advanced analytics", "Priority support", "Custom branding", "API access", "Team collaboration", "Multi-language support"],
                    icon: "Bot"
                  }
                  sessionStorage.setItem('chathubSelection', JSON.stringify(planData))
                  window.location.href = '/web-building/chathub-form'
                }}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Enterprise</CardTitle>
              <div className="text-3xl font-bold text-purple-600">$399<span className="text-lg font-normal text-gray-600">/month</span></div>
              <CardDescription>For large organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited chatbots</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited conversations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>White-label solution</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>SLA guarantee</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Advanced security</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>On-premise deployment</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => {
                  const planData = {
                    planName: "ChatHub Enterprise",
                    price: "$399/month",
                    description: "For large organizations",
                    features: ["Unlimited chatbots", "Unlimited conversations", "White-label solution", "Dedicated support", "Custom integrations", "SLA guarantee", "Advanced security", "On-premise deployment"],
                    icon: "Bot"
                  }
                  sessionStorage.setItem('chathubSelection', JSON.stringify(planData))
                  window.location.href = '/web-building/chathub-form'
                }}
              >
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Integration Services */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Website Integration</CardTitle>
              <div className="text-2xl font-bold text-orange-600">$799</div>
              <CardDescription>Integrate ChatHub into your existing website</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Custom styling & branding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Performance optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Mobile responsive design</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Testing & quality assurance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Documentation & training</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => {
                  const serviceData = {
                    serviceName: "Website Integration",
                    price: "$799",
                    description: "Integrate ChatHub into your existing website",
                    features: ["Custom styling & branding", "Performance optimization", "Mobile responsive design", "Testing & quality assurance", "Documentation & training"],
                    icon: "Zap"
                  }
                  sessionStorage.setItem('chathubSelection', JSON.stringify(serviceData))
                  window.location.href = '/web-building/chathub-form'
                }}
              >
                Get Quote
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Custom AI Training</CardTitle>
              <div className="text-2xl font-bold text-indigo-600">$299</div>
              <CardDescription>Train AI on your business knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Custom knowledge base setup</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Industry-specific training</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Response optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Multi-language support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Ongoing training updates</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => {
                  const serviceData = {
                    serviceName: "Custom AI Training",
                    price: "$299",
                    description: "Train AI on your business knowledge",
                    features: ["Custom knowledge base setup", "Industry-specific training", "Response optimization", "Multi-language support", "Ongoing training updates"],
                    icon: "Shield"
                  }
                  sessionStorage.setItem('chathubSelection', JSON.stringify(serviceData))
                  window.location.href = '/web-building/chathub-form'
                }}
              >
                Get Quote
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Services */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Analytics Setup</CardTitle>
              <div className="text-xl font-bold text-red-600">$199</div>
              <CardDescription>Advanced analytics and reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Custom dashboards</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Conversion tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Performance metrics</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle>Team Training</CardTitle>
              <div className="text-xl font-bold text-yellow-600">$149</div>
              <CardDescription>Train your team on ChatHub</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Live training session</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Best practices guide</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Ongoing support</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-pink-600" />
              </div>
              <CardTitle>Premium Support</CardTitle>
              <div className="text-xl font-bold text-pink-600">$99/month</div>
              <CardDescription>Priority support and maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>24/7 priority support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Monthly optimization</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your Customer Support?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses using ChatHub to provide 24/7 AI-powered customer support. 
              Get started today and see the difference AI can make for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  const generalData = {
                    serviceName: "ChatHub AI Chatbot Integration",
                    description: "Transform your customer support with AI-powered chatbots",
                    icon: "Bot"
                  }
                  sessionStorage.setItem('chathubSelection', JSON.stringify(generalData))
                  window.location.href = '/web-building/chathub-form'
                }}
              >
                <Globe className="w-5 h-5 mr-2" />
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const demoData = {
                    serviceName: "ChatHub Demo",
                    description: "Schedule a personalized ChatHub demo",
                    icon: "Bot"
                  }
                  sessionStorage.setItem('consultationSelection', JSON.stringify(demoData))
                  window.location.href = '/web-building/consultation'
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 