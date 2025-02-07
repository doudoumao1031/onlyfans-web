"use client"
import LazyImg from "@/components/common/lazy-img"
import Post from "@/components/post/post"
import { buildMention } from "@/components/post/utils"
import IconWithImage from "@/components/profile/icon"
import { PostData } from "@/lib"
import { postDetail } from "@/lib/actions/profile"
import { buildImageUrl } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function PostInfo() {
  const searchParams = useSearchParams()
  const postId = searchParams.get("postId") // 获取url中的id参数
  const [postInfo, setPosTInfo] = useState<PostData>()
  const router = useRouter()
  useEffect(() => {
    getPostInfo()
  }, [postId])
  const getPostInfo = async () => {
    const res = await postDetail(Number(postId))
    res && setPosTInfo(res.data as unknown as PostData)
    // console.log(res?.data, "data------a");
  }

  const Header = () => {
    if (!postInfo) return null

    const { photo, first_name, last_name, username, following } = postInfo.user
    return (
      <div className="flex items-center fixed w-full h-[76px] top-0 left-0 px-4 py-4 bg-white z-[99999]">
        <div
          onClick={() => {
            router.back()
          }}
        >
          <IconWithImage
            url="/icons/profile/icon_nav_back@3x.png"
            width={22}
            height={22}
            color={"#222"}
          />
        </div>
        <div className="flex-1 flex items-center pl-4">
          <div className="w-8 h-8">
            <LazyImg
              src={buildImageUrl(photo)}
              alt=""
              className={`rounded-full border-2 border-white w-${8} h-${8}`}
              width={32}
              height={32}
            />
          </div>
          <div className="ml-2">
            <div className="text-[14px]">
              {first_name} {last_name}
            </div>
            <div className="text-black/50 text-[12px]">{buildMention(username)}</div>
          </div>
        </div>

        <div className="focus">
          <div
            className={`h-[26px] w-[80px] flex justify-center items-center rounded-full ${following
              ? "bg-white border border-main-pink text-main-pink"
              : " bg-main-pink text-white"
              }`}
          >
            <IconWithImage
              url={`/icons/${following ? "icon_info_followed_white@3x.png" : "icon_info_follow_white@3x.png"
                }`}
              width={20}
              height={20}
              color={following ? "#f08b94" : "#fff"}
            />
            <span className="ml-1">{following ? "已关注" : "关注"}</span>
          </div>
          {following && <div className="text-[10px] text-main-pink mt-1">订阅剩余：999天</div>}
        </div>
      </div>
    )
  }
  if (!postInfo) return null
  const btnText = () => {
    const { sub } = postInfo.user
    const { price, user_type } = postInfo.post_price[0]
    if (user_type === 0) return ""
    if (!sub) return "订阅后浏览博主的帖子"
    if (!sub) return "订阅后解锁更多内容"
    if (price) return `支付${price || 0} USDT 浏览该帖子`
  }
  return (
    <div className="p-4 pt-20">
      <Header />
      <Post
        data={postInfo as unknown as PostData}
        hasSubscribe={false}
        hasVote={false}
        isInfoPage={true}
      />
      {btnText() && (
        <div className="flex justify-center items-center mt-2">
          <div className="w-[295px] h-[50px] bg-main-pink  text-white rounded-full text-[15px] flex justify-center items-center">
            {btnText()}
          </div>
        </div>
      )}
    </div>
  )
}
