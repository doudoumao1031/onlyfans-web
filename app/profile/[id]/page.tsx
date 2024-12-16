import Header from "@/components/profile/header";
import Image from "next/image";
import Avatar from "@/components/profile/avatar";


function HeaderRight() {
    return <>
        <Image src={"/icons/profile/icon-user-qr-code.png"} width={24} height={24} alt={"qr-code"}/>
        <Image src={"/icons/profile/icon-user-share.png"} width={24} height={24} alt={"qr-code"}/>
    </>
}

export default function Page() {
    return <div>
        <div className="profile-content bg-[url('/demo/user_bg.png')]" >
            <Header right={HeaderRight()}/>
            <div className="text-xs pl-6 pr-6">各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折</div>
        </div>
        <section className="mt-[-47px] rounded-t-3xl bg-white relative  pt-12 text-black pb-8">
            <section className="pl-4 pr-4 pb-3 border-b border-b-gray-100">
                <Avatar />
                <h1 className="text-[18px] font-bold text-center justify-center items-center flex">
                    <span>多米洛</span>
                    <button className="w-5 h-5 bg-[url('/icons/profile/icon-edit.png')] bg-contain"></button>
                </h1>
                <div className="text-center text-gray-400 text-xs">@duomilougirl</div>
                <div className="flex justify-center mt-2">
                    <button className="pt-0.5 pb-0.5 rounded-2xl pl-8 pr-8 border border-main-pink text-main-pink">进入空间</button>
                </div>
                <div className="text-xs mt-2.5">
                    <section>Content Creator, Published Cover model, Biochem</section>
                    <button className="text-main-pink mt-1">更多信息</button>
                </div>
            </section>
            <div className="p-5 border-b border-b-gray-100">
                <div className="grid-cols-4 grid text-center">
                    <div className="border-r border-gray-100">
                        <div className="text-2xl">9999</div>
                        <div className="text-xs text-gray-400">帖子</div>
                    </div>
                    <div className="border-r border-gray-100">
                        <div className="text-2xl">9999</div>
                        <div className="text-xs text-gray-400">媒体</div>
                    </div>
                    <div className="border-r border-gray-100">
                        <div className="text-2xl">9999</div>
                        <div className="text-xs text-gray-400">粉丝</div>
                    </div>
                    <div>
                        <div className="text-2xl">9999</div>
                        <div className="text-xs text-gray-400">订阅</div>
                    </div>
                </div>
            </div>

            <div className="pl-4 pr-4">
                <div className="flex justify-between items-center pt-2.5 pb-2.5">
                    <h3 className="text-[15px] font-bold">收藏夹</h3>
                    <button className="text-gray-300">&gt;</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl pt-1.5 pl-4 bg-[url('/icons/profile/bg-collect-blogger.png')] bg-cover">
                        <div className="text-xs text-gray-400">博主</div>
                        <div className="font-medium text-[34px] ">9999</div>
                    </div>
                    <div className="rounded-xl pt-1.5 pl-4 bg-[url('/icons/profile/bg-collect-posts.png')] bg-cover">
                        <div className="text-xs text-gray-400">帖子</div>
                        <div className="font-medium text-[34px] ">9999</div>
                    </div>
                </div>

                <div className="mt-2.5 subscription-item rounded-xl flex justify-between items-center h-[74px]">
222
                </div>
            </div>
        </section>
    </div>
}