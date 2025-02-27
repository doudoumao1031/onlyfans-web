import UserCard from "@/components/user/user-card"
import { getSubscribeUsers } from "@/lib"
import Empty from "@/components/explore/empty"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function Page() {
  const bloggers = await getSubscribeUsers({ from_id: 0, page: 1, pageSize: 10 })
  const t = await getTranslations("Explore")
  return (
    /** 已订阅 */
    <>
      {bloggers &&
        bloggers?.total > 0 &&
        bloggers?.list.map((info) => (
          <div key={info.user.id} className="w-full mb-[10px]">
            <UserCard user={info.user} subscribe={false} />
          </div>
        ))}
      {!bloggers || (bloggers?.total === 0 && <Empty text={t("SubscribeEmpty")} />)}
    </>
  )
}
