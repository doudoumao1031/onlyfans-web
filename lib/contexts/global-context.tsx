"use client"

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback
} from "react"

import { getSelfId } from "@/lib/actions/server-actions"

// Action Types
export const ActionTypes = {
  // 主页的订阅/关注/推荐 列表
  EXPLORE: {
    REFRESH: "explore-action-refresh"
  },
  // 空间帖子列表
  SPACE: {
    REFRESH: "space-action-refresh"
  },
  Followed: {
    SCROLL_TO_TOP: "followed-action-scroll-top",
    REFRESH: "followed-action-refresh"
  },
  Feed: {
    SCROLL_TO_TOP: "feed-action-scroll-top",
    REFRESH: "feed-action-refresh",
    LOAD_MORE: "feed-action-load-more",
    UPDATE_POST: "feed-action-update-post"
  },
  Post: {
    LIKE: "post-action-like",
    UNLIKE: "post-action-unlike",
    COMMENT: "post-action-comment",
    SHARE: "post-action-share"
  },
  User: {
    FOLLOW: "user-action-follow",
    UNFOLLOW: "user-action-unfollow",
    BLOCK: "user-action-block",
    UNBLOCK: "user-action-unblock"
  },
  Media: {
    PLAY: "media-action-play",
    PAUSE: "media-action-pause",
    SEEK: "media-action-seek"
  }
} as const

type ActionType =
  (typeof ActionTypes)[keyof typeof ActionTypes][keyof (typeof ActionTypes)[keyof typeof ActionTypes]]

interface ActionItem {
  type: string
  payload?: unknown
  timestamp?: number
}

interface GlobalContextType {
  sid: number | null
  setSid: (sid: number | null) => void
  addToActionQueue: (action: Omit<ActionItem, "timestamp">) => void
  actionQueue: ActionItem[]
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [sid, setSid] = useState<number | null>(0)
  const [actionQueue, setActionQueue] = useState<ActionItem[]>([])

  useEffect(() => {
    const initData = async () => {
      await getSelfId().then((res) => {
        console.log("GlobalProvider set uid:", res)
        setSid(Number(res))
      })
    }
    initData()
  }, [])

  const addToActionQueue = useCallback((action: Omit<ActionItem, "timestamp">) => {
    const actionItem: ActionItem = {
      ...action,
      timestamp: Date.now()
    }
    setActionQueue((prev) => [...prev, actionItem])

    // Dispatch the event for backward compatibility
    if (action.type === ActionTypes.Feed.UPDATE_POST) {
      // For post updates, include the payload in the event detail
      const event = new CustomEvent(action.type, {
        detail: { postId: action.payload }
      })
      console.log(`Dispatching ${action.type} event with postId: ${action.payload}`)
      window.dispatchEvent(event)
    } else {
      // For other events, use the standard Event
      console.log(`Dispatching ${action.type} event`)
      window.dispatchEvent(new Event(action.type))
    }
  }, [])

  // Process action queue
  useEffect(() => {
    if (actionQueue.length > 0) {
      // Here you can add any global action processing logic
      // For now, we'll just keep the last 100 actions
      if (actionQueue.length > 100) {
        setActionQueue((prev) => prev.slice(-100))
      }
    }
  }, [actionQueue])

  return (
    <GlobalContext.Provider value={{ sid, setSid, addToActionQueue, actionQueue }}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobal() {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error("useGlobal must be used within GlobalProvider")
  }
  return context
}
