"use client"
import React from "react"
import { Link } from "@/i18n/routing"

export default function PostsCard({ description, title, actionButton ,link }: {
    description: React.ReactNode,
    title: React.ReactNode,
    actionButton: React.ReactNode,
    link: string
}) {
  return (
    <Link href={link} className="mt-2.5 subscription-item rounded-xl flex justify-between items-center h-[74px] p-4">
      <div className="text-white">
        <div className="text-[16px]">{title}</div>
        <div className="text-xs">{description}</div>
      </div>
      <span className="rounded-2xl bg-white pt-1.5 pb-1.5 pl-4 pr-4 text-text-theme">{actionButton}</span>
    </Link>
  )
}