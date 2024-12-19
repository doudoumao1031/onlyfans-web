"use client"
import React, {useState} from "react";
import clsx from "clsx";
import IconWithImage from "@/components/profile/icon";

const ItemEditTitle = ({title}:{title:React.ReactNode}) =>{
    return <div className="flex gap-2.5 items-center">
        <div className="font-bold text-base">{title}</div>
        <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={'#bbb'}/>
    </div>
}


export default function Page() {
    const [disabledSubmit] = useState<boolean>(true)
    return <div>
        <section className="flex justify-between h-11 items-center pl-4 pr-4 ">
            <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'}/>
            <button type="button" className={clsx(disabledSubmit ? "text-[#bbb]" : "#000")}>发布</button>
        </section>

        <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200 flex gap-2.5 flex-wrap">
            <div className="relative w-[100px] h-[100px] flex items-center justify-center bg-[#F4F5F5] rounded ">
                <input type="file" className="block w-full h-full absolute left-0 top-0 opacity-0 z-10"/>
                <IconWithImage url={'/icons/profile/icon_add@3x.png'} width={24} height={24} color={'#000'}/>
                <div className="text-[#bbb] text-xs text-center absolute bottom-2">视频/图片</div>
            </div>
        </section>
        <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200">
            <textarea className="resize-none block w-full" placeholder="请输入" rows={5}/>
        </section>
        <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200">
            <section className="flex justify-between">
                <ItemEditTitle title={"发起了一个投票:"}/>
                <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'}/>
            </section>
            <section className="mt-2.5 rounded-xl bg-[#F4F5F5] px-3 py-2">
                <div className="flex gap-2.5 items-center">
                    <IconWithImage url={"/icons/profile/icon_fans_vote@3x.png"} width={20} height={20} color={'#FF8492'}/>
                    <span className="font-bold text-main-pink text-base">投票名称</span>
                </div>
                <div className="text-xs text-[#999] mt-1.5">截止：2012-01-01 12:12 结束</div>
            </section>
        </section>
        <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200">
            <ItemEditTitle title={"阅览设置："}/>
        </section>
    </div>
}