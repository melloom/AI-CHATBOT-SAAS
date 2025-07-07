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
  TrendingUp
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Service {
  id: string
  name: string
  description: string
  category: 'web-design' | 'development' | 'hosting' | 'maintenance' | 'seo' | 'consulting'
  status: 'active' | 'inactive' | 'draft'
  price: number
  priceType: 'hourly' | 'fixed' | 'monthly'
  duration: string
  features: string[]
  popularity: number
  rating: number
  reviews: number
}

const mockServices: Service[] = [
  {
    id: "1",
    name: "Website Design & Development",
    description: "Custom website design and development with responsive design and modern technologies",
    category: "web-design",
    status: "active",
    price: 2500,
    priceType: "fixed",
    duration: "2-4 weeks",
    features: ["Responsive Design", "SEO Optimization", "Content Management", "Contact Forms", "Analytics Integration"],
    popularity: 95,
    rating: 4.8,
    reviews: 127
  },
  {
    id: "2",
    name: "E-commerce Development",
    description: "Full-featured e-commerce websites with payment processing and inventory management",
    category: "development",
    status: "active",
    price: 5000,
    priceType: "fixed",
    duration: "4-6 weeks",
    features: ["Payment Integration", "Inventory Management", "Order Processing", "Customer Accounts", "Shipping Calculator"],
    popularity: 88,
    rating: 4.9,
    reviews: 89
  },
  {
    id: "3",
    name: "Website Hosting & Maintenance",
    description: "Reliable hosting with regular maintenance, updates, and security monitoring",
    category: "hosting",
    status: "active",
    price: 99,
    priceType: "monthly",
    duration: "Ongoing",
    features: ["24/7 Monitoring", "Security Updates", "Backup Services", "Performance Optimization", "Technical Support"],
    popularity: 92,
    rating: 4.7,
    reviews: 203
  },
  {
    id: "4",
    name: "SEO Optimization",
    description: "Search engine optimization to improve your website's visibility and rankings",
    category: "seo",
    status: "active",
    price: 150,
    priceType: "hourly",
    duration: "3-6 months",
    features: ["Keyword Research", "On-Page Optimization", "Content Strategy", "Link Building", "Performance Tracking"],
    popularity: 85,
    rating: 4.6,
    reviews: 156
  },
  {
    id: "5",
    name: "Website Consulting",
    description: "Expert consultation for website strategy, planning, and optimization",
    category: "consulting",
    status: "active",
    price: 200,
    priceType: "hourly",
    duration: "As needed",
    features: ["Strategy Planning", "Technical Review", "Performance Analysis", "Recommendations", "Implementation Support"],
    popularity: 78,
    rating: 4.9,
    reviews: 67
  },
  {
    id: "6",
    name: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android",
    category: "development",
    status: "draft",
    price: 8000,
    priceType: "fixed",
    duration: "8-12 weeks",
    features: ["Native Development", "Cross-Platform", "App Store Submission", "Push Notifications", "Analytics Integration"],
    popularity: 82,
    rating: 4.8,
    reviews: 45
  }
]

export default function Services() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priceFilter, setPriceFilter] = useState<string>("all")

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web-design': return <Palette className="h-5 w-5" />
      case 'development': return <Code className="h-5 w-5" />
      case 'hosting': return <Database className="h-5 w-5" />
      case 'maintenance': return <Wrench className="h-5 w-5" />
      case 'seo': return <Globe className="h-5 w-5" />
      case 'consulting': return <Users className="h-5 w-5" />
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

  const getPriceDisplay = (service: Service) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Services</h1>
              <p className="text-gray-600">Manage your web development and hosting services</p>
            </div>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Services</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Services</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="web-design">Web Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="hosting">Hosting</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="seo">SEO</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price Range</Label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-100">Under $100</SelectItem>
                  <SelectItem value="100-500">$100 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="over-1000">Over $1,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getCategoryIcon(service.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {service.description}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Service
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Pricing
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Service
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price and Rating */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {getPriceDisplay(service)}
                  </p>
                  <p className="text-sm text-gray-500">Duration: {service.duration}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{service.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">({service.reviews} reviews)</p>
                </div>
              </div>

              {/* Features */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {service.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{service.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Popularity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    {service.popularity}% popularity
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredServices.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No services found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all" || priceFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first service"
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 