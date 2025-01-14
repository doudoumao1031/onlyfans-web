import { useState, useRef, useEffect } from "react"
import useSWR from "swr"

interface UseInfiniteScrollOptions<T> {
  initialItems: T[]
  initialHasMore: boolean
  fetcherFn: (page: number) => Promise<{ items: T[], hasMore: boolean }>
}

interface UseInfiniteScrollResult<T> {
  items: T[]
  isLoading: boolean
  hasMore: boolean
  error: unknown
  isRefreshing: boolean
  loadMore: () => void
  refresh: () => Promise<void>
}

export function useInfiniteScroll<T>({
  initialItems,
  initialHasMore,
  fetcherFn
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [items, setItems] = useState(initialItems)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isFetchingRef = useRef(false)

  const { data, isValidating, error, mutate } = useSWR<{
    items: T[]
    hasMore: boolean
  }>(
    hasMore ? page.toString() : null,
    async (pageStr) => fetcherFn(parseInt(pageStr)),
    {
      keepPreviousData: true
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

  const loadMore = () => {
    if (!isValidating && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  const refresh = async () => {
    setIsRefreshing(true)
    try {
      setPage(1)
      const result = await fetcherFn(1)
      setItems(result.items)
      setHasMore(result.hasMore)
      await mutate()
    } finally {
      setIsRefreshing(false)
    }
  }

  return {
    items,
    isLoading: isValidating,
    hasMore,
    error,
    isRefreshing,
    loadMore,
    refresh
  }
}
