"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import Image from "next/image"

interface LoadingMaskProps {
  isLoading: boolean
}

export default function LoadingMask({ isLoading }: LoadingMaskProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted || !isLoading) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/10 rounded-lg p-4 relative w-16 h-16">
        <Image
          src="/icons/loading1.png"
          alt="loading"
          className="animate-spin"
          fill
          sizes="4rem"
          priority
        />
      </div>
    </div>,
    document.body
  )
}
