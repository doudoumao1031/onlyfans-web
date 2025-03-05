
import React from "react"
import { EmitterProvider } from "@/lib/contexts/emitter-context"
import { GlobalProvider } from "@/lib/contexts/global-context"
import { MessageProvider } from "@/lib/contexts/message-context"
import { LoadingProvider } from "@/lib/contexts/loading-context"
import { getMessages } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"
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