"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Bot } from "lucide-react"
import Image from "next/image"

export function LandingHeader() {
  const pathname = usePathname()
  
  // Determine the sign in link based on current path
  const signInLink = pathname === "/chathub" ? "/" : "/login"
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 glass-dark">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <Image 
            src="/LOGO.png" 
            alt="BuildFlow Logo" 
            width={24} 
            height={24} 
            className="h-6 w-6"
            priority
          />
          <span className="font-bold text-lg sm:text-xl dark:text-white">BuildFlow</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#services" className="text-sm font-medium hover:text-primary dark:text-gray-300 dark:hover:text-white">
            Services
          </Link>
          <Link href="/personal-ai-agents" className="text-sm font-medium hover:text-primary dark:text-gray-300 dark:hover:text-white">
            AI Agents
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary dark:text-gray-300 dark:hover:text-white">
            Pricing
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-primary dark:text-gray-300 dark:hover:text-white">
            Testimonials
          </Link>
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <Link href="/login">
            <Button size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
