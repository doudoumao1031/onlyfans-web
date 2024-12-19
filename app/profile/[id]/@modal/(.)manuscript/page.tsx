"use client";

import {SlideUpModal} from "@/components/common/slide-up-modal";
import TabTitle, {iTabTitleOption} from "@/components/profile/tab-title";
import {useState} from "react";
import IconWithImage from "@/components/profile/icon";
import ManuscriptItem from "@/components/profile/manuscript/manuscript-item";

enum ACTIVE_TYPE {
    POST = "POST",
    MEDIA = "MEDIA"
}

const ManuscriptPost = () =>{
    const [timeSort, setTimeSort,] = useState<boolean>(false)
    return <section className="pl-4 pr-4 text-black">
        <section className="mt-5 flex gap-4 items-center">
            <div className={"flex-1 pt-2 pb-2 pl-3 pr-3 bg-[#F4F5F5] rounded-full flex items-center"}>
                <IconWithImage url={"/icons/profile/icon_search_s@3x.png"} width={18} height={18}
                               color={'rgb(221, 221, 221)'}/>
                <input placeholder="输入博文内容" className="w-full bg-transparent flex pl-0.5"/>
            </div>
            <button className="shrink-0" onTouchEnd={() => {
                setTimeSort(prevState => !prevState)
            }}>
                <div className="flex items-center justify-center"><IconWithImage
                    url={`/icons/profile/${timeSort ? "icon_gradedown" : "icon_gradeup"}@3x.png`} color={'#000'}
                    width={20} height={20}/></div>
                <span className="text-main-pink text-xs">创建时间</span>
            </button>
        </section>
        <section className={"mt-5 flex flex-col gap-2.5"}>
            <ManuscriptItem/>
            <ManuscriptItem/>
            <ManuscriptItem/>
        </section>
    </section>
}

const ManuscriptMedia = () => {
    const [timeSort, setTimeSort,] = useState<boolean>(false)
    return <section className="pl-4 pr-4 text-black">
        <div className={"flex-1 flex justify-end mt-5"}>
            <button className="shrink-0" onTouchEnd={() => {
                setTimeSort(prevState => !prevState)
            }}>
                <div className="flex items-center justify-center"><IconWithImage
                    url={`/icons/profile/${timeSort ? "icon_gradedown" : "icon_gradeup"}@3x.png`} color={'#000'}
                    width={20} height={20}/></div>
                <span className="text-main-pink text-xs">创建时间</span>
            </button>
        </div>
        <section className="grid grid-cols-2 gap-3">
            <section>
                <section className="rounded-xl relative overflow-hidden text-xs">
                    <section className="pl-2 pr-2 text-white absolute w-full left-0 flex justify-between top-0.5">
                        <section className="flex items-center gap-0.5">
                            <IconWithImage url={"/icons/profile/icon_fans_view_s@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                        <section className="flex items-center gap-0.5">
                            <IconWithImage url={"/icons/profile/icon_fans_money_s@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                    </section>
                    <section className="pl-2 pr-2 text-white absolute w-full left-0 flex bottom-0.5 justify-around">
                        <section className="flex items-center gap-0.5 flex-1">
                            <IconWithImage url={"/icons/profile/icon_fans_like@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                        <section className="flex items-center gap-0.5 flex-1 justify-center">
                            <IconWithImage url={"/icons/profile/icon_fans_comment@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                        <section className="flex items-center gap-0.5 flex-1 justify-end">
                            <IconWithImage url={"/icons/profile/icon_fans_reward@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                    </section>
                    <section className="w-full h-[220px] rounded bg-[url('/demo/user_bg.png')] bg-cover bg-center"></section>
                </section>
                <button className="rounded-[10px] gap-2 flex justify-center pt-2 pb-2 border-main-pink border-2 text-main-pink w-full mt-2">
                    <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={"#FF8492"} />
                    <span>编辑</span>
                </button>
            </section>
            <section>
                <section className="rounded-xl relative overflow-hidden text-xs">
                    <section className="pl-2 pr-2 text-white absolute w-full left-0 flex justify-between top-0.5">
                        <section className="flex items-center gap-0.5">
                            <IconWithImage url={"/icons/profile/icon_fans_view_s@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                        <section className="flex items-center gap-0.5">
                            <IconWithImage url={"/icons/profile/icon_fans_money_s@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                    </section>
                    <section className="pl-2 pr-2 text-white absolute w-full left-0 flex bottom-0.5 justify-around">
                        <section className="flex items-center gap-0.5 flex-1">
                            <IconWithImage url={"/icons/profile/icon_fans_like@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                        <section className="flex items-center gap-0.5 flex-1 justify-center">
                            <IconWithImage url={"/icons/profile/icon_fans_comment@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                        <section className="flex items-center gap-0.5 flex-1 justify-end">
                            <IconWithImage url={"/icons/profile/icon_fans_reward@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                    </section>
                    <section className="w-full h-[220px] rounded bg-[url('/demo/user_bg.png')] bg-cover bg-center"></section>
                </section>
                <button className="rounded-[10px] gap-2 flex justify-center pt-2 pb-2 border-main-pink border-2 text-main-pink w-full mt-2">
                    <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={"#FF8492"} />
                    <span>编辑</span>
                </button>
            </section>
            <section>
                <section className="rounded-xl relative overflow-hidden text-xs">
                    <section className="pl-2 pr-2 text-white absolute w-full left-0 flex justify-between top-0.5">
                        <section className="flex items-center gap-0.5">
                            <IconWithImage url={"/icons/profile/icon_fans_view_s@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                        <section className="flex items-center gap-0.5">
                            <IconWithImage url={"/icons/profile/icon_fans_money_s@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                    </section>
                    <section className="pl-2 pr-2 text-white absolute w-full left-0 flex bottom-0.5 justify-around">
                        <section className="flex items-center gap-0.5 flex-1">
                            <IconWithImage url={"/icons/profile/icon_fans_like@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                        <section className="flex items-center gap-0.5 flex-1 justify-center">
                            <IconWithImage url={"/icons/profile/icon_fans_comment@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                        <section className="flex items-center gap-0.5 flex-1 justify-end">
                            <IconWithImage url={"/icons/profile/icon_fans_reward@3x.png"} width={12} height={12} color={'#fff'} />
                            <span>989</span>
                        </section>
                    </section>
                    <section className="w-full h-[220px] rounded bg-[url('/demo/user_bg.png')] bg-cover bg-center"></section>
                </section>
                <button className="rounded-[10px] gap-2 flex justify-center pt-2 pb-2 border-main-pink border-2 text-main-pink w-full mt-2">
                    <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={"#FF8492"} />
                    <span>编辑</span>
                </button>
            </section>
        </section>
    </section>
}

export default function Page() {
    const [active, setActive] = useState<string>(ACTIVE_TYPE.POST)
    const tabOptions: iTabTitleOption[] = [
        {label: "帖子", name: ACTIVE_TYPE.POST},
        {label: "媒体", name: ACTIVE_TYPE.MEDIA},
    ]
    const control = () => {
        return <button className="text-main-pink text-base">草稿</button>
    }
    return (
        <SlideUpModal title="稿件管理" portalId="modal-root" full headerRightControl={control} showPageHeader>
            <TabTitle tabOptions={tabOptions} active={active} activeChange={setActive}/>
            {active === ACTIVE_TYPE.POST && <ManuscriptPost />}
            {active === ACTIVE_TYPE.MEDIA && <ManuscriptMedia />}
        </SlideUpModal>
    );
}