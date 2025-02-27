import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"
import "./profile.scss"
import React from "react"
import Providers from "@/lib/providers/providers"

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
})
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
})

export const metadata: Metadata = {
  title: "FansX",
  description: "FansX"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
}

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <div className="h-full overflow-y-auto">
          <Providers>
            {children}
            {modal}
            <div id="modal-root" />
          </Providers>
        </div>
      </body>
    </html>
  )
}
