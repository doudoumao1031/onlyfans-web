"use client"
import React, { useState } from "react"
import useCommonMessage, { CommonMessageContext } from "@/components/common/common-message"
import LoadingMask,{ CommonLoadingContext } from "@/components/common/loading-mask"
export function CommonMessageProvider ({ children }:{children:React.ReactNode}) {
  const { showMessage,renderNode } = useCommonMessage()
  return (
    <CommonMessageContext.Provider value={{ showMessage }}>
      {renderNode}
      {children}
    </CommonMessageContext.Provider>
  )
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  return (
    <CommonLoadingContext.Provider value={{
      isLoading, setIsLoading
    }}
    >
      <LoadingMask isLoading={isLoading}/>
      {children}
    </CommonLoadingContext.Provider>
  )
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CommonMessageProvider>
      <LoadingProvider>
        {children}
      </LoadingProvider>
    </CommonMessageProvider>
  )
}