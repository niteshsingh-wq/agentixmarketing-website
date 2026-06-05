'use client'
import { createContext, useContext, useState, useCallback } from 'react'

type LeadMode = 'form' | 'audit'

interface LeadState {
  open: boolean
  mode: LeadMode
  initialUrl: string
}

interface LeadContextValue {
  modal: LeadState
  openLead: (mode?: LeadMode, url?: string) => void
  closeLead: () => void
  setMode: (mode: LeadMode) => void
}

const LeadContext = createContext<LeadContextValue | null>(null)

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<LeadState>({ open: false, mode: 'form', initialUrl: '' })

  const openLead = useCallback((mode: LeadMode = 'form', url = '') => {
    setModal({ open: true, mode, initialUrl: url })
  }, [])

  const closeLead = useCallback(() => {
    setModal(m => ({ ...m, open: false }))
  }, [])

  const setMode = useCallback((mode: LeadMode) => {
    setModal(m => ({ ...m, mode }))
  }, [])

  return (
    <LeadContext.Provider value={{ modal, openLead, closeLead, setMode }}>
      {children}
    </LeadContext.Provider>
  )
}

export function useLeadModal() {
  const ctx = useContext(LeadContext)
  if (!ctx) throw new Error('useLeadModal must be used within LeadProvider')
  return ctx
}
