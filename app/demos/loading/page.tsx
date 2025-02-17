"use client"

import { useState } from "react"
import LoadingMask from "@/components/common/loading-mask"

export default function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Loading Mask Demo</h1>

      <button
        onClick={() => setIsLoading(!isLoading)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {isLoading ? "Hide" : "Show"} Loading Mask
      </button>

      <LoadingMask isLoading={isLoading} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Content Behind Loading Mask</h2>
        <p className="text-gray-600">
          This content will be blurred and overlaid when the loading mask is active.
          The loading mask creates a semi-transparent black backdrop with a blur effect
          and displays a centered loading animation.
        </p>
      </div>
    </div>
  )
}