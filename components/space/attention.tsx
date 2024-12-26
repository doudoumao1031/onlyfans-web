"use client";
import IconWithImage from '@/components/profile/icon';
import Modal, { TModaProps } from '@/components/common/modal'
import FormDrawer from "@/components/common/form-drawer";
import { useState } from 'react';
export type TFeeItem = {
    month: number
    price: number
    discount?: number
    percentage?: string
}
const mockPrices: TFeeItem[] = [
    {
        month: 1,
        price: 99.99,
    },
    {
        month: 3,
        price: 999.99,
        discount: 90.9,
        percentage: '90%'
    },
    {
        month: 99,
        price: 9999.99,
        discount: 999.0,
        percentage: '90%'
    },
]
export default function Page() {
    const [isFocus, setIsFocus] = useState<boolean>(false)
    const [visible, setVisible] = useState<boolean>(false)
    const [modalType, setModalType] = useState<number>(0)
    const [active, setActive] = useState<number>(0)
    const handleFocus = () => {
        // setModalType(3)
        // setTimeout(() => {
        // }, 1500);
    }
    const handleTopUp = () => {
        setVisible(false)
    }
    const SubConfirm = ({ children }: { children: React.ReactNode }) => {
        return <FormDrawer
            title={<div>订阅 <span className='ml-1 text-[15px] text-main-pink'>用户的昵称</span></div>}
            headerLeft={(close) => {
                return <button onTouchEnd={close} className={"text-base text-[#777]"}>
                    <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'} />
                </button>
            }}
            trigger={children}
            className='h-[47vh] border-0'
        >
            <div className="py-8 px-4" onClick={(e)=>{
                e.stopPropagation()
            }}>
                <div className='flex justify-between items-center '>
                    {
                        mockPrices.map((v, i) => {
                            return <div onClick={(e)=>{
                                e.stopPropagation()
                                setActive(i)}} key={i} className={`relative w-[32%] h-36 rounded-lg border-main-pink flex flex-col justify-center items-center ${active===i&&'border'}`}>
                                <span className={`text-xs text-[#6D7781] ${active===i&&'text-[#222222]'}`}>{`${v.month}个月`}</span>
                                <span className={`text-[20px] font-bold my-4] ${active===i?'text-main-pink':'text-[#222222'}`}>{`$${v.price}`}</span>
                                <span className='text-[#6D7781] text-xs'>{v.discount?`$${v.discount}`:''}</span>
                                {v.percentage&&<div className=' flex justify-center items-center absolute left-0 top-0 w-1/2 h-[18px] mt-[-9px] bg-[#F7B500] rounded-full rounded-bl-none text-xs text-white'>{`${v.percentage} off`}</div>}
                            </div>

                        })
                    }

                </div>
                <div className="flex justify-center">
                    <div className="w-72 h-12 rounded-full bg-main-pink text-white flex justify-center items-center mt-16 text-[15px] font-semibold">确认并支付 999.99 USDT</div>
                </div>
            </div>
        </FormDrawer>
    }


    const models: TModaProps[] = [
        {
            type: 'modal',
            closeModal: false,
            content: <div className='p-4 pb-6' >订阅博主与Ta畅谈</div>,
            okText: <SubConfirm><span>免费/订阅</span></SubConfirm>,
            // okText:'免费/订阅',
            // confirm:()=>handleFocus()
        },
        {
            type: 'modal',
            closeModal: false,
            content: <div className='p-4 pb-6' >订阅博主与Ta畅谈</div>,
            okText: <SubConfirm><span>订阅</span></SubConfirm>,
            // confirm:()=>handleFocus()
        },
        {
            type: 'modal',
            closeModal: false,
            content: <div className='p-4 pb-6' >余额不足</div>,
            okText: '充值',
            confirm: () => handleTopUp()
        },
        {
            type: 'toast',
            content: '订阅成功',

        }
    ]



    return <div className='absolute top-4 right-4 flex flex-col items-end '>
        <div onClick={() => {
            setIsFocus(!isFocus)
            setVisible(isFocus ? false : true)
            setModalType(0)
        }} className={`w-20 h-8 rounded-full border border-[#ff8492] flex justify-center items-center  ${isFocus ? '' : 'bg-[#ff8492]'}`}>
            <IconWithImage
                url={isFocus ? '/icons/icon_info_followed_white.png' : '/icons/icon_info_follow_white.png'}
                width={20}
                height={20}
                color={isFocus ? '#ff8492' : '#fff'}
            />
            <span className={isFocus ? 'text-[#ff8492]' : 'text-white'}>{isFocus ? '已关注' : '关注'}</span>
        </div>
        <div className='flex text-main-pink text-xs mt-3 items-center'>
            <span className='pr-1'>订阅：999天</span>
            <IconWithImage
                url='/icons/icon_arrow_right.png'
                width={16}
                height={16}
                color='#ff8492'
            />
        </div>
        <Modal visible={visible} cancel={() => { setVisible(false) }} {...models[modalType]}>
        </Modal>
    </div>
}