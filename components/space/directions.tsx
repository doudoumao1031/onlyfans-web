"use client"
import { useState } from "react"

export default function Page({ about }: { about: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className="text-xs mt-2.5">
      <section className={!isOpen ? "flex h-4 overflow-hidden text-ellipsis ..." : ""}>
        {about}{" "}
      </section>
      <button
        className="text-main-pink mt-1"
        onTouchEnd={() => {
          setIsOpen(!isOpen)
        }}
      >
        {isOpen ? "折叠信息" : "更多信息"}
      </button>
    </div>
  )
}
