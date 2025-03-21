import "./like-animation.css"
import Image from "next/image"

export default function Page({ value, highlight = false }: {
  value: number
  highlight?: boolean
}) {
  return (
    <div className="flex items-center">
      <label className={"like-container"}>
        {
          highlight ? <div className="heart heart-hight handle-animation"></div> : (
            <div className="heart-default-bg">
              <Image
                src="/icons/profile/icon_fans_like_normal@3x.png"
                width={15}
                height={15}
                alt=""
              />
            </div>
          )
        }
      </label>
      <span className="text-[14px]">{value}</span>
    </div>
  )
}