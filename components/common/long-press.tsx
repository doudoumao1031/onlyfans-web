import { useRef, useState, useCallback, useEffect, RefObject } from "react"

export function useLongPress(ref: RefObject<HTMLButtonElement>, onLongPress: () => void, holdOn = 2000) {
  const [isPressing, setIsPressing] = useState<boolean>(false)
  const touchStart = useRef<number>(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const handlePressStart = useCallback(
    (event: TouchEvent | MouseEvent) => {
      event.preventDefault()
      setIsPressing(true)
      touchStart.current = Date.now()
      timer.current = setTimeout(() => {
        onLongPress()
        setIsPressing(false)
        if (timer.current) {
          clearTimeout(timer.current)
        }
      }, holdOn)
    },
    [holdOn, onLongPress],
  )
  const handlePressEnd = useCallback(
    (event: TouchEvent | MouseEvent) => {
      event.preventDefault()
      setIsPressing(false)
      const end = Date.now()
      if (timer.current) {
        clearTimeout(timer.current)
      }
      if (end - touchStart.current > holdOn) {
        onLongPress?.()
      }
    },
    [onLongPress, timer, touchStart],
  )

  const handleRemoveLongPressEvent = useCallback(() => {
    if (ref.current) {
      ref.current?.removeEventListener("touchstart", handlePressStart)
      ref.current?.removeEventListener("mousedown", handlePressStart)
      ref.current?.removeEventListener("touchend", handlePressEnd)
      ref.current?.removeEventListener("mouseup", handlePressEnd)
    }
  }, [handlePressEnd, handlePressStart, ref])

  const handelAddLongPressEvent = useCallback(() => {
    ref.current?.addEventListener("touchstart", handlePressStart, false)
    ref.current?.addEventListener("mousedown", handlePressStart, false)
    ref.current?.addEventListener("touchend", handlePressEnd)
    ref.current?.addEventListener("mouseup", handlePressEnd)
  }, [handlePressEnd, handlePressStart, ref])
  useEffect(() => {
    if (!ref?.current || onLongPress === undefined) return () => {
    }
    handelAddLongPressEvent()
    return handleRemoveLongPressEvent
  }, [
    ref,
    onLongPress,
    handlePressStart,
    handlePressEnd,
    handleRemoveLongPressEvent,
    handelAddLongPressEvent
  ])
  return {
    isPressing
  }
}
