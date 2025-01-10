import { useCallback, useEffect, useRef } from "react"

export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the timeout
  const start = useCallback(() => {
    if (delay === null) return

    const id = setTimeout(() => {
      savedCallback.current()
    }, delay)

    return () => clearTimeout(id)
  }, [delay])

  return { start }
}
