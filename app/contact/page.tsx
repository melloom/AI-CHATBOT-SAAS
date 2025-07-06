"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Globe, Shield, Zap, Users, Building2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"

// Client component for contact page with form functionality

export default function ContactPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    websiteType: '',
    designStyle: '',
    features: [] as string[],
    budget: '',
    timeline: '',
    techStack: '',
    subject: '',
    message: '',
    service: 'general',
    experience: '',
    skills: '',
    collaborationType: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Handle URL parameters for pre-filling form
  useEffect(() => {
    const subject = searchParams.get('subject')
    if (subject === 'career-opportunity') {
      setFormData(prev => ({
        ...prev,
        subject: 'Collaboration Opportunity',
        service: 'consulting'
      }))
    }
  }, [searchParams])

  // Check if this is a career inquiry
  const isCareerInquiry = searchParams.get('subject') === 'career-opportunity'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        websiteType: '',
        designStyle: '',
        features: [],
        budget: '',
        timeline: '',
        techStack: '',
        subject: '',
        message: '',
        service: 'general',
        experience: '',
        skills: '',
        collaborationType: ''
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }, 2000)
  }

  const services = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'chatbot-integration', label: 'Chatbot Integration' },
    { value: 'hosting', label: 'Hosting Services' },
    { value: 'maintenance', label: 'Website Maintenance' },
    { value: 'consulting', label: 'Consulting' }
  ]

  const websiteTypes = [
    { value: 'business-website', label: 'Business Website' },
    { value: 'ecommerce-store', label: 'E-commerce Store' },
    { value: 'portfolio-site', label: 'Portfolio Site' },
    { value: 'blog-news', label: 'Blog/News Site' },
    { value: 'landing-page', label: 'Landing Page' },
    { value: 'saas-application', label: 'SaaS Application' },
    { value: 'restaurant-food', label: 'Restaurant/Food' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'healthcare-medical', label: 'Healthcare/Medical' },
    { value: 'educational', label: 'Educational' },
    { value: 'non-profit', label: 'Non-Profit' },
    { value: 'other', label: 'Other' }
  ]

  const designStyles = [
    { value: 'modern-minimalist', label: 'Modern & Minimalist' },
    { value: 'classic-professional', label: 'Classic & Professional' },
    { value: 'bold-creative', label: 'Bold & Creative' },
    { value: 'warm-friendly', label: 'Warm & Friendly' },
    { value: 'luxury-premium', label: 'Luxury & Premium' },
    { value: 'playful-fun', label: 'Playful & Fun' },
    { value: 'tech-futuristic', label: 'Tech & Futuristic' },
    { value: 'not-sure', label: 'Not sure - need guidance' }
  ]

  const techStacks = [
    { value: 'wordpress', label: 'WordPress - Easy to update content yourself' },
    { value: 'react-nextjs', label: 'Custom built - Modern and super fast' },
    { value: 'shopify', label: 'Shopify - Perfect for online stores' },
    { value: 'webflow', label: 'Webflow - Great for beautiful designs' },
    { value: 'php-laravel', label: 'Custom built - Full control over everything' },
    { value: 'not-sure', label: 'Not sure - help me choose the best option' }
  ]

  const features = [
    {
      icon: Globe,
      title: "Global Support",
      description: "24/7 support across all time zones"
    },
    {
      icon: Shield,
      title: "Secure Communication",
      description: "Enterprise-grade security for all communications"
    },
    {
      icon: Zap,
      title: "Fast Response",
      description: "Average response time under 2 hours"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Certified professionals ready to help"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/5 to-purple-100/10 dark:from-background dark:via-purple-900/20 dark:to-purple-800/10">
      {/* Logo Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/LOGO.png" 
                alt="ChatHub Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8"
                priority
              />
              <span className="font-bold text-2xl text-foreground">ChatHub</span>
            </Link>
            
            {/* Back Button */}
            <EnhancedBackButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              {isCareerInquiry ? 'Collaboration Opportunities' : 'Get In Touch'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {isCareerInquiry ? 'Let\'s Collaborate!' : "Let's Build Something Amazing Together"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {isCareerInquiry 
                ? "I'm a solo developer open to exciting collaboration opportunities. Whether you want to join my projects or have me join yours, let's discuss how we can work together to create amazing things."
                : "Ready to transform your business with cutting-edge web development and AI chatbot solutions? Our expert team is here to turn your vision into reality."
              }
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/30 dark:from-card dark:to-purple-900/10">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {isCareerInquiry ? 'Let\'s Discuss Collaboration' : 'Start Your Project'}
                  </CardTitle>
                  <CardDescription>
                    {isCareerInquiry 
                      ? "Share your background and what you're looking for, and I'll get back to you within 24 hours to discuss potential collaboration opportunities."
                      : "Tell us about your project and we'll get back to you within 24 hours with a detailed proposal."
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 dark:text-green-200">Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-800 dark:text-red-200">Something went wrong. Please try again or contact us directly.</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {isCareerInquiry ? (
                      // Collaboration Form
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input 
                              id="firstName" 
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="John" 
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input 
                              id="lastName" 
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Doe" 
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input 
                              id="email" 
                              name="email"
                              type="email" 
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com" 
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Current Role/Company</Label>
                            <Input 
                              id="company" 
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              placeholder="Your current role or company" 
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="experience">Years of Experience</Label>
                            <select 
                              id="experience" 
                              name="experience"
                              value={formData.experience || ''}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select experience level</option>
                              <option value="0-1 years">0-1 years (Junior)</option>
                              <option value="2-3 years">2-3 years (Mid-level)</option>
                              <option value="4-6 years">4-6 years (Senior)</option>
                              <option value="7+ years">7+ years (Expert)</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="skills">Primary Skills</Label>
                            <select 
                              id="skills" 
                              name="skills"
                              value={formData.skills || ''}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select your main skills</option>
                              <option value="Frontend Development">Frontend Development (React, Vue, Angular)</option>
                              <option value="Backend Development">Backend Development (Node.js, Python, PHP)</option>
                              <option value="Full Stack Development">Full Stack Development</option>
                              <option value="UI/UX Design">UI/UX Design</option>
                              <option value="DevOps">DevOps & Infrastructure</option>
                              <option value="Mobile Development">Mobile Development</option>
                              <option value="AI/ML">AI/ML Development</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="collaborationType">What type of collaboration are you looking for?</Label>
                          <select 
                            id="collaborationType" 
                            name="collaborationType"
                            value={formData.collaborationType || ''}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                          >
                            <option value="">Select collaboration type</option>
                            <option value="Join your projects">Join your projects</option>
                            <option value="You join my projects">You join my projects</option>
                            <option value="Partnership">Partnership on new projects</option>
                            <option value="Freelance work">Freelance work</option>
                            <option value="Mentorship">Mentorship/Knowledge sharing</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="subject">Subject *</Label>
                          <Input 
                            id="subject" 
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Brief description of your interest" 
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="message">Tell me about yourself and what you're looking for *</Label>
                          <Textarea 
                            id="message" 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Share your background, experience, what you're passionate about, and how you'd like to collaborate. What projects interest you? What skills do you bring to the table?"
                            rows={6}
                            required
                          />
                        </div>
                      </>
                    ) : (
                      // Regular Project Form
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input 
                              id="firstName" 
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="John" 
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input 
                              id="lastName" 
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Doe" 
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input 
                              id="email" 
                              name="email"
                              type="email" 
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com" 
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Company</Label>
                            <Input 
                              id="company" 
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              placeholder="Your Company" 
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="service">Service Type *</Label>
                            <select 
                              id="service" 
                              name="service"
                              value={formData.service}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                              required
                            >
                              {services.map(service => (
                                <option key={service.value} value={service.value}>
                                  {service.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="websiteType">Website Type</Label>
                            <select 
                              id="websiteType" 
                              name="websiteType"
                              value={formData.websiteType}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select website type</option>
                              {websiteTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="designStyle">Design Style Preference</Label>
                            <select 
                              id="designStyle" 
                              name="designStyle"
                              value={formData.designStyle}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select design style</option>
                              {designStyles.map(style => (
                                <option key={style.value} value={style.value}>
                                  {style.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="techStack">Website Platform Preference</Label>
                            <select 
                              id="techStack" 
                              name="techStack"
                              value={formData.techStack}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">How would you like to manage your website?</option>
                              {techStacks.map(tech => (
                                <option key={tech.value} value={tech.value}>
                                  {tech.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label>Key Features Needed</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            {[
                              'Contact Forms', 'Blog/News', 'E-commerce', 'User Accounts',
                              'Payment Processing', 'Booking System', 'Gallery/Portfolio', 'Testimonials',
                              'Newsletter Signup', 'Social Media Integration', 'Search Function', 'Multi-language',
                              'Admin Dashboard', 'Analytics', 'Chat Support', 'Mobile App'
                            ].map(feature => (
                              <label key={feature} className="flex items-center space-x-2 text-sm text-foreground">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                                  onChange={(e) => {
                                    const newFeatures = e.target.checked 
                                      ? [...formData.features, feature]
                                      : formData.features.filter(f => f !== feature)
                                    setFormData(prev => ({ ...prev, features: newFeatures }))
                                  }}
                                  checked={formData.features.includes(feature)}
                                />
                                <span>{feature}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <Label htmlFor="budget">Budget Range</Label>
                            <select 
                              id="budget" 
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select budget</option>
                              <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                              <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                              <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                              <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                              <option value="$20,000+">$20,000+</option>
                              <option value="Need to discuss">Need to discuss</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="timeline">Timeline</Label>
                            <select 
                              id="timeline" 
                              name="timeline"
                              value={formData.timeline}
                              onChange={handleInputChange}
                              className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                            >
                              <option value="">Select timeline</option>
                              <option value="ASAP (1-2 weeks)">ASAP (1-2 weeks)</option>
                              <option value="1-2 months">1-2 months</option>
                              <option value="2-3 months">2-3 months</option>
                              <option value="3-6 months">3-6 months</option>
                              <option value="No rush">No rush</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="subject">Subject *</Label>
                            <Input 
                              id="subject" 
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              placeholder="How can we help?" 
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="message">Project Details *</Label>
                          <Textarea 
                            id="message" 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell us more about your project, goals, target audience, competitors, or any specific requirements..."
                            rows={6}
                            required
                          />
                        </div>
                      </>
                                         )}

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <select 
                          id="budget" 
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                        >
                          <option value="">Select budget</option>
                          <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                          <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                          <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                          <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                          <option value="$20,000+">$20,000+</option>
                          <option value="Need to discuss">Need to discuss</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="timeline">Timeline</Label>
                        <select 
                          id="timeline" 
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full mt-1 p-3 border rounded-md bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:border-ring"
                        >
                          <option value="">Select timeline</option>
                          <option value="ASAP (1-2 weeks)">ASAP (1-2 weeks)</option>
                          <option value="1-2 months">1-2 months</option>
                          <option value="2-3 months">2-3 months</option>
                          <option value="3-6 months">3-6 months</option>
                          <option value="No rush">No rush</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input 
                          id="subject" 
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="How can we help?" 
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Project Details *</Label>
                      <Textarea 
                        id="message" 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your project, goals, target audience, competitors, or any specific requirements..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/20 dark:from-card dark:to-purple-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <span>Get in touch</span>
                  </CardTitle>
                  <CardDescription>
                    We'd love to hear from you. Here's how you can reach us.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-muted-foreground">melvin.a.p.cruz@gmail.com</p>
                      <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <p className="text-muted-foreground">+1 (667) 200-9784</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Location</h3>
                      <p className="text-muted-foreground">Maryland, USA</p>
                      <p className="text-sm text-muted-foreground">Remote work available</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Business Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday: 9AM - 6PM EST</p>
                      <p className="text-sm text-muted-foreground">Weekend support for Enterprise</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/20 dark:from-card dark:to-purple-900/10">
                <CardHeader>
                  <CardTitle>Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/20 dark:from-card dark:to-purple-900/10">
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-foreground">ChatHub Platform</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">Explore our AI chatbot solutions</p>
                  </Link>
                  
                  <Link href="/web-building" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-foreground">Web Development</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">Professional website services</p>
                  </Link>
                  
                  <Link href="/dashboard" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-foreground">Dashboard</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">Access your account</p>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
} 