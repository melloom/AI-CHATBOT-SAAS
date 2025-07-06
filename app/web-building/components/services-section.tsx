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
  Calendar
} from "lucide-react"

interface ServicesSectionProps {
  setActiveSection: (section: string) => void
}

export function ServicesSection({ setActiveSection }: ServicesSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Consultation Services</h2>
        
        {/* Main Consultation Service */}
        <Card className="mb-8 border-primary">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Web Development Consultation</CardTitle>
                <CardDescription className="text-lg">
                  Expert guidance to help you make informed decisions about your web project
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">What's Included:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>30-minute strategy session</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Technology recommendations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Project scope analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Budget and timeline estimates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Competitor analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Written consultation report</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Perfect For:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Startups planning their first website</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Businesses looking to upgrade</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>E-commerce planning</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Technical decision making</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => setActiveSection("contact")}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Free Consultation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Website Development</CardTitle>
              <CardDescription>
                Custom websites built with modern technologies and responsive design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Responsive Design</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>SEO Optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Performance Optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Content Management</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>E-commerce Solutions</CardTitle>
              <CardDescription>
                Complete online stores with payment processing and inventory management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Payment Integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Inventory Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Order Processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Customer Accounts</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Chatbot Integration</CardTitle>
              <CardDescription>
                AI-powered chatbots for customer support and lead generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>24/7 Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Lead Generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Custom Training</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Analytics Dashboard</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Technical Review</CardTitle>
              <CardDescription>
                Expert analysis of your existing website or project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Performance Audit</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Security Assessment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>SEO Analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Improvement Recommendations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Hosting & Maintenance</CardTitle>
              <CardDescription>
                Reliable hosting with ongoing maintenance and support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>99.9% Uptime</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Security Updates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Daily Backups</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>24/7 Support</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Analytics & Optimization</CardTitle>
              <CardDescription>
                Data-driven insights and performance optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Google Analytics Setup</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Performance Monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Conversion Tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Monthly Reports</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 