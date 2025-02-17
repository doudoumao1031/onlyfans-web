"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Search Error</h2>
      <p className="text-gray-600 mb-4">Unable to complete search request</p>
      <button
        className="px-4 py-2 bg-background-pink text-white rounded-lg hover:bg-opacity-90"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}
