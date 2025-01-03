"use client"
import FormDrawer from "@/components/common/form-drawer";
import IconWithImage from "@/components/profile/icon";
import {ToggleGroupSubscribed, ToggleGroupSubscribedItem} from "@/components/ui/toggle-group-subcribed";
import {useState, useMemo, useEffect} from "react";
import {DiscountInfo, viewUserSubscribeSetting} from "@/lib/data";

interface SubscribedDrawerProps {
    userId: number;
    name: string,
    children: React.ReactNode
}

const SubscribedDrawer: React.FC<SubscribedDrawerProps> = ({userId, name, children}) => {

    const [items, setItems] = useState<DiscountInfo[]>([]);
    const [discount, setDiscount] = useState<DiscountInfo>();
    const [price, setPrice] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);
    useEffect(() => {
        const fetchSubscribeSettings = async () => {
            try {
                const settings = await viewUserSubscribeSetting({user_id: userId});
                if (settings?.items){
                    const list:DiscountInfo[] = [];
                    list.push({
                        id: 1,
                        month_count: 1,
                        price: settings?.price ?? 0,
                        discount_per: 0,
                        discount_price: 0,
                        discount_start_time: 0,
                        discount_end_time: 0,
                        discount_status: false,
                        user_id: userId,
                    })
                    list.push(...settings.items);
                    if (settings?.items) setItems(list);
                }
                if (settings?.price) setPrice(settings.price);
            } finally {
            }
        };
        fetchSubscribeSettings();
    }, [userId]);
    const [diff, setDiff] = useState<number>(0);
    useMemo(() => {
        const diff = discount ? (price * discount.month_count - discount?.price).toFixed(2):"0";
        setDiff(parseFloat(diff));
    }, [discount, price]);

    return <FormDrawer
        title={<div>
            <span className="text-lg font-semibold">订阅</span>
            <span className="text-main-pink font-normal text-[15px] t">{name}</span>
        </div>}
        headerLeft={(close) => {
            return <button onTouchEnd={close} className={"text-base text-[#777]"}>
                <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'}/>
            </button>
        }}
        trigger={children}
        className='h-[43vh] border-0'
    >
        <form action="">
            <input hidden={true} name="id" defaultValue={userId}/>
            <div className="h-[35vh] flex flex-col items-center text-black text-2xl bg-slate-50">
                <ToggleGroupSubscribed
                    type="single"
                    variant="default"
                    id="select_pirce"
                    defaultValue={discount?.id+Math.random().toString(36).substring(2, 9)}
                    className="w-full flex justify-around mt-[20px] px-4"
                    onValueChange={(value) => {
                        if (value) {
                            setDiscount(items.find((item) => item.id === Number(value))?? items[0]);
                            setAmount(items.find((item) => item.id === Number(value))?.price ?? 0);
                        } else {
                            setAmount(0);
                        }
                    }}>
                    {items.map(item => (
                        <ToggleGroupSubscribedItem key={item.id} value={String(item.id)}>
                            <div className="relative h-full">
                                <div
                                    className="h-full flex flex-col justify-center items-center text-black">
                                    <span className="text-nowrap text-xs">{item.month_count}个月</span>
                                    <span
                                        className={`text-nowrap text-xl my-4 ${item.price === amount ? "text-main-pink" : "text-black"}`}>${item.price}</span>
                                    <span className="text-nowrap text-xs block">
                                        {
                                        item.month_count > 1 && (
                                            <s className="text-xs text-gray-500">${price * item.month_count}</s>)
                                        }
                                    </span>
                                </div>
                                {
                                    item.discount_per > 0 && (
                                        <div
                                            className="absolute bg-main-orange h-4 w-16 -top-1 left-0 rounded-t-full rounded-br-full flex justify-center items-center">
                                                <span
                                                    className="text-white text-xs text-center">{item.discount_per}% off</span>
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
                            discount && discount.discount_per > 0 && (
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
    </FormDrawer>
}

export default SubscribedDrawer;