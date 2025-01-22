import { useTimeout } from "@/lib/hooks/useTimeout"
import React,{ useEffect, useMemo, useRef, useState } from "react"
import IconWithImage from "@/components/profile/icon"

export default function useCommonMessage() {
  const [content, setContent] = useState<React.ReactNode>()
  const [type, setType] = useState<string | "default" | "success" | "fail">("default")
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
          className={`absolute z-[9999] left-1/2 -translate-x-1/2 top-[50vh] rounded-full bg-black/80 px-4 py-2 text-white transition-all duration-300 ease-in-out transform ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {
            type === "default" && (
              <div>{content}</div>
            )
          }
          {
            type === "success" && (
              <div className={"w-36 h-12 flex justify-center items-center"}>
                <IconWithImage url={"/icons/checkbox_select_white@3x.png"} height={20} width={20}/>
                <span className={"text-white font-medium text-base"}>{content}</span>
              </div>
            )
          }
        </div>
      )
    }
    return null
  }, [content, openState, isVisible])

  return { showMessage, renderNode }
}
