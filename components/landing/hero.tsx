import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Sparkles, Zap, Shield } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient opacity-10"></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 float"></div>
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-20 float"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-full text-sm font-medium text-purple-800 dark:text-purple-200 mb-8 border border-purple-200/50 dark:border-purple-700/50">
            <Sparkles className="w-4 h-4 mr-2" />🚀 Now with GPT-4 Turbo Integration
          </div>

          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Your Central Hub for
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                ChatHub
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create, manage, and deploy intelligent chatbots from one powerful platform. ChatHub connects your business with AI that actually works.
              <strong className="text-purple-600 dark:text-purple-400"> No coding. No complexity. Just results.</strong>
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-300">98.5% Response Accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-300">2.3s Average Response Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-300">10,000+ Happy Customers</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Zap className="mr-2 h-5 w-5" />
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 dark:text-white"
            >
              <Bot className="mr-2 h-5 w-5" />
              Watch Live Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <span>GDPR Compliant</span>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <span>99.9% Uptime SLA</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Join 500+ companies already using ChatHub</p>
          </div>
        </div>
      </div>
    </section>
  )
}
