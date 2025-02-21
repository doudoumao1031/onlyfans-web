"use client"
import { useCommonMessageContext } from "@/components/common/common-message"
import SubscribedDrawer from "@/components/explore/subscribed-drawer"
import Post from "@/components/post/post"
import { buildMention } from "@/components/post/utils"
import IconWithImage from "@/components/profile/icon"
import { PostData } from "@/lib"
import { userDelFollowing, userFollowing } from "@/lib/actions/space"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import CommonAvatar from "@/components/common/common-avatar"
import { postDetail } from "@/lib/actions/profile"
import PostPayDrawer from "@/components/postInfo/post-pay-drawer"
import Link from "next/link"
import { useGlobal } from "@/lib/contexts/global-context"
import CommonRecharge from "@/components/post/common-recharge"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"

export default function Page({ postData }: { postData: PostData }) {
  const [postInfo, setPostInfo] = useState<PostData>(postData)
  const { sid } = useGlobal()
  const { showMessage } = useCommonMessageContext()
  const [isFocus, setIsFocus] = useState<boolean>(postInfo.user?.following as boolean)
  const [drawer, setDrawer] = useState<boolean>(false)
  const [payDrawer, setPayDrawer] = useState<boolean>(false)
  const [pay, setPay] = useState<boolean>(false)
  const [follow, setFollow] = useState<boolean>(false)
  const [price, setPrice] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(false)
  const [recharge, setRecharge] = useState<boolean>(false)
  const router = useRouter()
  const [btnText, setBtnText] = useState<string>("")
  useMemo(() => {
    if (postInfo.user.id === sid) {
      setBtnText("")
      return
    }
    const { sub, following, sub_price } = postInfo.user
    const { visibility } = postInfo.post
    postInfo.post_price.some((item) => {
      if (item.user_type === 1 && sub) {
        setPrice(item.price)
        return true
      }
      if (item.user_type === 2 && !sub) {
        setPrice(item.price)
        return true
      }
      if (item.user_type === 0) {
        setPrice(item.price)
        return true
      }
    })
    if (visibility === 2 && price > 0) {
      setPay(true)
      setBtnText(`支付${price || 0} USDT 浏览该帖子`)
    } else if (visibility === 1 && !sub) {
      setPay(false)
      setBtnText("订阅后浏览博主的帖子")
    } else if (visibility === 0) {
      if (sub_price > 0 && !following) {
        setFollow(true)
        setBtnText("关注后解锁更多内容")
      } else if (!sub) {
        setPay(false)
        setBtnText("订阅后解锁更多内容")
      }
    } else {
      setPay(false)
      setBtnText("")
    }
  }, [postInfo.post, postInfo.post_price, postInfo.user, price, sid])

  const flush = async () => {
    const res = await postDetail(Number(postInfo.post.id))
    const result = res?.data as unknown as PostData
    setPostInfo(result)
  }

  const { withLoading } = useLoadingHandler({
    onError: (error) => {
      console.error("follow error:", error)
      showMessage("操作失败")
    }
  })

  const handleFollowing = async () => {
    await withLoading(async () => {
      setIsFocus(!isFocus)
      const res = isFocus
        ? await userDelFollowing({ follow_id: postInfo?.user.id as number, following_type: 0 })
        : await userFollowing({ follow_id: postInfo?.user.id as number, following_type: 0 })
      if (!res || res.code !== 0) return setIsFocus(!isFocus)
      if (!isFocus) {
        setFollow(false)
      }
      flush()
      showMessage(!isFocus ? "关注成功" : "取消成功")
    })
  }

  const Header = () => {
    const { photo, first_name, last_name, username, sub_end_time, id, sub } = postInfo.user
    return (
      <div className="flex items-center fixed w-full h-[76px] top-0 left-0 px-4 py-4 bg-white z-[45]">
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
        <Link href={`/space/${id}/feed`} className="flex-1">
          <div className="flex-1 flex items-center pl-4">
            <div className="w-8 h-8">
              <CommonAvatar photoFileId={photo} size={32} />
            </div>
            <div className="ml-2">
              <div className="text-[14px]">
                {first_name} {last_name}
              </div>
              <div className="text-black/50 text-[12px]">{buildMention(username)}</div>
            </div>
          </div>
        </Link>
        {sid !== id && (
          <div className="focus">
            <div
              onClick={() => {
                handleFollowing()
              }}
              className={`h-[26px] w-[80px] flex justify-center items-center rounded-full ${
                isFocus
                  ? "bg-white border border-border-pink text-text-pink"
                  : " bg-background-pink text-white"
              }`}
            >
              <IconWithImage
                url={`/icons/${
                  isFocus ? "icon_info_followed_white@3x.png" : "icon_info_follow_white@3x.png"
                }`}
                width={20}
                height={20}
                color={isFocus ? "#f08b94" : "#fff"}
              />
              <span className="ml-1">{isFocus ? "已关注" : "关注"}</span>
            </div>
            {sub && (
              <div className="text-[10px] text-text-pink mt-1">
                订阅剩余：{sub_end_time ? dayjs(sub_end_time * 1000 || 0).diff(dayjs(), "days") : 0}天
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
  if (!postInfo) return null

  return (
    <div className="p-4 pt-20">
      <Header/>
      <Post data={postInfo as unknown as PostData} hasSubscribe={false} hasVote isInfoPage={true}/>
      {btnText !== "" && (
        <div className="flex justify-center items-center mt-2">
          <div
            onClick={(e) => {
              e.preventDefault()
              if (pay) {
                setPayDrawer(true)
              } else if (follow) {
                handleFollowing()
              } else {
                setDrawer(true)
              }
            }}
            className="w-[295px] h-[50px] bg-background-pink  text-white rounded-full text-[15px] flex justify-center items-center"
          >
            {btnText}
          </div>
        </div>
      )}
      {drawer && (
        <SubscribedDrawer
          userId={postInfo.user.id}
          name={postInfo.user.username}
          free={postInfo.user.sub_price === 0}
          flush={flush}
          isOpen={drawer}
          setIsOpen={setDrawer}
          setRechargeModel={setVisible}
        />
      )}
      {payDrawer && (
        <PostPayDrawer
          post_id={postInfo.post.id}
          amount={price}
          flush={flush}
          isOpen={payDrawer}
          setIsOpen={setPayDrawer}
          setRechargeModel={setVisible}
        />
      )}
      <CommonRecharge visible={visible} setVisible={setVisible} recharge={recharge} setRecharge={setRecharge}/>
    </div>
  )
}
