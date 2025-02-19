import Link from "next/link"
import Image from "next/image"

export default function Page() {
  return (
    <div className="px-4 pb-8">
      <div className="mt-5 ">
        <div className="grid grid-cols-3 gap-y-4 text-[#222]">
          <Link href={"/profile/order"} className="flex justify-center flex-col items-center gap-2">
            <div>
              <Image
                src="/icons/profile/icon-subscription-management.png"
                alt="subscription-management"
                width={50}
                height={50}
              />
            </div>
            <div>订阅管理</div>
          </Link>
          <Link
            href={"/profile/manuscript"}
            className="flex justify-center flex-col items-center gap-2"
          >
            <div>
              <Image
                src="/icons/profile/icon-manuscript-management.png"
                alt="icon-manuscript-management"
                width={50}
                height={50}
              />
            </div>
            <div>稿件管理</div>
          </Link>
          <Link
            href={"/profile/fans/manage/subscribe"}
            className="flex justify-center flex-col items-center gap-2"
          >
            <div>
              <Image
                src="/icons/profile/icon-fan-management.png"
                alt="icon-fan-management"
                width={50}
                height={50}
              />
            </div>
            <div>粉丝管理</div>
          </Link>
          <Link
            href={"/profile/income/incomeView"}
            className="flex justify-center flex-col items-center gap-2"
          >
            <div>
              <Image
                src="/icons/profile/icon-revenue-center.png"
                alt="icon-revenue-center"
                width={50}
                height={50}
              />
            </div>
            <div>收益中心</div>
          </Link>
          <Link
            href={"/profile/dataCenter/dataView"}
            className="flex justify-center flex-col items-center gap-2"
          >
            <div>
              <Image
                src="/icons/profile/icon-data-analysis.png"
                alt="icon-data-analysis"
                width={50}
                height={50}
              />
            </div>
            <div>数据分析</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
