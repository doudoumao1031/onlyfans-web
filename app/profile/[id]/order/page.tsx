"use client";
import InputWithLabel from "@/components/profile/input-with-label";
import {useState} from "react";
import Header from "@/components/common/header";
import {useRouter} from "next/navigation";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import ModalHeader from "@/components/common/modal-header";
import React from "react";
import {ISelectOption} from "@/components/common/sheet-select";

const AddSubscriptionModal = ({children}: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const handleClose = () => setIsOpen(false)

    const [timeLimit, setTimeLimit] = useState("")

    return <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
            {children}
        </DrawerTrigger>
        <DrawerContent className={"h-[95vh] bg-white"}>
            <section className={"flex-1"}>
                <DrawerHeader className={"hidden"}>
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <ModalHeader title={"捆绑订阅"}
                             left={<button onTouchEnd={handleClose} className={"text-base text-[#777]"}>取消</button>}
                             right={<button onTouchEnd={handleClose}
                                            className={"text-base text-main-pink"}>保存</button>}></ModalHeader>

                <form className={"mt-5 block px-4"}>
                    <InputWithLabel placeholder={"订阅时限"} onInputChange={setTimeLimit}
                                    options={[{label: "1", value: "1"}, {label: "2", value: "2"}]}
                                    name={""} value={timeLimit}/>
                    <section className={"mt-[30px]"}>
                        <InputWithLabel name={""} value={""} placeholder={"订阅价格"}
                                        description={"最小价格$1.99 USDT，最高价格不超过999.99 价格保留小数点2位数"}/>
                    </section>
                </form>
            </section>
        </DrawerContent>
    </Drawer>
}

const PromotionalActivities = ({children}: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const handleClose = () => setIsOpen(false)

    const priceOptions:ISelectOption[] = [
        {
            label: <div>$6.66  2个月 <span className={"text-[#bbb]"}>（平均约$3.33/月）</span></div>,
            value: "2"
        },
        {
            label: <div>$9.99  3个月 <span className={"text-[#bbb]"}>（平均约$3.33/月）</span></div>,
            value: "3"
        },
        {
            label: <div>$6.66  6个月 <span className={"text-[#bbb]"}>（平均约$3.33/月）</span></div>,
            value: "6"
        }
    ]

    return <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
            {children}
        </DrawerTrigger>
        <DrawerContent className={"h-[95vh] bg-white"}>
            <section className={"flex-1"}>
                <DrawerHeader className={"hidden"}>
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <ModalHeader title={"促销活动"}
                             left={<button onTouchEnd={handleClose} className={"text-base text-[#777]"}>取消</button>}
                             right={<button onTouchEnd={handleClose}
                                            className={"text-base text-main-pink"}>保存</button>}></ModalHeader>

                <form className={"mt-5 block px-4"}>
                    <section>
                        <InputWithLabel description={"在基本订阅和捆绑订阅中已经设定好的价格"} placeholder={"促销价格选择"} value={""}
                                        options={priceOptions}
                                        name={""}/>
                    </section>
                    <section className={"mt-[30px]"}>
                        <InputWithLabel name={""} value={""} placeholder={"促销折扣"}
                                        description={"百分比，最高不超过90%，请保留正整数"}/>
                    </section>
                    <section className={"mt-[30px]"}>
                        <InputWithLabel name={""} value={""} placeholder={"促销开始时间"} />
                    </section>
                    <section className={"mt-[30px]"}>
                        <InputWithLabel name={""} value={""} placeholder={"促销结束时间"} />
                    </section>
                </form>
            </section>
        </DrawerContent>
    </Drawer>
}

export default function Page() {
    const router = useRouter()
    const [priceList] = useState<string[]>([])
    // const addPrice = () => {
    //     setPriceList(prevState => [...prevState, ""])
    // }
    const [baseFee, setBaseFee] = useState("")

    return (
        <div>
            <Header title={"订阅管理"} titleColor={'#000'}
                    right={<button onTouchEnd={router.back} className="text-main-pink text-base">完成</button>}/>
            <section className="mt-5 text-black">
                <section className="pl-4 pr-4 pb-5 border-b border-gray-100">
                    {baseFee}
                    <h1 className="text-base font-medium">基本订阅</h1>
                    <section className="mt-2.5">
                        <InputWithLabel onInputChange={setBaseFee}
                                        options={[{label: "免费", value: "1"}, {label: "自定义", value: "custom"}]}
                                        name={""} value={baseFee} label={"每月价格"} description={
                            <>
                                <div>最小价格$1.99 USDT 或免费</div>
                                您必须先开通 <span className="text-main-pink">Potato钱包</span>，然后才能设置订阅价格或收取打赏
                            </>
                        }/>
                    </section>
                </section>
                <section className={"pt-5 pb-5 border-b border-gray-100"}>
                    <section className="pl-4 pr-4">
                        <section className="flex justify-between items-center">
                            <h1 className="text-base font-medium">捆绑订阅</h1>
                            {/*<button className="rounded-full border border-main-pink text-main-pink pl-4 pr-4 pt-0.5 pb-0.5"*/}
                            {/*        onClick={addPrice}>添加*/}
                            {/*</button>*/}
                            <AddSubscriptionModal>
                                <button
                                    className="rounded-full border border-main-pink text-main-pink pl-4 pr-4 pt-0.5 pb-0.5">添加
                                </button>
                            </AddSubscriptionModal>
                        </section>
                        {priceList.length === 0 && <section className={"text-xs text-[#777]"}>
                          提供几个月的订阅作为折扣捆绑
                        </section>}
                        {priceList.map((price, index) => <section key={index} className="mt-2.5">
                            <InputWithLabel name={""} value={price} label={`价格${index + 1}`}/>
                        </section>)}
                    </section>
                </section>
                <section className={"pt-5 pb-5 border-b border-gray-100"}>
                    <section className="pl-4 pr-4">
                        <section className="flex justify-between items-center">
                            <h1 className="text-base font-medium">促销活动</h1>
                            <PromotionalActivities>
                                <button
                                    className="rounded-full border border-main-pink text-main-pink pl-4 pr-4 pt-0.5 pb-0.5">添加
                                </button>
                            </PromotionalActivities>
                        </section>
                        {priceList.length === 0 && <section className={"text-xs text-[#777]"}>
                          为用户提供订阅的促销活动，可以为您吸引更多的订阅用户
                        </section>}
                        {priceList.map((price, index) => <section key={index} className="mt-2.5">
                            <InputWithLabel name={""} value={price} label={`价格${index + 1}`}/>
                        </section>)}
                    </section>
                </section>
            </section>
        </div>
    );
}