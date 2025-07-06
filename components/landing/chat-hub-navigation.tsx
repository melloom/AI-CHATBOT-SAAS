"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { 
  Home,
  Settings,
  CreditCard,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Bot,
  Globe
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function ChatHubNavigation() {
  const pathname = usePathname()
  const router = useRouter();

  const navigationItems = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: Home, 
      href: "/chathub",
      description: "Overview & Hero"
    },
    { 
      id: "services", 
      label: "Services", 
      icon: Settings, 
      href: "/chathub#services",
      description: "What We Offer"
    },
    { 
      id: "pricing", 
      label: "Pricing", 
      icon: CreditCard, 
      href: "/chathub#pricing",
      description: "Plans & Packages"
    },
    { 
      id: "testimonials", 
      label: "Testimonials", 
      icon: MessageCircle, 
      href: "/chathub#testimonials",
      description: "Customer Reviews"
    },
  ]

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleChangeService = () => {
    localStorage.removeItem('userServicePreference');
    localStorage.removeItem('hasVisitedSelection');
    router.push('/selection');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/chathub" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">ChatHub</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleSectionClick(item.id)}
                  className={`relative group ${
                    isActive 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
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

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <span className="sr-only">Open menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>

          {/* Auth Buttons and Theme Toggle - Far Right */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/login">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-slate-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <div 
                key={item.id} 
                onClick={() => handleSectionClick(item.id)}
                className={`block px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                  isActive 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
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
        </div>
      </div>
    </nav>
  )
} 