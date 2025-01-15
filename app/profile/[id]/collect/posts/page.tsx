import { userCollectionPosts } from "@/lib"
import Image from "next/image"
import { buildImageFileUrl } from "@/lib/utils"


export default async function Page() {
  const postsData = await userCollectionPosts({ page: 1, pageSize: 10, from_id: 0 })
  return (
    <>
      <div className="total-num p-4"><span className="text-gray-400">总数：</span>{postsData?.total ?? 0}</div>
      <div className="p-4">
        {postsData?.list.map((v, i) => (
          <div key={i} className={"h-28   mb-4 flex"}>
            <Image src={buildImageFileUrl(v.post_attachment?.[0]?.file_id)} width={112} height={112} alt={"post image"} className={"h-28 w-28 bg-cover mr-2 shrink-0 rounded-md border border-slate-600"} />
            <div className="flex flex-col justify-between flex-1">
              <div className="">{v.post.title}</div>
              <div className="flex items-center">
                <Image src={buildImageFileUrl(v.user.photo)} className={"w-6 h-6 rounded-full mr-2 bg-cover "} width={24} height={24} alt={"user avatar"}/>
                <span className="text-main-pink text-xs">{v.user.username}</span>
              </div>
            </div>
          </div>
        ))}
        {!postsData?.list?.length && <div className={"text-secondary text-center py-2"}>暂无数据</div>}
      </div>
    </>
  )
}