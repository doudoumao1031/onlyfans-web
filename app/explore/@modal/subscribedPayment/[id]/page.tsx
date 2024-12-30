"use client"
import {SlideUpModal} from "@/components/common/slide-up-modal";
import {useState, useMemo} from "react";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {subscribePayments, UserSubscribePayment} from "@/mock/user";
import {ToggleGroupSubscribed, ToggleGroupSubscribedItem} from "@/components/ui/toggle-group-subcribed";
import IconWithImage from "@/components/profile/icon";

export default function Page() {
    const router = useRouter()
    const params = useParams();
    const id = params.id; // Access the dynamic route parameter
    const name = useSearchParams().get("name");
    const [amount, setAmount] = useState<number>(0);
    const [payment, setPayment] = useState<UserSubscribePayment>(subscribePayments[0]);
    const [diff, setDiff] = useState<number>(0);
    useMemo(() => {
        const diff = (payment.price - payment.amount).toFixed(2);
        setDiff(parseFloat(diff));
    }, [payment]);

    return (

        <SlideUpModal closeBtn={false}>
            <div className="flex justify-around items-center h-10 w-full mt-4 pl-4">
                <div className="flex justify-start shrink-0 w-[30%]">
                    <button onTouchEnd={router.back}>
                        <IconWithImage url="/icons/icon_close@3x.png" width={24} height={24} color="black"/>
                    </button>
                </div>
                <div className="flex justify-center items-center w-[40%]">
                    <span className="text-lg font-semibold">订阅</span>
                    <span className="text-main-pink font-normal text-[15px]">{name}</span>
                </div>
                <div className="w-[30%]"></div>
            </div>
            <form action="">
                <input hidden={true} name="id" defaultValue={id}/>
                <div className="h-[35vh] flex flex-col items-center text-black text-2xl bg-slate-50">
                    <ToggleGroupSubscribed
                        type="single"
                        variant="default"
                        id="select_pirce"
                        defaultValue={payment.id}
                        className="w-full flex justify-around mt-[20px] px-4"
                        onValueChange={(value) => {
                            if (value) {
                                setAmount(Number(subscribePayments.find((item) => item.id === value)?.amount));
                                setPayment(subscribePayments.find((item) => item.id === value) ?? subscribePayments[0])
                            } else {
                                setAmount(0);
                            }
                        }}>
                        {subscribePayments.map(item => (
                            <ToggleGroupSubscribedItem key={item.id} value={item.id}>
                                <div className="relative h-full">
                                    <div
                                        className="h-full flex flex-col justify-center items-center text-black">
                                        <span className="text-nowrap text-xs">{item.time}</span>
                                        <span
                                            className={`text-nowrap text-xl my-4 ${item.amount === amount ? "text-main-pink": "text-black"}`}>${item.amount}</span>
                                        <span className="text-nowrap text-xs">{
                                            item.price && (
                                                <s className="text-xs text-gray-500">${item.price}</s>)
                                        }
                                        </span>
                                    </div>
                                    {
                                        item.discount > 0 && (
                                            <div
                                                className="absolute bg-main-orange h-4 w-16 -top-1 left-0 rounded-t-full rounded-br-full flex justify-center items-center">
                                                <span
                                                    className="text-white text-xs text-center">{item.discount * 100}% off</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </ToggleGroupSubscribedItem>
                        ))}
                    </ToggleGroupSubscribed>
                    <div className="my-[40px]  self-center">
                        <div className="relative">
                            <button
                                disabled={amount === 0}
                                className="w-[295px] h-[49px] p-2 bg-main-pink text-white text-base font-medium rounded-full"
                                onTouchEnd={(e) => {
                                    e.preventDefault();
                                    console.log(`confirm payment of ${amount}`)
                                }}>确认支付 {amount} USDT
                            </button>
                            {
                                payment.discount > 0 && (
                                    <div
                                        className="absolute bg-main-orange h-4 px-2 -top-1 right-4 rounded-t-full rounded-br-full flex justify-center items-center">
                                                <span
                                                    className="text-white text-xs text-center text-nowrap">已省 ${diff}</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </form>
        </SlideUpModal>
    );
}