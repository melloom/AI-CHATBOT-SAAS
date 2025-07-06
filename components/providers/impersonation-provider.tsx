import React, { createContext, useContext, useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export interface ImpersonationContextType {
  impersonatedCompany: any
  setImpersonatedCompany: (company: any) => void
  impersonationMode: 'view' | 'edit'
  setImpersonationMode: (mode: 'view' | 'edit') => void
  isImpersonating: boolean
  canEdit: boolean
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined)

export function ImpersonationProvider({ children }: { children: React.ReactNode }) {
  const [impersonatedCompany, setImpersonatedCompany] = useState<any>(null)
  const [impersonationMode, setImpersonationMode] = useState<'view' | 'edit'>('view')
  const { profile } = useAuth()

  const isImpersonating = impersonatedCompany !== null
  
  // Read-only admins can only view, not edit
  const isReadOnly = profile?.isReadOnly
  const canEdit = !isReadOnly

  // Override setImpersonationMode to prevent read-only admins from switching to edit mode
  const setImpersonationModeSafe = (mode: 'view' | 'edit') => {
    if (isReadOnly && mode === 'edit') {
      // Read-only admins can only view
      setImpersonationMode('view')
    } else {
      setImpersonationMode(mode)
    }
  }

  return (
    <ImpersonationContext.Provider value={{ 
      impersonatedCompany, 
      setImpersonatedCompany, 
      impersonationMode, 
      setImpersonationMode: setImpersonationModeSafe,
      isImpersonating,
      canEdit
    }}>
      {children}
    </ImpersonationContext.Provider>
  )
}

export function useImpersonation() {
  const ctx = useContext(ImpersonationContext)
  if (!ctx) throw new Error("useImpersonation must be used within an ImpersonationProvider")
  return ctx
} 