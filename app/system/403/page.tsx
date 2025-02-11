"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import { login } from "@/lib/actions/auth/actions"
import { TOKEN_KEY } from "@/lib/utils"

function ErrorContent() {
  const search = useSearchParams()
  const router = useRouter()
  const redirectPath = search.get("redirect")
  const [userId, setUserId] = useState(20240990)
  const [errorMsg, setErrorMsg] = useState("")

  const handleClick = async () => {
    if (!userId) {
      alert("Please enter user ID")
      return
    }

    try {
      const data = await login({ user_id: userId })
      if (data && data.token) {
        document.cookie = `${TOKEN_KEY}=${data.token}; path=/; secure; samesite=lax`
        router.push(redirectPath ?? "/explore/feed")
      } else {
        setErrorMsg("Login failed: Invalid response from server")
      }
    } catch (error) {
      console.error("Auth error:", error)
      setErrorMsg("Login failed: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {errorMsg && <div className="text-red-500 mb-4">{errorMsg}</div>}
        <h1 className="text-2xl font-bold mb-4">403 - Unauthorized</h1>
        <p className="text-gray-600 mb-4">Please enter your Potato user ID to access the content</p>
        <div className="mb-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            placeholder="Enter User ID"
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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