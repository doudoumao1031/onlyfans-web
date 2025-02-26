import { getSubscribeSetting, myPosts } from "@/lib"
import PostsCard from "./posts-card"
import { getTranslations } from "next-intl/server"

export default async function Page() {
  const t = await getTranslations("Profile.postCard")
  const subscribeSettings = await getSubscribeSetting()
  const posts = await myPosts({
    title: "",
    page: 1,
    pageSize: 1,
    from_id: 0,
    post_status: 1
  })
  if (!subscribeSettings || !posts) {
    throw new Error()
  }
  const totalPosts = posts.total
  const { items = [], price } = subscribeSettings
  let canPub = false
  if (Number(price) === 0 || (price > 0 && items.length > 0)) {
    canPub = true
  }

  return (
    <div className="px-4">
      {/* 开启订阅之后才能发布 */}
      {
        totalPosts > 0 && canPub && (
          <PostsCard
            link={"/profile/manuscript/draft/edit"}
            description={t("description1")}
            title={t("title1")}
            actionButton={t("button1")}
          />
        )
      }
      {/* 未开启订阅 */}
      {!canPub && (
        <PostsCard
          link={"/profile/order"}
          description={t("description2")}
          title={t("title2")}
          actionButton={t("button2")}
        />
      )}
      {/*已开启订阅，但未发布帖子*/}
      {canPub && totalPosts === 0 && (
        <PostsCard
          link={"/profile/manuscript/draft/edit"}
          description={t("description3")}
          title={t("title3")}
          actionButton={t("button3")}
        />
      )}
    </div>
  )
}