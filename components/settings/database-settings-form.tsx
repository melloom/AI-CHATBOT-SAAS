"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Database, 
  Server, 
  Cloud, 
  Shield, 
  Settings,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Activity,
  Clock,
  HardDrive
} from "lucide-react"

export function DatabaseSettingsForm() {
  const [settings, setSettings] = useState({
    // Database Connection
    databaseType: "firestore",
    databaseUrl: "https://your-project.firebaseio.com",
    databaseName: "chathub",
    maxConnections: 10,
    connectionTimeout: 30000,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: 30,
    backupEncryption: true,
    backupCompression: true,
    
    // Performance Settings
    queryCache: true,
    cacheSize: 100,
    cacheExpiry: 3600,
    connectionPooling: true,
    maxQueryTime: 30000,
    
    // Security Settings
    sslConnection: true,
    dataEncryption: true,
    auditLogging: true,
    accessLogging: true,
    
    // Maintenance Settings
    autoOptimization: true,
    autoVacuum: true,
    autoAnalyze: true,
    maintenanceWindow: "02:00",
    
    // Monitoring
    performanceMonitoring: true,
    slowQueryLogging: true,
    connectionMonitoring: true,
    diskSpaceMonitoring: true
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [databaseStatus, setDatabaseStatus] = useState({
    connected: true,
    performance: "good",
    diskUsage: 45,
    activeConnections: 3,
    lastBackup: "2024-01-15 02:00:00"
  })

  const handleSave = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleTestConnection = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    // Show connection test result
  }

  const handleBackupNow = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 5000))
    setLoading(false)
    // Show backup completion
  }

  return (
    <div className="space-y-6">
      {/* Database Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Connection</p>
                <p className="text-sm text-muted-foreground">
                  {databaseStatus.connected ? "Connected" : "Disconnected"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Performance</p>
                <p className="text-sm text-muted-foreground capitalize">{databaseStatus.performance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">Disk Usage</p>
                <p className="text-sm text-muted-foreground">{databaseStatus.diskUsage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Connections</p>
                <p className="text-sm text-muted-foreground">{databaseStatus.activeConnections}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Database Connection</span>
          </CardTitle>
          <CardDescription>Configure database connection settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="databaseType">Database Type</Label>
              <Select value={settings.databaseType} onValueChange={(value) => setSettings({ ...settings, databaseType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="firestore">Firestore</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="databaseName">Database Name</Label>
              <Input
                id="databaseName"
                value={settings.databaseName}
                onChange={(e) => setSettings({ ...settings, databaseName: e.target.value })}
                placeholder="chathub"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="databaseUrl">Database URL</Label>
              <Input
                id="databaseUrl"
                value={settings.databaseUrl}
                onChange={(e) => setSettings({ ...settings, databaseUrl: e.target.value })}
                placeholder="https://your-project.firebaseio.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxConnections">Max Connections</Label>
              <Input
                id="maxConnections"
                type="number"
                value={settings.maxConnections}
                onChange={(e) => setSettings({ ...settings, maxConnections: parseInt(e.target.value) })}
                min="1"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="connectionTimeout">Connection Timeout (ms)</Label>
              <Input
                id="connectionTimeout"
                type="number"
                value={settings.connectionTimeout}
                onChange={(e) => setSettings({ ...settings, connectionTimeout: parseInt(e.target.value) })}
                min="1000"
                max="60000"
              />
            </div>
          </div>
          <Button onClick={handleTestConnection} disabled={loading} variant="outline">
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Test Connection
          </Button>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="h-5 w-5" />
            <span>Backup Settings</span>
          </CardTitle>
          <CardDescription>Configure automated backup settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Backup</Label>
                <p className="text-sm text-muted-foreground">Enable automated backups</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup Encryption</Label>
                <p className="text-sm text-muted-foreground">Encrypt backup files</p>
              </div>
              <Switch
                checked={settings.backupEncryption}
                onCheckedChange={(checked) => setSettings({ ...settings, backupEncryption: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup Compression</Label>
                <p className="text-sm text-muted-foreground">Compress backup files</p>
              </div>
              <Switch
                checked={settings.backupCompression}
                onCheckedChange={(checked) => setSettings({ ...settings, backupCompression: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Backup Frequency</Label>
              <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupRetention">Backup Retention (Days)</Label>
              <Input
                id="backupRetention"
                type="number"
                value={settings.backupRetention}
                onChange={(e) => setSettings({ ...settings, backupRetention: parseInt(e.target.value) })}
                min="1"
                max="365"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Last Backup</p>
              <p className="text-sm text-muted-foreground">{databaseStatus.lastBackup}</p>
            </div>
            <Button onClick={handleBackupNow} disabled={loading}>
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Backup Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Performance Settings</span>
          </CardTitle>
          <CardDescription>Configure database performance optimization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Query Cache</Label>
                <p className="text-sm text-muted-foreground">Enable query result caching</p>
              </div>
              <Switch
                checked={settings.queryCache}
                onCheckedChange={(checked) => setSettings({ ...settings, queryCache: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Connection Pooling</Label>
                <p className="text-sm text-muted-foreground">Enable connection pooling</p>
              </div>
              <Switch
                checked={settings.connectionPooling}
                onCheckedChange={(checked) => setSettings({ ...settings, connectionPooling: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cacheSize">Cache Size (MB)</Label>
              <Input
                id="cacheSize"
                type="number"
                value={settings.cacheSize}
                onChange={(e) => setSettings({ ...settings, cacheSize: parseInt(e.target.value) })}
                min="10"
                max="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cacheExpiry">Cache Expiry (seconds)</Label>
              <Input
                id="cacheExpiry"
                type="number"
                value={settings.cacheExpiry}
                onChange={(e) => setSettings({ ...settings, cacheExpiry: parseInt(e.target.value) })}
                min="60"
                max="86400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxQueryTime">Max Query Time (ms)</Label>
              <Input
                id="maxQueryTime"
                type="number"
                value={settings.maxQueryTime}
                onChange={(e) => setSettings({ ...settings, maxQueryTime: parseInt(e.target.value) })}
                min="1000"
                max="300000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>Configure database security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SSL Connection</Label>
                <p className="text-sm text-muted-foreground">Use SSL for database connections</p>
              </div>
              <Switch
                checked={settings.sslConnection}
                onCheckedChange={(checked) => setSettings({ ...settings, sslConnection: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Data Encryption</Label>
                <p className="text-sm text-muted-foreground">Encrypt data at rest</p>
              </div>
              <Switch
                checked={settings.dataEncryption}
                onCheckedChange={(checked) => setSettings({ ...settings, dataEncryption: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Log database access events</p>
              </div>
              <Switch
                checked={settings.auditLogging}
                onCheckedChange={(checked) => setSettings({ ...settings, auditLogging: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Access Logging</Label>
                <p className="text-sm text-muted-foreground">Log connection attempts</p>
              </div>
              <Switch
                checked={settings.accessLogging}
                onCheckedChange={(checked) => setSettings({ ...settings, accessLogging: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Maintenance Settings</span>
          </CardTitle>
          <CardDescription>Configure automated maintenance tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Optimization</Label>
                <p className="text-sm text-muted-foreground">Automatically optimize database</p>
              </div>
              <Switch
                checked={settings.autoOptimization}
                onCheckedChange={(checked) => setSettings({ ...settings, autoOptimization: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Vacuum</Label>
                <p className="text-sm text-muted-foreground">Automatically clean up dead tuples</p>
              </div>
              <Switch
                checked={settings.autoVacuum}
                onCheckedChange={(checked) => setSettings({ ...settings, autoVacuum: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Analyze</Label>
                <p className="text-sm text-muted-foreground">Automatically update statistics</p>
              </div>
              <Switch
                checked={settings.autoAnalyze}
                onCheckedChange={(checked) => setSettings({ ...settings, autoAnalyze: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceWindow">Maintenance Window</Label>
              <Input
                id="maintenanceWindow"
                type="time"
                value={settings.maintenanceWindow}
                onChange={(e) => setSettings({ ...settings, maintenanceWindow: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Monitoring Settings</span>
          </CardTitle>
          <CardDescription>Configure database monitoring and alerting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Performance Monitoring</Label>
                <p className="text-sm text-muted-foreground">Monitor database performance</p>
              </div>
              <Switch
                checked={settings.performanceMonitoring}
                onCheckedChange={(checked) => setSettings({ ...settings, performanceMonitoring: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Slow Query Logging</Label>
                <p className="text-sm text-muted-foreground">Log slow queries</p>
              </div>
              <Switch
                checked={settings.slowQueryLogging}
                onCheckedChange={(checked) => setSettings({ ...settings, slowQueryLogging: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Connection Monitoring</Label>
                <p className="text-sm text-muted-foreground">Monitor active connections</p>
              </div>
              <Switch
                checked={settings.connectionMonitoring}
                onCheckedChange={(checked) => setSettings({ ...settings, connectionMonitoring: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Disk Space Monitoring</Label>
                <p className="text-sm text-muted-foreground">Monitor disk space usage</p>
              </div>
              <Switch
                checked={settings.diskSpaceMonitoring}
                onCheckedChange={(checked) => setSettings({ ...settings, diskSpaceMonitoring: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {saved && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Database Settings Saved
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleTestConnection}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Test Connection
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Database Settings
          </Button>
        </div>
      </div>
    </div>
  )
} 