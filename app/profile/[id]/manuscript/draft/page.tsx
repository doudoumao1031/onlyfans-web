"use client"
// 草稿
import Header from "@/components/common/header"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

const DraftItem = () => {
  const pathname = usePathname()
  return (
    <Link href={`${pathname}/edit`} className="pt-2.5 pb-2.5 border-b border-gray-100 flex gap-2.5">
      <Image src={"https://picsum.photos/100/100"} alt={"img"} width={100} height={100} className="rounded"/>
      <div className="flex-col justify-between flex flex-1 w-0">
        <div className="text-[#333] line-clamp-[2] ">amie Shon 的韩国文化 | Foxy Spots 与 Jamie
          Shon@luvjamxoxluvjamxoxoluvjamxoxoluvjamxoxo
        </div>
        <div className="pb-2.5 text-xs text-[#bbb]">保存：2022-02-02 12:12:12</div>
      </div>
    </Link>
  )
}
export default function Page() {
  return (
    <div>
      <Header title="草稿" titleColor={"#000"}/>
      <div className="pl-4 pr-4">
        <DraftItem/>
        <DraftItem/>
        <DraftItem/>
        <DraftItem/>
      </div>
    </div>
  )
}