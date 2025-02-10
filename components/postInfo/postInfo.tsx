import { postDetail } from "@/lib/actions/profile"
import PostInfoItem from "./postInfo-item"
import { PostData } from "@/lib"

export default async function PostInfo({ id }: { id: string }) {
  const res = await postDetail(Number(id))
  const result = res?.data as unknown as PostData
  return <PostInfoItem postData={result}></PostInfoItem>
}
