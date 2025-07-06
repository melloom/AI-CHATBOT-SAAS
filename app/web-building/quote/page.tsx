"use client"

import { QuoteWidget } from "../components/quote-widget"
import { WebBuildingNavigation } from "../components/navigation"

export default function QuotePage() {
  const handleQuoteSubmit = (data: any) => {
    // Submit to Formspree
    const formData = new FormData()
    formData.append('service_type', 'quote_request')
    formData.append('source', 'quote_widget')
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('website_type', data.websiteType)
    formData.append('features', data.features.join(', '))
    formData.append('timeline', data.timeline)
    formData.append('estimated_price', data.quote.totalPrice.toString())
    
    fetch('https://formspree.io/f/mgvylnze', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        alert('Thank you! Your quote request has been submitted. We\'ll send you a detailed proposal within 24 hours.')
      } else {
        alert('There was an error submitting your request. Please try again.')
      }
    })
    .catch(error => {
      console.error('Error:', error)
      alert('There was an error submitting your request. Please try again.')
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <WebBuildingNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get Your Instant Quote
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Fill out the form below and get a rough estimate for your website project. 
            Our pricing is transparent and based on your specific requirements.
          </p>
        </div>
        
        <QuoteWidget onQuoteSubmit={handleQuoteSubmit} />
      </main>
    </div>
  )
} 