"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Play, Pause, MessageSquare, Settings2, Star, Clock, Zap, Filter, Search } from "lucide-react"
import { CreateChatbotDialog } from "@/components/chatbots/create-chatbot-dialog"
import { EditChatbotDialog } from "@/components/chatbots/edit-chatbot-dialog"
import { useChatbots } from "@/hooks/use-chatbots"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerBackgroundRefresh, unregisterBackgroundRefresh } from "@/lib/background-refresh"
import { useEffect } from "react"

const categories = ["All", "Customer Support", "Sales", "General", "HR", "IT Support", "E-commerce"]

export default function ChatbotsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedChatbot, setSelectedChatbot] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { chatbots, loading, createChatbot, updateChatbot, deleteChatbot, refreshChatbots } = useChatbots()
  const { toast } = useToast()

  // Set up background refresh every 30 seconds
  useEffect(() => {
    registerBackgroundRefresh('chatbots', refreshChatbots, 30000)
    
    return () => {
      unregisterBackgroundRefresh('chatbots')
    }
  }, [refreshChatbots])

  const handleCreateChatbot = async (data: any) => {
    try {
      await createChatbot(data)
      setCreateDialogOpen(false)
      toast({
        title: "🎉 Chatbot created!",
        description: "Your new AI assistant is ready to help customers.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chatbot. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditChatbot = async (data: any) => {
    try {
      await updateChatbot(selectedChatbot.id, data)
      setEditDialogOpen(false)
      setSelectedChatbot(null)
      toast({
        title: "✅ Chatbot updated!",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update chatbot. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (chatbot: any) => {
    try {
      await updateChatbot(chatbot.id, { active: !chatbot.active })
      toast({
        title: chatbot.active ? "🔴 Chatbot deactivated" : "🟢 Chatbot activated",
        description: `${chatbot.name} is now ${chatbot.active ? "offline" : "online"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update chatbot status.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteChatbot = async (chatbot: any) => {
    if (confirm(`Are you sure you want to delete "${chatbot.name}"? This action cannot be undone.`)) {
      try {
        await deleteChatbot(chatbot.id)
        toast({
          title: "🗑️ Chatbot deleted",
          description: "The chatbot has been permanently removed.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete chatbot. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const getBotIcon = (name: string) => {
    if (name.toLowerCase().includes("support")) return "🛠️"
    if (name.toLowerCase().includes("sales")) return "💼"
    if (name.toLowerCase().includes("hr")) return "👥"
    if (name.toLowerCase().includes("it")) return "🔧"
    if (name.toLowerCase().includes("ecommerce")) return "🛍️"
    return "🤖"
  }

  const getGradientClass = (index: number) => {
    const gradients = [
      "bg-gradient-to-r from-blue-500 to-purple-600",
      "bg-gradient-to-r from-green-500 to-teal-600",
      "bg-gradient-to-r from-orange-500 to-red-600",
      "bg-gradient-to-r from-purple-500 to-pink-600",
      "bg-gradient-to-r from-indigo-500 to-blue-600",
      "bg-gradient-to-r from-emerald-500 to-green-600"
    ]
    return gradients[index % gradients.length]
  }

  const getCategory = (chatbot: any) => {
    if (chatbot.name.toLowerCase().includes("support")) return "Customer Support"
    if (chatbot.name.toLowerCase().includes("sales")) return "Sales"
    if (chatbot.name.toLowerCase().includes("hr")) return "HR"
    if (chatbot.name.toLowerCase().includes("it")) return "IT Support"
    if (chatbot.name.toLowerCase().includes("ecommerce")) return "E-commerce"
    return "General"
  }

  const getFeatures = (chatbot: any) => {
    const features = []
    if (chatbot.active) features.push("Active")
    if (chatbot.conversations > 0) features.push("Conversations")
    if (chatbot.tone) features.push(chatbot.tone)
    return features
  }

  const filteredChatbots = chatbots.filter((chatbot) => {
    const matchesSearch =
      chatbot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatbot.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || getCategory(chatbot) === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-300">Loading your AI assistants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">ChatHub Command Center</h1>
            <p className="text-lg text-white/90">Manage your intelligent chatbots and monitor their performance</p>
            <div className="flex items-center space-x-6 mt-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{chatbots.filter((bot) => bot.active).length} Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>{chatbots.filter((bot) => !bot.active).length} Inactive</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-300" />
                <span>4.8 average rating</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Bot
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search chatbots by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {chatbots.length === 0 ? (
        <Card className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700">
          <CardContent>
            <div className="text-6xl mb-6">🤖</div>
            <CardTitle className="text-2xl mb-4 text-gray-900 dark:text-white">No AI chatbots yet</CardTitle>
            <CardDescription className="text-lg mb-6 max-w-md mx-auto text-gray-600 dark:text-gray-300">
              Create your first intelligent chatbot to start automating customer support and boost satisfaction.
            </CardDescription>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Bot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChatbots.map((chatbot, index) => (
            <Card
              key={chatbot.id}
              className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
            >
              {/* Gradient header */}
              <div className={`h-2 ${getGradientClass(index)}`}></div>

              <CardHeader className="relative">
                {chatbot.active && (
                  <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs animate-pulse">
                    🟢 Active
                  </Badge>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{getBotIcon(chatbot.name)}</div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">4.8</span>
                      <span className="text-xs text-gray-500 dark:text-gray-300">(24)</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors text-gray-900 dark:text-white">
                  {chatbot.name}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {chatbot.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Quick stats */}
                <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-200">
                      {formatDistanceToNow(new Date(chatbot.updatedAt))} ago
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs dark:text-gray-200">
                    {getCategory(chatbot)}
                  </Badge>
                </div>

                {/* Performance metrics */}
                <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${chatbot.active ? "text-green-600" : "text-gray-400"} dark:text-white`}>
                      {chatbot.conversations || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">Conversations</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${chatbot.active ? "text-green-600" : "text-gray-400"} dark:text-white`}>
                      {chatbot.active ? "95%" : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${chatbot.active ? "text-green-600" : "text-gray-400"} dark:text-white`}>
                      {chatbot.active ? "1.8s" : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">Avg Response</div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {getFeatures(chatbot).slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                        {feature}
                      </Badge>
                    ))}
                    {getFeatures(chatbot).length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                        +{getFeatures(chatbot).length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Personality */}
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-300">Personality: </span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">{chatbot.tone || "Friendly"}</span>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(chatbot)}
                    className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200"
                  >
                    {chatbot.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedChatbot(chatbot)
                      setEditDialogOpen(true)
                    }}
                    className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200"
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteChatbot(chatbot)}
                    className="flex-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>


              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredChatbots.length === 0 && chatbots.length > 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No chatbots found</h3>
          <p className="text-gray-500 dark:text-gray-300">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <CreateChatbotDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSubmit={handleCreateChatbot} />

      {selectedChatbot && (
        <EditChatbotDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          chatbot={selectedChatbot}
          onSubmit={handleEditChatbot}
        />
      )}
    </div>
  )
}
