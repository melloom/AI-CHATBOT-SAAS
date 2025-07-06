import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Check,
  Calendar
} from "lucide-react"

interface PricingSectionProps {
  setActiveSection: (section: string) => void
}

export function PricingSection({ setActiveSection }: PricingSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Consultation & Service Pricing</h2>
        
        {/* Free Consultation Highlight */}
        <Card className="mb-8 border-green-500 bg-green-50 dark:bg-green-900/10">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Free Initial Consultation</CardTitle>
                <CardDescription>
                  Start with a free 30-minute consultation to discuss your project
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
                    <span>Project requirements discussion</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Technology recommendations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Rough timeline estimate</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Budget range discussion</span>
                  </li>
                </ul>
              </div>
              <div>
                <Button 
                  size="lg" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => setActiveSection("contact")}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Free Consultation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Website</CardTitle>
              <div className="text-3xl font-bold">$1,500 - $3,000</div>
              <CardDescription>Perfect for small businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>5-8 Pages</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Responsive Design</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Contact Form</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Basic SEO</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Content Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>1 Month Support</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-6"
                onClick={() => setActiveSection("contact")}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Professional Website</CardTitle>
              <div className="text-3xl font-bold">$3,000 - $8,000</div>
              <CardDescription>Most popular choice</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>10-15 Pages</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Advanced CMS</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Blog Section</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Advanced SEO</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Analytics Setup</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>3 Months Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Performance Optimization</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-6"
                onClick={() => setActiveSection("contact")}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>E-commerce Website</CardTitle>
              <div className="text-3xl font-bold">$5,000 - $15,000</div>
              <CardDescription>Complete online store</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited Products</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Payment Processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Inventory Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Order Tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Customer Accounts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>6 Months Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Security Features</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-6"
                onClick={() => setActiveSection("contact")}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Services */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Additional Services</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Consultation</CardTitle>
                <div className="text-2xl font-bold">$150/hour</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Expert technical advice for existing projects or planning new ones.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveSection("contact")}
                >
                  Book Consultation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ongoing Maintenance</CardTitle>
                <div className="text-2xl font-bold">$200/month</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Regular updates, security patches, and technical support.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveSection("contact")}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 