"use client"
import useCommonMessage from "@/components/common/common-message"
import SubscribedDrawer from "@/components/explore/subscribed-drawer"
import Post from "@/components/post/post"
import { buildMention } from "@/components/post/utils"
import IconWithImage from "@/components/profile/icon"
import { addPostPayOrder, PostData } from "@/lib"
import { userDelFollowing, userFollowing } from "@/lib/actions/space"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { useState,useMemo } from "react"
import CommonAvatar from "@/components/common/common-avatar"
import { postDetail } from "@/lib/actions/profile"
import PostPayDrawer from "@/components/postInfo/post-pay-drawer"

export default function Page({ postData }: { postData: PostData }) {
  const [data, setData] = useState<PostData>(postData)
  const { showMessage, renderNode } = useCommonMessage()
  const [isFocus, setIsFocus] = useState<boolean>(postData.user?.following as boolean)
  const [drawer, setDrawer] = useState<boolean>(false)
  const [payDrawer, setPayDrawer] = useState<boolean>(false)
  const [pay, setPay] = useState<boolean>(false)
  const [price, setPrice] = useState<number>(0)
  const router = useRouter()

  const [btnText, setBtnText] = useState<string>("")
  useMemo(() => {
    const { sub } = data.user
    const { visibility } = data.post
    data.post_price.some(item => {
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
      setBtnText("订阅后浏览博主的帖子")
    } else if (visibility === 0 && !sub) {
      setBtnText("订阅后解锁更多内容")
    } else {
      setBtnText("")
    }
  }, [data.post, data.post_price, data.user, price])

  const flush = async () => {
    const res = await postDetail(Number(data.post.id))
    const result = res?.data as unknown as PostData
    setData(result)
  }

  const handleFollowing = async () => {
    setIsFocus(!isFocus)
    try {
      const res = isFocus
        ? await userDelFollowing({ follow_id: postData?.user.id as number, following_type: 0 })
        : await userFollowing({ follow_id: postData?.user.id as number, following_type: 0 })
      if (!res || res.code !== 0) return setIsFocus(!isFocus)
      showMessage(!isFocus ? "关注成功" : "取消成功")
    } catch (error) {
      console.log("FETCH_ERROR,", error)
    }
  }

  const handlePay = async () => {
    try {
      const res = await addPostPayOrder({
        post_id: postData.post.id,
        amount: price
      })
      if (res && res.code === 0)  {
        flush()
        showMessage("支付成功", "success")
      } else {
        showMessage("支付失败")
      }
    } catch (error) {
      console.log("FETCH_ERROR,", error)
      showMessage("支付失败")
    }
  }


  const Header = () => {
    const { photo, first_name, last_name, username, sub_end_time } = postData.user
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
            <CommonAvatar photoFileId={photo} size={32}/>
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
            onClick={() => {
              handleFollowing()
            }}
            className={`h-[26px] w-[80px] flex justify-center items-center rounded-full ${
              isFocus
                ? "bg-white border border-main-pink text-main-pink"
                : " bg-main-pink text-white"
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
          {isFocus && (
            <div className="text-[10px] text-main-pink mt-1">
              订阅剩余：{sub_end_time ? dayjs(sub_end_time * 1000 || 0).diff(dayjs(), "days") : 0}天
            </div>
          )}
        </div>
      </div>
    )
  }
  if (!postData) return null


  return (
    <div className="p-4 pt-20">
      {renderNode}
      <Header />
      <Post
        data={postData as unknown as PostData}
        hasSubscribe={false}
        hasVote
        isInfoPage={true}
      />
      {btnText !== "" && (
        <div className="flex justify-center items-center mt-2">
          <div
            onClick={(e) => {
              e.preventDefault()
              if (pay) {
                setPayDrawer(true)
              } else {
                setDrawer(true)
              }
            }}
            className="w-[295px] h-[50px] bg-main-pink  text-white rounded-full text-[15px] flex justify-center items-center"
          >
            {btnText}
          </div>
        </div>
      )}
      {drawer && (
        <SubscribedDrawer
          userId={postData.user.id}
          name={postData.user.username}
          isOpen={drawer}
          setIsOpen={setDrawer}
        />
      )}
      {payDrawer && (
        <PostPayDrawer post_id={postData.post.id} amount={price} isOpen={payDrawer} setIsOpen={setPayDrawer} />
      )}
    </div>
  )
}
