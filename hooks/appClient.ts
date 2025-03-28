import { useCallback, useEffect } from "react"

import Emittery from "emittery"

import { BRIDGE_EVENT_NAME } from "@/lib/contexts/emitter-context"

export function useAppEventHandle(
    emitter: Emittery,
    eventName: keyof typeof BRIDGE_EVENT_NAME,
    callback: (value: string) => void
) {
    const eventHandle = useCallback(
        (data: string) => {
            callback(data)
        },
        [callback]
    )

    useEffect(() => {
        emitter.on(eventName, eventHandle)
        return () => {
            emitter.off(eventName, eventHandle)
        }
    }, [emitter, eventHandle, eventName])
}
