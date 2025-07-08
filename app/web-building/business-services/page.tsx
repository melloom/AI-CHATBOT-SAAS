"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Building2, 
  Scale, 
  Shield, 
  FileText, 
  Users, 
  Globe, 
  TrendingUp,
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  Zap,
  Database,
  Smartphone,
  Headphones,
  Palette,
  Briefcase,
  Gavel,
  Calculator,
  Target,
  AlertTriangle,
  Globe2,
  Heart,
  DollarSign,
  Calendar,
  Info
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EnhancedBackButton } from "@/components/ui/enhanced-back-button"
import { companyServices, industryServices, consultingServices } from "@/lib/pricing-config"

export default function BusinessServicesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const legalServices = companyServices.map(service => ({
    ...service,
    icon: service.name.includes("Formation") ? Building2 :
          service.name.includes("Plan") ? FileText :
          service.name.includes("Templates") ? FileText :
          service.name.includes("Compliance") ? Shield :
          service.name.includes("Intellectual") ? Target :
          service.name.includes("Tax") ? Calculator :
          service.name.includes("HR") ? Users :
          service.name.includes("Data") ? Database :
          service.name.includes("Contract") ? Gavel :
          service.name.includes("Governance") ? Briefcase : Scale
  }))

  const industrySpecific = industryServices.map(service => ({
    ...service,
    icon: service.name.includes("Healthcare") ? Shield :
          service.name.includes("Financial") ? Calculator :
          service.name.includes("E-commerce") ? Globe :
          service.name.includes("SaaS") ? Database :
          service.name.includes("Real Estate") ? Building2 :
          service.name.includes("Restaurant") ? Users :
          service.name.includes("Technology") ? Zap :
          service.name.includes("Non-Profit") ? Heart : Briefcase
  }))

  const consulting = consultingServices.map(service => ({
    ...service,
    icon: service.name.includes("Strategy") ? Target :
          service.name.includes("Financial") ? Calculator :
          service.name.includes("Risk") ? AlertTriangle :
          service.name.includes("Mergers") ? TrendingUp :
          service.name.includes("International") ? Globe2 :
          service.name.includes("Crisis") ? AlertTriangle : Briefcase
  }))

  // Detailed service information for popups
  const serviceDetails = {
    "Company Formation & Legal Setup": {
      title: "Company Formation & Legal Setup",
      description: "Complete business setup from start to finish",
      price: "$500",
      duration: "3-5 business days",
      includes: [
        "Business name registration and approval",
        "Articles of incorporation/organization",
        "Federal EIN (Employer Identification Number)",
        "State business license application",
        "Operating agreement or bylaws",
        "Business bank account setup guidance",
        "Compliance calendar and reminders",
        "Digital document storage"
      ],
      process: [
        "Initial consultation and business structure review",
        "Name availability check and reservation",
        "Document preparation and filing",
        "Government agency coordination",
        "Final documentation delivery"
      ],
      whyThisPrice: "Our $500 fee covers all government filing fees, document preparation, and ongoing support. Most competitors charge $800+ for the same services."
    },
    "Business Plan Development": {
      title: "Business Plan Development",
      description: "Professional business plan for funding and growth",
      price: "$1,200",
      duration: "7-10 business days",
      includes: [
        "Executive summary and company overview",
        "Market analysis and competitive research",
        "Marketing and sales strategy",
        "Financial projections (3-5 years)",
        "Funding requirements and use of funds",
        "Risk analysis and mitigation strategies",
        "Executive presentation deck",
        "Investor-ready formatting"
      ],
      process: [
        "Business model analysis and strategy session",
        "Market research and competitive analysis",
        "Financial modeling and projections",
        "Document writing and refinement",
        "Final review and presentation preparation"
      ],
      whyThisPrice: "Professional business plans typically cost $2,500-$5,000. Our streamlined process and templates allow us to deliver quality plans at $1,200."
    },
    "Legal Document Templates": {
      title: "Legal Document Templates",
      description: "Comprehensive legal document library",
      price: "$300",
      duration: "Immediate access",
      includes: [
        "Employment contracts and agreements",
        "Non-disclosure agreements (NDAs)",
        "Service agreements and contracts",
        "Privacy policies and terms of service",
        "Intellectual property protection documents",
        "Compliance policies and procedures",
        "Customizable templates for your industry",
        "Legal guidance for document usage"
      ],
      process: [
        "Industry-specific template selection",
        "Customization for your business needs",
        "Legal review and compliance check",
        "Document delivery and implementation guidance"
      ],
      whyThisPrice: "Individual legal documents can cost $300-800 each. Our comprehensive library provides 20+ templates for $300 total."
    },
    "Compliance & Regulatory Services": {
      title: "Compliance & Regulatory Services",
      description: "Ongoing compliance monitoring and support",
      price: "$800",
      duration: "Ongoing service",
      includes: [
        "Regulatory change monitoring",
        "Compliance calendar and deadlines",
        "Policy updates and documentation",
        "Training materials and workshops",
        "Audit preparation and support",
        "Risk assessment and reporting",
        "24/7 compliance hotline",
        "Quarterly compliance reviews"
      ],
      process: [
        "Initial compliance assessment",
        "Policy development and implementation",
        "Ongoing monitoring and updates",
        "Regular reporting and reviews"
      ],
      whyThisPrice: "In-house compliance officers cost $60,000-100,000 annually. Our service provides professional compliance support for $800."
    },
    "Intellectual Property Protection": {
      title: "Intellectual Property Protection",
      description: "Comprehensive IP strategy and protection",
      price: "$600",
      duration: "2-4 weeks",
      includes: [
        "IP audit and strategy development",
        "Trademark search and registration",
        "Copyright registration assistance",
        "Patent application guidance",
        "Trade secret protection strategies",
        "IP licensing agreements",
        "Infringement monitoring",
        "IP portfolio management"
      ],
      process: [
        "IP audit and strategy session",
        "Search and clearance analysis",
        "Application preparation and filing",
        "Ongoing monitoring and enforcement"
      ],
      whyThisPrice: "Individual IP services cost $800-3,000 each. Our comprehensive package covers all IP needs for $600."
    },
    "Tax Planning & Setup": {
      title: "Tax Planning & Setup",
      description: "Comprehensive tax strategy and compliance",
      price: "$400",
      duration: "1-2 weeks",
      includes: [
        "Business tax structure analysis",
        "Tax optimization strategies",
        "Accounting system setup",
        "Tax calendar and deadlines",
        "Quarterly tax planning",
        "Tax compliance monitoring",
        "Deduction maximization",
        "Tax software recommendations"
      ],
      process: [
        "Tax structure review and optimization",
        "Accounting system implementation",
        "Tax calendar setup and monitoring",
        "Ongoing tax planning and support"
      ],
      whyThisPrice: "Professional tax services typically cost $800-2,000 annually. Our comprehensive service is $400 with ongoing support."
    },
    "HR & Employment Law": {
      title: "HR & Employment Law",
      description: "Complete HR framework and employment compliance",
      price: "$350",
      duration: "1-2 weeks",
      includes: [
        "Employment contracts and agreements",
        "Employee handbook development",
        "HR policies and procedures",
        "Workplace safety compliance",
        "Equal employment opportunity policies",
        "Performance management systems",
        "Disciplinary procedures",
        "HR compliance training"
      ],
      process: [
        "HR audit and needs assessment",
        "Policy development and documentation",
        "Legal review and compliance check",
        "Implementation guidance and training"
      ],
      whyThisPrice: "HR legal services typically cost $500-1,500. Our comprehensive package provides all HR legal needs for $350."
    },
    "Data Protection & GDPR": {
      title: "Data Protection & GDPR",
      description: "Complete data privacy and protection framework",
      price: "$450",
      duration: "2-3 weeks",
      includes: [
        "Privacy policy development",
        "Data protection impact assessments",
        "GDPR compliance framework",
        "Data processing agreements",
        "Cookie consent mechanisms",
        "Data breach response plan",
        "Privacy training materials",
        "Ongoing compliance monitoring"
      ],
      process: [
        "Data audit and privacy assessment",
        "Policy development and implementation",
        "Technical compliance measures",
        "Training and ongoing support"
      ],
      whyThisPrice: "Data protection services typically cost $800-2,000. Our comprehensive GDPR package is $450."
    },
    "Contract Review & Negotiation": {
      title: "Contract Review & Negotiation",
      description: "Professional contract analysis and negotiation support",
      price: "$200/hour",
      duration: "1-3 days per contract",
      includes: [
        "Contract analysis and risk assessment",
        "Legal review and recommendations",
        "Negotiation strategy development",
        "Contract revision and drafting",
        "Legal compliance verification",
        "Risk mitigation strategies",
        "Contract template development",
        "Ongoing contract support"
      ],
      process: [
        "Initial contract review and analysis",
        "Risk assessment and recommendations",
        "Negotiation strategy and execution",
        "Final contract review and approval"
      ],
      whyThisPrice: "Legal contract review typically costs $300-500/hour. Our specialized service is $200/hour with comprehensive support."
    },
    "Corporate Governance": {
      title: "Corporate Governance",
      description: "Complete corporate governance framework",
      price: "$750",
      duration: "2-4 weeks",
      includes: [
        "Board structure and bylaws",
        "Corporate governance policies",
        "Board meeting procedures",
        "Conflict of interest policies",
        "Corporate compliance framework",
        "Board member training",
        "Governance reporting systems",
        "Ongoing governance support"
      ],
      process: [
        "Governance assessment and planning",
        "Policy development and documentation",
        "Board structure implementation",
        "Training and ongoing support"
      ],
      whyThisPrice: "Corporate governance services typically cost $1,500-3,000. Our comprehensive framework is $750."
    },
    "Healthcare Compliance (HIPAA)": {
      title: "Healthcare Compliance (HIPAA)",
      description: "Complete HIPAA compliance framework for healthcare organizations",
      price: "$1,500",
      duration: "3-4 weeks",
      includes: [
        "HIPAA compliance assessment",
        "Privacy and security policies",
        "Employee training programs",
        "Technical safeguards implementation",
        "Physical safeguards setup",
        "Administrative safeguards",
        "Breach notification procedures",
        "Ongoing compliance monitoring"
      ],
      process: [
        "Initial HIPAA gap analysis",
        "Policy development and implementation",
        "Technical and physical safeguards",
        "Training and ongoing support"
      ],
      whyThisPrice: "HIPAA compliance services typically cost $3,000-8,000. Our comprehensive package is $1,500 with ongoing support."
    },
    "Financial Services Compliance": {
      title: "Financial Services Compliance",
      description: "FINRA, SEC, and financial regulatory compliance",
      price: "$2,000",
      duration: "4-6 weeks",
      includes: [
        "FINRA compliance framework",
        "SEC reporting requirements",
        "Anti-money laundering (AML) setup",
        "Know Your Customer (KYC) procedures",
        "Risk management policies",
        "Compliance monitoring systems",
        "Regulatory reporting templates",
        "Ongoing compliance support"
      ],
      process: [
        "Regulatory requirements assessment",
        "Compliance framework development",
        "Policy implementation and training",
        "Ongoing monitoring and reporting"
      ],
      whyThisPrice: "Financial compliance services typically cost $5,000-15,000. Our comprehensive package is $2,000."
    },
    "E-commerce Legal Package": {
      title: "E-commerce Legal Package",
      description: "Complete legal framework for online businesses",
      price: "$800",
      duration: "2-3 weeks",
      includes: [
        "Terms of service development",
        "Privacy policy creation",
        "Return and refund policies",
        "Shipping and delivery terms",
        "Payment processing agreements",
        "Customer service policies",
        "Data protection compliance",
        "Ongoing legal support"
      ],
      process: [
        "E-commerce legal assessment",
        "Policy development and drafting",
        "Legal review and compliance check",
        "Implementation and ongoing support"
      ],
      whyThisPrice: "E-commerce legal services typically cost $1,500-3,000. Our comprehensive package is $800."
    },
    "SaaS Legal Framework": {
      title: "SaaS Legal Framework",
      description: "Complete legal framework for SaaS businesses",
      price: "$1,200",
      duration: "3-4 weeks",
      includes: [
        "SaaS subscription agreements",
        "Service level agreements (SLAs)",
        "Data processing agreements",
        "API usage terms",
        "Intellectual property protection",
        "Customer support policies",
        "Billing and payment terms",
        "Ongoing legal support"
      ],
      process: [
        "SaaS legal requirements assessment",
        "Agreement development and drafting",
        "Legal review and compliance check",
        "Implementation and ongoing support"
      ],
      whyThisPrice: "SaaS legal services typically cost $2,500-5,000. Our comprehensive framework is $1,200."
    },
    "Real Estate Legal Services": {
      title: "Real Estate Legal Services",
      description: "Complete legal framework for real estate businesses",
      price: "$900",
      duration: "2-4 weeks",
      includes: [
        "Property purchase agreements",
        "Lease and rental agreements",
        "Real estate compliance policies",
        "Property management contracts",
        "Title and escrow services",
        "Real estate licensing compliance",
        "Property tax optimization",
        "Ongoing legal support"
      ],
      process: [
        "Real estate legal assessment",
        "Agreement development and drafting",
        "Compliance review and implementation",
        "Ongoing support and updates"
      ],
      whyThisPrice: "Real estate legal services typically cost $2,000-4,000. Our comprehensive package is $900."
    },
    "Restaurant & Food Service": {
      title: "Restaurant & Food Service",
      description: "Complete legal framework for food service businesses",
      price: "$600",
      duration: "2-3 weeks",
      includes: [
        "Food safety compliance policies",
        "Restaurant licensing assistance",
        "Employment law compliance",
        "Health and safety protocols",
        "Liquor license applications",
        "Food handling regulations",
        "Customer service policies",
        "Ongoing compliance support"
      ],
      process: [
        "Restaurant legal requirements assessment",
        "Policy development and implementation",
        "Licensing and compliance setup",
        "Ongoing support and monitoring"
      ],
      whyThisPrice: "Restaurant legal services typically cost $1,200-2,500. Our comprehensive package is $600."
    },
    "Technology & Software": {
      title: "Technology & Software",
      description: "Complete legal framework for technology companies",
      price: "$1,000",
      duration: "3-4 weeks",
      includes: [
        "Software licensing agreements",
        "Open source compliance",
        "Intellectual property protection",
        "Technology transfer agreements",
        "Software development contracts",
        "API and integration agreements",
        "Data protection compliance",
        "Ongoing legal support"
      ],
      process: [
        "Technology legal assessment",
        "Agreement development and drafting",
        "Compliance review and implementation",
        "Ongoing support and updates"
      ],
      whyThisPrice: "Technology legal services typically cost $2,500-6,000. Our comprehensive framework is $1,000."
    },
    "Non-Profit & Charity": {
      title: "Non-Profit & Charity",
      description: "Complete legal framework for non-profit organizations",
      price: "$400",
      duration: "2-3 weeks",
      includes: [
        "501(c)(3) application assistance",
        "Non-profit governance policies",
        "Charitable solicitation compliance",
        "Board structure and bylaws",
        "Fundraising legal compliance",
        "Tax-exempt status maintenance",
        "Volunteer and employment policies",
        "Ongoing legal support"
      ],
      process: [
        "Non-profit legal assessment",
        "Application preparation and filing",
        "Governance structure implementation",
        "Ongoing compliance support"
      ],
      whyThisPrice: "Non-profit legal services typically cost $1,000-3,000. Our comprehensive package is $400."
    },
    "Business Strategy Consulting": {
      title: "Business Strategy Consulting",
      description: "Strategic planning and business growth consulting",
      price: "$150/hour",
      duration: "Flexible scheduling",
      includes: [
        "Strategic planning sessions",
        "Market analysis and research",
        "Business model optimization",
        "Growth strategy development",
        "Competitive analysis",
        "Performance metrics tracking",
        "Implementation guidance",
        "Ongoing strategic support"
      ],
      process: [
        "Initial business assessment",
        "Strategy development and planning",
        "Implementation guidance",
        "Ongoing monitoring and support"
      ],
      whyThisPrice: "Strategy consulting typically costs $200-500/hour. Our specialized service is $150/hour with comprehensive support."
    },
    "Financial Planning & Analysis": {
      title: "Financial Planning & Analysis",
      description: "Comprehensive financial modeling and analysis",
      price: "$200/hour",
      duration: "Flexible scheduling",
      includes: [
        "Financial modeling and projections",
        "Budget planning and analysis",
        "Investment strategy development",
        "Cash flow optimization",
        "Financial risk assessment",
        "Performance benchmarking",
        "Financial reporting systems",
        "Ongoing financial support"
      ],
      process: [
        "Financial situation assessment",
        "Model development and analysis",
        "Strategy implementation",
        "Ongoing monitoring and support"
      ],
      whyThisPrice: "Financial consulting typically costs $250-600/hour. Our specialized service is $200/hour with comprehensive support."
    },
    "Risk Management": {
      title: "Risk Management",
      description: "Comprehensive risk assessment and mitigation strategies",
      price: "$175/hour",
      duration: "Flexible scheduling",
      includes: [
        "Risk assessment and analysis",
        "Mitigation strategy development",
        "Insurance planning and optimization",
        "Compliance risk management",
        "Operational risk assessment",
        "Financial risk analysis",
        "Risk monitoring systems",
        "Ongoing risk management support"
      ],
      process: [
        "Risk assessment and analysis",
        "Strategy development and implementation",
        "Monitoring and control systems",
        "Ongoing risk management support"
      ],
      whyThisPrice: "Risk management consulting typically costs $200-500/hour. Our specialized service is $175/hour with comprehensive support."
    },
    "Mergers & Acquisitions": {
      title: "Mergers & Acquisitions",
      description: "M&A strategy and transaction support",
      price: "$300/hour",
      duration: "Project-based",
      includes: [
        "M&A strategy development",
        "Due diligence support",
        "Valuation analysis",
        "Transaction structuring",
        "Negotiation support",
        "Legal coordination",
        "Integration planning",
        "Post-transaction support"
      ],
      process: [
        "Initial M&A assessment",
        "Strategy development and planning",
        "Transaction execution support",
        "Post-transaction integration"
      ],
      whyThisPrice: "M&A consulting typically costs $400-1,000/hour. Our specialized service is $300/hour with comprehensive support."
    },
    "International Business": {
      title: "International Business",
      description: "International expansion and cross-border compliance",
      price: "$250/hour",
      duration: "Flexible scheduling",
      includes: [
        "International market analysis",
        "Cross-border compliance setup",
        "Global expansion strategy",
        "International tax planning",
        "Cultural and legal considerations",
        "International partnership development",
        "Global supply chain optimization",
        "Ongoing international support"
      ],
      process: [
        "International business assessment",
        "Strategy development and planning",
        "Implementation and compliance",
        "Ongoing international support"
      ],
      whyThisPrice: "International business consulting typically costs $300-800/hour. Our specialized service is $250/hour with comprehensive support."
    },
    "Crisis Management": {
      title: "Crisis Management",
      description: "Crisis response and reputation management",
      price: "$400/hour",
      duration: "24/7 availability",
      includes: [
        "Crisis assessment and response",
        "Reputation management strategies",
        "Legal defense coordination",
        "Communication strategy development",
        "Stakeholder management",
        "Recovery planning",
        "Prevention strategies",
        "Ongoing crisis support"
      ],
      process: [
        "Immediate crisis assessment",
        "Response strategy development",
        "Implementation and management",
        "Recovery and prevention planning"
      ],
      whyThisPrice: "Crisis management typically costs $500-1,500/hour. Our specialized service is $400/hour with 24/7 availability."
    }
  }

  const handleLearnMore = (service: any) => {
    setSelectedService(service)
    setIsDialogOpen(true)
  }

  const handleContactService = () => {
    // Close the dialog
    setIsDialogOpen(false)
    // Navigate to contact page with service pre-filled
    const serviceName = selectedService?.name || 'Business Service'
    const servicePrice = selectedService?.price || ''
    const queryParams = new URLSearchParams({
      service: serviceName,
      price: servicePrice,
      source: 'business-services'
    })
    
    toast({
      title: "Redirecting to contact form",
      description: `We're taking you to the contact form to discuss ${serviceName}.`,
    })
    
    router.push(`/contact?${queryParams.toString()}`)
  }

  const benefits = [
    {
      icon: Shield,
      title: "Legal Protection",
      description: "Comprehensive legal frameworks to protect your business and assets."
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Experienced professionals with deep industry knowledge."
    },
    {
      icon: TrendingUp,
      title: "Growth Support",
      description: "Strategic consulting to help your business scale and succeed."
    },
    {
      icon: Globe,
      title: "Compliance Ready",
      description: "Industry-specific compliance to meet regulatory requirements."
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Complete legal documentation and policy frameworks."
    },
    {
      icon: Clock,
      title: "Ongoing Support",
      description: "Continuous legal support and compliance monitoring."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/5 to-green-100/10 dark:from-background dark:via-blue-900/20 dark:to-green-800/10">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/web-building" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl text-foreground">WebVault</span>
            </Link>
            
            <EnhancedBackButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Business Services
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Complete Business & Legal Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From company formation to compliance, we provide comprehensive business and legal services 
              to help your company grow and succeed. Expert guidance for every stage of your business journey.
            </p>
          </div>

          {/* Legal & Compliance Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Legal & Compliance Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive legal services to protect your business and ensure compliance with all regulations.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {legalServices.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">{service.price}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLearnMore(service)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Industry-Specific Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Industry-Specific Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Specialized compliance and legal services tailored to your specific industry requirements.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {industrySpecific.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-foreground">{service.price}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLearnMore(service)}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Consulting Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Consulting & Advisory Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Strategic consulting to help your business grow, manage risk, and achieve your goals.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {consulting.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-foreground">{service.price}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLearnMore(service)}
                      >
                        Book Consultation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Our Business Services?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive business and legal support to protect and grow your company.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Protect Your Business?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Let's discuss your business needs and find the right legal and consulting solutions 
                  to help your company succeed and grow.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    <Link href="/contact">Get Free Consultation</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/web-building/quote">Request Quote</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Service Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedService && serviceDetails[selectedService.name as keyof typeof serviceDetails] 
                ? serviceDetails[selectedService.name as keyof typeof serviceDetails].title 
                : "Service Details"}
            </DialogTitle>
            {selectedService && serviceDetails[selectedService.name as keyof typeof serviceDetails] && (
              <div className="flex items-center space-x-4 mt-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <selectedService.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground">
                    {serviceDetails[selectedService.name as keyof typeof serviceDetails].description}
                  </p>
                </div>
              </div>
            )}
          </DialogHeader>
          
          {selectedService && serviceDetails[selectedService.name as keyof typeof serviceDetails] && (
            <div className="space-y-6">
              {/* Pricing Information */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Price</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {serviceDetails[selectedService.name as keyof typeof serviceDetails].price}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">Duration</span>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {serviceDetails[selectedService.name as keyof typeof serviceDetails].duration}
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">What's Included</span>
                  </div>
                  <div className="text-lg font-semibold text-purple-600">
                    {serviceDetails[selectedService.name as keyof typeof serviceDetails].includes.length} Items
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>What's Included</span>
                </h3>
                <div className="grid gap-2">
                  {serviceDetails[selectedService.name as keyof typeof serviceDetails].includes.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  <span>Our Process</span>
                </h3>
                <div className="space-y-2">
                  {serviceDetails[selectedService.name as keyof typeof serviceDetails].process.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why This Price */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                  <Info className="w-5 h-5 text-yellow-600" />
                  <span>Why This Price?</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {serviceDetails[selectedService.name as keyof typeof serviceDetails].whyThisPrice}
                </p>
              </div>

              {/* CTA */}
              <div className="flex justify-center">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-3 text-lg"
                  onClick={handleContactService}
                >
                  Contact Us About This Service
                </Button>
              </div>
              
              {/* Close Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsDialogOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 