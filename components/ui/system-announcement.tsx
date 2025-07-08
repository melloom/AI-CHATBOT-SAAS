"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, AlertCircle, Info, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface SystemAnnouncementProps {
  className?: string
}

interface AnnouncementData {
  systemAnnouncement: string
  announcementEnabled: boolean
  announcementType: "info" | "success" | "warning" | "error"
  announcementExpiry?: string
}

export function SystemAnnouncement({ className = "" }: SystemAnnouncementProps) {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          if (data.announcementEnabled && data.systemAnnouncement) {
            // Check if announcement has expired
            if (data.announcementExpiry) {
              const expiryDate = new Date(data.announcementExpiry)
              if (expiryDate > new Date()) {
                setAnnouncement(data)
                setIsVisible(true)
              }
            } else {
              setAnnouncement(data)
              setIsVisible(true)
            }
          }
        } else {
          console.error('Failed to fetch announcement:', response.status)
          setError('Failed to load announcement')
        }
      } catch (error) {
        console.error('Error fetching system announcement:', error)
        setError('Failed to load announcement')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncement()
  }, [user])

  const handleDismiss = () => {
    setIsVisible(false)
    // Store dismissal in localStorage to prevent showing again for this session
    if (announcement?.systemAnnouncement) {
      localStorage.setItem('announcement-dismissed', announcement.systemAnnouncement)
    }
    
    toast({
      title: "Announcement dismissed",
      description: "You won't see this announcement again in this session.",
    })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'default'
      case 'warning':
        return 'destructive'
      case 'error':
        return 'destructive'
      default:
        return 'default'
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`mb-4 ${className}`}>
        <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/50">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Loading announcements...</span>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className={`mb-4 ${className}`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please refresh the page to try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Don't show if not visible or no announcement
  if (!isVisible || !announcement) {
    return (
      <div className={`mb-4 ${className}`}>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No announcements at this time. Check back later for updates!
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Check if user has dismissed this announcement
  const dismissedAnnouncement = localStorage.getItem('announcement-dismissed')
  if (dismissedAnnouncement === announcement.systemAnnouncement) {
    return null
  }

  return (
    <Alert className={`mb-4 ${className}`} variant={getVariant(announcement.announcementType)}>
      <div className="flex items-start space-x-2">
        {getIcon(announcement.announcementType)}
        <AlertDescription className="flex-1">
          {announcement.systemAnnouncement}
        </AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-auto p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  )
} 