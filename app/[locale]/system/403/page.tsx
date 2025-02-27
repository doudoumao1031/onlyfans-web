"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import { login } from "@/lib/actions/auth/actions"
import { TOKEN_KEY, USER_KEY } from "@/lib/utils"
import LoadingMask from "@/components/common/loading-mask"
import { useGlobal } from "@/lib/contexts/global-context"

const testUsersList = [
  {
    id: 1,
    token: "1"
  },
  {
    id: 2,
    token: "2"
  },
  {
    id: 3,
    token: "3"
  },
  {
    id: 6,
    token: "6"
  },
  {
    id: 15,
    token: "15"
  },
  {
    id: 16,
    token: "16"
  },
  {
    id: 17,
    token: "17"
  },
  {
    id: 18,
    token: "18"
  },
  {
    id: 19,
    token: "19"
  },
  {
    id: 20,
    token: "20"
  },
  {
    id: 21,
    token: "21"
  },
  {
    id: 22,
    token: "22"
  },
  {
    id: 23,
    token: "23"
  },
  {
    id: 24,
    token: "24"
  },
  {
    id: 25,
    token: "25"
  },
  {
    id: 26,
    token: "26"
  }
  // {
  //   id: 27,
  //   token: "27"
  // },
  // {
  //   id: 28,
  //   token: "28"
  // },
  // {
  //   id: 29,
  //   token: "29"
  // }
]

function ErrorContent() {
  const search = useSearchParams()
  const router = useRouter()
  const redirectPath = search.get("redirect")
  const [userId, setUserId] = useState("20240990")
  const [token, setToken] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setSid } = useGlobal()

  const handleClick = async () => {
    if (!userId && !token) {
      alert("Please enter either user ID or token")
      return
    }

    setIsLoading(true)
    setErrorMsg("")

    try {
      if (token) {
        document.cookie = `${USER_KEY}=${token}; path=/; secure; samesite=lax`
        document.cookie = `${TOKEN_KEY}=${token}; path=/; secure; samesite=lax`
        setSid(Number(token))
        await router.push(redirectPath ?? "/explore/feed")
        return
      }
      const userIdNumber = parseInt(userId, 10)
      if (isNaN(userIdNumber)) {
        setErrorMsg("Please enter a valid user ID")
        return
      }

      const data = await login({ user_id: userIdNumber })
      if (data && data.token) {
        document.cookie = `${TOKEN_KEY}=${data.token}; path=/; secure; samesite=lax`
        document.cookie = `${USER_KEY}=${data.user_id}; path=/; secure; samesite=lax`
        setSid(data.user_id)
        console.log("===> 2. login setSid:", userId)
        await router.push(redirectPath ?? "/explore/feed")
      } else {
        setErrorMsg("Login failed: Invalid response from server")
      }
    } catch (error) {
      console.error("Auth error:", error)
      setErrorMsg("Login failed: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingMask isLoading={isLoading} />
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {errorMsg && <div className="text-theme mb-4">{errorMsg}</div>}
        <h1 className="text-2xl font-bold mb-4 text-text-title">403 - Unauthorized / 未授权访问</h1>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
            <select
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="border rounded px-4 py-2 w-64"
            >
              <option value="">Select Token / 选择令牌</option>
              {testUsersList.map((user) => (
                <option key={user.id} value={user.token}>
                  User {user.id} (Token: {user.token})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              For development env, you can select from the list
              <br />
              开发环境可以从列表中选择
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