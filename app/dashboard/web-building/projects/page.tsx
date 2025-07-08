"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  Edit,
  Eye,
  MoreHorizontal,
  Progress,
  Target,
  DollarSign
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  startDate: string
  endDate: string
  budget: number
  spent: number
  team: string[]
  client: string
  type: 'website' | 'ecommerce' | 'webapp' | 'landing-page'
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "TechCorp E-commerce Platform",
    description: "Full-featured e-commerce website with payment integration and inventory management",
    status: "in-progress",
    priority: "high",
    progress: 65,
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    budget: 15000,
    spent: 9750,
    team: ["John Doe", "Jane Smith", "Mike Johnson"],
    client: "TechCorp Inc.",
    type: "ecommerce"
  },
  {
    id: "2",
    name: "Restaurant Website Redesign",
    description: "Modern responsive website with online ordering system",
    status: "review",
    priority: "medium",
    progress: 90,
    startDate: "2024-01-01",
    endDate: "2024-02-01",
    budget: 5000,
    spent: 4500,
    team: ["Sarah Wilson", "Alex Brown"],
    client: "Local Restaurant",
    type: "website"
  },
  {
    id: "3",
    name: "Portfolio Website",
    description: "Personal portfolio website for creative professional",
    status: "completed",
    priority: "low",
    progress: 100,
    startDate: "2023-12-01",
    endDate: "2023-12-15",
    budget: 2000,
    spent: 1800,
    team: ["David Lee"],
    client: "Design Studio",
    type: "website"
  },
  {
    id: "4",
    name: "SaaS Dashboard",
    description: "Admin dashboard for SaaS application with analytics",
    status: "planning",
    priority: "urgent",
    progress: 15,
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    budget: 25000,
    spent: 3750,
    team: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"],
    client: "StartupXYZ",
    type: "webapp"
  },
  {
    id: "5",
    name: "Product Landing Page",
    description: "High-converting landing page for new product launch",
    status: "on-hold",
    priority: "medium",
    progress: 40,
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    budget: 3000,
    spent: 1200,
    team: ["Alex Brown", "David Lee"],
    client: "ProductCo",
    type: "landing-page"
  }
]

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'review': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'on-hold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return <Target className="h-4 w-4" />
      case 'in-progress': return <Play className="h-4 w-4" />
      case 'review': return <AlertCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'on-hold': return <Pause className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter
    const matchesType = typeFilter === "all" || project.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onHold: projects.filter(p => p.status === 'on-hold').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-gray-600">Manage and track all your web development projects</p>
            </div>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Play className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Used</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${stats.totalSpent.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  of ${stats.totalBudget.toLocaleString()}
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
              <Label htmlFor="search">Search Projects</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, description, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="webapp">Web App</SelectItem>
                  <SelectItem value="landing-page">Landing Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
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
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Client:</span>
                  <p className="font-medium">{project.client}</p>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium capitalize">{project.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <span className="text-gray-500">Start Date:</span>
                  <p className="font-medium">{project.startDate}</p>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>
                  <p className="font-medium">{project.endDate}</p>
                </div>
              </div>

              {/* Budget Info */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium">${project.budget.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Spent</p>
                  <p className="font-medium">${project.spent.toLocaleString()}</p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(project.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(project.status)}
                    <span className="capitalize">{project.status.replace('-', ' ')}</span>
                  </div>
                </Badge>
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
        
        {filteredProjects.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first project"
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 