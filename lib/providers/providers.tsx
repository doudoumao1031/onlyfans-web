"use client"

import React from "react"
import { GlobalProvider } from "@/lib/contexts/global-context"
import { MessageProvider } from "@/lib/contexts/message-context"
import { LoadingProvider } from "@/lib/contexts/loading-context"

interface ProvidersProps {
  children: React.ReactNode
  sid?: number | null
}

export default function Providers({ children, sid }: ProvidersProps) {
  return (
    <GlobalProvider sid={sid}>
      <MessageProvider>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </MessageProvider>
    </GlobalProvider>
  )
}