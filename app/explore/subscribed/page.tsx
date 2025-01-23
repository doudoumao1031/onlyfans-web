import Image from "next/image"
import Link from "next/link"
import UserCard from "@/components/user/user-card"
import { getSubscribeUsers } from "@/lib"

export default async function Page() {
  const bloggers = await getSubscribeUsers({ from_id: 0, page: 1, pageSize: 10 })
  return (
  /** 已订阅 */
    <>
      {bloggers && bloggers?.total > 0 && bloggers?.list.map((info) => (
        <div key={info.user.id} className="w-full mb-[10px]">
          <UserCard user={info.user} subscribe={false}/>
        </div>
      ))}
      {!bloggers || bloggers?.total === 0 && (

        <div className="flex flex-col justify-center items-center justify-items-center mt-40">
          <Image src="/icons/icon_detail_null@3x.png" alt="subscribed is null"
            width={200}
            height={150}
          />
          <span className="mt-6 text-gray-500 text-center">您尚未订阅任何博主，快去看看
            <Link href="/explore/feed">
              <span className="text-main-pink">精彩贴文</span>
            </Link>
            吧</span>
        </div>
      )
      }
    </>
  )
}