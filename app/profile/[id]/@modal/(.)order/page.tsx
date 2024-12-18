"use client"
import {SlideUpModal} from "@/components/common/slide-up-modal";
import {useState} from "react";
import InputWithLabel from "@/components/profile/input-with-label";


export default function Page() {
    const control = (closeModal: () => void) => {
        return <button onClick={closeModal} className="text-main-pink text-base">完成</button>
    }

    const [priceList,setPriceList] = useState<string[]>(["123"])
    const addPrice = () =>{
        setPriceList(prevState => [...prevState,""])
    }
    return (
        <SlideUpModal title="订阅管理" full headerRightControl={control} showPageHeader>
            <section className="mt-5 text-black">
                <section className="pl-4 pr-4">
                    <h1 className="text-base font-medium">基本订阅</h1>
                    <section className="mt-2.5">
                        <InputWithLabel name={""} value={"$999"} label={"每月价格"} description={
                            <>
                                <div>最小价格$1.99 USDT 或免费</div>
                                您必须先开通 <span className="text-main-pink">Potato钱包</span>，然后才能设置订阅价格或收取打赏
                            </>
                        }/>
                    </section>
                </section>
                <section className="mt-5 mb-5 border-b border-gray-100"></section>
                <section className="pl-4 pr-4">
                    <section className="flex justify-between items-center">
                        <h1 className="text-base font-medium">基本订阅</h1>
                        <button className="rounded-full border border-main-pink text-main-pink pl-4 pr-4 pt-0.5 pb-0.5" onClick={addPrice}>添加</button>
                    </section>
                    {priceList.map((price,index)=> <section key={index} className="mt-2.5">
                        <InputWithLabel name={""} value={price} label={`价格${index+1}`}/>
                    </section>)}
                </section>
            </section>
        </SlideUpModal>
    );
}