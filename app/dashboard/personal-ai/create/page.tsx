"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Bot, 
  Brain, 
  MessageCircle, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  Users,
  TrendingUp,
  Mail,
  Calendar,
  FileText,
  Search,
  Mic,
  Settings,
  Globe,
  Smartphone,
  Database,
  Palette,
  Code,
  Headphones,
  Plus,
  Sparkles,
  Eye,
  Download,
  ArrowLeft,
  Save
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CreatePersonalAI() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [aiConfig, setAiConfig] = useState({
    name: "",
    description: "",
    personality: "professional",
    responseLength: "medium",
    language: "en",
    voiceEnabled: false,
    autoSave: true
  })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    // Load selected template from localStorage
    const storedTemplate = localStorage.getItem('selectedAITemplate')
    if (storedTemplate) {
      const template = JSON.parse(storedTemplate)
      setSelectedTemplate(template)
      setAiConfig(prev => ({
        ...prev,
        name: template.name,
        description: template.description
      }))
    }
  }, [])

  const handleCreateAI = async () => {
    if (!aiConfig.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your AI assistant.",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)
    
    // Simulate AI creation process
    setTimeout(() => {
      setIsCreating(false)
      toast({
        title: "AI Assistant Created!",
        description: `${aiConfig.name} has been successfully created and is ready to use.`,
        variant: "default"
      })
      
      // Clear stored template
      localStorage.removeItem('selectedAITemplate')
      
      // Redirect to the new AI assistant
      router.push('/dashboard/personal-ai')
    }, 2000)
  }

  const handleBack = () => {
    router.push('/dashboard/personal-ai/templates')
  }

  if (!selectedTemplate) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No template selected</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please select a template to create your AI assistant.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create AI Assistant</h1>
          <p className="text-muted-foreground">Configure your new personal AI assistant</p>
        </div>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span>AI Configuration</span>
              </CardTitle>
              <CardDescription>Set up your AI assistant's basic settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name">AI Assistant Name *</Label>
                <Input
                  id="name"
                  value={aiConfig.name}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter a name for your AI assistant"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={aiConfig.description}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what your AI assistant will help you with"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="personality">Personality</Label>
                  <Select value={aiConfig.personality} onValueChange={(value) => setAiConfig(prev => ({ ...prev, personality: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="concise">Concise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="responseLength">Response Length</Label>
                  <Select value={aiConfig.responseLength} onValueChange={(value) => setAiConfig(prev => ({ ...prev, responseLength: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={aiConfig.language} onValueChange={(value) => setAiConfig(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="voiceEnabled"
                    checked={aiConfig.voiceEnabled}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, voiceEnabled: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="voiceEnabled">Enable voice interactions</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>Configure privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSave">Auto-save conversations</Label>
                  <p className="text-sm text-muted-foreground">Automatically save your chat history</p>
                </div>
                <input
                  type="checkbox"
                  id="autoSave"
                  checked={aiConfig.autoSave}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, autoSave: e.target.checked }))}
                  className="rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dataCollection">Data collection</Label>
                  <p className="text-sm text-muted-foreground">Help improve AI by sharing usage data</p>
                </div>
                <input
                  type="checkbox"
                  id="dataCollection"
                  defaultChecked
                  className="rounded"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-purple-600" />
                <span>Template Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`h-3 ${selectedTemplate.gradient} rounded-t-lg mb-4`}></div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${selectedTemplate.gradient} rounded-lg flex items-center justify-center text-white`}>
                  <selectedTemplate.icon className="w-6 h-6" />
                </div>
                <Badge variant="secondary">{selectedTemplate.category}</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{selectedTemplate.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{selectedTemplate.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Setup time:</span>
                  <span className="font-medium">{selectedTemplate.setupTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Rating:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{selectedTemplate.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Price:</span>
                  <span className="font-medium">{selectedTemplate.price}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Features:</h4>
                <div className="space-y-1">
                  {selectedTemplate.features.slice(0, 3).map((feature: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                onClick={handleCreateAI}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create AI Assistant
                  </>
                )}
              </Button>
              
              <Button variant="outline" className="w-full" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Choose Different Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 