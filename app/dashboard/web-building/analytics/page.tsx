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

import { useWebVaultAnalytics } from "@/hooks/use-webvault"

export default function WebsiteAnalytics() {
  const [selectedWebsite, setSelectedWebsite] = useState("all")
  const [timeRange, setTimeRange] = useState("7d")
  const { analytics: data, loading, error } = useWebVaultAnalytics(selectedWebsite, timeRange)

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
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <p className="text-red-600">Failed to load analytics: {error}</p>
              </CardContent>
            </Card>
          </div>
        ) : data ? (
          // Real analytics data
          <>
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
          </>
        ) : null}
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
              {data?.timeSeries && data.timeSeries.length > 0 ? (
                data.timeSeries.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{day.date}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-200">{formatNumber(day.visitors)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-green-500 dark:text-green-400" />
                        <span className="text-gray-700 dark:text-gray-200">{formatNumber(day.pageViews)}</span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                  <p>No traffic data available</p>
                </div>
              )}
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
              {data?.trafficSources && data.trafficSources.length > 0 ? (
                data.trafficSources.map((source, index) => (
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No traffic sources data available</p>
                </div>
              )}
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
              {data?.devices && data.devices.length > 0 ? (
                data.devices.map((device, index) => (
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No device data available</p>
                </div>
              )}
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
              {data?.topPages && data.topPages.length > 0 ? (
                data.topPages.map((page, index) => (
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No page data available</p>
                </div>
              )}
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
              <div className="text-2xl font-bold text-green-600">{data?.conversionRate || 0}%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
              <div className="text-xs text-green-600 mt-1">+0.5% from last period</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{formatNumber((data?.visitors || 0) * ((data?.conversionRate || 0) / 100))}</div>
              <div className="text-sm text-gray-600">Conversions</div>
              <div className="text-xs text-blue-600 mt-1">+12% from last period</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">${((data?.visitors || 0) * ((data?.conversionRate || 0) / 100) * 25).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Estimated Revenue</div>
              <div className="text-xs text-purple-600 mt-1">+8% from last period</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 