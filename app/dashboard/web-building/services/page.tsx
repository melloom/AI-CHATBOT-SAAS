"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Settings,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  DollarSign,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Code,
  Palette,
  Database,
  Shield,
  TrendingUp,
  BarChart3,
  Target,
  ShoppingCart,
  Building2,
  Briefcase,
  PenTool,
  FileText,
  Type,
  Package,
  Mail,
  Server,
  Cloud,
  Save,
  Gauge,
  RefreshCw,
  Lock,
  ShieldCheck,
  Share2,
  Instagram,
  Lightbulb,
  GraduationCap,
  Headphones,
  Brain,
  Wifi,
  Cpu,
  Code2,
  MapPin,
  Link,
  Activity,
  LayoutDashboard,
  Split,
  ShoppingBag,
  ClipboardList,
  Bug,
  Zap,
  CreditCard
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/hooks/use-auth"
import { useWebVaultServices } from "@/hooks/use-webvault"

// Local type for UI state
interface LocalService {
  id: string
  name: string
  description: string
  category: 'web-design' | 'development' | 'hosting' | 'maintenance' | 'seo' | 'consulting' | 'security' | 'analytics' | 'content' | 'ecommerce' | 'mobile' | 'marketing' | 'training' | 'advanced' | 'enterprise'
  status: 'active' | 'inactive' | 'draft'
  price: number
  priceType: 'hourly' | 'fixed' | 'monthly'
  duration: string
  features: string[]
  popularity: number
  rating: number
  reviews: number
  createdAt?: number | string
  updatedAt?: number | string
}

// Form type for new service
interface LocalServiceForm {
  name: string
  description: string
  category: 'web-design' | 'development' | 'hosting' | 'maintenance' | 'seo' | 'consulting' | 'security' | 'analytics' | 'content' | 'ecommerce' | 'mobile' | 'marketing' | 'training' | 'advanced' | 'enterprise'
  status: 'active' | 'inactive' | 'draft'
  price: number
  priceType: 'hourly' | 'fixed' | 'monthly'
  duration: string
  features: string
  popularity: number
  rating: number
  reviews: number
}

