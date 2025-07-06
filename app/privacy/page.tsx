"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Lock, Users, Database, Globe } from "lucide-react"
import { EnhancedBackLink } from "@/components/ui/enhanced-back-button"

export default function PrivacyPolicyPage() {

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
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Privacy Policy</span>
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
                Privacy Policy
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                WebVault ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web development services and website.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-blue-600" />
                Information We Collect
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name and contact information (email, phone number)</li>
                    <li>Company information and project requirements</li>
                    <li>Payment and billing information</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Usage data and analytics</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-green-600" />
                How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and maintain our web development services</li>
                  <li>Process payments and manage billing</li>
                  <li>Communicate with you about your projects</li>
                  <li>Improve our services and user experience</li>
                  <li>Send important updates and notifications</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            {/* Information Sharing */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-purple-600" />
                Information Sharing
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-gray-300">
                <li>With your explicit consent</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and safety</li>
                <li>With trusted service providers who assist in our operations</li>
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-red-600" />
                Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-gray-300">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data transmission</li>
              </ul>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-orange-600" />
                Cookies and Tracking
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use cookies and similar technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p><strong>Essential Cookies:</strong> Required for basic website functionality</p>
                <p><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</p>
                <p><strong>Preference Cookies:</strong> Remember your settings and preferences</p>
              </div>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Rights
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-gray-300">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
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
                Updates to This Policy
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
} 