"use client"

import React, { createContext, useContext, ReactNode } from "react"
import useCommonMessage, { CommonMessageContext as MessageContext } from "@/components/common/common-message"

interface MessageProviderProps {
  children: ReactNode
}

export function MessageProvider({ children }: MessageProviderProps) {
  const { showMessage, renderNode } = useCommonMessage()
  return (
    <MessageContext.Provider value={{ showMessage }}>
      {renderNode}
      {children}
    </MessageContext.Provider>
  )
}

export { MessageContext }
export type { MessageProviderProps }
