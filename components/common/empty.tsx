import Image from "next/image"

export default function Empty({
  width = 200,
  height = 150,
  top = 160,
  text
}: {
  width?: number
  height?: number
  top?: number
  text?: string
}) {
  const mtTop = `mt-[${top}px]`
  return (
    <div className={`flex flex-col items-center justify-center ${mtTop}`}>
      <Image src="/icons/profile/icon_detail_null.png" alt="" width={width} height={height} />
      <span className="mt-6 text-[#777]">{text || "什么都没有"}</span>
    </div>
  )
}
