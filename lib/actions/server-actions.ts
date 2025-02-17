"use server"

import { ApiResponse, FetchOptions } from "@/lib"
import { TOKEN_KEY, USER_KEY } from "@/lib/utils"
import { cookies } from "next/headers"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

async function getAuthToken() {
  try {
    const cookiesStore = await cookies()
    const token = cookiesStore.get(TOKEN_KEY)?.value
    console.log("getAuthToken server side:", token)
    return token ?? ""
  } catch (error) {
    console.error("Error getting auth token:", error)
    return ""
  }
}

export async function getSelfId() {
  try {
    const cookiesStore = await cookies()
    const userId = cookiesStore.get(USER_KEY)?.value
    console.log("getUserId server side:", userId)
    return userId ?? ""
  } catch (error) {
    console.error("Error getting auth userId:", error)
    return ""
  }
}

async function fetchResultHandle<T>(method: string, response: Response, url: string) {
  if (response.ok) {
    const result: ApiResponse<T> = await response.json()
    console.log(`Success-${method.toUpperCase()}-${url}-response:`, result)
    return result
  }
  console.error(`Error-${method.toUpperCase()}-${url}-response:`, response)
  return null
}

export async function fetchWithGet<Req, Res = unknown>(
  url: string,
  data: Req,
  options?: FetchOptions<Res>
) {
  try {
    const { headers = {} } = options ?? {}
    const qs = new URLSearchParams(data ?? {})
    const urlWithParams = `${apiUrl}${url}?${qs.toString()}`
    const token = await getAuthToken()
    console.log("GET-url:", urlWithParams)
    const response = await fetch(urlWithParams, {
      method: "GET",
      headers: {
        [TOKEN_KEY]: token,
        ...headers
      }
    })
    return fetchResultHandle<Res>("GET", response, url)
  } catch (error) {
    console.error("Error-GET-catch:", error)
  }
  return null
}

export async function fetchWithPost<Req, Res = unknown>(
  url: string,
  data: Req,
  options?: FetchOptions<Res>
) {
  try {
    const { headers = {} } = options ?? {}
    const isFormData = data instanceof FormData
    const fullPath = `${apiUrl}${url}`
    const token = await getAuthToken()
    console.log("POST-url:", fullPath)
    console.log("POST-data:", data)
    const response = await fetch(fullPath, {
      method: "POST",
      headers: {
        [TOKEN_KEY]: token,
        ...(!isFormData && {
          "Content-Type": "application/json"
        }),
        ...headers
      },
      body: isFormData ? data : JSON.stringify(data)
    })
    return fetchResultHandle<Res>("POST", response, url)
  } catch (error) {
    console.error("Error-POST-catch:", error)
  }
  return null
}

export async function uploadFetch<Req, Res = unknown>(
  url: string,
  data: Req,
  options?: FetchOptions<Res>
) {
  try {
    const { headers = {} } = options ?? {}
    const isFormData = data instanceof FormData
    const fullPath = `${apiUrl}${url}`
    const token = await getAuthToken()
    console.log("POST-url:", fullPath)
    console.log("POST-data:", data)
    const response = await fetch(fullPath, {
      method: "POST",
      headers: {
        [TOKEN_KEY]: token,
        ...headers
      },
      body: isFormData ? data : JSON.stringify(data)
    })
    return fetchResultHandle<Res>("POST", response, url)
  } catch (error) {
    console.error("Error-POST-catch:", error)
    return null
  }
}
