import Avatar from "@/components/profile/avatar"
import IconWithImage from "@/components/profile/icon"
import Directions from "@/components/space/directions"
import { UserProfile } from "@/lib/actions/profile"
import SpaceHeader from "./space-header"
import Attention from "./attention"
import SubColumn from "./subColumn"
// import { data } from '../profile/chart-line';
// import SubscribedDrawer from "../explore/subscribed-drawer"
export default async function UserInfo({
  data,
  isSelf
}: {
  data: UserProfile | undefined
  isSelf: boolean
}) {
  // const response = await userProfile()
  // const data = response?.data
  if (!data) {
    throw new Error()
  }
  const tabs = [
    { icon: "/icons/space/icon_info_video@3x.png", num: data.video_count }, //视频
    { icon: "/icons/space/icon_info_photo@3x.png", num: data.img_count }, //图片
    { icon: "/icons/space/icon_info_like@3x.png", num: data.collection_user_count }, //收藏
    { icon: "/icons/space/icon_info_follownumber@3x.png", num: data.fans_count } //关注==粉丝
  ]

  return (
    <div className="w-full">
      <SpaceHeader data={data} />
      <section className="mt-[-47px] rounded-t-3xl bg-white relative  pt-12 text-black " id="refEl">
        <section className="pl-4 pr-4 pb-3 ">
          <Avatar showLive={data.live_certification} fileId={data.photo} />

          <h1 className="text-[18px] font-bold text-center justify-center items-center flex">
            <span>
              {data.first_name} {data.last_name}
            </span>
          </h1>
          {!isSelf && <Attention data={data} />}
          <div className="text-center text-gray-400 text-xs">@{data.username}</div>
          <div className="flex justify-center mt-1">
            <IconWithImage
              url="/icons/icon_info_location.png"
              width={16}
              height={18}
              color="#222"
            />
            <span className="text-xs ml-1 text-gray-400">{data.location || "北京"}</span>
          </div>
          <div className="flex justify-between mt-6 mb-6 px-1">
            {tabs.map((v) => (
              <div key={v.icon} className="flex justify-center items-center">
                <IconWithImage url={v.icon} width={20} height={20} color="#222" />
                <span className="ml-1 text-[#777]">{v.num}</span>
              </div>
            ))}
          </div>
          <Directions about={data.about} />
          {!isSelf && <SubColumn data={data} />}
        </section>
      </section>
    </div>
  )
}
