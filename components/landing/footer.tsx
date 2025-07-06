import Link from "next/link"
import { Bot } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image 
                src="/LOGO.png" 
                alt="ChatHub Logo" 
                width={24} 
                height={24} 
                className="h-6 w-6"
              />
              <span className="font-bold text-xl">ChatHub</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              The leading AI customer support platform for businesses of all sizes. Create intelligent ChatHub solutions that
              provide 24/7 customer service.
            </p>
            <p className="text-sm text-gray-500">© 2024 ChatHub. All rights reserved.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-gray-400 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-400 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-gray-400 hover:text-white">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-gray-400 hover:text-white">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="https://wiredliving.blog" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/web-building" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="https://melvinworks.bio" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
