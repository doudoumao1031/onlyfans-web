import { useTimeout } from "@/lib/hooks/useTimeout"
import { useEffect, useMemo, useState } from "react"

export default function useCommonMessage() {
  const [content, setContent] = useState<React.ReactNode>()
  const [openState, setOpenState] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [delay, setDelay] = useState<number>(3000)

  const { start } = useTimeout(() => {
    setIsVisible(false)
    setTimeout(() => {
      setOpenState(false)
    }, 300)
  }, delay)

  useEffect(() => {
    if (openState) {
      setIsVisible(true)
      start()
    }
  }, [openState, start])

  const showMessage = (content: React.ReactNode, duration?: number) => {
    if (duration) setDelay(duration)
    setContent(content)
    setOpenState(true)
  }

  const renderNode = useMemo(() => {
    if (content && openState) {
      return (
        <div
          className={`absolute z-[9999] left-1/2 -translate-x-1/2 top-[50vh] rounded-full bg-black/80 p-4 min-h-[40px] text-white transition-all duration-300 ease-in-out transform ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div>{content}</div>
        </div>
      )
    }
    return null
  }, [content, openState, isVisible])

  return { showMessage, renderNode }
}
