import { Skeleton } from "../ui/skeleton"

export default function Page() {
  return (
    <div>
      <Skeleton className="h-[30px] w-[200px]" />
      <Skeleton className="mt-4 h-[40px] w-full" />
      <Skeleton className="mt-4 h-[40px] w-full" />
      <Skeleton className="mt-4 h-[40px] w-full" />
    </div>
  )
}
