
import Header from "@/components/common/header";
import Image from 'next/image';
import Attention from '@/components/space/attention'
import IconWithImage from "@/components/profile/icon";
import Directions from '@/components/space/directions'
import Avatar from "@/components/space/avatar";
import SubColumn from '@/components/space/subColumn'
export default function UserInfo({ id }: { id: string }) {
    const tabs = [
        { icon: '/icons/icon_info_video.png', num: 9999 },
        { icon: '/icons/icon_info_photo.png', num: 9999 },
        { icon: '/icons/like.png', num: 9999 },
        { icon: '/icons/icon_info_follownumber.png', num: 9999 },
    ]
    return (
        <div>
            <div className="bg-slate-400 h-[200px] bg-[url('/demo/blog-bg2.jpeg')] bg-cover bg-blend-multiply">
                <Header right={<>
                    <IconWithImage
                        url="/icons/space/icon_nav_search_white.png"
                        width={22}
                        height={22}
                    />
                    <IconWithImage
                        url="/icons/profile/icon_nav_code@3x.png"
                        width={22}
                        height={22}
                    />
                    <IconWithImage
                        url="/icons/profile/icon_fans_share@3x.png"
                        width={22}
                        height={22}
                    />
                </>} title="" backIconColor={'#fff'} />
                <div className="text-xs pl-6 pr-6 text-white">
                    各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折
                </div>
            </div>
            <section className="mt-[-47px] rounded-t-3xl bg-white relative  pt-12 text-black ">
                <section className="pl-4 pr-4 pb-3 ">
                    <Avatar />
                    <h1 className="text-[18px] font-bold text-center justify-center items-center flex">
                        <span>多米洛</span>
                    </h1>
                    <Attention />
                    <div className="text-center text-gray-400 text-xs">@duomilougirl</div>
                    <div className="flex justify-center mt-1">
                        <IconWithImage
                            url="/icons/icon_info_location.png"
                            width={16}
                            height={18}
                            color="#222"
                        />
                        <span className="text-xs ml-1 text-gray-400">Memphis</span>
                    </div>
                    <div className="flex justify-between mt-6 mb-4">
                        {tabs.map(v => (
                            <div key={v.icon} className="flex justify-center items-center">
                                <IconWithImage
                                    url={v.icon}
                                    width={20}
                                    height={20}
                                    color="#222"
                                />
                                <span className="ml-1 text-[#777]">{v.num}</span>
                            </div>
                        ))}

                    </div>
                    <Directions />
                    <SubColumn />
                </section>
            </section>
        </div>
    );
}
