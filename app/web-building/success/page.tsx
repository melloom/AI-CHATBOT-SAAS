"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, ArrowLeft, Mail, Phone, Clock } from "lucide-react"
import Link from "next/link"

export default function ConsultationSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Consultation Request Received!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for your interest in our web development services. We've received your consultation request and will get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>We'll review your project requirements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>You'll receive a detailed proposal within 24 hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>We'll schedule a free 30-minute consultation call</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>We'll discuss timeline, budget, and next steps</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/web-building" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Services
                  </Button>
                </Link>
                <Link href="/web-building" className="flex-1">
                  <Button className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Have an urgent question? Contact us directly:</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
                  <span>📧 hello@webdeveloper.com</span>
                  <span>📞 +1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 