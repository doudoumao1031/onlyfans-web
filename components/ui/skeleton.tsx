import { cn } from "@/lib/utils"
import "./skeleton.scss"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-default w-full rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
