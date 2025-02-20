"use client"

import React, { createContext, useContext, ReactNode } from "react"

interface GlobalContextType {
  sid: number | null // self userId
  setSid: (sid: number | null) => void
}

interface GlobalProviderProps {
  children: ReactNode
  sid?: number | null
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children, sid: initSid = 0 }: GlobalProviderProps) {
  const [sid, setSid] = React.useState<number | null>(initSid)
  return (
    <GlobalContext.Provider value={{ sid, setSid }}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobal() {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error("useGlobal must be used within GlobalProvider")
  }
  return context
}
