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
              <CardTitle>Starter Hosting</CardTitle>
              <div className="text-3xl font-bold text-blue-600">$29<span className="text-lg font-normal text-gray-600">/month</span></div>
              <CardDescription>Perfect for small business websites</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>10GB SSD Storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited Bandwidth</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Free SSL Certificate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Daily Backups</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>99.9% Uptime</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Email Support</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => setActiveSection("contact")}
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
              <div className="text-3xl font-bold text-green-600">$79<span className="text-lg font-normal text-gray-600">/month</span></div>
              <CardDescription>Most popular for growing businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>50GB SSD Storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited Bandwidth</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Free SSL Certificate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Daily Backups</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>99.9% Uptime</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>CDN Integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Staging Environment</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => setActiveSection("contact")}
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
              <div className="text-3xl font-bold text-purple-600">$199<span className="text-lg font-normal text-gray-600">/month</span></div>
              <CardDescription>For high-traffic websites</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>200GB SSD Storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited Bandwidth</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Free SSL Certificate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Hourly Backups</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>99.99% Uptime</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>24/7 Phone Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Advanced CDN</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Dedicated IP</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Load Balancing</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => setActiveSection("contact")}
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
              <ul className="space-y-2 text-sm">
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
              <ul className="space-y-2 text-sm">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 