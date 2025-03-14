import Stats from "./stats"

export default function CommentStats({ count, disable, onClick  }: { count: number, disable: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick}>
      <Stats icon="icon_fans_comment" value={count} disable={disable}/>
    </button>
  )
}
