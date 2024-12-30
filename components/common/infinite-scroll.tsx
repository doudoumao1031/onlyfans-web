"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import { debounce } from "lodash"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return res.json()
}

export interface InfiniteScrollProps<T> {
  url: string
  initialItems: T[]
  initialHasMore: boolean
  children: (props: {
    items: T[]
    isLoading: boolean
    hasMore: boolean
    error: unknown
  }) => React.ReactNode
}

export default function InfiniteScroll<T>({
  url,
  initialItems,
  initialHasMore,
  children,
}: InfiniteScrollProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const isFetchingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data, isValidating, error } = useSWR<{
    items: T[]
    hasMore: boolean
  }>(hasMore ? `${url}?page=${page}` : null, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  useEffect(() => {
    if (data && page > 1 && !isFetchingRef.current) {
      isFetchingRef.current = true
      setItems((prev) => [...prev, ...data.items])
      setHasMore(data.hasMore)
      isFetchingRef.current = false
    }
  }, [data, page])

  const handleScroll = useCallback(
    debounce(() => {
      const container = containerRef.current
      if (!container) return

      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (hasMore && !isValidating) {
          setPage((prev) => prev + 1)
        }
      }
    }, 200),
    [hasMore, isValidating]
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scrollHandler = handleScroll
    container.addEventListener("scroll", scrollHandler)
    
    return () => {
      scrollHandler.cancel()
      container.removeEventListener("scroll", scrollHandler)
    }
  }, [handleScroll])

  // Preload next page data
  useSWR<{ items: T[]; hasMore: boolean }>(
    hasMore ? `${url}?page=${page + 1}` : null,
    fetcher,
    { revalidateOnFocus: false, keepPreviousData: true }
  )

  return (
    <div ref={containerRef} className="h-full w-full overflow-scroll">
      {children({
        items,
        isLoading: isValidating,
        hasMore,
        error,
      })}
    </div>
  )
}
