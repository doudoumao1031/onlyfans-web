"use client";
import IconWithImage from '@/components/profile/icon';
import Modal from '@/components/space/modal'
import { useState } from 'react';
export default function Page() {
    const [isFocus, setIsFocus] = useState<boolean>(false)
    return <div className='absolute top-4 right-4 flex flex-col items-end '>
        <div onClick={() => { setIsFocus(!isFocus) }} className={`w-20 h-8 rounded-full border border-[#ff8492] flex justify-center items-center  ${isFocus ? '' : 'bg-[#ff8492]'}`}>
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
        <Modal visible={true} type='modal' content={'订阅成功'} >
        </Modal>
    </div>
}