"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Bot, 
  Zap, 
  Settings, 
  Workflow, 
  MessageSquare, 
  Brain, 
  Sparkles,
  Globe,
  Database,
  Shield,
  Clock
} from "lucide-react"

interface CreateChatbotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

const aiModels = [
  { id: "gpt-4", name: "GPT-4", description: "Most capable model for complex tasks", icon: "🧠" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and cost-effective", icon: "⚡" },
  { id: "claude-3", name: "Claude 3", description: "Anthropic's latest model", icon: "🤖" },
  { id: "custom", name: "Custom Model", description: "Use your own AI model", icon: "🔧" }
]

const integrationTypes = [
  { id: "n8n", name: "n8n Workflow", description: "Connect to n8n automation workflows", icon: "🔄", color: "bg-blue-500" },
  { id: "zapier", name: "Zapier", description: "Connect to 5000+ apps via Zapier", icon: "⚡", color: "bg-orange-500" },
  { id: "make", name: "Make.com", description: "Visual automation platform", icon: "🎨", color: "bg-purple-500" },
  { id: "custom", name: "Custom API", description: "Connect to your own APIs", icon: "🔗", color: "bg-gray-500" }
]

export function CreateChatbotDialog({ open, onOpenChange, onSubmit }: CreateChatbotDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tone: "friendly",
    model: "gpt-4",
    integrationType: "n8n",
    workflowId: "",
    apiEndpoint: "",
    apiKey: "",
    active: true,
    features: {
      fileUpload: false,
      voiceChat: false,
      multiLanguage: false,
      analytics: true,
      customBranding: false
    },
    settings: {
      maxTokens: 2000,
      temperature: 0.7,
      responseTime: 5,
      enableMemory: true,
      enableContext: true
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      name: "",
      description: "",
      tone: "friendly",
      model: "gpt-4",
      integrationType: "n8n",
      workflowId: "",
      apiEndpoint: "",
      apiKey: "",
      active: true,
      features: {
        fileUpload: false,
        voiceChat: false,
        multiLanguage: false,
        analytics: true,
        customBranding: false
      },
      settings: {
        maxTokens: 2000,
        temperature: 0.7,
        responseTime: 5,
        enableMemory: true,
        enableContext: true
      }
    })
  }

  const updateFeature = (feature: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value
      }
    }))
  }

  const updateSetting = (setting: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value
      }
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-purple-600" />
            <span>Create New AI Chatbot</span>
          </DialogTitle>
          <DialogDescription>
            Configure your intelligent chatbot with AI models and automation integrations. 
            Connect to n8n, Zapier, or custom APIs for powerful workflows.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="ai">AI Model</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Chatbot Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Customer Support Bot"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="What does this chatbot do? How can it help users?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Personality & Tone</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">🤝 Friendly & Helpful</SelectItem>
                      <SelectItem value="professional">💼 Professional & Formal</SelectItem>
                      <SelectItem value="casual">😊 Casual & Relaxed</SelectItem>
                      <SelectItem value="enthusiastic">🚀 Enthusiastic & Energetic</SelectItem>
                      <SelectItem value="technical">🔧 Technical & Precise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active">Active (bot will respond to messages)</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>AI Model Selection</Label>
                  <div className="grid gap-3">
                    {aiModels.map((model) => (
                      <Card
                        key={model.id}
                        className={`cursor-pointer transition-all ${
                          formData.model === model.id
                            ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, model: model.id }))}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{model.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium">{model.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{model.description}</div>
                            </div>
                            {formData.model === model.id && (
                              <Badge className="bg-purple-500">Selected</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Max Response Length</Label>
                    <Select
                      value={formData.settings.maxTokens.toString()}
                      onValueChange={(value) => updateSetting("maxTokens", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">Short (1000 tokens)</SelectItem>
                        <SelectItem value="2000">Medium (2000 tokens)</SelectItem>
                        <SelectItem value="4000">Long (4000 tokens)</SelectItem>
                        <SelectItem value="8000">Very Long (8000 tokens)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Creativity Level</Label>
                    <Select
                      value={formData.settings.temperature.toString()}
                      onValueChange={(value) => updateSetting("temperature", parseFloat(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.1">Focused (0.1)</SelectItem>
                        <SelectItem value="0.3">Balanced (0.3)</SelectItem>
                        <SelectItem value="0.7">Creative (0.7)</SelectItem>
                        <SelectItem value="1.0">Very Creative (1.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Integration Type</Label>
                  <div className="grid gap-3">
                    {integrationTypes.map((integration) => (
                      <Card
                        key={integration.id}
                        className={`cursor-pointer transition-all ${
                          formData.integrationType === integration.id
                            ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, integrationType: integration.id }))}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg ${integration.color} flex items-center justify-center text-white`}>
                              {integration.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{integration.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{integration.description}</div>
                            </div>
                            {formData.integrationType === integration.id && (
                              <Badge className="bg-purple-500">Selected</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {formData.integrationType === "n8n" && (
                  <div className="space-y-2">
                    <Label htmlFor="workflowId">n8n Workflow ID</Label>
                    <Input
                      id="workflowId"
                      value={formData.workflowId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, workflowId: e.target.value }))}
                      placeholder="e.g., workflow-abc123"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Enter the workflow ID from your n8n instance
                    </p>
                  </div>
                )}

                {formData.integrationType === "custom" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiEndpoint">API Endpoint</Label>
                      <Input
                        id="apiEndpoint"
                        value={formData.apiEndpoint}
                        onChange={(e) => setFormData((prev) => ({ ...prev, apiEndpoint: e.target.value }))}
                        placeholder="https://api.example.com/webhook"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key (Optional)</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        value={formData.apiKey}
                        onChange={(e) => setFormData((prev) => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="Enter API key if required"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Advanced Features</Label>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Database className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">File Upload Support</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Allow users to upload files</div>
                        </div>
                      </div>
                      <Switch
                        checked={formData.features.fileUpload}
                        onCheckedChange={(checked) => updateFeature("fileUpload", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-medium">Voice Chat</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Enable voice conversations</div>
                        </div>
                      </div>
                      <Switch
                        checked={formData.features.voiceChat}
                        onCheckedChange={(checked) => updateFeature("voiceChat", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-purple-500" />
                        <div>
                          <div className="font-medium">Multi-Language Support</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Support multiple languages</div>
                        </div>
                      </div>
                      <Switch
                        checked={formData.features.multiLanguage}
                        onCheckedChange={(checked) => updateFeature("multiLanguage", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-orange-500" />
                        <div>
                          <div className="font-medium">Custom Branding</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Customize bot appearance</div>
                        </div>
                      </div>
                      <Switch
                        checked={formData.features.customBranding}
                        onCheckedChange={(checked) => updateFeature("customBranding", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responseTime">Max Response Time (seconds)</Label>
                    <Select
                      value={formData.settings.responseTime.toString()}
                      onValueChange={(value) => updateSetting("responseTime", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Fast (3s)</SelectItem>
                        <SelectItem value="5">Normal (5s)</SelectItem>
                        <SelectItem value="10">Slow (10s)</SelectItem>
                        <SelectItem value="30">Very Slow (30s)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Memory & Context</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.settings.enableMemory}
                          onCheckedChange={(checked) => updateSetting("enableMemory", checked)}
                        />
                        <Label className="text-sm">Enable conversation memory</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.settings.enableContext}
                          onCheckedChange={(checked) => updateSetting("enableContext", checked)}
                        />
                        <Label className="text-sm">Maintain conversation context</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Sparkles className="mr-2 h-4 w-4" />
              Create AI Chatbot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
