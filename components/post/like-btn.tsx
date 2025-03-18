import "./like-animation.css"
export default function Page({ value, highlight = false }: {
  value: number
  highlight?: boolean
}) {
  return (
    <div className="flex items-center">
      <label className="like-container">
        <div className={`heart ${highlight && "heart-hight handle-animation"} `}></div>
      </label>
      <span className={`text-xs ${highlight && "text-[--theme]"}`}>{value}</span>
    </div>
  )
}