import { Skeleton } from "../ui/skeleton"

export default function Page() {
  return (
    <div>
      <Skeleton className="w-[200px] h-[30px]" />
      <Skeleton className="w-full h-[40px] mt-4" />
      <Skeleton className="w-full h-[40px] mt-4" />
      <Skeleton className="w-full h-[40px] mt-4" />
    </div>
  )
}
