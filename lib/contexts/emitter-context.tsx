"use client"

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useCallback
} from "react"
import { emitter, useAppLoaded } from "@/lib/hooks/emitter"
import { useRouter } from "@/i18n/routing"
import { loginToken, LoginTokenResp } from "../actions/auth"
import { TOKEN_KEY, USER_KEY } from "../utils"

const emitterContext = createContext(undefined)

export enum BRIDGE_EVENT_NAME {
  sendSystemtBarsInfo = "sendSystemtBarsInfo",
  responseOAuth = "responseOAuth"
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
  const handleResponseOAuth = useCallback((data: unknown) => {
    console.log(data, "data--handleResponseOAuth")
    loginToken(data as string).then((res: LoginTokenResp | null) => {
      if (res?.token && res?.user_id) {
        document.cookie = `${TOKEN_KEY}=${res.token}; path=/; secure; samesite=lax`
        document.cookie = `${USER_KEY}=${res.user_id}; path=/; secure; samesite=lax`
      }
      router.push("/explore/feed")
      console.log(res, "res--handleResponseOAuth")
    })
    // const { isIOS, isAndroid } = checkPlatform()
    // if (!isIOS && !isAndroid) {
    //   router.push("/system/403")
    // }
  }, [])

  useEffect(() => {
    // 测试
    setTimeout(() => {
      window?.callAppApi("requestOAuth", "")
    }, 2000)
    emitter.on(
      BRIDGE_EVENT_NAME.sendSystemtBarsInfo,
      handleGetSystemBarsInfo,
    )
    emitter.on(
      BRIDGE_EVENT_NAME.responseOAuth,
      handleResponseOAuth,
    )
    return () => {
      emitter.off(
        BRIDGE_EVENT_NAME.sendSystemtBarsInfo,
        handleGetSystemBarsInfo,
      )
      emitter.off(
        BRIDGE_EVENT_NAME.responseOAuth,
        handleResponseOAuth,
      )
    }
  }, [
    handleGetSystemBarsInfo,
    handleResponseOAuth
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
