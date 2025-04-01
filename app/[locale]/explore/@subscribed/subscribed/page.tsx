import { getTranslations } from "next-intl/server"

import Empty from "@/components/explore/empty"
import UserCard from "@/components/user/user-card"
import { getSubscribeUsers } from "@/lib"

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
          <div key={info.user.id} className="mx-auto mb-2.5 w-full max-w-lg">
            <UserCard user={info.user} />
          </div>
        ))}
      {!bloggers || (bloggers?.total === 0 && <Empty text={t("SubscribeEmpty")} />)}
    </>
  )
}
