"use client"

import { Suspense, useState, useEffect } from "react"

import { useSearchParams, useRouter } from "next/navigation"

import LoadingMask from "@/components/common/loading-mask"
import { UserListResp } from "@/lib"
import { login, users } from "@/lib/actions/auth/actions"
import { useGlobal } from "@/lib/contexts/global-context"
import { TOKEN_KEY, USER_KEY } from "@/lib/utils"

function ErrorContent() {
  const search = useSearchParams()
  const router = useRouter()
  const redirectPath = search.get("redirect")
  const [userId, setUserId] = useState("20240990")
  const [useList, setUserList] = useState<UserListResp[]>([])
  const [token, setToken] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setSid } = useGlobal()
  useEffect(() => {
    const userList = async () => {
      const result = await users({ page: 1, pageSize: 100, from_id: 0 })
      if (result) {
        setUserList(result.list)
      }
    }
    userList()
  }, [])

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
        <h1 className="text-text-title mb-4 text-2xl font-bold">403 - Unauthorized / 未授权访问</h1>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-64 rounded border px-4 py-2"
              placeholder="Enter User ID / 输入用户ID"
            />
            <p className="mt-1 text-sm text-gray-500">
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
              className="w-64 rounded border px-4 py-2"
            >
              <option value="">Select Token / 选择令牌</option>
              {useList.map((user) => (
                <option key={user.id} value={user.id}>
                  User:{user.id},ptId:{user.pt_user_id},Fn:{user.first_name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              For development env, you can select from the list
              <br />
              开发环境可以从列表中选择
            </p>
          </div>
          <button
            onClick={handleClick}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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