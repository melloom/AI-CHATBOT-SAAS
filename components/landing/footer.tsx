import Link from "next/link"
import { Bot, Globe, Mail, Phone, MapPin, Twitter, Linkedin, Github, ArrowRight, Zap, Shield, Users, Star } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Image 
                  src="/LOGO.png" 
                  alt="ChatHub Logo" 
                  width={28} 
                  height={28} 
                  className="h-7 w-7"
                />
              </div>
              <div>
                <span className="font-bold text-3xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">ChatHub</span>
                <p className="text-sm text-gray-400 font-medium">AI-Powered Solutions</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8 max-w-md leading-relaxed text-lg">
              The leading AI customer support platform for businesses of all sizes. Create intelligent ChatHub solutions that
              provide 24/7 customer service and transform your business operations.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors group">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-medium">hello@chathub.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors group">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors group">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-medium">Maryland, USA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              <Link href="#" className="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-xl mb-8 text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-400" />
              Product
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="#features" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium">
                  <span>Features</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link href="/personal-ai-agents" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium">
                  <span>AI Agents</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium">
                  <span>Pricing</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium">
                  <span>Templates</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium">
                  <span>Integrations</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-xl mb-8 text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              Company
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium">
                  <span>About</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link href="https://wiredliving.blog" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium" target="_blank" rel="noopener noreferrer">
                  <span>Blog</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium">
                  <span>FAQ</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium">
                  <span>Contact</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-xl mb-8 text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-400" />
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium">
                  <span>Privacy Policy</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium">
                  <span>Terms of Service</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium">
                  <span>Cookie Policy</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              <li>
                <Link href="https://melvinworks.bio" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group font-medium" target="_blank" rel="noopener noreferrer">
                  <span>Portfolio</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/50 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-blue-400" />
              <p className="text-sm text-gray-400 font-medium">
                © 2024 ChatHub. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <span className="text-red-400 mr-1">❤️</span>
                Made in Maryland
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center">
                <Bot className="w-4 h-4 mr-1 text-blue-400" />
                Powered by AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

