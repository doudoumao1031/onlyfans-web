"use client"

import React, { createContext, useContext, ReactNode } from "react"

interface GlobalContextType {
  userId: string | null
}

interface GlobalProviderProps {
  children: ReactNode
  userId?: string | null
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children, userId = null }: GlobalProviderProps) {
  return (
    <GlobalContext.Provider value={{ userId }}>
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
