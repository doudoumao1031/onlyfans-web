// 稿件
import Image from "next/image"
import IconWithImage from "@/components/profile/icon"
import Link from "next/link"
import { clsx } from "clsx"
import { PostData, postPined } from "@/lib"
import { useCommonMessageContext } from "@/components/common/common-message"

const ShowNumberWithIcon = ({ icon, number }: { icon: string, number: number }) => {
  return (
    <section className="flex justify-center flex-col items-center flex-1">
      <IconWithImage url={icon} height={12} width={12} color={"#222"}/>
      <div className="text-[#222]">{number}</div>
    </section>
  )
}

const ManuscriptActions = ({ id ,postStatus,refresh }:{id:number ,postStatus: number , refresh?: () => void}) => {

  const { showMessage } = useCommonMessageContext()
  const handlePined = () => {
    postPined(id).then((data) => {
      if (data?.code === 0) {
        showMessage("置顶成功","",{
          afterDuration: () => {
            refresh?.()
          }
        })
      }
    })
  }
  return (
    <section className="flex">
      <button className="flex-1 flex gap-2 pt-2.5 pb-2.5">
        <IconWithImage url={"/icons/profile/icon_fans_share@3x.png"} width={20} height={20} color={"#222"}/>
        <span>分享</span>
      </button>
      <button onTouchEnd={handlePined} className="flex-1 flex gap-2 pt-2.5 pb-2.5">
        <IconWithImage url={"/icons/profile/icon_fans_stick_gray@3x.png"} width={20} height={20} color={"#222"}/>
        <span>置顶</span>
      </button>
      <Link href={`/profile/dataCenter/feeds?id=${id}`} className="flex-1 flex gap-2 pt-2.5 pb-2.5">
        <IconWithImage url={"/icons/profile/icon_fans_data_gray@3x.png"} width={20} height={20} color={"#222"}/>
        <span>数据</span>
      </Link>
      {[0,3].includes(postStatus) ? (
        <Link href={`/profile/manuscript/draft/edit?id=${id}`} className="flex-1 flex gap-2 pt-2.5 pb-2.5 text-main-pink">
          <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={"#FF8492"}/>
          <span>编辑</span>
        </Link>
      ) : (
        <button type={"button"} className="flex-1 flex gap-2 pt-2.5 pb-2.5 text-gray-300">
          <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={"#6b7280"}/>
          <span>编辑</span>
        </button>
      )}
    </section>
  )
}

const ManuscriptItemState = ({ state }: { state: number }) => {
  if (state !== 2) return null
  return (
    <span className={clsx(
      "leading-[15px] text-xs rounded-br rounded-tl px-1.5 text-white absolute left-0 top-0 bg-[#58bf8e]",
    )}
    >审核中</span>
  )
}
export default function ManuscriptItem({ data, refresh }: { data: PostData, refresh?: () => void }) {
  return (
    <section className="border-b border-gray-100 pt-4">
      <button className={"flex gap-2.5 text-left h-[100px] relative w-full"}>
        {/*<ManuscriptItemState state={"REJECT"}/>*/}
        <ManuscriptItemState state={data.post.post_status}/>
        <Image src={"/demo/user_bg.png"} alt={""} width={100} height={100}
          className={"shrink-0 w-[100px] h-full rounded"}
        />
        <section className={"flex-1 h-full flex flex-col justify-between "}>
          <h3 className="line-clamp-[2]">{data.post.title}</h3>
          <section className={"flex-1 flex items-center text-[#bbb]"}>2022-02-02 12:12:12</section>
          <section className="flex gap-4 text-xs justify-around">
            <ShowNumberWithIcon number={data.post_metric?.thumbs_up_count ?? 0}
              icon={"/icons/profile/icon_fans_like_normal@3x.png"}
            />
            <ShowNumberWithIcon number={data.post_metric?.comment_count ?? 0}
              icon={"/icons/profile/icon_fans_comment_normal@3x.png"}
            />
            <ShowNumberWithIcon number={data.post_metric?.play_count ?? 0}
              icon={"/icons/profile/icon_fans_reward_normal@3x.png"}
            />
            <ShowNumberWithIcon number={data.post_metric?.share_count ?? 0}
              icon={"/icons/profile/icon_fans_share_normal@3x.png"}
            />
            <ShowNumberWithIcon number={data.post_metric?.collection_count ?? 0}
              icon={"/icons/profile/icon_fans_collect_normal@3x.png"}
            />
            <ShowNumberWithIcon number={data.post_metric?.tip_count ?? 0}
              icon={"/icons/profile/icon_fans_money_s_gray@3x.png"}
            />
          </section>
        </section>
      </button>
      <ManuscriptActions id={data.post.id} postStatus={data.post.post_status} refresh={refresh}/>
    </section>
  )
}