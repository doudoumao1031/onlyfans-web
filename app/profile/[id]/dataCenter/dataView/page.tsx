"use client"
import IconWithImage from "@/components/profile/icon"
import ChartsLine from "@/components/profile/chart-line"
export type TPostItem = {
  avtar: string
  msg: string
  name: string
  background: string,
  isOpen: boolean
}

export default function Page() {
  return (
    <>
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex items-end">
            <h1 className="text-base font-medium">数据浏览</h1>
            <div className="ml-2 text-[#BBB] text-xs ">凌晨2点更新</div>
          </div>
          <span className="flex items-center text-[#777]">近30日   <IconWithImage url="/icons/profile/icon-bt.png" width={16} height={16} color={"#777"} /></span>
        </div>
        <div className="flex justify-between m-4">
          <div className="w-32 h-16 flex justify-center flex-col items-center border border-[#FF8492] bg-[#FF8492] bg-opacity-20 rounded-xl">
            <span className="text-xl font-medium">9999</span>
            <span className="text-xs text-gray-400">播放量</span>
          </div>
          <div className="w-32 h-16 flex justify-center flex-col items-center rounded-xl">
            <span className="text-xl font-medium">9.9W</span>
            <span className="text-xs text-gray-400">空间访客</span>
          </div>
          <div className="w-32 h-16 flex justify-center flex-col items-center rounded-xl">
            <span className="text-xl font-medium">99.9W</span>
            <span className="text-xs text-gray-400">订阅量</span>
          </div>
        </div>
        <ChartsLine />
      </div>
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex items-end">
            <h1 className="text-base font-medium">关注变化</h1>
            <div className="ml-2 text-[#BBB] text-xs ">凌晨2点更新</div>
          </div>
          <span className="flex items-center text-[#777]">近30日   <IconWithImage url="/icons/profile/icon-bt.png" width={16} height={16} color={"#777"} /></span>
        </div>
        <div className="flex justify-between m-4">
          <div className="w-32 h-16 flex justify-center flex-col items-center  rounded-xl">
            <span className="text-xl font-medium">9999</span>
            <span className="text-xs text-gray-400">播放量</span>
          </div>
          <div className="w-32 h-16 flex justify-center flex-col items-center rounded-xl border border-[#FF8492] bg-[#FF8492] bg-opacity-20">
            <span className="text-xl font-medium">9.9W</span>
            <span className="text-xs text-gray-400">空间访客</span>
          </div>
          <div className="w-32 h-16 flex justify-center flex-col items-center rounded-xl">
            <span className="text-xl font-medium">99.9W</span>
            <span className="text-xs text-gray-400">订阅量</span>
          </div>
        </div>
        <ChartsLine />
      </div>
    </>
  )
}