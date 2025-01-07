import Image from "next/image"
import Link from "next/link"
export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center justify-items-center mt-40">
      <Image src="/icons/icon_detail_null@3x.png" alt="follow is null"
        width={200}
        height={150}
      />
      <span className="mt-6 text-gray-500 text-center">您尚未关注任何博主，快去看看
        <Link href="/explore/feed">
          <span className="text-main-pink">精彩贴文</span>
        </Link>
        吧</span>
    </div>
  )
}