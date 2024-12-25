"use client";
import Header from "@/components/common/header";

import TabTitle, { iTabTitleOption } from "@/components/profile/tab-title";
import { useState } from "react";
import IconWithImage from "@/components/profile/icon";
import { SlideUpModal } from "@/components/common/slide-up-modal";
export type TBlogItem = {
  topMsg: string
  avtar: string
  name: string
  account: string
  isVideo: boolean
  num: number,
  background: string
}
export type TPostItem = {
  avtar: string
  msg: string
  name: string
  background: string
}
const mockBlogs: TBlogItem[] = [
  {
    topMsg: '各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折',
    avtar: "bg-[url('/demo/avtar1.jpeg')]",
    name: '多米洛',
    account: '@duomiluo',
    isVideo: true,
    num: 9999,
    background: "bg-[url('/demo/blog-bg1.jpeg')]"
  },
  {
    topMsg: '各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折',
    avtar: "bg-[url('/demo/avtar2.jpeg')]",
    name: 'Jamie Shon',
    account: '@luvjamxoxo',
    isVideo: false,
    num: 9999,
    background: "bg-[url('/demo/blog-bg2.jpeg')]"
  },
  {
    topMsg: '各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折',
    avtar: "bg-[url('/demo/avtar3.jpeg')]",
    name: 'Lin Lin',
    account: '@linlin9246',
    isVideo: false,
    num: 9999,
    background: "bg-[url('/demo/blog-bg3.jpeg')]"
  },
  {
    topMsg: '',
    avtar: "bg-[url('/demo/avtar4.jpeg')]",
    name: '吐司女孩',
    account: '@tusibaby',
    isVideo: false,
    num: 9999,
    background: "bg-[url('/demo/blog-bg4.jpeg')]"
  }
]
const mockPosts: TPostItem[] = [
  {
    avtar: "bg-[url('/demo/avtar1.jpeg')]",
    name: 'Jamie Shon',
    msg: 'Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo带您踏上文化之旅，展示韩国烧烤…',
    background: "bg-[url('/demo/blog-bg1.jpeg')]"
  },
  {
    avtar: "bg-[url('/demo/avtar2.jpeg')]",
    name: 'Rita Leite',
    msg: 'Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo带您踏上文化之旅，展示韩国烧烤…',
    background: "bg-[url('/demo/blog-bg2.jpeg')]"
  },
  {
    avtar: "bg-[url('/demo/avtar4.jpeg')]",
    name: 'Virendra Sana',
    msg: 'Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo带您踏上文化之旅，展示韩国烧烤…',
    background: "bg-[url('/demo/blog-bg4.jpeg')]"
  },
]
export default function Page() {
  const [active, setActive] = useState<string>("blog")
  const [bloggers, setBloggers] = useState<TBlogItem[]>(mockBlogs)
  const [posts, setPosts] = useState<TPostItem[]>(mockPosts)
  const tabOptions: iTabTitleOption[] = [
    { label: "博主", name: "blog" },
    { label: "帖子", name: "post" },
  ]
  const Blogs = () => {
    return <div className="p-4 pt-0 ">
      {bloggers.map((v: TBlogItem, i: number) => (<div key={i} className={`h-28 pt-1 text-white bg-slate-400  mb-4 bg-cover rounded-lg ${v.background} bg-blend-multiply`}>
        <div className="text-xs min-h-4  truncate ...">{v.topMsg}</div>
        <div className="pl-4 pr-4 pt-2 flex justify-start">
          <div className={`w-16 h-16 rounded-full mr-4 ${v.avtar} bg-cover border-2 border-white`}>
          </div>
          <div>
            <div className="text-sm">{v.name}</div>
            <div className="text-xs">{v.account}</div>
            <div className="flex justify-start mt-1 text-xs">
              <div className="bg-black rounded-full bg-opacity-50 p-1 pl-2 pr-2 mr-4 text-xs flex"> <IconWithImage
                url="/icons/profile/icon-photo.png"
                width={14}
                height={14}
              /><span className="ml-1">9999</span></div>
              <div className="bg-black rounded-full bg-opacity-50 p-1 pl-2 pr-2 mr-4 text-xs flex"> <IconWithImage
                url="/icons/profile/icon-video.png"
                width={14}
                height={14}
              /><span className="ml-1">9999</span></div>
              <div className="bg-black rounded-full bg-opacity-50 p-1 pl-2 pr-2 ml-2 text-xs">免费/订阅</div>
            </div>
          </div>
        </div>
      </div>))}

    </div>
  }
  const Posts = () => {
    return <div className="p-4 pt-0 ">
      {posts.map((v: TPostItem, i: number) => (<div key={i} className={`h-28   mb-4 flex justify-between`}>
        <div className={`h-28 w-28 ${v.avtar} bg-cover mr-2 shrink-0 rounded-md border border-slate-600`}></div>
        <div className="flex flex-col justify-between">
          <div className="">{v.msg}</div>
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full mr-2 ${v.avtar} bg-cover `}>
            </div>
            <span className="text-main-pink text-xs">{v.name}</span>
          </div>
        </div>
      </div>))}

    </div>
  }
  return <>
    <Header title="收藏夹" titleColor="#000" />
    <TabTitle tabOptions={tabOptions} active={active} activeChange={setActive} />
    <div className="total-num p-4"><span className="text-gray-400">总数：</span>9999999</div>
    {active === 'blog' ? Blogs() : Posts()}
  </>
}


