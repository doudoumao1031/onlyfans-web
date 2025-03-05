import { BRIDGE_EVENT_NAME } from "../contexts/emitter-context"
import Emittery from "emittery"
import { useEffect } from "react"
const IOS_FIX_TIMEOUT = 16.6
export type SystemBars = {
  top: number
}
export const emitter = new Emittery()

if (typeof window !== "undefined") {
  window.wallet = {
    call: (type: string, data: unknown) => {
      switch (type) {
        case BRIDGE_EVENT_NAME.sendSystemtBarsInfo: {
          emitter.emit(BRIDGE_EVENT_NAME.sendSystemtBarsInfo, data)
          return true
        }
        default:
          return Promise.resolve()
      }
    }
  }
}

export function getSystemBars(): SystemBars | null {
  const info = {
    top: 0
  }
  if (typeof window !== "undefined") {
    try {
      const isAndroid = !!window.Android
      const isIOS = !!window.webkit
      if (isAndroid) {
        const s = window.Android.getSystemBars()
        if (!s) return info
        const androidInfo = JSON.parse(s)
        if (typeof androidInfo?.top === "number") {
          info.top = Number.isInteger(androidInfo.top)
            ? androidInfo.top
            : Number((androidInfo.top / 100).toFixed(2))
        }
      }
      if (isIOS) {
        setTimeout(() => {
          console.log("ios要加延迟", IOS_FIX_TIMEOUT)
          window?.callAppApi("getSystemBars", "")
        }, IOS_FIX_TIMEOUT)
        return info
      }
    } catch (e) {
      console.log("GetSystemBars error", e)
      return info
    }
  }
  return info
}


export function useAppLoaded() {
  const { top } = getSystemBars() as SystemBars
  useEffect(() => {
    document?.documentElement.style.setProperty("--top-bar", `${top}vw`)
  }, [top])
}