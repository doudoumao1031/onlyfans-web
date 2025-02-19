import { useTimeout } from "@/lib/hooks/useTimeout"
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import IconWithImage from "@/components/profile/icon"

export default function useCommonMessage() {
  const [content, setContent] = useState<React.ReactNode>()
  const [type, setType] = useState<string | "default" | "success" | "fail" | "love">("default")
  const [openState, setOpenState] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [delay, setDelay] = useState<number>(3000)
  const afterDelay = useRef<() => void | null
    >(null)

  const { start } = useTimeout(() => {
    setIsVisible(false)
    setTimeout(() => {
      setOpenState(false)
      if (afterDelay.current) {
        afterDelay.current()
      }
    }, 300)
  }, delay)

  useEffect(() => {
    if (openState) {
      setIsVisible(true)
      start()
    }
  }, [openState, start])

  const showMessage = (content: React.ReactNode, type?: string, options?: {
    duration?: number,
    afterDuration?: () => void
  }) => {
    const { duration,afterDuration } = options || {}
    if (duration) setDelay(duration)
    setContent(content)
    setOpenState(true)
    setType(type || "default")
    afterDelay.current = afterDuration ?? null
  }

  const renderNode = useMemo(() => {
    if (content && openState) {
      return (
        <div
          className={`absolute z-[9999] left-1/2 -translate-x-1/2 top-[50vh] rounded-full px-4 py-2 text-white transition-all duration-300 ease-in-out transform ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          } ${type === "love" ? "bg-red" : "bg-black/80"}`}
        >
          {
            type === "default" && (
              <div className="whitespace-nowrap">{content}</div>
            )
          }
          {
            type === "success" && (
              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconWithImage url={"/icons/checkbox_select_white@3x.png"} height={20} width={20}/>
                <span className="text-white font-medium text-base">{content}</span>
              </div>
            )
          }
          {
            type === "love" && (
              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconWithImage url={"/icons/icon_fans_like_highlight@3x.png"} height={20} width={20}/>
                <span className="text-white font-medium text-base">{content}</span>
              </div>
            )
          }
        </div>
      )
    }
    return null
  }, [content, openState, isVisible, type])

  return { showMessage, renderNode }
}

export type CommonMessageContextValues = {
  showMessage: (content: React.ReactNode, type?: string, options?: {
    duration?: number,
    afterDuration?: () => void
  }) => void
}

export const CommonMessageContext = createContext({} as CommonMessageContextValues)
export const useCommonMessageContext = () => useContext(CommonMessageContext)