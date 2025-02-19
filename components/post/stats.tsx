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
  return (
    <div className={`flex gap-1 items-center ${highlight && "text-[#FF8492]"} ${disable && "text-gray-400"}`}>
      <Image
        src={
          disable ? "/icons/" + icon + "_disable@3x.png" :
            highlight ? "/icons/" + icon + "_highlight@3x.png" : "/icons/" + icon + "_normal@3x.png"
        }
        width={20}
        height={20}
        alt=""
      />
      <span className="text-xs">{value}</span>
    </div>
  )
}
