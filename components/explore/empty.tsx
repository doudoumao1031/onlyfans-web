import { Link } from "@/i18n/routing"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
export default async function Empty({ text }: { text: string }) {
  const t = await getTranslations("Explore")
  return (
    <div className="flex flex-col justify-center items-center justify-items-center mt-40">
      <Image src="/icons/icon_detail_null@3x.png" alt="follow is null" width={200} height={150} />
      <span className="mt-6 text-gray-500 text-center">
        {text}
        <Link href="/explore/feed">
          <span className="text-text-pink">{t("Feed")}</span>
        </Link>
      </span>
    </div>
  )
}
