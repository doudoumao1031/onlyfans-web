"use client"
import React from "react"

import { Link } from "@/i18n/routing"

export default function PostsCard({ description, title, actionButton, link }: {
  description: React.ReactNode,
  title: React.ReactNode,
  actionButton: React.ReactNode,
  link: string
}) {
  return (
    <Link href={link} className="subscription-item mt-2.5 flex h-[74px] items-center justify-between rounded-xl p-4">
      <div className="">
        <div className="text-[16px] font-medium">{title}</div>
        <div className="text-xs text-[#6D7781]">{description}</div>
      </div>
      <span className="text-text-theme rounded-2xl bg-white px-4 py-1.5 font-medium">{actionButton}</span>
    </Link>
  )
}