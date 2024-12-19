"use client";
import Header from "@/components/profile/header";
import IconWithImage from "@/components/profile/icon";
import TabTitle, { iTabTitleOption } from "@/components/profile/tab-title";
import { useState } from "react";
export default function Page() {
  const [active, setActive] = useState<string>("views")
  const tabOptions: iTabTitleOption[] = [
    { label: "数据概览", name: "views" },
    { label: "帖子情况", name: "infos" },
  ]
  const ChartsItem = () => {
    return <div className="p-4">
      <div className="flex justify-between">
        <div className="flex items-end">
          <h1 className="text-base font-medium">数据浏览</h1>
          <div className="ml-2 text-gray-400 text-xs ">凌晨2点更新</div>
        </div>
        <span className="flex items-center text-gray-500">近30日   <IconWithImage url="/icons/profile/icon-bt.png" width={16} height={16} color={'#777'} /></span>
      </div>
    </div>
  }
  return <>
    <Header title="数据中心" />
    <TabTitle tabOptions={tabOptions} active={active} activeChange={setActive} />
    {ChartsItem()}
  </>
}