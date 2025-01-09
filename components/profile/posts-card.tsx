"use client"
import React from "react"

export default function PostsCard({ description, title, actionButton, action }: {
    description: React.ReactNode,
    title: React.ReactNode,
    actionButton: React.ReactNode,
    action?: () => void
}) {
  return (
    <div className="mt-2.5 subscription-item rounded-xl flex justify-between items-center h-[74px] p-4">
      <div className="text-white">
        <div className="text-[16px]">{title}</div>
        <div className="text-xs">{description}</div>
      </div>
      <button className="rounded-2xl bg-white pt-1.5 pb-1.5 pl-4 pr-4 text-main-pink" onClick={() => {
        action?.()
      }}
      >{actionButton}</button>
    </div>
  )
}