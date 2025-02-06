import { getSubscribeSetting, myPosts } from "@/lib"
import PostsCard from "./posts-card"

export default async function Page() {
  const subscribeSettings = await getSubscribeSetting()
  const posts = await myPosts({
    title: "",
    page: 1,
    pageSize: 1,
    from_id: 0
  })
  if (!subscribeSettings || !posts) {
    throw new Error()
  }
  const totalPosts = posts.total
  const noSettings = (subscribeSettings?.items?.length ?? 0) === 0
  return (
    <div className="px-4">
      {/* 开启订阅之后才能发布 */}
      {
        totalPosts > 0 && !noSettings && (
          <PostsCard
            link={"/profile/manuscript/draft/edit"}
            description={"通过订阅、打赏都可以赚取现金"}
            title={"发布你的帖子"}
            actionButton={"发布帖子"}
          />
        )
      }
      {/* 未开启订阅 */}
      {noSettings && (
        <PostsCard
          link={"/profile/order"}
          description={"成为唯粉博主，启航个人新旅途"}
          title={"开启的唯粉创作之路"}
          actionButton={"开启订阅"}
        />
      )}
      {/*已开启订阅，但未发布帖子*/}
      {!noSettings && totalPosts === 0 && (
        <PostsCard
          link={"/profile/manuscript/draft/edit"}
          description={"分享你的帖子，赚取真金白银"}
          title={"发布你的第一个帖子"}
          actionButton={"立即参与"}
        />
      )}
    </div>
  )
}