"use client"
import { useParams } from "next/navigation"

export default function Page() {
  const { id } = useParams()
  console.log(id, "===")
  const action = () => {
    console.log("")

  }
  return (
    <button className="size-full" onTouchEnd={action}>
      <div>11</div>
    </button>
  )
}
