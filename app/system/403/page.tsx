"use client"

import { redirect, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ErrorContent() {
  const search = useSearchParams()
  const redirectPath = search.get("redirect")

  const handleClick = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST"
      })
      const data = await res.json()
      if (data.code === 0) {
        redirect(redirectPath ?? "/")
      }
    } catch (error) {
      console.error("Auth error:", error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">403 - Unauthorized</h1>
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          登录
        </button>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}