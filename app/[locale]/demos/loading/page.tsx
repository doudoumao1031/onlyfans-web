"use client"

import { useState } from "react"

import LoadingMask from "@/components/common/loading-mask"

export default function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-6 text-2xl font-bold">Loading Mask Demo</h1>

      <button
        onClick={() => setIsLoading(!isLoading)}
        className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        {isLoading ? "Hide" : "Show"} Loading Mask
      </button>

      <LoadingMask isLoading={isLoading} />

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Content Behind Loading Mask</h2>
        <p className="text-gray-600">
          This content will be blurred and overlaid when the loading mask is active.
          The loading mask creates a semi-transparent black backdrop with a blur effect
          and displays a centered loading animation.
        </p>
      </div>
    </div>
  )
}