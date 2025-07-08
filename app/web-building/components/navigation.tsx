"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { 
  Home,
  Settings,
  CreditCard,
  Server,
  Bot,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Globe,
  Building2,
  User,
  UserPlus,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface WebBuildingNavigationProps {
  activeSection?: string
  setActiveSection?: (section: string) => void
}

export function WebBuildingNavigation({ activeSection, setActiveSection }: WebBuildingNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: Globe, 
      href: "/web-building/home",
      description: "Overview & Hero"
    },
    { 
      id: "services", 
      label: "Services", 
      icon: Settings, 
      href: "/web-building/home?section=services",
      description: "What We Offer"
    },
    { 
      id: "pricing", 
      label: "Pricing", 
      icon: CreditCard, 
      href: "/web-building/home?section=pricing",
      description: "Plans & Packages"
    },
    { 
      id: "hosting", 
      label: "Hosting", 
      icon: Server, 
      href: "/web-building/home?section=hosting",
      description: "Infrastructure"
    },
    { 
      id: "chatbot", 
      label: "ChatHub", 
      icon: Bot, 
      href: "/web-building/home?section=chatbot",
      description: "AI Integration"
    },
    { 
      id: "contact", 
      label: "Contact", 
      icon: MessageCircle, 
      href: "/web-building/home?section=contact",
      description: "Get In Touch"
    },
  ]

  const handleSectionClick = (sectionId: string, href: string) => {
    if (setActiveSection) {
      setActiveSection(sectionId)
    } else {
      router.push(href)
    }
    // Close mobile menu after clicking
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between h-16 gap-x-2">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/web-building/home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">WV</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">WebVault</span>
            </Link>
          </div>

          {/* Navigation Items (desktop) */}
          <div className="hidden md:flex items-center gap-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 max-w-full flex-1">
            {navigationItems.map((item) => {
              const isActive = activeSection ? activeSection === item.id : pathname === item.href
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleSectionClick(item.id, item.href)}
                  className={`relative group whitespace-nowrap ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </Button>
              )
            })}
          </div>

          {/* Theme Toggle and Auth Buttons - Far Right (desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/signup?redirect=webvault'}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </Button>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => window.location.href = '/login?redirect=webvault'}
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Hidden by default, shown when menu is open */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = activeSection ? activeSection === item.id : pathname === item.href
              return (
                <div 
                  key={item.id} 
                  onClick={() => handleSectionClick(item.id, item.href)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}>
                  <div className="flex items-center">
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </div>
                  <div className="text-xs opacity-75 ml-6">{item.description}</div>
                </div>
              )
            })}
            
            {/* Auth Buttons (mobile) */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/signup?redirect=webvault'}
                className="w-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </Button>
              <Button 
                size="sm"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.location.href = '/login?redirect=webvault'}
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 