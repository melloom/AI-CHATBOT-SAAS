import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Check,
  Server,
  Settings,
  Shield
} from "lucide-react"

interface HostingSectionProps {
  setActiveSection: (section: string) => void
}

export function HostingSection({ setActiveSection }: HostingSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Professional Hosting Solutions</h2>
        <p className="text-gray-600 mb-8">Choose from our enterprise-grade hosting plans with realistic pricing and comprehensive features.</p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Basic Hosting</CardTitle>
              <div className="text-3xl font-bold text-blue-600">$20<span className="text-lg font-normal text-gray-600">/month</span></div>
              <CardDescription>Essential hosting for small websites</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Shared hosting environment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>10GB storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited bandwidth</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>SSL certificate included</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Daily backups</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>99.9% uptime guarantee</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Basic security features</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => {
                  const planData = {
                    planName: "Basic Hosting",
                    price: "$20/month",
                    description: "Essential hosting for small websites",
                    features: ["Shared hosting environment", "10GB storage", "Unlimited bandwidth", "SSL certificate included", "Daily backups", "Email support", "99.9% uptime guarantee", "Basic security features"],
                    icon: "Server"
                  }
                  sessionStorage.setItem('hostingPlanSelection', JSON.stringify(planData))
                  window.location.href = '/web-building/hosting-form'
                }}
              >
                Choose Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Professional Hosting</CardTitle>
              <div className="text-3xl font-bold text-green-600">$50<span className="text-lg font-normal text-gray-600">/month</span></div>
              <CardDescription>Enhanced hosting for growing businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>VPS hosting environment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>50GB storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited bandwidth</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>SSL certificate included</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Daily backups</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>99.9% uptime guarantee</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Advanced security features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>CDN included</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Performance monitoring</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => {
                  const planData = {
                    planName: "Professional Hosting",
                    price: "$50/month",
                    description: "Enhanced hosting for growing businesses",
                    features: ["VPS hosting environment", "50GB storage", "Unlimited bandwidth", "SSL certificate included", "Daily backups", "Priority support", "99.9% uptime guarantee", "Advanced security features", "CDN included", "Performance monitoring"],
                    icon: "Server"
                  }
                  sessionStorage.setItem('hostingPlanSelection', JSON.stringify(planData))
                  window.location.href = '/web-building/hosting-form'
                }}
              >
                Choose Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Enterprise Hosting</CardTitle>
              <div className="text-3xl font-bold text-purple-600">$100<span className="text-lg font-normal text-gray-600">/month</span></div>
              <CardDescription>Dedicated hosting for large applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Dedicated server resources</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited bandwidth</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>SSL certificate included</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Hourly backups</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>24/7 support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>99.99% uptime guarantee</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Advanced security features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Global CDN</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Performance optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Custom configurations</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => {
                  const planData = {
                    planName: "Enterprise Hosting",
                    price: "$100/month",
                    description: "Dedicated hosting for large applications",
                    features: ["Dedicated server resources", "Unlimited storage", "Unlimited bandwidth", "SSL certificate included", "Hourly backups", "24/7 support", "99.99% uptime guarantee", "Advanced security features", "Global CDN", "Performance optimization", "Custom configurations"],
                    icon: "Server"
                  }
                  sessionStorage.setItem('hostingPlanSelection', JSON.stringify(planData))
                  window.location.href = '/web-building/hosting-form'
                }}
              >
                Choose Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Website Maintenance</CardTitle>
              <div className="text-2xl font-bold text-orange-600">$99<span className="text-lg font-normal text-gray-600">/month</span></div>
              <CardDescription>Comprehensive maintenance and support</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Security Updates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Performance Monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Content Updates (5 hours/month)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>SEO Monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>24/7 Emergency Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Monthly Reports</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => {
                  const planData = {
                    planName: "Website Maintenance",
                    price: "$99/month",
                    description: "Comprehensive maintenance and support",
                    features: ["Security Updates", "Performance Monitoring", "Content Updates (5 hours/month)", "SEO Monitoring", "24/7 Emergency Support", "Monthly Reports"],
                    icon: "Settings"
                  }
                  sessionStorage.setItem('hostingPlanSelection', JSON.stringify(planData))
                  window.location.href = '/web-building/hosting-form'
                }}
              >
                Choose Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Security & Monitoring</CardTitle>
              <div className="text-2xl font-bold text-red-600">$49<span className="text-lg font-normal text-gray-600">/month</span></div>
              <CardDescription>Advanced security and monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Malware Scanning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>DDoS Protection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Firewall Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Real-time Monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Security Audits</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Incident Response</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => {
                  const planData = {
                    planName: "Security & Monitoring",
                    price: "$49/month",
                    description: "Advanced security and monitoring",
                    features: ["Malware Scanning", "DDoS Protection", "Firewall Management", "Real-time Monitoring", "Security Audits", "Incident Response"],
                    icon: "Shield"
                  }
                  sessionStorage.setItem('hostingPlanSelection', JSON.stringify(planData))
                  window.location.href = '/web-building/hosting-form'
                }}
              >
                Choose Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 