"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Shield, CreditCard, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import { EnhancedBackLink } from "@/components/ui/enhanced-back-button"

export default function TermsOfServicePage() {

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
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Terms of Service</span>
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
                Terms of Service
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                These Terms of Service ("Terms") govern your use of WebVault's web development services and website. By using our services, you agree to be bound by these Terms.
              </p>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                Services
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  WebVault provides professional web development services including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Custom website development and design</li>
                  <li>E-commerce website solutions</li>
                  <li>Website hosting and maintenance</li>
                  <li>Performance optimization and SEO</li>
                  <li>Technical support and consultation</li>
                  <li>ChatHub integration services</li>
                </ul>
              </div>
            </div>

            {/* User Obligations */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-600" />
                User Obligations
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>By using our services, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Use our services for lawful purposes only</li>
                  <li>Not interfere with our systems or services</li>
                  <li>Respect intellectual property rights</li>
                  <li>Pay all fees in a timely manner</li>
                </ul>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-purple-600" />
                Payment Terms
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pricing</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>All prices are quoted in USD unless otherwise stated</li>
                    <li>Prices are subject to change with 30 days notice</li>
                    <li>Custom project pricing is provided in writing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Schedule</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>50% deposit required to begin work</li>
                    <li>Remaining balance due upon project completion</li>
                    <li>Recurring services billed monthly or annually</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Late Payments</h3>
                  <p>Late payments may result in service suspension and additional fees.</p>
                </div>
              </div>
            </div>

            {/* Project Terms */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-orange-600" />
                Project Terms
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Timeline</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Project timelines are estimates and may vary</li>
                    <li>Delays due to client feedback will extend timeline</li>
                    <li>Rush projects may incur additional fees</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Revisions</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Two rounds of revisions included in standard packages</li>
                    <li>Additional revisions billed at hourly rate</li>
                    <li>Major scope changes may require new quote</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deliverables</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Final website files and documentation</li>
                    <li>Source code and assets (where applicable)</li>
                    <li>Training and handover documentation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-red-600" />
                Intellectual Property
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>Upon full payment, you own:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Final website design and content</li>
                  <li>Custom code developed for your project</li>
                  <li>Graphics and assets created specifically for you</li>
                </ul>
                <p className="mt-4">We retain rights to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Our proprietary frameworks and tools</li>
                  <li>Portfolio usage of completed work</li>
                  <li>Third-party components and libraries</li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-yellow-600" />
                Limitation of Liability
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  WebVault's liability is limited to the amount paid for services. We are not liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Indirect or consequential damages</li>
                  <li>Loss of profits or business interruption</li>
                  <li>Third-party service issues</li>
                  <li>Client content or data loss</li>
                </ul>
              </div>
            </div>

            {/* Termination */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Termination
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>Either party may terminate services with written notice:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>30 days notice for ongoing services</li>
                  <li>Immediate termination for breach of terms</li>
                  <li>Pro-rated refunds for prepaid services</li>
                  <li>Handover of completed work and assets</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us:
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

            {/* Updates */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Updates to These Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
} 