"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, MessageCircle, Clock, Eye, Activity } from "lucide-react"

export default function ChatHubAnalyticsPage() {
  const trafficData = [
    { date: "2024-01-01", visitors: 1200, pageViews: 3400 },
    { date: "2024-01-02", visitors: 1350, pageViews: 3800 },
    { date: "2024-01-03", visitors: 1100, pageViews: 3100 },
    { date: "2024-01-04", visitors: 1600, pageViews: 4500 },
    { date: "2024-01-05", visitors: 1800, pageViews: 5200 },
    { date: "2024-01-06", visitors: 2000, pageViews: 5800 },
    { date: "2024-01-07", visitors: 2200, pageViews: 6200 },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <BarChart3 className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl font-bold">ChatHub Analytics</h1>
              </div>
              <p className="text-lg text-white/90 mb-4">
                Insights and statistics about your ChatHub activity and engagement.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Growth Metrics</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Real-Time Data</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Total Users</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">All-time registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">1,234</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Active Conversations</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Currently ongoing chats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">87</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Messages Sent</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-700 dark:text-pink-300">12,345</div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Overview Chart */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <Eye className="w-5 h-5" />
            <span>Website Analytics - Traffic Overview</span>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Visitor trends over the selected time period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Chart Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Visitors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Page Views</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last 7 days
              </div>
            </div>

            {/* Chart */}
            <div className="relative">
              <div className="h-64 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-end justify-between h-full space-x-2">
                  {trafficData.map((data, index) => {
                    const maxVisitors = Math.max(...trafficData.map(d => d.visitors))
                    const maxPageViews = Math.max(...trafficData.map(d => d.pageViews))
                    const visitorHeight = (data.visitors / maxVisitors) * 100
                    const pageViewHeight = (data.pageViews / maxPageViews) * 100

                    return (
                      <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                        {/* Page Views Bar */}
                        <div className="relative w-full">
                          <div 
                            className="w-full bg-purple-500 rounded-t-sm transition-all duration-300 hover:bg-purple-600"
                            style={{ height: `${pageViewHeight}%` }}
                          ></div>
                        </div>
                        {/* Visitors Bar */}
                        <div className="relative w-full">
                          <div 
                            className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                            style={{ height: `${visitorHeight}%` }}
                          ></div>
                        </div>
                        {/* Date Label */}
                        <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                          {formatDate(data.date)}
                        </div>
                        {/* Tooltip Data */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Visitors: {data.visitors.toLocaleString()}<br/>
                          Page Views: {data.pageViews.toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.max(...trafficData.map(d => d.visitors)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Peak Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.max(...trafficData.map(d => d.pageViews)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Peak Page Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(trafficData.reduce((sum, d) => sum + d.visitors, 0) / trafficData.length).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(trafficData.reduce((sum, d) => sum + d.pageViews, 0) / trafficData.length).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Page Views</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Section */}
      <div className="mt-12 text-center py-16">
        <div className="max-w-xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Activity className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Advanced Analytics Coming Soon
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            We are working on bringing you detailed analytics, charts, and engagement insights for your ChatHub experience. Stay tuned for powerful new features!
          </p>
        </div>
      </div>
    </div>
  )
} 