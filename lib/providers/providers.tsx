
import React from "react"

import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

import { EmitterProvider } from "@/lib/contexts/emitter-context"
import { GlobalProvider } from "@/lib/contexts/global-context"
import { LoadingProvider } from "@/lib/contexts/loading-context"
import { MessageProvider } from "@/lib/contexts/message-context"

interface ProvidersProps {
  children: React.ReactNode
}

export default async function Providers({ children }: ProvidersProps) {
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
      <GlobalProvider>
        <MessageProvider>
          <LoadingProvider>
            <EmitterProvider>
              {children}
            </EmitterProvider>
          </LoadingProvider>
        </MessageProvider>
      </GlobalProvider>
    </NextIntlClientProvider>
  )
}