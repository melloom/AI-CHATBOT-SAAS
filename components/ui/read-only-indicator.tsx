import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Eye, Lock } from 'lucide-react'

interface ReadOnlyIndicatorProps {
  isReadOnly?: boolean
  className?: string
}

export function ReadOnlyIndicator({ isReadOnly, className = "" }: ReadOnlyIndicatorProps) {
  if (!isReadOnly) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
        <Eye className="h-3 w-3 mr-1" />
        Read-Only Mode
      </Badge>
      <div className="text-xs text-muted-foreground">
        You can view all data but cannot make changes
      </div>
    </div>
  )
}

export function ReadOnlyAlert() {
  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        <div>
          <h4 className="font-medium text-orange-800 dark:text-orange-200">Read-Only Access</h4>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            You are logged in as a test account with read-only permissions. You can view all data but cannot make any changes.
          </p>
        </div>
      </div>
    </div>
  )
} 