export default function Services() {
  const { services: initialServices, loading, error } = useWebVaultServices()
  const { user, profile } = useAuth()
  const allowedCategories = ["web-design", "development", "hosting", "maintenance", "seo", "consulting", "security", "analytics", "content", "ecommerce", "mobile", "marketing", "training", "advanced", "enterprise"];
  const allowedStatuses = ["active", "inactive", "draft"];
  const [services, setServices] = useState<LocalService[]>(
    initialServices
      .filter(s => allowedCategories.includes(s.category) && allowedStatuses.includes(s.status))
      .map(s => ({
        ...s,
        createdAt: s.createdAt ? Number(s.createdAt) : undefined,
        updatedAt: s.updatedAt ? Number(s.updatedAt) : undefined,
        category: s.category as LocalService["category"],
        status: s.status as LocalService["status"],
        priceType: s.priceType as LocalService["priceType"],
        features:
          s.features && typeof s.features === 'string'
            ? (s.features as string).split(',').map((f: string) => f.trim()).filter(Boolean)
            : Array.isArray(s.features)
              ? s.features
              : [],
      }))
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priceFilter, setPriceFilter] = useState<string>("all")
  const [showServiceCatalog, setShowServiceCatalog] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string>("")
  const [selectedCatalogServices, setSelectedCatalogServices] = useState<string[]>([])
  const [selectedServiceDetails, setSelectedServiceDetails] = useState<any>(null)
  const [showServiceDetailsDialog, setShowServiceDetailsDialog] = useState(false)
  const [myServices, setMyServices] = useState<LocalService[]>([])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web-design': return <Palette className="h-5 w-5" />
      case 'development': return <Code className="h-5 w-5" />
      case 'hosting': return <Database className="h-5 w-5" />
      case 'maintenance': return <Wrench className="h-5 w-5" />
      case 'seo': return <Search className="h-5 w-5" />
      case 'consulting': return <Users className="h-5 w-5" />
      case 'security': return <Shield className="h-5 w-5" />
      case 'analytics': return <BarChart3 className="h-5 w-5" />
      case 'content': return <FileText className="h-5 w-5" />
      case 'ecommerce': return <ShoppingCart className="h-5 w-5" />
      case 'mobile': return <Smartphone className="h-5 w-5" />
      case 'marketing': return <Target className="h-5 w-5" />
      case 'training': return <GraduationCap className="h-5 w-5" />
      case 'advanced': return <Cpu className="h-5 w-5" />
      case 'enterprise': return <Building2 className="h-5 w-5" />
      default: return <Wrench className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriceDisplay = (service: LocalService) => {
    switch (service.priceType) {
      case 'hourly':
        return `$${service.price}/hour`
      case 'monthly':
        return `$${service.price}/month`
      case 'fixed':
        return `$${service.price.toLocaleString()}`
      default:
        return `$${service.price}`
    }
  }

  const handleShowServiceDetails = (service: any) => {
    setSelectedServiceDetails(service)
    setShowServiceDetailsDialog(true)
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
    const matchesStatus = statusFilter === "all" || service.status === statusFilter
    const matchesPrice = priceFilter === "all" || 
      (priceFilter === "under-100" && service.price < 100) ||
      (priceFilter === "100-500" && service.price >= 100 && service.price < 500) ||
      (priceFilter === "500-1000" && service.price >= 500 && service.price < 1000) ||
      (priceFilter === "over-1000" && service.price >= 1000)
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPrice
  })

  const stats = {
    total: services.length,
    active: services.filter(s => s.status === 'active').length,
    draft: services.filter(s => s.status === 'draft').length,
    totalRevenue: services.filter(s => s.status === 'active').reduce((sum, s) => sum + s.price, 0)
  }

  // Add services from catalog handler
  const handleAddFromCatalog = async () => {
    try {
      // Submit each selected service as a service request
      const selectedServices = [
        { id: 'web-design-1', name: 'Custom Website Design', description: 'Professional, responsive website design tailored to your brand', category: 'web-design', price: '$1,500 - $5,000', icon: <Palette className="h-5 w-5" /> },
        { id: 'web-design-2', name: 'Mobile-First Design', description: 'Optimized for mobile devices with responsive design', category: 'web-design', price: '$800 - $2,500', icon: <Smartphone className="h-5 w-5" /> },
        { id: 'web-design-3', name: 'Landing Page Design', description: 'High-converting landing pages for campaigns', category: 'web-design', price: '$500 - $1,200', icon: <Target className="h-5 w-5" /> },
        { id: 'web-design-4', name: 'E-commerce Website Design', description: 'Complete online store design with shopping cart', category: 'web-design', price: '$2,500 - $8,000', icon: <ShoppingCart className="h-5 w-5" /> },
        { id: 'web-design-5', name: 'Corporate Website Design', description: 'Professional corporate website with branding', category: 'web-design', price: '$2,000 - $6,000', icon: <Building2 className="h-5 w-5" /> },
        { id: 'web-design-6', name: 'Portfolio Website Design', description: 'Creative portfolio showcase for professionals', category: 'web-design', price: '$800 - $2,000', icon: <Briefcase className="h-5 w-5" /> },
        { id: 'dev-1', name: 'Custom Web Development', description: 'Full-stack web applications with modern technologies', category: 'development', price: '$3,000 - $15,000', icon: <Code className="h-5 w-5" /> },
        { id: 'dev-2', name: 'E-commerce Development', description: 'Complete online store with payment processing', category: 'development', price: '$2,500 - $8,000', icon: <ShoppingCart className="h-5 w-5" /> },
        { id: 'dev-3', name: 'API Integration', description: 'Third-party service integration and APIs', category: 'development', price: '$1,000 - $3,500', icon: <Database className="h-5 w-5" /> },
        { id: 'dev-4', name: 'WordPress Development', description: 'Custom WordPress themes and plugins', category: 'development', price: '$1,500 - $4,000', icon: <Code2 className="h-5 w-5" /> },
        { id: 'dev-5', name: 'React/Next.js Development', description: 'Modern React applications with Next.js', category: 'development', price: '$2,000 - $6,000', icon: <Code2 className="h-5 w-5" /> },
        { id: 'dev-6', name: 'Progressive Web App (PWA)', description: 'App-like web experience with offline capabilities', category: 'development', price: '$2,500 - $5,000', icon: <Smartphone className="h-5 w-5" /> },
        { id: 'hosting-1', name: 'Web Hosting Setup', description: 'Reliable hosting solutions with SSL certificates', category: 'hosting', price: '$20 - $100/month', icon: <Server className="h-5 w-5" /> },
        { id: 'hosting-2', name: 'Cloud Hosting (AWS/Azure)', description: 'Scalable cloud infrastructure setup', category: 'hosting', price: '$100 - $500/month', icon: <Cloud className="h-5 w-5" /> },
        { id: 'hosting-3', name: 'Domain Management', description: 'Domain registration and DNS configuration', category: 'hosting', price: '$15 - $50/year', icon: <Globe className="h-5 w-5" /> },
        { id: 'hosting-4', name: 'CDN Setup', description: 'Content delivery network for faster loading', category: 'hosting', price: '$50 - $200/month', icon: <Zap className="h-5 w-5" /> },
        { id: 'hosting-5', name: 'Email Hosting', description: 'Professional email hosting with custom domain', category: 'hosting', price: '$10 - $30/month', icon: <Mail className="h-5 w-5" /> },
        { id: 'maintenance-1', name: 'Website Maintenance', description: 'Ongoing support, updates, and monitoring', category: 'maintenance', price: '$150 - $500/month', icon: <Wrench className="h-5 w-5" /> },
        { id: 'maintenance-2', name: 'Content Updates', description: 'Regular content updates and management', category: 'maintenance', price: '$100 - $300/month', icon: <Edit className="h-5 w-5" /> },
        { id: 'maintenance-3', name: 'Backup & Recovery', description: 'Automated backups and disaster recovery', category: 'maintenance', price: '$50 - $150/month', icon: <Save className="h-5 w-5" /> },
        { id: 'maintenance-4', name: 'Performance Optimization', description: 'Speed optimization and caching setup', category: 'maintenance', price: '$200 - $500', icon: <Gauge className="h-5 w-5" /> },
        { id: 'maintenance-5', name: 'Plugin Updates', description: 'WordPress plugin and theme updates', category: 'maintenance', price: '$50 - $150/month', icon: <RefreshCw className="h-5 w-5" /> },
        { id: 'security-1', name: 'Security Monitoring', description: '24/7 security monitoring and threat detection', category: 'security', price: '$100 - $300/month', icon: <Shield className="h-5 w-5" /> },
        { id: 'security-2', name: 'SSL Certificate Setup', description: 'HTTPS encryption and security certificates', category: 'security', price: '$50 - $200/year', icon: <Lock className="h-5 w-5" /> },
        { id: 'security-3', name: 'Firewall Configuration', description: 'Web application firewall setup', category: 'security', price: '$100 - $300', icon: <ShieldCheck className="h-5 w-5" /> },
        { id: 'security-4', name: 'Security Audit', description: 'Comprehensive security assessment', category: 'security', price: '$500 - $1,500', icon: <Search className="h-5 w-5" /> },
        { id: 'security-5', name: 'Malware Removal', description: 'Virus and malware cleanup services', category: 'security', price: '$200 - $500', icon: <Bug className="h-5 w-5" /> },
        { id: 'seo-1', name: 'SEO Optimization', description: 'Search engine optimization for better rankings', category: 'seo', price: '$500 - $1,500', icon: <Search className="h-5 w-5" /> },
        { id: 'seo-2', name: 'Local SEO', description: 'Local search optimization for businesses', category: 'seo', price: '$300 - $800', icon: <MapPin className="h-5 w-5" /> },
        { id: 'seo-3', name: 'Technical SEO Audit', description: 'Comprehensive technical SEO analysis', category: 'seo', price: '$400 - $1,000', icon: <BarChart3 className="h-5 w-5" /> },
        { id: 'seo-4', name: 'Keyword Research', description: 'Strategic keyword research and planning', category: 'seo', price: '$200 - $500', icon: <Target className="h-5 w-5" /> },
        { id: 'seo-5', name: 'Link Building', description: 'Quality backlink building strategies', category: 'seo', price: '$300 - $800/month', icon: <Link className="h-5 w-5" /> },
        { id: 'analytics-1', name: 'Google Analytics Setup', description: 'Website analytics and tracking setup', category: 'analytics', price: '$200 - $500', icon: <BarChart3 className="h-5 w-5" /> },
        { id: 'analytics-2', name: 'Conversion Tracking', description: 'E-commerce and goal tracking setup', category: 'analytics', price: '$150 - $400', icon: <Target className="h-5 w-5" /> },
        { id: 'analytics-3', name: 'Heatmap Analysis', description: 'User behavior tracking with heatmaps', category: 'analytics', price: '$100 - $300', icon: <Activity className="h-5 w-5" /> },
        { id: 'analytics-4', name: 'Custom Dashboard', description: 'Custom analytics dashboard creation', category: 'analytics', price: '$500 - $1,500', icon: <LayoutDashboard className="h-5 w-5" /> },
        { id: 'analytics-5', name: 'A/B Testing Setup', description: 'Conversion optimization testing', category: 'analytics', price: '$300 - $800', icon: <Split className="h-5 w-5" /> },
        { id: 'content-1', name: 'Content Creation', description: 'Professional content writing services', category: 'content', price: '$300 - $1,000', icon: <PenTool className="h-5 w-5" /> },
        { id: 'content-2', name: 'Blog Management', description: 'Regular blog content and management', category: 'content', price: '$200 - $600/month', icon: <FileText className="h-5 w-5" /> },
        { id: 'content-3', name: 'Copywriting', description: 'Sales copy and marketing content', category: 'content', price: '$400 - $1,200', icon: <Type className="h-5 w-5" /> },
        { id: 'content-4', name: 'Product Descriptions', description: 'E-commerce product descriptions', category: 'content', price: '$5 - $20 per product', icon: <Package className="h-5 w-5" /> },
        { id: 'content-5', name: 'Email Marketing Content', description: 'Email campaign content creation', category: 'content', price: '$200 - $500', icon: <Mail className="h-5 w-5" /> },
        { id: 'ecommerce-1', name: 'Shopify Development', description: 'Custom Shopify store development', category: 'ecommerce', price: '$2,000 - $6,000', icon: <ShoppingBag className="h-5 w-5" /> },
        { id: 'ecommerce-2', name: 'WooCommerce Setup', description: 'WordPress e-commerce setup', category: 'ecommerce', price: '$1,500 - $4,000', icon: <ShoppingCart className="h-5 w-5" /> },
        { id: 'ecommerce-3', name: 'Payment Gateway Integration', description: 'Stripe, PayPal, and other payment methods', category: 'ecommerce', price: '$500 - $1,500', icon: <CreditCard className="h-5 w-5" /> },
        { id: 'ecommerce-4', name: 'Inventory Management', description: 'Product inventory system setup', category: 'ecommerce', price: '$800 - $2,000', icon: <Package className="h-5 w-5" /> },
        { id: 'ecommerce-5', name: 'Order Management', description: 'Order processing and fulfillment system', category: 'ecommerce', price: '$600 - $1,500', icon: <ClipboardList className="h-5 w-5" /> },
        { id: 'mobile-1', name: 'Mobile App Development', description: 'Native iOS and Android applications', category: 'mobile', price: '$5,000 - $25,000', icon: <Smartphone className="h-5 w-5" /> },
        { id: 'mobile-2', name: 'React Native App', description: 'Cross-platform mobile app development', category: 'mobile', price: '$3,000 - $15,000', icon: <Code2 className="h-5 w-5" /> },
        { id: 'mobile-3', name: 'App Store Optimization', description: 'App store listing optimization', category: 'mobile', price: '$300 - $800', icon: <TrendingUp className="h-5 w-5" /> },
        { id: 'mobile-4', name: 'Mobile App Maintenance', description: 'Ongoing app updates and support', category: 'mobile', price: '$200 - $600/month', icon: <Wrench className="h-5 w-5" /> },
        { id: 'marketing-1', name: 'Google Ads Management', description: 'PPC campaign setup and management', category: 'marketing', price: '$500 - $2,000/month', icon: <Target className="h-5 w-5" /> },
        { id: 'marketing-2', name: 'Facebook Ads', description: 'Social media advertising campaigns', category: 'marketing', price: '$300 - $1,500/month', icon: <Share2 className="h-5 w-5" /> },
        { id: 'marketing-3', name: 'Email Marketing Setup', description: 'Email automation and campaign setup', category: 'marketing', price: '$200 - $800', icon: <Mail className="h-5 w-5" /> },
        { id: 'marketing-4', name: 'Social Media Management', description: 'Social media content and engagement', category: 'marketing', price: '$300 - $1,000/month', icon: <Instagram className="h-5 w-5" /> },
        { id: 'marketing-5', name: 'Influencer Marketing', description: 'Influencer campaign coordination', category: 'marketing', price: '$500 - $2,000', icon: <Users className="h-5 w-5" /> },
        { id: 'consulting-1', name: 'Digital Strategy Consulting', description: 'Comprehensive digital strategy planning', category: 'consulting', price: '$150 - $300/hour', icon: <Lightbulb className="h-5 w-5" /> },
        { id: 'consulting-2', name: 'Technology Consulting', description: 'Technology stack and architecture advice', category: 'consulting', price: '$200 - $400/hour', icon: <Settings className="h-5 w-5" /> },
        { id: 'consulting-3', name: 'UX/UI Consulting', description: 'User experience and interface design advice', category: 'consulting', price: '$100 - $250/hour', icon: <Eye className="h-5 w-5" /> },
        { id: 'consulting-4', name: 'Performance Consulting', description: 'Website performance optimization advice', category: 'consulting', price: '$120 - $280/hour', icon: <Gauge className="h-5 w-5" /> },
        { id: 'training-1', name: 'CMS Training', description: 'Content management system training', category: 'training', price: '$200 - $500', icon: <GraduationCap className="h-5 w-5" /> },
        { id: 'training-2', name: 'Analytics Training', description: 'Google Analytics and reporting training', category: 'training', price: '$150 - $400', icon: <BarChart3 className="h-5 w-5" /> },
        { id: 'training-3', name: 'SEO Training', description: 'Search engine optimization training', category: 'training', price: '$300 - $600', icon: <Search className="h-5 w-5" /> },
        { id: 'training-4', name: 'Technical Support', description: 'Ongoing technical support and troubleshooting', category: 'training', price: '$50 - $150/hour', icon: <Headphones className="h-5 w-5" /> },
        { id: 'advanced-1', name: 'AI Integration', description: 'Artificial intelligence and chatbot integration', category: 'advanced', price: '$2,000 - $8,000', icon: <Brain className="h-5 w-5" /> },
        { id: 'advanced-2', name: 'Blockchain Development', description: 'Blockchain and smart contract development', category: 'advanced', price: '$5,000 - $20,000', icon: <Link className="h-5 w-5" /> },
        { id: 'advanced-3', name: 'IoT Development', description: 'Internet of Things application development', category: 'advanced', price: '$3,000 - $12,000', icon: <Wifi className="h-5 w-5" /> },
        { id: 'advanced-4', name: 'Machine Learning Integration', description: 'ML model integration and automation', category: 'advanced', price: '$4,000 - $15,000', icon: <Cpu className="h-5 w-5" /> },
        { id: 'enterprise-1', name: 'Enterprise Web Application', description: 'Large-scale enterprise web applications', category: 'enterprise', price: '$15,000 - $100,000', icon: <Building2 className="h-5 w-5" /> },
        { id: 'enterprise-2', name: 'Custom CRM Development', description: 'Customer relationship management system', category: 'enterprise', price: '$8,000 - $30,000', icon: <Users className="h-5 w-5" /> },
        { id: 'enterprise-3', name: 'ERP System Integration', description: 'Enterprise resource planning integration', category: 'enterprise', price: '$10,000 - $50,000', icon: <Database className="h-5 w-5" /> },
        { id: 'enterprise-4', name: 'Custom API Development', description: 'RESTful API and microservices development', category: 'enterprise', price: '$5,000 - $25,000', icon: <Code className="h-5 w-5" /> }
      ]

      const servicesToSubmit = selectedServices.filter(service => selectedCatalogServices.includes(service.id))

      for (const service of servicesToSubmit) {
        const response = await fetch('/api/webvault/service-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceName: service.name,
            serviceDescription: service.description,
            serviceCategory: service.category,
            servicePrice: service.price,
            userId: user?.uid,
            userEmail: user?.email,
            status: 'pending'
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to submit service request for ${service.name}`)
        }
      }

      // Convert to LocalService format and add to local state for immediate feedback
      const localServices: LocalService[] = servicesToSubmit.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        category: service.category as LocalService['category'],
        status: 'pending' as LocalService['status'],
        price: 0,
        priceType: 'fixed' as LocalService['priceType'],
        duration: 'TBD',
        features: [],
        popularity: 0,
        rating: 5,
        reviews: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }))

      setMyServices([...myServices, ...localServices])
      setShowServiceCatalog(false)
      setSelectedCatalogServices([])

      // Show success message
      alert(`Successfully submitted ${servicesToSubmit.length} service request(s) to admin for approval!`)

    } catch (error) {
      console.error('Error submitting service requests:', error)
      alert('Failed to submit service requests. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Error Loading Services</h3>
          </div>
          <p className="text-red-700 dark:text-red-300 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your web development and hosting services</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center space-x-2" onClick={() => setShowServiceCatalog(true)}>
              <Globe className="h-4 w-4" />
              <span>Service Catalog</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Services</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                      </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                      </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Services</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                      </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                      </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Draft Services</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.draft}</p>
                      </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Edit className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                      </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">${stats.totalRevenue.toLocaleString()}</p>
                      </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                      </div>
                    </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
                      </div>
                      </div>
          
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {allowedCategories.map(category => (
                <option key={category} value={category}>
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
                      </div>
          
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
                      </div>
          
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</label>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Prices</option>
              <option value="under-100">Under $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="over-1000">Over $1,000</option>
            </select>
                      </div>
                      </div>
                    </div>

      {/* Service Details Dialog */}
      <Dialog open={showServiceDetailsDialog} onOpenChange={setShowServiceDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedServiceDetails?.icon}
              <span>{selectedServiceDetails?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedServiceDetails?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedServiceDetails && (
            <div className="space-y-6">
              {/* Service Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Price Range</span>
                      </div>
                  <p className="text-2xl font-bold text-blue-600">{selectedServiceDetails.price}</p>
                      </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Duration</span>
                      </div>
                  <p className="text-2xl font-bold text-green-600">{selectedServiceDetails.duration}</p>
            </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">Rating</span>
                      </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl font-bold text-purple-600">{selectedServiceDetails.rating}</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">({selectedServiceDetails.reviews} reviews)</span>
                      </div>
                    </div>
                      </div>

              {/* Detailed Description */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Service Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedServiceDetails.detailedDescription}</p>
                      </div>

              {/* Features */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedServiceDetails.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                      </div>
                  ))}
                      </div>
                    </div>

              {/* Deliverables */}
            <div>
                <h3 className="text-lg font-semibold mb-3">What You'll Get</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedServiceDetails.deliverables.map((deliverable: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">{deliverable}</span>
                      </div>
                  ))}
                      </div>
                    </div>

              {/* Technologies */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedServiceDetails.technologies.map((tech: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                      {tech}
                    </Badge>
                  ))}
                      </div>
                      </div>

              {/* Popularity */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Popularity</span>
                      </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${selectedServiceDetails.popularity}%` }}
                      ></div>
                      </div>
                    <span className="text-sm font-medium">{selectedServiceDetails.popularity}%</span>
                    </div>
                      </div>
                    </div>
                      </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowServiceDetailsDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              // Add logic to request this service
              setShowServiceDetailsDialog(false)
              // You can add navigation to contact form or service request
            }}>
              Request This Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}