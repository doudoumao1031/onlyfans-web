import Post from "@/components/post/post"
import IconWithImage from "@/components/profile/icon"
import { PostData } from "@/lib"
import { useRouter } from "next/router"
const Header = () => {
  return (
    <div className="flex items-center">
      <IconWithImage
        url="/icons/profile/icon_nav_back@3x.png"
        width={22}
        height={22}
        color={"#222"}
      />
      <div className="flex-1">1</div>
      <div className="focus">2</div>
    </div>
  )
}
export default function PostInfo() {
  const router = useRouter()
  const { data } = router.query
  const item: PostData = data ? JSON.parse(data as string) : null
  return (
    <div>
      <Header />
      <Post data={item} hasSubscribe={false} hasVote={false} />
    </div>
  )
}
