"use client"

import React, { useEffect, useState, useRef } from "react"
import { debounce } from "lodash"
import useSWR from "swr"
import { fetchFeeds } from "@/lib/data"
import { PostData } from "@/components/post/type"

export interface InfiniteScrollProps {
  initialItems: PostData[]
  initialHasMore: boolean
  children: (props: {
    items: PostData[]
    isLoading: boolean
    hasMore: boolean
    error: unknown
    isRefreshing: boolean
  }) => React.ReactNode
}

export default function InfiniteScroll({
  initialItems,
  initialHasMore,
  children,
}: InfiniteScrollProps) {
  const [items, setItems] = useState(initialItems)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isFetchingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const pullDistance = useRef(0)
  const isPulling = useRef(false)

  const { data, isValidating, error, mutate } = useSWR<{
    items: PostData[]
    hasMore: boolean
  }>(
    hasMore ? page.toString() : null,
    async (pageStr) => fetchFeeds(parseInt(pageStr)),
    {
      keepPreviousData: true,
    }
  )

  useEffect(() => {
    if (data && page > 1 && !isFetchingRef.current) {
      isFetchingRef.current = true
      setItems((prev) => [...prev, ...data.items])
      setHasMore(data.hasMore)
      isFetchingRef.current = false
    }
  }, [data, page])

  const handleScroll = debounce(() => {
    const container = containerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (hasMore && !isValidating) {
        setPage((prev) => prev + 1)
      }
    }
  }, 200)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("scroll", handleScroll)
    
    return () => {
      handleScroll.cancel()
      container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY
      isPulling.current = true
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling.current) return

    const touchY = e.touches[0].clientY
    pullDistance.current = touchY - touchStartY.current

    if (pullDistance.current > 0 && containerRef.current?.scrollTop === 0) {
      e.preventDefault()
      containerRef.current.style.transform = `translateY(${Math.min(pullDistance.current, 100)}px)`
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling.current) return

    isPulling.current = false
    const container = containerRef.current
    if (!container) return

    container.style.transition = 'transform 0.3s ease-out'
    container.style.transform = 'translateY(0)'

    if (pullDistance.current > 70 && !isRefreshing) {
      setIsRefreshing(true)
      try {
        setPage(1)
        await new Promise(resolve => setTimeout(resolve, 1000))
        const newData = await mutate()
        if (newData) {
          setItems(newData.items)
          setHasMore(newData.hasMore)
        }
      } finally {
        setIsRefreshing(false)
      }
    }

    setTimeout(() => {
      if (container) {
        container.style.transition = ''
      }
    }, 300)

    pullDistance.current = 0
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("touchstart", handleTouchStart)
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)
    
    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  })

  // Preload next page data
  useSWR<{
    items: PostData[]
    hasMore: boolean
  }>(
    hasMore ? (page + 1).toString() : null,
    async (pageStr) => fetchFeeds(parseInt(pageStr)),
    { keepPreviousData: true }
  )

  return (
    <div 
      ref={containerRef} 
      className="h-full w-full overflow-scroll relative"
      style={{ touchAction: 'pan-x pan-y' }}
    >
      {isRefreshing && (
        <div className="sticky top-0 left-0 right-0 flex justify-center py-2 bg-gray-100/80 z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-900 border-t-transparent"></div>
        </div>
      )}
      <div className="relative">
        {children({
          items,
          isLoading: isValidating,
          hasMore,
          error,
          isRefreshing
        })}
      </div>
    </div>
  )
}
