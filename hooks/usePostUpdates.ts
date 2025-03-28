import { useCallback, useEffect, useRef } from "react"

import { PostData } from "@/lib"
import { postDetail } from "@/lib/actions/profile"
import { ActionTypes, useGlobal } from "@/lib/contexts/global-context"

/**
 * Hook to handle post updates across feed list components
 * This ensures consistent behavior for updating posts when returning from post detail pages
 */
export function usePostUpdates(
  itemsMap: Map<number, PostData>,
  setItemsMap: React.Dispatch<React.SetStateAction<Map<number, PostData>>>
) {
  const { actionQueue } = useGlobal()
  const lastProcessedActionRef = useRef<number>(-1)

  // Function to update a specific post
  const updatePost = useCallback(async (postId: number) => {
    try {
      console.log(`Fetching updated data for post ${postId}`)
      const res = await postDetail(postId)
      if (res?.code === 0) {
        setItemsMap(prevMap => {
          const newMap = new Map(prevMap)
          newMap.set(postId, res.data as unknown as PostData)
          return newMap
        })
      }
    } catch (error) {
      console.error("Failed to update post:", error)
    }
  }, [setItemsMap])

  // Watch for post update actions in the global action queue
  useEffect(() => {
    if (actionQueue.length === 0) return

    const currentActionIndex = actionQueue.length - 1
    // Skip if we've already processed this action
    if (lastProcessedActionRef.current === currentActionIndex) return

    const latestAction = actionQueue[currentActionIndex]
    if (latestAction?.type === ActionTypes.Feed.UPDATE_POST && latestAction.payload) {
      const postId = Number(latestAction.payload)

      // Update the last processed action index
      lastProcessedActionRef.current = currentActionIndex

      if (itemsMap.has(postId)) {
        console.log(`Processing update action for post ${postId}`)
        updatePost(postId)
      }
    }
  }, [actionQueue, itemsMap, updatePost])

  return { updatePost }
}
