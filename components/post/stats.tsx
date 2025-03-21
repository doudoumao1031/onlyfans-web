import Image from "next/image"

export default function Stats({
  icon,
  value,
  highlight = false,
  disable = false
}: {
  icon: string
  value: number
  highlight?: boolean
  disable?: boolean
}) {
  const disAbledUrl = "/theme/" + icon + "_disable@3x.png"
  const hightUrl = "/theme/" + icon + "_highlight@3x.png"
  const normalUrl = "/theme/" + icon + "_normal@3x.png"
  const url = disable ? disAbledUrl : highlight ? hightUrl : normalUrl
  return (
    <div className={`flex items-center gap-1  ${disable && "text-gray-400"}`}>
      <Image
        src={url}
        width={15}
        height={15}
        alt=""
      />
      <span className="text-[14px]">{value}</span>
    </div>
  )
}
