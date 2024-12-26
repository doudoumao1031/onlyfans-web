"use client"
import React, {HTMLAttributes, useState} from "react";
import clsx from "clsx";
import IconWithImage from "@/components/profile/icon";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Switch} from "@/components/ui/switch";
import {useRouter} from "next/navigation";
import FormDrawer from "@/components/common/form-drawer";
import InputWithLabel from "@/components/profile/input-with-label";
import SheetSelect, {ISelectOption} from "@/components/common/sheet-select";
import ConfirmModal from "@/components/common/confirm-modal";

const ItemEditTitle = ({title, showIcon = true}: { title: React.ReactNode, showIcon?: boolean }) => {
    return <div className="flex gap-2.5 items-center">
        <div className="font-bold text-base">{title}</div>
        {showIcon && <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={'#bbb'}/>}
    </div>
}

const FormItemWithSelect = ({label, value, options, onValueChange}: {
    label: React.ReactNode,
    options: ISelectOption[],
    value: string,
    className?: Pick<HTMLAttributes<HTMLElement>, "className">,
    onValueChange?: (value: string) => void
}) => {
    const showLabel = options.find(item => item.value === value)?.label
    return <section className="flex justify-between items-center border-b border-[#ddd] py-4">
        <div>{label}</div>
        <SheetSelect outerControl={false} options={options} onInputChange={onValueChange}>
            <div className={"flex items-center justify-center gap-1.5 text-[#777]"}>
                <span>{showLabel}</span>
                <IconWithImage url={"/icons/profile/icon_arrow_right@3x.png"} width={16} height={16} color={'#ddd'}/>
            </div>
        </SheetSelect>
    </section>
}


const AddVoteModal = ({children}: { children: React.ReactNode }) => {
    return <FormDrawer
        title={"发起投票"}
        headerLeft={(close) => {
            return <button onTouchEnd={close} className={"text-base text-[#777]"}>
                <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'}/>
            </button>
        }}
        headerRight={(close => {
            return <button onTouchEnd={close} className={"text-base text-main-pink"}>确定</button>
        })}
        trigger={children}
    >
        <section className={"py-5 px-4 border-b border-[#ddd]"}>
            <InputWithLabel name={""} value={""} label={"投票标题"}/>
        </section>
        <section className={"py-5 px-4 border-b border-[#ddd]"}>
            <h3 className="font-medium text-base mb-2">投票内容</h3>
            <section className="flex flex-col gap-5">
                <InputWithLabel name={""} value={""} label={"选项1"} placeholder={'选项内容，最多20字'}/>
                <InputWithLabel name={""} value={""} label={"选项2"} placeholder={'选项内容，最多20字'}/>
                <button
                    className="flex gap-1.5 w-full rounded-xl border border-main-pink justify-center items-center py-2.5 text-main-pink">
                    <IconWithImage url={"/icons/profile/icon_add@3x.png"} color={'#FF8492'} width={20} height={20}/>
                    添加选项
                </button>
            </section>
        </section>
        <section className="px-4">
            <FormItemWithSelect label={"单选/多选"} value={"1"}
                                options={[{label: "单选", value: "1"}, {label: "多选", value: "2"}]}/>
            <section className="flex justify-between items-center border-b border-[#ddd] py-4">
                <div>截止时间</div>
                <button className={"flex items-center justify-center gap-1.5 text-[#777]"}>
                    <span>2022-03-04 12:00</span>
                    <IconWithImage url={"/icons/profile/icon_arrow_right@3x.png"} width={16} height={16}
                                   color={'#ddd'}/>
                </button>
            </section>
        </section>
    </FormDrawer>
}

