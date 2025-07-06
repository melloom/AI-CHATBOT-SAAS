"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEnhancedBack } from "@/hooks/use-enhanced-back"

interface EnhancedBackButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function EnhancedBackButton({ 
  className = "flex items-center space-x-2 text-muted-foreground hover:text-foreground",
  variant = "ghost",
  size = "default"
}: EnhancedBackButtonProps) {
  const { backHref, handleBack } = useEnhancedBack()

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleBack}
      className={className}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back</span>
    </Button>
  )
}

export function EnhancedBackLink({ 
  className = "flex items-center space-x-2 text-muted-foreground hover:text-foreground",
  variant = "ghost",
  size = "default"
}: EnhancedBackButtonProps) {
  const { backHref } = useEnhancedBack()

  return (
    <Button 
      asChild
      variant={variant}
      size={size}
      className={className}
    >
      <Link href={backHref}>
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Link>
    </Button>
  )
} 