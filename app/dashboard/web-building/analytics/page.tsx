"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer, 
  Clock,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Calendar,
  Download,
  Share2,
  Filter
} from "lucide-react"

interface AnalyticsData {
  visitors: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: number
  conversionRate: number
  topPages: Array<{ page: string; views: number; percentage: number }>
  trafficSources: Array<{ source: string; visitors: number; percentage: number }>
  devices: Array<{ device: string; visitors: number; percentage: number }>
  timeSeries: Array<{ date: string; visitors: number; pageViews: number }>
}

const mockAnalytics: AnalyticsData = {
  visitors: 15420,
  pageViews: 45230,
  bounceRate: 32.5,
  avgSessionDuration: 245,
  conversionRate: 2.8,
  topPages: [
    { page: "/", views: 12500, percentage: 27.6 },
    { page: "/products", views: 8900, percentage: 19.7 },
    { page: "/about", views: 6700, percentage: 14.8 },
    { page: "/contact", views: 5400, percentage: 11.9 },
    { page: "/blog", views: 4200, percentage: 9.3 }
  ],
  trafficSources: [
    { source: "Organic Search", visitors: 8200, percentage: 53.2 },
    { source: "Direct", visitors: 4200, percentage: 27.2 },
    { source: "Social Media", visitors: 1800, percentage: 11.7 },
    { source: "Referral", visitors: 1200, percentage: 7.8 }
  ],
  devices: [
    { device: "Desktop", visitors: 8900, percentage: 57.7 },
    { device: "Mobile", visitors: 5200, percentage: 33.7 },
    { device: "Tablet", visitors: 1320, percentage: 8.6 }
  ],
  timeSeries: [
    { date: "2024-01-01", visitors: 1200, pageViews: 3400 },
    { date: "2024-01-02", visitors: 1350, pageViews: 3800 },
    { date: "2024-01-03", visitors: 1100, pageViews: 3100 },
    { date: "2024-01-04", visitors: 1600, pageViews: 4500 },
    { date: "2024-01-05", visitors: 1800, pageViews: 5200 },
    { date: "2024-01-06", visitors: 2000, pageViews: 5800 },
    { date: "2024-01-07", visitors: 2200, pageViews: 6400 }
  ]
}

export default function WebsiteAnalytics() {
  const [selectedWebsite, setSelectedWebsite] = useState("techcorp-store.com")
  const [timeRange, setTimeRange] = useState("7d")
  const [data] = useState<AnalyticsData>(mockAnalytics)

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Website Analytics</h1>
              <p className="text-gray-600">Monitor your website performance and user behavior</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedWebsite} onValueChange={setSelectedWebsite}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="techcorp-store.com">TechCorp Store</SelectItem>
                <SelectItem value="localrestaurant.com">Local Restaurant</SelectItem>
                <SelectItem value="designportfolio.com">Design Portfolio</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold">{formatNumber(data.visitors)}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5%
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold">{formatNumber(data.pageViews)}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.3%
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold">{data.bounceRate}%</p>
                <p className="text-sm text-red-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
                  +2.1%
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                <p className="text-2xl font-bold">{formatDuration(data.avgSessionDuration)}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5.2%
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traffic Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Visitor trends over the selected time period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.timeSeries.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{day.date}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{formatNumber(day.visitors)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-green-500" />
                      <span>{formatNumber(day.pageViews)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 
                      index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <span className="text-sm font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">{formatNumber(source.visitors)}</span>
                    <Badge variant="secondary">{source.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Analytics and Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Device Analytics</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.devices.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {device.device === 'Desktop' && <Monitor className="h-4 w-4 text-blue-500" />}
                    {device.device === 'Mobile' && <Smartphone className="h-4 w-4 text-green-500" />}
                    {device.device === 'Tablet' && <Tablet className="h-4 w-4 text-purple-500" />}
                    <span className="text-sm font-medium">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">{formatNumber(device.visitors)}</span>
                    <Badge variant="secondary">{device.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium">{page.page}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">{formatNumber(page.views)}</span>
                    <Badge variant="secondary">{page.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Analytics */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conversion Analytics</CardTitle>
          <CardDescription>Track your website's conversion performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{data.conversionRate}%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
              <div className="text-xs text-green-600 mt-1">+0.5% from last period</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{formatNumber(data.visitors * (data.conversionRate / 100))}</div>
              <div className="text-sm text-gray-600">Conversions</div>
              <div className="text-xs text-blue-600 mt-1">+12% from last period</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">${(data.visitors * (data.conversionRate / 100) * 25).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Estimated Revenue</div>
              <div className="text-xs text-purple-600 mt-1">+8% from last period</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 