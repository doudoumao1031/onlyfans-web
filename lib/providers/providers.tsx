"use client"

import React from "react"
import { GlobalProvider } from "@/lib/contexts/global-context"
import { MessageProvider } from "@/lib/contexts/message-context"
import { LoadingProvider } from "@/lib/contexts/loading-context"

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <GlobalProvider>
      <MessageProvider>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </MessageProvider>
    </GlobalProvider>
  )
}