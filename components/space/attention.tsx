"use client";
import IconWithImage from '@/components/profile/icon';
import Modal, { TModaProps } from '@/components/common/modal'
import { useState } from 'react';
export default function Page() {
    const [isFocus, setIsFocus] = useState<boolean>(false)
    const [visible,setVisible] = useState<boolean>(false)
    const [modalData,setModalData] = useState<TModaProps>({})
    const handleFocus = ()=>{
        setModalData(models[3])
        setTimeout(() => {
            setVisible(false)
        }, 1500);
    }
    const handleTopUp = ()=>{
        setVisible(false)
    }
    const models:TModaProps[] = [
        {
            type:'modal',
            closeModal:false,
            content:<div className='p-4 pb-6' >订阅博主与Ta畅谈</div>,
            okText:'免费/订阅',
            confirm:()=>handleFocus()
        },
        {
            type:'modal',
            closeModal:false,
            content:<div className='p-4 pb-6' >订阅博主与Ta畅谈</div>,
            okText:'订阅',
            confirm:()=>handleFocus()
        },
        {
            type:'modal',
            closeModal:false,
            content:<div className='p-4 pb-6' >余额不足</div>,
            okText:'充值',
            confirm:()=>handleTopUp()
        },
        {
            type:'toast',
            content:'订阅成功',

        }
    ]
   
    return <div className='absolute top-4 right-4 flex flex-col items-end '>
        <div onClick={() => { 
            setIsFocus(!isFocus)
            setVisible(isFocus?false:true)
            setModalData(models[0])
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
        <Modal visible={visible}  cancel={()=>{setVisible(false)}} {...modalData}>
        </Modal>
    </div>
}