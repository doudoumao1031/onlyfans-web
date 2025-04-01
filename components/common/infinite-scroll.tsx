"use client"

import React, { useRef, useEffect } from "react"

import clsx from "clsx"
import { debounce } from "lodash"

import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll"

export interface InfiniteScrollProps<T> {
  initialItems: T[]
  initialHasMore: boolean
  fetcherFn: (page: number) => Promise<{ items: T[]; hasMore: boolean }>
  children: (props: {
    items: T[]
    isLoading: boolean
    hasMore: boolean
    error: unknown
    isRefreshing: boolean
    refresh: () => Promise<void>
    scrollToTop: () => void
  }) => React.ReactNode
  className?: string
}

export default function InfiniteScroll<T>(props: InfiniteScrollProps<T>) {
  const { initialItems, initialHasMore, fetcherFn, children, className } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const pullDistance = useRef(0)
  const isPulling = useRef(false)

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
  }

  const { items, isLoading, hasMore, error, isRefreshing, loadMore, refresh } = useInfiniteScroll({
    initialItems,
    initialHasMore,
    fetcherFn
  })

  const handleScroll = debounce(() => {
    const container = containerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (!isLoading && hasMore) {
        loadMore()
      }
    }
  }, 100)

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      touchStartY.current = (e as TouchEvent).touches[0].clientY
      isPulling.current = true
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling.current) return

    const touchY = (e as TouchEvent).touches[0].clientY
    const diff = touchY - touchStartY.current
    if (diff > 0) {
      e.preventDefault()
      pullDistance.current = diff
      const container = containerRef.current
      if (container) {
        container.style.transform = `translateY(${Math.min(diff / 2, 100)}px)`
      }
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling.current) return

    const container = containerRef.current
    if (container) {
      container.style.transform = "translateY(0)"
      if (pullDistance.current > 100) {
        await refresh()
      }
    }
    isPulling.current = false
    pullDistance.current = 0
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener("scroll", handleScroll)
    container.addEventListener("touchstart", handleTouchStart)
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      handleScroll.cancel()
      container.removeEventListener("scroll", handleScroll)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleScroll, handleTouchEnd])

  return (
    <div
      ref={containerRef}
      className={clsx("list-scroll-box hide-scrollbar relative size-full overflow-y-auto", className)}
      style={{ transition: "transform 0.2s ease-out" }}
    >
      {isRefreshing && (
        <div className="sticky inset-x-0 top-0 z-10 flex justify-center bg-gray-100/80 py-2">
          <div className="size-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
        </div>
      )}
      {children({
        items,
        isLoading,
        hasMore,
        error,
        isRefreshing,
        refresh,
        scrollToTop
      })}
    </div>
  )
}