const ReadSettings = ({children}: { children: React.ReactNode }) => {
    return <FormDrawer
        title={"阅览设置"}
        headerLeft={(close) => {
            return <button onTouchEnd={close} className={"text-base text-[#777]"}>
                <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'}/>
            </button>
        }}
        headerRight={(close => {
            return <button onTouchEnd={close} className={"text-base text-main-pink"}>确定</button>
        })}
        trigger={children}
    >
        <section className={"px-4 mt-5"}>
            <h3>付费设置1</h3>
            <FormItemWithSelect label={"付费对象"} value={"1"}
                                options={[{label: "所有人", value: "1"}, {label: "2", value: "2"}]}/>
            <FormItemWithSelect label={"付费金额"} value={"0"}
                                options={[{label: "0", value: "0"}, {label: "2", value: "2"}]}/>
            <section className={"text-xs text-[#777] mt-1.5"}>金额0时，为免费</section>
        </section>
        <section className={"px-4 mt-5 opacity-40"}>
            <h3>付费设置2(无效)</h3>
            <FormItemWithSelect label={"付费对象"} value={"1"}
                                options={[{label: "所有人", value: "1"}, {label: "2", value: "2"}]}/>
            <FormItemWithSelect label={"付费金额"} value={"0"}
                                options={[{label: "0", value: "0"}, {label: "2", value: "2"}]}/>
            <section className={"text-xs text-[#777] mt-1.5"}>金额0时，为免费</section>
        </section>
    </FormDrawer>
}

export default function Page() {
    const [disabledSubmit] = useState<boolean>(true)
    const router = useRouter()
    return <div>
        <section className="flex justify-between h-11 items-center pl-4 pr-4 ">
            <button onTouchEnd={router.back}>
                <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'}/>
            </button>
            <ConfirmModal content={"未发布的内容是否保存到草稿中"} trigger={<button type="button" className={clsx(disabledSubmit ? "text-[#bbb]" : "#000")}>发布</button>} />
        </section>
        <ConfirmModal content={"确定取消？"} confirm={()=>{console.log("confirm")}} cancel={()=>{console.log("cancel")}}/>
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
                <div className="flex gap-2.5 items-center">
                    <div className="font-bold text-base">发起了一个投票:</div>
                    <AddVoteModal>
                        <button><IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20}
                                               color={'#bbb'}/></button>
                    </AddVoteModal>
                </div>
                <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'}/>
            </section>
            <section className="mt-2.5 rounded-xl bg-[#F4F5F5] px-3 py-2">
                <div className="flex gap-2.5 items-center">
                    <IconWithImage url={"/icons/profile/icon_fans_vote@3x.png"} width={20} height={20}
                                   color={'#FF8492'}/>
                    <span className="font-bold text-main-pink text-base">投票名称</span>
                </div>
                <div className="text-xs text-[#999] mt-1.5">截止：2012-01-01 12:12 结束</div>
            </section>
        </section>
        <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200">
            {/*<ItemEditTitle title={"阅览设置："}/>*/}
            <div className="flex gap-2.5 items-center">
                <div className="font-bold text-base">阅览设置：</div>
                <ReadSettings>
                    <button><IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={'#bbb'}/></button>
                </ReadSettings>
            </div>
            <RadioGroup defaultValue="option-one" className="mt-2.5">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" className="text-main-pink border-main-pink"/>
                    <label htmlFor="option-one">免费订阅</label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two"/>
                    <label htmlFor="option-two">无法浏览-订阅者</label>
                </div>
            </RadioGroup>
        </section>
        <section className="pt-5 pb-5 pl-4 pr-4 ">
            <ItemEditTitle showIcon={false} title={'发布通知'}/>
            <section className="border-b border-gray-200 flex justify-between items-center py-3">
                <div>订阅者</div>
                <Switch></Switch>
            </section>
        </section>
        <section className="text-center pb-5">
            <button
                className="inline-flex w-[165px] items-center justify-center rounded-xl gap-2 border border-main-pink py-2 text-main-pink text-base">
                <IconWithImage url={"/icons/profile/icon_fans_vote@3x.png"} width={20} height={20}
                               color={'#FF8492'}/>
                投票
            </button>
        </section>
    </div>
}