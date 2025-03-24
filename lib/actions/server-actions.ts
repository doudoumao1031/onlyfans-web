"use server"

import { cookies } from "next/headers"

import { ApiResponse, FetchOptions } from "@/lib"
import { TOKEN_KEY, USER_KEY } from "@/lib/utils"

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
    return userId ?? "" as string
  } catch (error) {
    console.error("Error getting auth userId:", error)
    return ""
  }
}

async function fetchResultHandle<T>(method: string, response: Response, url: string) {
  if (response.ok) {
    const result: ApiResponse<T> = await response.json()
    console.log(`%cSuccess-${method.toUpperCase()}-${url}-response:`, "color: green",result)
    return result
  }
  console.error(`%cError-${method.toUpperCase()}-${url}-response:`+response, "color: red")
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
    console.log("%cGET-url:", "color: orange", urlWithParams)
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
    console.log("%cPOST-url:", "color: blue", fullPath)
    console.log("%cPOST-data:", "color: blue", data)
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
    console.error("%cError-POST-catch:", "color: red", error)
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
