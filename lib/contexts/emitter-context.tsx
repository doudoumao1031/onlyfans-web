"use client"

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useCallback
} from "react"
import { emitter, getSystemBars, SystemBars } from "@/lib/hooks/emitter"

const emitterContext = createContext(undefined)

export enum BRIDGE_EVENT_NAME {
  sendSystemtBarsInfo = "sendSystemtBarsInfo",
}

export function EmitterProvider({ children }: { children: ReactNode }) {
  const { top } = getSystemBars() as SystemBars
  const handleGetSystemBarsInfo = useCallback((data: unknown) => {
    console.log("handleGetSystemBarsInfo====================================", data)
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

  useEffect(() => {
    document?.documentElement.style.setProperty("--top-bar", `${top}vw`)
    emitter.on(
      BRIDGE_EVENT_NAME.sendSystemtBarsInfo,
      handleGetSystemBarsInfo,
    )
    return () => {
      emitter.off(
        BRIDGE_EVENT_NAME.sendSystemtBarsInfo,
        handleGetSystemBarsInfo,
      )

    }
  }, [
    handleGetSystemBarsInfo,
    top
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
