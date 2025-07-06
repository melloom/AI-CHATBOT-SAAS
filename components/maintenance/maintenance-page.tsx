"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  RefreshCw,
  ExternalLink,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Github
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface MaintenancePageProps {
  title?: string
  subtitle?: string
  message?: string
  estimatedTime?: string
  progress?: number
  theme?: "dark" | "light" | "auto"
  showProgress?: boolean
  showEstimatedTime?: boolean
  showContactInfo?: boolean
  showSocialLinks?: boolean
  customImage?: string
  contactEmail?: string
  contactPhone?: string
  socialLinks?: {
    twitter?: string
    facebook?: string
    linkedin?: string
    instagram?: string
    github?: string
  }

}

export function MaintenancePage({
  title = "Scheduled Maintenance",
  subtitle = "We're working to improve your experience",
  message = "We're performing scheduled maintenance to enhance our platform. Please check back soon.",
  estimatedTime = "2 hours",
  progress = 45,
  theme = "dark",
  showProgress = true,
  showEstimatedTime = true,
  showContactInfo = true,
  showSocialLinks = true,
  customImage,
  contactEmail = "support@chathub.ai",
  contactPhone = "+1 (555) 123-4567",
  socialLinks = {},

}: MaintenancePageProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900 text-white"
      case "light":
        return "bg-white text-gray-900"
      default:
        return "bg-gray-900 text-white dark:bg-gray-900 dark:text-white"
    }
  }

  const getAccentColor = () => {
    switch (theme) {
      case "dark":
        return "text-blue-400"
      case "light":
        return "text-blue-600"
      default:
        return "text-blue-400 dark:text-blue-400"
    }
  }

  return (
    <div className={`min-h-screen ${getThemeClasses()} flex items-center justify-center p-4`}>
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <Image 
              src="/LOGO.png" 
              alt="ChatHub Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8"
            />
            <span className="font-bold text-2xl">ChatHub</span>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4">
          {customImage && (
            <div className="flex justify-center mb-8">
              <img 
                src={customImage} 
                alt="Maintenance" 
                className="max-w-xs h-auto"
              />
            </div>
          )}
          
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full bg-opacity-20 ${theme === "dark" ? "bg-blue-500" : "bg-blue-100"}`}>
              <Wrench className={`h-12 w-12 ${getAccentColor()}`} />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-6">
            {subtitle}
          </p>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-300 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        {showProgress && (
          <Card className={`max-w-md mx-auto ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Maintenance Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              {showEstimatedTime && (
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Estimated completion: {estimatedTime}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Status Updates */}
        <div className="max-w-2xl mx-auto">
          <Alert className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
            <Info className="h-4 w-4" />
            <AlertDescription>
              We're working hard to get everything back up and running. 
              You can check our status page for real-time updates.
            </AlertDescription>
          </Alert>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="min-w-[140px]"
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isRefreshing ? "Checking..." : "Check Again"}
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/status"}
            variant="outline"
            className="min-w-[140px]"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Status Page
          </Button>
        </div>

        {/* Contact Information */}
        {showContactInfo && (
          <div className="max-w-2xl mx-auto">
            <Card className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle className="text-center">Need Help?</CardTitle>
                <CardDescription className="text-center">
                  Get in touch with our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <a 
                      href={`mailto:${contactEmail}`}
                      className="hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <a 
                      href={`tel:${contactPhone}`}
                      className="hover:underline"
                    >
                      {contactPhone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Social Links */}
        {showSocialLinks && Object.keys(socialLinks).length > 0 && (
          <div className="flex items-center justify-center space-x-4">
            {socialLinks.twitter && (
              <a 
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {socialLinks.facebook && (
              <a 
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a 
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {socialLinks.instagram && (
              <a 
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {socialLinks.github && (
              <a 
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 mt-8">
          <p>© 2024 ChatHub AI. All rights reserved.</p>
          <p className="mt-2">
            Current time: {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Custom CSS and JS - Removed for security */}
      {/* Custom CSS and JS injection removed to prevent XSS attacks */}
    </div>
  )
} 