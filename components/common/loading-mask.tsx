"use client"

import { createContext, useContext, useEffect, useState } from "react"

import CommonLoading from "./common-loading"

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

  return (
    <div id="loading-mask" className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[200px] rounded-lg">
        <CommonLoading />
      </div>
    </div>
  )
}

export interface CommonLoadingContextValues {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  loadingText?: string
  setLoadingText?: (text: string) => void
}

export const CommonLoadingContext = createContext({} as CommonLoadingContextValues)

export const useCommonLoadingContext = () => useContext(CommonLoadingContext)
