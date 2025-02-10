"use client"

import { redirect, useSearchParams } from "next/navigation"

export default function Page() {
  const search = useSearchParams()
  const redirectPath = search.get("redirect")
  const handleClick = async () => {
    fetch("/api/auth",{
      method:"POST"
    }).then(res => res.json()).then(data => {
      if (data.code === 0) {
        redirect(redirectPath ?? "/")
      }
    })
  }
  return (
    <div>
      <button
        onClick={handleClick}
      >
        登录
      </button>
    </div>
  )
}