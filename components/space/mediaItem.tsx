"use client";
import { ReactElement, useState } from "react";
import Image from "next/image"
import IconWithImage from "../profile/icon";
export type TMediaItem = {
    bg: string
    msg: string
    subscribe: boolean
    isSub: boolean
    duration: number
    type: string
    src: string
    subFees: number
    isClick: boolean
}
export default function Page({ item }: { item: TMediaItem }) {
    const [isClick, setIsClick] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const v = item


    const FullScreen = ({
        item,
    }: {
        item: TMediaItem,
    }) => {
        return (
            <div
                className="fixed top-0 left-0 w-screen h-screen bg-black/90 z-50 flex items-center"
                onClick={e => {
                    e.stopPropagation()
                    setIsOpen(false)
                }}
            >
                {item.type === 'video' ? (
                    <video src={item.src} controls autoPlay className="w-full" />
                ) : (
                    <Image
                        className="w-full"
                        src={item.src}
                        alt=""
                        width={900}
                        height={500}
                    />
                )}
            </div>
        )

    }
    const handleRow = () =>{
        setIsClick(!isClick)
        if(!item.subscribe||(item.subscribe&&item.isSub)){
            setIsOpen(true)
        }
    }
    return <div onClick={() => { handleRow() }} className={` relative rounded-lg p-2 text-xs  text-white flex flex-col justify-between bg-white w-[calc(50%_-_8px)] h-[220px] mb-4 ${v.bg} bg-cover`}>
        <div className="z-10 w-full h-full flex flex-col justify-between">
            <div >{!(v.subscribe && !v.isSub && isClick) ? v.msg : ''}</div>
            {
                v.subscribe && !v.isSub && isClick && <div className="flex flex-col items-center justify-center">
                    <IconWithImage
                        url="/icons/icon_info_lock_white.png"
                        width={32}
                        color="#fff"
                        height={32}
                    />
                    <span className="mt-2">订阅内容，请订阅后查看</span>
                </div>
            }
            <div className="flex justify-between">
                <span className="flex items-center">
                    <IconWithImage
                        url="/icons/profile/icon-video-g.png"
                        width={12}
                        color="#fff"
                        height={12}
                    />
                    <span className="ml-1">9999.99</span>
                </span>
                {!(v.subscribe && !v.isSub && isClick) ? <span className="flex items-center">
                    <IconWithImage
                        url="/icons/profile/icon_fans_money_s@3x.png"
                        width={12}
                        color="#fff"
                        height={12}
                    />
                    <span className="ml-1">$99.99</span>
                </span> : <></>}

            </div>
        </div>

        {v.subscribe && !v.isSub && <div className="w-full h-full bg-black bg-opacity-5 rounded-lg backdrop-blur absolute top-0 left-0 z-[0]"></div>}
        {isOpen && <FullScreen item={v} />}
    </div>
}