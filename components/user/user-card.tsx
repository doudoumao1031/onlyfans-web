import Avatar from "@/components/user/avatar";
import Image from "next/image";
import {User} from "@/mock/user";

/**
 * 博主名片
 * @param user 用户信息
 * @param subscribe 是否订阅
 * @constructor
 */
export default function UserCard({user, subscribe}: { user: User, subscribe: boolean }) {

    return (
        <div className="flex justify-center w-full bg-black rounded-lg h-[100px]">
            <Image
                src={user.backgroundImage}
                width={280}
                height={100}
                alt=""
                className="w-full rounded-lg opacity-50"
            />
            <div className="w-full absolute flex-col h-[100px] px-4">
                <div className="h-4 text-xs text-nowrap text-white px-1 pb-1 truncate">
                    {user?.about}
                </div>
                <div className="w-full">
                    <div className="flex gap-4 px-3 items-center justify-start">
                        <div className="w-1/4">
                            <Avatar src={user.avatar} vlog={user.vlog} width="w-[66px]"/>
                        </div>
                        <div className="flex-col w-3/4">
                            <div className="text-white">
                                <div className="font-medium">{user.name}</div>
                                <div className="font-normal">@{user.id}</div>
                            </div>
                            {subscribe && (
                            <div className="flex justify-between items-center gap-24">
                                <div className="flex items-center gap-4">
                                    <div className="bg-black bg-opacity-40 px-2 py-1 rounded-full flex items-center">
                                        <Image
                                            src="/icons/explore/icon_fans_info_photo_white@3x.png"
                                            width={14}
                                            height={14}
                                            alt="photo"
                                        />
                                        <span className="text-white text-xs ml-1">{user.photo}</span>
                                    </div>
                                    <div className="bg-black bg-opacity-40 px-2 py-1 rounded-full flex items-start">
                                        <Image
                                            src="/icons/explore/icon_fans_info_video_white@3x.png"
                                            width={14}
                                            height={14}
                                            alt="video"
                                        />
                                        <span className="text-white text-xs ml-1">{user.video}</span>
                                    </div>
                                </div>
                                <button className="bg-black bg-opacity-40 self-start px-2 py-1 rounded-full">
                                    <span className="text-white text-xs text-nowrap">免费/订阅</span>
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                    {
                        !subscribe && (
                            <div className="text-white text-xs absolute right-7 bottom-3">
                                今日新增: {user.addNum ?? 0}
                            </div>)
                    }
                </div>
            </div>
        </div>
    )
};
