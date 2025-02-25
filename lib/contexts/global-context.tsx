"use client"

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { getSelfId } from "@/lib/actions/server-actions"

interface GlobalContextType {
  sid: number | null // self userId
  setSid: (sid: number | null) => void
}

interface GlobalProviderProps {
  children: ReactNode
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [sid, setSid] = useState<number | null>(0)
  useEffect(() => {
    const initData = async () => {
      await getSelfId().then((res) => {
        console.log("GlobalProvider set uid:", res)
        setSid(Number(res))
      })
    }
    initData()
  }, [])
  return <GlobalContext.Provider value={{ sid, setSid }}>{children}</GlobalContext.Provider>
}

export function useGlobal() {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error("useGlobal must be used within GlobalProvider")
  }
  return context
}
