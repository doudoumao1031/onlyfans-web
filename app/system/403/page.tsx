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
  const [token, setToken] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleClick = async () => {
    if (!userId && !token) {
      alert("Please enter either user ID or token")
      return
    }

    try {
      if (token) {
        document.cookie = `${TOKEN_KEY}=${token}; path=/; secure; samesite=lax`
        router.push(redirectPath ?? "/explore/feed")
        return
      }

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
        <h1 className="text-2xl font-bold mb-4">403 - Unauthorized / 未授权访问</h1>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              className="border rounded px-4 py-2 w-64"
              placeholder="Enter User ID / 输入用户ID"
            />
            <p className="text-sm text-gray-500 mt-1">
              Type #getself in Potato Chat to get your User ID
              <br />
              在Potato聊天中输入 #getself 获取用户ID
            </p>
          </div>
          <div className="text-gray-500">- OR - / - 或者 -</div>
          <div>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="border rounded px-4 py-2 w-64"
              placeholder="Enter Token / 输入令牌"
            />
            <p className="text-sm text-gray-500 mt-1">
              For development env, you can type 1-28
              <br />
              开发环境可以输入 1-28
            </p>
          </div>
          <button
            onClick={handleClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login / 登录
          </button>
        </div>
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