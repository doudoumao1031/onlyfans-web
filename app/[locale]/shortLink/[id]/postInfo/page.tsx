"use client"

import { useParams } from "next/navigation"

export default function Page() {
  const { id } = useParams()
  console.log(id, "===")
  const action = () => {
    console.log("")

  }
  return (
    <button className="w-full h-full" onTouchEnd={action}>
      <div>22</div>
    </button>
  )
}
