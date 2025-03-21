"use client"

import { useEffect } from "react"

import { useRouter } from "@/i18n/routing"

const { log } = console
export const checkPlatform = () => {
  const isAndroid = !!window.Android
  const isIOS = !!window.webkit
  return { isAndroid, isIOS }
}
const addAppApi = () => {
  if (typeof window.callAppApi === "function") return
  const { isAndroid, isIOS } = checkPlatform()
  if (isAndroid) {
    window.callAppApi = (...args) => {
      log("call android api", args)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.Android.doAction(...args)
    }
  } else if (isIOS) {
    window.callAppApi = (action, params) => {
      window.webkit.messageHandlers.doAction.postMessage({
        action,
        params
      })
    }
  } else {
    window.callAppApi = () => {
      log("default")
    }
  }
}
const notifyAppPageLoaded = () => {
  const { isAndroid, isIOS } = checkPlatform()
  window.callAppApi("appLoaded", "")
  if (isAndroid) {
    log("notifyAppPageOnLoaded Android")
  }
  if (isIOS) {
    log("notifyAppPageOnLoaded iOS")
  }
}

const checkEnv = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const isPtVersion = searchParams.get("version") === "pt"
  window.localStorage.setItem("PT_VERSION", isPtVersion.toString())
}

const init = () => {
  checkEnv()
  addAppApi()
  notifyAppPageLoaded()
}

export default function AppAdapter() {
  const router = useRouter()
  useEffect(() => {
    init()
  }, [router])
  return null
}
