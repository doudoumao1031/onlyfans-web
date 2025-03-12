"use client"

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useCallback
} from "react"
import { emitter, useAppLoaded } from "@/lib/hooks/emitter"
import { checkPlatform } from "@/components/common/init"
import { useRouter } from "@/i18n/routing"

const emitterContext = createContext(undefined)

export enum BRIDGE_EVENT_NAME {
  sendSystemtBarsInfo = "sendSystemtBarsInfo",
  requsetOAuth = "requsetOAuth"
}

export function EmitterProvider({ children }: { children: ReactNode }) {
  useAppLoaded()
  const router = useRouter()
  const handleGetSystemBarsInfo = useCallback((data: unknown) => {
    const htmlElement = document.documentElement
    if (typeof data === "string") {
      let info = {
        top: 0
      }
      try {
        info = JSON.parse(data)
      } catch {
        /* empty */
      }
      if (typeof info?.top === "number") {
        info.top = Number.isInteger(info.top)
          ? info.top
          : Number(info.top.toFixed(2))
      }
      if (!htmlElement) return
      const topBarValue = getComputedStyle(htmlElement)
        .getPropertyValue("--top-bar")
        .trim()
      const newValue = `${info.top}vw`
      if (newValue === topBarValue) return
      htmlElement.style.setProperty("--top-bar", newValue)
    }
  }, [])
  const handleRequestOAuth = useCallback((data: unknown) => {
    console.log(data, "data--handleRequestOAuth")
    // const { isIOS, isAndroid } = checkPlatform()
    // if (!isIOS && !isAndroid) {
    //   router.push("/system/403")
    // }
  }, [router])

  useEffect(() => {
    emitter.on(
      BRIDGE_EVENT_NAME.sendSystemtBarsInfo,
      handleGetSystemBarsInfo,
    )
    emitter.on(
      BRIDGE_EVENT_NAME.requsetOAuth,
      handleRequestOAuth,
    )
    return () => {
      emitter.off(
        BRIDGE_EVENT_NAME.sendSystemtBarsInfo,
        handleGetSystemBarsInfo,
      )
      emitter.off(
        BRIDGE_EVENT_NAME.requsetOAuth,
        handleRequestOAuth,
      )
    }
  }, [
    handleGetSystemBarsInfo,
    handleRequestOAuth
  ])
  return (
    <emitterContext.Provider value={undefined}>
      {children}
    </emitterContext.Provider>
  )
}

export function useEmitter() {
  const context = useContext(emitterContext)
  if (!context) {
    throw new Error("useEmitter must be used within EmitterProvider")
  }
  return context
}
