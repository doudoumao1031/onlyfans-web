
import Header from "@/components/common/header"
import Image from "next/image"
import Avatar from "@/components/profile/avatar"
import IconWithImage from "@/components/profile/icon"
import Directions from "@/components/space/directions"
import { UserProfile, userProfile } from "@/lib/actions/profile"
export default async function UserInfo({ data }: { data: UserProfile | undefined }) {
  // const response = await userProfile()
  // const data = response?.data
  if (!data) {
    throw new Error()
  }
  const tabs = [
    { icon: "/icons/icon_info_video.png", num: data.video_count },
    { icon: "/icons/icon_info_photo.png", num: data.post_count },
    { icon: "/icons/like.png", num: data.fans_count },
    { icon: "/icons/icon_info_follownumber.png", num: data.following_count }
  ]
  return (
    <div>
      <div className={"bg-slate-400 h-[200px] bg-[url('/demo/blog-bg2.jpeg')] bg-cover bg-blend-multiply"}>
        <Header right={(
          <>
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
          </>
        )} title="" backIconColor={"#fff"}
        />
        <div className="text-xs pl-6 pr-6 text-white">
          {data.top_info}
        </div>
      </div>
      <section className="mt-[-47px] rounded-t-3xl bg-white relative  pt-12 text-black ">
        <section className="pl-4 pr-4 pb-3 ">
          <Avatar showLive={data.live_certification} fileId={data.photo} />

          <h1 className="text-[18px] font-bold text-center justify-center items-center flex">
            <span>{data.first_name} {data.last_name}</span>
          </h1>
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
          <Directions about={data.about} />
        </section>
      </section>
    </div>
  )
}
