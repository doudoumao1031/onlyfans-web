import Link from "next/link"
import Image from "next/image"
export default function Empty({ text }: {text: string}) {
  return (
    <div className="flex flex-col justify-center items-center justify-items-center mt-40">
      <Image src="/icons/icon_detail_null@3x.png" alt="follow is null"
        width={200}
        height={150}
      />
      <span className="mt-6 text-gray-500 text-center">{text}
        <Link href="/explore/feed">
          <span className="text-main-pink">精彩贴文</span>
        </Link>
        吧</span>
    </div>
  )
}