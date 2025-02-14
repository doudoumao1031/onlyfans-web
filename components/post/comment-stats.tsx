import Stats from "./stats"

export default function CommentStats({ count, onClick }: { count: number; onClick?: () => void }) {
  return (
    <button onClick={onClick}>
      <Stats icon="icon_fans_comment" value={count} />
    </button>
  )
}
