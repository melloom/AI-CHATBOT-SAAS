"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditChatbotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chatbot: any
  onSubmit: (data: any) => void
}

export function EditChatbotDialog({ open, onOpenChange, chatbot, onSubmit }: EditChatbotDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tone: "friendly",
    workflowId: "",
    active: true,
  })

  useEffect(() => {
    if (chatbot) {
      setFormData({
        name: chatbot.name || "",
        description: chatbot.description || "",
        tone: chatbot.tone || "friendly",
        workflowId: chatbot.workflowId || "",
        active: chatbot.active ?? true,
      })
    }
  }, [chatbot])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Chatbot</DialogTitle>
          <DialogDescription>Update your chatbot configuration and settings.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Chatbot Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Support Bot"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the bot's purpose"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Personality/Tone</Label>
              <Select
                value={formData.tone}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tone: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workflowId">n8n Workflow ID</Label>
              <Input
                id="workflowId"
                value={formData.workflowId}
                onChange={(e) => setFormData((prev) => ({ ...prev, workflowId: e.target.value }))}
                placeholder="e.g., workflow-123"
              />
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
