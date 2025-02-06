import IconWithImage from "@/components/profile/icon"
import { userCollectionUsers } from "@/lib"
import { buildImageUrl } from "@/lib/utils"
import Image from "next/image"

export default async function Page() {
  const bloggerData = await userCollectionUsers({ page: 1, pageSize: 10, from_id: 0 })
  if (!bloggerData) {
    throw new Error("error")
  }
  return (
    <>
      <div className="total-num p-4"><span className="text-gray-400">总数：</span>{bloggerData?.total ?? 0}</div>
      <div className="p-4 pt-0 ">
        {bloggerData?.list?.map((v, i) => (
          <div key={i} className={"h-28 pt-1 text-white bg-slate-400  mb-4 bg-cover rounded-lg bg-blend-multiply"} style={{
            backgroundImage: `url(${buildImageUrl(v.photo)})`
          }}
          >
            <div className="text-xs min-h-4  truncate px-2">{v.top_info}</div>
            <div className="pl-4 pr-4 pt-2 flex justify-start">
              <Image src={buildImageUrl(v.photo)} width={112} height={112} alt={"blogger photo"} className={"w-16 h-16 rounded-full mr-4 border-2 border-white"} />
              <div>
                <div className="text-sm">{v.username}</div>
                <div className="text-xs">{v.username}</div>
                <div className="flex justify-start mt-1 text-xs">
                  <div className="bg-black rounded-full bg-opacity-50 p-1 pl-2 pr-2 mr-4 text-xs flex">
                    <IconWithImage
                      url="/icons/profile/icon-photo.png"
                      width={14}
                      height={14}
                    />
                    <span className="ml-1">{v.img_count}</span>
                  </div>
                  <div className="bg-black rounded-full bg-opacity-50 p-1 pl-2 pr-2 mr-4 text-xs flex">
                    <IconWithImage
                      url="/icons/profile/icon-video.png"
                      width={14}
                      height={14}
                    />
                    <span className="ml-1">{v.media_count}</span>
                  </div>
                  <div className="bg-black rounded-full bg-opacity-50 p-1 pl-2 pr-2 ml-2 text-xs">免费/订阅</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!bloggerData?.list?.length && <div className={"text-secondary text-center py-2"}>暂无数据</div>}
      </div>
    </>
  )
}
