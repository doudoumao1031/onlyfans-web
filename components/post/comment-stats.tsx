import Stats from "./stats"

export default function CommentStats({ count }: { count: number }) {
  return (
    <button onClick={() => {}}>
      <Stats icon="icon_fans_comment" value={count} />
    </button>
  )
}
