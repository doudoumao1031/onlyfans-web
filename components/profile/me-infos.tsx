import Header from "@/components/common/header"
import Avatar from "@/components/profile/avatar"
import IconWithImage from "@/components/profile/icon"
import Link from "next/link"
import RechargeDrawer from "@/components/profile/recharge-drawer"
import { userProfile } from "@/lib/actions/profile"
import { userWallet } from "@/lib"
import { buildImageUrl } from "@/lib/utils"
type Tprops = {
  id: string
}
const displayNumber = (data: number) => {
  if (data > -1 && data < 10000) {
    return data
  }
  if (data > 9999 && data < 100000) {
    return Math.ceil(data / 10000) + "W"
  }
  return Math.ceil(data / 100000) + "W+"
}
export default async function Page({ id }: Tprops) {
  const response = await userProfile()
  const data = response?.data
  if (!data) {
    throw new Error()
  }
  const wallet = await userWallet()
  const walletInfo = wallet?.data
  if (!walletInfo) {
    throw new Error()
  }

  return (
    <div>
      <div
        className={"profile-content bg-slate-300"}
        style={{
          backgroundImage: `url(${buildImageUrl(data.back_img
          )})`
        }}
      >
        <Header
          right={(
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
          )}
          title="My"
          backIconColor={"#fff"}
        />
        <div className="text-xs pl-6 pr-6 text-white">{data.top_info}</div>
      </div>
      <section className="mt-[-47px] rounded-t-3xl bg-white relative  pt-12 text-black ">
        <section className="pl-4 pr-4 pb-3 border-b border-b-gray-100">
          <Avatar showLive={data.live_certification} fileId={data.photo} />
          <h1 className="text-[18px] font-bold text-center justify-center items-center flex">
            <span>
              {data.first_name} {data.last_name}
            </span>
            <Link href={`/profile/${id}/edit`}>
              <IconWithImage
                url={"/icons/profile/icon_edit@3x.png"}
                width={20}
                height={20}
                color={"#bbb"}
              />
            </Link>
          </h1>
          <div className="text-center text-[#6D7781] text-xs">
            @{data.username}
          </div>
          <Link href={`/space/${id}_1/feed`}>
            <div className="flex justify-center mt-2">
              <button className="pt-0.5 pb-0.5 rounded-2xl pl-8 pr-8 border border-main-pink text-main-pink">
                进入空间
              </button>
            </div>
          </Link>
          <div className="text-xs mt-2.5">
            <section>{data.about || "暂无信息"}</section>
            {data.about && (
              <button className="text-main-pink mt-1">更多信息</button>
            )}
          </div>
          <div className={"flex text-xs gap-1 mt-1.5 text-[#6D7781]"}>
            <IconWithImage
              url={"/icons/profile/icon-address.png"}
              width={16}
              height={16}
              color={"#222"}
            />
            <span>{data.location || "北京"}</span>
          </div>
        </section>
        <div className="p-5 border-b border-b-gray-100">
          <div className="grid-cols-4 grid text-center">
            <div className="border-r border-gray-100">
              <div className="text-2xl">{displayNumber(data.post_count)}</div>
              <div className="text-xs text-[#333]">帖子</div>
            </div>
            <div className="border-r border-gray-100">
              <div className="text-2xl">{displayNumber(data.video_count)}</div>
              <div className="text-xs text-[#333]">媒体</div>
            </div>
            <div className="border-r border-gray-100">
              <div className="text-2xl">{displayNumber(data.fans_count)}</div>
              <div className="text-xs text-[#333]">粉丝</div>
            </div>
            <div>
              <div className="text-2xl">
                {displayNumber(data.subscribe_count)}
              </div>
              <div className="text-xs text-[#333]">订阅</div>
            </div>
          </div>
        </div>
        <div className={"p-4"}>
          <div className={"bg-[url('/icons/profile/bg_wallet.png')] bg-cover rounded-xl text-white flex justify-between items-center w-full px-[20px] pt-[10px] pb-[20px]"}>
            <div className={"flx flex-col justify-start"}>
              <span className={"text-xs"}>唯粉余额</span>
              <div className={"flex items-baseline font-medium"}>
                <span className={"text-[32px]"}>{walletInfo?.amount || 0.00}</span>
                <span className={"text-[15px]"}>&nbsp;&nbsp;USDT</span>
              </div>
            </div>
            <RechargeDrawer />
          </div>
        </div>

        <div className="pl-4 pr-4">
          <div className="flex justify-between items-center pt-2.5 pb-2.5">
            <h3 className="text-[15px] font-bold">收藏夹</h3>
            <Link
              href={`/profile/${id}/collect/posts`}
              className="text-gray-300"
            >
              <IconWithImage
                url={"/icons/profile/icon_arrow_right@3x.png"}
                width={16}
                height={16}
                color={"#ddd"}
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/profile/${id}/collect/blogger`}
              className="rounded-xl pt-1.5 pl-4 bg-[url('/icons/profile/bg-collect-blogger.png')] bg-cover"
            >
              <div className="text-xs text-[rgba(34,34,34,0.70)]">博主</div>
              <div className="font-medium text-[#2b2b2b] text-[34px] ">
                {data.following_count}
              </div>
            </Link>
            <Link
              href={`/profile/${id}/collect/posts`}
              className="rounded-xl pt-1.5 pl-4 bg-[url('/icons/profile/bg-collect-posts.png')] bg-cover"
            >
              <div className="text-xs text-[rgba(34,34,34,0.70)]">帖子</div>
              <div className="font-medium text-[#2b2b2b] text-[34px] ">
                {data.collection_post_count}
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}