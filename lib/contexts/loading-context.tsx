"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

import LoadingMask, { CommonLoadingContext as LoadingContext } from "@/components/common/loading-mask"

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  return (
    <LoadingContext.Provider value={{
      isLoading,
      setIsLoading
    }}
    >
      <LoadingMask isLoading={isLoading} />
      {children}
    </LoadingContext.Provider>
  )
}

export { LoadingContext }
export type { LoadingProviderProps }
