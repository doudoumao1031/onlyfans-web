"use client"
import { useState, useMemo, useEffect } from "react"

import dayjs from "dayjs"
import { useTranslations } from "next-intl"

import Link from "next/link"
import { useRouter } from "next/navigation"


import CommonAvatar from "@/components/common/common-avatar"
import { useCommonMessageContext } from "@/components/common/common-message"
import SubscribedDrawer from "@/components/explore/subscribed-drawer"
import CommonRecharge from "@/components/post/common-recharge"
import Post from "@/components/post/post"
import { buildMention } from "@/components/post/utils"
import PostPayDrawer from "@/components/postInfo/post-pay-drawer"
import IconWithImage from "@/components/profile/icon"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { addSubOrder, PostData } from "@/lib"
import { postDetail } from "@/lib/actions/profile"
import { userDelFollowing, userFollowing } from "@/lib/actions/space"
import { ActionTypes, useGlobal } from "@/lib/contexts/global-context"


export default function Page({ postData }: { postData: PostData }) {
  const t = useTranslations("PostInfo")
  const [postInfo, setPostInfo] = useState<PostData>(postData)
  const { sid, addToActionQueue } = useGlobal()
  const { showMessage } = useCommonMessageContext()
  const [isFocus, setIsFocus] = useState<boolean>(postInfo.user?.following as boolean)
  const [drawer, setDrawer] = useState<boolean>(false)
  const [payDrawer, setPayDrawer] = useState<boolean>(false)
  const [pay, setPay] = useState<boolean>(false)  // 是否付费
  const [follow, setFollow] = useState<boolean>(false)  // 是否关注
  const [freeSub, setFreeSub] = useState<boolean>(false)  // 是否免费订阅
  const [price, setPrice] = useState<number>(0)  // 价格
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
    // 需要付费观看
    if (visibility === 2 && price > 0) {
      setPay(true)
      setBtnText(t("btnText1", { price: price || 0, currency: "USDT" }))
    } else if (visibility === 1 && !sub) {
      // 订阅观看
      setPay(false)
      setFreeSub(false)
      setBtnText(t("btnText2"))
    } else if (visibility === 0) {
      if (sub_price > 0 && !following) {
        setFollow(true)
        setBtnText(t("btnText3"))
      } else if (!sub) {
        if (sub_price === 0) {
          setFreeSub(true)
          setBtnText(t("btnText5"))
        } else {
          setPay(false)
          setFreeSub(false)
          setBtnText(t("btnText4"))
        }
      }
    } else {
      setPay(false)
      setFreeSub(false)
      setBtnText("")
    }
  }, [postInfo.post, postInfo.post_price, postInfo.user, price, sid, t])

  /** 刷新当前页数据 */
  const refresh = async () => {
    const res = await postDetail(Number(postInfo.post.id))
    const result = res?.data as unknown as PostData
    setPostInfo(result)
    addToActionQueue({
      type: ActionTypes.EXPLORE.REFRESH
    })
  }
  useEffect(() => {
    refresh()
  }, [])

  const { withLoading } = useLoadingHandler({
    onError: (error) => {
      console.error("follow error:", error)
      showMessage(t("operationFailed"))
    }
  })
  // 关注
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
      await refresh()
      showMessage(!isFocus ? t("followSuccess") : t("unfollowed"))
    })
  }

  // 免费订阅
  const handleSubscribe = async () => {
    await withLoading(async () => {
      const data = {
        user_id: postInfo.user.id,
        price: 0,
        id: 0
      }
      await addSubOrder(data).then(async (result) => {
        if (result && result.code === 0) {
          console.log("订阅成功")
          await refresh()
          showMessage(t("subscribeSuccess"))
        } else {
          console.log("订阅失败:", result?.message)
          showMessage(t("subscribeFailed"))
        }
      })
    })
  }

  const Header = () => {
    const { photo, first_name, last_name, username, sub_end_time, id, sub } = postInfo.user
    return (
      <div className="fixed left-0 top-0 z-[45] flex h-[76px] w-full items-center bg-white p-4">
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
          <div className="flex flex-1 items-center pl-4">
            <div className="size-8">
              <CommonAvatar photoFileId={photo} size={32} />
            </div>
            <div className="ml-2">
              <div className="max-w-[130px] truncate text-[14px]">
                {first_name} {last_name}
              </div>
              <div className="text-[12px] text-black/50">{buildMention(username)}</div>
            </div>
          </div>
        </Link>
        {sid !== id && (
          <div className="focus flex flex-col items-end">
            <div
              onClick={async () => {
                await handleFollowing()
              }}
              className={`flex h-[26px] min-w-[80px] items-center justify-center rounded-full px-2 ${isFocus
                ? "border-border-theme text-text-theme border bg-white"
                : " bg-background-theme text-white"
                }`}
            >
              <IconWithImage
                url={`/icons/${isFocus ? "icon_info_followed_white@3x.png" : "icon_info_follow_white@3x.png"
                  }`}
                width={20}
                height={20}
                color={isFocus ? "#00AEF3" : "#fff"}
              />
              <span className="ml-1">{isFocus ? t("fllowed") : t("fllow")}</span>
            </div>
            {sub && (
              <div className="text-text-theme mt-1 text-[10px]">
                {t("subscribeRemaining", {
                  x: sub_end_time ? dayjs(sub_end_time * 1000 || 0).diff(dayjs(), "days") : 0
                })}
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
      <Header />
      <Post
        data={postInfo as unknown as PostData}
        hasSubscribe={false}
        hasVote
        isInfoPage={true}
        followConfirm={handleFollowing}
      />
      {btnText !== "" && (
        <div className="mt-2 flex items-center justify-center">
          <button
            type={"button"}
            onClick={async () => {
              if (pay) {
                setPayDrawer(true)
              } else if (follow) {
                await handleFollowing()
              } else if (freeSub) {
                await handleSubscribe()
              } else {
                setDrawer(true)
              }
            }}
            className="bg-background-theme flex h-[50px]  w-[295px] items-center justify-center rounded-full text-[15px] text-white"
          >
            {btnText}
          </button>
        </div>
      )}
      {drawer && (
        <SubscribedDrawer
          userId={postInfo.user.id}
          name={`${postInfo.user.first_name} ${postInfo.user.last_name}`}
          free={postInfo.user.sub_price === 0}
          flush={refresh}
          isOpen={drawer}
          setIsOpen={setDrawer}
          setRechargeModel={setVisible}
        />
      )}
      {payDrawer && (
        <PostPayDrawer
          post_id={postInfo.post.id}
          amount={price}
          flush={refresh}
          isOpen={payDrawer}
          setIsOpen={setPayDrawer}
          setRechargeModel={setVisible}
        />
      )}
      <CommonRecharge
        visible={visible}
        setVisible={setVisible}
        recharge={recharge}
        setRecharge={setRecharge}
      />
    </div>
  )
}
