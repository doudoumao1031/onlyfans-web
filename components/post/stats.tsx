import Image from "next/image"

export default function Stats({
  icon,
  value,
  highlight = false
}: {
  icon: string
  value: number
  highlight?: boolean
}) {
  return (
    <div className={`flex gap-1 items-center ${highlight && "text-[#FF8492]"}`}>
      <Image
        src={
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
