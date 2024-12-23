"use client";
import Header from "@/components/common/header";
import IconWithImage from "@/components/profile/icon";
import { useState } from "react";
import ChartsLine from "@/components/profile/chart-line";
import FormDrawer from "@/components/common/form-drawer";
export default function Page() {
    const [active, setActive] = useState<number>(2)
    const [dateActive, setDateActive] = useState<number>(1)
    const tabs = [
        { label: '1月1日', value: 1 },
        { label: '近30日', value: 2 },
        { label: '近一年', value: 3 },
    ]
    const dateTabs = [
        { label: '近7日', value: 1 },
        { label: '近15日', value: 2 },
        { label: '近30日', value: 3 },
    ]

    const Withdrawal = ({ children }: { children: React.ReactNode }) => {
        return <FormDrawer
            title={"提现"}
            headerLeft={(close) => {
                return <button onTouchEnd={close} className={"text-base text-[#777]"}>
                    <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'} />
                </button>
            }}
            headerRight={(close => {
                return <button onTouchEnd={close} className={"text-base text-main-pink"}>明细</button>
            })}
            trigger={children}
        >
            <div>123</div>
        </FormDrawer>
    }

    return <>
        <Header title="收益中心" titleColor='#000' />
        <div className="flex p-4">
            {tabs.map(v => (<div onClick={() => { setActive(v.value) }} key={v.value} className={`w-20 h-8 flex justify-center items-center border border-[#FF8492] text-[#ff8492] rounded-full mr-3 ${active === v.value ? 'bg-[#ff8492] text-[#fff]' : ''}`}>{v.label}</div>))}
        </div>
        <div className="p-6 pt-0 flex justify-center items-end">
            <span className="text-[32px] font-medium">9999.99</span>
            <span className="text-[18px] text-[#777] ml-2 pb-1">USDT</span>

        </div>
        <div className="pl-4 pr-4 flex justify-between items-center mt-2 mb-12">
            <span className="text-xs">
                <span className="text-[#777] ">较前30日</span>
                <span className="text-main-pink ml-2">+9999.99</span>
            </span>
            <Withdrawal>
                <span className="text-xs flex">
                    <span className="text-[#777] ">较前30日</span>
                    <span className="ml-2 mr-2">+9999.99</span>
                    <span>  <IconWithImage
                        url="/icons/profile/icon-r.png"
                        width={14}
                        color="#BBB"
                        height={14}
                    /></span>
                </span>
            </Withdrawal>

        </div>
        <div className="pl-4 font-bold text-base">收益趋势</div>
        <div className="p-4 flex">
            <span className="mr-8">收益时间</span>
            {dateTabs.map(v => (<span onClick={() => { setDateActive(v.value) }} key={v.value} className={`mr-8 text-[#bbb] ${dateActive === v.value ? 'text-main-pink' : ''}`}>{v.label}</span>))}
        </div>
        <div className="p-4">
            <ChartsLine />
        </div>

    </>
}