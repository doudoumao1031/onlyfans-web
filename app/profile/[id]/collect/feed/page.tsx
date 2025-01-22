"use client"

import { useState } from "react"
export type TPostItem = {
  avtar: string
  msg: string
  name: string
  background: string
}

const mockPosts: TPostItem[] = [
  {
    avtar: "bg-[url('/demo/avtar1.jpeg')]",
    name: "Jamie Shon",
    msg: "Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo带您踏上文化之旅，展示韩国烧烤…",
    background: "bg-[url('/demo/blog-bg1.jpeg')]"
  },
  {
    avtar: "bg-[url('/demo/avtar2.jpeg')]",
    name: "Rita Leite",
    msg: "Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo带您踏上文化之旅，展示韩国烧烤…",
    background: "bg-[url('/demo/blog-bg2.jpeg')]"
  },
  {
    avtar: "bg-[url('/demo/avtar4.jpeg')]",
    name: "Virendra Sana",
    msg: "Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo带您踏上文化之旅，展示韩国烧烤…",
    background: "bg-[url('/demo/blog-bg4.jpeg')]"
  }
]
export default function Page() {
  const [posts, setPosts] = useState<TPostItem[]>(mockPosts)

  const Posts = () => {
    return (
      <div className="p-4 pt-0 ">
        {posts.map((v: TPostItem, i: number) => (
          <div key={i} className={"h-28   mb-4 flex justify-between"}>
            <div className={`h-28 w-28 ${v.avtar} bg-cover mr-2 shrink-0 rounded-md border border-slate-600`}></div>
            <div className="flex flex-col justify-between">
              <div className="">{v.msg}</div>
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full mr-2 ${v.avtar} bg-cover `}>
                </div>
                <span className="text-main-pink text-xs">{v.name}</span>
              </div>
            </div>
          </div>
        ))}

      </div>
    )
  }
  return (
    <>
      <div className="total-num p-4"><span className="text-gray-400">总数：</span>9999999</div>
      {Posts()}
    </>
  )
}


