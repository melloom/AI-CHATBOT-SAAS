"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Cookie, Settings, Shield, Eye, Globe, Database } from "lucide-react"
import { EnhancedBackLink } from "@/components/ui/enhanced-back-button"

export default function CookiePolicyPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <EnhancedBackLink />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Cookie Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
          <div className="space-y-8">
            
            {/* Introduction */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Cookie Policy
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                This Cookie Policy explains how WebVault uses cookies and similar technologies when you visit our website and use our services. By using our website, you consent to the use of cookies in accordance with this policy.
              </p>
            </div>

            {/* What Are Cookies */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Cookie className="w-6 h-6 mr-2 text-orange-600" />
                What Are Cookies?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings.
                </p>
                <p>
                  Cookies can make your next visit easier and the site more useful to you. They play an important role in making websites work efficiently and providing information to website owners.
                </p>
              </div>
            </div>

            {/* Types of Cookies We Use */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-blue-600" />
                Types of Cookies We Use
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300">
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    Essential Cookies
                  </h3>
                  <p className="mb-2">These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Authentication and security cookies</li>
                    <li>Session management cookies</li>
                    <li>Load balancing cookies</li>
                    <li>User interface customization cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-purple-600" />
                    Analytics Cookies
                  </h3>
                  <p className="mb-2">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Google Analytics cookies</li>
                    <li>Page view and session tracking</li>
                    <li>User behavior analysis</li>
                    <li>Performance monitoring</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-yellow-600" />
                    Preference Cookies
                  </h3>
                  <p className="mb-2">These cookies allow the website to remember choices you make and provide enhanced, more personal features.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Language preferences</li>
                    <li>Theme and display preferences</li>
                    <li>Form data retention</li>
                    <li>User interface settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-red-600" />
                    Marketing Cookies
                  </h3>
                  <p className="mb-2">These cookies are used to track visitors across websites to display relevant and engaging advertisements.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Social media integration cookies</li>
                    <li>Advertising tracking cookies</li>
                    <li>Retargeting cookies</li>
                    <li>Campaign performance tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Third-Party Cookies */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Third-Party Cookies
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  We may use third-party services that place cookies on your device. These services help us provide better functionality and analyze website usage.
                </p>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Third-party services we use:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Google Analytics:</strong> Website analytics and performance tracking</li>
                    <li><strong>Google Fonts:</strong> Custom typography for better user experience</li>
                    <li><strong>Formspree:</strong> Contact form processing and email management</li>
                    <li><strong>Social Media Platforms:</strong> Integration with social media features</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Managing Cookies */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Managing Your Cookie Preferences
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  You can control and manage cookies in several ways. Please note that removing or blocking cookies may impact your user experience and some parts of our website may not function properly.
                </p>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Browser Settings</h3>
                  <p className="mb-2">Most web browsers allow you to manage cookies through their settings:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Chrome: Settings → Privacy and security → Cookies and other site data</li>
                    <li>Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                    <li>Safari: Preferences → Privacy → Manage Website Data</li>
                    <li>Edge: Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cookie Consent</h3>
                  <p>
                    When you first visit our website, you'll see a cookie consent banner. You can choose which types of cookies to accept or reject. You can change these preferences at any time by clicking the cookie settings link in our footer.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Opt-Out Links</h3>
                  <p className="mb-2">For third-party cookies, you can opt out directly:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Opt-out</a></li>
                    <li>Social Media: Manage preferences through your social media account settings</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cookie Duration */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Cookie Duration
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Session Cookies</h3>
                  <p>These cookies are temporary and are deleted when you close your browser.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Persistent Cookies</h3>
                  <p>These cookies remain on your device for a set period or until you delete them manually.</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Typical cookie durations:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Essential cookies: Session duration or up to 1 year</li>
                    <li>Analytics cookies: Up to 2 years</li>
                    <li>Preference cookies: Up to 1 year</li>
                    <li>Marketing cookies: Up to 2 years</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Updates to Policy */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Updates to This Policy
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Email:</strong> melvin.a.p.cruz@gmail.com
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Phone:</strong> +1 (667) 200-9784
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Address:</strong> Maryland, USA
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
} 