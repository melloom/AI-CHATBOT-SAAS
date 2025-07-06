"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Tag,
  Globe,
  Code,
  Palette,
  Server,
  Bot,
  TrendingUp,
  BookOpen,
  Filter
} from "lucide-react"
import { useState } from "react"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Posts", icon: BookOpen },
    { id: "web-development", name: "Web Development", icon: Code },
    { id: "design", name: "Design", icon: Palette },
    { id: "hosting", name: "Hosting", icon: Server },
    { id: "ai", name: "AI & Chatbots", icon: Bot },
    { id: "trends", name: "Industry Trends", icon: TrendingUp }
  ]

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Web Development: What's Next in 2024",
      excerpt: "Explore the latest trends and technologies that are shaping the future of web development, from AI integration to advanced frameworks.",
      author: "Melvin Cruz",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "trends",
      tags: ["Web Development", "Trends", "Technology"],
      image: "/placeholder.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Building Scalable E-commerce Websites: Best Practices",
      excerpt: "Learn the essential strategies and techniques for creating high-performing e-commerce websites that convert visitors into customers.",
      author: "Melvin Cruz",
      date: "2024-01-12",
      readTime: "12 min read",
      category: "web-development",
      tags: ["E-commerce", "Performance", "UX"],
      image: "/placeholder.jpg"
    },
    {
      id: 3,
      title: "Integrating AI Chatbots: A Complete Guide",
      excerpt: "Discover how to seamlessly integrate AI chatbots into your website to enhance customer support and user engagement.",
      author: "Melvin Cruz",
      date: "2024-01-10",
      readTime: "10 min read",
      category: "ai",
      tags: ["AI", "Chatbots", "Integration"],
      image: "/placeholder.jpg"
    },
    {
      id: 4,
      title: "Optimizing Website Performance: Speed Matters",
      excerpt: "Learn the critical techniques for optimizing your website's performance and improving user experience and SEO rankings.",
      author: "Melvin Cruz",
      date: "2024-01-08",
      readTime: "15 min read",
      category: "web-development",
      tags: ["Performance", "SEO", "Optimization"],
      image: "/placeholder.jpg"
    },
    {
      id: 5,
      title: "Modern Design Trends for 2024",
      excerpt: "Explore the latest design trends that are dominating the web in 2024, from minimalist approaches to bold color schemes.",
      author: "Melvin Cruz",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "design",
      tags: ["Design", "Trends", "UI/UX"],
      image: "/placeholder.jpg"
    },
    {
      id: 6,
      title: "Choosing the Right Hosting Solution for Your Business",
      excerpt: "A comprehensive guide to selecting the perfect hosting solution based on your website's needs and business requirements.",
      author: "Melvin Cruz",
      date: "2024-01-03",
      readTime: "9 min read",
      category: "hosting",
      tags: ["Hosting", "Infrastructure", "Business"],
      image: "/placeholder.jpg"
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/web-building/home">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to WebVault
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">WebVault Blog</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            WebVault Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Insights, tips, and updates from the world of web development. Stay ahead with the latest trends and best practices.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Filter by:</span>
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? 
                      "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : 
                      "border-gray-300 hover:bg-gray-50"
                    }
                  >
                    <category.icon className="w-3 h-3 mr-1" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.filter(post => post.featured).map(post => (
          <Card key={post.id} className="mb-8 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Featured
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">{post.title}</CardTitle>
              <CardDescription className="text-lg">{post.excerpt}</CardDescription>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{post.author}</span>
                </div>
                <div className="flex space-x-1">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Read Full Article
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.filter(post => !post.featured).map(post => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {categories.find(cat => cat.id === post.category)?.name}
                  </Badge>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <CardTitle className="text-lg text-gray-900 dark:text-white line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 