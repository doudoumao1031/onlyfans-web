import Header from "@/components/common/header"
import Avatar from "@/components/profile/avatar"
import IconWithImage from "@/components/profile/icon"
import Link from "next/link"
import { userProfile } from "@/lib/actions/profile"
import { userWallet } from "@/lib"
import { buildImageUrl, getUserDefaultBackImg } from "@/lib/utils"
import FoldingDescription from "@/components/profile/folding-description"
import RechargePanel from "@/components/profile/recharge-panel"
import LazyImg from "../common/lazy-img"
const displayNumber = (data: number) => {
  if (data > -1 && data < 10000) {
    return data
  }
  if (data > 9999 && data < 100000) {
    return Math.ceil(data / 10000) + "W"
  }
  return Math.ceil(data / 100000) + "W+"
}

export default async function Page() {
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
        className={"profile-content bg-slate-300 bg-cover"}
        // style={{
        //   backgroundImage: data.back_img
        //     ? `url(${buildImageUrl(data.back_img)})`
        //     : "url(/icons/base-header.png)"
        // }}
      >
        <LazyImg
          style={{ objectFit: "cover" }}
          width={200}
          height={400}
          className="w-full h-full"
          src={data.back_img ? buildImageUrl(data.back_img) : "/icons/base-header.png"}
          alt={""}
        />
        <div className=" absolute top-0 left-0 w-full">
          <Header
            right={
              <>
                <IconWithImage
                  url="/icons/profile/icon_nav_code_white@3x.png"
                  width={22}
                  height={22}
                />
                <IconWithImage
                  url="/icons/profile/icon_nav_share_white@3x.png"
                  width={22}
                  height={22}
                />
              </>
            }
            title="My"
            backIconColor={"#fff"}
          />
          <div className="text-xs pl-6 pr-6 text-white ">{data.top_info}</div>
        </div>
      </div>
      <section className="mt-[-47px] rounded-t-3xl bg-white relative  pt-12 text-black ">
        <section className="pl-4 pr-4 pb-3 border-b border-b-gray-100">
          <Avatar showLive={data.live_certification} fileId={data.photo} />
          <h1 className="text-[18px] font-bold text-center justify-center items-center flex">
            <span>
              {data.first_name} {data.last_name}
            </span>
            <Link href={"/profile/edit"}>
              <IconWithImage
                url={"/icons/profile/icon_edit_gray@3x.png"}
                width={20}
                height={20}
                color={"#bbb"}
              />
            </Link>
          </h1>
          <div className="text-center text-[#6D7781] text-xs">@{data.username}</div>
          <Link href={`/space/${data.id}_1/feed`}>
            <div className="flex justify-center mt-2">
              <button className=" py-1 rounded-2xl pl-8 pr-8 border border-main-pink text-main-pink">
                进入空间
              </button>
            </div>
          </Link>
          <div className="text-xs mt-2.5">
            <FoldingDescription about={data.about} location={data.location} />
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
              <div className="text-2xl">{displayNumber(data.subscribe_count)}</div>
              <div className="text-xs text-[#333]">订阅</div>
            </div>
          </div>
        </div>
        <RechargePanel amount={walletInfo.amount} />

        <div className="pl-4 pr-4">
          <div className="flex justify-between items-center pt-2.5 pb-2.5">
            <h3 className="text-[15px] font-bold">收藏夹</h3>
            <Link href={"/profile/collect/posts"} className="text-gray-300">
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
              href={"/profile/collect/blogger"}
              className="rounded-xl pt-1.5 pl-4 bg-[url('/icons/profile/bg-collect-blogger.png')] bg-cover"
            >
              <div className="text-xs text-[rgba(34,34,34,0.70)]">博主</div>
              <div className="font-medium text-[#2b2b2b] text-[34px] ">
                {data.collection_user_count}
              </div>
            </Link>
            <Link
              href={"/profile/collect/posts"}
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
